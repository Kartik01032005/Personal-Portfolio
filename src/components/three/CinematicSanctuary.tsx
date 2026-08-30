"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface CinematicSanctuaryProps {
  scrollProgress: number; // 0 to 5
  activeChapter: number;
  onLoaded?: () => void;
}

export function CinematicSanctuary({
  scrollProgress,
  activeChapter,
  onLoaded,
}: CinematicSanctuaryProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // References to keep across re-renders
  const stateRef = useRef<{
    renderer: THREE.WebGLRenderer | null;
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    post: any;
    world: Record<string, any>;
    word: Record<string, any>;
    rig: {
      prog: number;
      smooth: number;
      mx: number;
      my: number;
      tmx: number;
      tmy: number;
      intro: number;
      focus: number;
      focusAmt: number;
    };
    curveP: THREE.CatmullRomCurve3 | null;
    curveT: THREE.CatmullRomCurve3 | null;
    tmpCam: THREE.PerspectiveCamera | null;
    clock: number;
    tPrev: number;
    running: boolean;
    rafId: number;
    perf: { scale: number; acc: number; n: number; locked: boolean };
    wisp: {
      mesh: THREE.Points | null;
      list: any[];
      i: number;
      acc: number;
      ex: number;
      ey: number;
      lx: number;
      ly: number;
      idle: number;
      seen: boolean;
    };
  }>({
    renderer: null,
    scene: null,
    camera: null,
    post: { levels: [] },
    world: {},
    word: { glyphs: [], group: null, ink: null, reveal: 0, rise: 0 },
    rig: {
      prog: 0,
      smooth: 0,
      mx: 0,
      my: 0,
      tmx: 0,
      tmy: 0,
      intro: 0,
      focus: -1,
      focusAmt: 0,
    },
    curveP: null,
    curveT: null,
    tmpCam: null,
    clock: 0,
    tPrev: 0,
    running: false,
    rafId: 0,
    perf: { scale: 1, acc: 0, n: 0, locked: false },
    wisp: {
      mesh: null,
      list: [],
      i: 0,
      acc: 0,
      ex: 0,
      ey: 0,
      lx: 0,
      ly: 0,
      idle: 0,
      seen: false,
    },
  });

  // Sync scroll progress into stateRef
  useEffect(() => {
    stateRef.current.rig.prog = scrollProgress;
  }, [scrollProgress]);

  // Sync active chapter focus into stateRef
  useEffect(() => {
    stateRef.current.rig.focus = activeChapter;
  }, [activeChapter]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let destroyed = false;
    const S = stateRef.current;

    /* ------------------------------------------------------------ 0 · helpers */
    const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
    const sat = (v: number) => clamp(v, 0, 1);
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const smooth = (e0: number, e1: number, x: number) => {
      const t = sat((x - e0) / (e1 - e0));
      return t * t * (3 - 2 * t);
    };
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const TAU = Math.PI * 2;
    const damp = (cur: number, to: number, rate: number, dt: number) =>
      lerp(cur, to, 1 - Math.exp(-rate * dt));

    function mulberry32(a: number) {
      return function () {
        a |= 0;
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }

    function noise2D(seed: number) {
      const rnd = mulberry32(seed),
        p = new Uint8Array(256),
        perm = new Uint8Array(512);
      for (let i = 0; i < 256; i++) p[i] = i;
      for (let i = 255; i > 0; i--) {
        const j = (rnd() * (i + 1)) | 0,
          t = p[i];
        p[i] = p[j];
        p[j] = t;
      }
      for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
      const G = [
        [1, 1],
        [-1, 1],
        [1, -1],
        [-1, -1],
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ];
      const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
      return function (x: number, y: number) {
        const xi = Math.floor(x),
          yi = Math.floor(y);
        const X = xi & 255,
          Y = yi & 255,
          xf = x - xi,
          yf = y - yi;
        const u = fade(xf),
          v = fade(yf);
        const g = (h: number, dx: number, dy: number) => {
          const q = G[h & 7];
          return q[0] * dx + q[1] * dy;
        };
        const aa = perm[perm[X] + Y],
          ab = perm[perm[X] + Y + 1];
        const ba = perm[perm[X + 1] + Y],
          bb = perm[perm[X + 1] + Y + 1];
        return lerp(
          lerp(g(aa, xf, yf), g(ba, xf - 1, yf), u),
          lerp(g(ab, xf, yf - 1), g(bb, xf - 1, yf - 1), u),
          v
        );
      };
    }

    function fbm(n: any, x: number, y: number, oct: number, lac: number, gain: number) {
      let a = 0.5,
        f = 1,
        s = 0,
        m = 0;
      for (let i = 0; i < (oct || 4); i++) {
        s += a * n(x * f, y * f);
        m += a;
        a *= gain || 0.5;
        f *= lac || 2;
      }
      return s / m;
    }

    function cvs(w: number, h: number) {
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      return c;
    }

    const hex = (r: number, g: number, b: number) =>
      "rgb(" + (r | 0) + "," + (g | 0) + "," + (b | 0) + ")";

    function fbmCanvas(
      W: number,
      H: number,
      seed: number,
      octaves: number,
      baseCells: number,
      contrast: number
    ) {
      const out = cvs(W, H),
        o = out.getContext("2d")!;
      o.fillStyle = "#808080";
      o.fillRect(0, 0, W, H);
      let cells = baseCells || 3,
        alpha = 1;
      for (let i = 0; i < (octaves || 5); i++) {
        const n = cvs(cells, cells),
          nx = n.getContext("2d")!;
        const im = nx.createImageData(cells, cells),
          d = im.data,
          r = mulberry32(seed + i * 977);
        for (let k = 0; k < cells * cells; k++) {
          const v = 128 + (r() - 0.5) * 255 * (contrast || 1);
          d[k * 4] = d[k * 4 + 1] = d[k * 4 + 2] = clamp(v, 0, 255);
          d[k * 4 + 3] = 255;
        }
        nx.putImageData(im, 0, 0);
        o.globalAlpha = alpha;
        o.globalCompositeOperation = i === 0 ? "source-over" : "overlay";
        o.imageSmoothingEnabled = true;
        o.imageSmoothingQuality = "high";
        o.drawImage(n, 0, 0, W, H);
        cells *= 2;
        alpha *= 0.62;
      }
      o.globalAlpha = 1;
      o.globalCompositeOperation = "source-over";
      return out;
    }

    function normalFromHeight(hc: HTMLCanvasElement, strength: number) {
      const W = hc.width,
        H = hc.height;
      const b = cvs(W, H),
        bx = b.getContext("2d")!;
      bx.filter = "blur(1.1px)";
      bx.drawImage(hc, 0, 0);
      bx.filter = "none";
      const src = bx.getImageData(0, 0, W, H).data;
      const out = cvs(W, H),
        ox = out.getContext("2d")!;
      const im = ox.createImageData(W, H),
        d = im.data;
      const at = (x: number, y: number) =>
        src[(((y + H) % H) * W + ((x + W) % W)) * 4] / 255;
      const s = strength || 2.4;
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const gx = (at(x + 1, y) - at(x - 1, y)) * s;
          const gy = (at(x, y + 1) - at(x, y - 1)) * s;
          let nx = -gx,
            ny = gy,
            nz = 1;
          const il = 1 / Math.hypot(nx, ny, nz);
          const i = (y * W + x) * 4;
          d[i] = (nx * il * 0.5 + 0.5) * 255;
          d[i + 1] = (ny * il * 0.5 + 0.5) * 255;
          d[i + 2] = (nz * il * 0.5 + 0.5) * 255;
          d[i + 3] = 255;
        }
      }
      ox.putImageData(im, 0, 0);
      return out;
    }

    /* ------------------------------------------------------- 1 · textures */
    function texWall() {
      const W = 1024,
        H = 1024;
      const c = cvs(W, H),
        x = c.getContext("2d")!;
      x.fillStyle = "#10161a";
      x.fillRect(0, 0, W, H);
      x.globalCompositeOperation = "overlay";
      x.globalAlpha = 0.82;
      x.drawImage(fbmCanvas(W, H, 41, 6, 3, 1), 0, 0);
      x.globalAlpha = 1;
      x.globalCompositeOperation = "source-over";

      const rnd = mulberry32(7);
      for (let i = 1; i < 6; i++) {
        const y = (H / 6) * i;
        x.fillStyle = "rgba(0,0,0,.45)";
        x.fillRect(0, y - 1.5, W, 3);
        x.fillStyle = "rgba(190,205,205,.05)";
        x.fillRect(0, y + 2, W, 2);
      }
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 4; j++) {
          const cx2 = (W / 4) * (j + 0.5) + (rnd() - 0.5) * 14,
            cy = (H / 6) * (i + 0.5);
          const g = x.createRadialGradient(cx2, cy, 1, cx2, cy, 11);
          g.addColorStop(0, "rgba(0,0,0,.5)");
          g.addColorStop(0.7, "rgba(0,0,0,.18)");
          g.addColorStop(1, "rgba(0,0,0,0)");
          x.fillStyle = g;
          x.beginPath();
          x.arc(cx2, cy, 11, 0, TAU);
          x.fill();
        }
      }
      for (let i = 0; i < 190; i++) {
        const sx = rnd() * W,
          w = 0.6 + rnd() * 3.4,
          top = rnd() * H * 0.5,
          len = H * (0.4 + rnd() * 0.7);
        const g = x.createLinearGradient(0, top, 0, top + len);
        const dark = rnd() > 0.45;
        g.addColorStop(0, "rgba(0,0,0,0)");
        g.addColorStop(0.25, dark ? "rgba(0,0,0,.20)" : "rgba(170,195,200,.045)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        x.fillStyle = g;
        x.fillRect(sx, top, w, len);
      }
      x.globalAlpha = 0.16;
      x.globalCompositeOperation = "overlay";
      x.drawImage(fbmCanvas(512, 512, 91, 3, 128, 1.4), 0, 0, W, H);
      x.globalAlpha = 1;
      x.globalCompositeOperation = "source-over";

      const h = cvs(W, H),
        hx = h.getContext("2d")!;
      hx.fillStyle = "#808080";
      hx.fillRect(0, 0, W, H);
      hx.globalAlpha = 0.5;
      hx.drawImage(fbmCanvas(W, H, 41, 5, 6, 1), 0, 0);
      hx.globalAlpha = 1;
      for (let i = 1; i < 6; i++) {
        hx.fillStyle = "#2a2a2a";
        hx.fillRect(0, (H / 6) * i - 2, W, 4);
      }
      return { map: c, normal: normalFromHeight(h, 2.0) };
    }

    function texFloor() {
      const W = 1024,
        H = 1024;
      const c = cvs(W, H),
        x = c.getContext("2d")!;
      const rnd = mulberry32(23);
      x.fillStyle = "#0a0f12";
      x.fillRect(0, 0, W, H);
      const N = 4,
        S_sz = W / N;
      for (let j = 0; j < N; j++) {
        for (let i = 0; i < N; i++) {
          const t = 0.82 + rnd() * 0.36;
          x.fillStyle = hex(12 * t, 17 * t, 20 * t);
          x.fillRect(i * S_sz + 1.5, j * S_sz + 1.5, S_sz - 3, S_sz - 3);
        }
      }
      x.globalCompositeOperation = "overlay";
      x.globalAlpha = 0.55;
      x.drawImage(fbmCanvas(W, H, 63, 6, 4, 1), 0, 0);
      x.globalAlpha = 1;
      x.globalCompositeOperation = "source-over";
      x.strokeStyle = "rgba(0,0,0,.72)";
      x.lineWidth = 3;
      for (let i = 0; i <= N; i++) {
        x.beginPath();
        x.moveTo(i * S_sz, 0);
        x.lineTo(i * S_sz, H);
        x.stroke();
        x.beginPath();
        x.moveTo(0, i * S_sz);
        x.lineTo(W, i * S_sz);
        x.stroke();
      }

      const h = cvs(W, H),
        hx = h.getContext("2d")!;
      hx.fillStyle = "#8c8c8c";
      hx.fillRect(0, 0, W, H);
      hx.globalAlpha = 0.35;
      hx.drawImage(fbmCanvas(W, H, 63, 5, 8, 1), 0, 0);
      hx.globalAlpha = 1;
      hx.strokeStyle = "#303030";
      hx.lineWidth = 5;
      for (let i = 0; i <= N; i++) {
        hx.beginPath();
        hx.moveTo(i * S_sz, 0);
        hx.lineTo(i * S_sz, H);
        hx.stroke();
        hx.beginPath();
        hx.moveTo(0, i * S_sz);
        hx.lineTo(W, i * S_sz);
        hx.stroke();
      }

      const r = cvs(512, 512),
        rx = r.getContext("2d")!;
      rx.fillStyle = "#1c1c1c";
      rx.fillRect(0, 0, 512, 512);
      rx.globalAlpha = 0.95;
      rx.globalCompositeOperation = "lighten";
      rx.drawImage(fbmCanvas(512, 512, 77, 4, 3, 1.5), 0, 0);
      rx.globalAlpha = 1;
      rx.globalCompositeOperation = "source-over";
      return { map: c, normal: normalFromHeight(h, 1.5), rough: r };
    }

    function texWood(seed: number, opt?: any) {
      const o = opt || {},
        W = 512,
        H = 512;
      const c = cvs(W, H),
        x = c.getContext("2d")!;
      const h = cvs(W, H),
        hx = h.getContext("2d")!;
      const r = cvs(W, H),
        rx = r.getContext("2d")!;
      const rnd = mulberry32(seed || 3);
      const base = o.base || [30, 23, 19];
      x.fillStyle = hex(base[0], base[1], base[2]);
      x.fillRect(0, 0, W, H);
      hx.fillStyle = "#808080";
      hx.fillRect(0, 0, W, H);
      rx.fillStyle = o.rough || "#d6d6d6";
      rx.fillRect(0, 0, W, H);

      const nb = o.boards === undefined ? 7 : o.boards;
      const cuts = [0];
      if (nb > 0) {
        const ws: number[] = [];
        let sum = 0;
        for (let i = 0; i < nb; i++) {
          const v = 0.7 + rnd() * 0.6;
          ws.push(v);
          sum += v;
        }
        let acc = 0;
        ws.forEach((v) => {
          acc += (v / sum) * W;
          cuts.push(acc);
        });
      } else cuts.push(W);

      const stroke = (pts: number[][], ctx: CanvasRenderingContext2D, style: string, w: number) => {
        if (pts.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
        ctx.strokeStyle = style;
        ctx.lineWidth = w;
        ctx.lineCap = "round";
        ctx.stroke();
      };

      for (let b = 0; b < cuts.length - 1; b++) {
        const x0 = cuts[b],
          x1 = cuts[b + 1],
          bw = x1 - x0;
        const tone = 0.8 + rnd() * 0.44;
        const pith = x0 + bw * (rnd() * 2.8 - 0.9);
        const d0 = bw * (0.12 + rnd() * 1.7);
        const amp = bw * (0.1 + rnd() * 0.4);
        const per = 1 + ((rnd() * 2) | 0),
          ph = rnd() * TAU;
        const dAt = (y: number) => d0 + Math.sin((y / H) * TAU * per + ph) * amp;
        const gap = 2.4 + rnd() * 5.0;

        [x, hx, rx].forEach((d) => {
          d.save();
          d.beginPath();
          d.rect(x0, 0, bw, H);
          d.clip();
        });
        x.fillStyle = hex(base[0] * tone, base[1] * tone, base[2] * tone);
        x.fillRect(x0, 0, bw, H);

        for (let k = 1; k * gap < bw * 3.4 + d0 + amp; k++) {
          const rr = k * gap * (0.88 + rnd() * 0.24);
          const dark = 0.42 + rnd() * 0.38,
            wide = 0.8 + rnd() * 1.9;
          for (const side of [-1, 1]) {
            let pts: number[][] = [];
            const flush = () => {
              stroke(pts, x, "rgba(0,0,0," + dark.toFixed(2) + ")", wide);
              stroke(pts, hx, "rgba(0,0,0," + (dark * 0.8).toFixed(2) + ")", wide);
              stroke(
                pts.map((q) => [q[0] + side * (wide + 0.6), q[1]]),
                x,
                "rgba(150,120,96," + (dark * 0.3).toFixed(2) + ")",
                wide * 0.7
              );
              pts = [];
            };
            for (let y = -3; y <= H + 3; y += 3) {
              const d = dAt(y),
                q = rr * rr - d * d;
              if (q <= 0) {
                flush();
                continue;
              }
              pts.push([pith + side * Math.sqrt(q), y]);
            }
            flush();
          }
        }
        [x, hx, rx].forEach((d) => d.restore());
      }
      return { map: c, normal: normalFromHeight(h, o.relief || 2.4), rough: r };
    }

    function texStone(seed: number, opt?: any) {
      const o = opt || {},
        W = 512,
        H = 512;
      const c = cvs(W, H),
        x = c.getContext("2d")!;
      const h = cvs(W, H),
        hx = h.getContext("2d")!;
      const r = cvs(W, H),
        rx = r.getContext("2d")!;
      const rnd = mulberry32(seed || 17);
      const base = o.base || [46, 51, 53];
      x.fillStyle = hex(base[0], base[1], base[2]);
      x.fillRect(0, 0, W, H);
      hx.fillStyle = "#808080";
      hx.fillRect(0, 0, W, H);
      rx.fillStyle = "#e8e8e8";
      rx.fillRect(0, 0, W, H);

      const speck = (n: number, fill: (r: any) => string, smin: number, smax: number) => {
        for (let i = 0; i < n; i++) {
          const s = smin + rnd() * (smax - smin),
            px = rnd() * W,
            py = rnd() * H;
          x.fillStyle = fill(rnd);
          x.beginPath();
          x.ellipse(px, py, s, s * (0.55 + rnd() * 0.85), rnd() * TAU, 0, TAU);
          x.fill();
        }
      };
      speck(3400, (q) => "rgba(206,210,204," + (0.06 + q() * 0.2) + ")", 0.6, 2.8);
      speck(2000, (q) => "rgba(126,136,134," + (0.07 + q() * 0.2) + ")", 0.8, 3.4);
      speck(1300, (q) => "rgba(8,10,12," + (0.14 + q() * 0.38) + ")", 0.5, 2.4);

      return { map: c, normal: normalFromHeight(h, o.relief || 3.2), rough: r };
    }

    function texLacquer() {
      const W = 512,
        H = 512;
      const wood = texWood(131, { base: [34, 22, 17], boards: 0 });
      const c = cvs(W, H),
        x = c.getContext("2d")!;
      const h = cvs(W, H),
        hx = h.getContext("2d")!;
      const r = cvs(W, H),
        rx = r.getContext("2d")!;
      x.drawImage(wood.map, 0, 0);
      hx.fillStyle = "#808080";
      hx.fillRect(0, 0, W, H);
      rx.fillStyle = "#8c8c8c";

      x.globalAlpha = 0.8;
      x.fillStyle = "#7c1610";
      x.fillRect(0, 0, W, H);
      x.globalAlpha = 1;
      x.globalCompositeOperation = "multiply";
      x.globalAlpha = 0.42;
      x.drawImage(wood.map, 0, 0);
      x.globalAlpha = 1;
      x.globalCompositeOperation = "source-over";

      return { map: c, normal: normalFromHeight(h, 2.2), rough: r };
    }

    function texShoji() {
      const W = 1024,
        H = 768,
        c = cvs(W, H),
        x = c.getContext("2d")!;
      x.clearRect(0, 0, W, H);
      x.fillStyle = "rgba(228,222,206,.055)";
      x.fillRect(0, 0, W, H);
      x.strokeStyle = "rgba(10,8,7,.88)";
      const cols = 12,
        rows = 9;
      x.lineWidth = 5;
      for (let i = 1; i < cols; i++) {
        x.beginPath();
        x.moveTo((W / cols) * i, 0);
        x.lineTo((W / cols) * i, H);
        x.stroke();
      }
      for (let j = 1; j < rows; j++) {
        x.beginPath();
        x.moveTo(0, (H / rows) * j);
        x.lineTo(W, (H / rows) * j);
        x.stroke();
      }
      x.lineWidth = 13;
      x.strokeStyle = "rgba(8,6,5,.95)";
      x.strokeRect(0, 0, W, H);
      return c;
    }

    function texLeaf() {
      const S_sz = 128,
        c = cvs(S_sz, S_sz),
        x = c.getContext("2d")!;
      x.translate(S_sz / 2, S_sz * 0.92);
      x.scale(S_sz / 2.2, -S_sz / 2.2);
      x.beginPath();
      const lobes = 5,
        spread = 1.9;
      for (let i = 0; i < lobes; i++) {
        const a = -spread / 2 + spread * (i / (lobes - 1)) + Math.PI / 2;
        const len = i === 2 ? 0.96 : i === 1 || i === 3 ? 0.82 : 0.6;
        const wob = 0.17;
        x.moveTo(0, 0.02);
        x.lineTo(Math.cos(a - wob) * len * 0.55, Math.sin(a - wob) * len * 0.55);
        x.lineTo(Math.cos(a) * len, Math.sin(a) * len);
        x.lineTo(Math.cos(a + wob) * len * 0.55, Math.sin(a + wob) * len * 0.55);
        x.closePath();
      }
      x.fillStyle = "#fff";
      x.fill();
      return c;
    }

    function texSky() {
      const W = 512,
        H = 512,
        c = cvs(W, H),
        x = c.getContext("2d")!;
      const g = x.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "rgb(6,10,15)");
      g.addColorStop(0.34, "rgb(13,22,31)");
      g.addColorStop(0.66, "rgb(17,26,34)");
      g.addColorStop(0.88, "rgb(24,35,42)");
      g.addColorStop(1, "rgb(14,22,28)");
      x.fillStyle = g;
      x.fillRect(0, 0, W, H);
      const rnd = mulberry32(881);
      for (let i = 0; i < 420; i++) {
        const sx = rnd() * W,
          sy = rnd() * H * 0.78,
          r = 0.5 + rnd() * rnd() * 1.7;
        x.fillStyle = "rgba(214,232,240," + (0.12 + rnd() * 0.42) * (1 - sy / H) + ")";
        x.beginPath();
        x.arc(sx, sy, r, 0, TAU);
        x.fill();
      }
      return c;
    }

    function texRidge() {
      const W = 2048,
        H = 512,
        c = cvs(W, H),
        x = c.getContext("2d")!;
      const n = noise2D(1207),
        rnd = mulberry32(1207);
      x.beginPath();
      x.moveTo(0, H);
      for (let i = 0; i <= W; i += 4) {
        const t = i / W;
        const ridge =
          0.46 +
          0.3 * (fbm(n, t * 2.4, 0.5, 4, 2.1, 0.55) * 0.5 + 0.5) +
          0.16 * (fbm(n, t * 7.5, 3.1, 3, 2.2, 0.5) * 0.5 + 0.5);
        x.lineTo(i, H - ridge * H * 0.84);
      }
      x.lineTo(W, H);
      x.closePath();
      x.fillStyle = "#050809";
      x.fill();
      return c;
    }

    function texRoof() {
      const W = 512,
        H = 512,
        c = cvs(W, H),
        x = c.getContext("2d")!;
      const h = cvs(W, H),
        hx = h.getContext("2d")!;
      x.fillStyle = "#151c20";
      x.fillRect(0, 0, W, H);
      hx.fillStyle = "#606060";
      hx.fillRect(0, 0, W, H);
      const ribs = 14,
        s = W / ribs;
      for (let i = 0; i < ribs; i++) {
        const g = x.createLinearGradient(i * s, 0, (i + 1) * s, 0);
        g.addColorStop(0, "rgba(0,0,0,.62)");
        g.addColorStop(0.3, "rgba(148,178,192,.13)");
        g.addColorStop(0.66, "rgba(84,110,124,.05)");
        g.addColorStop(1, "rgba(0,0,0,.62)");
        x.fillStyle = g;
        x.fillRect(i * s, 0, s, H);
      }
      return { map: c, normal: normalFromHeight(h, 2.2) };
    }

    function texMoon() {
      const S_sz = 512,
        c = cvs(S_sz, S_sz),
        x = c.getContext("2d")!;
      const R = S_sz / 2 - 1;
      x.beginPath();
      x.arc(S_sz / 2, S_sz / 2, R, 0, TAU);
      x.closePath();
      x.save();
      x.clip();
      const g = x.createRadialGradient(S_sz * 0.46, S_sz * 0.44, S_sz * 0.05, S_sz / 2, S_sz / 2, R);
      g.addColorStop(0, "rgb(150,150,150)");
      g.addColorStop(0.55, "rgb(158,158,158)");
      g.addColorStop(0.86, "rgb(178,178,178)");
      g.addColorStop(1, "rgb(196,196,196)");
      x.fillStyle = g;
      x.fillRect(0, 0, S_sz, S_sz);
      x.restore();
      return c;
    }

    function texGlow(inner?: string, mid?: string) {
      const S_sz = 256,
        c = cvs(S_sz, S_sz),
        x = c.getContext("2d")!;
      const g = x.createRadialGradient(S_sz / 2, S_sz / 2, 0, S_sz / 2, S_sz / 2, S_sz / 2);
      g.addColorStop(0, inner || "rgba(255,255,255,1)");
      g.addColorStop(0.28, mid || "rgba(255,255,255,.36)");
      g.addColorStop(0.62, "rgba(255,255,255,.07)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      x.fillStyle = g;
      x.fillRect(0, 0, S_sz, S_sz);
      return c;
    }

    function texWisp() {
      const S_sz = 128,
        c = cvs(S_sz, S_sz),
        x = c.getContext("2d")!;
      const g = x.createRadialGradient(S_sz / 2, S_sz / 2, 0, S_sz / 2, S_sz / 2, S_sz / 2);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.07, "rgba(236,250,250,.92)");
      g.addColorStop(0.16, "rgba(190,230,238,.40)");
      g.addColorStop(0.34, "rgba(132,192,212,.13)");
      g.addColorStop(0.62, "rgba(88,146,172,.035)");
      g.addColorStop(1, "rgba(70,120,142,0)");
      x.fillStyle = g;
      x.fillRect(0, 0, S_sz, S_sz);
      return c;
    }

    /* ------------------------------------------------------------ 2 · GL Init */
    const vpW = () => document.documentElement.clientWidth || window.innerWidth;
    const vpH = () => document.documentElement.clientHeight || window.innerHeight;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      });
    } catch (e) {
      setHasWebGL(false);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
    renderer.setSize(vpW(), vpH(), true);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x05070a, 1);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050a0e, 0.0168);
    scene.background = new THREE.Color(0x060a0d);

    const camera = new THREE.PerspectiveCamera(36, vpW() / vpH(), 0.35, 220);
    scene.add(camera);

    S.renderer = renderer;
    S.scene = scene;
    S.camera = camera;
    S.world.uT = { value: 0 };

    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    function tx(canvasEl: HTMLCanvasElement, o?: any) {
      const opt = o || {};
      const t = new THREE.CanvasTexture(canvasEl);
      t.wrapS = t.wrapT = opt.wrap || THREE.ClampToEdgeWrapping;
      if (opt.repeat) t.repeat.set(opt.repeat[0], opt.repeat[1]);
      t.anisotropy = Math.min(opt.aniso || 8, maxAniso);
      t.needsUpdate = true;
      return t;
    }
    const hdr = (r: number, g: number, b: number) => new THREE.Color().setRGB(r, g, b);

    /* ------------------------------------------------------- 3 · World Build */
    const PODIUM = 7.0;
    const STEPS = 40;
    const STAIR_Z0 = -11.0;
    const STAIR_RUN = 0.55;
    const STAIR_W = 8.4;
    const TEMPLE_Z = -44;

    // Sky & Ridge
    const sky = new THREE.Mesh(
      new THREE.PlaneGeometry(360, 190),
      new THREE.MeshBasicMaterial({
        color: hdr(0.6, 0.7, 0.8),
        map: tx(texSky()),
        depthWrite: false,
        fog: false,
      })
    );
    sky.position.set(0, 62, -108);
    scene.add(sky);

    const ridgeMap = tx(texRidge(), { wrap: THREE.RepeatWrapping, repeat: [1.7, 1] });
    [
      [-90, 13, 300, 26, 0],
      [-63, 9.5, 210, 19, 16],
    ].forEach((r, i) => {
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(r[2], r[3]),
        new THREE.MeshBasicMaterial({
          map: i ? tx(texRidge()) : ridgeMap,
          transparent: true,
          color: i ? 0x0a1015 : 0x06090d,
          depthWrite: false,
          fog: false,
        })
      );
      m.position.set(r[4], r[1], r[0]);
      scene.add(m);
    });

    // Floor & Steps
    const fT = texFloor();
    const floorMat = new THREE.MeshStandardMaterial({
      map: tx(fT.map, { wrap: THREE.RepeatWrapping, repeat: [7, 7], aniso: 16 }),
      normalMap: tx(fT.normal, { wrap: THREE.RepeatWrapping, repeat: [7, 7] }),
      roughnessMap: tx(fT.rough, { wrap: THREE.RepeatWrapping, repeat: [3.4, 3.4] }),
      roughness: 0.74,
      metalness: 0.06,
      color: 0x69757a,
    });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(150, 150), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, -18);
    floor.receiveShadow = true;
    scene.add(floor);

    // Temple geometry
    const timberMat = new THREE.MeshStandardMaterial({
      map: tx(texWood(3, { boards: 7 }).map, { wrap: THREE.RepeatWrapping, repeat: [4, 1.6] }),
      roughness: 0.8,
      metalness: 0.05,
      color: 0x565150,
    });
    const postMat = new THREE.MeshStandardMaterial({
      map: tx(texWood(29, { boards: 0 }).map, { wrap: THREE.RepeatWrapping, repeat: [1.1, 1.0] }),
      roughness: 0.7,
      metalness: 0.03,
      color: 0x8a746d,
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0x8f6f2e,
      roughness: 0.38,
      metalness: 0.78,
    });
    const rf = texRoof();
    const tileMat = new THREE.MeshStandardMaterial({
      map: tx(rf.map, { wrap: THREE.RepeatWrapping, repeat: [1, 1] }),
      normalMap: tx(rf.normal, { wrap: THREE.RepeatWrapping, repeat: [1, 1] }),
      roughness: 0.74,
      metalness: 0.1,
      color: 0x2b343a,
    });

    const paperMat = new THREE.MeshBasicMaterial({
      color: hdr(1.06, 0.48, 0.18),
      fog: true,
    });
    const gridMat = new THREE.MeshBasicMaterial({
      map: tx(texShoji()),
      transparent: true,
      depthWrite: false,
      fog: true,
    });

    // Torii Gate
    const lacMat = new THREE.MeshStandardMaterial({
      map: tx(texLacquer().map, { wrap: THREE.RepeatWrapping, repeat: [2, 2] }),
      color: hdr(1.72, 1.02, 0.94),
      roughness: 0.92,
      metalness: 0.05,
    });
    const toriiGroup = new THREE.Group();
    const TORII_BASE = 0.78,
      TORII_H = 8.2,
      TORII_SPAN = 3.55;
    [-1, 1].forEach((s) => {
      const col = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.38, TORII_H, 26),
        lacMat
      );
      col.position.set(s * TORII_SPAN, TORII_BASE + TORII_H / 2, 0);
      col.castShadow = true;
      toriiGroup.add(col);
    });
    const nuki = new THREE.Mesh(new THREE.BoxGeometry(9.4, 0.52, 0.46), lacMat);
    nuki.position.set(0, TORII_BASE + TORII_H - 2.15, 0);
    nuki.castShadow = true;
    toriiGroup.add(nuki);

    const GS = 0.72;
    toriiGroup.position.set(0, -TORII_BASE * GS, -8.6);
    toriiGroup.scale.setScalar(GS);
    scene.add(toriiGroup);

    // Moon
    const MOON = { x: 17.9, y: 31.9, z: -72, r: 8.6 };
    const moonDisc = new THREE.Mesh(
      new THREE.PlaneGeometry(MOON.r * 2, MOON.r * 2),
      new THREE.MeshBasicMaterial({
        map: tx(texMoon()),
        color: hdr(3.6, 0.64, 0.61),
        transparent: true,
        depthWrite: false,
        fog: false,
      })
    );
    moonDisc.position.set(MOON.x, MOON.y, MOON.z);
    scene.add(moonDisc);
    S.world.moon = moonDisc;

    const moonHalo = new THREE.Mesh(
      new THREE.PlaneGeometry(MOON.r * 6.4, MOON.r * 6.4),
      new THREE.MeshBasicMaterial({
        map: tx(texGlow("rgba(255,124,112,.90)", "rgba(206,52,48,.26)")),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: false,
        opacity: 0.44,
      })
    );
    moonHalo.position.set(MOON.x, MOON.y, MOON.z - 0.3);
    scene.add(moonHalo);
    S.world.moonHalo = moonHalo;

    // Lights
    scene.add(new THREE.HemisphereLight(0x53838f, 0x060a08, 0.13));
    const keyLight = new THREE.DirectionalLight(0xb6dbe4, 1.22);
    keyLight.position.set(2.6, 21, 2.5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const hallLight = new THREE.PointLight(0xff8a26, 2.3, 15, 2);
    hallLight.position.set(0, PODIUM + 1.2, TEMPLE_Z + 8.6);
    scene.add(hallLight);
    S.world.hallLight = hallLight;

    // Lanterns
    const lanternMat = new THREE.MeshStandardMaterial({
      map: tx(texStone(17).map, { wrap: THREE.RepeatWrapping, repeat: [1.5, 1.5] }),
      color: 0x9aa5a5,
      roughness: 0.8,
    });
    const lanternPositions = [
      [7.4, -7.0],
      [-7.6, -5.2],
      [5.5, -14.4],
      [-5.5, -14.4],
      [5.2, -23.5],
      [-5.2, -23.5],
    ];
    S.world.lanternLights = [];
    lanternPositions.forEach(([lx, lz]) => {
      const g = new THREE.Group();
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.52, 0.26, 16), lanternMat);
      base.position.y = 0.13;
      g.add(base);
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.18, 1.02, 12), lanternMat);
      pole.position.y = 0.77;
      g.add(pole);
      const lamp = new THREE.PointLight(0xff5a24, 2.6, 9, 2);
      lamp.position.y = 1.66;
      g.add(lamp);
      S.world.lanternLights.push(lamp);

      const flare = new THREE.Mesh(
        new THREE.PlaneGeometry(3.4, 3.4),
        new THREE.MeshBasicMaterial({
          map: tx(texGlow("rgba(255,120,60,.9)", "rgba(255,60,24,.28)")),
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          opacity: 0.5,
        })
      );
      flare.position.y = 1.66;
      g.add(flare);

      g.position.set(lx, 0, lz);
      scene.add(g);
    });

    // Embers
    const N_EMBERS = 260;
    const embPos = new Float32Array(N_EMBERS * 3);
    const embSeed = new Float32Array(N_EMBERS);
    const rndEmb = mulberry32(66);
    for (let i = 0; i < N_EMBERS; i++) {
      embPos[i * 3] = (rndEmb() - 0.5) * 30;
      embPos[i * 3 + 1] = rndEmb() * 11;
      embPos[i * 3 + 2] = -26 + rndEmb() * 36;
      embSeed[i] = rndEmb();
    }
    const embGeo = new THREE.BufferGeometry();
    embGeo.setAttribute("position", new THREE.BufferAttribute(embPos, 3));
    embGeo.setAttribute("aSeed", new THREE.BufferAttribute(embSeed, 1));
    const embMat = new THREE.ShaderMaterial({
      uniforms: {
        uT: S.world.uT,
        uTex: { value: tx(texGlow("rgba(255,190,140,1)", "rgba(255,120,60,.35)")) },
        uSize: { value: vpH() * 0.5 },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexShader: `
        attribute float aSeed; uniform float uT; uniform float uSize; varying float vA;
        void main(){
          vec3 p = position;
          p.y = mod(p.y + uT*(0.14+aSeed*0.28), 11.5);
          p.x += sin(uT*0.36 + aSeed*22.0)*0.85;
          p.z += cos(uT*0.29 + aSeed*17.0)*0.7;
          vec4 mv = modelViewMatrix * vec4(p,1.0);
          vA = (0.25+aSeed*0.75) * smoothstep(11.5,7.0,p.y) * smoothstep(0.0,1.4,p.y);
          gl_PointSize = uSize*(0.010+aSeed*0.020)/max(-mv.z,0.6);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        uniform sampler2D uTex; varying float vA;
        void main(){
          vec4 t = texture2D(uTex, gl_PointCoord);
          gl_FragColor = vec4(t.rgb * vec3(1.6, 0.78, 0.42), t.a * vA * 0.75);
        }
      `,
    });
    const embers = new THREE.Points(embGeo, embMat);
    scene.add(embers);

    // Leaves
    const N_LEAVES = 180;
    const leafMat = new THREE.MeshStandardMaterial({
      map: tx(texLeaf()),
      alphaTest: 0.42,
      side: THREE.DoubleSide,
      color: 0x40080a,
      emissive: 0x780200,
      emissiveIntensity: 0.72,
    });
    const leafInst = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.4, 0.4), leafMat, N_LEAVES);
    const leafList: any[] = [];
    const rndLf = mulberry32(404);
    for (let i = 0; i < N_LEAVES; i++) {
      leafList.push({
        x: (rndLf() - 0.5) * 40,
        y: rndLf() * 26,
        z: (rndLf() - 0.5) * 40,
        fall: 0.5 + rndLf() * 0.9,
        sway: 0.45 + rndLf() * 1.5,
        swayPh: rndLf() * TAU,
        swayAmp: 0.3 + rndLf() * 0.95,
        spin: (rndLf() - 0.5) * 2.6,
        roll: rndLf() * TAU,
        rollSp: 0.5 + rndLf() * 2.0,
        tilt: rndLf() * TAU,
        s: 0.55 + rndLf() * 0.9,
      });
    }
    scene.add(leafInst);
    S.world.leaves = { mesh: leafInst, list: leafList };

    /* ------------------------------------------------ 4 · Camera Rig Spline */
    const CAM_WAYPOINTS = [
      { p: [0.0, 4.05, 13.6], t: [0.0, 6.6, -18.0], fov: 36 }, // 0 Intro
      { p: [-5.6, 2.35, 11.6], t: [1.2, 5.6, -14.0], fov: 48 }, // 1 About
      { p: [1.2, 3.6, 2.2], t: [-0.6, 7.5, -22.0], fov: 40 }, // 2 Projects
      { p: [5.2, 2.1, -3.4], t: [-2.6, 7.0, -20.0], fov: 46 }, // 3 Skills
      { p: [0.0, 7.6, -16.0], t: [0.0, 13.0, -40.0], fov: 42 }, // 4 Experience
      { p: [0.0, 10.5, -20.0], t: [0.0, 3.0, -34.0], fov: 46 }, // 5 Contact
    ];

    S.curveP = new THREE.CatmullRomCurve3(
      CAM_WAYPOINTS.map((c) => new THREE.Vector3(c.p[0], c.p[1], c.p[2])),
      false,
      "catmullrom",
      0.42
    );
    S.curveT = new THREE.CatmullRomCurve3(
      CAM_WAYPOINTS.map((c) => new THREE.Vector3(c.t[0], c.t[1], c.t[2])),
      false,
      "catmullrom",
      0.42
    );
    S.tmpCam = new THREE.PerspectiveCamera(CAM_WAYPOINTS[0].fov, vpW() / vpH(), 0.35, 220);

    const _p = new THREE.Vector3(),
      _t = new THREE.Vector3(),
      _d = new THREE.Vector3();

    function applyCamera() {
      const N = CAM_WAYPOINTS.length - 1;
      const u = clamp(S.rig.smooth / N, 0, 1);
      S.curveP!.getPoint(u, _p);
      S.curveT!.getPoint(u, _t);

      const i = clamp(Math.floor(S.rig.smooth), 0, N - 1),
        f = clamp(S.rig.smooth - i, 0, 1);
      let fov = lerp(CAM_WAYPOINTS[i].fov, CAM_WAYPOINTS[i + 1].fov, f);

      // Parallax
      const par = 1 - smooth(0, 1.6, S.rig.smooth) * 0.55;
      _p.x += S.rig.mx * 0.62 * par;
      _p.y += S.rig.my * 0.34 * par;
      _t.x -= S.rig.mx * 0.2 * par;
      _t.y -= S.rig.my * 0.12 * par;

      camera.position.copy(_p);
      camera.lookAt(_t);
      if (Math.abs(camera.fov - fov) > 1e-4) {
        camera.fov = fov;
        camera.updateProjectionMatrix();
      }
    }

    // Pointer move listener
    const onPointerMove = (e: MouseEvent) => {
      S.rig.tmx = (e.clientX / vpW()) * 2 - 1;
      S.rig.tmy = -((e.clientY / vpH()) * 2 - 1);
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    // Resize listener
    const onResize = () => {
      const w = vpW(),
        h = vpH();
      renderer.setSize(w, h, true);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize, { passive: true });

    /* ------------------------------------------------ 5 · Render Loop */
    const LEAF_M = new THREE.Matrix4(),
      LEAF_Q = new THREE.Quaternion(),
      LEAF_E = new THREE.Euler(),
      LEAF_P = new THREE.Vector3(),
      LEAF_S = new THREE.Vector3(),
      LEAF_F = new THREE.Vector3();

    function updateLeaves(dt: number) {
      const LV = S.world.leaves;
      if (!LV) return;
      const cy = camera.position.y,
        L = LV.list;
      camera.getWorldDirection(LEAF_F);
      LEAF_F.y = 0;
      if (LEAF_F.lengthSq() < 1e-6) LEAF_F.set(0, 0, -1);
      else LEAF_F.normalize();

      const fx = camera.position.x + LEAF_F.x * 11;
      const fz = camera.position.z + LEAF_F.z * 11;

      for (let i = 0; i < L.length; i++) {
        const l = L[i];
        l.y -= l.fall * dt;
        l.roll += l.rollSp * dt;
        l.tilt += l.spin * dt;
        if (l.y < cy - 10) {
          l.y = cy + 16;
          const a = Math.random() * TAU,
            r = Math.sqrt(Math.random()) * 12;
          l.x = fx + Math.cos(a) * r;
          l.z = fz + Math.sin(a) * r;
        }
        const sw = Math.sin(S.clock * l.sway + l.swayPh);
        LEAF_P.set(
          l.x + sw * l.swayAmp,
          l.y,
          l.z + Math.cos(S.clock * l.sway * 0.7 + l.swayPh) * l.swayAmp * 0.6
        );
        LEAF_E.set(l.roll, l.tilt, sw * 0.55);
        LEAF_Q.setFromEuler(LEAF_E);
        LEAF_S.setScalar(l.s);
        LEAF_M.compose(LEAF_P, LEAF_Q, LEAF_S);
        LV.mesh.setMatrixAt(i, LEAF_M);
      }
      LV.mesh.instanceMatrix.needsUpdate = true;
    }

    S.running = true;
    S.tPrev = performance.now();

    function renderFrame(now: number) {
      if (destroyed) return;
      const dt = Math.min((now - S.tPrev) / 1000 || 0, 0.05);
      S.tPrev = now;
      S.clock += dt;
      S.world.uT.value = S.clock;

      // Smooth camera progression
      S.rig.smooth = damp(S.rig.smooth, S.rig.prog, 4.8, dt);
      S.rig.mx = damp(S.rig.mx, S.rig.tmx, 2.6, dt);
      S.rig.my = damp(S.rig.my, S.rig.tmy, 2.6, dt);

      // Flickering lanterns
      if (S.world.lanternLights) {
        S.world.lanternLights.forEach((lamp: THREE.PointLight, i: number) => {
          lamp.intensity = 2.6 * (0.86 + 0.22 * Math.sin(S.clock * (2.3 + i * 0.7) + i * 2.1));
        });
      }

      applyCamera();
      updateLeaves(dt);

      renderer.render(scene, camera);
      S.rafId = requestAnimationFrame(renderFrame);
    }

    S.rafId = requestAnimationFrame(renderFrame);
    setIsReady(true);
    if (onLoaded) onLoaded();

    return () => {
      destroyed = true;
      S.running = false;
      cancelAnimationFrame(S.rafId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, [onLoaded]);

  return (
    <div ref={containerRef} className="three-sanctuary-container">
      <canvas
        ref={canvasRef}
        id="gl-canvas"
        className="three-canvas"
        aria-hidden="true"
      />
      {!hasWebGL && (
        <div className="webgl-fallback-sky" aria-hidden="true" />
      )}
    </div>
  );
}

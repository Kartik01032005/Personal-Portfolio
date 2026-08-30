"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface CinematicSanctuaryProps {
  onLoaded?: () => void;
}

export function CinematicSanctuary({ onLoaded }: CinematicSanctuaryProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  // References to keep across re-renders without triggering React updates
  const stateRef = useRef<{
    renderer: THREE.WebGLRenderer | null;
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    world: Record<string, any>;
    rig: {
      prog: number;
      smooth: number;
      mx: number;
      my: number;
      tmx: number;
      tmy: number;
    };
    curveP: THREE.CatmullRomCurve3 | null;
    curveT: THREE.CatmullRomCurve3 | null;
    clock: number;
    tPrev: number;
    running: boolean;
    rafId: number;
  }>({
    renderer: null,
    scene: null,
    camera: null,
    world: {},
    rig: {
      prog: 0,
      smooth: 0,
      mx: 0,
      my: 0,
      tmx: 0,
      tmy: 0,
    },
    curveP: null,
    curveT: null,
    clock: 0,
    tPrev: 0,
    running: false,
    rafId: 0,
  });

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
        [1, 1], [-1, 1], [1, -1], [-1, -1],
        [1, 0], [-1, 0], [0, 1], [0, -1],
      ];
      const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
      return function (x: number, y: number) {
        const xi = Math.floor(x), yi = Math.floor(y);
        const X = xi & 255, Y = yi & 255, xf = x - xi, yf = y - yi;
        const u = fade(xf), v = fade(yf);
        const g = (h: number, dx: number, dy: number) => {
          const q = G[h & 7];
          return q[0] * dx + q[1] * dy;
        };
        const aa = perm[perm[X] + Y], ab = perm[perm[X] + Y + 1];
        const ba = perm[perm[X + 1] + Y], bb = perm[perm[X + 1] + Y + 1];
        return lerp(
          lerp(g(aa, xf, yf), g(ba, xf - 1, yf), u),
          lerp(g(ab, xf, yf - 1), g(bb, xf - 1, yf - 1), u),
          v
        );
      };
    }

    function fbm(n: any, x: number, y: number, oct: number, lac: number, gain: number) {
      let a = 0.5, f = 1, s = 0, m = 0;
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
      W: number, H: number, seed: number, octaves: number, baseCells: number, contrast: number
    ) {
      const out = cvs(W, H), o = out.getContext("2d")!;
      o.fillStyle = "#808080";
      o.fillRect(0, 0, W, H);
      let cells = baseCells || 3, alpha = 1;
      for (let i = 0; i < (octaves || 5); i++) {
        const n = cvs(cells, cells), nx = n.getContext("2d")!;
        const im = nx.createImageData(cells, cells), d = im.data, r = mulberry32(seed + i * 977);
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
      const W = hc.width, H = hc.height;
      const b = cvs(W, H), bx = b.getContext("2d")!;
      bx.filter = "blur(1.1px)";
      bx.drawImage(hc, 0, 0);
      bx.filter = "none";
      const src = bx.getImageData(0, 0, W, H).data;
      const out = cvs(W, H), ox = out.getContext("2d")!;
      const im = ox.createImageData(W, H), d = im.data;
      const at = (x: number, y: number) =>
        src[(((y + H) % H) * W + ((x + W) % W)) * 4] / 255;
      const sv = strength || 2.4;
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const gx = (at(x + 1, y) - at(x - 1, y)) * sv;
          const gy = (at(x, y + 1) - at(x, y - 1)) * sv;
          let nx = -gx, ny = gy, nz = 1;
          const il = 1 / Math.hypot(nx, ny, nz);
          const idx = (y * W + x) * 4;
          d[idx] = (nx * il * 0.5 + 0.5) * 255;
          d[idx + 1] = (ny * il * 0.5 + 0.5) * 255;
          d[idx + 2] = (nz * il * 0.5 + 0.5) * 255;
          d[idx + 3] = 255;
        }
      }
      ox.putImageData(im, 0, 0);
      return out;
    }

    /* ------------------------------------------------------- 1 · textures */
    function texFloor() {
      const W = 512, H = 512;
      const c = cvs(W, H), x = c.getContext("2d")!;
      const rnd = mulberry32(23);
      x.fillStyle = "#0a0f12";
      x.fillRect(0, 0, W, H);
      const N = 4, Ssz = W / N;
      for (let j = 0; j < N; j++) {
        for (let i = 0; i < N; i++) {
          const t = 0.82 + rnd() * 0.36;
          x.fillStyle = hex(12 * t, 17 * t, 20 * t);
          x.fillRect(i * Ssz + 1.5, j * Ssz + 1.5, Ssz - 3, Ssz - 3);
        }
      }
      x.strokeStyle = "rgba(0,0,0,.72)";
      x.lineWidth = 3;
      for (let i = 0; i <= N; i++) {
        x.beginPath(); x.moveTo(i * Ssz, 0); x.lineTo(i * Ssz, H); x.stroke();
        x.beginPath(); x.moveTo(0, i * Ssz); x.lineTo(W, i * Ssz); x.stroke();
      }
      const h = cvs(W, H), hx = h.getContext("2d")!;
      hx.fillStyle = "#8c8c8c";
      hx.fillRect(0, 0, W, H);
      hx.strokeStyle = "#303030";
      hx.lineWidth = 4;
      for (let i = 0; i <= N; i++) {
        hx.beginPath(); hx.moveTo(i * Ssz, 0); hx.lineTo(i * Ssz, H); hx.stroke();
        hx.beginPath(); hx.moveTo(0, i * Ssz); hx.lineTo(W, i * Ssz); hx.stroke();
      }
      return { map: c, normal: normalFromHeight(h, 1.4) };
    }

    function texWood(seed: number, opt?: any) {
      const o = opt || {}, W = 256, H = 256;
      const c = cvs(W, H), x = c.getContext("2d")!;
      const base = o.base || [30, 23, 19];
      x.fillStyle = hex(base[0], base[1], base[2]);
      x.fillRect(0, 0, W, H);
      x.globalCompositeOperation = "overlay";
      x.globalAlpha = 0.35;
      x.drawImage(fbmCanvas(W, H, seed, 3, 4, 1), 0, 0);
      x.globalAlpha = 1;
      x.globalCompositeOperation = "source-over";
      return { map: c };
    }

    function texStone(seed: number) {
      const W = 256, H = 256;
      const c = cvs(W, H), x = c.getContext("2d")!;
      x.fillStyle = "#2e3335";
      x.fillRect(0, 0, W, H);
      x.globalCompositeOperation = "overlay";
      x.globalAlpha = 0.4;
      x.drawImage(fbmCanvas(W, H, seed, 3, 8, 1), 0, 0);
      x.globalAlpha = 1;
      x.globalCompositeOperation = "source-over";
      return { map: c };
    }

    function texShoji() {
      const W = 512, H = 384, c = cvs(W, H), x = c.getContext("2d")!;
      x.fillStyle = "rgba(228,222,206,.06)";
      x.fillRect(0, 0, W, H);
      x.strokeStyle = "rgba(10,8,7,.88)";
      const cols = 8, rows = 6;
      x.lineWidth = 4;
      for (let i = 1; i < cols; i++) {
        x.beginPath(); x.moveTo((W / cols) * i, 0); x.lineTo((W / cols) * i, H); x.stroke();
      }
      for (let j = 1; j < rows; j++) {
        x.beginPath(); x.moveTo(0, (H / rows) * j); x.lineTo(W, (H / rows) * j); x.stroke();
      }
      x.lineWidth = 8;
      x.strokeRect(0, 0, W, H);
      return c;
    }

    function texLeaf() {
      const Ssz = 128, c = cvs(Ssz, Ssz), x = c.getContext("2d")!;
      x.translate(Ssz / 2, Ssz * 0.92);
      x.scale(Ssz / 2.2, -Ssz / 2.2);
      x.beginPath();
      const lobes = 5, spread = 1.9;
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
      const W = 512, H = 512, c = cvs(W, H), x = c.getContext("2d")!;
      const g = x.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "rgb(6,10,15)");
      g.addColorStop(0.34, "rgb(13,22,31)");
      g.addColorStop(0.66, "rgb(17,26,34)");
      g.addColorStop(0.88, "rgb(24,35,42)");
      g.addColorStop(1, "rgb(14,22,28)");
      x.fillStyle = g;
      x.fillRect(0, 0, W, H);
      const rnd = mulberry32(881);
      for (let i = 0; i < 280; i++) {
        const sx = rnd() * W, sy = rnd() * H * 0.78, r = 0.5 + rnd() * rnd() * 1.5;
        x.fillStyle = "rgba(214,232,240," + (0.12 + rnd() * 0.42) * (1 - sy / H) + ")";
        x.beginPath();
        x.arc(sx, sy, r, 0, TAU);
        x.fill();
      }
      return c;
    }

    function texRidge() {
      const W = 1024, H = 256, c = cvs(W, H), x = c.getContext("2d")!;
      const n = noise2D(1207);
      x.beginPath();
      x.moveTo(0, H);
      for (let i = 0; i <= W; i += 4) {
        const t = i / W;
        const ridge = 0.46 + 0.3 * (fbm(n, t * 2.4, 0.5, 3, 2.1, 0.55) * 0.5 + 0.5);
        x.lineTo(i, H - ridge * H * 0.84);
      }
      x.lineTo(W, H);
      x.closePath();
      x.fillStyle = "#050809";
      x.fill();
      return c;
    }

    function texMoon() {
      const Ssz = 256, c = cvs(Ssz, Ssz), x = c.getContext("2d")!;
      const R = Ssz / 2 - 1;
      x.beginPath();
      x.arc(Ssz / 2, Ssz / 2, R, 0, TAU);
      x.closePath();
      x.save();
      x.clip();
      const g = x.createRadialGradient(Ssz * 0.46, Ssz * 0.44, Ssz * 0.05, Ssz / 2, Ssz / 2, R);
      g.addColorStop(0, "rgb(160,160,160)");
      g.addColorStop(0.55, "rgb(170,170,170)");
      g.addColorStop(0.86, "rgb(190,190,190)");
      g.addColorStop(1, "rgb(210,210,210)");
      x.fillStyle = g;
      x.fillRect(0, 0, Ssz, Ssz);
      x.restore();
      return c;
    }

    function texGlow(inner?: string, mid?: string) {
      const Ssz = 128, c = cvs(Ssz, Ssz), x = c.getContext("2d")!;
      const g = x.createRadialGradient(Ssz / 2, Ssz / 2, 0, Ssz / 2, Ssz / 2, Ssz / 2);
      g.addColorStop(0, inner || "rgba(255,255,255,1)");
      g.addColorStop(0.28, mid || "rgba(255,255,255,.36)");
      g.addColorStop(0.62, "rgba(255,255,255,.07)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      x.fillStyle = g;
      x.fillRect(0, 0, Ssz, Ssz);
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
    } catch {
      setHasWebGL(false);
      return;
    }

    const isMobile = window.innerWidth <= 820;
    const DPR_CAP = isMobile ? 1.0 : 1.8;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, DPR_CAP));
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

    function tx(canvasEl: HTMLCanvasElement, o?: any) {
      const opt = o || {};
      const t = new THREE.CanvasTexture(canvasEl);
      t.wrapS = t.wrapT = opt.wrap || THREE.ClampToEdgeWrapping;
      if (opt.repeat) t.repeat.set(opt.repeat[0], opt.repeat[1]);
      t.needsUpdate = true;
      return t;
    }
    const hdr = (r: number, g: number, b: number) => new THREE.Color().setRGB(r, g, b);

    /* ------------------------------------------------------- 3 · World Build */
    const PODIUM = 7.0;
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

    // Floor
    const fT = texFloor();
    const floorMat = new THREE.MeshStandardMaterial({
      map: tx(fT.map, { wrap: THREE.RepeatWrapping, repeat: [7, 7] }),
      normalMap: tx(fT.normal, { wrap: THREE.RepeatWrapping, repeat: [7, 7] }),
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
      map: tx(texWood(3).map, { wrap: THREE.RepeatWrapping, repeat: [4, 1.6] }),
      roughness: 0.8,
      metalness: 0.05,
      color: 0x565150,
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

    // Sanmon Pagoda Hall
    const templeGroup = new THREE.Group();
    const core = new THREE.Mesh(new THREE.BoxGeometry(13.6, 5.0, 8.2), timberMat);
    core.position.set(0, PODIUM + 2.5, TEMPLE_Z);
    core.castShadow = true;
    templeGroup.add(core);

    // Shoji Screen windows
    for (let i = 0; i < 5; i++) {
      const xi = -5.6 + i * 2.8;
      const p = new THREE.Mesh(new THREE.PlaneGeometry(1.55, 2.5), paperMat);
      p.position.set(xi, PODIUM + 2.6, TEMPLE_Z + 4.16);
      templeGroup.add(p);
      const sv = new THREE.Mesh(new THREE.PlaneGeometry(1.55, 2.5), gridMat);
      sv.position.set(xi, PODIUM + 2.6, TEMPLE_Z + 4.2);
      templeGroup.add(sv);
    }
    // Upper storey
    const upperCore = new THREE.Mesh(new THREE.BoxGeometry(10.0, 3.4, 6.0), timberMat);
    upperCore.position.set(0, PODIUM + 9.4, TEMPLE_Z);
    upperCore.castShadow = true;
    templeGroup.add(upperCore);

    // Roofs
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x222a30, roughness: 0.75 });
    const lowerRoof = new THREE.Mesh(new THREE.ConeGeometry(11, 3.5, 4), roofMat);
    lowerRoof.position.set(0, PODIUM + 6.8, TEMPLE_Z);
    lowerRoof.rotation.y = Math.PI / 4;
    lowerRoof.castShadow = true;
    templeGroup.add(lowerRoof);

    const upperRoof = new THREE.Mesh(new THREE.ConeGeometry(8.5, 3.0, 4), roofMat);
    upperRoof.position.set(0, PODIUM + 12.5, TEMPLE_Z);
    upperRoof.rotation.y = Math.PI / 4;
    upperRoof.castShadow = true;
    templeGroup.add(upperRoof);

    scene.add(templeGroup);

    // Torii Gate
    const lacMat = new THREE.MeshStandardMaterial({
      color: hdr(1.72, 1.02, 0.94),
      roughness: 0.92,
      metalness: 0.05,
    });
    const toriiGroup = new THREE.Group();
    const TORII_BASE = 0.78, TORII_H = 8.2, TORII_SPAN = 3.55;
    [-1, 1].forEach((s) => {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.38, TORII_H, 16), lacMat);
      col.position.set(s * TORII_SPAN, TORII_BASE + TORII_H / 2, 0);
      col.castShadow = true;
      toriiGroup.add(col);
    });
    const nuki = new THREE.Mesh(new THREE.BoxGeometry(9.4, 0.52, 0.46), lacMat);
    nuki.position.set(0, TORII_BASE + TORII_H - 2.15, 0);
    nuki.castShadow = true;
    toriiGroup.add(nuki);
    // Kasagi (top beam)
    const kasagi = new THREE.Mesh(new THREE.BoxGeometry(10.6, 0.38, 0.62), lacMat);
    kasagi.position.set(0, TORII_BASE + TORII_H - 0.05, 0);
    toriiGroup.add(kasagi);

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

    // Hall glow halo (warm interior glow visible through shoji)
    const hallHalo = new THREE.Mesh(
      new THREE.PlaneGeometry(16, 10),
      new THREE.MeshBasicMaterial({
        map: tx(texGlow("rgba(255,180,100,.7)", "rgba(255,120,60,.2)")),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: false,
        opacity: 0.30,
      })
    );
    hallHalo.position.set(0, PODIUM + 3, TEMPLE_Z + 5);
    scene.add(hallHalo);
    S.world.hallHalo = hallHalo;

    /* -------------------------------------------------------- Lighting (matching reference) */
    // Hemisphere ambient
    scene.add(new THREE.HemisphereLight(0x53838f, 0x060a08, 0.13));

    // Key directional light with shadow
    const keyLight = new THREE.DirectionalLight(0xb6dbe4, 1.22);
    keyLight.position.set(2.6, 21, 2.5);
    keyLight.target.position.set(0, 2.2, -12.5);
    scene.add(keyLight.target);
    keyLight.castShadow = true;
    const shadowRes = isMobile ? 1024 : 2048;
    keyLight.shadow.mapSize.set(shadowRes, shadowRes);
    const sc = keyLight.shadow.camera;
    sc.left = -26; sc.right = 26; sc.top = 34; sc.bottom = -16; sc.near = 3; sc.far = 78;
    keyLight.shadow.bias = -0.0012;
    keyLight.shadow.normalBias = 0.035;
    keyLight.shadow.radius = 2.2;
    keyLight.shadow.autoUpdate = false;
    scene.add(keyLight);
    S.world.key = keyLight;

    // Moonlight directional (rim light on roofs — without it the hall is a flat cutout)
    const moonKey = new THREE.DirectionalLight(0xff6a42, 0.52);
    moonKey.position.set(26, 30, -60);
    moonKey.target.position.set(0, 8, -40);
    scene.add(moonKey.target);
    scene.add(moonKey);

    // Hall interior lamps
    const hallLight = new THREE.PointLight(0xff8a26, 2.3, 15, 2);
    hallLight.position.set(0, PODIUM + 1.2, TEMPLE_Z + 8.6);
    scene.add(hallLight);
    S.world.hallLight = hallLight;
    // Wing lights flanking the hall
    [-1, 1].forEach((sv) => {
      const w = new THREE.PointLight(0xff8420, 2.2, 11, 2);
      w.position.set(sv * 11.4, PODIUM + 1.2, TEMPLE_Z + 5.6);
      scene.add(w);
    });

    // Moon point light (keeps it attached to the scene instead of floating on top)
    const moonL = new THREE.PointLight(0xff3a1c, 3.0, 46, 2);
    moonL.position.set(11.0, 17.0, -24.0);
    scene.add(moonL);

    // Fill light (cool blue — separates mid-ground from background)
    const fill = new THREE.PointLight(0x86c6d2, 0.95, 30, 2);
    fill.position.set(-1, 13.5, -16.0);
    scene.add(fill);

    // Stair light (the flight is the spine of the composition)
    const stairL = new THREE.PointLight(0xffa049, 4.2, 17, 2);
    stairL.position.set(0, 7.6, -26.0);
    scene.add(stairL);

    // Bake shadow map once after scene is built
    setTimeout(() => {
      if (!destroyed && S.world.key) {
        S.world.key.shadow.needsUpdate = true;
      }
    }, 200);

    // Lanterns
    const lanternMat = new THREE.MeshStandardMaterial({
      map: tx(texStone(17).map),
      color: 0x9aa5a5,
      roughness: 0.8,
    });
    const lanternPositions = [
      [7.4, -7.0], [-7.6, -5.2],
      [5.5, -14.4], [-5.5, -14.4],
      [5.2, -23.5], [-5.2, -23.5],
    ];
    S.world.lanternLights = [];
    S.world.lanternGlows = [] as THREE.Mesh[];
    lanternPositions.forEach(([lx, lz]) => {
      const g = new THREE.Group();
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.52, 0.26, 12), lanternMat);
      base.position.y = 0.13;
      g.add(base);
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.18, 1.02, 10), lanternMat);
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
      S.world.lanternGlows.push(flare);

      g.position.set(lx, 0, lz);
      scene.add(g);
    });

    /* -------------------------------------------------------- Drifting haze slabs (atmosphere) */
    const hazeTex = tx(texGlow("rgba(160,205,210,.55)", "rgba(110,165,175,.18)"));
    S.world.haze = [];
    const hazeRnd = mulberry32(66);
    const hazeCount = isMobile ? 4 : 6;
    for (let i = 0; i < hazeCount; i++) {
      const hs = 12 + hazeRnd() * 15;
      const h = new THREE.Mesh(
        new THREE.PlaneGeometry(hs, hs * 0.55),
        new THREE.MeshBasicMaterial({
          map: hazeTex,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          fog: false,
          opacity: 0.05 + hazeRnd() * 0.07,
        })
      );
      h.position.set(
        (hazeRnd() - 0.5) * 44,
        1.5 + hazeRnd() * 10,
        -38 + hazeRnd() * 40
      );
      h.renderOrder = 4;
      (h as any).userData = {
        sp: 0.06 + hazeRnd() * 0.12,
        ph: hazeRnd() * TAU,
        x0: h.position.x,
      };
      scene.add(h);
      S.world.haze.push(h);
    }

    // Embers
    const N_EMBERS = isMobile ? 220 : 460;
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
    embers.frustumCulled = false;
    embers.renderOrder = 5;
    scene.add(embers);
    S.world.embers = embers;

    // Leaves
    const N_LEAVES = isMobile ? 80 : 170;
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
      { p: [0.0, 4.05, 13.6], t: [0.0, 6.60, -18.0], fov: 36 },   // 0 Intro
      { p: [-5.6, 2.35, 11.6], t: [1.2, 5.60, -14.0], fov: 48 },   // 1 About
      { p: [1.2, 3.60, 2.2], t: [-0.6, 7.50, -22.0], fov: 40 },    // 2 Projects
      { p: [5.2, 2.10, -3.4], t: [-2.6, 7.00, -20.0], fov: 46 },   // 3 Skills
      { p: [0.0, 7.60, -16.0], t: [0.0, 13.0, -40.0], fov: 42 },   // 4 Experience
      { p: [0.0, 10.5, -20.0], t: [0.0, 3.00, -34.0], fov: 46 },   // 5 Contact
    ];

    S.curveP = new THREE.CatmullRomCurve3(
      CAM_WAYPOINTS.map((c) => new THREE.Vector3(c.p[0], c.p[1], c.p[2])),
      false, "catmullrom", 0.42
    );
    S.curveT = new THREE.CatmullRomCurve3(
      CAM_WAYPOINTS.map((c) => new THREE.Vector3(c.t[0], c.t[1], c.t[2])),
      false, "catmullrom", 0.42
    );

    const _p = new THREE.Vector3(),
      _t = new THREE.Vector3(),
      _d = new THREE.Vector3();

    // Aspect fix: on tall screens, step back to keep composition
    function aspectFix() {
      return clamp((1.62 - vpW() / vpH()) / 1.05, 0, 1);
    }
    function fitAspect(p: THREE.Vector3, t: THREE.Vector3, fov: number) {
      const nf = aspectFix();
      if (nf <= 0) return fov;
      _d.subVectors(p, t).normalize();
      p.addScaledVector(_d, nf * 8.2);
      p.y += nf * 1.1;
      return fov * (1 + nf * 0.40);
    }

    function applyCamera() {
      const N = CAM_WAYPOINTS.length - 1;
      const u = clamp(S.rig.smooth / N, 0, 1);
      S.curveP!.getPoint(u, _p);
      S.curveT!.getPoint(u, _t);

      const i = clamp(Math.floor(S.rig.smooth), 0, N - 1),
        f = clamp(S.rig.smooth - i, 0, 1);
      let fov = lerp(CAM_WAYPOINTS[i].fov, CAM_WAYPOINTS[i + 1].fov, f);

      // Aspect-adaptive camera (matches reference fitAspect)
      fov = fitAspect(_p, _t, fov);

      // Parallax — a hand-held drift, never enough to break the frame
      const par = 1 - smooth(0, 1.6, S.rig.smooth) * 0.55;
      _p.x += S.rig.mx * 0.62 * par;
      _p.y += S.rig.my * 0.34 * par;
      _t.x -= S.rig.mx * 0.20 * par;
      _t.y -= S.rig.my * 0.12 * par;

      camera.position.copy(_p);
      camera.lookAt(_t);
      if (Math.abs(camera.fov - fov) > 1e-4) {
        camera.fov = fov;
        camera.updateProjectionMatrix();
      }
    }

    /* ---- Scroll progress calculation (done inside the render loop, reading scrollY directly) */
    /* This avoids event-based jitter. The reference reads scrollY in frame() directly. */
    const SECS_IDS = ["intro", "about", "projects", "skills", "experience", "contact"];
    let anchors: number[] = [];
    let maxScroll = 1;

    function measure() {
      const secs = SECS_IDS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
      maxScroll = Math.max(1, document.documentElement.scrollHeight - vpH());
      if (secs.length === 6) {
        anchors = secs.map((el, i) => {
          if (i === 0) return 0;
          if (i === secs.length - 1) return maxScroll;
          return clamp(el.offsetTop + el.offsetHeight * 0.5 - vpH() * 0.5, 0, maxScroll);
        });
        // Ensure monotonically increasing
        for (let i = 1; i < anchors.length; i++) {
          anchors[i] = Math.max(anchors[i], anchors[i - 1] + 1);
        }
      } else {
        anchors = [0, maxScroll * 0.2, maxScroll * 0.4, maxScroll * 0.6, maxScroll * 0.8, maxScroll];
      }
    }

    function progressFor(y: number) {
      if (anchors.length < 2) return 0;
      if (y <= anchors[0]) return 0;
      for (let i = 0; i < anchors.length - 1; i++) {
        if (y <= anchors[i + 1]) {
          return i + (y - anchors[i]) / (anchors[i + 1] - anchors[i]);
        }
      }
      return anchors.length - 1;
    }

    // Pointer move listener
    const onPointerMove = (e: MouseEvent) => {
      S.rig.tmx = (e.clientX / vpW()) * 2 - 1;
      S.rig.tmy = -((e.clientY / vpH()) * 2 - 1);
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    // Resize listener
    const onResize = () => {
      const w = vpW(), h = vpH();
      renderer.setSize(w, h, true);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      measure();
      if (S.world.key) S.world.key.shadow.needsUpdate = true;
      if (S.world.embers) {
        S.world.embers.material.uniforms.uSize.value = h * renderer.getPixelRatio() * 0.5;
      }
    };
    window.addEventListener("resize", onResize, { passive: true });

    // Initial measure (deferred slightly to allow layout)
    setTimeout(measure, 100);
    setTimeout(measure, 500);

    /* ------------------------------------------------ 5 · Render Loop (SINGLE loop) */
    const LEAF_M = new THREE.Matrix4(),
      LEAF_Q = new THREE.Quaternion(),
      LEAF_E = new THREE.Euler(),
      LEAF_P = new THREE.Vector3(),
      LEAF_S = new THREE.Vector3(),
      LEAF_F = new THREE.Vector3();

    function updateLeaves(dt: number) {
      const LV = S.world.leaves;
      if (!LV) return;
      const cy = camera.position.y, L = LV.list;
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
          const a = Math.random() * TAU, r = Math.sqrt(Math.random()) * 12;
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

    function updateWorld(dt: number) {
      S.world.uT.value = S.clock;

      // Moon halo breathing
      if (S.world.moonHalo) {
        S.world.moonHalo.material.opacity = 0.44 + Math.sin(S.clock * 0.34) * 0.05;
      }

      // Hall halo breathing
      if (S.world.hallHalo) {
        S.world.hallHalo.material.opacity = 0.30 + Math.sin(S.clock * 0.6) * 0.035;
      }

      // Hall light breathing
      if (S.world.hallLight) {
        S.world.hallLight.intensity = 3.4 * (1 + Math.sin(S.clock * 0.43) * 0.045);
      }

      // Flickering lanterns
      if (S.world.lanternLights) {
        const pulse = Math.sin(S.clock * 1.9) * 0.5 + 0.5;
        S.world.lanternLights.forEach((lamp: THREE.PointLight, i: number) => {
          lamp.intensity = 2.6 * (0.86 + 0.22 * Math.sin(S.clock * (2.3 + i * 0.7) + i * 2.1) + 0.1 * pulse);
        });
      }

      // Billboard lantern glows to always face camera
      if (S.world.lanternGlows) {
        S.world.lanternGlows.forEach((g: THREE.Mesh) => {
          g.quaternion.copy(camera.quaternion);
        });
      }

      // Drifting haze
      if (S.world.haze) {
        S.world.haze.forEach((h: THREE.Mesh) => {
          const ud = h.userData as any;
          h.position.x = ud.x0 + Math.sin(S.clock * ud.sp + ud.ph) * 5.5;
          h.quaternion.copy(camera.quaternion);
        });
      }

      updateLeaves(dt);
    }

    S.running = true;
    S.tPrev = performance.now();

    /* The SINGLE render loop. Reads scrollY directly (like the reference).
       No event-based scroll synchronization — the RAF reads the truth each frame. */
    function renderFrame(now: number) {
      if (destroyed) return;
      const raw = (now - S.tPrev) / 1000 || 0;
      const dt = Math.min(raw, 0.05);
      S.tPrev = now;
      S.clock += dt;

      // Read scroll position directly — no events, no custom events, no indirection.
      // This is the single source of truth for camera progress.
      S.rig.prog = progressFor(window.scrollY);

      // Smooth camera interpolation with frame-rate independent damping
      // Rate 5.2 matches the reference exactly
      S.rig.smooth = damp(S.rig.smooth, S.rig.prog, 5.2, dt);
      S.rig.mx = damp(S.rig.mx, S.rig.tmx, 2.6, dt);
      S.rig.my = damp(S.rig.my, S.rig.tmy, 2.6, dt);

      applyCamera();
      updateWorld(dt);

      renderer.render(scene, camera);
      S.rafId = requestAnimationFrame(renderFrame);
    }

    S.rafId = requestAnimationFrame(renderFrame);
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

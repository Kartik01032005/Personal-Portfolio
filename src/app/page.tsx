"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Github,
  Linkedin,
  Mail,
  Menu,
  X,
  FileText,
  Send,
  Sparkles,
  ExternalLink,
  Shield,
  Award,
  BookOpen,
  Compass,
} from "lucide-react";
import {
  navItems,
  chapters,
  certifications,
  verifiedTimeline,
  currentFocus,
  socialLinks,
} from "@/data/portfolio";
import { CinematicSanctuary } from "@/components/three/CinematicSanctuary";
import { ProjectShowcase } from "@/components/portfolio/ProjectShowcase";
import { SkillsGallery } from "@/components/portfolio/SkillsGallery";

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeChapter, setActiveChapter] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [preloaderProgress, setPreloaderProgress] = useState(15);
  const [formState, setFormState] = useState<{
    name: string;
    email: string;
    message: string;
    status: "idle" | "submitting" | "success" | "error";
    errorMsg?: string;
  }>({
    name: "",
    email: "",
    message: "",
    status: "idle",
  });

  // Calculate scroll position across chapters
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;

      const progress = (scrollY / docHeight) * (chapters.length - 1);
      setScrollProgress(progress);

      const currentChapterIdx = Math.min(
        Math.max(0, Math.round(progress)),
        chapters.length - 1
      );
      setActiveChapter(currentChapterIdx);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Preloader progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setPreloaderProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setPreloaderDone(true), 400);
          return 100;
        }
        return prev + Math.floor(Math.random() * 18 + 12);
      });
    }, 120);

    return () => clearInterval(interval);
  }, []);

  const scrollToChapter = (chapterId: string) => {
    const el = document.getElementById(chapterId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;

    setFormState((prev) => ({ ...prev, status: "submitting" }));

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          message: formState.message,
        }),
      });

      if (res.ok) {
        setFormState({
          name: "",
          email: "",
          message: "",
          status: "success",
        });
      } else {
        setFormState((prev) => ({
          ...prev,
          status: "error",
          errorMsg: "Message delivery could not be completed. Please reach out directly via email.",
        }));
      }
    } catch {
      setFormState((prev) => ({
        ...prev,
        status: "error",
        errorMsg: "Network error occurred. Please contact via email.",
      }));
    }
  };

  return (
    <div className="portfolio-experience">
      {/* Three.js Procedural Sanctuary Canvas */}
      <CinematicSanctuary
        scrollProgress={scrollProgress}
        activeChapter={activeChapter}
        onLoaded={() => setPreloaderProgress(100)}
      />

      {/* Atmospheric Overlays */}
      <div id="vignette" aria-hidden="true" />
      <div id="grain" aria-hidden="true" />

      {/* Preloader */}
      <div id="pre" className={preloaderDone ? "done" : ""}>
        <div className="pre-in">
          <div className="pre-mark">
            <svg viewBox="0 0 44 44" fill="none" aria-hidden="true">
              <circle cx="22" cy="24" r="9.5" stroke="#e0231c" stroke-width="1.2" />
              <path d="M6 12h32M9.5 17h25M22 8v28" stroke="#dfe7e0" stroke-width="1.2" />
            </svg>
          </div>
          <div className="pre-jp jp">神域の静寂</div>
          <div className="pre-bar">
            <i id="pre-fill" style={{ right: `${100 - preloaderProgress}%` }} />
          </div>
          <div className="pre-meta">
            <span>Raising the 3D Sanctuary</span>
            <b>
              <span>{Math.min(100, preloaderProgress)}</span>%
            </b>
          </div>
        </div>
      </div>

      {/* Primary Navigation Bar */}
      <header className={`nav ${scrollProgress > 0.1 ? "stuck" : ""} ${menuOpen ? "menu-open" : ""}`} id="nav">
        <a
          className="brand"
          href="#intro"
          onClick={(e) => {
            e.preventDefault();
            scrollToChapter("intro");
          }}
        >
          <svg viewBox="0 0 44 44" fill="none" aria-hidden="true">
            <circle cx="22" cy="25" r="8.6" fill="#e0231c" fillOpacity=".9" />
            <path d="M5 13h34M9 18.4h26M22 8.5v27" stroke="#dfe7e0" strokeWidth="1.5" />
            <path d="M14 35.5h16" stroke="#dfe7e0" strokeWidth="1.2" strokeOpacity=".6" />
          </svg>
          <span className="brand-tx">
            <b>KARTIK</b>
            <i>CS & BUSINESS SYSTEMS</i>
          </span>
        </a>

        <nav className="nav-links" id="navlinks">
          {navItems.map((item, i) => (
            <a
              key={item.href}
              className={`nav-link ${activeChapter === i ? "on" : ""}`}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                scrollToChapter(item.href.replace("#", ""));
              }}
            >
              <span>{item.label}</span>
              <span className="alt">{item.jp}</span>
            </a>
          ))}
        </nav>

        <button
          className={`nav-burger ${menuOpen ? "active" : ""}`}
          aria-label="Toggle Menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <i />
          <i />
        </button>
      </header>

      {/* Main Narrative Page Content */}
      <main className="page" id="top">
        {/* ============================================================ CHAPTER 01: INTRO */}
        <section className="hero" id="intro" data-cam="0">
          <div className="hero-top">
            <div className="eyebrow">
              <span className="dot" /> Chapter 01 — The Threshold
            </div>
            <h1 className="display h-hero">
              <span className="mask-line">
                <span>Where systems</span>
              </span>
              <span className="mask-line">
                <span>reveal the</span>
              </span>
              <span className="mask-line">
                <span>unseen.</span>
              </span>
            </h1>
            <p className="hero-sub body">
              Kartik Nilekani — Computer Science & Business Systems Engineer.
              Engineering practical software, intelligent models, and thoughtful digital architecture.
            </p>
          </div>

          <div className="hero-spacer" />

          {/* Quick-links / Chapter Selector Chips */}
          <div className="hero-foot">
            <div className="hero-cue">
              <span>Scroll to traverse chapters</span>
              <span className="track">
                <i />
              </span>
            </div>
            <div className="chapters" id="chips">
              {chapters.slice(0, 4).map((ch, idx) => (
                <div
                  key={ch.id}
                  className={`chip ${activeChapter === idx ? "on" : ""}`}
                  onClick={() => scrollToChapter(ch.id)}
                >
                  <span className="num">{ch.num}</span>
                  <span className="tx">
                    <b>{ch.title}</b>
                    <p>{ch.desc}</p>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Floating Sanmon Peek Window */}
          <a
            className="peek"
            href="#projects"
            onClick={(e) => {
              e.preventDefault();
              scrollToChapter("projects");
            }}
            aria-label="Preview Selected Projects"
          >
            <span className="peek-fr" />
            <span className="peek-play">
              <svg viewBox="0 0 22 22" fill="none">
                <path d="M8 5.6 16.4 11 8 16.4z" fill="#dfe7e0" />
              </svg>
            </span>
            <span className="peek-cap">
              <b className="jp">実績</b>
              <i>Selected Works — BloodLink & VoxNav</i>
            </span>
          </a>

          <div className="word-fb" aria-hidden="true">
            KARTIK
          </div>

          <div className="hero-side">
            <span className="v jp">工学と知性</span>
          </div>
        </section>

        {/* ============================================================ CHAPTER 02: ABOUT */}
        <section className="sec" id="about" data-cam="1">
          <div className="sec-head">
            <span className="k">
              <b>02</b> — Foundations
            </span>
            <span className="rule" />
            <span className="k jp">概要</span>
          </div>

          <div className="gate-grid">
            <h2 className="display h-sec">
              Signal over spectacle. Useful software built on clear problems.
            </h2>
            <div className="gate-copy">
              <p className="lead">
                I am a Computer Science & Business Systems scholar at Srinivas Institute of Technology,
                passionate about bridging technical rigor with real-world utility. My focus spans full-stack
                development, intelligent system architectures, graph algorithms, and accessible interaction design.
              </p>
              <p className="body">
                Whether architecting real-time emergency healthcare networks like BloodLink, developing hands-free
                speech command layers in VoxNav, or modeling topological pathfinding graphs in PathGrid, I build
                with measured restraint: clean code contracts, robust database schemas, and intuitive interfaces.
              </p>

              <div className="focus-areas-block">
                <h4>Current Research & Engineering Focus</h4>
                <ul className="focus-list">
                  {currentFocus.map((item) => (
                    <li key={item}>
                      <span className="focus-bullet" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                className="arrowlink"
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToChapter("projects");
                }}
              >
                <span>Explore Selected Works</span>
                <span className="ar">
                  <svg viewBox="0 0 14 14" fill="none">
                    <path d="M3 11 11 3M5 3h6v6" stroke="#dfe7e0" strokeWidth="1.3" />
                  </svg>
                </span>
              </a>
            </div>
          </div>

          {/* Key Metrics Band */}
          <div className="gate-stats">
            <div>
              <b>04+</b>
              <span>Years of Code</span>
            </div>
            <div>
              <b>03+</b>
              <span>Core Systems</span>
            </div>
            <div>
              <b>CS&BS</b>
              <span>SIT Scholar</span>
            </div>
            <div>
              <b>∞</b>
              <span>Curiosity</span>
            </div>
          </div>
        </section>

        {/* ============================================================ CHAPTER 03: PROJECTS */}
        <section className="sec" id="projects" data-cam="2">
          <div className="sec-head">
            <span className="k">
              <b>03</b> — Selected Works
            </span>
            <span className="rule" />
            <span className="k jp">実績</span>
          </div>

          <div className="cur-head">
            <h2 className="display h-sec">Engineered platforms with measurable impact.</h2>
            <p className="body-lg">
              Each project represents an end-to-end engineered solution to a concrete problem,
              combining algorithmic efficiency, modular APIs, and intuitive user experiences.
            </p>
          </div>

          {/* Project Showcase with Scissor Viewports and Case Studies */}
          <ProjectShowcase />
        </section>

        {/* ============================================================ CHAPTER 04: SKILLS */}
        <section className="sec" id="skills" data-cam="3">
          <div className="sec-head">
            <span className="k">
              <b>04</b> — Sacred Craft
            </span>
            <span className="rule" />
            <span className="k jp">技術</span>
          </div>

          <div className="cur-head">
            <h2 className="display h-sec">A disciplined technical arsenal.</h2>
            <p className="body-lg">
              Explore my verified stack across programming languages, full-stack frameworks,
              AI toolchains, database engines, and core software engineering disciplines.
            </p>
          </div>

          {/* Interactive Pro Skills Catalog Component */}
          <SkillsGallery />
        </section>

        {/* ============================================================ CHAPTER 05: EXPERIENCE & CERTIFICATIONS */}
        <section className="sec" id="experience" data-cam="4">
          <div className="sec-head">
            <span className="k">
              <b>05</b> — Timeline & Credentials
            </span>
            <span className="rule" />
            <span className="k jp">経歴</span>
          </div>

          <div className="timeline-cert-grid">
            {/* Timeline Column */}
            <div className="timeline-column">
              <h3 className="section-subtitle">
                <Compass size={16} />
                <span>Verified Milestones & Roles</span>
              </h3>
              <div className="timeline-list">
                {verifiedTimeline.map((item, i) => (
                  <div key={i} className="timeline-card">
                    <div className="timeline-card__top">
                      <span className="timeline-date">{item.date}</span>
                      {item.badge && <span className="timeline-badge">{item.badge}</span>}
                    </div>
                    <h4 className="timeline-title">{item.title}</h4>
                    <p className="timeline-org">{item.org}</p>
                    <p className="timeline-desc">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications Column */}
            <div className="cert-column">
              <h3 className="section-subtitle">
                <Award size={16} />
                <span>Formal Certifications & Credentials</span>
              </h3>
              <div className="cert-list">
                {certifications.map((cert, i) => (
                  <a
                    key={i}
                    href={cert.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cert-card"
                  >
                    <div className="cert-card__header">
                      <span className="cert-cat">{cert.category}</span>
                      <span className="cert-year">{cert.year}</span>
                    </div>
                    <h4 className="cert-title">{cert.name}</h4>
                    <p className="cert-issuer">{cert.issuer}</p>
                    <p className="cert-detail">{cert.detail}</p>
                    <div className="cert-card__footer">
                      <span className="cert-view-text">View Certificate PDF</span>
                      <ArrowUpRight size={14} className="cert-arrow" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ CHAPTER 06: CONTACT */}
        <section className="sec fin" id="contact" data-cam="5">
          <div className="eyebrow">Chapter 06 — Afterlight</div>
          <h2 className="display">Let&rsquo;s Build Something Resilient.</h2>
          <p className="body-lg">
            Whether you have an interesting software engineering opportunity, an open-source collaboration,
            or an intelligent systems project, my inbox is always open.
          </p>

          {/* Direct Social Links */}
          <div className="contact-links-row">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="social-pill-btn"
              >
                {link.label === "GitHub" && <Github size={15} />}
                {link.label === "LinkedIn" && <Linkedin size={15} />}
                {link.label === "Email" && <Mail size={15} />}
                <span>{link.label}</span>
                <ArrowUpRight size={13} />
              </a>
            ))}
            <a
              href="/resume/Kartik-Manjunath-Nilekani-Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="social-pill-btn social-pill-btn--highlight"
            >
              <FileText size={15} />
              <span>Resume PDF</span>
              <ArrowUpRight size={13} />
            </a>
          </div>

          {/* Interactive Contact Form */}
          <div className="contact-form-container">
            <form onSubmit={handleContactSubmit} className="cinematic-contact-form">
              <div className="form-row-2">
                <div className="form-field">
                  <label htmlFor="contact-name">Your Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="contact-email">Your Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="jane@example.com"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  placeholder="Tell me about your project, idea, or role..."
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                />
              </div>

              <div className="form-footer">
                <button
                  type="submit"
                  disabled={formState.status === "submitting"}
                  className="cta-submit-btn"
                >
                  <Send size={15} />
                  <span>
                    {formState.status === "submitting" ? "Transmitting..." : "Send Dispatch"}
                  </span>
                </button>

                {formState.status === "success" && (
                  <p className="form-status-msg is-success">
                    <Check size={14} /> Message received. I will reply shortly.
                  </p>
                )}
                {formState.status === "error" && (
                  <p className="form-status-msg is-error">
                    {formState.errorMsg}
                  </p>
                )}
              </div>
            </form>
          </div>

          <a
            className="cta"
            href="#intro"
            onClick={(e) => {
              e.preventDefault();
              scrollToChapter("intro");
            }}
          >
            <i />
            <span>Return to Threshold</span>
            <svg viewBox="0 0 14 14" fill="none" width="13" height="13">
              <path d="M3 11 11 3M5 3h6v6" stroke="#dfe7e0" strokeWidth="1.3" />
            </svg>
          </a>
        </section>

        {/* ============================================================ FOOTER */}
        <footer className="foot" data-cam="6">
          <div className="foot-grid">
            <div className="foot-brand">
              <svg viewBox="0 0 44 44" fill="none" width="34" height="34" aria-hidden="true">
                <circle cx="22" cy="25" r="8.6" fill="#e0231c" fillOpacity=".9" />
                <path d="M5 13h34M9 18.4h26M22 8.5v27" stroke="#dfe7e0" strokeWidth="1.5" />
              </svg>
              <p>
                A cinematic interactive Three.js portfolio for Kartik Nilekani.
                Computer Science & Business Systems Engineer.
              </p>
            </div>
            <div>
              <h4>Chapters</h4>
              <ul>
                {chapters.map((ch) => (
                  <li key={ch.id}>
                    <a
                      href={`#${ch.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToChapter(ch.id);
                      }}
                    >
                      {ch.num} — {ch.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4>Key Projects</h4>
              <ul>
                <li>
                  <a
                    href="#projects"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToChapter("projects");
                    }}
                  >
                    BloodLink
                  </a>
                </li>
                <li>
                  <a
                    href="#projects"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToChapter("projects");
                    }}
                  >
                    VoxNav Interface
                  </a>
                </li>
                <li>
                  <a
                    href="#projects"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToChapter("projects");
                    }}
                  >
                    PathGrid Map
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4>Networks</h4>
              <ul>
                <li>
                  <a href="https://github.com/Kartik01032005" target="_blank" rel="noopener noreferrer">
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/in/kartik-nilekani-287a6329b/" target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="mailto:kartiknilekani568@gmail.com">
                    Direct Email
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="foot-base">
            <span>© 2026 Kartik Nilekani — All rights reserved</span>
            <span className="jp">工学と知性・静寂と構造</span>
            <span>Next.js · Three.js WebGL · Framer Motion</span>
          </div>
        </footer>
      </main>

      {/* Chapter Progress Rail */}
      <div className="rail" id="rail">
        {chapters.map((ch, idx) => (
          <button
            key={ch.id}
            className={activeChapter === idx ? "on" : ""}
            title={`${ch.num} — ${ch.title}`}
            aria-label={`Chapter ${ch.num}: ${ch.title}`}
            onClick={() => scrollToChapter(ch.id)}
          >
            <i />
          </button>
        ))}
      </div>
    </div>
  );
}

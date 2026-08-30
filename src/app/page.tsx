"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Lenis from "lenis";
import { motion, Variants } from "framer-motion";
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
  Sun,
  Moon,
  Layers,
  Code2,
  Cpu,
  Database,
  Terminal,
} from "lucide-react";
import {
  navItems,
  chapters,
  certifications,
  verifiedTimeline,
  socialLinks,
} from "@/data/portfolio";
import { VideoBackground } from "@/components/video/VideoBackground";
import { ProjectShowcase } from "@/components/portfolio/ProjectShowcase";
import { SkillsGallery } from "@/components/portfolio/SkillsGallery";
import { useTheme } from "@/contexts/ThemeContext";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.85,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.12,
    },
  },
};

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const cardScaleVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function Home() {
  const [activeChapter, setActiveChapter] = useState(0);
  const [isStuck, setIsStuck] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [preloaderProgress, setPreloaderProgress] = useState(15);
  const { theme, toggleTheme } = useTheme();

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

  const lenisRef = useRef<Lenis | null>(null);
  const activeChapterRef = useRef<number>(0);

  // Initialize Lenis smooth momentum scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 2,
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);

    // Measure exact chapter anchor offsets
    let anchors: number[] = [];
    const measure = () => {
      const ids = ["home", "about", "projects", "skills", "experience", "contact"];
      const secs = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
      const vpH = window.innerHeight;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - vpH);
      if (secs.length === 6) {
        anchors = secs.map((el, i) => {
          if (i === 0) return 0;
          if (i === secs.length - 1) return maxScroll;
          return Math.min(Math.max(el.offsetTop + el.offsetHeight * 0.5 - vpH * 0.5, 0), maxScroll);
        });
        for (let ai = 1; ai < anchors.length; ai++) {
          anchors[ai] = Math.max(anchors[ai], anchors[ai - 1] + 1);
        }
      }
    };

    measure();
    window.addEventListener("resize", measure, { passive: true });

    function progressFor(y: number) {
      if (anchors.length < 2 || y <= anchors[0]) return 0;
      for (let i = 0; i < anchors.length - 1; i++) {
        if (y <= anchors[i + 1]) {
          return i + (y - anchors[i]) / (anchors[i + 1] - anchors[i]);
        }
      }
      return anchors.length - 1;
    }

    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Stuck header — only update state on threshold crossing
      const shouldBeStuck = scrollY > 40;
      setIsStuck((prev) => (prev !== shouldBeStuck ? shouldBeStuck : prev));

      // Active chapter indicator — only update when chapter boundary changes
      const progress = progressFor(scrollY);
      const currentChapterIdx = Math.min(Math.max(0, Math.round(progress)), 5);
      if (currentChapterIdx !== activeChapterRef.current) {
        activeChapterRef.current = currentChapterIdx;
        setActiveChapter(currentChapterIdx);
      }
    };

    lenis.on("scroll", handleScroll);
    handleScroll();

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Preloader progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setPreloaderProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setPreloaderDone(true), 300);
          return 100;
        }
        return prev + 25;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const scrollToChapter = useCallback((chapterId: string) => {
    const el = document.getElementById(chapterId);
    if (el) {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(el, { duration: 1.2 });
      } else {
        el.scrollIntoView({ behavior: "smooth" });
      }
      setMenuOpen(false);
    }
  }, []);

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
      {/* Fullscreen Video Background */}
      <VideoBackground onLoaded={() => setPreloaderProgress(100)} />

      {/* Atmospheric Overlays */}
      <div id="vignette" aria-hidden="true" />
      <div id="grain" aria-hidden="true" />

      {/* Preloader */}
      <div id="pre" className={preloaderDone ? "done" : ""} suppressHydrationWarning>
        <div className="pre-in" suppressHydrationWarning>
          <div className="pre-mark">
            <svg viewBox="0 0 44 44" fill="none" aria-hidden="true">
              <circle cx="22" cy="24" r="9.5" stroke="#e0231c" strokeWidth="1.2" />
              <path d="M6 12h32M9.5 17h25M22 8v28" stroke="#dfe7e0" strokeWidth="1.2" />
            </svg>
          </div>
          <div className="pre-jp jp">神域の静寂</div>
          <div className="pre-bar" suppressHydrationWarning>
            <i id="pre-fill" style={{ right: `${100 - preloaderProgress}%` }} suppressHydrationWarning />
          </div>
          <div className="pre-meta" suppressHydrationWarning>
            <span>Entering Portfolio</span>
            <b>
              <span suppressHydrationWarning>{Math.min(100, preloaderProgress)}</span>%
            </b>
          </div>
        </div>
      </div>

      {/* Primary Navigation Bar */}
      <header
        className={`nav ${isStuck ? "stuck" : ""} ${menuOpen ? "menu-open" : ""}`}
        id="nav"
        suppressHydrationWarning
      >
        <a
          className="brand"
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            scrollToChapter("home");
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

        <nav className="nav-links" id="navlinks" suppressHydrationWarning>
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
              <span className="alt">{item.label}</span>
            </a>
          ))}
        </nav>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="theme-toggle-btn"
          aria-label={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          suppressHydrationWarning
        >
          {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        <button
          className={`nav-burger ${menuOpen ? "active" : ""}`}
          aria-label="Toggle Menu"
          onClick={() => setMenuOpen(!menuOpen)}
          suppressHydrationWarning
        >
          <i />
          <i />
        </button>
      </header>

      {/* Main Narrative Page Content */}
      <main className="page" id="top">
        {/* ============================================================ 1. HOME */}
        <motion.section
          className="hero"
          id="home"
          data-cam="0"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={sectionVariants}
        >
          <div className="hero-top" style={{ maxWidth: "min(780px, 85vw)" }}>
            <motion.div className="eyebrow" variants={fadeUpVariants}>
              <span className="dot" /> Computer Science & Business Systems Engineer
            </motion.div>
            
            <motion.h1
              className="display h-hero"
              variants={fadeUpVariants}
              style={{
                fontSize: "clamp(34px, 4.4vw, 68px)",
                lineHeight: 1.04,
                letterSpacing: "-0.02em",
                fontWeight: 600,
                color: "var(--bone)",
              }}
            >
              KARTIK MANJUNATH NILEKANI
            </motion.h1>

            <motion.p
              className="hero-sub body"
              variants={fadeUpVariants}
              style={{
                fontSize: "clamp(16px, 1.25vw, 20px)",
                color: "var(--bone)",
                marginTop: "16px",
                maxWidth: "600px",
              }}
            >
              I build websites, applications, and AI-powered solutions.
            </motion.p>

            {/* Quick Action CTA Buttons */}
            <motion.div className="hero-cta-group" variants={fadeUpVariants}>
              <a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToChapter("projects");
                }}
                className="hero-btn-primary"
              >
                <span>View My Work</span>
                <ArrowDownRight size={15} />
              </a>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToChapter("contact");
                }}
                className="hero-btn-secondary"
              >
                <span>Contact Me</span>
                <ArrowUpRight size={15} />
              </a>
            </motion.div>
          </div>

          <div className="hero-spacer" />

          {/* Quick Section Selector Chips */}
          <motion.div className="hero-foot" variants={fadeUpVariants}>
            <div className="hero-cue">
              <span>Scroll to explore</span>
              <span className="track">
                <i />
              </span>
            </div>
            <div className="chapters" id="chips" suppressHydrationWarning>
              {navItems.slice(0, 4).map((item, idx) => (
                <div
                  key={item.href}
                  className={`chip ${activeChapter === idx ? "on" : ""}`}
                  onClick={() => scrollToChapter(item.href.replace("#", ""))}
                  suppressHydrationWarning
                >
                  <span className="num" suppressHydrationWarning>
                    {item.chapter}
                  </span>
                  <span className="tx" suppressHydrationWarning>
                    <b>{item.label}</b>
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="word-fb" aria-hidden="true">
            KARTIK
          </div>
        </motion.section>

        {/* ============================================================ 2. ABOUT */}
        <motion.section
          className="sec"
          id="about"
          data-cam="1"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={sectionVariants}
        >
          <motion.div className="sec-head" variants={fadeUpVariants}>
            <span className="k">
              <b>02</b> — About
            </span>
            <span className="rule" />
            <span className="k">ABOUT ME</span>
          </motion.div>

          <div className="gate-grid">
            <motion.h2 className="display h-sec" variants={fadeUpVariants}>
              ABOUT ME
            </motion.h2>
            <motion.div className="gate-copy" variants={fadeUpVariants}>
              <p className="lead" style={{ fontSize: "clamp(16px, 1.2vw, 19px)", lineHeight: 1.75 }}>
                I&rsquo;m a Computer Science & Business Systems student at Srinivas Institute of Technology.
                I enjoy building software, learning new technologies, and turning ideas into useful products.
              </p>

              <div className="focus-areas-block" style={{ marginTop: "28px" }}>
                <h4 style={{ fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--vermilion)", fontWeight: 600 }}>
                  WHAT I LIKE TO BUILD
                </h4>
                <ul className="focus-list" style={{ marginTop: "14px" }}>
                  <li>
                    <span className="focus-bullet" />
                    <span>Full-Stack Applications</span>
                  </li>
                  <li>
                    <span className="focus-bullet" />
                    <span>AI-Powered Applications</span>
                  </li>
                  <li>
                    <span className="focus-bullet" />
                    <span>Web Experiences</span>
                  </li>
                  <li>
                    <span className="focus-bullet" />
                    <span>Problem-Solving Systems</span>
                  </li>
                </ul>
              </div>

              <a
                className="arrowlink"
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToChapter("projects");
                }}
                style={{ marginTop: "24px" }}
              >
                <span>View Featured Projects</span>
                <span className="ar">
                  <svg viewBox="0 0 14 14" fill="none">
                    <path d="M3 11 11 3M5 3h6v6" stroke="#dfe7e0" strokeWidth="1.3" />
                  </svg>
                </span>
              </a>
            </motion.div>
          </div>

          {/* Key Metrics Band */}
          <motion.div className="gate-stats" variants={cardScaleVariants}>
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
          </motion.div>
        </motion.section>

        {/* ============================================================ 3. PROJECTS */}
        <motion.section
          className="sec"
          id="projects"
          data-cam="2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          variants={sectionVariants}
        >
          <motion.div className="sec-head" variants={fadeUpVariants}>
            <span className="k">
              <b>03</b> — Projects
            </span>
            <span className="rule" />
            <span className="k">PROJECTS</span>
          </motion.div>

          <motion.div className="cur-head" variants={fadeUpVariants}>
            <h2 className="display h-sec">PROJECTS</h2>
            <p className="body-lg" style={{ fontSize: "17px", color: "var(--bone-dim)" }}>
              Things I&rsquo;ve built.
            </p>
          </motion.div>

          {/* Project Showcase with Modals & Architecture */}
          <ProjectShowcase />
        </motion.section>

        {/* ============================================================ 4. SKILLS (LOCKED & UNTOUCHED) */}
        <motion.section
          className="sec"
          id="skills"
          data-cam="3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          variants={sectionVariants}
        >
          <motion.div className="sec-head" variants={fadeUpVariants}>
            <span className="k">
              <b>04</b> — Sacred Craft
            </span>
            <span className="rule" />
            <span className="k jp">技術</span>
          </motion.div>

          <motion.div className="cur-head" variants={fadeUpVariants}>
            <h2 className="display h-sec">A disciplined technical arsenal.</h2>
            <p className="body-lg">
              Explore my verified stack across programming languages, full-stack frameworks,
              AI toolchains, database engines, and core software engineering disciplines.
            </p>
          </motion.div>

          {/* Interactive Pro Skills Catalog Component — 100% LOCKED */}
          <SkillsGallery />
        </motion.section>

        {/* ============================================================ 5. EXPERIENCE & CERTIFICATIONS */}
        <motion.section
          className="sec"
          id="experience"
          data-cam="4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          variants={sectionVariants}
        >
          <motion.div className="sec-head" variants={fadeUpVariants}>
            <span className="k">
              <b>05</b> — Experience
            </span>
            <span className="rule" />
            <span className="k">EXPERIENCE & CERTIFICATIONS</span>
          </motion.div>

          <motion.div className="cur-head" variants={fadeUpVariants} style={{ marginBottom: "32px" }}>
            <h2 className="display h-sec">EXPERIENCE</h2>
          </motion.div>

          <div className="timeline-cert-grid">
            {/* Timeline Column */}
            <motion.div className="timeline-column" variants={fadeUpVariants}>
              <h3 className="section-subtitle">
                <Compass size={16} />
                <span>Professional Roles & Education</span>
              </h3>
              <div className="timeline-list">
                {verifiedTimeline.map((item, i) => (
                  <motion.div key={i} className="timeline-card" variants={cardScaleVariants}>
                    <div className="timeline-card__top">
                      <span className="timeline-date">{item.date}</span>
                      {item.badge && <span className="timeline-badge">{item.badge}</span>}
                    </div>
                    <h4 className="timeline-title">{item.title}</h4>
                    <p className="timeline-org">{item.org}</p>
                    <p className="timeline-desc">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Certifications Column */}
            <motion.div className="cert-column" variants={fadeUpVariants}>
              <h3 className="section-subtitle">
                <Award size={16} />
                <span>CERTIFICATIONS</span>
              </h3>
              <div className="cert-list">
                {certifications.map((cert, i) => (
                  <motion.a
                    key={i}
                    href={cert.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cert-card"
                    variants={cardScaleVariants}
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
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* ============================================================ 6. CONTACT */}
        <motion.section
          className="sec fin"
          id="contact"
          data-cam="5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={sectionVariants}
        >
          <motion.div className="sec-head" variants={fadeUpVariants}>
            <span className="k">
              <b>06</b> — Contact
            </span>
            <span className="rule" />
            <span className="k">CONTACT</span>
          </motion.div>

          <motion.h2 className="display" variants={fadeUpVariants} style={{ fontSize: "clamp(30px, 3.8vw, 54px)" }}>
            Let&rsquo;s build something.
          </motion.h2>
          <motion.p className="body-lg" variants={fadeUpVariants} style={{ maxWidth: "560px", color: "var(--bone-dim)" }}>
            Have an idea, project, or opportunity? Let&rsquo;s connect.
          </motion.p>

          {/* Direct Social Links */}
          <motion.div className="contact-links-row" variants={fadeUpVariants}>
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
          </motion.div>

          {/* Interactive Contact Form */}
          <motion.div className="contact-form-container" variants={cardScaleVariants} suppressHydrationWarning>
            <form onSubmit={handleContactSubmit} className="cinematic-contact-form" suppressHydrationWarning>
              <div className="form-row-2" suppressHydrationWarning>
                <div className="form-field" suppressHydrationWarning>
                  <label htmlFor="contact-name">Your Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    suppressHydrationWarning
                  />
                </div>
                <div className="form-field" suppressHydrationWarning>
                  <label htmlFor="contact-email">Your Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="jane@example.com"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    suppressHydrationWarning
                  />
                </div>
              </div>

              <div className="form-field" suppressHydrationWarning>
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  placeholder="Tell me about your project, idea, or role..."
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  suppressHydrationWarning
                />
              </div>

              <div className="form-footer" suppressHydrationWarning>
                <button
                  type="submit"
                  disabled={formState.status === "submitting"}
                  className="cta-submit-btn"
                  suppressHydrationWarning
                >
                  <Send size={15} />
                  <span>
                    {formState.status === "submitting" ? "Transmitting..." : "Send Message"}
                  </span>
                </button>

                {formState.status === "success" && (
                  <p className="form-status-msg is-success" suppressHydrationWarning>
                    <Check size={14} /> Message received. I will reply shortly.
                  </p>
                )}
                {formState.status === "error" && (
                  <p className="form-status-msg is-error" suppressHydrationWarning>
                    {formState.errorMsg}
                  </p>
                )}
              </div>
            </form>
          </motion.div>

          <a
            className="cta"
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollToChapter("home");
            }}
          >
            <i />
            <span>Back to Top</span>
            <svg viewBox="0 0 14 14" fill="none" width="13" height="13">
              <path d="M3 11 11 3M5 3h6v6" stroke="#dfe7e0" strokeWidth="1.3" />
            </svg>
          </a>
        </motion.section>

        {/* ============================================================ FOOTER */}
        <footer className="foot" data-cam="6">
          <div className="foot-grid">
            <div className="foot-brand">
              <svg viewBox="0 0 44 44" fill="none" width="34" height="34" aria-hidden="true">
                <circle cx="22" cy="25" r="8.6" fill="#e0231c" fillOpacity=".9" />
                <path d="M5 13h34M9 18.4h26M22 8.5v27" stroke="#dfe7e0" strokeWidth="1.5" />
              </svg>
              <p>
                Kartik Manjunath Nilekani — Computer Science & Business Systems Engineer.
              </p>
            </div>
            <div>
              <h4>Navigation</h4>
              <ul>
                {navItems.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToChapter(item.href.replace("#", ""));
                      }}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4>Projects</h4>
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
              <h4>Connect</h4>
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
            <span>Next.js · React · Framer Motion</span>
          </div>
        </footer>
      </main>

      {/* Section Progress Rail */}
      <div className="rail" id="rail" suppressHydrationWarning>
        {navItems.map((item, idx) => (
          <button
            key={item.href}
            className={activeChapter === idx ? "on" : ""}
            title={`${item.chapter} — ${item.label}`}
            aria-label={`Section ${item.chapter}: ${item.label}`}
            onClick={() => scrollToChapter(item.href.replace("#", ""))}
            suppressHydrationWarning
          >
            <i suppressHydrationWarning />
          </button>
        ))}
      </div>
    </div>
  );
}

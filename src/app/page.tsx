"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  Bookmark,
  Check,
  ChevronDown,
  Github,
  Linkedin,
  Loader2,
  Mail,
  Menu,
  Moon,
  MoveUpRight,
  Sun,
  Radio,
  Search,
  Send,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import useScrollParallax from "@/hooks/useScrollParallax";
import { useTheme } from "@/contexts/ThemeContext";
import SmoothScroll from "@/components/SmoothScroll";
import IntroLoader from "@/components/IntroLoader";
import ScrollSection from "@/components/ScrollSection";
import {
  certifications,
  Certification,
  currentFocus,
  navItems,
  NavItem,
  projects,
  Project,
  skillGroups,
  socialLinks,
  SocialLink,
  verifiedTimeline,
  TimelineItem,
} from "@/data/portfolio";

const cinematicEasing = [0.22, 1, 0.36, 1];

const reveal = (reduced: boolean | null | undefined, delay = 0) =>
  reduced
    ? {}
    : {
        initial: { opacity: 0, y: 28, scale: 0.992 },
        whileInView: { opacity: 1, y: 0, scale: 1 },
        viewport: { once: false, amount: 0.1, margin: "0px 0px -6% 0px" },
        transition: { duration: 0.72, delay, ease: cinematicEasing as any },
      };

function SectionLabel({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <div className="section-label">
      <span className="section-label__index">{index} /</span>
      <span>{children}</span>
    </div>
  );
}


function IconForLink({ label }: { label: string }) {
  if (label === "GitHub") return <Github size={18} />;
  if (label === "LinkedIn") return <Linkedin size={18} />;
  return <Mail size={18} />;
}


function ProjectCard({
  project,
  index,
  onOpen,
  reduced,
}: {
  project: Project;
  index: number;
  onOpen: (project: Project) => void;
  reduced: boolean | null | undefined;
}) {
  return (
    <motion.article
      className="project-ref-card"
      {...reveal(reduced, index * 0.1)}
      whileHover={reduced ? undefined : { y: -6 }}
      whileTap={reduced ? undefined : { scale: 0.985 }}
      transition={{ duration: 0.35, ease: cinematicEasing as any, delay: reduced ? 0 : index * 0.1 }}
    >
      {/* Top: Project Visual */}
      <div
        className="project-ref-card__visual"
        onClick={() => onOpen(project)}
        role="button"
        tabIndex={0}
        aria-label={`Open ${project.name} case study`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpen(project);
          }
        }}
        suppressHydrationWarning
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <motion.img
          src={project.image}
          alt={`${project.name} preview`}
          loading="lazy"
          className="project-ref-card__img"
          whileHover={reduced ? undefined : { scale: 1.03 }}
          transition={{ duration: 0.45, ease: cinematicEasing as any }}
          suppressHydrationWarning
        />
      </div>

      {/* Bottom: Project Information */}
      <div className="project-ref-card__body">
        <div className="project-ref-card__meta">
          <span className="project-ref-card__category">{project.category || project.kicker}</span>
          <span className="project-ref-card__year">{project.year || "2026"}</span>
        </div>

        <div className="project-ref-card__header">
          <h3
            className="project-ref-card__title"
            onClick={() => onOpen(project)}
            title={`View ${project.name} details`}
            suppressHydrationWarning
          >
            {project.name}
          </h3>
          <div className="project-ref-card__actions">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.name} GitHub Repository`}
                className="project-ref-card__icon-btn"
                title="View GitHub Repository"
                suppressHydrationWarning
              >
                <Github size={16} />
              </a>
            )}
            <button
              type="button"
              onClick={() => onOpen(project)}
              aria-label={`Open ${project.name} case study`}
              className="project-ref-card__icon-btn"
              title="Open Case Study"
              suppressHydrationWarning
            >
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>

        <p className="project-ref-card__desc">{project.description}</p>

        <div className="project-ref-card__pills">
          {project.stack.map((tech) => (
            <span key={tech} className="project-ref-pill">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

type ArsenalSkill = {
  name: string;
  category: string;
};

function SkillCard({ skill, reduced }: { skill: ArsenalSkill; reduced: boolean | null | undefined }) {
  return (
    <motion.article
      layout
      initial={reduced ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduced ? undefined : { opacity: 0, y: 12 }}
      transition={{ duration: reduced ? 0 : 0.42, ease: cinematicEasing as any }}
      className="arsenal-card"
      tabIndex={0}
      aria-label={skill.name}
    >
      <h3>{skill.name}</h3>
    </motion.article>
  );
}

function CertificationCategoryCard({
  category,
  items,
  open,
  onToggle,
  reduced,
}: {
  category: string;
  items: Certification[];
  open: boolean;
  onToggle: () => void;
  reduced: boolean | null | undefined;
}) {
  return (
    <motion.article layout className={`cert-category-card ${open ? "is-open" : ""}`}>
      <button className="cert-category-card__trigger" type="button" onClick={onToggle} aria-expanded={open} suppressHydrationWarning>
        <span className="cert-category-card__icon"><Bookmark size={19} strokeWidth={1.5} /></span>
        <span className="cert-category-card__name">{category}</span>
        <span className="cert-category-card__count">{items.length.toString().padStart(2, "0")}</span>
        <ChevronDown className="cert-category-card__chevron" size={17} aria-hidden="true" />
      </button>
      <AnimatePresence initial={false}>{open && (
        <motion.div
          initial={reduced ? false : { opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={reduced ? undefined : { opacity: 0, height: 0 }}
          transition={{ duration: reduced ? 0 : 0.3, ease: cinematicEasing as any }}
          className="cert-category-card__details"
        >
          {items.map((cert) => (
            <div className="cert-category-card__item" key={cert.name}>
              <div><strong>{cert.name}</strong><span>{cert.issuer} / {cert.year}</span><small>{cert.detail}</small></div>
              <a href={cert.href} target="_blank" rel="noopener noreferrer" aria-label={`View certificate for ${cert.name}`}><ArrowUpRight size={15} /></a>
            </div>
          ))}
        </motion.div>
      )}</AnimatePresence>
    </motion.article>
  );
}

function ThemeToggle({ reduced }: { reduced: boolean | null }) {
  const { theme, toggleTheme, mounted } = useTheme();

  return (
    <motion.div
      className="theme-toggle"
      whileTap={reduced ? undefined : { scale: 0.94 }}
      data-theme={mounted ? theme : "light"}
      role="radiogroup"
      aria-label="Theme selector"
      suppressHydrationWarning
    >
      <button
        type="button"
        className={`theme-toggle__option${mounted && theme === "light" ? " is-active" : ""}`}
        onClick={() => { if (mounted && theme !== "light") toggleTheme(); }}
        aria-label="Switch to light mode"
        aria-checked={mounted ? theme === "light" : true}
        role="radio"
        suppressHydrationWarning
      >
        <Sun size={15} />
      </button>
      <button
        type="button"
        className={`theme-toggle__option${mounted && theme === "dark" ? " is-active" : ""}`}
        onClick={() => { if (mounted && theme !== "dark") toggleTheme(); }}
        aria-label="Switch to dark mode"
        aria-checked={mounted ? theme === "dark" : false}
        role="radio"
        suppressHydrationWarning
      >
        <Moon size={15} />
      </button>
      <span className="sr-only" suppressHydrationWarning>
        {mounted ? `Current theme: ${theme}. Click the other icon to switch.` : "Theme toggle"}
      </span>
    </motion.div>
  );
}

export default function Home() {
  const reduced = useReducedMotion();
  const heroSignalRef = useRef<HTMLDivElement | null>(null);
  const heroOrbitOneRef = useRef<HTMLDivElement | null>(null);
  const heroOrbitTwoRef = useRef<HTMLDivElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const [scrolled, setScrolled] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [skillQuery, setSkillQuery] = useState("");
  const [activeSkillCategory, setActiveSkillCategory] = useState("All skills");
  const [openCertificationCategory, setOpenCertificationCategory] = useState<string | null>(null);
  const [showAllCertificates, setShowAllCertificates] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  const handleSubmitContact = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setFormError(null);

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedMessage = formData.message.trim();

    if (!trimmedName) {
      setFormError("Name cannot be empty.");
      return;
    }
    if (trimmedName.length < 2) {
      setFormError("Name must be at least 2 characters.");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    if (!trimmedMessage) {
      setFormError("Message cannot be empty.");
      return;
    }
    if (trimmedMessage.length < 5) {
      setFormError("Message must be at least 5 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          message: trimmedMessage,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        const errorMsg =
          data?.error || "Something went wrong. Please try again.";
        setFormError(errorMsg);
        return;
      }

      setFormData({ name: "", email: "", message: "" });
      setSent(true);
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

    const arsenalSkills = useMemo<ArsenalSkill[]>(
      () => skillGroups.flatMap((group) => group.items.map((name) => ({
        name,
        category: group.label,
      }))),
    []
  );
  const skillCategories = useMemo(() => ["All skills", ...skillGroups.filter((group) => group.items.length > 0).map((group) => group.label)], []);
  const visibleSkills = useMemo(() => {
    const query = skillQuery.trim().toLowerCase();
    return arsenalSkills.filter((skill) => {
      const matchesCategory = activeSkillCategory === "All skills" || skill.category === activeSkillCategory;
      const searchable = [skill.name, skill.category].join(" ").toLowerCase();
      return matchesCategory && (!query || searchable.includes(query));
    });
  }, [activeSkillCategory, arsenalSkills, skillQuery]);

  const certificationGroups = useMemo(() => {
    return certifications.reduce<Record<string, Certification[]>>((groups, certification) => {
      const category = certification.category || "Other credentials";
      groups[category] = groups[category] ? [...groups[category], certification] : [certification];
      return groups;
    }, {});
  }, []);

  const sections = useMemo(
    () => ["about", "education", "skills", "projects", "experience", "certifications", "contact"],
    []
  );

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (entry) => entry.isIntersecting && setActiveSection(entry.target.id)
        ),
      { rootMargin: "-28% 0px -62% 0px" }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [sections]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedProject(null);
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);


  useScrollParallax(heroSignalRef, 0.06, !!reduced);
  useScrollParallax(heroOrbitOneRef, 0.035, !!reduced);
  useScrollParallax(heroOrbitTwoRef, 0.05, !!reduced);


  useEffect(() => {
    if (typeof window === "undefined") return;
    if (selectedProject) {
      window.__lenis?.stop();
    } else {
      window.__lenis?.start();
    }
  }, [selectedProject]);

  const jumpTo = (href: string) => {
    setMenuOpen(false);
    if (typeof window !== "undefined" && window.__lenis && !reduced) {
      window.__lenis.scrollTo(href, {
        offset: 0,
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    }
  };

  return (
    <div className="site-shell" suppressHydrationWarning>
      {showIntro && <IntroLoader onComplete={() => setShowIntro(false)} />}
      <SmoothScroll />
      <header className={`site-nav ${scrolled ? "is-scrolled" : ""}`}>
        <a
          href="#top"
          className="wordmark"
          onClick={(e) => {
            e.preventDefault();
            jumpTo("#top");
          }}
          aria-label="Kartik home"
        >
          <span className="wordmark__mark">K</span>
          <span>
            Kartik<span className="wordmark__period">.</span>
          </span>
        </a>
        <nav className={`site-nav__links ${menuOpen ? "is-open" : ""}`} aria-label="Primary navigation">
          {navItems.map((item: NavItem) => (
            <a
              key={item.href}
              className={activeSection === item.href.slice(1) ? "is-active" : ""}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                jumpTo(item.href);
              }}
            >
              {item.label}
            </a>
          ))}
          <a
            className="nav-cta"
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              jumpTo("#contact");
            }}
          >
            Let’s connect <ArrowUpRight size={14} />
          </a>
        </nav>
        <div className="site-nav__controls">
          <ThemeToggle reduced={reduced} />
          <button
            className="menu-toggle"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            suppressHydrationWarning
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <div className="site-signal-rail" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>

      <main id="top">
        <section className="hero section-shell" aria-labelledby="hero-title">
          <div className="hero__texture" aria-hidden="true" />
          <div className="hero__grid-lines" aria-hidden="true" />
          <div className="hero__copy">
            <motion.div {...reveal(reduced, 0.05)} className="status-pill">
              <span className="status-dot" /> Open to opportunities
            </motion.div>
            <motion.p {...reveal(reduced, 0.12)} className="eyebrow hero__eyebrow">
              Computer science and business systems
            </motion.p>
            <motion.h1 {...reveal(reduced, 0.18)} id="hero-title">
              Kartik Manjunath <em>Nilekani</em>
            </motion.h1>
            <motion.p {...reveal(reduced, 0.24)} className="hero__lead">
              I build practical software, intelligent systems, and experiences that solve real problems.
            </motion.p>
            <motion.div {...reveal(reduced, 0.3)} className="hero__actions">
              <Button className="button button--primary" onClick={() => jumpTo("#projects")}>
                View projects <ArrowDownRight size={16} />
              </Button>
              <a
                className="button button--ghost"
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                download="Kartik-Manjunath-Nilekani-Resume.pdf"
              >
                Download Resume <ArrowUpRight size={16} />
              </a>
            </motion.div>
            <motion.div {...reveal(reduced, 0.36)} className="hero__socials">
              {socialLinks.map((link: SocialLink, index: number) => (
                <motion.a
                  {...reveal(reduced, index * 0.06)}
                  href={link.href}
                  key={link.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${link.label} — ${link.note}`}
                >
                  <span className="motion-link-content">
                    <IconForLink label={link.label} />
                    {link.label}
                  </span>
                </motion.a>
              ))}
            </motion.div>
          </div>
          <motion.div {...reveal(reduced, 0.22)} className="hero__diagram" aria-hidden="true">
            <div ref={heroOrbitOneRef} className="hero__orbit hero__orbit--one parallax-layer" />
            <div ref={heroOrbitTwoRef} className="hero__orbit hero__orbit--two parallax-layer" />
            <motion.div
              ref={heroSignalRef}
              className="hero__signal-card parallax-layer"
              whileHover={reduced ? undefined : { y: -7, rotate: 0.8 }}
              transition={{ duration: 0.45, ease: cinematicEasing as any }}
            >
              <span className="mono">K / 2026</span>
              <strong>
                Building useful
                <br />
                <span>systems.</span>
              </strong>
              <div className="hero__signal-line">
                <i />
                <i />
                <i />
                <i />
              </div>
              <small>full-stack / ai / data</small>
            </motion.div>
            <div className="hero__node hero__node--a" />
            <div className="hero__node hero__node--b" />
            <div className="hero__node hero__node--c" />
          </motion.div>
          <div className="hero__scroll mono">
            <span>Scroll to inspect</span>
            <ChevronDown size={14} />
          </div>
        </section>

        <ScrollSection id="about" className="section-shell section-shell--light about-section" aria-labelledby="about-title">
          <div className="section-rail">
            <SectionLabel index="01">About</SectionLabel>
            <p className="rail-note">A practical builder<br />with a wide lens.</p>
          </div>
          <div className="about-main">
            <motion.div {...reveal(reduced)} className="about-section-heading">
              <p className="eyebrow">Profile / foundation</p>
              <h2 id="about-title">About Me<span>.</span></h2>
            </motion.div>
            <div className="about-layout">
              <motion.div {...reveal(reduced, 0.08)} className="about-portrait">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/profile.jpg"
                  alt="Kartik Manjunath Nilekani"
                  className="about-portrait__img"
                  loading="lazy"
                />
              </motion.div>
              <motion.div {...reveal(reduced, 0.16)} className="about-copy">
                <p className="lede">
                  I&apos;m Kartik Manjunath Nilekani — a Computer Science and Business Systems engineering student passionate about building practical solutions at the intersection of software, data analytics, finance, and AI. I enjoy transforming ideas into meaningful digital products and exploring how technology can solve real-world problems.
                </p>
                <p>
                  I work with modern web technologies and AI tools, continuously expanding my skills through hands-on projects, internships, hackathons, and experimentation. My goal is to combine technical thinking with business and analytical perspectives to build solutions that are useful, practical, and impactful.
                </p>
                <div className="about-meta">
                  <span><b>01</b> Srinivas Institute of Technology</span>
                  <span><b>02</b> 2023—2027 / Mangalore</span>
                </div>
                <div className="about-actions">
                  <a
                    className="button button--primary"
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    download="Kartik-Manjunath-Nilekani-Resume.pdf"
                  >
                    Download Resume <ArrowUpRight size={16} />
                  </a>
                  <button className="button button--outline" type="button" onClick={() => jumpTo("#experience")} suppressHydrationWarning>Learn more about me <ArrowDownRight size={16} /></button>
                </div>
              </motion.div>
            </div>
          </div>
        </ScrollSection>

        <ScrollSection id="education" className="section-shell section-shell--light" aria-labelledby="education-title">
          <div className="section-rail">
            <SectionLabel index="02">Education</SectionLabel>
            <p className="rail-note">
              Foundations for
              <br />
              the next build.
            </p>
          </div>
          <div className="education-content">
            <motion.div {...reveal(reduced)} className="education-card">
              <div>
                <p className="eyebrow">Current foundation</p>
                <h2 id="education-title">
                  B.E. — Computer Science
                  <br />& Business Systems
                </h2>
                <p>Srinivas Institute of Technology</p>
              </div>
              <div className="education-card__year mono">
                2023—2027
                <br />
                <span>Mangalore, India</span>
              </div>
            </motion.div>
          </div>
        </ScrollSection>

        <ScrollSection id="skills" className="section-shell section-shell--dark arsenal-section" aria-labelledby="skills-title">
          <div className="section-rail">
            <SectionLabel index="03">Technical arsenal</SectionLabel>
            <p className="rail-note">Tools chosen for<br />the work at hand.</p>
          </div>
          <div className="skills-content">
            <motion.div {...reveal(reduced)} className="section-heading arsenal-heading">
              <p className="eyebrow arsenal-kicker"><span style={{ color: '#f47c48' }}>03 /</span> Skills</p>
              <h2 id="skills-title">A disciplined<br /><em>technical arsenal.</em></h2>
            </motion.div>
            <motion.div {...reveal(reduced, 0.08)} className="arsenal-controls" aria-label="Skill search and filters">
              <label className="arsenal-search">
                <Search size={17} aria-hidden="true" />
                <span className="sr-only">Search skills</span>
                <input value={skillQuery} onChange={(event) => setSkillQuery(event.target.value)} placeholder="Search the arsenal" type="search" suppressHydrationWarning />
                {skillQuery && <button type="button" onClick={() => setSkillQuery("")} aria-label="Clear skill search" suppressHydrationWarning>×</button>}
              </label>
              <div className="arsenal-filters" role="group" aria-label="Filter skills by category">
                {skillCategories.map((category) => (
                  <button key={category} type="button" className={activeSkillCategory === category ? "is-active" : ""} onClick={() => setActiveSkillCategory(category)} aria-pressed={activeSkillCategory === category} suppressHydrationWarning>
                    {category}<span>{category === "All skills" ? arsenalSkills.length : arsenalSkills.filter((skill) => skill.category === category).length}</span>
                  </button>
                ))}
              </div>
            </motion.div>
            <div className="arsenal-meta"><span><b>{visibleSkills.length.toString().padStart(2, "0")}</b> displayed / {arsenalSkills.length.toString().padStart(2, "0")} total skills</span></div>
            <motion.div layout className="arsenal-grid" aria-live="polite">
              <AnimatePresence mode="popLayout" initial={!reduced}>
                {visibleSkills.map((skill, index) => <SkillCard key={skill.name} skill={skill} reduced={reduced} />)}
              </AnimatePresence>
            </motion.div>
            {visibleSkills.length === 0 && <motion.div {...reveal(reduced)} className="arsenal-empty"><span className="mono">No match / 00</span><h3>Nothing in the current set.</h3><p>Try a different search term or return to all skills.</p><button type="button" onClick={() => { setSkillQuery(""); setActiveSkillCategory("All skills"); }} suppressHydrationWarning>Reset filters <ArrowUpRight size={14} /></button></motion.div>}
          </div>
        </ScrollSection>

        <ScrollSection id="projects" className="section-shell section-shell--light projects-section" aria-labelledby="projects-title">
          <div className="section-rail">
            <SectionLabel index="04">projects</SectionLabel>
            <p className="rail-note">
              Selected systems
              <br />
              built with intent.
            </p>
          </div>
          <div className="projects-content">
            <motion.div {...reveal(reduced)} className="section-heading section-heading--split">
              <div>
                <p className="eyebrow">Work in progress, made visible</p>
                <h2 id="projects-title">
                  Projects with a <em>reason to exist.</em>
                </h2>
              </div>
            </motion.div>
            <div className="projects-grid">
              {projects.map((project: Project, index: number) => (
                <ProjectCard key={project.id} project={project} index={index} onOpen={setSelectedProject} reduced={reduced} />
              ))}
            </div>

          </div>
        </ScrollSection>

        <ScrollSection id="experience" className="section-shell section-shell--dark" aria-labelledby="experience-title">
          <div className="section-rail">
            <SectionLabel index="05">Experience</SectionLabel>
            <p className="rail-note">
              Learning in public,
              <br />
              building with intent.
            </p>
          </div>
          <div className="timeline-content">
            <motion.div {...reveal(reduced)} className="section-heading">
              <p className="eyebrow">A workbench, not a highlight reel</p>
              <h2 id="experience-title">
                The work behind
                <br />
                <em>the work.</em>
              </h2>
            </motion.div>
            <div className="timeline">
              {verifiedTimeline.map((item: TimelineItem, index: number) => (
                <motion.article
                  key={`${item.title}-${item.date}`}
                  {...reveal(reduced, index * 0.1)}
                  className="timeline-item"
                >
                  <div className="timeline-item__date mono">{item.date}</div>
                  <div className="timeline-item__marker">
                    <span />
                  </div>
                  <div className="timeline-item__body">
                    <p className="eyebrow">{item.org}</p>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </ScrollSection>

        <ScrollSection id="certifications" className="section-shell section-shell--light certifications-section" aria-labelledby="certifications-title">
          <div className="section-rail">
            <SectionLabel index="06">Certifications</SectionLabel>
            <p className="rail-note">Proof of active<br />learning.</p>
          </div>
          <div className="certifications-main">
            <motion.div {...reveal(reduced)} className="certifications-heading">
              <p className="eyebrow certifications-kicker"><span style={{ color: '#f47c48' }}>06 /</span> Certifications</p>
              <p className="eyebrow certifications-context">Selected credentials</p>
              <h2 id="certifications-title">Signals of <em>continued learning.</em></h2>
              <p>Selected certificates that document the learning behind the work and the systems I continue to build.</p>
            </motion.div>
            <div className="cert-card-grid">
              {certifications.slice(0, 4).map((cert: Certification, index: number) => (
                <motion.article key={cert.name} {...reveal(reduced, index * 0.05)} className="cert-card">
                  <div className="cert-card__header">
                    {cert.category && <span className="cert-card__category">{cert.category}</span>}
                    <span className="cert-card__year mono">{cert.year}</span>
                  </div>
                  <div className="cert-card__body">
                    <h4>{cert.name}</h4>
                    <p>{cert.issuer}</p>
                    <small>{cert.detail}</small>
                  </div>
                  <a className="cert-card__action" href={cert.href} target="_blank" rel="noopener noreferrer" aria-label={`View certificate for ${cert.name}`}>
                    View Certificate <ArrowUpRight size={14} />
                  </a>
                </motion.article>
              ))}
              <AnimatePresence>
                {showAllCertificates &&
                  certifications.slice(4).map((cert: Certification, index: number) => (
                    <motion.article
                      key={cert.name}
                      initial={reduced ? { opacity: 1 } : { opacity: 0, y: 16, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
                      transition={{ duration: 0.32, delay: index * 0.05, ease: cinematicEasing as any }}
                      className="cert-card"
                    >
                      <div className="cert-card__header">
                        {cert.category && <span className="cert-card__category">{cert.category}</span>}
                        <span className="cert-card__year mono">{cert.year}</span>
                      </div>
                      <div className="cert-card__body">
                        <h4>{cert.name}</h4>
                        <p>{cert.issuer}</p>
                        <small>{cert.detail}</small>
                      </div>
                      <a className="cert-card__action" href={cert.href} target="_blank" rel="noopener noreferrer" aria-label={`View certificate for ${cert.name}`}>
                        View Certificate <ArrowUpRight size={14} />
                      </a>
                    </motion.article>
                  ))}
              </AnimatePresence>
            </div>
            {certifications.length > 4 && (
              <div className="cert-expand-wrap">
                <Button
                  className="button button--primary"
                  onClick={() => setShowAllCertificates(!showAllCertificates)}
                  aria-expanded={showAllCertificates}
                >
                  {showAllCertificates ? (
                    <>
                      Show fewer certificates <ArrowUpRight size={16} />
                    </>
                  ) : (
                    <>
                      View more certificates <ArrowDownRight size={16} />
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </ScrollSection>

        <ScrollSection className="section-shell section-shell--warm" aria-labelledby="focus-title">
          <div className="section-rail">
            <SectionLabel index="07">Current focus</SectionLabel>
            <p className="rail-note">
              A roadmap with
              <br />
              room to change.
            </p>
          </div>
          <div className="focus-content">
            <motion.div {...reveal(reduced)} className="section-heading">
              <p className="eyebrow">Currently building & learning</p>
              <h2 id="focus-title">
                Curious enough
                <br />
                to keep <em>going.</em>
              </h2>
            </motion.div>
            <div className="focus-list">
              {currentFocus.map((item: string, index: number) => (
                <motion.div
                  key={`${index}-${item}`}
                  {...reveal(reduced, index * 0.05)}
                  whileHover={reduced ? undefined : { x: 6 }}
                  whileTap={reduced ? undefined : { scale: 0.995 }}
                  className="focus-item"
                >
                  <span className="mono">0{index + 1}</span>
                  <span>{item}</span>
              <ArrowUpRight size={16} />
                </motion.div>
              ))}
            </div>
          </div>
        </ScrollSection>

        <ScrollSection id="contact" className="section-shell section-shell--contact" aria-labelledby="contact-title">
          <div className="contact-glow" aria-hidden="true" />
          <div className="section-rail contact-rail">
            <SectionLabel index="08">Contact</SectionLabel>
            <p className="rail-note">Open to useful<br />conversations.</p>
          </div>
          <div className="contact-content">
            <motion.div {...reveal(reduced)}>
              <h2 id="contact-title">
                Let’s build something <em>useful.</em>
              </h2>
              <p>Have an opportunity, project, or idea? I’d be happy to connect.</p>
              <div className="contact-links">
                {socialLinks.map((link: SocialLink, index: number) => (
                  <motion.a {...reveal(reduced, index * 0.05)} href={link.href} key={link.label} target="_blank" rel="noopener noreferrer">
                    <span className="motion-link-content">
                      <IconForLink label={link.label} />
                      {link.label}
                      <ArrowUpRight size={14} />
                    </span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
            <motion.form
              {...reveal(reduced, 0.12)}
              className="contact-form"
              suppressHydrationWarning
              onSubmit={handleSubmitContact}
              noValidate
            >
              {sent ? (
                <div className="form-success">
                  <div className="form-success__icon">
                    <Check />
                  </div>
                  <h3>Message sent successfully</h3>
                  <p>
                    Thank you for reaching out! Your message has been delivered directly to my inbox. I will get back to you soon.
                  </p>
                  <button
                    type="button"
                    className="text-button"
                    onClick={() => {
                      setSent(false);
                      setFormError(null);
                    }}
                    suppressHydrationWarning
                  >
                    Send another <ArrowUpRight size={14} />
                  </button>
                </div>
              ) : (
                <>
                  <label htmlFor="name">
                    Name
                    <input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="Your name"
                      required
                      minLength={2}
                      maxLength={100}
                      disabled={isSubmitting}
                      suppressHydrationWarning
                    />
                  </label>
                  <label htmlFor="email">
                    Email
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, email: e.target.value }))
                      }
                      placeholder="you@example.com"
                      required
                      maxLength={254}
                      disabled={isSubmitting}
                      suppressHydrationWarning
                    />
                  </label>
                  <label htmlFor="message">
                    Message
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, message: e.target.value }))
                      }
                      placeholder="Tell me about the opportunity or idea..."
                      required
                      minLength={5}
                      maxLength={5000}
                      disabled={isSubmitting}
                      suppressHydrationWarning
                    />
                  </label>
                  {formError && (
                    <div className="form-error" role="alert">
                      {formError}
                    </div>
                  )}
                  <button
                    className="button button--primary form-submit"
                    type="submit"
                    disabled={isSubmitting}
                    suppressHydrationWarning
                  >
                    {isSubmitting ? (
                      <>
                        Sending... <Loader2 className="animate-spin" size={15} />
                      </>
                    ) : (
                      <>
                        Send message <Send size={15} />
                      </>
                    )}
                  </button>
                </>
              )}
            </motion.form>
          </div>
        </ScrollSection>
      </main>

      <footer className="site-footer">
        <span>© 2026 Kartik Manjunath Nilekani</span>
        <span className="footer-center">Built with intent, not noise.</span>
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            jumpTo("#top");
          }}
        >
          Back to top <ArrowUpRight size={14} />
        </a>
      </footer>

      <AnimatePresence>
        {selectedProject && (
        <motion.div
          {...(reduced
            ? {}
            : {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                exit: { opacity: 0 },
                transition: { duration: 0.28, ease: cinematicEasing as any },
              })}
          className="modal-backdrop"
          data-lenis-prevent
          role="presentation"
          onClick={() => setSelectedProject(null)}
        >
          <motion.div
            {...(reduced
              ? {}
              : {
                  initial: { opacity: 0, y: 20, scale: 0.98 },
                  animate: { opacity: 1, y: 0, scale: 1 },
                  transition: { duration: 0.35 },
                })}
            className="case-modal"
            data-lenis-prevent
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              aria-label="Close case study"
              onClick={() => setSelectedProject(null)}
              suppressHydrationWarning
            >
              <X size={19} />
            </button>
            <div className="case-modal__top">
              <span className="eyebrow">Case study / {selectedProject.index}</span>
              <h2 id="case-title">{selectedProject.name}</h2>
              <p>{selectedProject.description}</p>
            </div>
            {(selectedProject.problem || selectedProject.solution) && (
              <div className="case-modal__grid">
                {selectedProject.problem && (
                  <div>
                    <span className="detail-label">Problem</span>
                    <p>{selectedProject.problem}</p>
                  </div>
                )}
                {selectedProject.solution && (
                  <div>
                    <span className="detail-label">Solution</span>
                    <p>{selectedProject.solution}</p>
                  </div>
                )}
              </div>
            )}
            {selectedProject.features && selectedProject.features.length > 0 && (
              <div className="case-modal__features">
                <span className="detail-label">Key features</span>
                <div className="feature-list">
                  {selectedProject.features.map((feature: string) => (
                    <span key={feature}>
                      <Check size={14} />
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="tag-row">
              {selectedProject.stack.map((item: string) => (
                <span className="tag" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

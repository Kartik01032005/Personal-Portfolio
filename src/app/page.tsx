"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Github,
  Linkedin,
  Loader2,
  Mail,
  Menu,
  Search,
  Send,
  X,
} from "lucide-react";
import useScrollParallax from "@/hooks/useScrollParallax";
import SmoothScroll from "@/components/SmoothScroll";
import IntroLoader from "@/components/IntroLoader";
import ScrollSection from "@/components/ScrollSection";
import { AboutSection } from "@/components/portfolio/AboutSection";
import { EducationSection } from "@/components/portfolio/EducationSection";
import { CurrentFocusSection } from "@/components/portfolio/CurrentFocusSection";
import { SideNavigation } from "@/components/portfolio/SideNavigation";
import { ProjectsSection } from "@/components/portfolio/ProjectsSection";
import { ExperienceSection } from "@/components/portfolio/ExperienceSection";
import { CertificationsSection } from "@/components/portfolio/CertificationsSection";
import {
  navItems,
  NavItem,
  Project,
  skillGroups,
  socialLinks,
  SocialLink,
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

const headingWordVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.88 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 130,
      damping: 15,
      mass: 0.7,
    },
  },
};

const arsenalHeadingWordVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.92,
    transition: {
      duration: 0.32,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  visible: {
    ...headingWordVariants.visible,
    transition: {
      ...headingWordVariants.visible.transition,
      stiffness: 150,
    },
  },
};

function SectionLabel({ index, children }: { index: string; children: React.ReactNode }) {
  if (["01", "02", "03", "04", "05", "06", "07", "08"].includes(index)) {
    return null;
  }
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
  const [formData, setFormData] = useState({ name: "", email: "", message: "", website: "" });
  const messageTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [skillQuery, setSkillQuery] = useState("");
  const [activeSkillCategory, setActiveSkillCategory] = useState("All skills");
  const [showIntro, setShowIntro] = useState(true);

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
  }, []);

  useEffect(() => {
    const textarea = messageTextareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [formData.message]);

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
          website: formData.website.trim(),
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        const errorMsg =
          data?.error || "Something went wrong. Please try again.";
        setFormError(errorMsg);
        return;
      }

      setFormData({ name: "", email: "", message: "", website: "" });
      setSent(true);
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const arsenalSkills = useMemo<ArsenalSkill[]>(
    () =>
      skillGroups.flatMap((group) =>
        group.items.map((name) => ({
          name,
          category: group.label,
        }))
      ),
    []
  );
  const skillCategories = useMemo(
    () => [
      "All skills",
      ...skillGroups
        .filter((group) => group.items.length > 0)
        .map((group) => group.label),
    ],
    []
  );
  const visibleSkills = useMemo(() => {
    const query = skillQuery.trim().toLowerCase();
    return arsenalSkills.filter((skill) => {
      const matchesCategory =
        activeSkillCategory === "All skills" ||
        skill.category === activeSkillCategory;
      const searchable = [skill.name, skill.category].join(" ").toLowerCase();
      return matchesCategory && (!query || searchable.includes(query));
    });
  }, [activeSkillCategory, arsenalSkills, skillQuery]);

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
      {showIntro && <IntroLoader onComplete={handleIntroComplete} />}
      <SmoothScroll />
      <header className={`site-nav ${scrolled ? "is-scrolled" : ""}`}>
        <a
          href="#top"
          className="brand-logo"
          onClick={(e) => {
            e.preventDefault();
            jumpTo("#top");
          }}
          aria-label="Kartik Manjunath Nilekani - Back to top"
        >
          <svg className="brand-logo__stripes" width="22" height="18" viewBox="0 0 22 18" fill="none" aria-hidden="true">
            <path d="M4 18L10 0H7L1 18H4Z" fill="#EA5B24" />
            <path d="M10 18L16 0H13L7 18H10Z" fill="#ffffff" />
            <path d="M16 18L22 0H19L13 18H16Z" fill="#EA5B24" />
          </svg>
          <span className="brand-logo__badge">KMN</span>
          <div className="brand-logo__text">
            <span className="brand-logo__name">KARTIK</span>
            <span className="brand-logo__sub">MANJUNATH NILEKANI</span>
          </div>
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
            LET’S CONNECT <ArrowUpRight size={12} />
          </a>
        </nav>
        <div className="site-nav__controls">
          <SideNavigation activeSection={activeSection} jumpTo={jumpTo} />
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
              CURIOUS.
              <br />
              BUILDING.
              <br />
              <span className="hero__title-row">
                ALWAYS <em>LEARNING.</em>
              </span>
            </motion.h1>
            <motion.p {...reveal(reduced, 0.24)} className="hero__lead">
              I build practical software, intelligent systems, and experiences that solve real problems.
            </motion.p>
            <div className="hero__actions">
              <button type="button" className="button button--primary" onClick={() => jumpTo("#projects")}>
                View projects <ArrowDownRight size={16} />
              </button>
              <a
                className="button button--ghost"
                href="/kartiknilekani-resume.pdf?v=2"
                target="_blank"
                rel="noopener noreferrer"
                download="kartiknilekani-resume.pdf"
              >
                Download Resume <ArrowUpRight size={16} />
              </a>
            </div>
            <div className="hero__socials">
              {socialLinks.map((link: SocialLink) => (
                <a
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
                </a>
              ))}
            </div>
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

        <AboutSection SectionLabel={SectionLabel} jumpTo={jumpTo} />

        <EducationSection SectionLabel={SectionLabel} />


        <section id="skills" className="section-shell section-shell--dark arsenal-section" aria-labelledby="skills-title">
          <div className="section-rail">
            <p className="rail-note">Tools chosen for <br />the work at hand.</p>
          </div>
          <div className="skills-content">
            <motion.div
              className="arsenal-header"
              initial={reduced ? false : { opacity: 0.9, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.48, ease: cinematicEasing as any }}
            >
              <div className="arsenal-header__left">

                <h2 id="skills-title" className="arsenal-display-title">
                  <motion.span
                    className="arsenal-display-title__solid"
                    style={{ display: "block" }}
                    variants={{
                      hidden: {
                        transition: {
                          staggerChildren: 0.05,
                          staggerDirection: -1,
                        },
                      },
                      visible: {
                        transition: {
                          staggerChildren: 0.07,
                          delayChildren: 0.06,
                        },
                      },
                    }}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.span
                      variants={arsenalHeadingWordVariants as any}
                      style={{ display: "inline-block", transformOrigin: "center bottom" }}
                    >
                      TECHNICAL
                    </motion.span>
                  </motion.span>
                  <motion.span
                    className="arsenal-display-title__orange"
                    style={{ display: "block" }}
                    variants={{
                      hidden: {
                        transition: {
                          staggerChildren: 0.05,
                          staggerDirection: -1,
                        },
                      },
                      visible: {
                        transition: {
                          staggerChildren: 0.07,
                          delayChildren: 0.18,
                        },
                      },
                    }}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.span
                      variants={arsenalHeadingWordVariants as any}
                      style={{ display: "inline-block", transformOrigin: "center bottom" }}
                    >
                      ARSENAL.
                    </motion.span>
                  </motion.span>
                </h2>

                <p className="arsenal-display-sub">
                  TOOLS &times; TECHNOLOGIES &times; SKILLS
                </p>
              </div>

              <div className="arsenal-header__right">
                <div className="arsenal-header__intro">
                  <p className="arsenal-intro-line-1">
                    A curated set of technologies, tools, and frameworks
                  </p>







                  <p className="arsenal-intro-line-2">
                    I work to build, learn, and create.
                  </p>







                </div>

                <div className="arsenal-manifesto">
                  <span className="arsenal-manifesto__bar" aria-hidden="true" />
                  <div className="arsenal-manifesto__words">
                    <span>SAME</span>
                    <span>TOOLS.</span>
                    <span>BIGGER</span>
                    <span>POSSIBILITIES.</span>
                  </div>
                </div>
              </div>
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
            <div className="arsenal-meta">
              <span>
                <b>{visibleSkills.length.toString().padStart(2, "0")}</b> DISPLAYED / <b>{arsenalSkills.length.toString().padStart(2, "0")}</b> TOTAL <b>SKILLS</b>
              </span>
            </div>
            <motion.div layout className="arsenal-grid" aria-live="polite">
              <AnimatePresence mode="popLayout" initial={!reduced}>
                {visibleSkills.map((skill, index) => <SkillCard key={skill.name} skill={skill} reduced={reduced} />)}
              </AnimatePresence>
            </motion.div>
            {visibleSkills.length === 0 && <motion.div {...reveal(reduced)} className="arsenal-empty"><span className="mono">No match / 00</span><h3>Nothing in the current set.</h3><p>Try a different search term or return to all skills.</p><button type="button" onClick={() => { setSkillQuery(""); setActiveSkillCategory("All skills"); }} suppressHydrationWarning>Reset filters <ArrowUpRight size={14} /></button></motion.div>}
          </div>
        </section>


        <ProjectsSection onOpen={setSelectedProject} />

        <ExperienceSection />

        <CertificationsSection />

        <CurrentFocusSection SectionLabel={SectionLabel} />

        <ScrollSection id="contact" className="section-shell section-shell--contact" aria-labelledby="contact-title">
          <div className="contact-glow" aria-hidden="true" />
          <div className="section-rail contact-rail">
            <p className="rail-note">Open to useful <br />conversations.</p>
          </div>
          <div className="contact-content">
            <motion.div {...reveal(reduced)}>
              <h2 id="contact-title" aria-label="Let’s build something useful.">
                <motion.span
                  style={{ display: "block" }}
                  variants={{
                    hidden: {},
                    visible: {
                      transition: {
                        staggerChildren: 0.07,
                        delayChildren: 0.06,
                      },
                    },
                  }}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.25 }}
                >
                  {["Let’s", "build", "something"].map((word, index) => (
                    <span
                      key={`contact-heading-${index}`}
                      style={{
                        display: "inline-block",
                        overflow: "visible",
                        marginRight: "0.28em",
                      }}
                    >
                      <motion.span
                        variants={headingWordVariants}
                        style={{
                          display: "inline-block",
                          color: word === "something" ? "#EA5B24" : undefined,
                          transformOrigin: "center bottom",
                        }}
                      >
                        {word}
                      </motion.span>
                    </span>
                  ))}
                  <span style={{ display: "inline-block", overflow: "visible" }}>
                    <motion.em
                      variants={headingWordVariants}
                      style={{
                        display: "inline-block",
                        transformOrigin: "center bottom",
                      }}
                    >
                      useful.
                    </motion.em>
                  </span>
                </motion.span>
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
                  <div className="sr-only" aria-hidden="true" style={{ display: "none" }}>
                    <label htmlFor="website">Website</label>
                    <input
                      id="website"
                      name="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={formData.website}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, website: e.target.value }))
                      }
                    />
                  </div>
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
                      ref={messageTextareaRef}
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
        <span className="footer-center">Learn. Build. Fail. Improve. Repeat.</span>
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

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Github,
  Linkedin,
  Mail,
  Menu,
  MoveUpRight,
  Radio,
  Send,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  certifications,
  Certification,
  currentFocus,
  navItems,
  NavItem,
  projects,
  Project,
  skillGroups,
  SkillGroup,
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
        initial: { opacity: 0, y: 36, scale: 0.996 },
        whileInView: { opacity: 1, y: 0, scale: 1 },
        viewport: { once: true, amount: 0.18 },
        transition: { duration: 0.9, delay, ease: cinematicEasing as any },
      };

function SectionLabel({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <div className="section-label">
      <span className="section-label__index">{index}</span>
      <span>{children}</span>
    </div>
  );
}

function IconForLink({ label }: { label: string }) {
  if (label === "GitHub") return <Github size={16} />;
  if (label === "LinkedIn") return <Linkedin size={16} />;
  return <Mail size={16} />;
}

function Architecture() {
  const nodes = ["User", "Frontend", "API layer", "Backend", "Database"];
  return (
    <div className="architecture" aria-label="BloodLink architecture: User to Frontend to API layer to Backend to Database">
      <div className="architecture__header">
        <span>System sketch</span>
        <span className="mono">bloodlink / v1</span>
      </div>
      <div className="architecture__flow">
        {nodes.map((node: string, index: number) => (
          <div className="architecture__node-wrap" key={node}>
            <div className={`architecture__node ${index === nodes.length - 1 ? "is-final" : ""}`}>
              <span className="architecture__dot" />
              {node}
            </div>
            {index < nodes.length - 1 && (
              <div className="architecture__connector">
                <span />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="architecture__integrations">
        <span>External APIs</span>
        <span>Real-time services</span>
        <span>Auth layer</span>
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  onOpen,
  reduced,
}: {
  project: Project;
  onOpen: (project: Project) => void;
  reduced: boolean | null | undefined;
}) {
  return (
    <motion.article className={`project-card project-card--${project.accent}`} {...reveal(reduced)}>
      <div className="project-card__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <motion.img
          src={project.image}
          alt={`${project.name} conceptual visual`}
          loading="lazy"
          style={{ willChange: "transform, opacity" }}
          whileHover={reduced ? undefined : { scale: 1.045, translateY: -6 }}
          transition={{ duration: 0.7, ease: cinematicEasing as any }}
        />
        <div className="project-card__media-overlay" />
        <span className="project-card__index">{project.index}</span>
        <span className="project-card__media-note">selected work / {project.kicker}</span>
      </div>
      <div className="project-card__body">
        <div className="project-card__heading">
          <div>
            <p className="eyebrow">{project.kicker}</p>
            <h3>{project.name}</h3>
          </div>
          <button
            className="circle-button"
            aria-label={`Open case study for ${project.name}`}
            onClick={() => onOpen(project)}
          >
            <ArrowUpRight size={18} />
          </button>
        </div>
        <p className="project-card__description">{project.description}</p>
        <div className="project-card__details">
          <div>
            <span className="detail-label">Problem</span>
            <p>{project.problem}</p>
          </div>
          <div>
            <span className="detail-label">Solution</span>
            <p>{project.solution}</p>
          </div>
        </div>
        <div className="project-card__footer">
          <div className="tag-row">
            {project.stack.map((item: string) => (
              <span className="tag" key={item}>
                {item}
              </span>
            ))}
          </div>
          <button className="text-button" onClick={() => onOpen(project)}>
            View case study <MoveUpRight size={14} />
          </button>
        </div>
      </div>
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

  const sections = useMemo(
    () => ["about", "skills", "projects", "experience", "education", "contact"],
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

  // lazy-load parallax hook client-side only
  useEffect(() => {
    let mounted = true;
    if (typeof window === "undefined" || reduced) return;
    // dynamic import to avoid SSR issues
    import("@/hooks/useScrollParallax").then((m) => {
      if (!mounted) return;
      try {
        const useScrollParallax = m.default;
        useScrollParallax(heroSignalRef, 0.06);
        useScrollParallax(heroOrbitOneRef, 0.035);
        useScrollParallax(heroOrbitTwoRef, 0.05);
      } catch (e) {
        // noop
      }
    });
    return () => {
      mounted = false;
    };
  }, [reduced]);

  const jumpTo = (href: string) => {
    setMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <div className="site-shell">
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
        <button
          className="menu-toggle"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
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
              <a className="button button--ghost" href="/resume/Kartik-Manjunath-Nilekani-Resume.pdf" download>
                Download resume <ArrowUpRight size={16} />
              </a>
            </motion.div>
            <motion.div {...reveal(reduced, 0.36)} className="hero__socials">
              {socialLinks.map((link: SocialLink) => (
                <a
                  href={link.href}
                  key={link.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${link.label} — ${link.note}`}
                >
                  <IconForLink label={link.label} />
                  {link.label}
                </a>
              ))}
            </motion.div>
          </div>
            <motion.div {...reveal(reduced, 0.22)} className="hero__diagram" aria-hidden="true">
            <div ref={heroOrbitOneRef} className="hero__orbit hero__orbit--one parallax-layer" />
            <div ref={heroOrbitTwoRef} className="hero__orbit hero__orbit--two parallax-layer" />
            <div ref={heroSignalRef} className="hero__signal-card parallax-layer">
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
            </div>
            <div className="hero__node hero__node--a" />
            <div className="hero__node hero__node--b" />
            <div className="hero__node hero__node--c" />
          </motion.div>
          <div className="hero__scroll mono">
            <span>Scroll to inspect</span>
            <ChevronDown size={14} />
          </div>
        </section>

        <section id="about" className="section-shell section-shell--light" aria-labelledby="about-title">
          <div className="section-rail">
            <SectionLabel index="01">About me</SectionLabel>
            <p className="rail-note">
              A student builder
              <br />
              with a systems lens.
            </p>
          </div>
          <div className="about-layout">
            <motion.div {...reveal(reduced)} className="about-copy">
              <p className="eyebrow">The short version</p>
              <h2 id="about-title">
                Useful software starts with a <em>clear problem.</em>
              </h2>
              <p className="lede">
                I’m Kartik, a Computer Science & Business Systems student at Srinivas Institute of Technology, learning by designing and shipping practical products.
              </p>
              <p>
                I’m drawn to full-stack development, AI/ML, generative AI, data, and FinTech — especially where a thoughtful interface can make a complex system easier to use. Away from the screen, photography and videography help me keep an eye for framing, timing, and detail.
              </p>
              <div className="about-meta">
                <span>
                  <b>01</b> Srinivas Institute of Technology
                </span>
                <span>
                  <b>02</b> 2023—2027 / Mangalore
                </span>
              </div>
            </motion.div>
            <motion.div {...reveal(reduced, 0.12)} className="portrait-placeholder">
              <div className="portrait-placeholder__ring" />
              <div className="portrait-placeholder__initials">KMN</div>
              <div className="portrait-placeholder__caption"><span>Profile image</span><small>Kartik Manjunath Nilekani</small></div>
            </motion.div>
          </div>
        </section>

        <section id="skills" className="section-shell section-shell--dark" aria-labelledby="skills-title">
          <div className="section-rail">
            <SectionLabel index="02">Technical arsenal</SectionLabel>
            <p className="rail-note">
              Tools chosen for
              <br />
              the work at hand.
            </p>
          </div>
          <div className="skills-content">
            <motion.div {...reveal(reduced)} className="section-heading">
              <p className="eyebrow">Comfortable across the stack</p>
              <h2 id="skills-title">
                A toolkit that keeps
                <br />
                <em>moving with the problem.</em>
              </h2>
            </motion.div>
            <div className="skill-grid">
              {skillGroups.map((group: SkillGroup, i: number) => (
                <motion.div key={group.label} {...reveal(reduced, i * 0.04)} className="skill-group">
                  <div className="skill-group__top">
                    <span className="mono">0{i + 1}</span>
                    <h3>{group.label}</h3>
                  </div>
                  <div className="tag-row">
                    {group.items.map((item: string) => (
                      <span className="tag tag--dark" key={item}>
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="section-shell section-shell--light projects-section" aria-labelledby="projects-title">
          <div className="section-rail">
            <SectionLabel index="03">Selected projects</SectionLabel>
            <p className="rail-note">
              From emergency response
              <br />
              to voice interfaces.
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
              <p className="heading-note">
                Three explorations across full-stack systems, speech interaction, and wayfinding.
              </p>
            </motion.div>
            <div className="project-list">
              {projects.map((project: Project) => (
                <ProjectCard key={project.id} project={project} onOpen={setSelectedProject} reduced={reduced} />
              ))}
            </div>
            <motion.div {...reveal(reduced)} className="architecture-wrap">
              <div>
                <p className="eyebrow">Inside the featured system</p>
                <h3>Architecture that stays legible.</h3>
                <p>
                  BloodLink keeps the user journey simple while connecting the layers needed for secure, real-time coordination.
                </p>
              </div>
              <Architecture />
            </motion.div>
          </div>
        </section>

        <section id="experience" className="section-shell section-shell--dark" aria-labelledby="experience-title">
          <div className="section-rail">
            <SectionLabel index="04">Experience</SectionLabel>
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
        </section>

        <section id="education" className="section-shell section-shell--light" aria-labelledby="education-title">
          <div className="section-rail">
            <SectionLabel index="05">Education & signals</SectionLabel>
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
            <div className="cert-layout">
              <motion.div {...reveal(reduced)}>
                <p className="eyebrow">Certifications</p>
                <h3>Signals of continued learning.</h3>
              </motion.div>
              <div className="cert-list">
                {certifications.map((cert: Certification, index: number) => (
                  <motion.div
                    key={cert.name}
                    {...reveal(reduced, index * 0.05)}
                    className="cert-row"
                  >
                    <div className="cert-row__icon">
                      <Check size={15} />
                    </div>
                    <div>
                      <h4>{cert.name}</h4>
                      <p>
                        {cert.issuer} · {cert.year}
                      </p>
                      <small>{cert.detail}</small>
                    </div>
                    <ArrowUpRight size={15} className="cert-row__arrow" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell section-shell--warm" aria-labelledby="focus-title">
          <div className="section-rail">
            <SectionLabel index="06">Current focus</SectionLabel>
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
                <motion.div key={`${index}-${item}`} {...reveal(reduced, index * 0.04)} className="focus-item">
                  <span className="mono">0{index + 1}</span>
                  <span>{item}</span>
                  <ArrowUpRight size={16} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="section-shell section-shell--contact" aria-labelledby="contact-title">
          <div className="contact-glow" aria-hidden="true" />
          <div className="contact-content">
            <motion.div {...reveal(reduced)}>
              <SectionLabel index="07">Contact</SectionLabel>
              <h2 id="contact-title">
                Let’s build something <em>useful.</em>
              </h2>
              <p>Have an opportunity, project, or idea? I’d be happy to connect.</p>
              <div className="contact-links">
                {socialLinks.map((link: SocialLink) => (
                  <a href={link.href} key={link.label} target="_blank" rel="noopener noreferrer">
                    <IconForLink label={link.label} />
                    {link.label}
                    <ArrowUpRight size={14} />
                  </a>
                ))}
              </div>
            </motion.div>
            <motion.form
              {...reveal(reduced, 0.12)}
              className="contact-form"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              noValidate
            >
              {sent ? (
                <div className="form-success">
                  <div className="form-success__icon">
                    <Check />
                  </div>
                  <h3>Message interface ready.</h3>
                  <p>
                    Thank you for reaching out! In this environment, your message validation is complete.
                  </p>
                  <button type="button" className="text-button" onClick={() => setSent(false)}>
                    Send another <ArrowUpRight size={14} />
                  </button>
                </div>
              ) : (
                <>
                  <label htmlFor="name">
                    Name
                    <input id="name" name="name" placeholder="Your name" required minLength={2} />
                  </label>
                  <label htmlFor="email">
                    Email
                    <input id="email" name="email" type="email" placeholder="you@example.com" required />
                  </label>
                  <label htmlFor="message">
                    Message
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      placeholder="Tell me about the opportunity or idea..."
                      required
                      minLength={10}
                    />
                  </label>
                  <button className="button button--primary form-submit" type="submit">
                    Send message <Send size={15} />
                  </button>
                  <p className="form-note">
                    <Radio size={13} /> Client-side validation enabled
                  </p>
                </>
              )}
            </motion.form>
          </div>
        </section>
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

      {selectedProject && (
        <div className="modal-backdrop" role="presentation" onClick={() => setSelectedProject(null)}>
          <motion.div
            {...(reduced
              ? {}
              : {
                  initial: { opacity: 0, y: 20, scale: 0.98 },
                  animate: { opacity: 1, y: 0, scale: 1 },
                  transition: { duration: 0.35 },
                })}
            className="case-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              aria-label="Close case study"
              onClick={() => setSelectedProject(null)}
            >
              <X size={19} />
            </button>
            <div className="case-modal__top">
              <span className="eyebrow">Case study / {selectedProject.index}</span>
              <h2 id="case-title">{selectedProject.name}</h2>
              <p>{selectedProject.description}</p>
            </div>
            <div className="case-modal__grid">
              <div>
                <span className="detail-label">Problem</span>
                <p>{selectedProject.problem}</p>
              </div>
              <div>
                <span className="detail-label">Solution</span>
                <p>{selectedProject.solution}</p>
              </div>
            </div>
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
            {selectedProject.id === "bloodlink" && <Architecture />}
            <div className="tag-row">
              {selectedProject.stack.map((item: string) => (
                <span className="tag" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

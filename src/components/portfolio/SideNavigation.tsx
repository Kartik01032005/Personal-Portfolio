"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Menu, X, ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { socialLinks } from "@/data/portfolio";

interface SideNavigationProps {
  activeSection: string;
  jumpTo: (href: string) => void;
}

const sideNavItems = [
  { index: "01", label: "About Me", href: "#about", id: "about" },
  { index: "02", label: "Education", href: "#education", id: "education" },
  { index: "03", label: "Skills", href: "#skills", id: "skills" },
  { index: "04", label: "Projects", href: "#projects", id: "projects" },
  { index: "05", label: "Experience", href: "#experience", id: "experience" },
  { index: "06", label: "Certifications", href: "#certifications", id: "certifications" },
  { index: "07", label: "Contact", href: "#contact", id: "contact" },
];

const panelVariants: Variants = {
  closed: {
    x: "100%",
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as const,
      when: "afterChildren",
    },
  },
  open: {
    x: "0%",
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1] as const,
      staggerChildren: 0.04,
      delayChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  closed: { opacity: 0, x: 24 },
  open: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function SideNavigation({ activeSection, jumpTo }: SideNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    jumpTo(href);
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="side-nav-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <motion.aside
            className="side-nav-panel"
            variants={panelVariants}
            initial="closed"
            animate="open"
            exit="closed"
            role="dialog"
            aria-label="Side Navigation Menu"
          >
            <div className="side-nav-panel__header">
              <span className="side-nav-panel__title mono">
                NAVIGATION / 07
              </span>
              <button
                type="button"
                className="side-nav-panel__close"
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
                suppressHydrationWarning
              >
                <X size={18} />
              </button>
            </div>

            <nav className="side-nav-panel__list">
              {sideNavItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <motion.div
                    key={item.href}
                    variants={itemVariants}
                    className="side-nav-panel__item-wrap"
                  >
                    <button
                      type="button"
                      className={`side-nav-panel__item ${
                        isActive ? "is-active" : ""
                      }`}
                      onClick={() => handleNavClick(item.href)}
                    >
                      <span className="side-nav-panel__index mono">
                        {item.index}
                      </span>
                      <span className="side-nav-panel__label">
                        {item.label}
                      </span>
                      {isActive && (
                        <span
                          className="side-nav-panel__active-dot"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  </motion.div>
                );
              })}
            </nav>

            <div className="side-nav-panel__footer">
              <div className="side-nav-panel__socials">
                <a
                  href="https://github.com/Kartik01032005"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="side-nav-social-link"
                  aria-label="GitHub profile"
                >
                  <Github size={15} />
                  <span>GitHub</span>
                  <ArrowUpRight size={13} className="side-nav-social-arrow" />
                </a>
                <a
                  href="https://www.linkedin.com/in/kartik-nilekani-287a6329b/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="side-nav-social-link"
                  aria-label="LinkedIn profile"
                >
                  <Linkedin size={15} />
                  <span>LinkedIn</span>
                  <ArrowUpRight size={13} className="side-nav-social-arrow" />
                </a>
                <a
                  href="mailto:kartiknilekani568@gmail.com"
                  className="side-nav-social-link"
                  aria-label="Send an email"
                >
                  <Mail size={15} />
                  <span>Mail</span>
                  <ArrowUpRight size={13} className="side-nav-social-arrow" />
                </a>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* Compact Navbar Trigger Button */}
      <button
        type="button"
        className="side-nav-trigger"
        aria-label={isOpen ? "Close side navigation" : "Open side navigation"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        suppressHydrationWarning
      >
        <span className="side-nav-trigger__text">
          {isOpen ? "CLOSE" : "MENU"}
        </span>
        <span className="side-nav-trigger__icon">
          {isOpen ? <X size={16} /> : <Menu size={16} />}
        </span>
      </button>

      {/* Portal Overlay mounted directly on document.body */}
      {mounted ? createPortal(modalContent, document.body) : null}
    </>
  );
}

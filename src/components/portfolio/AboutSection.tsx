"use client";

import { ArrowDownRight, ArrowUpRight } from "lucide-react";

interface AboutSectionProps {
  SectionLabel: React.ComponentType<{ index: string; children: React.ReactNode }>;
  jumpTo: (href: string) => void;
}

const text1 =
  "I'm Kartik Manjunath Nilekani — a Computer Science and Business Systems engineering student passionate about building practical solutions at the intersection of software, data analytics, finance, and AI. I enjoy transforming ideas into meaningful digital products and exploring how technology can solve real-world problems.";

const text2 =
  "I work with modern web technologies and AI tools, continuously expanding my skills through hands-on projects, internships, hackathons, and experimentation. My goal is to combine technical thinking with business and analytical perspectives to build solutions that are useful, practical, and impactful.";

export function AboutSection({ SectionLabel, jumpTo }: AboutSectionProps) {
  return (
    <section
      id="about"
      className="section-shell section-shell--light about-section"
      aria-labelledby="about-title"
    >
      <div className="section-rail">
        <p className="rail-note">A practical builder with a wide lens.</p>
      </div>
      <div className="about-main">
        <div className="about-section-heading">
          <p className="eyebrow">Profile / foundation</p>
          <h2 id="about-title">
            About <span>Me.</span>
          </h2>
        </div>
        <div className="about-layout">
          <div className="about-portrait">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/profile.jpg"
              alt="Kartik Manjunath Nilekani"
              className="about-portrait__img"
              loading="lazy"
            />
          </div>
          <div className="about-copy">
            <p className="lede">{text1}</p>
            <p>{text2}</p>
            <div className="about-meta">
              <span>
                <b>01</b> Srinivas Institute of Technology
              </span>
              <span>
                <b>02</b> 2023—2027 / Mangalore
              </span>
            </div>
            <div className="about-actions">
              <a
                className="button button--primary"
                href="/kartiknilekani-resume.pdf?v=2"
                target="_blank"
                rel="noopener noreferrer"
                download="kartiknilekani-resume.pdf"
              >
                Download Resume <ArrowUpRight size={16} />
              </a>
              <button
                className="button button--outline"
                type="button"
                onClick={() => jumpTo("#experience")}
                suppressHydrationWarning
              >
                Learn more about me <ArrowDownRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

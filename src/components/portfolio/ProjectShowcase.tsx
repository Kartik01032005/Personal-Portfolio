"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Github, ExternalLink, X, Check, Activity, Layers, Terminal } from "lucide-react";
import { projects, Project } from "@/data/portfolio";

export function ProjectShowcase() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div className="project-showcase">
      <div className="project-cards-grid">
        {projects.map((project, idx) => (
          <article
            key={project.id}
            className={`cinematic-project-card cinematic-project-card--${project.accent}`}
            onClick={() => setSelectedProject(project)}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelectedProject(project);
              }
            }}
          >
            {/* Card Frame Viewport */}
            <div className="project-card-frame" data-frame>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.image}
                alt={`${project.name} system diagram`}
                loading="lazy"
                className="project-card-frame__img"
              />
              <div className="project-card-frame__overlay" />
              
              <div className="project-card-frame__badge">
                <span className="badge-num">{project.index}</span>
                <span className="badge-kicker">{project.kicker}</span>
              </div>

              <div className="project-card-frame__action">
                <span>View System Architecture</span>
                <div className="action-circle">
                  <ArrowUpRight size={14} />
                </div>
              </div>
            </div>

            {/* Card Metadata */}
            <div className="project-card-info">
              <div className="project-card-info__top">
                <span className="project-index-tag">0{idx + 1} / 0{projects.length}</span>
                <span className="project-kicker-tag">{project.kicker}</span>
              </div>

              <h3 className="project-title">{project.name}</h3>
              <p className="project-subtitle">{project.subtitle}</p>
              <p className="project-desc">{project.description}</p>

              {/* Stack Pills */}
              <div className="project-stack">
                {project.stack.slice(0, 5).map((tech) => (
                  <span key={tech} className="tech-pill">
                    {tech}
                  </span>
                ))}
                {project.stack.length > 5 && (
                  <span className="tech-pill tech-pill--more">
                    +{project.stack.length - 5}
                  </span>
                )}
              </div>

              {/* Quick Metrics */}
              {project.metrics && (
                <div className="project-metrics-row">
                  {project.metrics.map((m) => (
                    <div key={m.label} className="metric-chip">
                      <span className="metric-chip__val">{m.value}</span>
                      <span className="metric-chip__lbl">{m.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Case Study Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="case-study-backdrop" onClick={() => setSelectedProject(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 30 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="case-study-modal"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              {/* Modal Header */}
              <div className="case-study-modal__header">
                <div>
                  <div className="modal-kicker-row">
                    <span className="modal-num">{selectedProject.index}</span>
                    <span className="modal-kicker">{selectedProject.kicker}</span>
                  </div>
                  <h2 className="modal-title">{selectedProject.name}</h2>
                  <p className="modal-sub">{selectedProject.subtitle}</p>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="modal-close-button"
                  aria-label="Close case study"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="case-study-modal__scroll">
                {/* Media Hero */}
                <div className="modal-media-hero">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedProject.image}
                    alt={`${selectedProject.name} architecture overview`}
                    className="modal-media-img"
                  />
                  <div className="modal-media-scrim" />
                </div>

                {/* Problem vs Solution Split */}
                <div className="modal-grid-2">
                  <div className="modal-panel modal-panel--problem">
                    <div className="panel-badge">
                      <Activity size={13} />
                      <span>The Problem & Friction</span>
                    </div>
                    <p>{selectedProject.problem}</p>
                  </div>
                  <div className="modal-panel modal-panel--solution">
                    <div className="panel-badge panel-badge--solution">
                      <Check size={13} />
                      <span>The Engineered Solution</span>
                    </div>
                    <p>{selectedProject.solution}</p>
                  </div>
                </div>

                {/* Architecture Flow */}
                {selectedProject.architecture && (
                  <div className="modal-architecture-section">
                    <div className="section-head-mini">
                      <Layers size={14} />
                      <span>System Architecture Pipeline</span>
                    </div>
                    <div className="arch-flow-diagram">
                      {selectedProject.architecture.nodes.map((node, i, arr) => (
                        <div key={node} className="arch-step">
                          <div className="arch-node">
                            <span className="arch-dot" />
                            <span className="arch-node-name">{node}</span>
                          </div>
                          {i < arr.length - 1 && <div className="arch-connector" />}
                        </div>
                      ))}
                    </div>
                    {selectedProject.architecture.integrations && (
                      <div className="arch-integrations-bar">
                        <span className="int-label">Integrated Protocols:</span>
                        {selectedProject.architecture.integrations.map((item) => (
                          <span key={item} className="int-tag">
                            {item}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Key Capabilities */}
                <div className="modal-features-section">
                  <div className="section-head-mini">
                    <Terminal size={14} />
                    <span>Key Capabilities & Subsystems</span>
                  </div>
                  <ul className="modal-features-list">
                    {selectedProject.features.map((feat) => (
                      <li key={feat} className="modal-feature-item">
                        <span className="feature-marker" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Full Stack Chips */}
                <div className="modal-stack-section">
                  <div className="section-head-mini">
                    <span>Technologies & Tools</span>
                  </div>
                  <div className="modal-stack-chips">
                    {selectedProject.stack.map((s) => (
                      <span key={s} className="stack-chip">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="case-study-modal__footer">
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="modal-footer-btn modal-footer-btn--gh"
                  >
                    <Github size={15} />
                    <span>View Repository</span>
                    <ArrowUpRight size={13} />
                  </a>
                )}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="modal-footer-btn modal-footer-btn--primary"
                >
                  Close Case Study
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Sparkles, Code2, ArrowUpRight, Check, X, Layers, Cpu, Database, Terminal, Compass } from "lucide-react";
import { skillItems, SkillItem } from "@/data/portfolio";

const categories = [
  { id: "all", label: "All Skills", icon: Layers, count: skillItems.length },
  { id: "languages", label: "Languages", icon: Code2, count: skillItems.filter(s => s.category === "languages").length },
  { id: "fullstack", label: "Full-Stack", icon: Terminal, count: skillItems.filter(s => s.category === "fullstack").length },
  { id: "ai", label: "AI & Intelligence", icon: Cpu, count: skillItems.filter(s => s.category === "ai").length },
  { id: "databases", label: "Cloud & Data", icon: Database, count: skillItems.filter(s => s.category === "databases").length },
  { id: "core", label: "Systems & Core", icon: Compass, count: skillItems.filter(s => s.category === "core" || s.category === "systems").length },
];

export function SkillsGallery() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(null);

  const filteredSkills = useMemo(() => {
    return skillItems.filter((skill) => {
      const matchesCategory =
        activeCategory === "all" ||
        skill.category === activeCategory ||
        (activeCategory === "core" && (skill.category === "core" || skill.category === "systems"));

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        skill.name.toLowerCase().includes(query) ||
        skill.description.toLowerCase().includes(query) ||
        skill.tags.some((t) => t.toLowerCase().includes(query)) ||
        (skill.appliedIn && skill.appliedIn.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="skills-gallery" id="skills-catalog">
      {/* Top Search & Filter Bar */}
      <div className="skills-gallery__controls">
        <div className="skills-gallery__search">
          <Search className="search-icon" size={16} />
          <input
            type="text"
            placeholder="Search technologies, tags, or concepts (e.g. TypeScript, Graph, Next.js, Postgres)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search skills"
            className="skills-search-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="clear-search-btn"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="skills-gallery__pills" role="tablist">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(cat.id)}
                className={`skill-pill ${isActive ? "is-active" : ""}`}
              >
                <Icon size={13} className="pill-icon" />
                <span>{cat.label}</span>
                <span className="pill-count">{cat.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Result Status Line */}
      <div className="skills-gallery__status">
        <span>
          Showing <strong>{filteredSkills.length}</strong> of {skillItems.length} verified technologies
        </span>
        <span className="skills-status-hint">
          Click any card to inspect architectural application
        </span>
      </div>

      {/* Skill Grid */}
      <motion.div layout className="skills-grid">
        <AnimatePresence mode="popLayout">
          {filteredSkills.map((skill, index) => (
            <motion.div
              layout
              key={skill.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.3) }}
              onClick={() => setSelectedSkill(skill)}
              className={`skill-card ${skill.highlight ? "is-highlight" : ""}`}
              tabIndex={0}
              role="button"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedSkill(skill);
                }
              }}
            >
              <div className="skill-card__header">
                <div className="skill-card__cat-wrap">
                  <span className="skill-card__category">{skill.categoryLabel}</span>
                  {skill.highlight && (
                    <span className="skill-card__badge">
                      <Sparkles size={11} />
                      Core
                    </span>
                  )}
                </div>
                <span className={`skill-card__level level--${skill.level.toLowerCase()}`}>
                  {skill.level}
                </span>
              </div>

              <h4 className="skill-card__title">{skill.name}</h4>
              <p className="skill-card__desc">{skill.description}</p>

              {skill.appliedIn && (
                <div className="skill-card__applied">
                  <span className="applied-dot" />
                  <span className="applied-text">{skill.appliedIn}</span>
                </div>
              )}

              <div className="skill-card__tags">
                {skill.tags.map((tag) => (
                  <span key={tag} className="skill-tag">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="skill-card__footer">
                <span className="inspect-label">Inspect Context</span>
                <ArrowUpRight size={14} className="inspect-arrow" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty Search Fallback */}
      {filteredSkills.length === 0 && (
        <div className="skills-gallery__empty">
          <p>No technologies matched &ldquo;{searchQuery}&rdquo;</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("all");
            }}
            className="reset-skills-btn"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Skill Detail Modal */}
      <AnimatePresence>
        {selectedSkill && (
          <div className="skill-modal-backdrop" onClick={() => setSelectedSkill(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="skill-modal"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              <div className="skill-modal__header">
                <div>
                  <span className="skill-card__category">{selectedSkill.categoryLabel}</span>
                  <h3>{selectedSkill.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="modal-close-btn"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="skill-modal__body">
                <div className="modal-meta-row">
                  <div>
                    <span className="meta-label">Proficiency</span>
                    <span className="meta-value">{selectedSkill.level}</span>
                  </div>
                  <div>
                    <span className="meta-label">Domain</span>
                    <span className="meta-value">{selectedSkill.categoryLabel}</span>
                  </div>
                </div>

                <div className="modal-section">
                  <h5>Technical Overview</h5>
                  <p>{selectedSkill.description}</p>
                </div>

                {selectedSkill.appliedIn && (
                  <div className="modal-section modal-section--applied">
                    <h5>Project Application & Evidence</h5>
                    <p>{selectedSkill.appliedIn}</p>
                  </div>
                )}

                <div className="modal-section">
                  <h5>Associated Concepts & Libraries</h5>
                  <div className="modal-tags">
                    {selectedSkill.tags.map((t) => (
                      <span key={t} className="skill-tag">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="skill-modal__footer">
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="modal-action-btn"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

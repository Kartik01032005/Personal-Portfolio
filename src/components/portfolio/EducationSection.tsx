"use client";

interface EducationSectionProps {
  SectionLabel: React.ComponentType<{ index: string; children: React.ReactNode }>;
}

const text3 =
  "A multidisciplinary program blending software, computer science, data, and business fundamentals.";

export function EducationSection({ SectionLabel }: EducationSectionProps) {
  return (
    <section
      id="education"
      className="section-shell section-shell--light education-section"
      aria-labelledby="education-title"
    >
      <div className="section-rail">
        <p className="rail-note">Foundations for the next build.</p>
      </div>
      <div className="education-content">
        <div className="education-card">
          <div className="education-card__top">
            <div className="education-card__info">
              <p className="eyebrow">Current foundation</p>
              <h2 id="education-title">
                <span className="education-card__degree-line">B.E. — Computer Science &amp;</span>
                <span className="education-card__degree-line education-card__degree-accent">Business Systems</span>
              </h2>
              <p className="education-card__institution">Srinivas Institute of Technology</p>
              <p className="education-card__desc">{text3}</p>
            </div>
            <div className="education-card__year mono">
              2023—2027
            </div>
          </div>

          <div className="education-actions">
            <div className="edu-btn edu-btn--solid">
              <span>CGPA 7.85 / 10</span>
            </div>
            <div className="edu-btn edu-btn--outline">
              <span>Mangalore, India</span>
            </div>
            <div className="edu-btn edu-btn--outline">
              <span>CS + Business Systems</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

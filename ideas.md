# Portfolio Design Direction

## Three Approaches

### Theme Name: Signal / Structure
Very dark editorial engineering portfolio with precise lines, data-inspired details, and a warm signal color that makes the work feel active without becoming neon. The mood is calm, capable, and systems-minded.

**Probability:** 0.06

### Theme Name: Field Notes
Light, tactile portfolio inspired by engineering notebooks, annotated diagrams, and printed research ephemera. The mood is thoughtful, curious, and human, with the work presented as a sequence of useful observations.

**Probability:** 0.03

### Theme Name: Quiet Interface
A restrained light/dark hybrid with generous whitespace, soft neutral surfaces, and a typographic-first composition. The mood is polished, direct, and recruiter-friendly, with motion used mainly to clarify hierarchy.

**Probability:** 0.08

## Chosen Direction: Signal / Structure

### Design Movement
Contemporary editorial brutalism softened by Swiss information design and product-engineering interfaces. The result is a dark, high-contrast portfolio that behaves like a measured technical notebook rather than a marketing landing page.

### Core Principles
1. **Signal over spectacle:** every accent color, animation, and label must help the visitor understand Kartik’s work.
2. **Asymmetric composition:** use offset columns, split hero geometry, and side annotations to avoid a generic centered template.
3. **Material restraint:** deep graphite surfaces, thin rules, quiet texture, and selective glass effects create depth without clutter.
4. **Evidence-led storytelling:** projects lead with the problem, solution, and architecture so recruiters can scan quickly and interviewers can go deeper.

### Color Philosophy
The base is a low-key ink palette because it gives diagrams, code-like labels, and project visuals an instrument-panel clarity. A single **signal orange** is reserved for active states, links, timeline markers, and calls to action; it should feel like a status light rather than decoration. Cool slate text creates hierarchy while muted blue-grey surfaces keep the page from becoming flat black.

### Layout Paradigm
A long-form editorial rail: content sits within a wide but bounded canvas, while sections alternate between a compact left annotation rail and a larger right content field. The hero uses a split composition with identity on the left and a visual system map on the right. Project cards alternate media and text alignment to create rhythm without relying on a uniform card grid.

### Signature Elements
- A thin vertical **signal rail** that runs through selected sections and anchors timeline/project labels.
- Small uppercase **system labels** with orange index marks, inspired by engineering drawings.
- Fine animated **connection paths** and node points in project architecture visuals, always slow and low-contrast.

### Interaction Philosophy
Interactions should feel like inspecting a well-made instrument: immediate, precise, and discoverable. Hover states reveal structure, not noise; case studies expand in place; buttons respond with a short press scale; active navigation uses a quiet orange indicator. Every interactive element remains legible and keyboard reachable.

### Animation
Use Framer Motion for one-time section reveals, with 30–70ms stagger between adjacent items. Entering elements use opacity plus a 12–20px translateY and the custom ease-out `cubic-bezier(0.23, 1, 0.32, 1)`. Project media uses a restrained 3–5px parallax on pointer movement only for devices with hover capability. Architecture lines use a slow dash animation under 12 seconds and pause when reduced motion is requested. No looping particles, bouncing UI, or oversized page transitions.

### Typography System
Use **Space Grotesk** for display headlines and labels, pairing it with **IBM Plex Sans** for body copy and interface text. Headlines are tight and slightly oversized; body copy stays at 16–18px with relaxed leading. Uppercase labels use 0.14em tracking, 11–12px size, and medium weight. Avoid using a single font weight for all content.

### Brand Essence
**Positioning:** Kartik is a Computer Science & Business Systems Engineer building practical software and intelligent systems for real-world problems, with a learning mindset and an eye for product detail.

**Personality:** precise, curious, grounded.

### Brand Voice
Headlines are concise and active. CTAs use verbs that describe the next action. Microcopy is specific, warm, and free from startup clichés.

Example lines:
- **“Useful software starts with a clear problem.”**
- **“Trace the system behind the interface.”**

### Wordmark & Logo
The wordmark is set as `Kartik.` in Space Grotesk with a deliberately oversized terminal period. The symbol is a compact angular K built from two offset strokes and a single node, echoing a routed system graph. The mark is used in the header and favicon at a clearly visible size; it never appears as generic text alone.

### Signature Brand Color
**Signal Orange — `#F47C48`**. It is warm enough to feel human, sharp enough to read as an active system state, and uncommon enough to own against graphite and slate.

## Content Integrity Decisions

Only facts provided in the brief are presented as confirmed. Experience, certifications, leadership periods, social URLs, and credential links without verified source details are rendered as clearly marked `TODO: Add verified information` placeholders rather than invented claims. The resume link points to `/resume/Kartik-Manjunath-Nilekani-Resume.pdf` so the real PDF can be added later without fabricating one.

## Technical Direction

The page will remain a static React experience. Contact form behavior is intentionally presented as a validated UI shell with a safe explanatory state because the current project has no backend endpoint; no private data, API key, or fake submission success will be introduced. Semantic HTML, visible focus states, reduced-motion support, lazy-loaded visuals, and basic metadata will be included. The architecture visual will be deterministic UI, not an AI-generated diagram, so its relationships stay accurate.

## Style Decisions

- Prefer deep graphite over pure black to preserve reading comfort.
- Orange `#F47C48` is a system signal: use it for active CTAs, index marks, key numerals, route nodes, and one decisive headline emphasis per section at most — never as a general decorative highlight.
- Light sections must still behave like engineering notebook surfaces: pale graphite paper, thin rules, annotation rails, diagram frames, and measured metadata replace plain cream marketing whitespace.
- The brand signature must always read as a designed mark: angular K/node symbol plus `Kartik.` with an oversized terminal period, never only a small default-text name.
- A faint signal rail and repeatable node/rule language should connect section labels, timelines, projects, education, and contact into one system.
- Project visuals stay information-led: routed lines, map/grid overlays, and quiet system cues take priority over dramatic sci-fi glow.

- Prefer deep graphite over pure black to preserve reading comfort.
- Reserve orange for meaningful interaction or system-status emphasis.
- Use generated visuals only for the hero texture and project cards; architecture remains code-rendered.
- Keep motion elegant and brief; reduced motion must remove non-essential transforms and line animations.
- Treat `ideas.md` as the source of truth when deciding between a decorative flourish and a clearer information hierarchy.

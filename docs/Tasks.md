# Development Tasks

## Three.js Cinematic Portfolio Transformation & Performance Optimization

- [x] Inspect existing repository, dependencies, frameworks, and real portfolio data
- [x] Verify reference licenses, confirm MIT permissive license for Meng To (2026) procedural code, and document attribution in `public/licenses/THREE_JS_REFERENCE_LICENSE.txt`
- [x] Install required dependencies (`three`, `@types/three`, `lenis`) cleanly via package manager
- [x] Implement complete procedural Three.js 3D Sanctuary engine in `src/components/three/CinematicSanctuary.tsx`
  - [x] Procedural canvas texture generators (cedar wood, slate, granite, lacquer, shoji, leaf, night sky, mountain ridge, flared roof tile, blood moon, haze, wisps, embers)
  - [x] 3D architectural geometry (podium, 40-step staircase with cheeks, 2-storey Sanmon hall, Torii gate with golden brackets, stone lanterns with flame lights)
  - [x] Atmospheric particle systems (rising embers, falling maple leaves with tumble rotation & forward recycling, rain, wisps)
  - [x] Catmull-Rom 3D spline camera rig with 6 chapter waypoints and mouse parallax
- [x] Implement interactive Pro Skills catalog in `src/components/portfolio/SkillsGallery.tsx` with category tabs, real-time search, interactive skill cards, and detail modal
- [x] Implement Projects Showcase in `src/components/portfolio/ProjectShowcase.tsx` featuring real projects (BloodLink, VoxNav, PathGrid), frame viewports, metrics, and deep-dive case study modal
- [x] Assemble 6-chapter cinematic story flow in `src/app/page.tsx`
  - [x] Chapter 01: The Threshold (Intro, Tagline, Quick Chips, Peek Window, 3D Title)
  - [x] Chapter 02: Foundations (About, SIT CS&BS Education, Philosophy, Metrics, Focus)
  - [x] Chapter 03: Selected Works (BloodLink, VoxNav, PathGrid Case Studies)
  - [x] Chapter 04: Sacred Craft (Interactive Pro Skills System)
  - [x] Chapter 05: Timeline & Proof (Verified Roles & Cisco CCNA Certifications)
  - [x] Chapter 06: Afterlight (Social Links, Validated Contact Form, Resume PDF)
- [x] Apply dark cinematic typography, styling tokens, glassmorphic overlays, and responsive breakpoints in `src/app/globals.css`
- [x] Performance & Scroll Motion Optimization:
  - [x] Integrate Lenis virtual smooth scroll engine for silky inertia
  - [x] Implement anchor-measured chapter progress normalization (exact section heights)
  - [x] Eliminate React state re-render thrashing during scroll via decoupled event broadcasting
  - [x] Cap Three.js DPR to 1.25 on desktop and 1.0 on mobile to prevent GPU fill-rate bottle-necks
  - [x] Bake static shadow maps on key lights (`shadow.autoUpdate = false`)
  - [x] Add hardware-accelerated GPU transform properties in `globals.css`
- [x] Run TypeScript check (`npm run check`) and Next.js production build (`npm run build`) with 0 errors

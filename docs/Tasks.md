# Development Tasks

## Simplified Structure, Dark/Light Mode & Locked Skills Section

- [x] **Skills Section 100% Locked**: Preserved `04 — SACRED CRAFT`, `A DISCIPLINED TECHNICAL ARSENAL.`, search bar, category filters, skill cards, proficiency badges, Core tags, modal details, and animations without modification
- [x] **Simplified Navigation & Structure**:
  - [x] `HOME` (#home): Prominent large cinematic title **`KARTIK MANJUNATH NILEKANI`**, subtitle `Computer Science & Business Systems Engineer`, intro `"I build websites, applications, and AI-powered solutions."`, and direct CTA buttons (`VIEW MY WORK`, `CONTACT ME`)
  - [x] `ABOUT` (#about): Simple direct description and `WHAT I LIKE TO BUILD` focus block
  - [x] `PROJECTS` (#projects): Clean heading `"PROJECTS"` & `"Things I've built."` with BloodLink, VoxNav, and PathGrid cards & modals
  - [x] `SKILLS` (#skills): 100% locked and preserved
  - [x] `EXPERIENCE` (#experience): Professional timeline and verified `CERTIFICATIONS` with PDF view links
  - [x] `CONTACT` (#contact): Direct text `"Let's build something."`, social pills, and functional contact form
- [x] **Dark Mode / Light Mode Toggle**:
  - [x] Integrated theme toggle in navbar with Moon/Sun icon
  - [x] Smooth CSS color transitions (`transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease`)
  - [x] Persistent theme state in `localStorage` without hydration errors
- [x] **Stable Video Background**: Fixed behind the UI (`position: fixed; inset: 0; z-index: 0`) with smooth overlay
- [x] **Smooth Framer Motion Transitions**: Staggered fade/slide reveals without scroll state thrashing
- [x] Validated TypeScript checks (`npm run check`) with 0 errors
- [x] Validated Next.js production build (`npm run build`) with 0 errors

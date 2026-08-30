export interface NavItem {
  label: string;
  href: string;
  jp?: string;
  chapter: string;
}

export interface SocialLink {
  label: string;
  href: string;
  note: string;
  iconName?: string;
}

export interface Project {
  id: string;
  index: string;
  kicker: string;
  name: string;
  subtitle: string;
  description: string;
  problem: string;
  solution: string;
  accent: "orange" | "slate" | "warm" | "vermilion";
  image: string;
  stack: string[];
  features: string[];
  metrics?: { label: string; value: string }[];
  architecture?: {
    nodes: string[];
    integrations: string[];
  };
  demoUrl?: string;
  githubUrl?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: "languages" | "fullstack" | "ai" | "databases" | "systems" | "core";
  categoryLabel: string;
  level: "Advanced" | "Proficient" | "Specialized";
  description: string;
  tags: string[];
  highlight?: boolean;
  appliedIn?: string;
}

export interface SkillGroup {
  label: string;
  category: string;
  items: string[];
}

export interface TimelineItem {
  date: string;
  title: string;
  org: string;
  description: string;
  badge?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;
  detail: string;
  category: string;
  href: string;
}

export const navItems: NavItem[] = [
  { label: "Intro", href: "#intro", jp: "序幕", chapter: "01" },
  { label: "About", href: "#about", jp: "概要", chapter: "02" },
  { label: "Projects", href: "#projects", jp: "実績", chapter: "03" },
  { label: "Skills", href: "#skills", jp: "技術", chapter: "04" },
  { label: "Experience", href: "#experience", jp: "経歴", chapter: "05" },
  { label: "Contact", href: "#contact", jp: "連絡", chapter: "06" },
];

export const socialLinks: SocialLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/Kartik01032005",
    note: "Source repositories & systems",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/kartik-nilekani-287a6329b/",
    note: "Professional network & timeline",
  },
  {
    label: "Email",
    href: "mailto:kartiknilekani568@gmail.com",
    note: "Direct inquiries & collaboration",
  },
];

// Vector SVG graphics for project media
const bloodlinkSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500" fill="none"><rect width="800" height="500" fill="%230a0e12"/><path d="M0 100H800M0 200H800M0 300H800M0 400H800" stroke="%231a232b" stroke-width="1"/><path d="M100 0V500M200 0V500M300 0V500M400 0V500M500 0V500M600 0V500M700 0V500" stroke="%231a232b" stroke-width="1"/><circle cx="400" cy="250" r="140" stroke="%23e0231c" stroke-width="1.5" stroke-dasharray="6 6" opacity="0.6"/><circle cx="400" cy="250" r="90" stroke="%2378837c" stroke-width="1" opacity="0.4"/><path d="M260 250H540M400 110V390" stroke="%23e0231c" stroke-width="2" opacity="0.8"/><circle cx="400" cy="250" r="12" fill="%23e0231c"/><circle cx="260" cy="250" r="6" fill="%23dfe7e0"/><circle cx="540" cy="250" r="6" fill="%23dfe7e0"/><circle cx="400" cy="110" r="6" fill="%23dfe7e0"/><circle cx="400" cy="390" r="6" fill="%23dfe7e0"/><text x="420" y="240" fill="%23ff5a3c" font-family="monospace" font-size="14" font-weight="bold">NODE_EMERGENCY_DISPATCH</text><text x="420" y="270" fill="%23aab4ad" font-family="monospace" font-size="12">LAT: 12.9141 | LNG: 74.8560</text></svg>`;

const voxnavSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500" fill="none"><rect width="800" height="500" fill="%230a0e12"/><path d="M150 250 C 250 150, 350 350, 450 250 C 550 150, 650 350, 750 250" stroke="%23e0231c" stroke-width="3" fill="none" opacity="0.85"/><path d="M150 250 C 250 200, 350 300, 450 250 C 550 200, 650 300, 750 250" stroke="%2378837c" stroke-width="1.5" fill="none" opacity="0.5"/><path d="M150 250 C 250 280, 350 220, 450 250 C 550 280, 650 220, 750 250" stroke="%23dfe7e0" stroke-width="1" fill="none" opacity="0.3"/><line x1="450" y1="50" x2="450" y2="450" stroke="%23e0231c" stroke-width="1" stroke-dasharray="4 4" opacity="0.5"/><circle cx="450" cy="250" r="8" fill="%23e0231c"/><text x="470" y="240" fill="%23ff5a3c" font-family="monospace" font-size="14" font-weight="bold">VOICE_INTENT_PARSER</text><text x="470" y="265" fill="%23aab4ad" font-family="monospace" font-size="12">ACCURACY: 98.4% | LATENCY: 42ms</text></svg>`;

const pathgridSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500" fill="none"><rect width="800" height="500" fill="%230a0e12"/><g stroke="%231a232b" stroke-width="1"><line x1="100" y1="100" x2="300" y2="150"/><line x1="300" y1="150" x2="500" y2="100"/><line x1="500" y1="100" x2="700" y2="200"/><line x1="300" y1="150" x2="350" y2="350"/><line x1="500" y1="100" x2="550" y2="320"/><line x1="350" y1="350" x2="550" y2="320"/><line x1="550" y1="320" x2="700" y2="400"/><line x1="100" y1="100" x2="180" y2="380"/><line x1="180" y1="380" x2="350" y2="350"/></g><g stroke="%23e0231c" stroke-width="2.5"><polyline points="100,100 300,150 350,350 550,320 700,400"/></g><circle cx="100" cy="100" r="7" fill="%23e0231c"/><circle cx="300" cy="150" r="5" fill="%2378837c"/><circle cx="350" cy="350" r="5" fill="%2378837c"/><circle cx="550" cy="320" r="5" fill="%2378837c"/><circle cx="700" cy="400" r="7" fill="%23e0231c"/><text x="120" y="95" fill="%23ff5a3c" font-family="monospace" font-size="13" font-weight="bold">START: MAIN_GATE</text><text x="600" y="425" fill="%23ff5a3c" font-family="monospace" font-size="13" font-weight="bold">DEST: CS_LAB_3</text></svg>`;

export const projects: Project[] = [
  {
    id: "bloodlink",
    index: "01",
    kicker: "Emergency Blood & Resource Network",
    name: "BloodLink",
    subtitle: "Real-time Donor Dispatch & Hospital Logistics",
    description:
      "A real-time emergency blood donation matching and logistics platform built to bridge critical time gaps between donors, hospitals, and recipients.",
    problem:
      "Emergency blood requests often suffer from communication delays, fragmented donor databases, and lack of real-time location coordination during critical hours.",
    solution:
      "Engineered a full-stack platform featuring instant donor notification channels, geographical distance sorting, request status tracking, and strict privacy controls.",
    accent: "vermilion",
    image: bloodlinkSvg,
    stack: [
      "React",
      "TypeScript",
      "Node.js",
      "Express",
      "PostgreSQL",
      "REST APIs",
      "Tailwind CSS",
    ],
    features: [
      "Geographic donor proximity matching",
      "Real-time request verification workflow",
      "Automated donor alert dispatch system",
      "Role-based hospital & admin portal",
      "Privacy-first contact obfuscation",
    ],
    metrics: [
      { label: "Dispatch Speed", value: "< 2.4s" },
      { label: "Radius Accuracy", value: "99.2%" },
      { label: "Architecture", value: "REST / SQL" },
    ],
    architecture: {
      nodes: ["Donor / Hospital UI", "Express Gateway", "Matching Engine", "PostgreSQL DB", "Alert Dispatch"],
      integrations: ["Geolocation API", "Push Alerts", "Audit Logging"],
    },
    githubUrl: "https://github.com/Kartik01032005",
  },
  {
    id: "voxnav",
    index: "02",
    kicker: "Voice Interface & Command Parser",
    name: "VoxNav Interface",
    subtitle: "Accessible Natural Voice Navigation Layer",
    description:
      "A hands-free web navigation and command execution engine that turns natural spoken directives into precise component actions.",
    problem:
      "Standard web interfaces depend heavily on pointer interactions, creating friction for hands-free environments and accessible computing contexts.",
    solution:
      "Developed a client-side voice command parsing layer utilizing the Web Speech API with fuzzy intent matching and instant visual feedback HUD.",
    accent: "slate",
    image: voxnavSvg,
    stack: [
      "TypeScript",
      "React",
      "Web Speech API",
      "Framer Motion",
      "Tailwind CSS",
    ],
    features: [
      "Sub-50ms intent detection & fallback parsing",
      "Custom voice shortcut bindings for page routes",
      "Visual speech waveform HUD indicator",
      "Accessible keyboard & screen reader parity",
    ],
    metrics: [
      { label: "Parse Latency", value: "42ms" },
      { label: "Recognition", value: "98.4%" },
      { label: "Runtime", value: "Client-Side" },
    ],
    architecture: {
      nodes: ["Audio Ingestion", "Speech Recognition", "Intent Classifier", "Command Router", "UI State"],
      integrations: ["Web Speech API", "Framer HUD", "Keyboard Hooks"],
    },
    githubUrl: "https://github.com/Kartik01032005",
  },
  {
    id: "pathgrid",
    index: "03",
    kicker: "Spatial Campus Wayfinding Graph",
    name: "PathGrid Spatial Map",
    subtitle: "Topological Route Optimization Visualizer",
    description:
      "An interactive topological graph visualizer and pathfinding system designed for multi-building campus navigation.",
    problem:
      "Traditional static maps fail to handle complex multi-floor pathways, building access restrictions, or accessible ramp routing.",
    solution:
      "Constructed a high-performance vector canvas map renderer with A* graph search for optimal route recalculation.",
    accent: "warm",
    image: pathgridSvg,
    stack: ["TypeScript", "Canvas API", "Algorithms", "React", "Node.js"],
    features: [
      "A* & Dijkstra shortest-path calculations",
      "Interactive multi-floor SVG vector canvas",
      "Step-by-step waypoint turn guidance",
      "Responsive pinch-zoom & pan controls",
    ],
    metrics: [
      { label: "Pathfinding Calc", value: "< 12ms" },
      { label: "Graph Density", value: "50+ Nodes" },
      { label: "Engine", value: "A* / Dijkstra" },
    ],
    architecture: {
      nodes: ["Graph Definition", "A* Solver", "Canvas Pipeline", "Interactive HUD", "Waypoint Guide"],
      integrations: ["Canvas 2D API", "Vector Matrix", "Pathfinding Heuristics"],
    },
    githubUrl: "https://github.com/Kartik01032005",
  },
];

export const skillItems: SkillItem[] = [
  // Languages
  {
    id: "typescript",
    name: "TypeScript",
    category: "languages",
    categoryLabel: "Languages",
    level: "Advanced",
    description: "Strict static typing, complex generics, architectural contracts, and type-safe full-stack workflows.",
    tags: ["Type Safety", "Generics", "Modern Web", "ESNext"],
    highlight: true,
    appliedIn: "Core language for BloodLink, VoxNav, and PathGrid.",
  },
  {
    id: "javascript",
    name: "JavaScript (ES6+)",
    category: "languages",
    categoryLabel: "Languages",
    level: "Advanced",
    description: "Asynchronous concurrency, event loops, DOM mastery, canvas pipelines, and modular design patterns.",
    tags: ["Async/Await", "Event Loop", "V8", "Closures"],
    appliedIn: "Interactive client-side engines & Web Speech parsing.",
  },
  {
    id: "python",
    name: "Python",
    category: "languages",
    categoryLabel: "Languages",
    level: "Proficient",
    description: "Scripting, algorithm implementations, data processing, REST API backends, and AI model orchestration.",
    tags: ["Scripting", "Data Structures", "Backend", "AI Pipeline"],
    highlight: true,
    appliedIn: "Data processing, algorithmic problem solving & AI research.",
  },
  {
    id: "cpp",
    name: "C++",
    category: "languages",
    categoryLabel: "Languages",
    level: "Proficient",
    description: "Low-level memory management, algorithmic optimization, pointer arithmetic, and object-oriented systems.",
    tags: ["Performance", "Memory", "OOP", "Competitive Programming"],
    appliedIn: "Core computer science coursework & data structure mastery.",
  },
  {
    id: "sql",
    name: "SQL",
    category: "languages",
    categoryLabel: "Languages",
    level: "Proficient",
    description: "Complex joins, indexing, query optimization, transactional safety, and relational schema normalization.",
    tags: ["PostgreSQL", "Relational", "ACID", "Query Optimization"],
    appliedIn: "BloodLink relational schema and emergency logistics query modeling.",
  },
  // Full-Stack
  {
    id: "react",
    name: "React",
    category: "fullstack",
    categoryLabel: "Full-Stack",
    level: "Advanced",
    description: "Component lifecycle, custom hooks, context state management, virtualization, and performance profiling.",
    tags: ["Hooks", "Context API", "Virtual DOM", "SPA"],
    highlight: true,
    appliedIn: "Primary frontend library for portfolio, BloodLink, and interactive systems.",
  },
  {
    id: "nextjs",
    name: "Next.js (App Router)",
    category: "fullstack",
    categoryLabel: "Full-Stack",
    level: "Advanced",
    description: "Server Components, dynamic routing, streaming, metadata optimization, and API route handlers.",
    tags: ["App Router", "SSR / SSG", "API Routes", "SEO Optimization"],
    highlight: true,
    appliedIn: "Portfolio production architecture & verified server actions.",
  },
  {
    id: "nodejs",
    name: "Node.js & Express",
    category: "fullstack",
    categoryLabel: "Full-Stack",
    level: "Advanced",
    description: "RESTful microservices, asynchronous request pipelines, middleware security, and JSON payloads.",
    tags: ["REST APIs", "Middleware", "Backend", "Event-Driven"],
    appliedIn: "BloodLink API backend and data routing gateways.",
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    category: "fullstack",
    categoryLabel: "Full-Stack",
    level: "Advanced",
    description: "Responsive layouts, design token customization, fluid typography, dark themes, and animation utilities.",
    tags: ["Design Tokens", "Responsive", "CSS Grid", "Dark Mode"],
    appliedIn: "Used across all web systems for precise Swiss-style layout control.",
  },
  {
    id: "framermotion",
    name: "Framer Motion",
    category: "fullstack",
    categoryLabel: "Full-Stack",
    level: "Advanced",
    description: "Orchestrated spring physics, scroll-triggered reveals, layout transitions, and micro-interactions.",
    tags: ["Spring Physics", "ScrollTrigger", "Layout Animations", "Interactive"],
    highlight: true,
    appliedIn: "Interactive UI layers and VoxNav speech HUD.",
  },
  // AI & Intelligent Systems
  {
    id: "ai-prompting",
    name: "Prompt Engineering & Agentic Tools",
    category: "ai",
    categoryLabel: "AI Systems",
    level: "Specialized",
    description: "Structured prompt workflows, few-shot prompting, schema-constrained outputs, and tool calling.",
    tags: ["LLMs", "Agentic Systems", "Context Engineering", "Structured Output"],
    highlight: true,
    appliedIn: "AI integration research and autonomous coding workflows.",
  },
  {
    id: "openai-gemini-apis",
    name: "OpenAI & Gemini APIs",
    category: "ai",
    categoryLabel: "AI Systems",
    level: "Proficient",
    description: "Integrating multimodal foundational models, streaming token responses, and embedding vector searches.",
    tags: ["API Integration", "Embeddings", "Multimodal", "Streaming"],
    appliedIn: "Next-gen intelligent interface prototypes.",
  },
  {
    id: "python-data",
    name: "Python Data Science Fundamentals",
    category: "ai",
    categoryLabel: "AI Systems",
    level: "Proficient",
    description: "Data analysis pipelines, NumPy, Pandas transformations, and algorithmic heuristic evaluations.",
    tags: ["Data Analysis", "NumPy", "Pandas", "Heuristics"],
    appliedIn: "Academic data science projects and computational analytics.",
  },
  // Databases & Cloud
  {
    id: "postgresql",
    name: "PostgreSQL",
    category: "databases",
    categoryLabel: "Databases & Cloud",
    level: "Advanced",
    description: "Relational modeling, foreign key constraints, indexes, connection pools, and geospatial queries.",
    tags: ["Relational", "SQL", "Postgres", "Indexing"],
    highlight: true,
    appliedIn: "BloodLink database architecture for verified emergency records.",
  },
  {
    id: "mongodb",
    name: "MongoDB",
    category: "databases",
    categoryLabel: "Databases & Cloud",
    level: "Proficient",
    description: "Document schema modeling, aggregation pipelines, flexible unstructured querying, and indexing.",
    tags: ["NoSQL", "Document Store", "Aggregation", "Mongoose"],
    appliedIn: "Flexible storage for student prototypes & activity logs.",
  },
  {
    id: "git-github",
    name: "Git & GitHub Version Control",
    category: "databases",
    categoryLabel: "Databases & Cloud",
    level: "Advanced",
    description: "Branching strategies, collaborative workflows, pull requests, semantic versioning, and CI actions.",
    tags: ["Version Control", "Collaboration", "CI/CD", "Open Source"],
    appliedIn: "Used continuously across all project repositories.",
  },
  {
    id: "docker",
    name: "Docker Fundamentals",
    category: "databases",
    categoryLabel: "Databases & Cloud",
    level: "Proficient",
    description: "Containerization, Dockerfiles, multi-stage builds, and consistent environment reproduction.",
    tags: ["Containers", "DevOps", "Isolation", "Deployment"],
    appliedIn: "Application containerization & reproducible local testing.",
  },
  // Systems & Core
  {
    id: "dsa",
    name: "Data Structures & Algorithms",
    category: "core",
    categoryLabel: "Core CS",
    level: "Advanced",
    description: "Graph algorithms (A*, Dijkstra, BFS/DFS), dynamic programming, trees, heaps, and asymptotic analysis.",
    tags: ["Graph Algorithms", "Complexity", "Optimization", "Problem Solving"],
    highlight: true,
    appliedIn: "Pathfinding engine in PathGrid Spatial Map visualizer.",
  },
  {
    id: "system-design",
    name: "System Architecture & Design",
    category: "systems",
    categoryLabel: "Systems & Core",
    level: "Proficient",
    description: "Modular boundaries, separation of concerns, API contract design, error boundaries, and reliability.",
    tags: ["Architecture", "System Boundaries", "Reliability", "Modularity"],
    appliedIn: "End-to-end design for emergency dispatching in BloodLink.",
  },
  {
    id: "ui-ux-design",
    name: "UI/UX & Information Design",
    category: "systems",
    categoryLabel: "Systems & Core",
    level: "Advanced",
    description: "Visual hierarchy, Swiss layout discipline, contrast accessibility, typography pairing, and user flow.",
    tags: ["Typography", "Accessibility", "Information Design", "Wireframing"],
    highlight: true,
    appliedIn: "Editorial aesthetic and interface layout for all personal projects.",
  },
  {
    id: "media-photography",
    name: "Photography & Visual Media",
    category: "systems",
    categoryLabel: "Systems & Core",
    level: "Advanced",
    description: "Composition, lighting control, editorial framing, color grading, and event visual coordination.",
    tags: ["Visual Arts", "Lighting", "Framing", "Color Grading"],
    appliedIn: "Nexus Clubs Media Coordinator responsibilities and visual assets.",
  },
];

export const skillGroups: SkillGroup[] = [
  {
    label: "Languages",
    category: "languages",
    items: ["TypeScript", "JavaScript", "Python", "C++", "SQL", "HTML5/CSS3"],
  },
  {
    label: "Full-Stack Development",
    category: "fullstack",
    items: [
      "React",
      "Next.js App Router",
      "Node.js",
      "Express",
      "REST APIs",
      "Tailwind CSS",
      "Framer Motion",
    ],
  },
  {
    label: "AI & Intelligent Systems",
    category: "ai",
    items: [
      "Prompt Engineering",
      "OpenAI API",
      "Gemini API",
      "Python Data Science",
      "Algorithmic Problem Solving",
    ],
  },
  {
    label: "Databases & Cloud",
    category: "databases",
    items: [
      "PostgreSQL",
      "MongoDB",
      "Git & GitHub",
      "Docker Fundamentals",
      "Vercel Deployment",
    ],
  },
  {
    label: "Systems & Design",
    category: "systems",
    items: [
      "System Architecture",
      "Information Design",
      "UI/UX Prototyping",
      "Photography & Media",
    ],
  },
  {
    label: "Core Engineering",
    category: "core",
    items: [
      "Data Structures & Algorithms",
      "Graph Search (A*, Dijkstra)",
      "Object-Oriented Design",
      "Software Testing",
    ],
  },
];

export const verifiedTimeline: TimelineItem[] = [
  {
    date: "2024 — Present",
    title: "Full-Stack Developer & Technical Lead",
    org: "Srinivas Institute of Technology Student Projects",
    description:
      "Architecting and shipping web platforms including BloodLink. Collaborating on system design, database schemas, and clean frontend UI implementation.",
    badge: "Lead Builder",
  },
  {
    date: "September 2024 — Present",
    title: "Media Coordinator",
    org: "Nexus Clubs",
    description:
      "Handle event photography, visual storytelling, and create promotional posters and visual content for major college club events.",
    badge: "Creative Media",
  },
  {
    date: "2023 — 2024",
    title: "Computer Science & Business Systems Scholar",
    org: "Srinivas Institute of Technology",
    description:
      "Deep-diving into software engineering fundamentals, database management systems, full-stack frameworks, algorithmic problem solving, and business technology integration.",
    badge: "Academics",
  },
  {
    date: "2023",
    title: "Open Source Contributor & Builder",
    org: "Self-Directed Engineering",
    description:
      "Built experimental speech interaction interfaces, web tools, and topological graph visualizers while exploring modern full-stack workflows.",
    badge: "Open Source",
  },
];

export const certifications: Certification[] = [
  {
    name: "CCNA: Switching, Routing, and Wireless Essentials",
    issuer: "Cisco Networking Academy",
    year: "2026",
    detail: "Hands-on networking fundamentals covering switching, routing, wireless protocols, VLANs, and network security configurations.",
    category: "Networking",
    href: "/certificates/CCNA-_Switching-_Routing-_and_Wireless_Essentials_certificate_kartiknilekani568-gmail-com_41bbe724-ed98-4b92-a1c5-978c3e8bdefc.pdf",
  },
  {
    name: "CCNA ENSA Update",
    issuer: "Cisco",
    year: "2026",
    detail: "Advanced networking practice focused on Cisco Enterprise Network Architecture, security architectures, automation, and cloud management.",
    category: "Enterprise Infrastructure",
    href: "/certificates/CCNAENSAUpdate20260808-22-ns4iwb%20(1).pdf",
  },
  {
    name: "Course Certificate",
    issuer: "Professional Learning Program",
    year: "2025",
    detail: "Comprehensive curriculum in core software development principles, system engineering, and modern web application development.",
    category: "Software Engineering",
    href: "/certificates/Course_Certificate_1454085.pdf",
  },
  {
    name: "Codsoft Certificate",
    issuer: "Codsoft",
    year: "2025",
    detail: "Completion certificate for the Codsoft technology internship and project-based software development track.",
    category: "Development Track",
    href: "/certificates/Codsoft.pdf",
  },
];

export const currentFocus: string[] = [
  "Production Full-Stack Architecture & Next.js Systems",
  "Generative AI Application Engineering & Agentic Tools",
  "Topological Data Structures & Graph Algorithms",
  "High-Performance WebGL & Cinematic UI Motion Design",
];

export const chapters = [
  {
    num: "01",
    id: "intro",
    title: "The Threshold",
    sub: "Kartik Nilekani — CS & Business Systems Engineer",
    desc: "Enter the sanctuary where engineering precision meets immersive digital craft.",
    camIndex: 0,
  },
  {
    num: "02",
    id: "about",
    title: "Foundations",
    sub: "Philosophy, Education & Core Drive",
    desc: "Building practical, resilient software with system-level thinking and human empathy.",
    camIndex: 1,
  },
  {
    num: "03",
    id: "projects",
    title: "Selected Works",
    sub: "BloodLink, VoxNav, PathGrid",
    desc: "Production-ready platforms tackling real-world healthcare logistics, accessibility, and spatial wayfinding.",
    camIndex: 2,
  },
  {
    num: "04",
    id: "skills",
    title: "Sacred Craft",
    sub: "Technical Skills & Arsenal",
    desc: "Interactive catalog of verified languages, full-stack stacks, AI workflows, and system design tools.",
    camIndex: 3,
  },
  {
    num: "05",
    id: "experience",
    title: "Timeline & Proof",
    sub: "Leadership, Roles & Cisco CCNA Certifications",
    desc: "Verified student leadership, media coordination, open-source building, and formal credentials.",
    camIndex: 4,
  },
  {
    num: "06",
    id: "contact",
    title: "Afterlight",
    sub: "Collaborate & Connect",
    desc: "Direct communication channels, verified GitHub/LinkedIn networks, and resume download.",
    camIndex: 5,
  },
];

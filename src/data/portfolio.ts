export interface NavItem {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
  note: string;
}

export interface Project {
  id: string;
  index: string;
  kicker: string;
  category: string;
  year: string;
  name: string;
  description: string;
  problem?: string;
  solution?: string;
  accent: "orange" | "slate" | "warm";
  image: string;
  stack: string[];
  features?: string[];
  architecture?: { nodes: string[]; integrations?: string[] };
  metrics?: { label: string; value: string }[];
  github?: string;
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface TimelineItem {
  date: string;
  title: string;
  org: string;
  description: string;
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
  { label: "About", href: "#about" },
  { label: "Education", href: "#education" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Certifications", href: "#certifications" },
  { label: "Contact", href: "#contact" },
];

export const socialLinks: SocialLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/Kartik01032005",
    note: "Source code & repositories",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/kartik-nilekani-287a6329b/",
    note: "Professional network & timeline",
  },
  {
    label: "Mail",
    href: "mailto:kartiknilekani568@gmail.com",
    note: "Direct communication",
  },
];

// Vector SVG graphics for project media
const bloodlinkSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500" fill="none"><rect width="800" height="500" fill="%23151b20"/><path d="M0 100H800M0 200H800M0 300H800M0 400H800" stroke="%23222d36" stroke-width="1"/><path d="M100 0V500M200 0V500M300 0V500M400 0V500M500 0V500M600 0V500M700 0V500" stroke="%23222d36" stroke-width="1"/><circle cx="400" cy="250" r="140" stroke="%23f47c48" stroke-width="1.5" stroke-dasharray="6 6" opacity="0.6"/><circle cx="400" cy="250" r="90" stroke="%237e98a5" stroke-width="1" opacity="0.4"/><path d="M260 250H540M400 110V390" stroke="%23f47c48" stroke-width="2" opacity="0.8"/><circle cx="400" cy="250" r="12" fill="%23f47c48"/><circle cx="260" cy="250" r="6" fill="%237e98a5"/><circle cx="540" cy="250" r="6" fill="%237e98a5"/><circle cx="400" cy="110" r="6" fill="%237e98a5"/><circle cx="400" cy="390" r="6" fill="%237e98a5"/><text x="420" y="240" fill="%23f47c48" font-family="monospace" font-size="14" font-weight="bold">NODE_EMERGENCY_DISPATCH</text><text x="420" y="270" fill="%23899393" font-family="monospace" font-size="12">LAT: 12.9141 | LNG: 74.8560</text></svg>`;

const sellpilotSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500" fill="none"><rect width="800" height="500" fill="%23151b20"/><path d="M150 250 C 250 150, 350 350, 450 250 C 550 150, 650 350, 750 250" stroke="%23f47c48" stroke-width="3" fill="none" opacity="0.85"/><path d="M150 250 C 250 200, 350 300, 450 250 C 550 200, 650 300, 750 250" stroke="%237e98a5" stroke-width="1.5" fill="none" opacity="0.5"/><path d="M150 250 C 250 280, 350 220, 450 250 C 550 280, 650 220, 750 250" stroke="%23a6c3cb" stroke-width="1" fill="none" opacity="0.3"/><line x1="450" y1="50" x2="450" y2="450" stroke="%23f47c48" stroke-width="1" stroke-dasharray="4 4" opacity="0.5"/><circle cx="450" cy="250" r="8" fill="%23f47c48"/><text x="470" y="240" fill="%23f47c48" font-family="monospace" font-size="14" font-weight="bold">SELLPILOT_AI</text><text x="470" y="265" fill="%23899393" font-family="monospace" font-size="12">SALES_ASSISTANT / FOLLOW_UPS</text></svg>`;

const pathgridSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500" fill="none"><rect width="800" height="500" fill="%23151b20"/><g stroke="%2326323c" stroke-width="1"><line x1="100" y1="100" x2="300" y2="150"/><line x1="300" y1="150" x2="500" y2="100"/><line x1="500" y1="100" x2="700" y2="200"/><line x1="300" y1="150" x2="350" y2="350"/><line x1="500" y1="100" x2="550" y2="320"/><line x1="350" y1="350" x2="550" y2="320"/><line x1="550" y1="320" x2="700" y2="400"/><line x1="100" y1="100" x2="180" y2="380"/><line x1="180" y1="380" x2="350" y2="350"/></g><g stroke="%23f47c48" stroke-width="2.5"><polyline points="100,100 300,150 350,350 550,320 700,400"/></g><circle cx="100" cy="100" r="7" fill="%23f47c48"/><circle cx="300" cy="150" r="5" fill="%237e98a5"/><circle cx="350" cy="350" r="5" fill="%237e98a5"/><circle cx="550" cy="320" r="5" fill="%237e98a5"/><circle cx="700" cy="400" r="7" fill="%23f47c48"/><text x="120" y="95" fill="%23f47c48" font-family="monospace" font-size="13" font-weight="bold">START: MAIN_GATE</text><text x="600" y="425" fill="%23f47c48" font-family="monospace" font-size="13" font-weight="bold">DEST: CS_LAB_3</text></svg>`;

const voxnavSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500" fill="none"><rect width="800" height="500" fill="%23151b20"/><circle cx="400" cy="250" r="140" stroke="%23222d36" stroke-width="1.5"/><circle cx="400" cy="250" r="100" stroke="%237e98a5" stroke-width="1" stroke-dasharray="4 4" opacity="0.4"/><circle cx="400" cy="250" r="60" stroke="%23f47c48" stroke-width="2" opacity="0.8"/><g fill="%23f47c48"><rect x="310" y="220" width="10" height="60" rx="5" opacity="0.6"/><rect x="335" y="190" width="10" height="120" rx="5" opacity="0.75"/><rect x="360" y="160" width="10" height="180" rx="5" opacity="0.9"/><rect x="385" y="130" width="10" height="240" rx="5"/><rect x="410" y="150" width="10" height="200" rx="5"/><rect x="435" y="180" width="10" height="140" rx="5" opacity="0.9"/><rect x="460" y="205" width="10" height="90" rx="5" opacity="0.75"/><rect x="485" y="225" width="10" height="50" rx="5" opacity="0.6"/></g><text x="400" y="420" text-anchor="middle" fill="%23f47c48" font-family="monospace" font-size="13" font-weight="bold">VOXNAV // VOICE_COMMAND_PARSER</text><text x="400" y="445" text-anchor="middle" fill="%23899393" font-family="monospace" font-size="11">LATENCY: &lt;50MS | WEB_SPEECH_API</text></svg>`;

export const projects: Project[] = [
  {
    id: "pathgrid",
    index: "01",
    kicker: "SPATIAL CAMPUS WAYFINDING",
    category: "SPATIAL CAMPUS WAYFINDING",
    year: "2026",
    name: "PathGrid Spatial Map",
    description:
      "An interactive campus navigation system that helps users find the best route between buildings and locations.",
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
    github: "https://github.com/Kartik01032005",
  },
  {
    id: "sellpilot-ai",
    index: "02",
    kicker: "AI & SALES",
    category: "AI & SALES",
    year: "2026",
    name: "SellPilot AI",
    description:
      "An AI-powered sales assistant that helps businesses manage leads, engage customers, track sales, and automate follow-ups.",
    problem:
      "Managing prospect outreach, follow-up cadence, and lead engagement manually leads to lost opportunities and inconsistent response times.",
    solution:
      "Built an intelligent assistant to automate multi-stage lead tracking, generate contextual conversation summaries, and trigger timely notifications.",
    accent: "slate",
    image: sellpilotSvg,
    stack: ["TypeScript", "AI", "React", "Node.js"],
    features: [
      "Automated lead qualification and tracking",
      "Contextual sales insight generator",
      "Follow-up scheduling and notification pipeline",
      "Streamlined customer engagement workflow",
    ],
    github: "https://github.com/Kartik01032005/SellPilot_AI",
  },
  {
    id: "voxnav",
    index: "03",
    kicker: "VOICE NAVIGATION",
    category: "VOICE NAVIGATION",
    year: "2026",
    name: "VoxNav Interface",
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
    github: "https://github.com/Kartik01032005",
  },
  {
    id: "bloodlink",
    index: "04",
    kicker: "BLOOD DONATION",
    category: "BLOOD DONATION",
    year: "2026",
    name: "BloodLink",
    description:
      "A real-time emergency blood donation matching and logistics platform built to bridge critical time gaps between donors, hospitals, and recipients.",
    problem:
      "Emergency blood requests often suffer from communication delays, fragmented donor databases, and lack of real-time location coordination during critical hours.",
    solution:
      "Engineered a full-stack platform featuring instant donor notification channels, geographical distance sorting, request status tracking, and strict privacy controls.",
    accent: "orange",
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
    github: "https://github.com/Kartik01032005",
  },
];

export const skillGroups: SkillGroup[] = [
  {
    label: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "C++", "SQL"],
  },
  {
    label: "Full-Stack Development",
    items: [
      "React",
      "Node.js",
      "Express",
      "REST APIs",
    ],
  },
  {
    label: "AI & Intelligent Systems",
    items: [
      "Python Data Science",
      "Prompt Engineering",
    ],
  },
  {
    label: "Databases & Cloud",
    items: [
      "MongoDB",
      "Git & GitHub",
      "Next.js",
      "Docker Fundamentals",
      "Power BI",
    ],
  },
  {
    label: "Systems & Design",
    items: [],
  },
  {
    label: "Core Engineering",
    items: [],
  },
];

export const verifiedTimeline: TimelineItem[] = [
  {
    date: "2023",
    title: "Open Source Contributor & Builder",
    org: "Self-Directed Engineering",
    description:
      "Built experimental speech interaction interfaces, web tools, and algorithmic visualizers while exploring modern full-stack workflows.",
  },
  {
    date: "2023 — 2027",
    title: "Computer Science & Business Systems Scholar",
    org: "Srinivas Institute of Technology",
    description:
      "Deep-diving into software engineering fundamentals, database systems, web development frameworks, and AI integration research.",
  },
  {
    date: "September 2024 — Present",
    title: "Media Coordinator",
    org: "Nexus Clubs",
    description:
      "Handle event photography and create promotional posters and visual content for club events.",
  },
  {
    date: "2026 — Present",
    title: "Full-Stack Developer & Technical Lead",
    org: "Srinivas Institute of Technology Student Projects",
    description:
      "Architecting and shipping web platforms including BloodLink. Collaborating on system design, database schemas, and clean frontend UI implementation.",
  },
];

export const certifications: Certification[] = [
  {
    name: "CCNA: Switching, Routing, and Wireless Essentials",
    issuer: "Cisco Networking Academy",
    year: "2026",
    detail: "Hands-on networking fundamentals covering switching, routing, and wireless essentials.",
    category: "Networking",
    href: "/certificates/CCNA-_Switching-_Routing-_and_Wireless_Essentials_certificate_kartiknilekani568-gmail-com_41bbe724-ed98-4b92-a1c5-978c3e8bdefc.pdf",
  },
  {
    name: "CCNA ENSA Update",
    issuer: "Cisco",
    year: "2026",
    detail: "Updated networking practice focused on Cisco Enterprise Network Architecture concepts.",
    category: "Cybersecurity & Networking",
    href: "/certificates/CCNAENSAUpdate20260808-22-ns4iwb%20(1).pdf",
  },
  {
    name: "MERN Full Stack Development",
    issuer: "EduSkills Academy",
    year: "2026",
    detail: "8-week internship program covering React, Node.js, Express, MongoDB, RESTful APIs, JWT Auth, and full-stack project deployment.",
    category: "Full-Stack Development",
    href: "/certificates/Course_Certificate_1454085.pdf",
  },
  {
    name: "Codsoft Certificate",
    issuer: "Codsoft",
    year: "2025",
    detail: "Completion certificate for the Codsoft learning program and project-based development track.",
    category: "Development",
    href: "/certificates/Codsoft.pdf",
  },
  {
    name: "Fundamentals of Cloud Computing",
    issuer: "upGrad",
    year: "2026",
    detail: "Certificate of completion for cloud computing fundamentals, issued June 29, 2026.",
    category: "Cloud Computing",
    href: "/certificates/cloud%20computing%20.pdf",
  },
  {
    name: "Deloitte Technology Job Simulation",
    issuer: "Deloitte / Forage",
    year: "2026",
    detail: "Practical technology simulation covering software architecture, development, and business solutions.",
    category: "Technology Consulting",
    href: "/certificates/deloitte.pdf",
  },
];

export const currentFocus: string[] = [
  "Production Full-Stack Architecture & Next.js Systems",
  "Generative AI Application Engineering & Agentic Tools",
  "FinTech Systems & Distributed Data Pipelines",
  "Quantitative Finance — Algorithmic trading, portfolio management, and systematic strategies",
  "Business — Understanding how technology, finance, and business connect",
  "Accessibility & High-Performance UI Motion Design",
];

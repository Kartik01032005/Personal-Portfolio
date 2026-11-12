import type { Metadata, Viewport } from "next";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ScrollProgress from "@/components/ScrollProgress";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://kartiknilekani.dev"
  ),
  title: "Kartik Manjunath Nilekani | Developer Portfolio",
  description:
    "Kartik Manjunath Nilekani is a developer building practical software, intelligent systems, and modern digital experiences. Explore featured projects, engineering skills, and background.",
  keywords: [
    "Kartik Manjunath Nilekani",
    "Kartik Nilekani",
    "Full-Stack Developer",
    "Computer Science Engineer",
    "Business Systems",
    "Portfolio",
    "AI",
    "Next.js",
    "TypeScript",
    "React",
  ],
  authors: [{ name: "Kartik Manjunath Nilekani", url: "https://kartiknilekani.dev" }],
  creator: "Kartik Manjunath Nilekani",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Kartik Manjunath Nilekani | Developer Portfolio",
    description:
      "Kartik Manjunath Nilekani is a developer building practical software, intelligent systems, and modern digital experiences.",
    url: "https://kartiknilekani.dev",
    siteName: "Kartik Manjunath Nilekani Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/profile.jpg",
        width: 800,
        height: 800,
        alt: "Kartik Manjunath Nilekani",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kartik Manjunath Nilekani | Developer Portfolio",
    description:
      "Kartik Manjunath Nilekani is a developer building practical software, intelligent systems, and modern digital experiences.",
    images: ["/profile.jpg"],
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    shortcut: "/favicon.ico",
    apple: "/icon.svg",
  },
};

const personStructuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Kartik Manjunath Nilekani",
  url: "https://kartiknilekani.dev",
  image: "https://kartiknilekani.dev/profile.jpg",
  jobTitle: "Computer Science & Business Systems Engineer",
  alumniOf: {
    "@type": "EducationalOrganization",
    name: "Srinivas Institute of Technology",
  },
  sameAs: [
    "https://github.com/Kartik01032005",
    "https://www.linkedin.com/in/kartik-nilekani-287a6329b/",
  ],
  knowsAbout: [
    "Full-Stack Development",
    "Software Engineering",
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Artificial Intelligence",
    "Machine Learning",
    "PostgreSQL",
    "MongoDB",
  ],
};

export const viewport: Viewport = {
  themeColor: "#151b20",
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="dark"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Montserrat:ital,wght@0,600;0,700;0,800;0,900;1,700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personStructuredData),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
              try {
                document.documentElement.classList.add("dark");
                document.documentElement.style.colorScheme = "dark";
                localStorage.setItem("theme", "dark");
              } catch {}
              if (typeof window !== "undefined" && "serviceWorker" in navigator) {
                navigator.serviceWorker.getRegistrations().then((registrations) => {
                  for (const registration of registrations) {
                    registration.unregister();
                  }
                }).catch(() => {});
              }
            })();`,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <ErrorBoundary>
          <ThemeProvider defaultTheme="dark" switchable={false}>
            <TooltipProvider>
              <ScrollProgress />
              <Toaster />
              {children}
            </TooltipProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

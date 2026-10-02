import type { Metadata, Viewport } from "next";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ScrollProgress from "@/components/ScrollProgress";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kartik Manjunath Nilekani | Computer Science & Business Systems Engineer",
  description:
    "Kartik Manjunath Nilekani is a Computer Science & Business Systems Engineer building practical software, intelligent systems, and thoughtful digital experiences.",
  openGraph: {
    title: "Kartik Manjunath Nilekani | Computer Science & Business Systems Engineer",
    description:
      "Engineering practical products across full-stack development, AI, data, and modern web technologies.",
    type: "website",
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' fill='%23151b20'/><path d='M8 6V26M8 16L18 6M11 13L20 26' stroke='%23f47c48' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/><circle cx='20' cy='26' r='2' fill='%23f47c48'/></svg>",
  },
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
          dangerouslySetInnerHTML={{
            __html: `(() => { try { document.documentElement.classList.add("dark"); document.documentElement.style.colorScheme = "dark"; localStorage.setItem("theme", "dark"); } catch {} })();`,
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

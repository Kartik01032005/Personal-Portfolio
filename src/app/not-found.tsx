"use client";

import { ArrowLeft, Compass } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#151b20] text-[#eef1ec] p-4">
      {/* Brand Header */}
      <div className="mb-8">
        <Link
          href="/"
          className="brand-logo"
          aria-label="Kartik Manjunath Nilekani - Return to homepage"
        >
          <svg className="brand-logo__stripes" width="22" height="18" viewBox="0 0 22 18" fill="none" aria-hidden="true">
            <path d="M4 18L10 0H7L1 18H4Z" fill="#EA5B24" />
            <path d="M10 18L16 0H13L7 18H10Z" fill="#ffffff" />
            <path d="M16 18L22 0H19L13 18H16Z" fill="#EA5B24" />
          </svg>
          <span className="brand-logo__badge">KMN</span>
          <div className="brand-logo__text">
            <span className="brand-logo__name">KARTIK</span>
            <span className="brand-logo__sub">MANJUNATH NILEKANI</span>
          </div>
        </Link>
      </div>

      <div className="w-full max-w-lg p-8 sm:p-10 border border-white/10 bg-[rgba(255,255,255,0.03)] backdrop-blur-md text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-[#EA5B24]/20 rounded-full blur-md" />
            <div className="relative w-14 h-14 rounded-full border border-[#EA5B24]/40 flex items-center justify-center text-[#EA5B24] bg-[#151b20]">
              <Compass className="w-7 h-7" />
            </div>
          </div>
        </div>

        <span className="mono text-xs text-[#EA5B24] tracking-widest uppercase mb-2 block">
          Error 404 / Route Exception
        </span>

        <h1
          className="text-3xl sm:text-4xl font-semibold tracking-tight mb-3"
          style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
        >
          Page Not Found
        </h1>

        <p className="text-[#9ba5a4] text-sm mb-8 leading-relaxed max-w-md mx-auto">
          The requested page could not be located. It may have moved or no longer exists. Return to the main portfolio interface to continue exploring.
        </p>

        <div className="flex justify-center">
          <Link
            href="/"
            className="button button--primary inline-flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}

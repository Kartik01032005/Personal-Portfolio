"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#151b20] text-[#eef1ec] p-4">
      <div className="w-full max-w-lg p-8 border border-white/15 bg-[rgba(255,255,255,0.035)] backdrop-blur-md text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-[#f47c48]/20 rounded-full animate-pulse" />
            <AlertCircle className="relative h-14 w-14 text-[#f47c48]" />
          </div>
        </div>

        <span className="mono text-xs text-[#f47c48] tracking-widest uppercase mb-2 block">
          Error 404 / Route Exception
        </span>

        <h1 className="text-4xl font-medium tracking-tight mb-3 font-sans">
          Page Not Found
        </h1>

        <p className="text-[#9ba5a4] text-sm mb-8 leading-relaxed max-w-md mx-auto">
          The destination route you requested does not exist or has been moved. Return to the main portfolio interface to continue.
        </p>

        <div className="flex justify-center">
          <Link href="/">
            <Button className="button button--primary flex items-center gap-2 cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

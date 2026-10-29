import React from "react";

/**
 * Website Institutional & Author Watermark: "Made by Ravi Sharma"
 * - Subtle background micro-watermark pattern across pages
 * - Sleek, unobtrusive floating signature badge in corner
 * - Print watermark for physical prints and PDFs
 */
export default function WebsiteWatermark() {
  return (
    <>
      {/* 1. Background Repeating Micro-Watermark (Ultra-subtle, non-interfering) */}
      <div
        className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0"
        aria-hidden="true"
      >
        <div className="absolute -inset-24 flex flex-col justify-around -rotate-12 scale-105 pointer-events-none opacity-[0.018] text-[11px] tracking-[0.3em] font-mono uppercase text-slate-900">
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="whitespace-nowrap flex gap-12">
              <span>HARYANA SHAKTI COLLEGE OF EDUCATION</span>
              <span>• MADE BY RAVI SHARMA •</span>
              <span>ESTD 1999 • GGSIPU AFFILIATED • NCTE APPROVED</span>
              <span>• OFFICIAL WEB PORTAL •</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Sleek Floating Signature Watermark Badge (Desktop only, hidden on mobile) */}
      <div className="hidden sm:block fixed sm:bottom-3 sm:left-3 z-30 pointer-events-auto select-none print:hidden">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/85 hover:bg-slate-950 backdrop-blur-md text-[11px] font-sans text-slate-300 border border-white/15 shadow-md transition-all duration-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
          <span className="tracking-wide">
            Made by <strong className="font-semibold text-white">Ravi Sharma</strong>
          </span>
        </div>
      </div>

      {/* 3. Official Print Watermark (Visible only when user prints any page) */}
      <div className="hidden print:block fixed bottom-2 inset-x-0 text-center text-[9px] font-mono text-gray-600 select-none pointer-events-none">
        Haryana Shakti College of Education • Official Portal • Made by Ravi Sharma
      </div>
    </>
  );
}

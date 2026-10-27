import React from "react";
import { ExternalLink } from "lucide-react";

const COLLEGE_LOGO_URL = "/assets/brand/college-logo.png";

export default function PortalLayout({
  children,
  badgeText = "Institutional Gateway",
  showPublicLink = true,
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Universal Top Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <img
              src={COLLEGE_LOGO_URL}
              alt="HSCE Logo"
              className="h-10 sm:h-12 w-auto object-contain shrink-0 drop-shadow-xs"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate">
                  Haryana Shakti College of Education
                </h1>
                {badgeText && (
                  <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                    {badgeText}
                  </span>
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 truncate">
                Approved by NCTE &bull; Affiliated to GGSIPU, Delhi &bull; Kanjhawala
              </p>
            </div>
          </div>

          {showPublicLink && (
            <a
              href="https://www.hscekanjhawala.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50/80 hover:bg-blue-100 px-3.5 py-2 rounded-lg border border-blue-200/60 transition-all shadow-2xs hover:shadow-xs shrink-0"
            >
              <span>Public Website</span>
              <ExternalLink size={14} className="opacity-75" />
            </a>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center w-full">
        {children}
      </main>

      {/* Universal Footer */}
      <footer className="bg-white border-t border-slate-200/90 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-1.5">
          <p className="font-medium text-slate-600">
            &copy; {new Date().getFullYear()} Haryana Shakti College of Education. All rights reserved.
          </p>
          <p className="text-[11px] text-slate-400">
            NCTE Approved &bull; Affiliated to Guru Gobind Singh Indraprastha University (GGSIPU), Delhi &bull; Secure Institutional Access
          </p>
          <p className="text-[11px] font-medium text-slate-400/90 tracking-wide pt-1">
            Made and managed by Ravi Sharma &bull; This system is managed by Ravi Sharma
          </p>
        </div>
      </footer>
    </div>
  );
}

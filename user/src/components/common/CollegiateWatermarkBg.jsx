import React from "react";

/**
 * CollegiateWatermarkBg
 * Renders a subtle educational doodle watermark pattern in the background
 * matching the institutional reference screenshot.
 */
export function CollegiateWatermarkBg({ children, className = "" }) {
  return (
    <div className={`relative min-h-screen bg-[#F4F6FA] ${className}`}>
      {/* Decorative Collegiate Watermark Doodle Pattern */}
      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-35"
        aria-hidden="true">
        <svg
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%">
          <defs>
            <pattern
              id="hsce-collegiate-pattern"
              width="240"
              height="240"
              patternUnits="userSpaceOnUse">
              {/* Graduation Cap */}
              <g
                transform="translate(25, 25) scale(0.7)"
                stroke="#94A3B8"
                strokeWidth="1.4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </g>

              {/* Open Book */}
              <g
                transform="translate(150, 25) scale(0.7)"
                stroke="#94A3B8"
                strokeWidth="1.4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </g>

              {/* School / College Building */}
              <g
                transform="translate(25, 145) scale(0.7)"
                stroke="#94A3B8"
                strokeWidth="1.4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4" />
                <path d="M18 10h4l-2-5-2 5z" />
                <path d="M2 22h20" />
                <path d="M20 22V7l-8-4-8 4v15" />
                <rect x="6" y="11" width="4" height="4" />
                <rect x="14" y="11" width="4" height="4" />
              </g>

              {/* Pencil */}
              <g
                transform="translate(95, 85) scale(0.65) rotate(45)"
                stroke="#94A3B8"
                strokeWidth="1.4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              </g>

              {/* Diploma / Award Scroll */}
              <g
                transform="translate(155, 145) scale(0.7)"
                stroke="#94A3B8"
                strokeWidth="1.4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round">
                <circle cx="12" cy="8" r="6" />
                <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
              </g>

              {/* Lightbulb / Idea */}
              <g
                transform="translate(90, 185) scale(0.65)"
                stroke="#94A3B8"
                strokeWidth="1.4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                <path d="M9 18h6" />
                <path d="M10 22h4" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hsce-collegiate-pattern)" />
        </svg>
      </div>

      {/* Foreground Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default CollegiateWatermarkBg;

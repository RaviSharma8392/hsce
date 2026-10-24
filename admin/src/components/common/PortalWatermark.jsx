import React from "react";

/**
 * High-security institutional administrative watermark.
 * Can be used in both dark mode (hero panels) and light mode (admin workspace).
 */
export default function PortalWatermark({
  isDark = false,
  className = "",
  showRepeatingPattern = true,
}) {
  const strokeColor = isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(30, 41, 59, 0.035)";
  const textColor = isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(30, 41, 59, 0.045)";
  const logoOpacity = isDark ? "opacity-15" : "opacity-[0.03]";

  return (
    <div
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden flex items-center justify-center z-0 ${className}`}
      aria-hidden="true"
    >
      {/* Background diagonal security ribbon pattern */}
      {showRepeatingPattern && (
        <div
          className={`absolute inset-0 ${
            isDark ? "opacity-[0.03]" : "opacity-[0.015]"
          }`}
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              currentColor,
              currentColor 1px,
              transparent 1px,
              transparent 48px
            )`,
          }}
        />
      )}

      {/* Repeating micro-text security watermark ribbon (Diagonal) */}
      {showRepeatingPattern && (
        <div
          className="absolute -inset-10 flex flex-col justify-around rotate-[-18deg] scale-110 pointer-events-none opacity-[0.02] text-[10px] tracking-[0.25em] font-mono uppercase text-slate-800"
        >
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="whitespace-nowrap flex gap-8">
              <span>HARYANA SHAKTI COLLEGE OF EDUCATION • OFFICIAL ADMINISTRATIVE SYSTEM</span>
              <span>• RESTRICTED ACCESS • 256-BIT SSL ENCRYPTED •</span>
              <span>CONFIDENTIAL ADMINISTRATIVE GATEWAY • HSCE PORTAL</span>
            </div>
          ))}
        </div>
      )}

      {/* Central Institutional Seal Watermark */}
      <div className="relative flex items-center justify-center w-[460px] h-[460px] max-w-[85vw] max-h-[85vw]">
        {/* Vector Circular Seal */}
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full"
          style={{ color: strokeColor }}
        >
          <defs>
            <path
              id="hsceWatermarkPath"
              d="M 250, 250 m -180, 0 a 180,180 0 1,1 360,0 a 180,180 0 1,1 -360,0"
            />
            <path
              id="hsceInnerPath"
              d="M 250, 250 m -130, 0 a 130,130 0 1,1 260,0 a 130,130 0 1,1 -260,0"
            />
          </defs>

          {/* Outer concentric security rings */}
          <circle
            cx="250"
            cy="250"
            r="238"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="8 6"
          />
          <circle
            cx="250"
            cy="250"
            r="224"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle
            cx="250"
            cy="250"
            r="216"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
          />

          {/* Outer ring text */}
          <text
            fill={textColor}
            fontSize="12.5"
            fontWeight="700"
            letterSpacing="3.2"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            <textPath href="#hsceWatermarkPath" startOffset="0%">
              ★ HARYANA SHAKTI COLLEGE OF EDUCATION ★ OFFICIAL ADMINISTRATIVE PORTAL ★
            </textPath>
          </text>

          {/* Middle security ring */}
          <circle
            cx="250"
            cy="250"
            r="142"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle
            cx="250"
            cy="250"
            r="134"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Inner ring text */}
          <text
            fill={textColor}
            fontSize="9"
            fontWeight="600"
            letterSpacing="2.5"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            <textPath href="#hsceInnerPath" startOffset="0%">
              • SECURE GATEWAY • AUTHORIZED PERSONNEL ONLY • ESTD 1999 •
            </textPath>
          </text>

          <circle
            cx="250"
            cy="250"
            r="115"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>

        {/* Center Official College Emblem inside Seal */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-20 pointer-events-none">
          <img
            src="/assets/brand/college-logo.png"
            alt=""
            className={`w-32 h-32 object-contain grayscale ${logoOpacity}`}
          />
          <span
            className={`mt-2 font-mono text-[9px] font-bold tracking-[0.2em] uppercase ${
              isDark ? "text-white/20" : "text-slate-800/20"
            }`}
          >
            HSCE • SECURE
          </span>
        </div>
      </div>
    </div>
  );
}

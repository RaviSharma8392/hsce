import React from "react";

/**
 * Academic & Institutional Texture Background Pattern
 * Renders a subtle watermark doodle texture inspired by the HFCON reference,
 * customized with elegant higher-education line-art motifs (graduation caps,
 * open textbooks, college pillars, diploma scrolls, globes, lightbulbs, and bells).
 */
export default function AcademicTexturePattern({ className = "", opacity = "opacity-40" }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      <svg
        className={`h-full w-full ${opacity}`}
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id="academic-doodle-texture"
            width="240"
            height="240"
            patternUnits="userSpaceOnUse"
          >
            <g
              fill="none"
              stroke="#363991"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity="0.12"
            >
              {/* 1. Mortarboard / Graduation Cap */}
              <g transform="translate(10, 10)">
                <polygon points="30,22 55,13 80,22 55,31" />
                <path d="M40,25 v11 c0,5 7,9 15,9 s15,-4 15,-9 v-11" />
                <path d="M72,23 v15 c0,2 2,3 3,3" />
              </g>

              {/* 2. Open Textbook */}
              <g transform="translate(140, 12)">
                <path d="M40,16 c8,-3 18,-3 26,0 v20 c-8,-3 -18,-3 -26,0 z" />
                <path d="M40,16 c-8,-3 -18,-3 -26,0 v20 c8,-3 18,-3 26,0 z" />
                <line x1="40" y1="16" x2="40" y2="36" />
                <line x1="46" y1="21" x2="60" y2="21" />
                <line x1="46" y1="26" x2="58" y2="26" />
                <line x1="20" y1="21" x2="34" y2="21" />
                <line x1="22" y1="26" x2="34" y2="26" />
              </g>

              {/* 3. Certificate / Diploma Scroll */}
              <g transform="translate(20, 85)">
                <rect x="15" y="10" width="32" height="22" rx="3" />
                <line x1="21" y1="16" x2="39" y2="16" />
                <line x1="21" y1="21" x2="35" y2="21" />
                <path d="M31,32 l3,6 l3,-6" />
                <circle cx="31" cy="27" r="2.5" />
              </g>

              {/* 4. Pencil & Protractor */}
              <g transform="translate(95, 80)">
                <path d="M12,28 l18,-18 l6,6 l-18,18 l-6,2 z" />
                <line x1="24" y1="16" x2="30" y2="22" />
                <line x1="12" y1="28" x2="18" y2="34" />
              </g>

              {/* 5. Lightbulb / Innovative Teaching */}
              <g transform="translate(175, 85)">
                <path d="M18,14 a10,10 0 1,0 14,0 c-2,3 -2,5 -2,8 h-10 c0,-3 0,-5 -2,-8" />
                <line x1="20" y1="25" x2="30" y2="25" />
                <line x1="22" y1="28" x2="28" y2="28" />
                <line x1="25" y1="2" x2="25" y2="0" />
                <line x1="12" y1="6" x2="10" y2="4" />
                <line x1="38" y1="6" x2="40" y2="4" />
              </g>

              {/* 6. Campus Facade / College Pillars */}
              <g transform="translate(15, 160)">
                <polygon points="12,14 36,2 60,14" />
                <line x1="14" y1="14" x2="58" y2="14" />
                <line x1="20" y1="14" x2="20" y2="34" />
                <line x1="36" y1="14" x2="36" y2="34" />
                <line x1="52" y1="14" x2="52" y2="34" />
                <line x1="12" y1="34" x2="60" y2="34" />
                <line x1="10" y1="37" x2="62" y2="37" />
              </g>

              {/* 7. School Bell */}
              <g transform="translate(100, 165)">
                <path d="M12,18 c0,-9 5,-15 13,-15 s13,6 13,15 h-26 z" />
                <circle cx="25" cy="22" r="3" />
                <path d="M25,3 v-3" />
              </g>

              {/* 8. World Globe */}
              <g transform="translate(175, 160)">
                <circle cx="25" cy="20" r="14" />
                <ellipse cx="25" cy="20" rx="6" ry="14" />
                <line x1="11" y1="20" x2="39" y2="20" />
                <path d="M13,13 c4,4 20,4 24,0" />
                <path d="M13,27 c4,-4 20,-4 24,0" />
                <path d="M25,34 v5 m-8,0 h16" />
              </g>

              {/* 9. Star Motif */}
              <g transform="translate(135, 125)">
                <polygon points="15,4 18,11 25,12 20,17 21,24 15,20 9,24 10,17 5,12 12,11" />
              </g>

              {/* 10. Science Orbit */}
              <g transform="translate(85, 30)">
                <circle cx="20" cy="18" r="2.5" fill="#363991" fillOpacity="0.2" />
                <ellipse cx="20" cy="18" rx="13" ry="5" transform="rotate(30 20 18)" />
                <ellipse cx="20" cy="18" rx="13" ry="5" transform="rotate(-30 20 18)" />
              </g>
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#academic-doodle-texture)" />
      </svg>
    </div>
  );
}


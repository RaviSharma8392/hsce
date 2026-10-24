import React from "react";

/**
 * Adobe-style Red PDF Icon
 * Locked colors, responsive sizing, guaranteed to render correctly across all themes and containers.
 */
export default function AdobePdfIcon({ size = 20, className = "" }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        flexShrink: 0,
        display: "inline-block",
        verticalAlign: "middle",
      }}>
      {/* Document Base - Locked Adobe Red */}
      <path
        d="M6 2C4.89543 2 4 2.89543 4 4V28C4 29.1046 4.89543 30 6 30H26C27.1046 30 28 29.1046 28 28V10L20 2H6Z"
        style={{ fill: "#E5252A" }}
      />
      {/* Folded Corner - Locked Darker Red */}
      <path
        d="M20 2V8C20 9.10457 20.8954 10 22 10H28L20 2Z"
        style={{ fill: "#B31B1F" }}
      />
      {/* Adobe Trifold Curve */}
      <path
        d="M15.5 10.5C15.5 10.5 16.5 15 12 19.5C7.5 24 9 22 11 20C13 18 19.5 15.5 23.5 17C27.5 18.5 22 13.5 19 14.5C16 15.5 15.5 10.5 15.5 10.5Z"
        style={{
          stroke: "#FFFFFF",
          strokeWidth: 1.6,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          fill: "none",
        }}
      />
      {/* Bottom 'PDF' Badge Text */}
      <text
        x="16"
        y="27.5"
        textAnchor="middle"
        style={{
          fill: "#FFFFFF",
          fontSize: "6.5px",
          fontWeight: 800,
          fontFamily: "system-ui, -apple-system, sans-serif",
          letterSpacing: "0.5px",
        }}>
        PDF
      </text>
    </svg>
  );
}

export { AdobePdfIcon };

import React from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { Container } from "./Container";

/**
 * Universal Page Header Banner matching Graphic Era / Uttaranchal University style:
 * - Deep royal blue (#1c3274) solid background with crisp white heading and subtitle
 * - Clean white breadcrumb bar with Home icon, '/' separators, and links
 */
export function PageHeaderBanner({
  title,
  subtitle,
  breadcrumbs = [],
  headingLevel = "h1",
  className = "",
}) {
  const Heading = headingLevel;

  return (
    <div className={`w-full ${className}`}>
      {/* Top Deep Royal Blue Banner Section */}
      <div className="bg-[#1c3274] text-white py-8 sm:py-14 md:py-20 relative overflow-hidden">
        <Container>
          <div className="max-w-4xl">
            <Heading className="text-2xl sm:text-4xl lg:text-[42px] font-bold font-poppins text-white tracking-tight leading-tight">
              {title}
            </Heading>
            {subtitle && (
              <p className="mt-2.5 sm:mt-3 text-xs sm:text-base text-white/90 font-normal leading-relaxed font-sans max-w-3xl">
                {subtitle}
              </p>
            )}
          </div>
        </Container>
      </div>

      {/* Clean White Breadcrumbs Navigation Bar */}
      <div className="bg-white border-b border-gray-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <Container>
          <nav
            aria-label="Breadcrumb"
            className="py-2.5 sm:py-3.5 flex items-center flex-wrap gap-y-1 text-xs sm:text-[13px] text-gray-700 font-sans">
            {/* Always start with Home */}
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-gray-700 hover:text-[#1c3274] transition-colors font-medium group">
              <Home
                size={14}
                className="text-gray-800 group-hover:text-[#1c3274] transition-colors flex-shrink-0"
              />
              <span>Home</span>
            </Link>

            {/* Render custom breadcrumb items */}
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <React.Fragment key={idx}>
                  <span className="mx-2 text-gray-400 font-light select-none">
                    /
                  </span>
                  {(crumb.href || crumb.path || crumb.to) && !isLast ? (
                    <Link
                      to={crumb.href || crumb.path || crumb.to}
                      className="text-gray-700 hover:text-[#1c3274] transition-colors font-medium">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-gray-900 font-semibold truncate">
                      {crumb.label}
                    </span>
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        </Container>
      </div>
    </div>
  );
}

export default PageHeaderBanner;

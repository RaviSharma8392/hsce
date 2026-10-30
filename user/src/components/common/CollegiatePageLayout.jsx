import React from "react";
import { Container } from "./Container";
import { PageHeaderBanner } from "./PageHeaderBanner";
import { CollegiateWatermarkBg } from "./CollegiateWatermarkBg";
import { CollegiateSidebarNav } from "./CollegiateSidebarNav";

/**
 * CollegiatePageLayout
 * Reusable institutional layout matching the user's reference designs:
 * 1. Subtle collegiate doodle watermark background texture across the entire page
 * 2. Solid Royal Navy Blue header banner with breadcrumbs
 * 3. Left sidebar navigation widget (#2E3A8C header, stacked items, active state, Image 1 blue/yellow boxes)
 * 4. Main content section with matching institutional card styles
 */
export function CollegiatePageLayout({
  bannerTitle,
  bannerSubtitle,
  breadcrumbs = [],
  sidebarTitle = "Quick Links",
  sidebarItems = [],
  quickActions = [],
  showStatutoryCard = true,
  statutoryInfo,
  children,
  className = "",
  mainClassName = "",
}) {
  return (
    <CollegiateWatermarkBg className={`min-h-screen ${className}`}>
      {/* 1. Page Header Banner */}
      {bannerTitle && (
        <PageHeaderBanner
          title={bannerTitle}
          subtitle={bannerSubtitle}
          breadcrumbs={breadcrumbs}
        />
      )}

      {/* 2. Main Page Grid with Left Sidebar & Right Content */}
      <div className="relative z-10 py-6 sm:py-10 lg:py-14">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Left Sidebar Navigation */}
            <div className="lg:col-span-4 xl:col-span-3">
              <div className="sticky top-24">
                <CollegiateSidebarNav
                  title={sidebarTitle}
                  items={sidebarItems}
                  quickActions={quickActions}
                  showStatutoryCard={showStatutoryCard}
                  statutoryInfo={statutoryInfo}
                />
              </div>
            </div>

            {/* Right Main Content Area */}
            <main className={`lg:col-span-8 xl:col-span-9 min-w-0 ${mainClassName}`}>
              {children}
            </main>
          </div>
        </Container>
      </div>
    </CollegiateWatermarkBg>
  );
}

import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { HeroBanner } from "../components/home/HeroBanner";
import { QuickAccessSection } from "../components/home/QuickAccessSection";
import { HomeFeaturedOverview } from "../components/home/HomeFeaturedOverview";
import { AdmissionCTA } from "../components/home/AdmissionCTA";
import { CampusGallerySection } from "../components/home/CampusGallerySection";
import { PrincipalMessageSection } from "../components/home/PrincipalMessageSection";
import { FaqWidget } from "../components/home/FaqWidget";
import StarAlumni from "../components/home/StarAlumni";

import { WhyChooseSection } from "../components/home/HomepageFeatureSections";
import { AffiliationTrustBarWidget } from "../components/home/AffiliationTrustBarWidget";
import { LatestUpdatesMarquee } from "../components/home/LatestUpdatesMarquee";
import { SgtStatsBentoSection } from "../components/home/SgtStatsBentoSection";
import UniversityAffiliationSection from "../components/home/UniversityAffiliationSection";
import { AdmissionHelplineStrip } from "../components/home/AdmissionHelplineStrip";

const NoticeEventsSection = lazy(() =>
  import("../components/home/NoticeEventsSection").then((module) => ({
    default: module.NoticeEventsSection,
  })),
);
const HomepagePopup = lazy(() => import("../components/home/HomepagePopup"));

export default function HomePage() {
  const homeRef = useRef(null);
  const [popupReady, setPopupReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setPopupReady(true), 2500);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const sections = homeRef.current?.querySelectorAll(
      ":scope > section:not(:first-child):not(.home-animated-section)",
    );

    if (!sections?.length) return undefined;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (
      reduceMotion ||
      document.visibilityState === "hidden" ||
      typeof IntersectionObserver === "undefined"
    ) {
      sections.forEach((section) => {
        section.dataset.homeVisible = "true";
      });
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.dataset.homeVisible = "true";
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -48px 0px" },
    );

    sections.forEach((section) => {
      section.dataset.homeReveal = "true";
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <main ref={homeRef} className="home-page bg-white text-[#222222]">
        {/* 1. Hero Banner with Campus Slides, Search & Virtual Tour */}
        <HeroBanner />

        {/* 2. Quick Access Row (6 Solid Action Cards - immediate navigation) */}
        <QuickAccessSection />

        {/* 4. Institutional Overview & Stats Bento (Reference Design with 3 Action Cards & 2x2 Illustrated Avatars) */}
        <HomeFeaturedOverview />
        {/* 6. GGSIPU Affiliation Showcase & Principles */}
        <UniversityAffiliationSection />

        {/* 5. Leadership Messages from Chairman & Principal */}
        <PrincipalMessageSection />

        {/* 5. Institutional Associations & Statutory Trust Bar */}
        <AffiliationTrustBarWidget />

        {/* 7. Practical Pedagogy in Action (4-Step Teacher Training) */}
        <SgtStatsBentoSection />

        {/* 8. Published Notices & Campus Highlights */}
        <Suspense
          fallback={
            <div
              className="min-h-[28rem] animate-pulse bg-slate-50"
              aria-hidden="true"
            />
          }>
          <NoticeEventsSection />
        </Suspense>

        {/* 9. Key Reasons to Study at HSCE (6 Core Pillars) */}
        <WhyChooseSection />

        {/* 10. Campus Life & Activities Gallery Bento */}
        <CampusGallerySection />

        {/* 11. Pupil-Teacher Voice / Student Spotlight */}
        <StarAlumni />

        {/* 12. Admission Helpline & Services Action Strip (Matching user screenshot 3) */}
        <AdmissionHelplineStrip />

        {/* 13. Admission Enquiry CTA Banner */}
        <AdmissionCTA />

        {/* 13. Frequently Asked Questions & Admission Support */}
        <FaqWidget />
      </main>
      {popupReady && (
        <Suspense fallback={null}>
          <HomepagePopup />
        </Suspense>
      )}
    </>
  );
}

import { useEffect, useRef } from "react";
import { HeroBanner } from "../components/home/HeroBanner";
import { NoticeEventsSection } from "../components/home/NoticeEventsSection";
import { AdmissionCTA } from "../components/home/AdmissionCTA";
import { CampusGallerySection } from "../components/home/CampusGallerySection";
import { PrincipalMessageSection } from "../components/home/PrincipalMessageSection";
import { FaqWidget } from "../components/home/FaqWidget";
import StarAlumni from "../components/home/StarAlumni";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "../context/LanguageContext";

import ProgrammeHighlights from "../components/common/ProgrammeHighlights";
import CampusLifeSection from "../components/home/geu/CampusLifeSection";
import { WhyChooseSection } from "../components/home/HomepageFeatureSections";
import { AffiliationTrustBarWidget } from "../components/home/AffiliationTrustBarWidget";
import { UniversityAffiliationSection } from "../components/home/UniversityAffiliationSection";
import { LatestUpdatesMarquee } from "../components/home/LatestUpdatesMarquee";
import { SgtStatsBentoSection } from "../components/home/SgtStatsBentoSection";
import HomepagePopup from "../components/home/HomepagePopup";

export default function HomePage() {
  const { isHindi } = useLanguage();
  const homeRef = useRef(null);

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
      <Helmet>
        <title>
          {isHindi
            ? "हरियाणा शक्ति कॉलेज ऑफ एजुकेशन, कंझावला | बी.एड."
            : "Haryana Shakti College of Education, Kanjhawala, Delhi | B.Ed."}
        </title>

        <meta
          name="description"
          content={
            isHindi
              ? "कंझावला, दिल्ली स्थित हरियाणा शक्ति कॉलेज ऑफ एजुकेशन में दो वर्षीय बी.एड. कार्यक्रम, प्रवेश, पात्रता, परिसर सुविधाओं और सूचनाओं की जानकारी प्राप्त करें।"
              : "Learn about the two-year B.Ed. programme, admissions, eligibility, campus facilities and notices at Haryana Shakti College of Education in Kanjhawala, Delhi."
          }
        />
      </Helmet>

      <main ref={homeRef} className="home-page bg-white text-[#222222]">
        {/* 1. Hero Banner */}
        <HeroBanner />
        {/* 3. SGT-Style Live Announcement Marquee Bar */}
        <LatestUpdatesMarquee />

        {/* 2. Affiliating University (GGSIPU): Campus, Statutory Profile, Vision, Mission & Quality Policy */}
        <UniversityAffiliationSection />

        {/* 4. Statutory Approvals & Accreditations (NCTE & GGSIPU) */}
        <AffiliationTrustBarWidget />

        {/* 5. SGT-Style Colorful Bento Statistics & Impact Grid */}
        <SgtStatsBentoSection />

        {/* 6. B.Ed. Programme (2-Year Regular Degree - 3 Step Pathway) */}
        <ProgrammeHighlights />

        {/* 7. Leadership & Institution: Chairman's Desk (Left), Principal's Desk (Right) & About HSCE (Below) */}
        <PrincipalMessageSection />

        {/* 8. Campus Notices & Events Highlights */}
        <NoticeEventsSection />

        {/* 9. Why Choose HSCE (6 Colorful Institutional Pillars) */}
        <WhyChooseSection />

        {/* 10. Campus Life Beyond the Classroom (Immersive Navy Feature) */}
        <CampusLifeSection />

        {/* 11. Campus Moments & Facilities Gallery */}
        <CampusGallerySection />

        {/* 12. Pupil-Teacher Voice & Student Spotlight */}
        <StarAlumni />

        {/* 13. Admission Call to Action & Helplines */}
        <AdmissionCTA />

        {/* 14. Frequently Asked Questions */}
        <FaqWidget />
      </main>
      <HomepagePopup />
    </>
  );
}

import { useEffect, useRef } from "react";
import { HeroBanner } from "../components/home/HeroBanner";
import { NoticeEventsSection } from "../components/home/NoticeEventsSection";
import { AdmissionCTA } from "../components/home/AdmissionCTA";
import { CampusGallerySection } from "../components/home/CampusGallerySection";
import { PrincipalMessageSection } from "../components/home/PrincipalMessageSection";
import { FaqWidget } from "../components/home/FaqWidget";
import { HighlightFeature } from "../components/home/HighlightFeature";
import StarAlumni from "../components/home/StarAlumni";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "../context/LanguageContext";

import ProgrammeHighlights from "../components/common/ProgrammeHighlights";
import CampusLifeSection from "../components/home/geu/CampusLifeSection";
import { WhyChooseSection } from "../components/home/HomepageFeatureSections";
import { AffiliationTrustBarWidget } from "../components/home/AffiliationTrustBarWidget";
import { UniversityAffiliationSection } from "../components/home/UniversityAffiliationSection";
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
            ? "हरियाणा शक्ति कॉलेज ऑफ एजुकेशन | मुख्य पृष्ठ"
            : "Haryana Shakti College of Education | Home"}
        </title>

        <meta
          name="description"
          content={
            isHindi
              ? "हरियाणा शक्ति कॉलेज ऑफ एजुकेशन की आधिकारिक वेबसाइट। बी.एड. कार्यक्रम, प्रवेश, सूचनाएं और कॉलेज की गतिविधियों की जानकारी।"
              : "Official website of Haryana Shakti College of Education. Explore the B.Ed. programme, admissions, notices, campus facilities and college activities."
          }
        />
      </Helmet>

      <main ref={homeRef} className="home-page bg-white text-[#222222]">
        {/* 1. Hero Banner */}
        <HeroBanner />

        {/* 2. Statutory Approvals & Accreditations (NCTE & GGSIPU) */}
        <AffiliationTrustBarWidget />

        {/* 3. Leadership & Institution: Chairman's Desk (Left), Principal's Desk (Right) & About HSCE (Below) */}
        <PrincipalMessageSection />

        {/* 4. Affiliating University (GGSIPU): Campus, Statutory Profile, Vision, Mission & Quality Policy */}
        <UniversityAffiliationSection />

        {/* 5. Campus Notices & Events Highlights */}
        <NoticeEventsSection />

        {/* 5. B.Ed. Programme Overview & Highlights */}
        <ProgrammeHighlights />

        {/* 6. Why Choose HSCE (6 Institutional Pillars) */}
        <WhyChooseSection />

        {/* 7. Academic Infrastructure & Teacher Preparation */}
        <HighlightFeature />

        {/* 8. Campus Moments & Facilities Gallery */}
        <CampusGallerySection />

        {/* 9. Campus Life Beyond the Classroom (Immersive Navy Feature) */}
        <CampusLifeSection />

        {/* 10. Pupil-Teacher Voice & Student Spotlight */}
        <StarAlumni />

        {/* 11. Admission Call to Action & Helplines */}
        <AdmissionCTA />

        {/* 12. Frequently Asked Questions */}
        <FaqWidget />
      </main>
      <HomepagePopup />
    </>
  );
}

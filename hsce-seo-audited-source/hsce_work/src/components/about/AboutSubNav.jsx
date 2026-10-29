import React from "react";
import { Link } from "react-router-dom";
import { Container } from "../common/Container";
import { PageHeaderBanner } from "../common/PageHeaderBanner";
import { useLanguage } from "../../context/LanguageContext";

export const aboutTabs = [
  {
    id: "overview",
    to: "/about",
    title: "About Overview",
    hiTitle: "कॉलेज परिचय",
  },
  {
    id: "history",
    to: "/about/history",
    title: "History & Genesis",
    hiTitle: "इतिहास एवं विकास",
  },
  {
    id: "vision-mission",
    to: "/about/vision-mission",
    title: "Vision & Mission",
    hiTitle: "लक्ष्य एवं दृष्टि",
  },
  {
    id: "chairman",
    to: "/about/chairman",
    title: "Chairman's Desk",
    hiTitle: "चेयरमैन का संदेश",
  },
  {
    id: "principal",
    to: "/about/principal",
    title: "Principal's Desk",
    hiTitle: "प्राचार्या का संदेश",
  },
  {
    id: "recognition",
    to: "/about/recognition",
    title: "Recognition & Affiliation",
    hiTitle: "मान्यता एवं संबद्धता",
  },
  {
    id: "facilities",
    to: "/about/facilities",
    title: "Campus & Labs",
    hiTitle: "परिसर एवं प्रयोगशालाएं",
  },
  {
    id: "facts",
    to: "/about/facts",
    title: "Institutional Fact Sheet",
    hiTitle: "तथ्य विवरण",
  },
];

const tabBreadcrumbMap = {
  overview: "Overview",
  history: "History",
  "vision-mission": "Vision-Mission",
  chairman: "Chairman's Desk",
  principal: "Principal's Desk",
  recognition: "Recognition",
  facilities: "Facilities",
  facts: "Fact Sheet",
};

/**
 * Standard page banner for all About subpages matching the Graphic Era / Uttaranchal University design:
 * - Deep royal blue banner with title and subtitle
 * - Clean white breadcrumb bar with Home / About / [Current Page]
 */
export function AboutSubNav({
  activeTabId = "overview",
  title = "About Us",
  subtitle = "Haryana Shakti College of Education delivers a rich combination of academics and pedagogy excellence, quality of life and opportunity.",
}) {
  const currentTabName = tabBreadcrumbMap[activeTabId] || "Overview";

  const breadcrumbs =
    activeTabId === "overview"
      ? [{ label: "About" }]
      : [{ label: "About", href: "/about" }, { label: currentTabName }];

  return (
    <PageHeaderBanner
      title={title}
      subtitle={subtitle}
      breadcrumbs={breadcrumbs}
    />
  );
}

/**
 * Interactive About Subpages Navigator (Disabled as per user request)
 */
export function AboutPageNavigator() {
  return null;
}

export function AboutBottomCTA() {
  const { isHindi } = useLanguage();

  return (
    <section className="bg-gradient-to-r from-[#1c3274] via-[#203a88] to-[#162963] py-12 text-white border-t-4 border-amber-400">
      <Container>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="font-poppins font-bold text-xl sm:text-2xl text-white">
              {isHindi
                ? "व्यावसायिक शिक्षक शिक्षा में अपनी यात्रा शुरू करें"
                : "Begin Your Journey in Professional Teacher Education"}
            </h3>
            <p className="text-xs sm:text-sm text-white/90 max-w-2xl font-sans">
              {isHindi
                ? "हरियाणा शक्ति कॉलेज ऑफ एजुकेशन में विश्वविद्यालय और नियामक मानकों के अनुसार बी.एड. पाठ्यक्रम के लिए आवेदन आमंत्रित हैं।"
                : "Applications for the B.Ed. programme at Haryana Shakti College of Education are invited as per university and statutory norms."}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/admissions"
              className="inline-flex items-center justify-center rounded-md bg-amber-400 px-5 py-2.5 font-poppins text-xs font-bold text-[#0c1b33] shadow-sm hover:bg-amber-300 transition">
              {isHindi ? "प्रवेश प्रक्रिया" : "Admissions Procedure"}
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-md border border-white bg-transparent px-5 py-2.5 font-poppins text-xs font-semibold text-white hover:bg-white/10 transition">
              {isHindi ? "कॉलेज कार्यालय से संपर्क" : "Contact Campus Office"}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

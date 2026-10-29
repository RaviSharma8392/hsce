import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Building2,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

import { Container } from "../components/common/Container";
import { SectionHeading } from "../components/common/SectionHeading";

import {
  AboutSubNav,
  AboutBottomCTA,
  AboutPageNavigator,
} from "../components/about/AboutSubNav";

import { aboutOverviewContent } from "../data/aboutBilingualData";
import { collegeInfo as defaultCollegeInfo } from "../data/siteData";
import { usePublishedRecords } from "../hooks/usePublishedRecords";
import { useLanguage } from "../context/LanguageContext";

import { imageData, imageFallbacks } from "../data/imagesData";

const BLUE = "#0a4b8c";
const YELLOW = "#FBDD23";

const quickLinks = [
  {
    to: "/about/history",
    en: "History & Genesis",
    hi: "इतिहास एवं विकास",
  },
  {
    to: "/about/vision-mission",
    en: "Vision & Mission",
    hi: "लक्ष्य एवं दृष्टि",
  },
  {
    to: "/about/chairman",
    en: "Chairman's Desk",
    hi: "चेयरमैन का संदेश",
  },
  {
    to: "/about/principal",
    en: "Principal's Desk",
    hi: "प्राचार्या का संदेश",
  },
  {
    to: "/about/facilities",
    en: "Campus & Labs",
    hi: "परिसर एवं प्रयोगशालाएं",
  },
  {
    to: "/about/campus-life",
    en: "Campus Life",
    hi: "महाविद्यालय का जीवन",
  },
];

export default function AboutPage() {
  const { language, isHindi } = useLanguage();

  const content = aboutOverviewContent[language] || aboutOverviewContent.en;

  const siteSettings = usePublishedRecords("siteContent", [defaultCollegeInfo]);

  const collegeInfo =
    siteSettings.find((record) => record.id === "settings") ||
    siteSettings[0] ||
    defaultCollegeInfo;

  const [campusImage, setCampusImage] = useState(imageData.campusHero);

  const handleCampusImageError = () => {
    if (campusImage !== imageFallbacks.campusHero) {
      setCampusImage(imageFallbacks.campusHero);
    }
  };

  return (
    <>
      <Helmet>
        <title>
          {isHindi
            ? "कॉलेज अवलोकन | हरियाणा शक्ति कॉलेज ऑफ एजुकेशन"
            : "About the College | Haryana Shakti College of Education (HSCE)"}
        </title>

        <meta
          name="description"
          content={
            isHindi
              ? "हरियाणा शक्ति कॉलेज ऑफ एजुकेशन, कंझावला, दिल्ली के परिसर, शैक्षणिक वातावरण, छात्र जीवन और संस्थागत सुविधाओं के बारे में जानें।"
              : "Discover Haryana Shakti College of Education (HSCE), Kanjhawala, Delhi, its campus, academic environment, student life, institutional facilities and educational approach."
          }
        />

        <meta name="theme-color" content={BLUE} />
      </Helmet>

      {/* Page header and About navigation */}
      <AboutSubNav
        activeTabId="overview"
        title={content.title}
        subtitle={content.subtitle}
      />

      <main className="overflow-hidden bg-white font-sans text-gray-800">
        {/* MAIN OVERVIEW */}
        <section className="py-10 sm:py-12 lg:py-16">
          <Container>
            <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
              {/* LEFT: COLLEGE INTRODUCTION */}
              <div className="min-w-0 space-y-6 lg:col-span-7">
                <SectionHeading
                  eyebrow={content.eyebrow}
                  title={content.mainHeading}
                />

                <div className="space-y-4 font-sans text-sm leading-7 text-gray-600 sm:text-base sm:leading-8">
                  {content.paragraphs.map((para, idx) => (
                    <p key={idx} className="break-words">
                      {para}
                    </p>
                  ))}
                </div>

                {/* QUICK LINKS */}
                <div className="mt-8 rounded-2xl border border-gray-200 bg-[#fafcff] p-4 sm:p-6">
                  <div className="mb-4">
                    <span
                      className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em]"
                      style={{ color: BLUE }}>
                      {isHindi ? "और जानें" : "Explore HSCE"}
                    </span>

                    <h3 className="text-base font-bold tracking-tight text-gray-900 sm:text-lg">
                      {isHindi
                        ? "महाविद्यालय के अन्य महत्वपूर्ण अनुभाग"
                        : "Explore More Institutional Sections"}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {quickLinks.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="group flex min-h-12 items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-[#0a4b8c]/40 hover:bg-blue-50/60 hover:text-[#0a4b8c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a4b8c]/40 sm:px-4">
                        <span>{isHindi ? item.hi : item.en}</span>

                        <ArrowRight
                          size={16}
                          aria-hidden="true"
                          className="shrink-0 transition-transform duration-200 group-hover:translate-x-1"
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT: CAMPUS AND COLLEGE INFORMATION */}
              <aside className="min-w-0 space-y-5 lg:col-span-5">
                {/* CAMPUS HERO IMAGE */}
                <div className="group relative isolate overflow-hidden rounded-2xl bg-gray-100 shadow-sm ring-1 ring-black/5">
                  <img
                    src={campusImage}
                    width="1400"
                    height="900"
                    alt={
                      isHindi
                        ? "हरियाणा शक्ति कॉलेज ऑफ एजुकेशन का परिसर"
                        : "Haryana Shakti College of Education campus"
                    }
                    onError={handleCampusImageError}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] sm:aspect-[16/9] lg:aspect-[5/4]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/10 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                    <span
                      className="mb-2 inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-900 sm:text-xs"
                      style={{ backgroundColor: YELLOW }}>
                      {isHindi ? "हमारा परिसर" : "Our Campus"}
                    </span>

                    <h2 className="max-w-md text-xl font-bold leading-tight tracking-tight text-white sm:text-2xl">
                      {isHindi
                        ? "सीखने और आगे बढ़ने का वातावरण"
                        : "A Place to Learn, Grow and Lead"}
                    </h2>

                    <p className="mt-1.5 max-w-md text-xs leading-5 text-white/90 sm:text-sm sm:leading-6">
                      {isHindi
                        ? "शिक्षा, सहयोग और भावी शिक्षकों के विकास के लिए समर्पित।"
                        : "An educational environment focused on learning, collaboration and future educators."}
                    </p>
                  </div>
                </div>

                {/* COLLEGE INFORMATION CARD */}
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
                  <div className="flex items-start gap-3 border-b border-gray-100 pb-4 sm:gap-4">
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white sm:h-12 sm:w-12"
                      style={{ backgroundColor: BLUE }}>
                      <Building2 size={23} aria-hidden="true" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-bold leading-snug tracking-tight text-gray-900 sm:text-lg">
                        {content.governanceTitle}
                      </h3>

                      <p
                        className="mt-1 text-xs font-semibold leading-5 sm:text-sm"
                        style={{ color: BLUE }}>
                        {content.governanceSubtitle}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-5">
                    {/* ADDRESS */}
                    <InfoRow icon={MapPin} label={content.campusAddressLabel}>
                      <span className="break-words">{collegeInfo.address}</span>
                    </InfoRow>

                    {/* PHONE */}
                    <InfoRow icon={Phone} label={content.contactLabel}>
                      <div className="flex flex-wrap gap-x-2 gap-y-1">
                        {collegeInfo.phone && (
                          <a
                            href={`tel:${String(collegeInfo.phone).replace(
                              /[^\d+]/g,
                              "",
                            )}`}
                            className="transition-colors hover:text-[#0a4b8c] hover:underline">
                            {collegeInfo.phone}
                          </a>
                        )}

                        {collegeInfo.alternatePhone && (
                          <>
                            {collegeInfo.phone && (
                              <span aria-hidden="true">/</span>
                            )}

                            <a
                              href={`tel:${String(
                                collegeInfo.alternatePhone,
                              ).replace(/[^\d+]/g, "")}`}
                              className="transition-colors hover:text-[#0a4b8c] hover:underline">
                              {collegeInfo.alternatePhone}
                            </a>
                          </>
                        )}
                      </div>
                    </InfoRow>

                    {/* EMAIL */}
                    <InfoRow icon={Mail} label={content.emailLabel}>
                      {collegeInfo.email && (
                        <a
                          href={`mailto:${collegeInfo.email}`}
                          className="break-all transition-colors hover:text-[#0a4b8c] hover:underline">
                          {collegeInfo.email}
                        </a>
                      )}
                    </InfoRow>

                    {/* PRINCIPAL */}
                    <InfoRow
                      icon={GraduationCap}
                      label={content.principalLabel}>
                      <span className="font-semibold text-gray-800">
                        {collegeInfo.principal}
                      </span>
                    </InfoRow>
                  </div>

                  {/* EDUCATIONAL FOCUS */}
                  <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Sparkles
                        size={16}
                        className="shrink-0"
                        style={{ color: BLUE }}
                        aria-hidden="true"
                      />

                      <h4 className="text-sm font-bold" style={{ color: BLUE }}>
                        {content.focusTitle}
                      </h4>
                    </div>

                    <p className="text-sm leading-6 text-gray-600">
                      {content.focusDesc}
                    </p>
                  </div>
                </div>

                {/* INSTITUTIONAL PILLARS */}
                <div className="space-y-3">
                  {content.pillars.map((pillar, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 transition hover:border-[#0a4b8c]/30 hover:shadow-sm">
                      <CheckCircle2
                        size={19}
                        className="mt-0.5 shrink-0"
                        style={{ color: BLUE }}
                        aria-hidden="true"
                      />

                      <div className="min-w-0">
                        <h4 className="text-sm font-bold leading-5 text-gray-900 sm:text-base">
                          {pillar.title}
                        </h4>

                        <p className="mt-1 text-sm leading-6 text-gray-600">
                          {pillar.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          </Container>
        </section>

        {/* PREVIOUS / NEXT NAVIGATION */}
        <AboutPageNavigator nextTabId="history" />

        {/* BOTTOM CALL TO ACTION */}
        <AboutBottomCTA />
      </main>
    </>
  );
}

/**
 * Consistent icon, label and body typography
 * for college information.
 */
function InfoRow({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
        <Icon size={17} style={{ color: BLUE }} aria-hidden="true" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold leading-5 text-gray-900 sm:text-sm">
          {label}
        </p>

        <div className="mt-0.5 break-words text-sm leading-6 text-gray-600">
          {children}
        </div>
      </div>
    </div>
  );
}

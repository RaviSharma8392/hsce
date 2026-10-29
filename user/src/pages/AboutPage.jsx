import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Building2,
  Phone,
  Mail,
  MapPin,
  Target,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

import { CollegiatePageLayout } from "../components/common/CollegiatePageLayout";
import { getAboutSidebarConfig } from "../data/navigationConfig";
import { aboutOverviewContent } from "../data/aboutBilingualData";
import { collegeInfo as defaultCollegeInfo } from "../data/siteData";
import { usePublishedRecords } from "../hooks/usePublishedRecords";
import { useLanguage } from "../context/LanguageContext";
import { imageData, imageFallbacks } from "../data/imagesData";

const BLUE = "#2E3A8C";
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
    to: "/about/recognition",
    en: "Recognition & Affiliation",
    hi: "मान्यता एवं संबद्धता",
  },
  {
    to: "/about/facts",
    en: "Fact Sheet",
    hi: "तथ्य विवरण",
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

  const sidebarConfig = getAboutSidebarConfig(isHindi);

  return (
    <>
      <Helmet>
        <meta name="theme-color" content={BLUE} />
      </Helmet>

      <CollegiatePageLayout
        bannerTitle={content.title}
        bannerSubtitle={content.subtitle}
        breadcrumbs={[{ label: isHindi ? "कॉलेज परिचय" : "About" }]}
        sidebarTitle={sidebarConfig.title}
        sidebarItems={sidebarConfig.items}
        quickActions={sidebarConfig.quickActions}>
        <div className="space-y-8">
          {/* Main Card with Image 4 Style Header */}
          <div className="rounded-md border border-gray-200/90 bg-white p-6 sm:p-8 shadow-xs">
            {/* Header with Blue Underline (Image 4 Style) */}
            <div className="border-b border-gray-200 pb-4 mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2E3A8C]">
                {content.eyebrow}
              </span>
              <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {content.mainHeading}
              </h2>
              <div className="mt-3 h-1 w-20 bg-[#2E3A8C] rounded-full" />
            </div>

            {/* Paragraph Narrative */}
            <div className="space-y-4 font-sans text-sm sm:text-base leading-relaxed text-slate-700">
              {content.paragraphs.map((para, idx) => (
                <p key={idx} className="break-words text-justify">
                  {para}
                </p>
              ))}
            </div>

            {/* Explore Subsections Grid */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="font-serif text-lg font-bold text-slate-900 mb-4">
                {isHindi
                  ? "महाविद्यालय के अन्य महत्वपूर्ण अनुभाग"
                  : "Explore Institutional Sections"}
              </h3>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {quickLinks.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="group flex min-h-12 items-center justify-between gap-3 rounded-md border border-gray-200 bg-slate-50/70 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-[#2E3A8C] hover:bg-white hover:text-[#2E3A8C]">
                    <span>{isHindi ? item.hi : item.en}</span>
                    <ArrowRight
                      size={16}
                      aria-hidden="true"
                      className="shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-[#2E3A8C]"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Campus Hero Card & Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Campus Image Card */}
            <div className="group relative isolate overflow-hidden rounded-md border border-gray-200/90 bg-gray-100 shadow-xs">
              <img
                src={campusImage}
                width="800"
                height="500"
                alt="Haryana Shakti College of Education Campus"
                onError={handleCampusImageError}
                loading="lazy"
                decoding="async"
                className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/85 via-gray-950/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <span className="mb-1.5 inline-block rounded bg-[#FBDD23] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-900">
                  {isHindi ? "हमारा परिसर" : "Our Campus"}
                </span>
                <h3 className="font-serif text-lg font-bold">
                  {isHindi
                    ? "सीखने और आगे बढ़ने का वातावरण"
                    : "A Place to Learn, Grow and Lead"}
                </h3>
                <p className="mt-1 text-xs text-white/90">
                  {isHindi
                    ? "शिक्षा, सहयोग और भावी शिक्षकों के विकास के लिए समर्पित।"
                    : "Dedicated to pedagogical excellence, innovation and mentoring."}
                </p>
              </div>
            </div>

            {/* Governance & Contact Card */}
            <div className="rounded-md border border-gray-200/90 bg-white p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 border-b border-gray-100 pb-3 mb-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#2E3A8C] text-white">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-slate-900 leading-snug">
                      {content.governanceTitle}
                    </h3>
                    <p className="text-xs font-semibold text-[#2E3A8C]">
                      {content.governanceSubtitle}
                    </p>
                  </div>
                </div>

                <div className="space-y-3.5 text-xs sm:text-sm">
                  <InfoRow icon={MapPin} label={content.campusAddressLabel}>
                    <span className="break-words text-slate-600">{collegeInfo.address}</span>
                  </InfoRow>

                  <InfoRow icon={Phone} label={content.contactLabel}>
                    <div className="flex flex-wrap gap-x-2 text-slate-600">
                      {collegeInfo.phone && (
                        <a
                          href={`tel:${String(collegeInfo.phone).replace(/[^\d+]/g, "")}`}
                          className="hover:text-[#2E3A8C] hover:underline">
                          {collegeInfo.phone}
                        </a>
                      )}
                      {collegeInfo.alternatePhone && (
                        <span>/ {collegeInfo.alternatePhone}</span>
                      )}
                    </div>
                  </InfoRow>

                  <InfoRow icon={Mail} label={content.emailLabel}>
                    {collegeInfo.email && (
                      <a
                        href={`mailto:${collegeInfo.email}`}
                        className="break-all text-slate-600 hover:text-[#2E3A8C] hover:underline">
                        {collegeInfo.email}
                      </a>
                    )}
                  </InfoRow>

                  <InfoRow icon={GraduationCap} label={content.principalLabel}>
                    <span className="font-semibold text-slate-800">
                      {collegeInfo.principal}
                    </span>
                  </InfoRow>
                </div>
              </div>

              {/* Educational Focus Callout */}
              <div className="mt-4 rounded-md border border-blue-100 bg-blue-50/70 p-3.5">
                <div className="flex items-center gap-2 mb-1">
                  <Target size={15} className="text-[#2E3A8C]" />
                  <h4 className="text-xs font-bold text-[#2E3A8C]">
                    {content.focusTitle}
                  </h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {content.focusDesc}
                </p>
              </div>
            </div>
          </div>

          {/* Institutional Pillars */}
          <div className="rounded-md border border-gray-200/90 bg-white p-6 sm:p-8 shadow-xs">
            <h3 className="font-serif text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-gray-100">
              {isHindi ? "संस्थागत स्तंभ एवं प्राथमिकताएं" : "Institutional Pillars & Values"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {content.pillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded-md border border-gray-200/80 bg-slate-50/50 p-4 transition hover:border-[#2E3A8C]/50 hover:bg-white">
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-[#2E3A8C]"
                  />
                  <div>
                    <h4 className="font-serif text-sm font-bold text-slate-900">
                      {pillar.title}
                    </h4>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CollegiatePageLayout>
    </>
  );
}

function InfoRow({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded bg-slate-100 text-[#2E3A8C]">
        <Icon size={14} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          {label}
        </p>
        <div className="mt-0.5 break-words font-medium">{children}</div>
      </div>
    </div>
  );
}

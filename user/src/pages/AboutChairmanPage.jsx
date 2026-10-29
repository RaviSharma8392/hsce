import React from "react";
import { Mail, Award } from "lucide-react";
import { CollegiatePageLayout } from "../components/common/CollegiatePageLayout";
import { getAboutSidebarConfig } from "../data/navigationConfig";
import { aboutChairmanContent } from "../data/aboutBilingualData";
import { collegeInfo as defaultCollegeInfo } from "../data/siteData";
import { imageData } from "../data/imagesData";
import { usePublishedRecords } from "../hooks/usePublishedRecords";
import { useLanguage } from "../context/LanguageContext";

export default function AboutChairmanPage() {
  const { language, isHindi } = useLanguage();
  const content = aboutChairmanContent[language] || aboutChairmanContent.en;

  const siteSettings = usePublishedRecords("siteContent", [defaultCollegeInfo]);
  const collegeInfo =
    siteSettings.find((record) => record.id === "settings") ||
    siteSettings[0] ||
    defaultCollegeInfo;

  const chairmanName = isHindi
    ? content.name
    : collegeInfo.chairman && collegeInfo.chairman !== "Chairman"
      ? collegeInfo.chairman
      : content.name;
  const chairmanDesignation = isHindi
    ? content.designation
    : collegeInfo.chairmanDesignation || content.designation;
  const chairmanMessage =
    collegeInfo.chairmanMessage?.trim() || content.quote;
  const chairmanImage =
    collegeInfo.chairmanImage || imageData.chairmanPortrait;

  const sidebarConfig = getAboutSidebarConfig(isHindi);

  return (
    <CollegiatePageLayout
      bannerTitle={content.title}
      bannerSubtitle={content.subtitle}
      breadcrumbs={[
        { label: isHindi ? "कॉलेज परिचय" : "About", href: "/about" },
        { label: isHindi ? "चेयरमैन का संदेश" : "Chairman's Desk" },
      ]}
      sidebarTitle={sidebarConfig.title}
      sidebarItems={sidebarConfig.items}
      quickActions={sidebarConfig.quickActions}>
      <div className="space-y-8">
        {/* Main Leadership Message Card */}
        <div className="rounded-md border border-gray-200/90 bg-white p-6 sm:p-8 shadow-xs">
          {/* Header with Blue Underline */}
          <div className="border-b border-gray-200 pb-4 mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E3A8C]">
              {content.eyebrow}
            </span>
            <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {content.mainHeading}
            </h2>
            <div className="mt-3 h-1 w-20 bg-[#2E3A8C] rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left: Chairman Portrait Profile (Image 4 Style) */}
            <div className="md:col-span-5 lg:col-span-4">
              <div className="rounded-md border border-gray-200 bg-slate-50/70 p-4 shadow-2xs text-center">
                <div className="overflow-hidden rounded-md border border-gray-300/80 bg-white p-1 inline-block shadow-xs">
                  <img
                    src={chairmanImage}
                    alt={chairmanName}
                    className="h-64 w-52 object-cover rounded"
                  />
                </div>
                <h3 className="mt-3.5 font-serif text-lg font-bold text-slate-900">
                  {chairmanName}
                </h3>
                <p className="text-xs font-semibold text-[#2E3A8C]">
                  {chairmanDesignation}
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Haryana Shakti College of Education
                </p>

                {collegeInfo.email && (
                  <div className="mt-3 pt-3 border-t border-gray-200/70">
                    <a
                      href={`mailto:${collegeInfo.email}`}
                      className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-[#2E3A8C]">
                      <Mail size={13} className="text-[#2E3A8C]" />
                      <span>{collegeInfo.email}</span>
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Chairman Message & Vision Details */}
            <div className="md:col-span-7 lg:col-span-8 space-y-4">
              {/* Highlight Quote */}
              <blockquote className="rounded-md border-l-4 border-[#2E3A8C] bg-slate-50 p-5 font-serif text-sm sm:text-base italic text-slate-800 leading-relaxed shadow-2xs">
                &ldquo;{chairmanMessage}&rdquo;
              </blockquote>

              <div className="space-y-3.5 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans text-justify">
                {content.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              {/* Leadership Sign-off */}
              <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-sm text-slate-900">
                    {chairmanName}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {chairmanDesignation}, HSCE
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#2E3A8C]">
                  <Award size={16} />
                  <span>{isHindi ? "संस्थापक विज़न" : "Founding Vision"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CollegiatePageLayout>
  );
}

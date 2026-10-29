import React from "react";
import { Calendar } from "lucide-react";
import { CollegiatePageLayout } from "../components/common/CollegiatePageLayout";
import { getAboutSidebarConfig } from "../data/navigationConfig";
import { aboutHistoryContent } from "../data/aboutBilingualData";
import { useLanguage } from "../context/LanguageContext";

export default function AboutHistoryPage() {
  const { language, isHindi } = useLanguage();
  const content = aboutHistoryContent[language] || aboutHistoryContent.en;
  const sidebarConfig = getAboutSidebarConfig(isHindi);

  return (
    <CollegiatePageLayout
      bannerTitle={content.title}
      bannerSubtitle={content.subtitle}
      breadcrumbs={[
        { label: isHindi ? "कॉलेज परिचय" : "About", href: "/about" },
        { label: isHindi ? "इतिहास एवं विकास" : "History & Genesis" },
      ]}
      sidebarTitle={sidebarConfig.title}
      sidebarItems={sidebarConfig.items}
      quickActions={sidebarConfig.quickActions}>
      <div className="space-y-8">
        {/* Main Historical Narrative Card */}
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

          <p className="text-sm font-semibold text-[#2E3A8C] mb-6">
            {content.subHeading}
          </p>

          <div className="grid gap-8 lg:grid-cols-12 items-start">
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-4 text-sm text-slate-700 leading-relaxed font-sans">
              {content.paragraphs.map((para, idx) => (
                <p key={idx} className="text-justify">
                  {para}
                </p>
              ))}

              <div className="mt-6 rounded-md bg-amber-50/70 border-l-4 border-[#2E3A8C] p-4 shadow-2xs">
                <h4 className="font-serif font-bold text-sm text-slate-900">
                  {content.calloutTitle}
                </h4>
                <p className="mt-1 text-xs text-slate-700 leading-relaxed font-sans">
                  {content.calloutText}
                </p>
              </div>
            </div>

            {/* Right Milestones Timeline */}
            <div className="lg:col-span-5">
              <div className="rounded-md border border-gray-200 bg-slate-50/70 p-5 shadow-2xs">
                <h3 className="font-serif font-bold text-sm text-slate-900 uppercase tracking-wider mb-5 flex items-center gap-2 border-b border-gray-200 pb-2.5">
                  <Calendar size={17} className="text-[#2E3A8C]" />
                  <span>{content.timelineTitle}</span>
                </h3>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#2E3A8C]/20">
                  {content.milestones.map((item, idx) => (
                    <div key={idx} className="relative">
                      {/* Timeline Dot */}
                      <span className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#2E3A8C] shadow-xs" />
                      <span className="inline-block text-xs font-bold text-[#2E3A8C] bg-white px-2 py-0.5 rounded border border-gray-200/80 mb-1">
                        {item.year}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-serif leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CollegiatePageLayout>
  );
}

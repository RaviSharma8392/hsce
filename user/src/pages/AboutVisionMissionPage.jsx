import React from "react";
import { Award, BookOpen, Target, Compass, CheckCircle2 } from "lucide-react";
import { CollegiatePageLayout } from "../components/common/CollegiatePageLayout";
import { getAboutSidebarConfig } from "../data/navigationConfig";
import { aboutVisionContent } from "../data/aboutBilingualData";
import { useLanguage } from "../context/LanguageContext";

export default function AboutVisionMissionPage() {
  const { language, isHindi } = useLanguage();
  const content = aboutVisionContent[language] || aboutVisionContent.en;
  const sidebarConfig = getAboutSidebarConfig(isHindi);

  return (
    <CollegiatePageLayout
      bannerTitle={content.title}
      bannerSubtitle={content.subtitle}
      breadcrumbs={[
        { label: isHindi ? "कॉलेज परिचय" : "About", href: "/about" },
        { label: isHindi ? "लक्ष्य एवं दृष्टि" : "Vision & Mission" },
      ]}
      sidebarTitle={sidebarConfig.title}
      sidebarItems={sidebarConfig.items}
      quickActions={sidebarConfig.quickActions}>
      <div className="space-y-8">
        {/* Page Heading Card with Blue Underline */}
        <div className="rounded-md border border-gray-200/90 bg-white p-6 sm:p-8 shadow-xs">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E3A8C]">
              {content.eyebrow}
            </span>
            <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {content.mainHeading}
            </h2>
            <div className="mt-3 h-1 w-20 bg-[#2E3A8C] rounded-full" />
          </div>

          <div className="grid gap-6 md:grid-cols-2 items-stretch">
            {/* Vision Card */}
            <div className="rounded-md border border-gray-200/90 bg-slate-50/60 p-6 flex flex-col justify-between">
              <div>
                <div className="inline-flex rounded-md bg-[#2E3A8C] p-2.5 text-white mb-4 shadow-xs">
                  <Award size={22} />
                </div>
                <h3 className="font-serif font-bold text-xl text-slate-900">
                  {content.visionTitle}
                </h3>
                <div className="my-3 h-0.5 w-12 bg-[#2E3A8C]" />
                <blockquote className="text-sm font-serif italic text-slate-800 leading-relaxed bg-white p-4 rounded border-l-4 border-[#2E3A8C] shadow-2xs">
                  &ldquo;{content.visionStatement}&rdquo;
                </blockquote>
                <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                  {content.visionDetails}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between text-xs text-[#2E3A8C] font-semibold">
                <span>{content.visionTagline}</span>
                <Target size={15} />
              </div>
            </div>

            {/* Mission Card */}
            <div className="rounded-md border border-gray-200/90 bg-slate-50/60 p-6 flex flex-col justify-between">
              <div>
                <div className="inline-flex rounded-md bg-[#2E3A8C] p-2.5 text-white mb-4 shadow-xs">
                  <BookOpen size={22} />
                </div>
                <h3 className="font-serif font-bold text-xl text-slate-900">
                  {content.missionTitle}
                </h3>
                <div className="my-3 h-0.5 w-12 bg-[#2E3A8C]" />
                <blockquote className="text-sm font-serif italic text-slate-800 leading-relaxed bg-white p-4 rounded border-l-4 border-[#F5CB1E] shadow-2xs">
                  &ldquo;{content.missionStatement}&rdquo;
                </blockquote>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between text-xs text-[#2E3A8C] font-semibold">
                <span>{content.missionPillarsTitle}</span>
                <Compass size={15} />
              </div>
            </div>
          </div>

          {/* Core Objectives Section */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="font-serif text-lg font-bold text-slate-900 mb-4">
              {content.missionPillarsTitle}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {content.missionPoints.map((point) => (
                <div
                  key={point.heading}
                  className="flex items-start gap-3 rounded-md border border-gray-200/80 bg-white p-3.5 shadow-2xs">
                  <CheckCircle2
                    size={17}
                    className="mt-0.5 shrink-0 text-[#2E3A8C]"
                  />
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-900">
                      {point.heading}
                    </h4>
                    <p className="mt-1 text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {point.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </CollegiatePageLayout>
  );
}

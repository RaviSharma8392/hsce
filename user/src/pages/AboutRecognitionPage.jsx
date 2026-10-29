import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, FileText, ArrowRight } from "lucide-react";
import { CollegiatePageLayout } from "../components/common/CollegiatePageLayout";
import { getAboutSidebarConfig } from "../data/navigationConfig";
import { aboutRecognitionContent } from "../data/aboutBilingualData";
import { useLanguage } from "../context/LanguageContext";

export default function AboutRecognitionPage() {
  const { language, isHindi } = useLanguage();
  const content = aboutRecognitionContent[language] || aboutRecognitionContent.en;
  const sidebarConfig = getAboutSidebarConfig(isHindi);

  return (
    <CollegiatePageLayout
      bannerTitle={content.title}
      bannerSubtitle={content.subtitle}
      breadcrumbs={[
        { label: isHindi ? "कॉलेज परिचय" : "About", href: "/about" },
        { label: isHindi ? "मान्यता एवं संबद्धता" : "Recognition & Affiliation" },
      ]}
      sidebarTitle={sidebarConfig.title}
      sidebarItems={sidebarConfig.items}
      quickActions={sidebarConfig.quickActions}>
      <div className="space-y-8">
        {/* Main Recognition Card */}
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

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-sans">
            {content.regulatorySummary}
          </p>

          <div className="grid gap-5 md:grid-cols-2">
            {content.items.map((item, idx) => (
              <div
                key={idx}
                className="rounded-md border border-gray-200 bg-slate-50/60 p-5 shadow-2xs hover:border-[#2E3A8C]/50 hover:bg-white transition group">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-3 mb-3">
                  <h4 className="font-serif font-bold text-sm sm:text-base text-slate-900">
                    {item.body}
                  </h4>
                  <span className="self-start sm:self-auto rounded bg-amber-100 border border-amber-300 px-2.5 py-0.5 text-[11px] font-semibold text-[#2E3A8C] whitespace-nowrap">
                    {item.status}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                  {item.details}
                </p>
              </div>
            ))}
          </div>

          {/* Regulatory Disclaimer & Direct Mandatory Disclosure Link */}
          <div className="mt-8 rounded-md border border-amber-200 bg-amber-50/70 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-start gap-3">
              <ShieldCheck
                size={22}
                className="text-[#2E3A8C] shrink-0 mt-0.5"
              />
              <div>
                <h4 className="font-serif font-bold text-sm text-slate-900">
                  {content.disclaimerTitle}
                </h4>
                <p className="text-xs text-slate-700 mt-0.5 font-sans">
                  {content.disclaimerBody}
                </p>
              </div>
            </div>

            <Link
              to="/mandatory-disclosure"
              className="inline-flex items-center gap-1.5 rounded-md bg-[#2E3A8C] px-4 py-2 text-xs font-bold text-white hover:bg-[#232d70] transition whitespace-nowrap shrink-0 shadow-xs">
              <FileText size={14} />
              <span>{content.disclosureBtnText}</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </CollegiatePageLayout>
  );
}

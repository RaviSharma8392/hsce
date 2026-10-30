import React from "react";
import { Phone, Mail } from "lucide-react";
import { CollegiatePageLayout } from "../components/common/CollegiatePageLayout";
import { getAboutSidebarConfig } from "../data/navigationConfig";
import { useLanguage } from "../context/LanguageContext";

const INSTITUTIONAL_FACTS = {
  en: {
    title: "Institutional Fact Sheet",
    subtitle:
      "Key institutional metrics for prospective students, regulatory bodies, and visitors.",
    eyebrow: "Key Parameters",
    mainHeading: "Institutional Fact Sheet At a Glance",
    lead: "Key institutional metrics for prospective students, regulatory bodies, and visitors.",
    parameterHeading: "Institutional Parameter",
    detailsHeading: "Details / Verification",
    facts: [
      {
        label: "Institution Name",
        value: "Haryana Shakti College of Education",
      },
      {
        label: "Established Year",
        value: "2012 (14+ Years of Educational Service)",
      },
      {
        label: "Principal",
        value: "Dr. Savita Rathee (M.A., M.Ed., Ph.D.)",
      },
      {
        label: "Campus Address",
        value: "Kanjhawala, Delhi – 110081",
      },
      {
        label: "Contact Helplines",
        value: "9953155054 / 8056777077",
        isPhone: true,
      },
      {
        label: "Official Email",
        value: "hsce.kanjhawala@gmail.com",
        isEmail: true,
      },
      {
        label: "Academic Course",
        value: "B.Ed. (Bachelor of Education — 2-Year Regular)",
      },
      {
        label: "Affiliating University",
        value: "Guru Gobind Singh Indraprastha University (GGSIPU)",
      },
      {
        label: "Statutory Approval",
        value: "National Council for Teacher Education (NCTE)",
      },
      {
        label: "Quality Accreditation",
        value: "Accredited by NAAC",
      },
      {
        label: "Institutional Society",
        value: "Haryana Shakti Education Society",
      },
    ],
  },
  hi: {
    title: "संस्थागत तथ्य विवरण",
    subtitle:
      "भावी विद्यार्थियों, नियामक निकायों और आगंतुकों के लिए मुख्य संस्थागत आंकड़े एवं तथ्य।",
    eyebrow: "मुख्य मापदंड (Key Parameters)",
    mainHeading: "संस्थागत तथ्य विवरण: एक नज़र में",
    lead: "भावी विद्यार्थियों, नियामक निकायों और आगंतुकों के लिए मुख्य संस्थागत आंकड़े एवं तथ्य।",
    parameterHeading: "संस्थागत मापदंड (Institutional Parameter)",
    detailsHeading: "प्रमाणित विवरण (Details / Verification)",
    facts: [
      {
        label: "संस्थान का नाम (Institution Name)",
        value: "हरियाणा शक्ति कॉलेज ऑफ एजुकेशन (Haryana Shakti College of Education)",
      },
      {
        label: "स्थापना वर्ष (Established Year)",
        value: "2012 (14+ वर्षों की समर्पित शिक्षा सेवा)",
      },
      {
        label: "प्राचार्या (Principal)",
        value: "डॉ. सविता राठी (M.A., M.Ed., Ph.D.)",
      },
      {
        label: "परिसर का पता (Campus Address)",
        value: "कंझावला, दिल्ली – 110081 (Kanjhawala, Delhi – 110081)",
      },
      {
        label: "संपर्क हेल्पलाइन (Contact Helplines)",
        value: "9953155054 / 8056777077",
        isPhone: true,
      },
      {
        label: "आधिकारिक ईमेल (Official Email)",
        value: "hsce.kanjhawala@gmail.com",
        isEmail: true,
      },
      {
        label: "शैक्षणिक पाठ्यक्रम (Academic Course)",
        value: "बी.एड. (Bachelor of Education — 2-Year Regular)",
      },
      {
        label: "संबद्ध विश्वविद्यालय (Affiliating University)",
        value: "गुरु गोबिंद सिंह इंद्रप्रस्थ विश्वविद्यालय (GGSIPU)",
      },
      {
        label: "वैधानिक मान्यता (Statutory Approval)",
        value: "राष्ट्रीय अध्यापक शिक्षा परिषद (NCTE)",
      },
      {
        label: "गुणवत्ता प्रत्यायन (Quality Accreditation)",
        value: "नैक (NAAC) द्वारा मूल्यांकित",
      },
      {
        label: "संचालक संस्था (Institutional Society)",
        value: "हरियाणा शक्ति एजुकेशन सोसाइटी (Haryana Shakti Education Society)",
      },
    ],
  },
};

export default function AboutFactsPage() {
  const { isHindi } = useLanguage();
  const content = isHindi ? INSTITUTIONAL_FACTS.hi : INSTITUTIONAL_FACTS.en;
  const sidebarConfig = getAboutSidebarConfig(isHindi);

  return (
    <CollegiatePageLayout
      bannerTitle={content.title}
      bannerSubtitle={content.subtitle}
      breadcrumbs={[
        { label: isHindi ? "कॉलेज परिचय" : "About", href: "/about" },
        { label: isHindi ? "तथ्य विवरण" : "Fact Sheet" },
      ]}
      sidebarTitle={sidebarConfig.title}
      sidebarItems={sidebarConfig.items}
      quickActions={sidebarConfig.quickActions}>
      <div className="space-y-8">
        {/* Main Fact Sheet Table */}
        <div className="rounded-md border border-gray-200/90 bg-white overflow-hidden shadow-xs">
          {/* Header Bar */}
          <div className="bg-[#E4E7F5] px-6 py-4 border-b border-gray-200/80">
            <div className="flex items-center gap-2 mb-1">
              <span className="h-0.5 w-6 bg-[#363991]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#363991]">
                {content.eyebrow}
              </span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1E242C] tracking-tight">
              {content.mainHeading}
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 font-sans">
              {content.lead}
            </p>
          </div>

          {/* Zebra-Striped Facts Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[460px] text-left text-xs sm:text-sm font-sans border-collapse">
              <thead>
                <tr className="bg-[#1F242C] text-white">
                  <th className="py-3 px-4 sm:py-3.5 sm:px-6 font-bold text-sm tracking-wide border-r border-[#333a44] w-2/5">
                    {content.parameterHeading}
                  </th>
                  <th className="py-3 px-4 sm:py-3.5 sm:px-6 font-bold text-sm tracking-wide">
                    {content.detailsHeading}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/80">
                {content.facts.map((fact, idx) => (
                  <tr
                    key={idx}
                    className={`transition-colors hover:bg-blue-50/40 ${
                      idx % 2 === 1 ? "bg-slate-50/70" : "bg-white"
                    }`}>
                    <td className="px-4 py-3 sm:px-6 sm:py-3.5 font-bold text-slate-800 border-r border-gray-200/80 align-top">
                      {fact.label || fact.param}
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-3.5 text-slate-700 leading-relaxed font-medium">
                      {fact.isPhone ? (
                        <div className="flex items-center gap-2">
                          <Phone size={14} className="text-[#363991] shrink-0" />
                          <span>{fact.value || fact.val}</span>
                        </div>
                      ) : fact.isEmail ? (
                        <a
                          href={`mailto:${fact.value || fact.val}`}
                          className="inline-flex items-center gap-2 text-[#363991] hover:underline">
                          <Mail size={14} className="shrink-0" />
                          <span>{fact.value || fact.val}</span>
                        </a>
                      ) : (
                        <span>{fact.value || fact.val}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </CollegiatePageLayout>
  );
}

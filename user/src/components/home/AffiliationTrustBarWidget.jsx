import React from "react";
import { Building2, Award, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

import { Container } from "../common/Container";
import { useLanguage } from "../../context/LanguageContext";
import { imageData } from "../../data/imagesData";

export function AffiliationTrustBarWidget() {
  const { isHindi } = useLanguage();

  const affiliations = [
    {
      logoUrl: imageData.ncteLogo,
      enTitle: "NCTE Approved",
      hiTitle: "एनसीटीई मान्यता प्राप्त",
      enDesc: "Statutory Body, Govt. of India",
      hiDesc: "भारत सरकार की वैधानिक संस्था",
      badgeEn: "Statutory Recognition",
      badgeHi: "वैधानिक मान्यता",
    },
    {
      logoUrl: imageData.ggsipuLogo,
      enTitle: "GGSIPU Affiliated",
      hiTitle: "जीजीएसआईपीयू से संबद्ध",
      enDesc: "Guru Gobind Singh Indraprastha University",
      hiDesc: "गुरु गोबिंद सिंह इंद्रप्रस्थ विश्वविद्यालय",
      badgeEn: "University Affiliation",
      badgeHi: "विश्वविद्यालय संबद्धता",
    },
    {
      logoUrl: imageData.naacLogo,
      enTitle: "NAAC Accreditation",
      hiTitle: "नैक मान्यता",
      enDesc: "Quality Assurance in Education",
      hiDesc: "गुणवत्तापूर्ण उच्च शिक्षा",
      badgeEn: "Quality Assurance",
      badgeHi: "गुणवत्ता मानक",
    },
    {
      icon: Building2,
      enTitle: "HSES Society",
      hiTitle: "हरियाणा शक्ति एजुकेशन",
      enDesc: "Visionary Trust Established in 2012",
      hiDesc: "2012 में स्थापित शैक्षणिक ट्रस्ट",
      badgeEn: "Founding Society",
      badgeHi: "संस्थापक समिति",
    },
    {
      logoUrl: imageData.certificate,
      enTitle: "2-Year Regular B.Ed.",
      hiTitle: "नियमित बी.एड. कार्यक्रम",
      enDesc: "Comprehensive Teacher Education",
      hiDesc: "व्यावसायिक शिक्षक प्रशिक्षण",
      badgeEn: "Approved Degree",
      badgeHi: "मान्यता प्राप्त डिग्री",
    },
  ];

  return (
    <section className="border-y border-slate-200/80 bg-white py-12 font-sans sm:py-14 lg:py-16">
      <Container>
        {/* Section Header */}
        <div className="mb-8 sm:mb-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-[34px] leading-tight">
              {isHindi ? (
                <>
                  विश्वास, गुणवत्ता एवं{" "}
                  <span className="text-[#0a4b8c]">संबद्धता की पहचान</span>
                </>
              ) : (
                <>
                  Recognized Excellence in{" "}
                  <span className="text-[#0a4b8c]">Teacher Education</span>
                </>
              )}
            </h2>

            <div className="mt-3.5 h-0.5 w-12 rounded-full bg-[#FBDD23]" />

            <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
              {isHindi
                ? "हरियाणा शक्ति कॉलेज ऑफ एजुकेशन एनसीटीई से विधिवत मान्यता प्राप्त और गुरु गोबिंद सिंह इंद्रप्रस्थ विश्वविद्यालय (GGSIPU), दिल्ली से संबद्ध है।"
                : "HSCE operates under statutory approval from the National Council for Teacher Education (NCTE) and affiliation with Guru Gobind Singh Indraprastha University (GGSIPU), Delhi."}
            </p>
          </div>

          <Link
            to="/about"
            className="group inline-flex shrink-0 items-center gap-2 rounded-lg border border-[#0a4b8c]/20 bg-blue-50/50 px-4 py-2.5 text-sm font-semibold text-[#0a4b8c] transition-all duration-200 hover:bg-[#0a4b8c] hover:text-white hover:shadow-sm">
            <span>{isHindi ? "मान्यता आदेश देखें" : "View Disclosures"}</span>
            <ArrowRight
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Affiliation Cards Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 sm:gap-5">
          {affiliations.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.enTitle}
                className="group relative flex min-w-0 flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#0a4b8c]/50 hover:shadow-lg">
                <div>
                  {/* Logo Container */}
                  <div className="mb-4 flex h-24 w-full items-center justify-center rounded-xl bg-slate-50/90 p-3 border border-slate-100 transition-colors group-hover:border-blue-100 group-hover:bg-blue-50/30 sm:h-28">
                    {item.logoUrl ? (
                      <img
                        src={item.logoUrl}
                        alt={isHindi ? item.hiTitle : item.enTitle}
                        className="h-full w-full object-contain"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white text-[#0a4b8c] shadow-xs">
                        <Icon size={34} strokeWidth={1.8} />
                      </div>
                    )}
                  </div>

                  {/* Text Details */}
                  <h3 className="text-base font-bold leading-snug text-gray-900 transition-colors group-hover:text-[#0a4b8c]">
                    {isHindi ? item.hiTitle : item.enTitle}
                  </h3>

                  <p className="mt-1.5 text-xs font-medium leading-relaxed text-gray-500">
                    {isHindi ? item.hiDesc : item.enDesc}
                  </p>
                </div>

                {/* Status Pill */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#0a4b8c]">
                    <CheckCircle2 size={13} className="text-[#0a4b8c] shrink-0" />
                    <span>{isHindi ? item.badgeHi : item.badgeEn}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export default AffiliationTrustBarWidget;

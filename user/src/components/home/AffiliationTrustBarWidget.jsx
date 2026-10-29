import React from "react";
import {
  Landmark,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Users,
  BookOpen,
  Award,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { imageData } from "../../data/imagesData";

export function AffiliationTrustBarWidget() {
  const { isHindi } = useLanguage();

  const associations = [
    {
      logoUrl: imageData.ncteLogo,
      title: isHindi ? "एनसीटीई मान्यता प्राप्त" : "NCTE Approved",
      subtitle: isHindi
        ? "राष्ट्रीय अध्यापक शिक्षा परिषद, भारत सरकार"
        : "Statutory Body, Government of India",
      tag: isHindi ? "वैधानिक मान्यता" : "Statutory Recognition",
      to: "/about/recognition",
    },
    {
      logoUrl: imageData.ggsipuLogo,
      title: isHindi ? "जीजीएसआईपीयू संबद्ध" : "GGSIPU Affiliated",
      subtitle: isHindi
        ? "गुरु गोबिंद सिंह इंद्रप्रस्थ वि.वि. (कोड: 147)"
        : "Guru Gobind Singh Indraprastha University (Code: 147)",
      tag: isHindi ? "विश्वविद्यालय संबद्धता" : "University Affiliation",
      to: "/about/recognition",
    },
    {
      icon: Landmark,
      title: isHindi ? "एचएसईएस सोसाइटी" : "HSES Society",
      subtitle: isHindi
        ? "हरियाणा शक्ति एजुकेशन सोसाइटी (2012)"
        : "Haryana Shakti Education Society (Regd. 2012)",
      tag: isHindi ? "संस्थापक सोसाइटी" : "Founding Society",
      to: "/about",
    },
    {
      icon: Award,
      title: isHindi ? "2-वर्षीय नियमित बी.एड." : "2-Year Regular B.Ed.",
      subtitle: isHindi
        ? "व्यावसायिक अध्यापक शिक्षा कार्यक्रम"
        : "Professional Teacher Education Degree",
      tag: isHindi ? "मान्यता प्राप्त कोर्स" : "Approved Degree",
      to: "/course",
    },
  ];

  return (
    <section className="bg-white border-b border-gray-200/90 font-sans">
      {/* 1. OUR ASSOCIATIONS SECTION (Sharp Collegiate Design Synchronized with Upper Sections) */}
      <div className="py-12 sm:py-16">
        <div className="mx-auto max-w-[1440px] px-4 xl:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Heading & Description */}
            <div className="lg:col-span-3 pr-2">
              <div className="flex items-center gap-2.5 mb-2.5 sm:mb-3">
                <span className="h-1 w-8 bg-[#FBDD23] rounded-none" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#2E3A8C]">
                  {isHindi ? "हमारी संबद्धताएं" : "OUR ASSOCIATIONS"}
                </span>
              </div>

              <h2 className="text-2xl sm:text-[28px] font-bold text-[#2E3A8C] leading-snug tracking-tight">
                {isHindi
                  ? "मजबूत शैक्षणिक आधार का निर्माण"
                  : "Building a Strong Academic Foundation"}
              </h2>

              <p className="mt-3 text-xs sm:text-[13.5px] text-slate-600 leading-relaxed font-normal">
                {isHindi
                  ? "हमारा संस्थान प्रतिष्ठित शैक्षणिक निकायों द्वारा मान्यता प्राप्त एवं समर्थित है, जो शिक्षक शिक्षा में गुणवत्ता, विश्वसनीयता और उत्कृष्टता सुनिश्चित करता है।"
                  : "Our institution is recognized and supported by esteemed educational bodies, ensuring quality, credibility and excellence in teacher education."}
              </p>

              <Link
                to="/about/recognition"
                className="mt-5 inline-flex items-center gap-2 rounded-none bg-[#2E3A8C] hover:bg-[#1E255E] text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider shadow-sm transition-all active:scale-[0.98]">
                <span>{isHindi ? "और अधिक जानें" : "Learn More"}</span>
                <ArrowRight size={13} className="text-[#FBDD23]" />
              </Link>
            </div>

            {/* Right Column: 4 Sharp Collegiate Association Cards */}
            <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {associations.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.title}
                    to={item.to}
                    className="group flex flex-col justify-between rounded-none border border-slate-200 border-t-4 border-t-[#2E3A8C] hover:border-t-[#FBDD23] bg-white p-5 shadow-xs hover:shadow-xl transition-all duration-300 text-center">
                    <div>
                      {/* Logo or Icon Container: Sharp Frame */}
                      <div className="flex h-18 w-full items-center justify-center mb-4 rounded-none bg-slate-50 border border-slate-100 p-2.5 group-hover:bg-amber-50/40 transition-colors">
                        {item.logoUrl ? (
                          <img
                            src={item.logoUrl}
                            alt={item.title}
                            className="max-h-12 max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-none bg-blue-50 text-[#2E3A8C] group-hover:bg-[#FBDD23] group-hover:text-slate-900 transition-colors">
                            <Icon size={24} />
                          </div>
                        )}
                      </div>

                      {/* Title & Subtitle */}
                      <h3 className="font-bold text-[15px] sm:text-[16px] text-[#2E3A8C] leading-snug tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-[11.5px] text-slate-500 mt-1.5 line-clamp-2 leading-relaxed font-normal">
                        {item.subtitle}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="inline-block rounded-none bg-slate-100 group-hover:bg-[#FBDD23] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-800 transition-colors">
                        {item.tag}
                      </span>
                      <span className="flex h-6 w-6 items-center justify-center rounded-none text-slate-400 group-hover:text-[#2E3A8C] group-hover:translate-x-1 transition-all">
                        <ArrowRight size={13} strokeWidth={2.5} />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 2. ACADEMIC EXCELLENCE NAVY RIBBON STRIP (Sharp Collegiate Styling) */}
      <div className="relative bg-[#2E3A8C] text-white py-4 sm:py-5 overflow-hidden border-t border-b border-[#FBDD23]/30">
        {/* Subtle decorative radial glow */}
        <div
          className="absolute right-0 top-0 bottom-0 w-36 pointer-events-none opacity-20"
          style={{
            background:
              "radial-gradient(circle at 100% 50%, #FBDD23 0%, transparent 70%)",
          }}
        />

        <div className="mx-auto max-w-[1440px] px-4 xl:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Left: Script Title */}
            <div className="shrink-0 flex items-center gap-3">
              <span className="text-xl sm:text-2xl font-bold text-white/95 tracking-wide">
                Academic Excellence
              </span>
              <span className="hidden sm:inline-block h-6 w-px bg-white/20" />
            </div>

            {/* Center: 4 Value Pillars */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 xl:gap-8 text-xs sm:text-[13px] font-semibold text-white/90">
              <div className="flex items-center gap-2">
                <GraduationCap size={16} className="text-[#FBDD23]" />
                <span>{isHindi ? "गुणवत्तापूर्ण शिक्षा" : "Quality Education"}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#FBDD23]" />
                <span>{isHindi ? "विश्वसनीय मान्यता" : "Trusted Recognition"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} className="text-[#FBDD23]" />
                <span>{isHindi ? "समग्र विकास" : "Holistic Development"}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-[#FBDD23]" />
                <span>{isHindi ? "उज्जवल भविष्य" : "Better Tomorrow"}</span>
              </div>
            </div>

            {/* Right: Join HSCE + Arrow (Sharp Rectangular Badge) */}
            <Link
              to="/admissions"
              className="shrink-0 flex items-center gap-2.5 text-[#FBDD23] hover:text-white transition-colors group">
              <span className="text-lg sm:text-xl font-bold">
                Join HSCE
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-none border border-[#FBDD23] text-[#FBDD23] group-hover:bg-[#FBDD23] group-hover:text-[#2E3A8C] transition-all">
                <ArrowRight size={13} strokeWidth={2.5} />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AffiliationTrustBarWidget;

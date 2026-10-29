import React from "react";
import { ExternalLink, CheckCircle2, ShieldCheck } from "lucide-react";
import { Container } from "../common/Container";
import { useLanguage } from "../../context/LanguageContext";
import { imageData } from "../../data/imagesData";

/* Subtle decorative dot pattern matching second reference image */
function DotPattern({ className = "" }) {
  return (
    <svg
      width="72"
      height="54"
      viewBox="0 0 72 54"
      fill="none"
      className={className}
      aria-hidden="true">
      <defs>
        <pattern
          id="univ-dot-grid"
          x="0"
          y="0"
          width="12"
          height="12"
          patternUnits="userSpaceOnUse">
          <circle cx="2.5" cy="2.5" r="1.5" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="72" height="54" fill="url(#univ-dot-grid)" />
    </svg>
  );
}

export function UniversityAffiliationSection() {
  const { isHindi } = useLanguage();

  const universityData = {
    campusImage:
      "https://res.cloudinary.com/dljt6vgkk/image/upload/v1792904388/e1e2e5a9-77dd-4b2e-9142-acaeaff75b79.png",
    logoUrl: imageData.ggsipuLogo || "/assets/affiliations/ggsipu-logo.png",
    portalUrl: "https://www.ipu.ac.in",

    en: {
      eyebrow: "UNIVERSITY AFFILIATION",
      titleLead: "Guru Gobind Singh",
      titleAccent: "Indraprastha University (GGSIPU)",
      badge: "Govt. of NCT of Delhi • UGC 12B Recognized",
      affiliationBadge: "HSCE Affiliation Code: 147 • Approved B.Ed. Intake: 100 Seats",

      para1:
        "Guru Gobind Singh Indraprastha University (GGSIPU) is the premier affiliating state university established in 1998 by the Govt. of NCT of Delhi under the Guru Gobind Singh Indraprastha University Act. The university is duly recognized by the University Grants Commission (UGC) under section 12B. GGSIPU oversees admissions, academic curricula, syllabus standards, and examinations for HSCE.",

      campusLabel: "University Main Campus",
      campusLocation: "Sector 16-C, Dwarka, New Delhi",
      portalBtn: "Visit Official GGSIPU Website",
      principlesHeading: "Guiding Principles of GGSIPU",
      principlesSub:
        "Academic excellence, societal welfare, and progressive pedagogy guiding our teacher education framework.",

      pillars: [
        {
          num: "01",
          title: "University Vision",
          pillLabel: "Vision",
          badgeLabel: "Vision Directive",
          tag: "Statutory Vision • GGSIPU Act 1998",
          content:
            "To stimulate both the hearts and minds of scholars, empower them to contribute to the welfare of society at large, and train them to adapt to the changing needs of the economy.",
        },
        {
          num: "02",
          title: "Academic Mission",
          pillLabel: "Mission",
          badgeLabel: "Mission Core",
          tag: "Professional Education • Centres of Excellence",
          content:
            "To provide market-oriented professional education, promote schools and colleges as learning Centres of Excellence, and nurture progressive educators.",
        },
        {
          num: "03",
          title: "Quality Policy Framework",
          pillLabel: "Quality",
          badgeLabel: "Quality Policy",
          tag: "Quality Management System • UGC 12B Recognized",
          content:
            "Committed to providing professional education with thrust on creativity, innovation, and motivating environment through an effective quality management system.",
        },
      ],
    },

    hi: {
      eyebrow: "विश्वविद्यालय संबद्धता",
      titleLead: "गुरु गोबिंद सिंह",
      titleAccent: "इंद्रप्रस्थ विश्वविद्यालय (GGSIPU)",
      badge: "दिल्ली सरकार • यूजीसी 12B मान्यता प्राप्त",
      affiliationBadge: "HSCE संबद्धता कोड: 147 • बी.एड. स्वीकृत वार्षिक सीटें: 100",

      para1:
        "गुरु गोबिंद सिंह इंद्रप्रस्थ विश्वविद्यालय (GGSIPU) दिल्ली राष्ट्रीय राजधानी क्षेत्र सरकार द्वारा 1998 में स्थापित प्रथम राज्य विश्वविद्यालय है। यह विश्वविद्यालय यूजीसी अधिनियम की धारा 12B के अंतर्गत विश्वविद्यालय अनुदान आयोग (UGC) द्वारा विधिवत मान्यता प्राप्त है। विश्वविद्यालय HSCE में प्रवेश, पाठ्यक्रम और परीक्षाओं का नियमन करता है।",

      campusLabel: "विश्वविद्यालय मुख्य परिसर",
      campusLocation: "सेक्टर 16-C, द्वारका, नई दिल्ली",
      portalBtn: "आधिकारिक GGSIPU वेबसाइट देखें",
      principlesHeading: "GGSIPU के मार्गदर्शक सिद्धांत",
      principlesSub:
        "शैक्षणिक उत्कृष्टता, सामाजिक कल्याण और नवाचारी शिक्षण विधियां जो हमारे बी.एड. पाठ्यक्रम को दिशा प्रदान करती हैं।",

      pillars: [
        {
          num: "01",
          title: "दृष्टिकोण (Vision)",
          pillLabel: "विज़न",
          badgeLabel: "विज़न निर्देश",
          tag: "सांविधिक विज़न • जीजीएसआईपीयू अधिनियम 1998",
          content:
            "विद्वानों के हृदय और मस्तिष्क दोनों को प्रेरित करना, समाज कल्याण हेतु सशक्त बनाना तथा बदलती अर्थव्यवस्था के अनुरूप तैयार करना।",
        },
        {
          num: "02",
          title: "ध्येय (Mission)",
          pillLabel: "मिशन",
          badgeLabel: "मिशन कोर",
          tag: "व्यावसायिक शिक्षण • उत्कृष्टता केंद्र",
          content:
            "बाजारोन्मुखी व्यावसायिक शिक्षा प्रदान करना, महाविद्यालयों को शिक्षण उत्कृष्टता केंद्रों के रूप में स्थापित करना और समर्पित शिक्षक तैयार करना।",
        },
        {
          num: "03",
          title: "गुणवत्ता नीति (Quality Policy)",
          pillLabel: "गुणवत्ता",
          badgeLabel: "गुणवत्ता नीति",
          tag: "गुणवत्ता प्रबंधन प्रणाली • यूजीसी 12B",
          content:
            "रचनात्मकता, नवाचार और प्रभावी गुणवत्ता प्रबंधन प्रणाली के माध्यम से प्रेरणादायक वातावरण में उच्चस्तरीय व्यावसायिक शिक्षा प्रदान करना।",
        },
      ],
    },
  };

  const content = isHindi ? universityData.hi : universityData.en;

  return (
    <section className="relative overflow-hidden border-b border-gray-200/90 bg-[#F8FAFC] py-14 font-sans sm:py-16 lg:py-20">
      {/* Subtle corner dot matrix patterns */}
      <DotPattern className="absolute top-6 left-6 text-slate-300/80 pointer-events-none hidden sm:block" />
      <DotPattern className="absolute bottom-6 right-6 text-slate-300/80 pointer-events-none hidden sm:block" />

      <Container>
        {/* ============================================================== */}
        {/* SECTION HEADER (Matching HomeFeaturedOverview style)           */}
        {/* ============================================================== */}
        <div className="relative z-10 mb-8 sm:mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-2.5 flex items-center gap-2">
              <span className="h-0.5 w-6 bg-[#FBDD23]" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#2E3A8C]">
                {content.eyebrow}
              </span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-[#2E3A8C] sm:text-3xl lg:text-[34px] leading-tight">
              {content.titleLead}{" "}
              <span className="text-[#2E3A8C]">{content.titleAccent}</span>
            </h2>

            <p className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              {content.affiliationBadge}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 shadow-2xs">
              <ShieldCheck size={14} className="text-[#2E3A8C]" />
              <span>{content.badge}</span>
            </span>

            <a
              href={universityData.portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-sm bg-[#2E3A8C] hover:bg-[#202965] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition-all active:scale-[0.98]">
              <span>{content.portalBtn}</span>
              <ExternalLink size={13} className="text-[#FBDD23]" />
            </a>
          </div>
        </div>

        {/* ============================================================== */}
        {/* MAIN COMPOSITE GRID (Clean, Elegant, Zero Clutter)              */}
        {/* ============================================================== */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* ============================================================ */}
          {/* LEFT: University Campus & Verified Institutional Profile     */}
          {/* ============================================================ */}
          <div className="lg:col-span-5 flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_4px_25px_-4px_rgba(0,0,0,0.06)]">
            <div>
              {/* Campus Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={universityData.campusImage}
                  alt="Guru Gobind Singh Indraprastha University campus"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />

                {/* Subtle verified pill on image */}
                <div className="absolute top-3 left-3 rounded-md bg-[#2E3A8C]/95 backdrop-blur-xs px-3 py-1 text-[11px] font-bold text-white shadow-sm border border-white/10">
                  Estd. 1998 • UGC 12B
                </div>

                <div className="absolute bottom-3 inset-x-3 rounded-lg bg-white/95 backdrop-blur-xs px-3.5 py-2 shadow-md flex items-center justify-between border border-slate-100">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#2E3A8C] truncate">
                      {content.campusLabel}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">
                      {content.campusLocation}
                    </p>
                  </div>
                  <span className="shrink-0 rounded bg-[#FBDD23] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-900">
                    Code 147
                  </span>
                </div>
              </div>

              {/* Campus Story */}
              <div className="p-5 sm:p-6">
                <p className="text-xs sm:text-[13px] leading-relaxed text-slate-600 font-normal">
                  {content.para1}
                </p>
              </div>
            </div>

            {/* Bottom Verification Strip */}
            <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-[#2E3A8C]">
                {isHindi ? "संबद्धता स्थिति" : "Affiliation Status"}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 size={13} className="text-emerald-600" />
                <span>{isHindi ? "सक्रिय एवं मान्यता प्राप्त" : "Active & Approved"}</span>
              </span>
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT: 3 Royal Blue Cards matching user second reference img */}
          {/* (Solid Royal Blue, Left Graphic Plaque, White Title, Yellow Tag & Yellow Badge) */}
          {/* ============================================================ */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-4">
            {/* Header Box */}
            <div className="rounded-xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="h-0.5 w-5 bg-[#FBDD23]" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#1A4298]">
                    {isHindi ? "सांविधिक मार्गदर्शक सिद्धांत" : "Statutory Framework"}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {content.principlesHeading}
                </h3>
                <p className="mt-1 text-xs sm:text-[13px] text-slate-500 leading-relaxed max-w-xl">
                  {content.principlesSub}
                </p>
              </div>
              <span className="shrink-0 self-start sm:self-center inline-flex items-center rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-bold text-[#1A4298]">
                3 Core Pillars
              </span>
            </div>

            {/* 3 Royal Blue Cards (Image 2 style: horizontal, left graphic plaque, bold white title, yellow tag, yellow badge, no redirect links) */}
            <div className="flex-1 flex flex-col gap-3.5 sm:gap-4">
              {content.pillars.map((pillar) => (
                <div
                  key={pillar.num}
                  className="group relative overflow-hidden rounded-xl bg-[#16429A] hover:bg-[#133A8A] text-white p-4 sm:p-5 shadow-md transition-all duration-300 border border-white/10 flex flex-col sm:flex-row items-stretch gap-4 sm:gap-5">
                  
                  {/* Left Side: Graphic Plaque (Replaces photo with collegiate design - zero photos, clean geometry) */}
                  <div className="shrink-0 sm:w-28 md:w-32 self-stretch rounded-lg bg-[#0E2864]/90 border border-white/15 flex flex-col items-center justify-center p-3 text-center shadow-inner min-h-[85px] sm:min-h-0">
                    <span className="text-2xl sm:text-3xl font-black text-[#FBDD23] tracking-tight leading-none">
                      {pillar.num}
                    </span>
                    <span className="mt-1 text-[10px] font-extrabold uppercase tracking-widest text-blue-200">
                      {pillar.pillLabel}
                    </span>
                    <div className="mt-2 h-0.5 w-6 bg-[#FBDD23]/60 rounded-full" />
                    <span className="mt-1.5 text-[9px] font-bold uppercase tracking-wider text-blue-300/80">
                      GGSIPU
                    </span>
                  </div>

                  {/* Right Side: Title, Tag, Body, and Yellow Badge matching Image 2 */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      {/* Title matching Image 2's bold white title */}
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-base sm:text-lg font-bold text-white leading-snug tracking-tight">
                          {pillar.title}
                        </h4>
                        <span className="shrink-0 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-blue-200 border border-white/10">
                          Code 147
                        </span>
                      </div>

                      {/* Yellow Tag line (Matching yellow date/accent text in Image 2) */}
                      <p className="mt-1 text-xs sm:text-[13px] font-bold text-[#FBDD23] tracking-wide">
                        {pillar.tag}
                      </p>

                      {/* Genuine Principle Content */}
                      <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-blue-50 font-normal">
                        {pillar.content}
                      </p>
                    </div>

                    {/* Bottom strip with Yellow Action Badge (matching the 'View Album' yellow button from Image 2, static/no redirect) */}
                    <div className="mt-3 pt-2.5 flex items-center justify-between border-t border-white/15 text-[11px]">
                      <span className="text-[11px] font-medium text-blue-200 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#FBDD23]" />
                        {isHindi ? "संस्थागत मार्गदर्शक सिद्धांत" : "Statutory Directive"}
                      </span>
                      <span className="inline-flex items-center rounded-sm bg-[#FBDD23] px-2.5 py-1 text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-900 shadow-2xs">
                        {pillar.badgeLabel}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default UniversityAffiliationSection;

import React from "react";
import { Link } from "react-router-dom";
import { Container } from "../common/Container";
import { useLanguage } from "../../context/LanguageContext";
import { collegeInfo as defaultCollegeInfo } from "../../data/siteData";
import {
  cloudinaryImageUrl,
  imageData,
  imageFallbacks,
} from "../../data/imagesData";
import { usePublishedRecords } from "../../hooks/usePublishedRecords";

/* =========================================================================
   THICK WHITE QUOTATION MARKS (Matching user reference image pixel-for-pixel)
   ========================================================================= */
function DoubleQuoteMark({ className = "", width = 46, height = 34 }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 38 28"
      fill="currentColor"
      className={className}
      aria-hidden="true">
      <path d="M3.2 0h11.2v16H8.8L3.2 28H0l4.8-12H0V0h3.2zm18.4 0h11.2v16H27.2L21.6 28h-3.2l4.8-12h-4.8V0h3.2z" />
    </svg>
  );
}

const leadershipData = {
  en: {
    eyebrow: "INSTITUTIONAL LEADERSHIP",
    title: "Words of Wisdom & Vision",
    readMore: "Read more →",

    // Chairman
    chairmanName: "Sh. Raj Singh Dabas",
    chairmanRole: "Chairman",
    chairmanQuote:
      "Education is the manifestation of the perfection already in man. At Haryana Shakti College of Education, our mission is to empower dedicated educators with moral integrity, intellectual rigor, and pedagogical brilliance to transform lives and nation.",

    // Principal
    principalName: "Dr. Savita Rathee",
    principalRole: "Principal",
    principalQuote:
      "Teaching is the supreme art of the teacher to awaken joy in creative expression and knowledge. At HSCE, we do not merely train students for examinations; we prepare transformative educators who will shape the destiny of future generations.",
  },

  hi: {
    eyebrow: "संस्थागत नेतृत्व एवं मार्गदर्शन",
    title: "प्रेरक विचार एवं मार्गदर्शक विज़न",
    readMore: "पूरा संदेश पढ़ें →",

    // Chairman
    chairmanName: "श्री राज सिंह डबास",
    chairmanRole: "चेयरमैन",
    chairmanQuote:
      "शिक्षा मनुष्य में पहले से विद्यमान पूर्णता की अभिव्यक्ति है। हरियाणा शक्ति कॉलेज ऑफ एजुकेशन में हमारा ध्येय ऐसे समर्पित शिक्षकों को तैयार करना है जो नैतिक मूल्यों, बौद्धिक अनुशासन और आधुनिक शिक्षण पद्धतियों से समाज और राष्ट्र का कायाकल्प कर सकें।",

    // Principal
    principalName: "डॉ. सविता राठी",
    principalRole: "प्राचार्या",
    principalQuote:
      "शिक्षण रचनात्मक अभिव्यक्ति और ज्ञान में आनंद जागृत करने की सर्वोच्च कला है। HSCE में हम केवल परीक्षा की तैयारी नहीं करते, बल्कि भविष्य के शिक्षकों को परिवर्तनकारी शिक्षा और नैतिक मूल्यों के माध्यम से तैयार करते हैं।",
  },
};

export function PrincipalMessageSection() {
  const { isHindi } = useLanguage();
  const content = isHindi ? leadershipData.hi : leadershipData.en;

  const siteSettings = usePublishedRecords("siteContent", [defaultCollegeInfo]);
  const collegeInfo =
    siteSettings.find((record) => record.id === "settings") ||
    siteSettings[0] ||
    defaultCollegeInfo;

  // Chairman Details
  const chairmanName = isHindi
    ? content.chairmanName
    : collegeInfo.chairman && collegeInfo.chairman !== "Chairman"
      ? collegeInfo.chairman
      : content.chairmanName;
  const chairmanRole = content.chairmanRole;
  const chairmanQuote =
    typeof collegeInfo.chairmanMessage === "string" &&
    collegeInfo.chairmanMessage.trim().length > 0
      ? collegeInfo.chairmanMessage.trim()
      : content.chairmanQuote;
  const chairmanImage = collegeInfo.chairmanImage || imageData.chairmanPortrait;

  // Principal Details
  const principalName = isHindi
    ? content.principalName
    : collegeInfo.principal || content.principalName;
  const principalRole = content.principalRole;
  const principalQuote =
    typeof collegeInfo.principalMessage === "string" &&
    collegeInfo.principalMessage.trim().length > 0
      ? collegeInfo.principalMessage.trim()
      : content.principalQuote;
  const principalImage =
    collegeInfo.principalImage || imageData.principalPortrait;

  return (
    <section className="bg-[#EDF2F8] py-14 sm:py-18 lg:py-24 font-sans border-b border-gray-200/90">
      <Container>
        {/* ============================================================== */}
        {/* SECTION HEADER                                                 */}
        {/* ============================================================== */}
        <div className="mb-8 sm:mb-10 max-w-2xl">
          <div className="mb-2.5 flex items-center gap-2">
            <span className="h-1 w-7 bg-[#FBDD23] rounded-full" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#2E3A8C]">
              {content.eyebrow}
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#2E3A8C] sm:text-3xl lg:text-[34px] leading-tight">
            {content.title}
          </h2>
        </div>

        {/* ============================================================== */}
        {/* TWO MESSAGE BOXES: TASTEFUL SMALL ROUNDED & FULLY RESPONSIVE   */}
        {/* Box 1: Vibrant Golden Yellow (#FBDD23) with Navy Accents      */}
        {/* Box 2: Royal Navy Blue (#2E3A8C) with Yellow Accents           */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-8 xl:gap-10 items-stretch">
          {/* ============================================================ */}
          {/* BOX 1: CHAIRMAN'S MESSAGE (GOLDEN YELLOW #FBDD23)            */}
          {/* ============================================================ */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#FBDD23] p-6 sm:p-8 lg:p-8 xl:p-10 text-[#2E3A8C] shadow-lg transition-all duration-300 hover:shadow-xl border border-amber-300/60 min-h-[380px] sm:min-h-[420px] lg:min-h-[440px]">
            {/* Top-Left Signature White Quotation Mark */}
            <div className="mb-4 sm:mb-5">
              <DoubleQuoteMark className="text-white drop-shadow-sm opacity-95" width={42} height={32} />
            </div>

            {/* Inner Content: Responsive Quote on Left, Portrait on Right */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 lg:gap-6 xl:gap-7 flex-1">
              {/* Left Quote & Read More Button */}
              <div className="min-w-0 flex-1 flex flex-col justify-between h-full text-center sm:text-left">
                <blockquote className="italic text-sm sm:text-base lg:text-[16px] xl:text-[17px] leading-relaxed text-[#1B2358] font-medium">
                  &ldquo;{chairmanQuote}&rdquo;
                </blockquote>

                <div className="mt-5 sm:mt-6 pt-2">
                  <Link
                    to="/about/chairman"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#2E3A8C] hover:bg-[#1E255E] text-white px-5 py-2.5 text-xs sm:text-[13px] font-bold uppercase tracking-wider shadow-sm transition-all active:scale-[0.98]">
                    <span>{content.readMore}</span>
                  </Link>
                </div>
              </div>

              {/* Right Leader Portrait Card: Balanced & Responsive */}
              <div className="shrink-0 w-32 sm:w-36 md:w-40 lg:w-36 xl:w-44 flex flex-col items-center">
                <div className="aspect-square w-full rounded-xl bg-white p-2 shadow-md overflow-hidden border border-black/5">
                  <img
                    src={cloudinaryImageUrl(chairmanImage, 600)}
                    alt={chairmanName}
                    width="450"
                    height="450"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover object-top rounded-lg"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = imageFallbacks.chairmanPortrait;
                    }}
                  />
                </div>

                <h3 className="text-sm sm:text-base lg:text-[16px] xl:text-lg font-bold text-[#2E3A8C] text-center mt-3 leading-snug tracking-tight">
                  {chairmanName}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-[#2E3A8C] text-center font-extrabold tracking-wider uppercase mt-1 px-2.5 py-0.5 rounded-full bg-white/40 border border-[#2E3A8C]/15 inline-block">
                  {chairmanRole}
                </p>
              </div>
            </div>

            {/* Bottom-Right Signature White Quotation Mark */}
            <div className="absolute -bottom-1 -right-1 pointer-events-none select-none">
              <DoubleQuoteMark className="rotate-180 text-white drop-shadow-sm opacity-80" width={42} height={32} />
            </div>
          </div>

          {/* ============================================================ */}
          {/* BOX 2: PRINCIPAL'S MESSAGE (ROYAL NAVY BLUE #2E3A8C)         */}
          {/* ============================================================ */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#2E3A8C] p-6 sm:p-8 lg:p-8 xl:p-10 text-white shadow-lg transition-all duration-300 hover:shadow-xl border border-white/10 min-h-[380px] sm:min-h-[420px] lg:min-h-[440px]">
            {/* Top-Left Signature White Quotation Mark */}
            <div className="mb-4 sm:mb-5">
              <DoubleQuoteMark className="text-white opacity-95" width={42} height={32} />
            </div>

            {/* Inner Content: Responsive Quote on Left, Portrait on Right */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 lg:gap-6 xl:gap-7 flex-1">
              {/* Left Quote & Read More Button */}
              <div className="min-w-0 flex-1 flex flex-col justify-between h-full text-center sm:text-left">
                <blockquote className="italic text-sm sm:text-base lg:text-[16px] xl:text-[17px] leading-relaxed text-blue-50 font-normal">
                  &ldquo;{principalQuote}&rdquo;
                </blockquote>

                <div className="mt-5 sm:mt-6 pt-2">
                  <Link
                    to="/about/principal"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#FBDD23] hover:bg-[#FFDC13] text-slate-900 px-5 py-2.5 text-xs sm:text-[13px] font-bold uppercase tracking-wider shadow-sm transition-all active:scale-[0.98]">
                    <span>{content.readMore}</span>
                  </Link>
                </div>
              </div>

              {/* Right Leader Portrait Card: Balanced & Responsive */}
              <div className="shrink-0 w-32 sm:w-36 md:w-40 lg:w-36 xl:w-44 flex flex-col items-center">
                <div className="aspect-square w-full rounded-xl bg-white p-2 shadow-md overflow-hidden border border-white/10">
                  <img
                    src={cloudinaryImageUrl(principalImage, 600)}
                    alt={principalName}
                    width="450"
                    height="450"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover object-top rounded-lg"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src =
                        imageFallbacks.principalPortrait;
                    }}
                  />
                </div>

                <h3 className="text-sm sm:text-base lg:text-[16px] xl:text-lg font-bold text-white text-center mt-3 leading-snug tracking-tight">
                  {principalName}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-[#FBDD23] text-center font-bold tracking-wider uppercase mt-1 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 inline-block">
                  {principalRole}
                </p>
              </div>
            </div>

            {/* Bottom-Right Signature White Quotation Mark */}
            <div className="absolute -bottom-1 -right-1 pointer-events-none select-none">
              <DoubleQuoteMark className="rotate-180 text-white opacity-80" width={42} height={32} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export const LeadershipMessageSection = PrincipalMessageSection;
export default PrincipalMessageSection;

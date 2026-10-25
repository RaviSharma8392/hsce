import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Calendar,
  MapPin,
  GraduationCap,
  Award,
  Sparkles,
  Building2,
} from "lucide-react";

import { useLanguage } from "../../context/LanguageContext";
import { Container } from "../common/Container";
import { collegeInfo as defaultCollegeInfo } from "../../data/siteData";
import { imageData, imageFallbacks } from "../../data/imagesData";
import { usePublishedRecords } from "../../hooks/usePublishedRecords";

export const shortAboutContent = {
  en: {
    // Chairman's Desk
    eyebrowChairman: "FOUNDER & CHAIRMAN'S VISION",
    chairmanTitleLead: "From the Chairman's",
    chairmanTitleAccent: "Desk",
    chairmanHeader: "A MESSAGE FROM OUR CHAIRMAN",
    chairmanName: "Sh. Raj Singh Dabas",
    chairmanRole: "Chairman, Haryana Shakti Education Society",
    chairmanQuote:
      "Education is the manifestation of the perfection already in man. At Haryana Shakti College of Education, our mission is to empower dedicated educators with moral integrity, intellectual rigor, and modern pedagogical skills to shape a progressive India.",
    chairmanCTA: "Read Full Message",

    // Principal's Desk
    eyebrowPrincipal: "LEADERSHIP",
    principalTitleLead: "From the Principal's",
    principalTitleAccent: "Desk",
    principalHeader: "A MESSAGE FROM OUR PRINCIPAL",
    principalName: "Dr. Savita Rathee",
    principalRole: "Principal, HSCE",
    principalQuote:
      "Teaching is the supreme art of the teacher to awaken joy in creative expression and knowledge. At HSCE, we do not merely train students for examinations; we prepare transformative educators who will shape the destiny of future generations.",
    principalCTA: "Read Full Message",

    // About the Institution (placed below leadership messages)
    eyebrowAbout: "ABOUT THE INSTITUTION",
    aboutTitleLead: "About",
    aboutTitleAccent: "HSCE College",
    aboutText:
      "Haryana Shakti College of Education (HSCE), situated in Kanjhawala, Delhi – 110081, is a premier institution dedicated exclusively to professional teacher education. Established in the year 2012 under the visionary aegis of Haryana Shakti Education Society, the college has stood as a beacon of academic rigor, disciplined teaching, and value-based learning for aspiring educators.",
    readMore: "Explore About HSCE",
    facts: [
      { label: "Established", value: "2012" },
      { label: "Academic Focus", value: "Teacher Education (B.Ed.)" },
      { label: "Campus Location", value: "Kanjhawala, Delhi – 110081" },
    ],
  },

  hi: {
    // Chairman's Desk
    eyebrowChairman: "संस्थापक एवं चेयरमैन की दृष्टि",
    chairmanTitleLead: "चेयरमैन का",
    chairmanTitleAccent: "संदेश",
    chairmanHeader: "चेयरमैन का संदेश",
    chairmanName: "श्री राज सिंह डबास",
    chairmanRole: "चेयरमैन, हरियाणा शक्ति एजुकेशन सोसाइटी",
    chairmanQuote:
      "शिक्षा मनुष्य में पहले से विद्यमान पूर्णता की अभिव्यक्ति है। हरियाणा शक्ति कॉलेज ऑफ एजुकेशन में हमारा ध्येय ऐसे समर्पित शिक्षकों को तैयार करना है जो नैतिक मूल्यों, बौद्धिक अनुशासन और आधुनिक शिक्षण पद्धतियों से समाज और राष्ट्र का कायाकल्प कर सकें।",
    chairmanCTA: "पूरा संदेश पढ़ें",

    // Principal's Desk
    eyebrowPrincipal: "नेतृत्व",
    principalTitleLead: "प्राचार्या का",
    principalTitleAccent: "संदेश",
    principalHeader: "प्राचार्या का संदेश",
    principalName: "डॉ. सविता राठी",
    principalRole: "प्राचार्या, HSCE",
    principalQuote:
      "शिक्षण रचनात्मक अभिव्यक्ति और ज्ञान में आनंद जागृत करने की सर्वोच्च कला है। HSCE में हम केवल परीक्षा की तैयारी नहीं करते, बल्कि भविष्य के शिक्षकों को परिवर्तनकारी शिक्षा के माध्यम से तैयार करते हैं।",
    principalCTA: "पूरा संदेश पढ़ें",

    // About the Institution (placed below leadership messages)
    eyebrowAbout: "हमारा परिचय",
    aboutTitleLead: "कॉलेज का",
    aboutTitleAccent: "परिचय",
    aboutText:
      "हरियाणा शक्ति कॉलेज ऑफ एजुकेशन (HSCE), कंझावला, दिल्ली में स्थित व्यावसायिक शिक्षक शिक्षा का एक प्रमुख संस्थान है। हरियाणा शक्ति एजुकेशन सोसाइटी के मार्गदर्शन में वर्ष 2012 में स्थापित यह महाविद्यालय भावी शिक्षकों के लिए शैक्षणिक अनुशासन, नैतिक मूल्यों और शिक्षण गुणवत्ता को बढ़ावा देता है।",
    readMore: "कॉलेज परिचय देखें",
    facts: [
      { label: "स्थापना", value: "2012" },
      { label: "शैक्षणिक क्षेत्र", value: "शिक्षक शिक्षा (बी.एड.)" },
      { label: "स्थान", value: "कंझावला, दिल्ली – 110081" },
    ],
  },
};

function SectionHeading({ lead, accent, to, linkLabel }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3 sm:mb-7">
      <div className="min-w-0">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-[32px] leading-tight">
          {lead} <span className="font-bold text-[#0a4b8c]">{accent}</span>
        </h2>
        <div className="mt-2.5 h-0.5 w-10 rounded-full bg-[#FBDD23]" />
      </div>

      {to && linkLabel && (
        <Link
          to={to}
          className="group inline-flex shrink-0 items-center gap-1.5 pb-1 text-sm font-semibold text-[#0a4b8c] hover:underline">
          <span>{linkLabel}</span>

          <ArrowRight
            size={16}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      )}
    </div>
  );
}

export function PrincipalMessageSection() {
  const { isHindi } = useLanguage();
  const content = isHindi ? shortAboutContent.hi : shortAboutContent.en;

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
  const chairmanRole = isHindi
    ? content.chairmanRole
    : collegeInfo.chairmanDesignation || content.chairmanRole;
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
  const principalRole = isHindi
    ? content.principalRole
    : collegeInfo.principalDesignation || content.principalRole;
  const principalQuote =
    typeof collegeInfo.principalMessage === "string" &&
    collegeInfo.principalMessage.trim().length > 0
      ? collegeInfo.principalMessage.trim()
      : content.principalQuote;
  const principalImage =
    collegeInfo.principalImage || imageData.principalPortrait;

  // Fact icons mapping
  const factIcons = [Calendar, GraduationCap, MapPin];

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(247,201,72,0.13),transparent_24%),linear-gradient(180deg,#f8fafc_0%,#f3f6fb_100%)] py-12 font-sans sm:py-16 lg:py-20">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,75,140,0.02),transparent_18%,transparent_82%,rgba(200,16,46,0.02))]" />

      <Container>
        {/* Top Grid: Left Side Chairman's Desk, Right Side Principal's Desk */}
        <div className="relative grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2 lg:gap-8 xl:gap-10">
          {/* LEFT SIDE: Chairman's Desk */}
          <div className="flex min-w-0 flex-col">
            <SectionHeading
              eyebrow={content.eyebrowChairman}
              lead={content.chairmanTitleLead}
              accent={content.chairmanTitleAccent}
              to="/about/chairman"
              linkLabel={content.chairmanCTA}
            />

            <article className="flex flex-1 flex-col overflow-hidden rounded-[26px] border border-slate-200/90 bg-white shadow-[0_18px_38px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_42px_rgba(15,23,42,0.12)]">
              {/* Message Header */}
              <div className="flex min-h-12 items-center justify-between bg-gradient-to-r from-[#0a4b8c] to-[#083a6f] px-6 py-3.5">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-white">
                  {content.chairmanHeader}
                </p>
                <span className="h-2 w-2 rounded-full bg-[#FBDD23]" />
              </div>

              <div className="flex flex-1 flex-col sm:flex-row">
                {/* Chairman Image */}
                <div className="relative h-[290px] shrink-0 overflow-hidden bg-slate-100 sm:min-h-[360px] sm:h-auto sm:w-[40%] lg:w-[38%] border-b sm:border-b-0 sm:border-r border-slate-100">
                  <img
                    src={chairmanImage}
                    alt={chairmanName}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover object-top transition-transform duration-500 hover:scale-105"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = imageFallbacks.chairmanPortrait;
                    }}
                  />
                </div>

                {/* Chairman Message */}
                <div className="flex min-w-0 flex-1 flex-col p-6 sm:p-7">
                  <div className="mb-3">
                    <span
                      aria-hidden="true"
                      className="block font-serif text-[42px] leading-[0.7] text-[#0a4b8c]/25 select-none">
                      “
                    </span>
                  </div>

                  <blockquote className="flex-1 text-sm leading-relaxed text-slate-600 sm:text-[15px] sm:leading-7 font-normal">
                    {chairmanQuote}
                  </blockquote>

                  {/* Chairman Details */}
                  <footer className="mt-6 border-t border-slate-100 pt-4">
                    <div className="mb-2.5 h-[3px] w-8 rounded-full bg-[#FBDD23]" />

                    <h3 className="text-base font-bold text-gray-900">
                      {chairmanName}
                    </h3>

                    <p className="mt-0.5 text-xs font-semibold text-[#0a4b8c]">
                      {chairmanRole}
                    </p>

                    <Link
                      to="/about/chairman"
                      className="group mt-3.5 inline-flex items-center gap-1.5 text-xs font-bold text-[#0a4b8c] hover:underline uppercase tracking-wider">
                      <span>{content.chairmanCTA}</span>

                      <ArrowRight
                        size={14}
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </Link>
                  </footer>
                </div>
              </div>

              {/* Bottom Accent */}
              <div className="h-[3px] bg-[#FBDD23]" />
            </article>
          </div>

          {/* RIGHT SIDE: Principal's Desk */}
          <div className="flex min-w-0 flex-col">
            <SectionHeading
              eyebrow={content.eyebrowPrincipal}
              lead={content.principalTitleLead}
              accent={content.principalTitleAccent}
              to="/about/principal"
              linkLabel={content.principalCTA}
            />

            <article className="flex flex-1 flex-col overflow-hidden rounded-[26px] border border-slate-200/90 bg-white shadow-[0_18px_38px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_42px_rgba(15,23,42,0.12)]">
              {/* Message Header */}
              <div className="flex min-h-12 items-center justify-between bg-gradient-to-r from-[#0a4b8c] to-[#083a6f] px-6 py-3.5">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-white">
                  {content.principalHeader}
                </p>
                <span className="h-2 w-2 rounded-full bg-[#FBDD23]" />
              </div>

              <div className="flex flex-1 flex-col sm:flex-row">
                {/* Principal Image */}
                <div className="relative h-[290px] shrink-0 overflow-hidden bg-slate-100 sm:min-h-[360px] sm:h-auto sm:w-[40%] lg:w-[38%] border-b sm:border-b-0 sm:border-r border-slate-100">
                  <img
                    src={principalImage}
                    alt={principalName}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover object-top transition-transform duration-500 hover:scale-105"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src =
                        imageFallbacks.principalPortrait;
                    }}
                  />
                </div>

                {/* Principal Message */}
                <div className="flex min-w-0 flex-1 flex-col p-6 sm:p-7">
                  <div className="mb-3">
                    <span
                      aria-hidden="true"
                      className="block font-serif text-[42px] leading-[0.7] text-[#0a4b8c]/25 select-none">
                      “
                    </span>
                  </div>

                  <blockquote className="flex-1 text-sm leading-relaxed text-slate-600 sm:text-[15px] sm:leading-7 font-normal">
                    {principalQuote}
                  </blockquote>

                  {/* Principal Details */}
                  <footer className="mt-6 border-t border-slate-100 pt-4">
                    <div className="mb-2.5 h-[3px] w-8 rounded-full bg-[#FBDD23]" />

                    <h3 className="text-base font-bold text-gray-900">
                      {principalName}
                    </h3>

                    <p className="mt-0.5 text-xs font-semibold text-[#0a4b8c]">
                      {principalRole}
                    </p>

                    <Link
                      to="/about/principal"
                      className="group mt-3.5 inline-flex items-center gap-1.5 text-xs font-bold text-[#0a4b8c] hover:underline uppercase tracking-wider">
                      <span>{content.principalCTA}</span>

                      <ArrowRight
                        size={14}
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </Link>
                  </footer>
                </div>
              </div>

              {/* Bottom Accent */}
              <div className="h-[3px] bg-[#FBDD23]" />
            </article>
          </div>
        </div>

        {/* BELOW: About HSCE College (placed below leadership messages) */}
        <div className="mt-14 pt-10 sm:mt-16 sm:pt-12 border-t border-slate-200/80">
          <SectionHeading
            eyebrow={content.eyebrowAbout}
            lead={content.aboutTitleLead}
            accent={content.aboutTitleAccent}
            to="/about"
            linkLabel={content.readMore}
          />

          <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs transition-all duration-300 hover:shadow-md">
            {/* Top Brand Accent Strip */}
            <div className="h-1.5 bg-gradient-to-r from-[#0a4b8c] via-[#094179] to-[#FBDD23]" />

            <div className="p-6 sm:p-8 lg:p-10">
              <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
                {/* College Intro Paragraph */}
                <div className="lg:col-span-7">
                  <p className="text-sm leading-relaxed text-slate-700 sm:text-base sm:leading-8 font-normal">
                    {content.aboutText}
                  </p>

                  <div className="mt-7 flex flex-wrap items-center gap-4">
                    <Link
                      to="/about"
                      className="group inline-flex items-center gap-2 rounded-lg bg-[#0a4b8c] px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#073665]">
                      <span>
                        {isHindi
                          ? "कॉलेज के बारे में और जानें"
                          : "Discover More About HSCE"}
                      </span>
                      <ArrowRight
                        size={16}
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </Link>

                    <Link
                      to="/course/bed"
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-[#0a4b8c]">
                      <GraduationCap size={16} className="text-[#0a4b8c]" />
                      <span>
                        {isHindi ? "बी.एड. पाठ्यक्रम" : "B.Ed. Curriculum"}
                      </span>
                    </Link>

                    <Link
                      to="/admissions"
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-[#0a4b8c]">
                      <Award size={16} className="text-[#0a4b8c]" />
                      <span>
                        {isHindi ? "प्रवेश विवरण" : "Admissions Guide"}
                      </span>
                    </Link>
                  </div>
                </div>

                {/* Institutional Facts Cards */}
                <div className="lg:col-span-5">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
                    {content.facts.map((fact, index) => {
                      const Icon =
                        factIcons[index % factIcons.length] || Sparkles;

                      return (
                        <div
                          key={fact.label}
                          className="group flex items-center gap-4 rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 transition-all duration-200 hover:bg-white hover:border-[#0a4b8c]/30 hover:shadow-xs">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-[#0a4b8c] shadow-xs border border-slate-100 group-hover:bg-[#0a4b8c] group-hover:text-[#FBDD23] transition-colors">
                            <Icon size={20} strokeWidth={2} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                              {fact.label}
                            </p>

                            <p className="mt-0.5 text-sm sm:text-base font-bold text-gray-900 transition-colors group-hover:text-[#0a4b8c]">
                              {fact.value}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Accent */}
            <div className="h-[2px] bg-[#FBDD23]" />
          </div>
        </div>
      </Container>
    </section>
  );
}

// Export both names for convenience
export const LeadershipMessageSection = PrincipalMessageSection;
export default PrincipalMessageSection;

import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, Mail, Phone, Award } from "lucide-react";

import { Container } from "../components/common/Container";
import {
  AboutSubNav,
  AboutBottomCTA,
  AboutPageNavigator,
} from "../components/about/AboutSubNav";
import { aboutChairmanContent } from "../data/aboutBilingualData";
import { collegeInfo as defaultCollegeInfo } from "../data/siteData";
import { imageData, imageFallbacks } from "../data/imagesData";
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

  return (
    <>
      <Helmet>
        <title>
          {isHindi
            ? "चेयरमैन का संदेश | हरियाणा शक्ति कॉलेज ऑफ एजुकेशन"
            : "Chairman's Desk | Haryana Shakti College of Education"}
        </title>

        <meta
          name="description"
          content={
            isHindi
              ? "हरियाणा शक्ति एजुकेशन सोसाइटी एवं कॉलेज के चेयरमैन का प्रेरणादायी संदेश एवं दृष्टि।"
              : "Read the official vision and inspiring message from the Chairman of Haryana Shakti Education Society and College of Education."
          }
        />
      </Helmet>

      <AboutSubNav
        activeTabId="chairman"
        title={content.title}
        subtitle={content.subtitle}
      />

      <main className="bg-white text-gray-800">
        {/* Page title header */}
        <section className="border-b border-gray-200 bg-[#f7f7f8]">
          <Container>
            <div className="py-8 sm:py-10 lg:py-12">
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#363991]">
                <span className="h-[2px] w-7 bg-[#fed100]" />
                {content.eyebrow}
              </div>

              <h1 className="max-w-4xl text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
                {content.mainHeading}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
                {content.subtitle}
              </p>
            </div>
          </Container>
        </section>

        {/* Main content */}
        <section className="py-8 sm:py-12 lg:py-14">
          <Container>
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-14">
              {/* Chairman profile card */}
              <aside className="min-w-0 lg:col-span-4">
                <div className="overflow-hidden border border-gray-200 bg-white shadow-sm">
                  {/* Photograph */}
                  <div className="overflow-hidden bg-gray-100">
                    <img
                      src={chairmanImage}
                      width="600"
                      height="600"
                      alt={chairmanName}
                      className="block h-auto max-h-[680px] w-full object-cover object-top"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = imageFallbacks.chairmanPortrait;
                      }}
                    />
                  </div>

                  {/* Name and designation */}
                  <div className="border-t-[3px] border-[#363991] px-5 py-6 sm:px-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#363991]">
                      {chairmanDesignation}
                    </p>

                    <h2 className="mt-2 text-xl font-bold leading-snug text-gray-900 sm:text-2xl">
                      {chairmanName}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {content.institution}
                    </p>

                    <div className="mt-5 flex items-start gap-3 border-t border-gray-200 pt-5">
                      <Award
                        size={19}
                        className="mt-0.5 shrink-0 text-[#363991]"
                      />

                      <p className="text-sm leading-6 text-gray-700">
                        {content.degrees}
                      </p>
                    </div>
                  </div>

                  {/* Contact details */}
                  {(collegeInfo.email || collegeInfo.phone) && (
                    <div className="border-t border-gray-200 bg-gray-50 px-5 py-5 sm:px-6">
                      <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                        {isHindi ? "संस्थागत संपर्क" : "Institutional Contact"}
                      </h3>

                      <div className="space-y-4">
                        {collegeInfo.email && (
                          <a
                            href={`mailto:${collegeInfo.email}`}
                            className="flex min-w-0 items-start gap-3 text-sm text-gray-700 transition-colors hover:text-[#363991]">
                            <Mail
                              size={17}
                              className="mt-0.5 shrink-0 text-[#363991]"
                            />
                            <span className="break-all">
                              {collegeInfo.email}
                            </span>
                          </a>
                        )}

                        {collegeInfo.phone && (
                          <a
                            href={`tel:${collegeInfo.phone}`}
                            className="flex min-w-0 items-start gap-3 text-sm text-gray-700 transition-colors hover:text-[#363991]">
                            <Phone
                              size={17}
                              className="mt-0.5 shrink-0 text-[#363991]"
                            />
                            <span className="break-words">
                              {collegeInfo.phone}
                            </span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </aside>

              {/* Chairman's message */}
              <article className="min-w-0 lg:col-span-8">
                {/* Section heading */}
                <header className="border-b border-gray-200 pb-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.13em] text-[#363991]">
                    {isHindi
                      ? "चेयरमैन की ओर से"
                      : "A Message from the Chairman"}
                  </p>

                  <h2 className="text-2xl font-bold leading-snug tracking-tight text-gray-900 sm:text-3xl">
                    {content.mainHeading}
                  </h2>

                  <div className="mt-4 h-[3px] w-12 bg-[#fed100]" />
                </header>

                {/* Opening message highlight */}
                <div className="mt-6 border-l-[3px] border-[#363991] bg-[#f7f7f9] px-5 py-5 sm:px-7 sm:py-6">
                  <p className="text-base font-medium leading-8 text-gray-800 sm:text-lg sm:leading-9">
                    &ldquo;{chairmanMessage}&rdquo;
                  </p>
                </div>

                {/* Message paragraphs */}
                <div className="mt-7 space-y-5 text-[15px] leading-8 text-gray-700 sm:text-base sm:leading-8">
                  {content.paragraphs.map((paragraph, index) => (
                    <p
                      key={index}
                      className="break-words text-justify [overflow-wrap:anywhere]">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Signature and navigation link */}
                <footer className="mt-9 border-t border-gray-200 pt-6">
                  <p className="text-sm leading-6 text-gray-600">
                    {content.closing}
                  </p>

                  <p className="mt-2 text-lg font-bold text-gray-900">
                    {chairmanName}
                  </p>

                  <p className="mt-1 text-sm text-[#363991]">
                    {chairmanDesignation}
                  </p>

                  <div className="mt-7 flex flex-wrap items-center gap-4">
                    <Link
                      to="/about/principal"
                      className="inline-flex max-w-full items-center justify-center gap-2 bg-[#363991] px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#292b70] focus:outline-none focus:ring-2 focus:ring-[#363991] focus:ring-offset-2">
                      <span>
                        {isHindi
                          ? "प्राचार्या का संदेश पढ़ें"
                          : "Read Principal's Message"}
                      </span>
                      <ArrowRight size={16} className="shrink-0" />
                    </Link>

                    <Link
                      to="/course/bed"
                      className="inline-flex max-w-full items-center justify-center gap-2 border border-[#363991] px-5 py-3.5 text-sm font-semibold text-[#363991] transition-colors hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-[#363991] focus:ring-offset-2">
                      <span>{content.viewCurriculumBtn}</span>
                    </Link>
                  </div>
                </footer>
              </article>
            </div>
          </Container>
        </section>

        {/* Institutional branding strip */}
        <section className="border-y border-gray-200 bg-[#f7f7f8]">
          <Container>
            <div className="flex flex-col gap-2 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
              <div>
                <p className="text-sm font-bold text-gray-900">
                  {content.institution}
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  {isHindi
                    ? "शिक्षा, ज्ञान, संस्कार और राष्ट्र सेवा के लिए समर्पित"
                    : "Committed to education, values, character building and nation-building"}
                </p>
              </div>

              <Link
                to="/course/bed"
                className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#363991] hover:underline">
                {content.viewCurriculumBtn}
                <ArrowRight size={15} />
              </Link>
            </div>
          </Container>
        </section>
      </main>

      <AboutPageNavigator prevTabId="vision-mission" nextTabId="principal" />

      <AboutBottomCTA />
    </>
  );
}

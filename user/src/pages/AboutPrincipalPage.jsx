import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, Mail, Phone, GraduationCap } from "lucide-react";

import { Container } from "../components/common/Container";
import {
  AboutSubNav,
  AboutBottomCTA,
  AboutPageNavigator,
} from "../components/about/AboutSubNav";
import { aboutPrincipalContent } from "../data/aboutBilingualData";
import { collegeInfo as defaultCollegeInfo } from "../data/siteData";
import { imageData } from "../data/imagesData";
import { usePublishedRecords } from "../hooks/usePublishedRecords";
import { useLanguage } from "../context/LanguageContext";

export default function AboutPrincipalPage() {
  const { language, isHindi } = useLanguage();

  const content = aboutPrincipalContent[language] || aboutPrincipalContent.en;

  const siteSettings = usePublishedRecords("siteContent", [defaultCollegeInfo]);

  const collegeInfo =
    siteSettings.find((record) => record.id === "settings") ||
    siteSettings[0] ||
    defaultCollegeInfo;
  const principalName = collegeInfo.principal || content.name;
  const principalDesignation =
    collegeInfo.principalDesignation || content.designation;
  const principalMessage =
    collegeInfo.principalMessage?.trim() || content.quote;
  const principalImage =
    collegeInfo.principalImage || imageData.principalPortrait;

  return (
    <>
      <Helmet>
        <title>
          {isHindi
            ? "प्राचार्या का संदेश | हरियाणा शक्ति कॉलेज ऑफ एजुकेशन"
            : "Principal's Desk | Haryana Shakti College of Education"}
        </title>

        <meta
          name="description"
          content={
            isHindi
              ? "हरियाणा शक्ति कॉलेज ऑफ एजुकेशन की प्राचार्या डॉ. सविता राठी का संदेश।"
              : "Read the official message from Dr. Savita Rathee, Principal of Haryana Shakti College of Education."
          }
        />
      </Helmet>

      <AboutSubNav
        activeTabId="principal"
        title={content.title}
        subtitle={content.subtitle}
      />

      <main className="bg-white text-gray-800">
        {/* Page title */}
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
              {/* Principal profile */}
              <aside className="min-w-0 lg:col-span-4">
                <div className="overflow-hidden border border-gray-200 bg-white">
                  {/* Full-width rectangular photograph */}
                  <div className="overflow-hidden bg-gray-100">
                    <img
                      src={principalImage}
                      alt={content.name}
                      className="block h-auto max-h-[680px] w-full object-contain object-top"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = imageData.collegeLogo;
                        e.currentTarget.className =
                          "mx-auto block h-64 w-full object-contain bg-gray-50 p-8";
                      }}
                    />
                  </div>

                  {/* Name and designation */}
                  <div className="border-t-[3px] border-[#363991] px-5 py-6 sm:px-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#363991]">
                      {principalDesignation}
                    </p>

                    <h2 className="mt-2 text-xl font-bold leading-snug text-gray-900 sm:text-2xl">
                      {principalName}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {content.institution}
                    </p>

                    <div className="mt-5 flex items-start gap-3 border-t border-gray-200 pt-5">
                      <GraduationCap
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
                        {isHindi ? "संपर्क जानकारी" : "Contact Information"}
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

              {/* Principal's message */}
              <article className="min-w-0 lg:col-span-8">
                {/* Section heading */}
                <header className="border-b border-gray-200 pb-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.13em] text-[#363991]">
                    {isHindi
                      ? "प्राचार्या की ओर से"
                      : "A Message from the Principal"}
                  </p>

                  <h2 className="text-2xl font-bold leading-snug tracking-tight text-gray-900 sm:text-3xl">
                    {content.mainHeading}
                  </h2>

                  <div className="mt-4 h-[3px] w-12 bg-[#fed100]" />
                </header>

                {/* Opening message */}
                <div className="mt-6 border-l-[3px] border-[#363991] bg-[#f7f7f9] px-5 py-5 sm:px-7 sm:py-6">
                  <p className="text-base font-medium leading-8 text-gray-800 sm:text-lg sm:leading-9">
                    &ldquo;{principalMessage}&rdquo;
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

                {/* Signature and course link */}
                <footer className="mt-9 border-t border-gray-200 pt-6">
                  <p className="text-sm leading-6 text-gray-600">
                    {content.closing}
                  </p>

                  <p className="mt-2 text-lg font-bold text-gray-900">
                    {principalName}
                  </p>

                  <p className="mt-1 text-sm text-[#363991]">
                    {principalDesignation}
                  </p>

                  <Link
                    to="/course/bed"
                    className="mt-7 inline-flex max-w-full items-center justify-center gap-2 bg-[#363991] px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#292b70] focus:outline-none focus:ring-2 focus:ring-[#363991] focus:ring-offset-2">
                    <span>{content.viewCurriculumBtn}</span>
                    <ArrowRight size={16} className="shrink-0" />
                  </Link>
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
                    ? "शिक्षा, ज्ञान और उज्ज्वल भविष्य के लिए प्रतिबद्ध"
                    : "Committed to education, knowledge and a brighter future"}
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

      <AboutPageNavigator prevTabId="chairman" nextTabId="recognition" />

      <AboutBottomCTA />
    </>
  );
}

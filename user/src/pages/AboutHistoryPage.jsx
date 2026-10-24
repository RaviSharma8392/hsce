import { Helmet } from "react-helmet-async";
import { Calendar } from "lucide-react";
import { Container } from "../components/common/Container";
import { SectionHeading } from "../components/common/SectionHeading";
import {
  AboutSubNav,
  AboutBottomCTA,
  AboutPageNavigator,
} from "../components/about/AboutSubNav";
import { aboutHistoryContent } from "../data/aboutBilingualData";
import { useLanguage } from "../context/LanguageContext";

export default function AboutHistoryPage() {
  const { language, isHindi } = useLanguage();
  const content = aboutHistoryContent[language] || aboutHistoryContent.en;

  return (
    <>
      <Helmet>
        <title>
          {isHindi
            ? "इतिहास एवं विकास | हरियाणा शक्ति कॉलेज ऑफ एजुकेशन"
            : "History & Genesis | Haryana Shakti College of Education (HSCE)"}
        </title>
        <meta
          name="description"
          content={
            isHindi
              ? "हरियाणा शक्ति कॉलेज ऑफ एजुकेशन, कंझावला, दिल्ली का इतिहास और मील के पत्थर।"
              : "Discover the founding history, institutional legacy, and milestones of Haryana Shakti College of Education since 2012."
          }
        />
      </Helmet>

      <AboutSubNav
        activeTabId="history"
        title={content.title}
        subtitle={content.subtitle}
      />

      <section className="py-14 bg-white">
        <Container>
          <div className="max-w-3xl">
            <SectionHeading
              eyebrow={content.eyebrow}
              title={content.mainHeading}
            />
            <p className="text-sm font-semibold text-[#363991] mt-1 mb-6">
              {content.subHeading}
            </p>
          </div>

          <div className="mt-4 grid gap-10 lg:grid-cols-12 items-start">
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-4 text-sm text-[#444444] leading-relaxed font-sans">
              {content.paragraphs.map((para, idx) => (
                <p key={idx} className="text-justify">
                  {para}
                </p>
              ))}

              <div className="mt-6 rounded-lg bg-yellow-50/80 border-l-4 border-[#363991] p-4 shadow-2xs">
                <h4 className="font-poppins font-bold text-sm text-gray-900">
                  {content.calloutTitle}
                </h4>
                <p className="mt-1 text-xs text-gray-700 leading-relaxed font-sans">
                  {content.calloutText}
                </p>
              </div>
            </div>

            {/* Right Milestones Timeline */}
            <div className="lg:col-span-5">
              <div className="rounded-xl border border-gray-200 bg-[#FAF9F9] p-6 shadow-sm">
                <h3 className="font-poppins font-bold text-sm text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                  <Calendar size={18} className="text-[#363991]" />
                  {content.timelineTitle}
                </h3>

                <div className="relative border-l-2 border-yellow-300 ml-3 space-y-6">
                  {content.milestones.map((item, idx) => (
                    <div key={idx} className="relative pl-6">
                      <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-white bg-[#363991] shadow-2xs" />
                      <div className="inline-block rounded bg-yellow-200 px-2 py-0.5 text-[11px] font-bold text-[#363991] font-poppins">
                        {item.year}
                      </div>
                      <h4 className="mt-1 font-poppins font-semibold text-xs text-gray-900">
                        {item.title}
                      </h4>
                      <p className="mt-0.5 text-xs text-gray-600 leading-relaxed font-sans">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <AboutPageNavigator prevTabId="overview" nextTabId="vision-mission" />
      <AboutBottomCTA />
    </>
  );
}

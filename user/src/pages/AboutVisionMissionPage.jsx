import { Helmet } from "react-helmet-async";
import { Award, BookOpen, Sparkles } from "lucide-react";
import { Container } from "../components/common/Container";
import { SectionHeading } from "../components/common/SectionHeading";
import {
  AboutSubNav,
  AboutBottomCTA,
  AboutPageNavigator,
} from "../components/about/AboutSubNav";
import { aboutVisionContent } from "../data/aboutBilingualData";
import { useLanguage } from "../context/LanguageContext";

export default function AboutVisionMissionPage() {
  const { language, isHindi } = useLanguage();
  const content = aboutVisionContent[language] || aboutVisionContent.en;

  return (
    <>
      <Helmet>
        <title>
          {isHindi
            ? "लक्ष्य एवं दृष्टि | हरियाणा शक्ति कॉलेज ऑफ एजुकेशन"
            : "Vision & Mission | Haryana Shakti College of Education (HSCE)"}
        </title>
        <meta
          name="description"
          content={
            isHindi
              ? "हरियाणा शक्ति कॉलेज ऑफ एजुकेशन का विजन, मिशन और मूल्य।"
              : "Discover the institutional vision, mission, and guiding pedagogical philosophy of Haryana Shakti College of Education."
          }
        />
      </Helmet>

      <AboutSubNav
        activeTabId="vision-mission"
        title={content.title}
        subtitle={content.subtitle}
      />

      <section className="py-14 bg-white">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <SectionHeading
              eyebrow={content.eyebrow}
              title={content.mainHeading}
              align="center"
            />
            <p className="mt-2 text-xs sm:text-sm text-gray-600 font-sans">
              {content.subtitle}
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-12 items-stretch">
            {/* Vision Card */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="rounded-xl border-2 border-[#363991] bg-gradient-to-br from-yellow-50/60 via-white to-yellow-50/30 p-6 sm:p-8 shadow-sm flex-1 flex flex-col justify-between">
                <div>
                  <div className="inline-flex rounded-lg bg-[#363991] p-3 text-white mb-4">
                    <Award size={26} />
                  </div>
                  <h3 className="font-poppins font-bold text-2xl text-gray-900">
                    {content.visionTitle}
                  </h3>
                  <div className="my-4 h-1 w-12 bg-[#363991] rounded-full" />
                  <blockquote className="text-sm sm:text-base font-serif italic text-gray-800 leading-relaxed bg-white/70 p-4 rounded-lg border border-yellow-200">
                    &ldquo;{content.visionStatement}&rdquo;
                  </blockquote>
                  <p className="mt-4 text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
                    {content.visionDetails}
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-yellow-200 flex items-center justify-between text-xs text-[#363991] font-semibold">
                  <span>{content.visionTagline}</span>
                  <Sparkles size={16} />
                </div>
              </div>
            </div>

            {/* Mission Card with 5 Pillars */}
            <div className="lg:col-span-7">
              <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="inline-flex rounded-lg bg-[#1F242D] p-2.5 text-white">
                    <BookOpen size={22} />
                  </div>
                  <div>
                    <h3 className="font-poppins font-bold text-xl text-gray-900">
                      {content.missionTitle}
                    </h3>
                    <p className="text-xs text-gray-600 font-sans">
                      {content.missionPillarsTitle}
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm font-medium text-gray-800 my-4 bg-gray-50 p-3 rounded border border-gray-150">
                  {content.missionStatement}
                </p>

                <div className="mt-5 space-y-3.5">
                  {content.missionPoints.map((pt, idx) => (
                    <div
                      key={idx}
                      className="group flex items-start gap-3.5 rounded-lg border border-gray-150 p-3.5 transition hover:border-[#363991] hover:bg-yellow-50/40">
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-yellow-200 font-poppins text-xs font-bold text-[#363991] group-hover:bg-[#363991] group-hover:text-white transition">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-poppins font-semibold text-xs sm:text-sm text-gray-900">
                          {pt.heading}
                        </h4>
                        <p className="mt-0.5 text-xs text-gray-600 leading-relaxed font-sans">
                          {pt.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <AboutPageNavigator prevTabId="history" nextTabId="principal" />
      <AboutBottomCTA />
    </>
  );
}

import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ShieldCheck, FileText } from "lucide-react";
import { Container } from "../components/common/Container";
import { SectionHeading } from "../components/common/SectionHeading";
import {
  AboutSubNav,
  AboutBottomCTA,
  AboutPageNavigator,
} from "../components/about/AboutSubNav";
import { aboutRecognitionContent } from "../data/aboutBilingualData";
import { useLanguage } from "../context/LanguageContext";

export default function AboutRecognitionPage() {
  const { language, isHindi } = useLanguage();
  const content = aboutRecognitionContent[language] || aboutRecognitionContent.en;

  return (
    <>
      <Helmet>
        <title>
          {isHindi
            ? "मान्यता एवं संबद्धता | हरियाणा शक्ति कॉलेज ऑफ एजुकेशन"
            : "Recognition & Affiliation | Haryana Shakti College of Education (HSCE)"}
        </title>
        <meta
          name="description"
          content={
            isHindi
              ? "हरियाणा शक्ति कॉलेज ऑफ एजुकेशन, कंझावला, दिल्ली की एनसीटीई मान्यता और जीजीएसआईपीयू संबद्धता।"
              : "Details of NCTE statutory recognition, Guru Gobind Singh Indraprastha University (GGSIPU) affiliation, NAAC accreditation and governance."
          }
        />
      </Helmet>

      <AboutSubNav
        activeTabId="recognition"
        title={content.title}
        subtitle={content.subtitle}
      />

      <section className="py-14 bg-white">
        <Container>
          <div className="max-w-3xl mb-8">
            <SectionHeading
              eyebrow={content.eyebrow}
              title={content.mainHeading}
            />
            <p className="mt-2 text-xs sm:text-sm text-gray-600 font-sans">
              {content.regulatorySummary}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {content.items.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-gray-200 bg-[#FAF9F9] p-6 shadow-2xs hover:border-[#363991]/50 hover:bg-white transition group">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-3 mb-3">
                  <h4 className="font-poppins font-bold text-sm sm:text-base text-gray-900">
                    {item.body}
                  </h4>
                  <span className="self-start sm:self-auto rounded bg-yellow-100 border border-yellow-300 px-2.5 py-0.5 text-[11px] font-semibold text-[#363991] whitespace-nowrap">
                    {item.status}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-sans">
                  {item.details}
                </p>
              </div>
            ))}
          </div>

          {/* Regulatory Disclaimer & Direct Mandatory Disclosure Link */}
          <div className="mt-10 rounded-xl border border-amber-300 bg-amber-50/80 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-start gap-3">
              <ShieldCheck
                size={22}
                className="text-amber-700 mt-0.5 flex-shrink-0"
              />
              <p className="text-xs sm:text-sm text-amber-950 leading-relaxed font-sans">
                {content.disclaimer}
              </p>
            </div>
            <Link
              to="/mandatory-disclosure"
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md bg-[#363991] px-5 py-2.5 font-poppins text-xs font-semibold text-white shadow-xs hover:bg-[#272a75] transition">
              <FileText size={15} />
              {content.openDisclosureBtn}
            </Link>
          </div>
        </Container>
      </section>

      <AboutPageNavigator prevTabId="principal" nextTabId="facilities" />
      <AboutBottomCTA />
    </>
  );
}

import { Helmet } from "react-helmet-async";
import { ExternalLink } from "lucide-react";
import { Container } from "../components/common/Container";
import { SectionHeading } from "../components/common/SectionHeading";
import {
  AboutSubNav,
  AboutBottomCTA,
  AboutPageNavigator,
} from "../components/about/AboutSubNav";
import { aboutFactsContent } from "../data/aboutBilingualData";
import { collegeInfo as defaultCollegeInfo } from "../data/siteData";
import { usePublishedRecords } from "../hooks/usePublishedRecords";
import { useLanguage } from "../context/LanguageContext";

export default function AboutFactsPage() {
  const { language, isHindi } = useLanguage();
  const content = aboutFactsContent[language] || aboutFactsContent.en;

  const siteSettings = usePublishedRecords("siteContent", [defaultCollegeInfo]);
  const collegeInfo =
    siteSettings.find((record) => record.id === "settings") ||
    siteSettings[0] ||
    defaultCollegeInfo;

  return (
    <>
      <Helmet>
        <title>
          {isHindi
            ? "संस्थागत तथ्य विवरण | हरियाणा शक्ति कॉलेज ऑफ एजुकेशन"
            : "Fact Sheet | Haryana Shakti College of Education (HSCE)"}
        </title>
        <meta
          name="description"
          content={
            isHindi
              ? "हरियाणा शक्ति कॉलेज ऑफ एजुकेशन का संस्थागत तथ्य विवरण एवं मुख्य आंकड़े।"
              : "Key institutional metrics, parameters, university affiliation, and regulatory facts for Haryana Shakti College of Education."
          }
        />
      </Helmet>

      <AboutSubNav
        activeTabId="facts"
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
            <p className="mt-1 text-xs sm:text-sm text-gray-600 font-sans">
              {content.lead}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm font-sans">
                <thead className="bg-[#1F242D] text-white font-poppins text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-4 w-1/3">
                      {content.parameterHeading}
                    </th>
                    <th className="px-5 py-4">
                      {content.detailsHeading}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {content.facts.map((fact, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? "bg-white" : "bg-[#FAF9F9]"}>
                      <td className="px-5 py-3.5 font-semibold text-gray-900 font-poppins">
                        {fact.label}
                      </td>
                      <td className="px-5 py-3.5 text-gray-700">{fact.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Social media badge strip */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-yellow-50/80 border border-yellow-200 p-4 shadow-2xs">
            <div className="text-xs sm:text-sm text-gray-800">
              <span className="font-bold text-gray-900">
                {isHindi ? "आधिकारिक सोशल पोर्टल: " : "Official Social Portal: "}
              </span>
              {isHindi
                ? "इंस्टाग्राम पर कॉलेज की गतिविधियों से जुड़े रहें"
                : "Stay updated with campus activities on Instagram"}
            </div>
            <a
              href={collegeInfo.instagram || "https://www.instagram.com/hscekanjhawala/"}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#363991] hover:underline">
              <span>{content.socialBtnText}</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </Container>
      </section>

      <AboutPageNavigator prevTabId="facilities" />
      <AboutBottomCTA />
    </>
  );
}

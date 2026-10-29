import React from "react";
import { Helmet } from "react-helmet-async";
import {
  GraduationCap,
  CheckCircle2,
  FileText,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import { Container } from "../components/common/Container";
import { SectionHeading } from "../components/common/SectionHeading";
import { PageHeaderBanner } from "../components/common/PageHeaderBanner";
import { AdmissionSubNav } from "../components/admissions/AdmissionSubNav";
import { useLanguage } from "../context/LanguageContext";
import { useAdmissionModal } from "../context/AdmissionModalContext";
import { imageData } from "../data/imagesData";

const admissionSteps = [
  {
    number: "01",
    title: "University Registration",
    hiTitle: "विश्वविद्यालय पंजीकरण",
    description:
      "Register on the official GGSIPU admission portal and complete the required application formalities.",
    hiDescription:
      "GGSIPU के आधिकारिक प्रवेश पोर्टल पर पंजीकरण करें और आवश्यक आवेदन प्रक्रिया पूरी करें।",
  },
  {
    number: "02",
    title: "Choice Filling",
    hiTitle: "कॉलेज चयन",
    description:
      "Select Haryana Shakti College of Education, Kanjhawala, during the applicable counselling rounds.",
    hiDescription:
      "काउंसलिंग के दौरान हरियाणा शक्ति कॉलेज ऑफ एजुकेशन, कंझावला को अपनी पसंद में चुनें।",
  },
  {
    number: "03",
    title: "Seat Allotment",
    hiTitle: "सीट आवंटन",
    description:
      "Check the allotment result and follow the university's instructions for fee payment and reporting.",
    hiDescription:
      "सीट आवंटन परिणाम देखें और शुल्क भुगतान एवं रिपोर्टिंग के लिए विश्वविद्यालय के निर्देशों का पालन करें।",
  },
  {
    number: "04",
    title: "Document Verification",
    hiTitle: "दस्तावेज़ सत्यापन",
    description:
      "Visit the college with the required original documents and complete the admission formalities.",
    hiDescription:
      "आवश्यक मूल दस्तावेज़ों के साथ कॉलेज आएँ और प्रवेश संबंधी औपचारिकताएँ पूरी करें।",
  },
];

const eligibilityCriteria = [
  {
    category: "General Candidates",
    hiCategory: "सामान्य वर्ग",
    qualification:
      "Bachelor's / Master's degree in Science, Social Science or Humanities",
    hiQualification:
      "विज्ञान, सामाजिक विज्ञान या मानविकी में स्नातक / स्नातकोत्तर",
    marks: "50%",
    hiMarks: "50%",
  },
  {
    category: "Engineering / Technology Graduates",
    hiCategory: "इंजीनियरिंग / प्रौद्योगिकी स्नातक",
    qualification:
      "B.Tech. / B.E. with specialization in Science and Mathematics",
    hiQualification: "विज्ञान एवं गणित में विशेषज्ञता के साथ बी.टेक. / बी.ई.",
    marks: "55%",
    hiMarks: "55%",
  },
  {
    category: "SC / ST / PwD Candidates",
    hiCategory: "एससी / एसटी / दिव्यांग वर्ग",
    qualification: "Bachelor's or Master's degree from a recognized university",
    hiQualification: "मान्यता प्राप्त विश्वविद्यालय से स्नातक या स्नातकोत्तर",
    marks: "45%*",
    hiMarks: "45%*",
  },
];

const requiredDocuments = [
  {
    name: "Class 10 marksheet and certificate",
    hiName: "कक्षा 10 की अंकतालिका एवं प्रमाण पत्र",
  },
  {
    name: "Class 12 marksheet and certificate",
    hiName: "कक्षा 12 की अंकतालिका एवं प्रमाण पत्र",
  },
  {
    name: "Graduation marksheets and degree",
    hiName: "स्नातक की सभी अंकतालिकाएँ एवं डिग्री",
  },
  {
    name: "Postgraduate documents, if applicable",
    hiName: "स्नातकोत्तर दस्तावेज़, यदि लागू हों",
  },
  {
    name: "University allotment letter and verification slip",
    hiName: "विश्वविद्यालय आवंटन पत्र एवं सत्यापन पर्ची",
  },
  {
    name: "Applicable category certificate",
    hiName: "लागू होने पर श्रेणी प्रमाण पत्र",
  },
  {
    name: "Character certificate",
    hiName: "चरित्र प्रमाण पत्र",
  },
  {
    name: "Migration certificate, if required",
    hiName: "माइग्रेशन प्रमाण पत्र, यदि आवश्यक हो",
  },
  {
    name: "Medical fitness certificate",
    hiName: "चिकित्सा स्वास्थ्य प्रमाण पत्र",
  },
  {
    name: "Recent passport-size photographs",
    hiName: "नवीनतम पासपोर्ट आकार के फोटो",
  },
];

export default function AdmissionsPage() {
  const { isHindi } = useLanguage();
  const { openAdmissionModal } = useAdmissionModal();

  const t = (english, hindi) => (isHindi ? hindi : english);

  return (
    <>
      <Helmet>
        <title>
          {t(
            "B.Ed. Admissions | Haryana Shakti College of Education",
            "बी.एड. प्रवेश | हरियाणा शक्ति कॉलेज ऑफ एजुकेशन",
          )}
        </title>

        <meta
          name="description"
          content={t(
            "Explore B.Ed. admission steps, eligibility criteria and required documents at Haryana Shakti College of Education, Kanjhawala, Delhi.",
            "हरियाणा शक्ति कॉलेज ऑफ एजुकेशन, कंझावला में बी.एड. प्रवेश प्रक्रिया, पात्रता और आवश्यक दस्तावेज़ों की जानकारी प्राप्त करें।",
          )}
        />
      </Helmet>

      <PageHeaderBanner
        title={t("Admissions (B.Ed.)", "प्रवेश प्रक्रिया (बी.एड.)")}
        subtitle={t(
          "Admission guidelines, eligibility and documents required for the B.Ed. programme.",
          "बी.एड. पाठ्यक्रम के लिए प्रवेश दिशानिर्देश, पात्रता एवं आवश्यक दस्तावेज़।",
        )}
        breadcrumbs={[
          {
            label: t("Admissions", "प्रवेश"),
            href: "/admissions/overview",
          },
          { label: t("Overview", "अवलोकन") },
        ]}
      />

      <main className="bg-[#F7F8FA] py-8 sm:py-10 lg:py-12">
        <Container>
          {/* Admission introduction */}

          {/* Admission steps */}
          <section className="mb-12">
            <SectionHeading
              eyebrow={t("HOW TO APPLY", "आवेदन प्रक्रिया")}
              title={t("Admission Process", "प्रवेश प्रक्रिया")}
            />

            <p className="mb-6 mt-2 max-w-2xl text-sm leading-6 text-[#626879]">
              {t(
                "Follow these four steps and verify the current admission schedule before proceeding.",
                "इन चार चरणों का पालन करें और आगे बढ़ने से पहले वर्तमान प्रवेश कार्यक्रम की पुष्टि करें।",
              )}
            </p>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {admissionSteps.map((step) => (
                <article
                  key={step.number}
                  className="rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-[#292C75]/40">
                  <div className="mb-5 flex items-center justify-between">
                    <span className="text-2xl font-bold tracking-tight text-[#292C75]/35">
                      {step.number}
                    </span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F1F2FA] text-[#292C75]">
                      <CheckCircle2 size={17} />
                    </span>
                  </div>

                  <h3 className="text-base font-bold leading-6 text-[#25283A]">
                    {t(step.title, step.hiTitle)}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#626879]">
                    {t(step.description, step.hiDescription)}
                  </p>
                </article>
              ))}
            </div>
          </section>

          {/* Eligibility */}
          <section className="mb-12 rounded-xl border border-gray-200 bg-white p-5 sm:p-7">
            <div className="mb-5">
              <SectionHeading
                eyebrow={t("CHECK BEFORE APPLYING", "आवेदन से पहले")}
                title={t("Eligibility Criteria", "पात्रता मानदंड")}
              />
              <p className="mt-2 text-sm leading-6 text-[#626879]">
                {t(
                  "Check the academic requirements applicable to your category.",
                  "अपनी श्रेणी के अनुसार शैक्षणिक आवश्यकताओं की जाँच करें।",
                )}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-y border-gray-200 bg-[#F7F8FA] text-xs uppercase tracking-wide text-gray-600">
                    <th className="px-4 py-3 font-semibold">
                      {t("Category", "श्रेणी")}
                    </th>
                    <th className="px-4 py-3 font-semibold">
                      {t("Qualification", "शैक्षणिक योग्यता")}
                    </th>
                    <th className="px-4 py-3 text-right font-semibold">
                      {t("Minimum Marks", "न्यूनतम अंक")}
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {eligibilityCriteria.map((item) => (
                    <tr
                      key={item.category}
                      className="transition-colors hover:bg-[#F7F8FA]">
                      <td className="px-4 py-4 font-semibold text-[#25283A]">
                        {t(item.category, item.hiCategory)}
                      </td>
                      <td className="px-4 py-4 leading-6 text-[#626879]">
                        {t(item.qualification, item.hiQualification)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-right font-bold text-[#292C75]">
                        {t(item.marks, item.hiMarks)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-xs leading-5 text-gray-500">
              {t(
                "*Eligibility and any applicable relaxation must be confirmed against the latest official GGSIPU admission brochure and applicable regulations.",
                "*पात्रता एवं लागू छूट की पुष्टि नवीनतम आधिकारिक GGSIPU प्रवेश विवरणिका और संबंधित नियमों से करें।",
              )}
            </p>
          </section>

          {/* Required documents */}
          <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-7">
            <div className="mb-5">
              <SectionHeading
                eyebrow={t("KEEP THESE READY", "दस्तावेज़ तैयार रखें")}
                title={t("Document Checklist", "आवश्यक दस्तावेज़")}
              />
              <p className="mt-2 text-sm leading-6 text-[#626879]">
                {t(
                  "Prepare the following documents. Check the latest university instructions for the final document list and number of copies required.",
                  "निम्नलिखित दस्तावेज़ तैयार रखें। अंतिम सूची एवं प्रतियों की संख्या के लिए विश्वविद्यालय के नवीनतम निर्देश देखें।",
                )}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {requiredDocuments.map((doc, index) => (
                <div
                  key={doc.name}
                  className="flex items-start gap-3 rounded-lg border border-gray-100 bg-[#FAFAFB] p-3.5">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#F1F2FA] text-[#292C75]">
                    <FileText size={17} />
                  </span>

                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-6 text-[#25283A]">
                      {t(doc.name, doc.hiName)}
                    </p>
                    <span className="mt-0.5 block text-xs text-gray-400">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Container>
      </main>
    </>
  );
}

import React from "react";
import {
  GraduationCap,
  CheckCircle2,
  FileText,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import { CollegiatePageLayout } from "../components/common/CollegiatePageLayout";
import { getAdmissionsSidebarConfig } from "../data/navigationConfig";
import { useLanguage } from "../context/LanguageContext";
import { useAdmissionModal } from "../context/AdmissionModalContext";

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
      "Select Haryana Shakti College of Education, Kanjhawala (Code: 147), during counselling rounds.",
    hiDescription:
      "काउंसलिंग के दौरान हरियाणा शक्ति कॉलेज ऑफ एजुकेशन, कंझावला (कोड: 147) को अपनी पसंद में चुनें।",
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
      "Visit the college with original documents and complete physical reporting formalities.",
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
    name: "Applicable category certificate (SC/ST/OBC/EWS)",
    hiName: "लागू होने पर श्रेणी प्रमाण पत्र (SC/ST/OBC/EWS)",
  },
  {
    name: "Character certificate from institution last attended",
    hiName: "अंतिम संस्थान से चरित्र प्रमाण पत्र",
  },
  {
    name: "Migration certificate, if required",
    hiName: "माइग्रेशन प्रमाण पत्र, यदि आवश्यक हो",
  },
  {
    name: "Medical fitness certificate by registered MBBS doctor",
    hiName: "पंजीकृत चिकित्सक द्वारा चिकित्सा स्वास्थ्य प्रमाण पत्र",
  },
  {
    name: "Recent passport-size photographs (6 copies)",
    hiName: "नवीनतम पासपोर्ट आकार के फोटो (6 प्रतियां)",
  },
];

export default function AdmissionsPage() {
  const { isHindi } = useLanguage();
  const t = (english, hindi) => (isHindi ? hindi : english);
  const sidebarConfig = getAdmissionsSidebarConfig(isHindi);

  return (
    <CollegiatePageLayout
      bannerTitle={t("Admissions (B.Ed.)", "प्रवेश प्रक्रिया (बी.एड.)")}
      bannerSubtitle={t(
        "Admission guidelines, eligibility criteria and documents required for the 2-Year B.Ed. programme.",
        "बी.एड. पाठ्यक्रम के लिए प्रवेश दिशानिर्देश, पात्रता एवं आवश्यक दस्तावेज़।",
      )}
      breadcrumbs={[
        { label: t("Admissions", "प्रवेश") },
        { label: t("Overview", "अवलोकन") },
      ]}
      sidebarTitle={sidebarConfig.title}
      sidebarItems={sidebarConfig.items}
      quickActions={sidebarConfig.quickActions}>
      <div className="space-y-8">
        {/* 1. Admission Process Steps Card */}
        <div className="rounded-md border border-gray-200/90 bg-white p-6 sm:p-8 shadow-xs">
          {/* Header with Blue Underline */}
          <div className="border-b border-gray-200 pb-4 mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E3A8C]">
              {t("HOW TO APPLY", "आवेदन प्रक्रिया")}
            </span>
            <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {t("B.Ed. Admission Process", "बी.एड. प्रवेश प्रक्रिया")}
            </h2>
            <div className="mt-3 h-1 w-20 bg-[#2E3A8C] rounded-full" />
          </div>

          <p className="mb-6 text-xs sm:text-sm text-slate-600 font-sans">
            {t(
              "Follow these four institutional steps and verify the current GGSIPU admission schedule before reporting.",
              "इन चार चरणों का पालन करें और रिपोर्टिंग से पहले वर्तमान GGSIPU प्रवेश कार्यक्रम की पुष्टि करें।",
            )}
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {admissionSteps.map((step) => (
              <div
                key={step.number}
                className="rounded-md border border-gray-200 bg-slate-50/60 p-5 transition-colors hover:border-[#2E3A8C] hover:bg-white shadow-2xs">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-2xl font-bold font-serif text-[#2E3A8C]/30">
                    {step.number}
                  </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#2E3A8C] text-white">
                    <CheckCircle2 size={16} />
                  </span>
                </div>

                <h3 className="font-serif text-base font-bold text-slate-900">
                  {t(step.title, step.hiTitle)}
                </h3>

                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">
                  {t(step.description, step.hiDescription)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Eligibility Criteria Table (Image 3 Style) */}
        <div className="rounded-md border border-gray-200/90 bg-white overflow-hidden shadow-xs">
          <div className="bg-[#E4E7F5] px-6 py-4 border-b border-gray-200/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#2E3A8C]">
              {t("CHECK BEFORE APPLYING", "आवेदन से पहले")}
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1E242C] tracking-tight">
              {t("Eligibility Criteria", "पात्रता मानदंड")}
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[550px] border-collapse text-left text-xs sm:text-sm font-sans">
              <thead>
                <tr className="bg-[#1F242C] text-white">
                  <th className="py-3.5 px-6 font-bold border-r border-[#333a44]">
                    {t("Category", "श्रेणी")}
                  </th>
                  <th className="py-3.5 px-6 font-bold border-r border-[#333a44]">
                    {t("Qualification", "शैक्षणिक योग्यता")}
                  </th>
                  <th className="py-3.5 px-6 text-right font-bold">
                    {t("Minimum Marks", "न्यूनतम अंक")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/80">
                {eligibilityCriteria.map((item, idx) => (
                  <tr
                    key={item.category}
                    className={`transition-colors hover:bg-blue-50/40 ${
                      idx % 2 === 1 ? "bg-slate-50/70" : "bg-white"
                    }`}>
                    <td className="px-6 py-4 font-bold text-slate-900 border-r border-gray-200/80">
                      {t(item.category, item.hiCategory)}
                    </td>
                    <td className="px-6 py-4 text-slate-700 leading-relaxed border-r border-gray-200/80">
                      {t(item.qualification, item.hiQualification)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right font-bold text-[#2E3A8C]">
                      {t(item.marks, item.hiMarks)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-50 border-t border-gray-200/80 text-xs text-slate-500 font-sans">
            {t(
              "*Eligibility and any applicable relaxation must be confirmed against the latest official GGSIPU admission brochure.",
              "*पात्रता एवं लागू छूट की पुष्टि नवीनतम आधिकारिक GGSIPU प्रवेश विवरणिका से करें।",
            )}
          </div>
        </div>

        {/* 3. Document Checklist Card */}
        <div className="rounded-md border border-gray-200/90 bg-white p-6 sm:p-8 shadow-xs">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E3A8C]">
              {t("KEEP THESE READY", "दस्तावेज़ तैयार रखें")}
            </span>
            <h3 className="mt-1 font-serif text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {t("Required Documents Checklist", "आवश्यक दस्तावेज़ चेकलिस्ट")}
            </h3>
            <div className="mt-3 h-1 w-20 bg-[#2E3A8C] rounded-full" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {requiredDocuments.map((doc, index) => (
              <div
                key={doc.name}
                className="flex items-start gap-3 rounded-md border border-gray-200/80 bg-slate-50/50 p-3.5 hover:bg-white hover:border-[#2E3A8C]/50 transition">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded bg-[#2E3A8C] text-white text-xs font-bold">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-xs sm:text-sm font-medium text-slate-800 leading-snug">
                  {t(doc.name, doc.hiName)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CollegiatePageLayout>
  );
}

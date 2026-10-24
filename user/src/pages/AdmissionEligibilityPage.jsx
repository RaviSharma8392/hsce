import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  CheckCircle2,
  FileCheck,
  AlertCircle,
  Phone,
  ArrowRight,
  BookOpen,
  Award,
  Sparkles,
  HelpCircle,
  Check,
} from "lucide-react";
import { Container } from "../components/common/Container";
import { SectionHeading } from "../components/common/SectionHeading";
import { PageHeaderBanner } from "../components/common/PageHeaderBanner";
import { AdmissionSubNav } from "../components/admissions/AdmissionSubNav";
import { useLanguage } from "../context/LanguageContext";
import { useAdmissionModal } from "../context/AdmissionModalContext";
import { collegeInfo } from "../data/siteData";

export default function AdmissionEligibilityPage() {
  const { isHindi } = useLanguage();
  const { openAdmissionModal } = useAdmissionModal();

  const eligibilityCriteria = [
    {
      category: "General Candidates",
      hiCategory: "सामान्य वर्ग के अभ्यर्थी",
      degree: "Bachelor's Degree and/or Master's Degree in Science / Social Science / Humanities",
      hiDegree: "विज्ञान, सामाजिक विज्ञान या मानविकी में स्नातक अथवा स्नातकोत्तर डिग्री",
      requirement: "Minimum 50% marks in aggregate",
      hiRequirement: "कुल न्यूनतम 50% अंक",
      badge: "NCTE Standard",
    },
    {
      category: "Engineering & Technology",
      hiCategory: "इंजीनियरिंग एवं तकनीकी स्नातक",
      degree: "B.Tech. / B.E. with specialization in Science and Mathematics",
      hiDegree: "विज्ञान एवं गणित में विशेषज्ञता के साथ बी.टेक. / बी.ई.",
      requirement: "Minimum 55% marks in aggregate",
      hiRequirement: "कुल न्यूनतम 55% अंक",
      badge: "AICTE / NCTE Norms",
    },
    {
      category: "SC / ST / PwD Candidates",
      hiCategory: "अनुसूचित जाति / जनजाति / दिव्यांग अभ्यर्थी",
      degree: "Bachelor's or Master's Degree from a recognized university",
      hiDegree: "मान्यता प्राप्त विश्वविद्यालय से स्नातक अथवा स्नातकोत्तर डिग्री",
      requirement: "Minimum 45% marks in aggregate (5% Relaxation)",
      hiRequirement: "कुल न्यूनतम 45% अंक (5% की छूट)",
      badge: "Statutory Relaxation",
    },
    {
      category: "OBC / EWS Candidates (Delhi NCT)",
      hiCategory: "अन्य पिछड़ा वर्ग / ईडब्ल्यूएस (दिल्ली)",
      degree: "Qualifying degree as per GGSIPU Admission Brochure guidelines",
      hiDegree: "जीजीएसआईपीयू प्रवेश विवरणिका के दिशा-निर्देशानुसार योग्यता डिग्री",
      requirement: "As prescribed in official GGSIPU University counselling circular",
      hiRequirement: "विश्वविद्यालय परामर्श परिपत्र के नियमानुसार",
      badge: "Delhi State Norms",
    },
  ];

  const pedagogySubjects = [
    {
      stream: "Languages",
      hiStream: "भाषा शिक्षण",
      subjects: ["Teaching of English", "Teaching of Hindi", "Teaching of Sanskrit"],
      requirement: "Studied the chosen language as an elective subject in graduation for at least 2 consecutive years.",
    },
    {
      stream: "Social Sciences",
      hiStream: "सामाजिक विज्ञान शिक्षण",
      subjects: ["Teaching of Social Science", "Teaching of History", "Teaching of Economics", "Teaching of Political Science", "Teaching of Geography"],
      requirement: "Studied at least two subjects among History, Political Science, Economics, Geography, Sociology, or Psychology at degree level.",
    },
    {
      stream: "Sciences",
      hiStream: "विज्ञान शिक्षण",
      subjects: ["Teaching of Integrated Science", "Teaching of Physics", "Teaching of Chemistry", "Teaching of Biology"],
      requirement: "B.Sc. / Science graduate with Physics, Chemistry, Botany, Zoology, or Biotechnology.",
    },
    {
      stream: "Mathematics",
      hiStream: "गणित शिक्षण",
      subjects: ["Teaching of Mathematics"],
      requirement: "Studied Mathematics as a major/main subject at graduation level with minimum aggregate pass requirements.",
    },
    {
      stream: "Commerce",
      hiStream: "वाणिज्य शिक्षण",
      subjects: ["Teaching of Commerce", "Teaching of Accountancy"],
      requirement: "B.Com. / M.Com. degree with Accountancy, Business Studies, or Banking subjects.",
    },
  ];

  const helplinePhone = collegeInfo.phone || "9953155054";
  const cleanPhone = helplinePhone.replace(/\D/g, "");

  return (
    <>
      <Helmet>
        <title>
          {isHindi
            ? "बी.एड. पात्रता मापदंड एवं योग्यता | हरियाणा शक्ति कॉलेज ऑफ एजुकेशन"
            : "B.Ed. Eligibility Criteria & Requirements | Haryana Shakti College of Education"}
        </title>
        <meta
          name="description"
          content={
            isHindi
              ? "हरियाणा शक्ति कॉलेज ऑफ एजुकेशन में 2-वर्षीय बी.एड. पाठ्यक्रम हेतु न्यूनतम योग्यता, अंक प्रतिशत एवं विषय पात्रता नियम।"
              : "Minimum qualifying marks, category-wise percentage criteria, pedagogy combinations, and NCTE norms for B.Ed. admission at HSCE Delhi."
          }
        />
      </Helmet>

      {/* Page Header Banner */}
      <PageHeaderBanner
        title={isHindi ? "बी.एड. पात्रता मापदंड" : "B.Ed. Eligibility Criteria"}
        subtitle={
          isHindi
            ? "राष्ट्रीय अध्यापक शिक्षा परिषद (NCTE) एवं गुरु गोबिंद सिंह इंद्रप्रस्थ विश्वविद्यालय (GGSIPU) द्वारा निर्धारित शैक्षणिक अर्हता एवं न्यूनतम अंक मापदंड।"
            : "Academic session eligibility criteria, category-wise qualifying marks, pedagogy prerequisites, and statutory relaxation guidelines."
        }
        breadcrumbs={[
          { label: isHindi ? "प्रवेश" : "Admissions", href: "/admissions/overview" },
          { label: isHindi ? "पात्रता मापदंड" : "Eligibility Criteria" },
        ]}
      />

      {/* Tabbed Sub-Navigation */}
      <AdmissionSubNav activeTabId="eligibility" />

      {/* Main Content */}
      <section className="py-12 bg-[#F8F9FA]">
        <Container>
          {/* Key Eligibility Highlights Banner */}
          <div className="mb-10 rounded-2xl bg-gradient-to-r from-[#1c3274] to-[#243d8a] text-white p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <span className="inline-block px-3 py-1 rounded-full bg-amber-400 text-[#0c1b33] text-xs font-bold uppercase tracking-wider font-poppins">
                  {isHindi ? "शैक्षणिक सत्र 2026-27" : "Academic Session 2026-27"}
                </span>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-poppins leading-tight text-white">
                  {isHindi
                    ? "एनसीटीई एवं जीजीएसआईपीयू अनुमोदित पात्रता नियम"
                    : "NCTE & GGSIPU Approved Academic Eligibility"}
                </h2>
                <p className="text-white/85 text-xs sm:text-sm font-sans leading-relaxed">
                  {isHindi
                    ? "हरियाणा शक्ति कॉलेज ऑफ एजुकेशन में 2-वर्षीय नियमित बी.एड. पाठ्यक्रम हेतु प्रवेश केवल वे अभ्यर्थी ले सकते हैं जो नीचे दिए गए न्यूनतम अंक एवं शैक्षणिक मापदंड पूर्ण करते हों।"
                    : "Admission to our two-year regular Bachelor of Education (B.Ed.) programme is granted strictly to candidates who satisfy the university and statutory qualifying criteria."}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => openAdmissionModal({ defaultProgramme: "B.Ed. (Bachelor of Education - 2 Years)" })}
                  className="inline-flex items-center gap-2 rounded-xl bg-white text-[#1c3274] px-5 py-3 font-poppins text-xs font-bold shadow-md hover:bg-amber-50 hover:text-[#142657] transition cursor-pointer">
                  <GraduationCap size={16} />
                  <span>{isHindi ? "ऑनलाइन आवेदन करें" : "Apply Online (2026-27)"}</span>
                </button>
                <a
                  href={`tel:${cleanPhone}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-5 py-3 font-poppins text-xs font-semibold text-white hover:bg-white/20 transition">
                  <Phone size={16} />
                  <span>{isHindi ? "पात्रता सहायता डेस्क" : "Eligibility Helpline"}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Table: Category-Wise Criteria */}
          <div className="mb-14 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs">
            <div className="mb-6 pb-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4">
              <div>
                <SectionHeading
                  eyebrow={isHindi ? "न्यूनतम योग्यता" : "Qualifying Criteria"}
                  title={isHindi ? "वर्गवार शैक्षणिक पात्रता एवं न्यूनतम अंक" : "Category-Wise Percentage Requirements"}
                />
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                GGSIPU Norms Compliant
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm font-sans">
                <thead>
                  <tr className="border-b-2 border-gray-200 bg-gray-50 text-gray-700 font-poppins font-bold uppercase text-[11px] sm:text-xs tracking-wider">
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Qualifying Examination</th>
                    <th className="py-3 px-4">Minimum Aggregate Requirement</th>
                    <th className="py-3 px-4">Statutory Norm</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {eligibilityCriteria.map((item, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/40 transition">
                      <td className="py-4 px-4 font-bold text-gray-900 font-poppins whitespace-nowrap">
                        {isHindi ? item.hiCategory : item.category}
                      </td>
                      <td className="py-4 px-4 text-gray-700 leading-relaxed">
                        {isHindi ? item.hiDegree : item.degree}
                      </td>
                      <td className="py-4 px-4 font-semibold text-[#1c3274]">
                        {isHindi ? item.hiRequirement : item.requirement}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold bg-gray-100 text-gray-700">
                          {item.badge}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pedagogy Subjects Prerequisites */}
          <div className="mb-14 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs">
            <div className="mb-6">
              <SectionHeading
                eyebrow={isHindi ? "शिक्षण विषय नियम" : "Pedagogy Rules"}
                title={isHindi ? "शिक्षण पद्धति (Pedagogy) विषयों के चयन नियम" : "Prerequisites for Choosing Pedagogy Subjects"}
              />
              <p className="text-xs sm:text-sm text-gray-600 mt-1 font-sans">
                {isHindi
                  ? "बी.एड. पाठ्यक्रम के दौरान छात्र-अध्यापकों को दो शिक्षण विषय (Teaching Subjects) चुनने होते हैं, जो उनकी स्नातक पढ़ाई पर आधारित होने चाहिए।"
                  : "Pupil-teachers must select two pedagogy school subjects corresponding to the major disciplines studied in their graduation/postgraduation."}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pedagogySubjects.map((ped, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-gray-200 bg-slate-50 p-5 hover:border-[#1c3274]/40 hover:bg-white transition-all shadow-2xs">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen size={16} className="text-[#1c3274]" />
                    <h4 className="font-poppins font-bold text-sm text-gray-900">
                      {isHindi ? ped.hiStream : ped.stream}
                    </h4>
                  </div>
                  <ul className="space-y-1 mb-3 text-xs text-gray-800 font-medium font-poppins">
                    {ped.subjects.map((sub, sIdx) => (
                      <li key={sIdx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1c3274]" />
                        <span>{sub}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-[11px] text-gray-500 leading-relaxed font-sans border-t border-gray-200/60 pt-2.5">
                    {ped.requirement}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Important Regulatory Notes */}
          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-6 sm:p-7 flex flex-col md:flex-row items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
              <AlertCircle size={22} />
            </div>
            <div className="space-y-1 text-xs sm:text-sm text-amber-900">
              <h4 className="font-bold font-poppins text-base text-amber-950">
                {isHindi ? "महत्वपूर्ण नियामक दिशानिर्देश" : "Important Eligibility Guidelines"}
              </h4>
              <ul className="list-disc pl-5 space-y-1 leading-relaxed">
                <li>Candidates appearing in their final year degree examination are eligible to apply, but must present original marksheets and provisional degree at the time of physical reporting.</li>
                <li>Rounding off of marks is strictly not permissible (e.g. 49.9% marks cannot be considered as 50%).</li>
                <li>Degrees obtained through open / distance learning (ODL) must be recognized by UGC-DEB and AIU for equivalence.</li>
                <li>No candidate without a valid university CET/CUET allotment will be admitted to the regular seat quota.</li>
              </ul>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

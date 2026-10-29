import React from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  Phone,
  BookOpen,
} from "lucide-react";
import { CollegiatePageLayout } from "../components/common/CollegiatePageLayout";
import { getAdmissionsSidebarConfig } from "../data/navigationConfig";
import { useLanguage } from "../context/LanguageContext";
import { useAdmissionModal } from "../context/AdmissionModalContext";
import { collegeInfo } from "../data/siteData";

export default function AdmissionEligibilityPage() {
  const { isHindi } = useLanguage();
  const { openAdmissionModal } = useAdmissionModal();
  const sidebarConfig = getAdmissionsSidebarConfig(isHindi);

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
    <CollegiatePageLayout
      bannerTitle={isHindi ? "बी.एड. पात्रता मापदंड" : "B.Ed. Eligibility Criteria"}
      bannerSubtitle={
        isHindi
          ? "राष्ट्रीय अध्यापक शिक्षा परिषद (NCTE) एवं गुरु गोबिंद सिंह इंद्रप्रस्थ विश्वविद्यालय (GGSIPU) द्वारा निर्धारित शैक्षणिक अर्हता एवं न्यूनतम अंक मापदंड।"
          : "Academic session eligibility criteria, category-wise qualifying marks, pedagogy prerequisites, and statutory relaxation guidelines."
      }
      breadcrumbs={[
        { label: isHindi ? "प्रवेश" : "Admissions", href: "/admissions" },
        { label: isHindi ? "पात्रता मापदंड" : "Eligibility Criteria" },
      ]}
      sidebarTitle={sidebarConfig.title}
      sidebarItems={sidebarConfig.items}
      quickActions={sidebarConfig.quickActions}>
      <div className="space-y-8">
        {/* Key Eligibility Callout Banner */}
        <div className="rounded-md border border-gray-200/90 bg-[#2E3A8C] text-white p-6 sm:p-7 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="space-y-2 max-w-2xl">
              <span className="inline-block px-3 py-1 rounded bg-[#F5CB1E] text-slate-900 text-xs font-bold uppercase tracking-wider">
                {isHindi ? "शैक्षणिक सत्र 2026-27" : "Academic Session 2026-27"}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-serif leading-tight">
                {isHindi
                  ? "एनसीटीई एवं जीजीएसआईपीयू अनुमोदित पात्रता नियम"
                  : "NCTE & GGSIPU Approved Academic Eligibility"}
              </h2>
              <p className="text-white/90 text-xs sm:text-sm font-sans leading-relaxed">
                {isHindi
                  ? "हरियाणा शक्ति कॉलेज ऑफ एजुकेशन में 2-वर्षीय नियमित बी.एड. पाठ्यक्रम हेतु प्रवेश केवल वे अभ्यर्थी ले सकते हैं जो नीचे दिए गए न्यूनतम अंक एवं शैक्षणिक मापदंड पूर्ण करते हों।"
                  : "Admission to our two-year regular Bachelor of Education (B.Ed.) programme is granted strictly to candidates who satisfy the university and statutory qualifying criteria."}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => openAdmissionModal({ defaultProgramme: "B.Ed. (Bachelor of Education - 2 Years)" })}
                className="inline-flex items-center gap-2 rounded bg-white text-[#2E3A8C] px-4 py-2.5 text-xs font-bold shadow-xs hover:bg-slate-100 transition cursor-pointer">
                <GraduationCap size={15} />
                <span>{isHindi ? "ऑनलाइन आवेदन" : "Apply Online"}</span>
              </button>
              <a
                href={`tel:${cleanPhone}`}
                className="inline-flex items-center gap-2 rounded border border-white/40 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/20 transition">
                <Phone size={15} />
                <span>{isHindi ? "हेल्पलाइन" : "Helpdesk"}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Category-Wise Criteria Table (Image 3 Style) */}
        <div className="rounded-md border border-gray-200/90 bg-white overflow-hidden shadow-xs">
          <div className="bg-[#E4E7F5] px-6 py-4 border-b border-gray-200/80 flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2E3A8C]">
                {isHindi ? "न्यूनतम योग्यता" : "Qualifying Criteria"}
              </span>
              <h3 className="font-serif text-xl font-bold text-[#1E242C]">
                {isHindi ? "वर्गवार शैक्षणिक पात्रता एवं न्यूनतम अंक" : "Category-Wise Percentage Requirements"}
              </h3>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              GGSIPU Norms Compliant
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm font-sans border-collapse">
              <thead>
                <tr className="bg-[#1F242C] text-white">
                  <th className="py-3.5 px-5 font-bold border-r border-[#333a44]">Category</th>
                  <th className="py-3.5 px-5 font-bold border-r border-[#333a44]">Qualifying Examination</th>
                  <th className="py-3.5 px-5 font-bold border-r border-[#333a44]">Minimum Aggregate</th>
                  <th className="py-3.5 px-5 font-bold">Statutory Norm</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/80">
                {eligibilityCriteria.map((item, idx) => (
                  <tr
                    key={idx}
                    className={`transition-colors hover:bg-blue-50/40 ${
                      idx % 2 === 1 ? "bg-slate-50/70" : "bg-white"
                    }`}>
                    <td className="py-3.5 px-5 font-bold text-slate-900 border-r border-gray-200/80 whitespace-nowrap">
                      {isHindi ? item.hiCategory : item.category}
                    </td>
                    <td className="py-3.5 px-5 text-slate-700 leading-relaxed border-r border-gray-200/80">
                      {isHindi ? item.hiDegree : item.degree}
                    </td>
                    <td className="py-3.5 px-5 font-bold text-[#2E3A8C] border-r border-gray-200/80">
                      {isHindi ? item.hiRequirement : item.requirement}
                    </td>
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700 border border-gray-200">
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
        <div className="rounded-md border border-gray-200/90 bg-white p-6 sm:p-8 shadow-xs">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E3A8C]">
              {isHindi ? "शिक्षण विषय नियम" : "Pedagogy Rules"}
            </span>
            <h3 className="mt-1 font-serif text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {isHindi ? "शिक्षण पद्धति (Pedagogy) विषयों के चयन नियम" : "Prerequisites for Choosing Pedagogy Subjects"}
            </h3>
            <div className="mt-3 h-1 w-20 bg-[#2E3A8C] rounded-full" />
            <p className="text-xs sm:text-sm text-slate-600 mt-2 font-sans">
              {isHindi
                ? "बी.एड. पाठ्यक्रम के दौरान छात्र-अध्यापकों को दो शिक्षण विषय (Teaching Subjects) चुनने होते हैं, जो उनकी स्नातक पढ़ाई पर आधारित होने चाहिए।"
                : "Pupil-teachers must select two pedagogy school subjects corresponding to the major disciplines studied in their graduation/postgraduation."}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pedagogySubjects.map((ped, idx) => (
              <div
                key={idx}
                className="rounded-md border border-gray-200 bg-slate-50/60 p-4 hover:border-[#2E3A8C] hover:bg-white transition-all shadow-2xs">
                <div className="flex items-center gap-2 mb-2.5">
                  <BookOpen size={16} className="text-[#2E3A8C]" />
                  <h4 className="font-serif font-bold text-sm text-slate-900">
                    {isHindi ? ped.hiStream : ped.stream}
                  </h4>
                </div>
                <ul className="space-y-1 mb-2.5 text-xs text-slate-800 font-medium">
                  {ped.subjects.map((sub, sIdx) => (
                    <li key={sIdx} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2E3A8C]" />
                      <span>{sub}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-[11px] text-slate-500 leading-relaxed border-t border-gray-200/80 pt-2 font-sans">
                  {ped.requirement}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Regulatory Guidelines */}
        <div className="rounded-md border border-amber-200 bg-amber-50/70 p-5 flex items-start gap-3.5 shadow-2xs">
          <div className="p-2 rounded bg-amber-100 text-[#2E3A8C] shrink-0 mt-0.5">
            <AlertCircle size={20} />
          </div>
          <div className="space-y-1 text-xs sm:text-sm text-slate-800">
            <h4 className="font-serif font-bold text-sm text-slate-900">
              {isHindi ? "महत्वपूर्ण नियामक दिशानिर्देश" : "Important Eligibility Guidelines"}
            </h4>
            <ul className="list-disc pl-4 space-y-1 text-xs text-slate-700 leading-relaxed">
              <li>Candidates appearing in their final year degree examination are eligible to apply, but must present original marksheets and provisional degree at physical reporting.</li>
              <li>Rounding off of marks is strictly not permissible (e.g. 49.9% marks cannot be considered as 50%).</li>
              <li>Degrees obtained through open / distance learning (ODL) must be recognized by UGC-DEB and AIU for equivalence.</li>
              <li>No candidate without a valid university CET/CUET allotment will be admitted to the regular seat quota.</li>
            </ul>
          </div>
        </div>
      </div>
    </CollegiatePageLayout>
  );
}

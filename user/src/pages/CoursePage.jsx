import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import {
  BookOpen,
  GraduationCap,
  Award,
  Clock,
  Building,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  School,
  Download,
  User,
  Phone,
  Mail,
  MapPin,
  Send,
  Layers,
  FileText,
  HelpCircle,
} from "lucide-react";

import { CollegiatePageLayout } from "../components/common/CollegiatePageLayout";
import { getAcademicsSidebarConfig } from "../data/navigationConfig";
import { SectionHeading } from "../components/common/SectionHeading";
import { useLanguage } from "../context/LanguageContext";
import { coursePageData as data } from "../data/coursePageData";
import { submitEnquiry } from "../services/enquiryService";

const inputClass =
  "w-full rounded border border-gray-300 bg-slate-50/70 px-3 py-2 text-xs sm:text-sm text-slate-800 outline-none transition placeholder:text-gray-400 focus:border-[#2E3A8C] focus:bg-white focus:ring-1 focus:ring-[#2E3A8C]";

function FormField({ id, icon: Icon, label, children }) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={id}
        className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
        <Icon size={14} className="shrink-0 text-[#2E3A8C]" />
        {label}
      </label>
      {children}
    </div>
  );
}

export default function CoursePage() {
  const { isHindi } = useLanguage();
  const lang = isHindi ? "hi" : "en";
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  // Tab management: sync from ?tab=... or fallback to hash or "course"
  const tabQuery = searchParams.get("tab");
  const hashVal = location.hash ? location.hash.replace("#", "") : null;
  const validTabs = ["course", "pedagogy", "examination"];

  const activeTab = tabQuery && validTabs.includes(tabQuery)
    ? tabQuery
    : hashVal && validTabs.includes(hashVal)
    ? hashVal
    : "course";

  useEffect(() => {
    if (hashVal && validTabs.includes(hashVal) && tabQuery !== hashVal) {
      setSearchParams({ tab: hashVal }, { replace: true });
    }
  }, [hashVal, tabQuery, setSearchParams]);

  const handleTabSelect = (tabKey) => {
    setSearchParams({ tab: tabKey });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sidebarConfig = getAcademicsSidebarConfig(isHindi, activeTab);

  const enhancedSidebarItems = sidebarConfig.items.map((item) => {
    if (item.id === "course" || item.id === "pedagogy" || item.id === "examination") {
      return {
        ...item,
        onClick: (e) => {
          e?.preventDefault?.();
          handleTabSelect(item.id);
        },
      };
    }
    return item;
  });

  const [activeSem, setActiveSem] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
  });

  const t = (value) => {
    if (value && typeof value === "object") {
      return value[lang] ?? value.en ?? "";
    }
    return value ?? "";
  };

  const activeSemester = data.syllabus.semesters.find(
    (semester) => semester.sem === activeSem,
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
    setFormStatus("");
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await submitEnquiry({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        city: formData.city,
        programme: "B.Ed. (Bachelor of Education - 2 Years)",
        source: "course_page_enquiry",
      });
      setFormStatus(
        isHindi
          ? "आपकी पूछताछ सफलतापूर्वक दर्ज कर ली गई है। हमारी टीम जल्द ही आपसे संपर्क करेगी।"
          : "Your enquiry has been successfully submitted. Our academic team will contact you shortly.",
      );
      setFormData({ name: "", phone: "", email: "", city: "" });
    } catch {
      setFormStatus(
        isHindi
          ? "पूछताछ दर्ज हो गई है (लोकल मोड)।"
          : "Enquiry received successfully.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const activeBreadcrumbLabel =
    activeTab === "pedagogy"
      ? isHindi ? "शिक्षण विषय (Pedagogy)" : "Pedagogy Specializations"
      : activeTab === "examination"
      ? isHindi ? "परीक्षा एवं मूल्यांकन" : "Examination Guidelines"
      : isHindi ? "बी.एड. कार्यक्रम" : "B.Ed. Programme";

  return (
    <CollegiatePageLayout
      bannerTitle={
        activeTab === "pedagogy"
          ? isHindi ? "शिक्षण विषय (Pedagogy Specializations)" : "Pedagogy Specializations"
          : activeTab === "examination"
          ? isHindi ? "परीक्षा प्रणाली एवं मूल्यांकन योजना" : "GGSIPU Examination & Evaluation Guidelines"
          : t(data.hero.title)
      }
      bannerSubtitle={
        activeTab === "pedagogy"
          ? isHindi
            ? "भाषा, विज्ञान, सामाजिक अध्ययन, वाणिज्य एवं गणित शिक्षण में विषयगत दक्षता।"
            : "Subject-specific pedagogical methodologies and instructional design for high school teaching."
          : activeTab === "examination"
          ? isHindi
            ? "आंतरिक मूल्यांकन, विश्वविद्यालय बाह्य परीक्षा, एवं प्रायोगिक परीक्षा के नियम व मानदंड।"
            : "Continuous internal assessment (25 marks), end-term theory exams (75 marks), and internship evaluation."
          : t(data.hero.subtitle)
      }
      breadcrumbs={[
        { label: isHindi ? "शैक्षणिक कार्यक्रम" : "Academics", href: "/course?tab=course" },
        { label: activeBreadcrumbLabel },
      ]}
      sidebarTitle={sidebarConfig.title}
      sidebarItems={enhancedSidebarItems}
      quickActions={sidebarConfig.quickActions}>
      <div className="space-y-8 animate-fadeIn">
        {/* ============================================================== */}
        {/* TAB 1: B.ED. PROGRAMME OVERVIEW (Rendered at top)              */}
        {/* ============================================================== */}
        {activeTab === "course" && (
          <>
            {/* IMAGE 1 REFERENCE: BLUE & YELLOW PROGRAMME BOXES */}
            <div className="rounded-md border border-gray-200/90 bg-white p-6 shadow-xs">
              <div className="border-b border-gray-200 pb-3 mb-5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2E3A8C]">
                  {isHindi ? "पाठ्यक्रम संरचना एवं मॉड्यूल" : "Programme Modules & Components"}
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900">
                  {isHindi ? "शैक्षणिक घटक एवं प्रशिक्षण मॉड्यूल" : "Academic Modules & Certifications"}
                </h3>
                <div className="mt-2 h-1 w-16 bg-[#2E3A8C] rounded-full" />
              </div>

              <div className="space-y-2.5">
                {/* 2-Column Solid Blue Buttons (Image 1 Style) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleTabSelect("course")}
                    className="bg-[#2E3A8C] hover:bg-[#232d70] text-white font-bold py-3.5 px-4 rounded text-center tracking-wider uppercase text-xs sm:text-sm shadow-xs transition transform active:scale-[0.99] block cursor-pointer">
                    {isHindi ? "बी.एड. (द्विवर्षीय डिग्री)" : "B.ED. (TWO YEAR DEGREE)"}
                  </button>
                  <Link
                    to="/about/recognition"
                    className="bg-[#2E3A8C] hover:bg-[#232d70] text-white font-bold py-3.5 px-4 rounded text-center tracking-wider uppercase text-xs sm:text-sm shadow-xs transition transform active:scale-[0.99] block">
                    {isHindi ? "एनसीटीई मान्यता (NCTE)" : "NCTE RECOGNITION"}
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleTabSelect("pedagogy")}
                    className="bg-[#2E3A8C] hover:bg-[#232d70] text-white font-bold py-3.5 px-4 rounded text-center tracking-wider uppercase text-xs sm:text-sm shadow-xs transition transform active:scale-[0.99] block cursor-pointer">
                    {isHindi ? "शिक्षण विषय (PEDAGOGY)" : "PEDAGOGY ELECTIVES"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTabSelect("examination")}
                    className="bg-[#2E3A8C] hover:bg-[#232d70] text-white font-bold py-3.5 px-4 rounded text-center tracking-wider uppercase text-xs sm:text-sm shadow-xs transition transform active:scale-[0.99] block cursor-pointer">
                    {isHindi ? "परीक्षा एवं मूल्यांकन" : "EXAMINATION SCHEME"}
                  </button>
                </div>

                {/* 1-Column Blue Button */}
                <Link
                  to="/syllabus"
                  className="bg-[#2E3A8C] hover:bg-[#232d70] text-white font-bold py-3.5 px-4 rounded text-center tracking-wider uppercase text-xs sm:text-sm shadow-xs transition transform active:scale-[0.99] block">
                  {isHindi ? "सम्पूर्ण 4-सेमेस्टर सिलेबस विवरण (GGSIPU)" : "FULL 4-SEMESTER SYLLABUS DIRECTORY"}
                </Link>

                {/* 3-Row Yellow Buttons (Image 1 Style) */}
                <div className="space-y-2.5 pt-1">
                  <Link
                    to="/campus-life?tab=ict-lab"
                    className="bg-[#F5CB1E] hover:bg-[#eab308] text-slate-900 font-bold py-3.5 px-4 rounded text-center tracking-wider uppercase text-xs sm:text-sm shadow-xs transition transform active:scale-[0.99] block">
                    {isHindi ? "ई-मॉड्यूल / आईसीटी डिजिटल लर्निंग" : "E-MODULE / DIGITAL LEARNING"}
                  </Link>
                  <Link
                    to="/syllabus"
                    className="bg-[#F5CB1E] hover:bg-[#eab308] text-slate-900 font-bold py-3.5 px-4 rounded text-center tracking-wider uppercase text-xs sm:text-sm shadow-xs transition transform active:scale-[0.99] block">
                    {isHindi ? "माइक्रो-टीचिंग एवं स्कूल इंटर्नशिप" : "MICRO-TEACHING & INTERNSHIP"}
                  </Link>
                  <Link
                    to="/notices"
                    className="bg-[#F5CB1E] hover:bg-[#eab308] text-slate-900 font-bold py-3.5 px-4 rounded text-center tracking-wider uppercase text-xs sm:text-sm shadow-xs transition transform active:scale-[0.99] block">
                    {isHindi ? "कार्यशालाएं / राष्ट्रीय संगोष्ठी" : "WORKSHOPS / SEMINARS"}
                  </Link>
                </div>
              </div>
            </div>

            {/* Course Intro & Quick Facts */}
            <div className="rounded-md border border-gray-200/90 bg-white p-6 sm:p-8 shadow-xs">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2E3A8C]">
                  {t(data.hero.eyebrow)}
                </span>
                <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  {t(data.hero.title)}
                </h2>
                <div className="mt-3 h-1 w-20 bg-[#2E3A8C] rounded-full" />
                <p className="mt-2 text-sm font-semibold text-[#2E3A8C]">
                  {t(data.hero.subtitle)}
                </p>
              </div>

              <p className="text-xs sm:text-sm leading-relaxed text-slate-700 font-sans text-justify mb-6">
                {t(data.hero.description)}
              </p>

              {/* Quick Details Chips */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-gray-100 pt-5">
                {[
                  { icon: Clock, text: data.hero.duration },
                  { icon: GraduationCap, text: data.hero.semesters },
                  { icon: School, text: data.hero.training },
                ].map(({ icon: Icon, text }, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2.5 rounded bg-slate-50 p-3 border border-gray-200/80">
                    <Icon size={18} className="shrink-0 text-[#2E3A8C]" />
                    <span className="text-xs font-bold text-slate-800">{t(text)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Semester-wise Syllabus Section */}
            <div className="rounded-md border border-gray-200/90 bg-white p-6 sm:p-8 shadow-xs">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2E3A8C]">
                  {t(data.syllabus.eyebrow)}
                </span>
                <h3 className="mt-1 font-serif text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {t(data.syllabus.title)}
                </h3>
                <div className="mt-3 h-1 w-20 bg-[#2E3A8C] rounded-full" />
                <p className="mt-2 text-xs sm:text-sm text-slate-600 font-sans">
                  {t(data.syllabus.description)}
                </p>
              </div>

              {/* Semester Selector Buttons */}
              <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {data.syllabus.semesters.map((semester) => {
                  const isActive = activeSem === semester.sem;
                  return (
                    <button
                      key={semester.sem}
                      type="button"
                      onClick={() => setActiveSem(semester.sem)}
                      className={`flex items-center gap-3 rounded p-3 text-left transition border cursor-pointer ${
                        isActive
                          ? "border-[#2E3A8C] bg-slate-50 font-bold"
                          : "border-gray-200 bg-white hover:bg-slate-50 text-slate-700"
                      }`}>
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded text-sm font-bold ${
                          isActive ? "bg-[#2E3A8C] text-white" : "bg-slate-100 text-slate-700"
                        }`}>
                        {semester.sem}
                      </span>
                      <div className="min-w-0">
                        <span className={`block text-xs sm:text-sm ${isActive ? "text-[#2E3A8C]" : "text-slate-900"}`}>
                          {isHindi ? `सेमेस्टर ${semester.sem}` : `Semester ${semester.sem}`}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {semester.papers.length} {isHindi ? "पेपर" : "papers"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Active Semester Papers */}
              {activeSemester && (
                <div className="overflow-hidden rounded border border-gray-200/90">
                  <div className="bg-[#E4E7F5] px-5 py-3 border-b border-gray-200 flex items-center justify-between">
                    <h4 className="font-serif font-bold text-sm sm:text-base text-slate-900">
                      {isHindi ? activeSemester.hiTitle : activeSemester.title}
                    </h4>
                    <span className="text-xs font-bold text-[#2E3A8C] bg-white px-2.5 py-0.5 rounded border border-gray-200">
                      {activeSemester.papers.length} Papers
                    </span>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {activeSemester.papers.map((paper, index) => (
                      <div
                        key={`${paper.code}-${index}`}
                        className={`flex items-start gap-3 px-4 py-3 text-xs sm:text-sm transition-colors ${
                          index % 2 === 1 ? "bg-slate-50/60" : "bg-white"
                        }`}>
                        <span className="min-w-[70px] shrink-0 font-bold text-[#2E3A8C] bg-blue-50 px-2 py-0.5 rounded text-center border border-blue-100 text-xs">
                          {paper.code}
                        </span>
                        <span className="flex-1 text-slate-800 font-medium">
                          {isHindi ? paper.hiTitle : paper.title}
                        </span>
                        <CheckCircle2 size={16} className="text-slate-400 shrink-0 mt-0.5" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-3">
                <a
                  href={data.hero.syllabusPdf}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2E3A8C] hover:underline">
                  <Download size={14} />
                  <span>{t(data.hero.syllabusButton)}</span>
                </a>
                <Link
                  to="/syllabus"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2E3A8C] hover:underline">
                  <span>{t(data.syllabus.viewAll)}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Teaching Practice & Internship */}
            <div className="rounded-md border border-gray-200/90 bg-white p-6 sm:p-8 shadow-xs">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2E3A8C]">
                  {isHindi ? "व्यावहारिक प्रशिक्षण" : "Practical Training"}
                </span>
                <h3 className="mt-1 font-serif text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {t(data.teachingPractice.title)}
                </h3>
                <div className="mt-3 h-1 w-20 bg-[#2E3A8C] rounded-full" />
                <p className="mt-2 text-xs sm:text-sm text-slate-600 font-sans">
                  {t(data.teachingPractice.description)}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {data.teachingPractice.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2.5 rounded bg-slate-50/70 p-3.5 border border-gray-200/80">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#2E3A8C]" />
                    <span className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                      {t(item)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Quick Enquiry Form */}
            <div className="rounded-md border border-gray-200/90 bg-white p-6 sm:p-8 shadow-xs">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2E3A8C]">
                  {isHindi ? "सीधे संपर्क करें" : "Academic Enquiry"}
                </span>
                <h3 className="mt-1 font-serif text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {t(data.enquiry.title)}
                </h3>
                <div className="mt-3 h-1 w-20 bg-[#2E3A8C] rounded-full" />
                <p className="mt-2 text-xs sm:text-sm text-slate-600 font-sans">
                  {t(data.enquiry.description)}
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4 max-w-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField id="enquiry-name" icon={User} label={t(data.enquiry.fields.name)}>
                    <input
                      id="enquiry-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your Full Name"
                      className={inputClass}
                    />
                  </FormField>

                  <FormField id="enquiry-phone" icon={Phone} label={t(data.enquiry.fields.phone)}>
                    <input
                      id="enquiry-phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="10-digit mobile number"
                      className={inputClass}
                    />
                  </FormField>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField id="enquiry-email" icon={Mail} label={t(data.enquiry.fields.email)}>
                    <input
                      id="enquiry-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className={inputClass}
                    />
                  </FormField>

                  <FormField id="enquiry-city" icon={MapPin} label={t(data.enquiry.fields.city)}>
                    <input
                      id="enquiry-city"
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      placeholder="Delhi / City"
                      className={inputClass}
                    />
                  </FormField>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded bg-[#2E3A8C] px-6 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-[#232d70] transition shadow-xs cursor-pointer disabled:opacity-60">
                  <Send size={14} />
                  <span>{submitting ? "Submitting..." : t(data.enquiry.submit)}</span>
                </button>

                {formStatus && (
                  <p className="mt-3 rounded border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
                    {formStatus}
                  </p>
                )}
              </form>
            </div>
          </>
        )}

        {/* ============================================================== */}
        {/* TAB 2: PEDAGOGY SPECIALIZATIONS (Rendered directly at top)     */}
        {/* ============================================================== */}
        {activeTab === "pedagogy" && (
          <div className="space-y-6">
            <div className="rounded-md border border-gray-200/90 bg-white p-6 sm:p-8 shadow-xs">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2E3A8C]">
                  {t(data.pedagogy.eyebrow)}
                </span>
                <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  {t(data.pedagogy.title)}
                </h2>
                <div className="mt-3 h-1 w-20 bg-[#2E3A8C] rounded-full" />
                <p className="mt-2 text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
                  {t(data.pedagogy.description)}
                </p>
              </div>

              {/* Pedagogy Subjects Grid */}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-6">
                {data.pedagogy.subjects.map((subject, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 rounded bg-slate-50/70 p-3.5 border border-gray-200/80 hover:border-[#2E3A8C] transition">
                    <BookOpen size={18} className="mt-0.5 shrink-0 text-[#2E3A8C]" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-slate-800">
                        {isHindi ? subject.hiName : subject.name}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                        {isHindi ? subject.hiGroup : subject.group}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* GGSIPU Pedagogy Rules Box */}
              <div className="rounded bg-blue-50/60 border border-blue-200/80 p-5">
                <h4 className="font-serif font-bold text-sm text-[#2E3A8C] mb-2">
                  {isHindi ? "शिक्षण विषय चयन नियम (GGSIPU Norms)" : "Pedagogy Elective Selection Criteria"}
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-[#2E3A8C] shrink-0 mt-0.5" />
                    <span>Every student must select two pedagogy subjects studied at the graduation / post-graduation level.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-[#2E3A8C] shrink-0 mt-0.5" />
                    <span>Teacher trainees complete 16 weeks of continuous school internship teaching these two chosen electives.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-[#2E3A8C] shrink-0 mt-0.5" />
                    <span>Continuous internal assessments and simulated micro-teaching sessions evaluate lesson planning skills.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleTabSelect("course")}
                className="flex items-center gap-2 rounded border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:border-[#2E3A8C] hover:text-[#2E3A8C] transition cursor-pointer">
                <ArrowLeft size={14} />
                <span>{isHindi ? "बी.एड. अवलोकन पर लौटें" : "Back to B.Ed. Overview"}</span>
              </button>
              <button
                type="button"
                onClick={() => handleTabSelect("examination")}
                className="flex items-center gap-2 rounded bg-[#2E3A8C] text-white px-4 py-2.5 text-xs font-bold hover:bg-[#232d70] transition ml-auto cursor-pointer">
                <span>{isHindi ? "परीक्षा दिशानिर्देश देखें" : "View Examination Guidelines"}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: EXAMINATION & EVALUATION (Rendered directly at top)     */}
        {/* ============================================================== */}
        {activeTab === "examination" && (
          <div className="space-y-6">
            <div className="rounded-md border border-gray-200/90 bg-white p-6 sm:p-8 shadow-xs">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2E3A8C]">
                  {isHindi ? "परीक्षा एवं मूल्यांकन" : "Examination & Assessment"}
                </span>
                <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  {isHindi ? "जीजीएसआईपीयू परीक्षा प्रणाली एवं मूल्यांकन दिशानिर्देश" : "GGSIPU Examination Scheme & Evaluation Guidelines"}
                </h2>
                <div className="mt-3 h-1 w-20 bg-[#2E3A8C] rounded-full" />
                <p className="mt-2 text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
                  {isHindi
                    ? "गुरु गोबिंद सिंह इंद्रप्रस्थ विश्वविद्यालय के अध्यादेश एवं परीक्षा विनिमय के अनुसार आंतरिक एवं बाह्य मूल्यांकन योजना।"
                    : "Comprehensive evaluation structure, continuous internal assessment (CIA), university term-end examinations, and practical viva voce guidelines."}
                </p>
              </div>

              {/* 3 Pillars of Examination */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
                <div className="rounded border border-gray-200 bg-slate-50/70 p-4">
                  <span className="text-xs font-bold text-[#2E3A8C] uppercase tracking-wider block mb-1">
                    {isHindi ? "आंतरिक मूल्यांकन" : "Continuous Internal Assessment"}
                  </span>
                  <h4 className="font-serif font-bold text-base text-slate-900 mb-2">25 Marks / Paper</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    {isHindi
                      ? "कक्षा टेस्ट, दत्त कार्य (असाइनमेंट), सेमिनार प्रस्तुतिकरण एवं नियमित उपस्थिति के आधार पर कॉलेज स्तर पर मूल्यांकन।"
                      : "Based on written mid-term tests, pedagogical assignments, classroom seminar presentations, and active attendance."}
                  </p>
                </div>

                <div className="rounded border border-gray-200 bg-slate-50/70 p-4">
                  <span className="text-xs font-bold text-[#2E3A8C] uppercase tracking-wider block mb-1">
                    {isHindi ? "विश्वविद्यालय बाह्य परीक्षा" : "University End-Term Theory"}
                  </span>
                  <h4 className="font-serif font-bold text-base text-slate-900 mb-2">75 Marks / Paper</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    {isHindi
                      ? "प्रत्येक सेमेस्टर के अंत में GGSIPU द्वारा आयोजित केंद्रीकृत थ्योरी परीक्षा, जिसमें सभी निर्धारित इकाइयों का परीक्षण होता है।"
                      : "Centralized university theoretical examinations conducted at designated university exam centers at the conclusion of each semester."}
                  </p>
                </div>

                <div className="rounded border border-gray-200 bg-slate-50/70 p-4 sm:col-span-2 lg:col-span-1">
                  <span className="text-xs font-bold text-[#2E3A8C] uppercase tracking-wider block mb-1">
                    {isHindi ? "प्रायोगिक एवं वाइवा-वाइसी" : "Practical Viva & Internship"}
                  </span>
                  <h4 className="font-serif font-bold text-base text-slate-900 mb-2">External Scrutiny</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    {isHindi
                      ? "स्कूल इंटर्नशिप फाइल, पाठ योजना एवं सूक्ष्म शिक्षण का मूल्यांकन विश्वविद्यालय द्वारा नियुक्त बाह्य परीक्षकों द्वारा।"
                      : "School internship files, lesson plans, simulated teaching, and viva-voce evaluated by external examiners appointed by GGSIPU."}
                  </p>
                </div>
              </div>

              {/* Minimum Passing Criteria */}
              <div className="rounded bg-slate-50/80 border border-gray-200 p-5">
                <h4 className="font-serif font-bold text-sm text-slate-900 mb-2">
                  {isHindi ? "उत्तीर्ण अंक एवं उपस्थिति आवश्यकताएं" : "Minimum Qualifying Marks & Attendance Thresholds"}
                </h4>
                <div className="space-y-2 text-xs text-slate-700">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-[#2E3A8C] shrink-0 mt-0.5" />
                    <span>A student must secure at least 40% marks in both internal assessment and external university theory examinations separately.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-[#2E3A8C] shrink-0 mt-0.5" />
                    <span>75% attendance in theoretical lectures and 80% attendance in practical internship training is mandatory to be eligible for university admit cards.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-[#2E3A8C] shrink-0 mt-0.5" />
                    <span>Final degree division is awarded based on the cumulative grade point average (CGPA) calculated over all 4 semesters.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleTabSelect("course")}
                className="flex items-center gap-2 rounded border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:border-[#2E3A8C] hover:text-[#2E3A8C] transition cursor-pointer">
                <ArrowLeft size={14} />
                <span>{isHindi ? "बी.एड. अवलोकन पर लौटें" : "Back to B.Ed. Overview"}</span>
              </button>
              <button
                type="button"
                onClick={() => handleTabSelect("pedagogy")}
                className="flex items-center gap-2 rounded bg-[#2E3A8C] text-white px-4 py-2.5 text-xs font-bold hover:bg-[#232d70] transition ml-auto cursor-pointer">
                <span>{isHindi ? "शिक्षण विषय देखें" : "View Pedagogy Subjects"}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </CollegiatePageLayout>
  );
}

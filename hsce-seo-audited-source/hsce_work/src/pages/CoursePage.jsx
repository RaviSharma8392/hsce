import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  BookOpen,
  GraduationCap,
  Award,
  Clock,
  Building,
  CheckCircle2,
  ArrowRight,
  School,
  Download,
  User,
  Phone,
  Mail,
  MapPin,
  Send,
} from "lucide-react";

import { Container } from "../components/common/Container";
import { SectionHeading } from "../components/common/SectionHeading";
import { PageNavigationLinks } from "../components/common/PageNavigationLinks";
import { useLanguage } from "../context/LanguageContext";
import { coursePageData as data } from "../data/coursePageData";

const factIcons = {
  clock: Clock,
  graduation: GraduationCap,
  building: Building,
  award: Award,
};

const inputClass =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#363991] focus:ring-2 focus:ring-[#363991]/10";

function FormField({ id, icon: Icon, label, children }) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={id}
        className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700">
        <Icon size={15} className="shrink-0 text-gray-500" />
        {label}
      </label>
      {children}
    </div>
  );
}

export default function CoursePage() {
  const { isHindi } = useLanguage();
  const lang = isHindi ? "hi" : "en";

  const [activeSem, setActiveSem] = useState(1);
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

  const handleFormSubmit = (event) => {
    event.preventDefault();

    // Connect Firebase, an API or your enquiry service here.
    // This form currently validates input but does not save submissions.
    setFormStatus(t(data.enquiry.demoMessage));
  };

  return (
    <>
      <Helmet>
        <title>{t(data.seo.title)}</title>
        <meta name="description" content={t(data.seo.description)} />
      </Helmet>

      {/* PAGE INTRODUCTION */}
      <section className="border-b border-gray-200 bg-white">
        <Container className="py-8 sm:py-10 lg:py-12">
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_350px] xl:grid-cols-[minmax(0,1fr)_380px]">
            {/* COURSE INTRO */}
            <div className="min-w-0">
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#363991]">
                <span className="h-1 w-8 rounded-full bg-[#FBDD23]" />
                {t(data.hero.eyebrow)}
              </div>

              <h1 className="max-w-3xl text-2xl font-bold leading-tight text-gray-900 sm:text-3xl lg:text-4xl">
                {t(data.hero.title)}
              </h1>

              <p className="mt-3 text-base font-semibold text-[#363991]">
                {t(data.hero.subtitle)}
              </p>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
                {t(data.hero.description)}
              </p>

              {/* ACTION BUTTONS */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href={data.hero.syllabusPdf}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#363991] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#292C75]">
                  <Download size={17} />
                  {t(data.hero.syllabusButton)}
                </a>

                <Link
                  to={data.hero.admissionPath}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-[#363991] hover:text-[#363991]">
                  <BookOpen size={17} />
                  {t(data.hero.admissionButton)}
                </Link>
              </div>

              {/* QUICK DETAILS */}
              <div className="mt-7 grid gap-3 border-t border-gray-200 pt-5 sm:grid-cols-3">
                {[
                  {
                    icon: Clock,
                    text: data.hero.duration,
                  },
                  {
                    icon: GraduationCap,
                    text: data.hero.semesters,
                  },
                  {
                    icon: School,
                    text: data.hero.training,
                  },
                ].map(({ icon: Icon, text }, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm text-gray-600">
                    <Icon size={17} className="shrink-0 text-[#363991]" />
                    <span>{t(text)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ENQUIRY FORM */}
            <aside
              id="course-enquiry"
              className="scroll-mt-24 overflow-hidden rounded-lg border border-gray-200 bg-white">
              <div className="border-b border-gray-200 bg-gray-50 px-5 py-4 sm:px-6">
                <div className="mb-2 h-1 w-10 rounded-full bg-[#FBDD23]" />

                <h2 className="text-xl font-bold text-gray-900">
                  {t(data.enquiry.title)}
                </h2>

                <p className="mt-1 text-sm leading-6 text-gray-600">
                  {t(data.enquiry.description)}
                </p>
              </div>

              <form
                onSubmit={handleFormSubmit}
                className="space-y-4 p-5 sm:p-6">
                <FormField
                  id="enquiry-name"
                  icon={User}
                  label={t(data.enquiry.fields.name)}>
                  <input
                    id="enquiry-name"
                    type="text"
                    name="name"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    minLength={2}
                    maxLength={100}
                    placeholder={t(data.enquiry.fields.name.placeholder)}
                    className={inputClass}
                  />
                </FormField>

                <FormField
                  id="enquiry-phone"
                  icon={Phone}
                  label={t(data.enquiry.fields.phone)}>
                  <input
                    id="enquiry-phone"
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    inputMode="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    pattern="[0-9+\-() ]{10,16}"
                    title={
                      isHindi
                        ? "कृपया सही मोबाइल नंबर दर्ज करें।"
                        : "Enter a valid phone number."
                    }
                    placeholder={t(data.enquiry.fields.phone.placeholder)}
                    className={inputClass}
                  />
                </FormField>

                <FormField
                  id="enquiry-email"
                  icon={Mail}
                  label={t(data.enquiry.fields.email)}>
                  <input
                    id="enquiry-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    maxLength={150}
                    placeholder={t(data.enquiry.fields.email.placeholder)}
                    className={inputClass}
                  />
                </FormField>

                <FormField
                  id="enquiry-city"
                  icon={MapPin}
                  label={t(data.enquiry.fields.city)}>
                  <input
                    id="enquiry-city"
                    type="text"
                    name="city"
                    autoComplete="address-level2"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    maxLength={100}
                    placeholder={t(data.enquiry.fields.city.placeholder)}
                    className={inputClass}
                  />
                </FormField>

                <button
                  type="submit"
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-[#363991] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#292C75] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#363991] focus-visible:ring-offset-2">
                  {t(data.enquiry.submit)}
                  <Send size={16} />
                </button>

                {formStatus && (
                  <p
                    role="status"
                    className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-gray-700">
                    {formStatus}
                  </p>
                )}

                <p className="text-xs leading-5 text-gray-500">
                  {t(data.enquiry.privacy)}
                </p>
              </form>
            </aside>
          </div>
        </Container>
      </section>

      {/* COURSE DETAILS */}
      <section className="bg-[#F7F8FA] py-8 sm:py-10">
        <Container>
          {/* BASIC INFORMATION */}
          <div className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {data.facts.map((fact) => {
              const Icon = factIcons[fact.icon] || BookOpen;

              return (
                <div
                  key={fact.label.en}
                  className="flex items-center gap-3 rounded-md border border-gray-200 bg-white p-4 transition-colors hover:border-[#363991]/40">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#F0F1FA] text-[#363991]">
                    <Icon size={21} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">{t(fact.label)}</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {t(fact.value)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* COURSE OVERVIEW */}
          <div className="mb-10 grid gap-5 lg:grid-cols-2">
            <div className="rounded-md border border-gray-200 bg-white p-5 sm:p-7">
              <SectionHeading
                eyebrow={t(data.overview.eyebrow)}
                title={t(data.overview.title)}
              />

              <div className="mt-4 space-y-3 text-sm leading-7 text-gray-600">
                {data.overview.paragraphs.map((paragraph, index) => (
                  <p key={index}>{t(paragraph)}</p>
                ))}
              </div>
            </div>

            {/* TEACHING PRACTICE */}
            <div className="rounded-md border border-gray-200 bg-white p-5 sm:p-7">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#F0F1FA] text-[#363991]">
                  <School size={21} />
                </div>

                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-gray-900">
                    {t(data.teachingPractice.title)}
                  </h2>

                  <p className="mt-2 text-sm leading-7 text-gray-600">
                    {t(data.teachingPractice.description)}
                  </p>
                </div>
              </div>

              <ul className="mt-5 space-y-3 border-t border-gray-100 pt-4">
                {data.teachingPractice.items.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm leading-6 text-gray-700">
                    <CheckCircle2
                      size={17}
                      className="mt-0.5 shrink-0 text-[#363991]"
                    />
                    <span>{t(item)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* SEMESTER-WISE SYLLABUS */}
          <section
            id="syllabus"
            className="mb-10 scroll-mt-24 overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="border-b border-gray-200 px-5 py-5 sm:px-7">
              <div className="mb-2 h-1 w-12 rounded-full bg-[#FBDD23]" />

              <SectionHeading
                eyebrow={t(data.syllabus.eyebrow)}
                title={t(data.syllabus.title)}
              />

              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">
                {t(data.syllabus.description)}
              </p>
            </div>

            <div className="p-5 sm:p-7">
              {/* SEMESTER SELECTOR */}
              <div
                className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4"
                aria-label={isHindi ? "सेमेस्टर चुनें" : "Select semester"}>
                {data.syllabus.semesters.map((semester) => {
                  const isActive = activeSem === semester.sem;

                  return (
                    <button
                      key={semester.sem}
                      type="button"
                      onClick={() => setActiveSem(semester.sem)}
                      aria-pressed={isActive}
                      className={`flex min-h-[76px] items-center gap-3 rounded-md border p-3 text-left transition-colors ${
                        isActive
                          ? "border-[#363991] bg-[#F0F1FA]"
                          : "border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50"
                      }`}>
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-base font-bold ${
                          isActive
                            ? "bg-[#363991] text-white"
                            : "bg-gray-100 text-gray-700"
                        }`}>
                        {semester.sem}
                      </span>

                      <span className="min-w-0">
                        <span
                          className={`block text-sm font-semibold ${
                            isActive ? "text-[#363991]" : "text-gray-800"
                          }`}>
                          {isHindi
                            ? `सेमेस्टर ${semester.sem}`
                            : `Semester ${semester.sem}`}
                        </span>

                        <span className="mt-1 block text-xs text-gray-500">
                          {semester.papers.length} {isHindi ? "पेपर" : "papers"}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* SELECTED SEMESTER PAPERS */}
              {activeSemester && (
                <div className="overflow-hidden rounded-md border border-gray-200">
                  <div className="border-b border-gray-200 bg-gray-50 px-4 py-4 sm:px-5">
                    <h3 className="text-base font-bold leading-6 text-[#363991] sm:text-lg">
                      {isHindi ? activeSemester.hiTitle : activeSemester.title}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {activeSemester.papers.length}{" "}
                      {isHindi ? "पाठ्यक्रम पेपर" : "course papers"}
                    </p>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {activeSemester.papers.map((paper, index) => (
                      <div
                        key={`${paper.code}-${index}`}
                        className="flex items-start gap-3 px-4 py-4 transition-colors hover:bg-gray-50 sm:gap-4 sm:px-5">
                        <span className="flex min-h-9 min-w-[82px] shrink-0 items-center justify-center rounded border border-gray-200 bg-white px-2 py-1 text-center text-xs font-bold text-[#363991]">
                          {paper.code}
                        </span>

                        <p className="min-w-0 flex-1 text-sm font-medium leading-6 text-gray-800">
                          {isHindi ? paper.hiTitle : paper.title}
                        </p>

                        <CheckCircle2
                          size={17}
                          className="mt-1 shrink-0 text-gray-400"
                          aria-hidden="true"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FULL SYLLABUS LINK */}
              <div className="mt-6 flex flex-col gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm leading-6 text-gray-600">
                  {isHindi
                    ? "विस्तृत पाठ्यक्रम और अन्य जानकारी के लिए पूरा सिलेबस देखें।"
                    : "For the complete syllabus and additional details, visit the syllabus page."}
                </p>

                <Link
                  to={data.syllabus.path}
                  className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-[#363991] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#292C75] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#363991] focus-visible:ring-offset-2">
                  <BookOpen size={16} />
                  {t(data.syllabus.viewAll)}
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </section>

          {/* PEDAGOGY SUBJECTS */}
          <section className="mb-10 rounded-lg border border-gray-200 bg-white p-5 sm:p-7">
            <div className="mb-2 h-1 w-12 rounded-full bg-[#FBDD23]" />

            <SectionHeading
              eyebrow={t(data.pedagogy.eyebrow)}
              title={t(data.pedagogy.title)}
            />

            <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-600">
              {t(data.pedagogy.description)}
            </p>

            <div className="mt-5 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
              {data.pedagogy.subjects.map((subject) => (
                <div
                  key={subject.name}
                  className="flex items-start gap-3 border-b border-gray-100 py-3">
                  <BookOpen
                    size={17}
                    className="mt-1 shrink-0 text-[#363991]"
                  />

                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-6 text-gray-800">
                      {isHindi ? subject.hiName : subject.name}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {isHindi ? subject.hiGroup : subject.group}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ADMISSION CTA */}
          <section className="mb-10 flex flex-col gap-4 rounded-md border border-gray-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-gray-900">
                {t(data.admissionCta.title)}
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                {t(data.admissionCta.description)}
              </p>
            </div>

            <Link
              to={data.admissionCta.path}
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-[#363991] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#292C75]">
              {t(data.admissionCta.button)}
              <ArrowRight size={16} />
            </Link>
          </section>
        </Container>
      </section>
    </>
  );
}

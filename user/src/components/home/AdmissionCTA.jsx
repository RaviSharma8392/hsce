import {
  ArrowRight,
  GraduationCap,
  MapPin,
  Phone,
  BookOpen,
  Mail,
  Sparkles,
} from "lucide-react";

import { Link } from "react-router-dom";
import { collegeInfo } from "../../data/collegeDetailsData";
import { useAdmissionModal } from "../../context/AdmissionModalContext";
import { admissionModalData } from "../../data/admissionModalData";
import { useLanguage } from "../../context/LanguageContext";
import { Container } from "../common/Container";

export function AdmissionCTA() {
  const { isHindi } = useLanguage();
  const { openAdmissionModal } = useAdmissionModal();

  const admissionPhone =
    collegeInfo.phone || admissionModalData.helplinePhoneFallback;

  return (
    <section
      style={{ backgroundColor: "#0a4b8c" }}
      className="relative isolate w-full overflow-hidden bg-gradient-to-br from-[#0a4b8c] via-[#094179] to-[#062c55] py-14 sm:py-16 lg:py-20 font-sans text-white border-y border-blue-900/50">
      {/* Decorative wave background synced with CampusLifeSection */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg
          className="absolute -bottom-20 -left-24 h-[650px] w-[850px] max-w-none opacity-20 sm:-left-10 lg:-bottom-32 lg:left-[5%] lg:h-[850px] lg:w-[1000px]"
          viewBox="0 0 800 800"
          fill="none">
          {Array.from({ length: 32 }).map((_, i) => (
            <path
              key={i}
              d={`M ${40 + i * 8} 820 C ${
                100 + i * 12
              } ${560 - i * 5}, ${320 + i * 8} ${
                260 - i * 7
              }, ${800} ${80 + i * 12}`}
              stroke="white"
              strokeWidth="1.2"
              strokeOpacity={0.3 + (i % 4) * 0.1}
            />
          ))}
        </svg>

        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/15 sm:h-[450px] sm:w-[450px]" />
        <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full border border-white/15 sm:h-[350px] sm:w-[350px]" />

        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-[#052243]/50" />

        <span
          className="pointer-events-none absolute bottom-6 right-8 hidden text-[110px] font-bold leading-none text-white/[0.05] lg:block xl:right-12 xl:text-[150px]">
          APPLY
        </span>
      </div>

      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          {/* LEFT CONTENT */}
          <div className="flex flex-col justify-center lg:col-span-7">
            {/* EYEBROW */}
            <div className="mb-6 flex items-center gap-3">
              <span className="h-0.5 w-8 bg-[#FBDD23]" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#FBDD23]">
                {isHindi ? "प्रवेश आमंत्रण" : "Your Teaching Journey Starts Here"}
              </span>
            </div>

            {/* HEADING */}
            <h2 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[42px]">
              {isHindi ? (
                <>
                  शिक्षा के क्षेत्र में अपने{" "}
                  <span className="font-bold text-[#FBDD23]">भविष्य को संवारें</span>
                </>
              ) : (
                <>
                  Explore Your Future in{" "}
                  <span className="font-bold text-[#FBDD23]">Education</span>
                </>
              )}
            </h2>

            {/* DESCRIPTION */}
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-blue-50/90 sm:text-lg sm:leading-8 font-normal">
              {isHindi
                ? "हमारे दो वर्षीय नियमित बी.एड. कार्यक्रम के साथ शिक्षक बनने की दिशा में कदम बढ़ाएं। पाठ्यक्रम, पात्रता, प्रवेश प्रक्रिया और काउंसलिंग की संपूर्ण जानकारी के लिए हमारी टीम से संपर्क करें।"
                : "Discover our two-year regular B.Ed. programme and take the next step towards a career in teaching. Connect with our team to learn about the course, eligibility criteria, admission process, and other important details."}
            </p>

            {/* BENEFIT HIGHLIGHTS (100% BILINGUAL) */}
            <div className="mt-7 flex flex-wrap items-center gap-6 text-sm font-medium text-white">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-[#FBDD23]">
                  <Sparkles size={15} />
                </span>
                {isHindi ? "व्यावसायिक शिक्षक शिक्षा" : "Teacher Education (B.Ed.)"}
              </div>

              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-[#FBDD23]">
                  <BookOpen size={15} />
                </span>
                {isHindi ? "दो वर्षीय नियमित बी.एड." : "Two-Year Regular Programme"}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => openAdmissionModal()}
                className="group inline-flex h-12 items-center justify-center gap-2.5 rounded-lg bg-[#FBDD23] px-8 text-sm font-bold text-gray-900 shadow-md transition-all duration-200 hover:bg-[#ffe338] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBDD23] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a4b8c]">
                <span>
                  {isHindi ? "प्रवेश संबंधी पूछताछ करें" : "Enquire About Admission"}
                </span>
                <ArrowRight
                  size={16}
                  strokeWidth={2.2}
                  className="transition-transform duration-200 group-hover:translate-x-1 text-gray-900"
                />
              </button>

              <Link
                to="/course/bed"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/25 bg-white/5 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                {isHindi ? "पाठ्यक्रम विवरण देखें" : "Explore B.Ed. Course"}
              </Link>
            </div>
          </div>

          {/* RIGHT CONTACT CARDS */}
          <div className="flex flex-col gap-4 lg:col-span-5">
            {/* CAMPUS CARD */}
            <div className="group flex items-start gap-4 rounded-2xl bg-white p-5 sm:p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-transparent hover:border-[#FBDD23]/60">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0a4b8c]/10 text-[#0a4b8c] transition-colors duration-300 group-hover:bg-[#0a4b8c] group-hover:text-[#FBDD23]">
                <MapPin size={22} strokeWidth={2.2} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#626262]">
                  {isHindi ? "हमारे परिसर में आएं" : "Visit Our Campus"}
                </p>
                <p className="mt-1 text-sm font-semibold leading-snug text-[#252525] transition-colors group-hover:text-[#0a4b8c]">
                  {collegeInfo.address || "Contact us for campus address"}
                </p>

                <div className="mt-3 h-0.5 w-6 rounded-full bg-[#FBDD23] transition-all duration-300 group-hover:w-12" />
              </div>
            </div>

            {/* PHONE CARD */}
            <div className="group flex items-start gap-4 rounded-2xl bg-white p-5 sm:p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-transparent hover:border-[#FBDD23]/60">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0a4b8c]/10 text-[#0a4b8c] transition-colors duration-300 group-hover:bg-[#0a4b8c] group-hover:text-[#FBDD23]">
                <Phone size={22} strokeWidth={2.2} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#626262]">
                  {isHindi ? "प्रवेश हेल्पलाइन" : "Admissions Helpline"}
                </p>

                <a
                  href={`tel:${String(
                    collegeInfo.phone ||
                      admissionModalData.helplinePhoneFallback,
                  ).replace(/[^\d+]/g, "")}`}
                  className="mt-1 block text-sm font-bold text-[#0a4b8c] hover:underline">
                  {collegeInfo.phone ||
                    admissionModalData.helplinePhoneFallback}
                </a>

                <a
                  href="tel:8056777077"
                  className="mt-0.5 block text-sm font-bold text-[#0a4b8c] hover:underline">
                  8056777077
                </a>

                <div className="mt-3 h-0.5 w-6 rounded-full bg-[#FBDD23] transition-all duration-300 group-hover:w-12" />
              </div>
            </div>

            {/* EMAIL CARD */}
            <div className="group flex items-start gap-4 rounded-2xl bg-white p-5 sm:p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-transparent hover:border-[#FBDD23]/60">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0a4b8c]/10 text-[#0a4b8c] transition-colors duration-300 group-hover:bg-[#0a4b8c] group-hover:text-[#FBDD23]">
                <Mail size={22} strokeWidth={2.2} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#626262]">
                  {isHindi ? "सामान्य पूछताछ" : "General Enquiries"}
                </p>

                {collegeInfo.email ? (
                  <a
                    href={`mailto:${collegeInfo.email}`}
                    className="mt-1 block truncate text-sm font-bold text-[#0a4b8c] hover:underline">
                    {collegeInfo.email}
                  </a>
                ) : (
                  <p className="mt-1 text-sm font-semibold text-[#252525]">
                    Contact us for details
                  </p>
                )}

                <div className="mt-3 h-0.5 w-6 rounded-full bg-[#FBDD23] transition-all duration-300 group-hover:w-12" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

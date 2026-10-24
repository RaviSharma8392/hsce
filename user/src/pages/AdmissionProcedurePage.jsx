import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  ListOrdered,
  CheckCircle2,
  Calendar,
  Building,
  Phone,
  ArrowRight,
  ShieldCheck,
  FileText,
  MapPin,
  Clock,
  Sparkles,
} from "lucide-react";
import { Container } from "../components/common/Container";
import { SectionHeading } from "../components/common/SectionHeading";
import { PageHeaderBanner } from "../components/common/PageHeaderBanner";
import { AdmissionSubNav } from "../components/admissions/AdmissionSubNav";
import { useLanguage } from "../context/LanguageContext";
import { useAdmissionModal } from "../context/AdmissionModalContext";
import { collegeInfo } from "../data/siteData";

export default function AdmissionProcedurePage() {
  const { isHindi } = useLanguage();
  const { openAdmissionModal } = useAdmissionModal();

  const steps = [
    {
      step: "01",
      title: "GGSIPU Registration & CET / Merit",
      hiTitle: "विश्वविद्यालय पंजीकरण एवं सीईटी",
      desc: "Register online on the GGSIPU centralized admission portal (ipu.ac.in) for B.Ed. counselling. Complete the basic application form, upload mandatory qualifying documents, and pay the non-refundable university counselling fee.",
      hiDesc: "गुरु गोबिंद सिंह इंद्रप्रस्थ विश्वविद्यालय (ipu.ac.in) के पोर्टल पर बी.एड. प्रवेश काउंसलिंग हेतु ऑनलाइन पंजीकरण करें। आवश्यक विवरण भरें एवं काउंसलिंग शुल्क जमा करें।",
      highlight: "Online via ipu.ac.in",
    },
    {
      step: "02",
      title: "Choice Filling & College Preference",
      hiTitle: "कॉलेज चयन एवं वरीयता भरना",
      desc: "During the designated university choice-filling window, log into your applicant dashboard and lock Haryana Shakti College of Education (HSCE), Kanjhawala as your top priority preference institution for seat allotment.",
      hiDesc: "विश्वविद्यालय द्वारा घोषित चॉइस फिलिंग राउंड में हरियाणा शक्ति कॉलेज ऑफ एजुकेशन (HSCE) को अपनी प्रथम वरीयता संस्था के रूप में चुनें एवं लॉक करें।",
      highlight: "Select HSCE Kanjhawala",
    },
    {
      step: "03",
      title: "Seat Allotment & Provisional Letter",
      hiTitle: "सीट आवंटन एवं अनंतिम पत्र",
      desc: "Check centralized seat allotment results published on the GGSIPU portal. Download your provisional admission allotment letter and pay the initial part-academic fee online to freeze/confirm your allotted seat.",
      hiDesc: "विश्वविद्यालय पोर्टल पर राउंडवार सीट आवंटन परिणाम देखें। अनंतिम आवंटन पत्र डाउनलोड करें एवं पार्ट-अकादमिक शुल्क जमा कर अपनी सीट सुरक्षित करें।",
      highlight: "Download Allotment Slip",
    },
    {
      step: "04",
      title: "Physical Reporting & Final Verification",
      hiTitle: "कॉलेज में व्यक्तिगत उपस्थिति एवं सत्यापन",
      desc: "Report in person at Haryana Shakti College of Education campus in Kanjhawala with original marksheets, category certificates, medical fitness certificate, and photocopies. Complete biometric/document verification and orientation.",
      hiDesc: "सभी मूल शैक्षणिक प्रमाण पत्रों, जाति/श्रेणी प्रमाण पत्र, मेडिकल सर्टिफिकेट एवं फोटो प्रतियों के साथ हरियाणा शक्ति कॉलेज परिसर में व्यक्तिगत रूप से उपस्थित होकर प्रवेश प्रक्रिया पूर्ण करें।",
      highlight: "At HSCE Campus Kanjhawala",
    },
  ];

  const collegeDetails = [
    { label: "Institution Name", value: "Haryana Shakti College of Education (HSCE)" },
    { label: "Affiliating University", value: "Guru Gobind Singh Indraprastha University (GGSIPU), Delhi" },
    { label: "Regulatory Approval", value: "National Council for Teacher Education (NCTE) & NAAC Accredited" },
    { label: "Programme Offered", value: "Bachelor of Education (B.Ed.) — 2 Years Regular" },
    { label: "Annual Approved Intake", value: "100 Seats (Co-Educational)" },
    { label: "Campus Address", value: "Kanjhawala, Delhi – 110081" },
  ];

  const helplinePhone = collegeInfo.phone || "9953155054";
  const cleanPhone = helplinePhone.replace(/\D/g, "");

  return (
    <>
      <Helmet>
        <title>
          {isHindi
            ? "बी.एड. प्रवेश प्रक्रिया एवं चरणबद्ध गाइड | हरियाणा शक्ति कॉलेज ऑफ एजुकेशन"
            : "B.Ed. Admission Procedure & Steps | Haryana Shakti College of Education"}
        </title>
        <meta
          name="description"
          content={
            isHindi
              ? "हरियाणा शक्ति कॉलेज ऑफ एजुकेशन में बी.एड. प्रवेश की संपूर्ण 4-चरणीय प्रक्रिया: काउंसलिंग, चॉइस फिलिंग, सीट आवंटन एवं भौतिक सत्यापन।"
              : "Step-by-step admission procedure for B.Ed. 2026-27 at Haryana Shakti College of Education: GGSIPU counseling, choice filling, allotment, and physical reporting."
          }
        />
      </Helmet>

      {/* Page Header Banner */}
      <PageHeaderBanner
        title={isHindi ? "बी.एड. प्रवेश प्रक्रिया" : "B.Ed. Admission Procedure"}
        subtitle={
          isHindi
            ? "विश्वविद्यालय काउंसलिंग पंजीकरण से लेकर कॉलेज में अंतिम रिपोर्टिंग तक की संपूर्ण 4-चरणीय प्रक्रिया।"
            : "A complete step-by-step roadmap from centralized GGSIPU counseling registration to final physical reporting at HSCE."
        }
        breadcrumbs={[
          { label: isHindi ? "प्रवेश" : "Admissions", href: "/admissions/overview" },
          { label: isHindi ? "प्रवेश प्रक्रिया" : "Admission Procedure" },
        ]}
      />

      {/* Tabbed Sub-Navigation */}
      <AdmissionSubNav activeTabId="procedure" />

      {/* Main Content */}
      <section className="py-12 bg-[#F8F9FA]">
        <Container>
          {/* Top Banner Notice Card */}
          <div className="mb-10 rounded-2xl bg-gradient-to-r from-[#1c3274] to-[#243d8a] text-white p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <span className="inline-block px-3 py-1 rounded-full bg-amber-400 text-[#0c1b33] text-xs font-bold uppercase tracking-wider font-poppins">
                  {isHindi ? "प्रवेश सत्र 2026-27" : "Session 2026-27 Procedure"}
                </span>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-poppins leading-tight text-white">
                  {isHindi
                    ? "केंद्रीकृत काउंसलिंग एवं कॉलेज आवंटन प्रक्रिया"
                    : "Centralized Counselling & College Allotment Workflow"}
                </h2>
                <p className="text-white/85 text-xs sm:text-sm font-sans leading-relaxed">
                  {isHindi
                    ? "हरियाणा शक्ति कॉलेज ऑफ एजुकेशन में 2-वर्षीय नियमित बी.एड. प्रवेश एनसीटीई एवं जीजीएसआईपीयू नियमानुसार आयोजित किए जाते हैं।"
                    : "Follow the 4 essential phases below to secure admission in our B.Ed. programme with official university seat allotment."}
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
                <Link
                  to="/book-a-tour"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-5 py-3 font-poppins text-xs font-semibold text-white hover:bg-white/20 transition">
                  <Building size={16} />
                  <span>{isHindi ? "कैंपस विजिट बुक करें" : "Book Campus Visit"}</span>
                </Link>
              </div>
            </div>
          </div>

          {/* 4-Step Process Grid */}
          <div className="mb-14">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <SectionHeading
                eyebrow={isHindi ? "चरणबद्ध प्रक्रिया" : "Step-By-Step Journey"}
                title={isHindi ? "प्रवेश प्रक्रिया के मुख्य चरण" : "The 4-Step Admission Roadmap"}
                align="center"
              />
              <p className="text-xs sm:text-sm text-gray-600 mt-2 font-sans">
                {isHindi
                  ? "काउंसलिंग पंजीकरण से लेकर अंतिम कॉलेज रिपोर्टिंग तक का संपूर्ण विवरण।"
                  : "Everything you need to do at each milestone of the counseling and enrollment cycle."}
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((st, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs hover:border-[#1c3274]/50 hover:shadow-md transition-all flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl font-black font-poppins text-[#1c3274]/30 group-hover:text-[#1c3274] transition-colors">
                        {st.step}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#1c3274]">
                        {st.highlight}
                      </span>
                    </div>
                    <h3 className="font-poppins font-bold text-gray-900 text-base mb-2 group-hover:text-[#1c3274] transition-colors leading-snug">
                      {isHindi ? st.hiTitle : st.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed font-sans">
                      {isHindi ? st.hiDesc : st.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Institutional Information & Choice-Filling Card */}
          <div className="mb-14 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs">
            <div className="mb-6 pb-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4">
              <div>
                <SectionHeading
                  eyebrow={isHindi ? "कॉलेज विवरण" : "Choice Filling Details"}
                  title={isHindi ? "चॉइस फिलिंग हेतु कॉलेज पहचान विवरण" : "Information Required for Choice Filling"}
                />
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-[#1c3274] border border-blue-200">
                Put HSCE as #1 Preference
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {collegeDetails.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="block text-[11px] font-medium text-gray-500 uppercase font-poppins">
                    {item.label}
                  </span>
                  <span className="block text-xs sm:text-sm font-bold text-gray-900 mt-1 font-sans">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Direct Assistance CTA */}
          <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/70 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#1c3274] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Phone size={22} />
              </div>
              <div>
                <h4 className="font-poppins font-bold text-base sm:text-lg text-[#1c3274]">
                  {isHindi ? "काउंसलिंग सहायता एवं प्रत्यक्ष मार्गदर्शन" : "Need Counseling Guidance or Assistance?"}
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 font-sans mt-0.5">
                  {isHindi
                    ? "सीट आवंटन, चॉइस फिलिंग या कॉलेज रिपोर्टिंग संबंधी किसी भी सहायता के लिए संपर्क करें।"
                    : "Our admission desk provides 1-on-1 counseling assistance to candidates throughout the admission cycle."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href={`tel:${cleanPhone}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1c3274] text-white text-xs font-bold font-poppins hover:bg-[#15275a] transition shadow-xs">
                <Phone size={14} />
                <span>+91 {helplinePhone}</span>
              </a>
              <Link
                to="/admissions/documents"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-800 text-xs font-bold font-poppins hover:border-[#1c3274] hover:text-[#1c3274] transition">
                <span>{isHindi ? "दस्तावेज सूची देखें" : "View Documents"}</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

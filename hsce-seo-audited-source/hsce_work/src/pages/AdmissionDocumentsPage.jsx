import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  FolderCheck,
  FileCheck,
  Phone,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Info,
  Clock,
  MapPin,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Container } from "../components/common/Container";
import { SectionHeading } from "../components/common/SectionHeading";
import { PageHeaderBanner } from "../components/common/PageHeaderBanner";
import { AdmissionSubNav } from "../components/admissions/AdmissionSubNav";
import { useLanguage } from "../context/LanguageContext";
import { useAdmissionModal } from "../context/AdmissionModalContext";
import { collegeInfo } from "../data/siteData";

export default function AdmissionDocumentsPage() {
  const { isHindi } = useLanguage();
  const { openAdmissionModal } = useAdmissionModal();

  const [activeCategory, setActiveCategory] = useState("all");

  const documentCategories = [
    { id: "all", label: "All Documents", hiLabel: "सभी दस्तावेज" },
    { id: "academic", label: "Academic Qualifications", hiLabel: "शैक्षणिक प्रमाण पत्र" },
    { id: "allotment", label: "University Allotment", hiLabel: "विश्वविद्यालय आवंटन" },
    { id: "conduct", label: "Conduct & Medical", hiLabel: "चरित्र एवं स्वास्थ्य" },
    { id: "identity", label: "Identity & Category", hiLabel: "पहचान एवं आरक्षण" },
  ];

  const documentsList = [
    {
      id: "allotment_slip",
      category: "allotment",
      number: "01",
      title: "GGSIPU Seat Allotment Letter & Fee Deposit Slip",
      hiTitle: "जीजीएसआईपीयू सीट आवंटन पत्र एवं शुल्क रसीद",
      copies: "Original + 2 Photocopies",
      mandatory: true,
      description: "Official provisional seat allotment letter downloaded from university portal (ipu.ac.in) along with the proof of initial part-academic fee deposit slip.",
      hiDescription: "विश्वविद्यालय पोर्टल (ipu.ac.in) से डाउनलोड किया गया अनंतिम सीट आवंटन पत्र एवं पार्ट-अकादमिक शुल्क जमा की आधिकारिक रसीद।",
    },
    {
      id: "class_10",
      category: "academic",
      number: "02",
      title: "10th (Secondary) Marksheet & Passing Certificate",
      hiTitle: "10वीं कक्षा की अंकतालिका एवं उत्तीर्ण प्रमाण पत्र",
      copies: "Original + 2 Self-Attested Photocopies",
      mandatory: true,
      description: "Recognized Board 10th marksheet and passing certificate (mandatory primary proof of Date of Birth and parentage).",
      hiDescription: "मान्यता प्राप्त बोर्ड की 10वीं की मूल अंकतालिका एवं जन्म तिथि प्रमाण हेतु उत्तीर्ण प्रमाण पत्र।",
    },
    {
      id: "class_12",
      category: "academic",
      number: "03",
      title: "12th (Senior Secondary) Marksheet & Passing Certificate",
      hiTitle: "12वीं कक्षा की अंकतालिका एवं उत्तीर्ण प्रमाण पत्र",
      copies: "Original + 2 Self-Attested Photocopies",
      mandatory: true,
      description: "Marksheet and passing certificate from CBSE, ICSE, NIOS, or recognized State Education Board.",
      hiDescription: "सीबीएसई, आईसीएसई अथवा मान्यता प्राप्त राज्य बोर्ड से 12वीं कक्षा की मूल अंकतालिका एवं प्रमाण पत्र।",
    },
    {
      id: "ug_degree",
      category: "academic",
      number: "04",
      title: "Graduation (All Years / Semesters) Marksheets & Degree",
      hiTitle: "स्नातक के सभी वर्षों/सेमेस्टर की अंकतालिकाएं एवं डिग्री",
      copies: "Original + 2 Self-Attested Photocopies",
      mandatory: true,
      description: "Semester-wise or consolidated marksheets of Bachelor's degree (B.A., B.Sc., B.Com., B.Tech, etc.) along with original degree or provisional passing certificate.",
      hiDescription: "स्नातक डिग्री के सभी सेमेस्टरों की अंकतालिकाएं एवं मूल डिग्री अथवा विश्वविद्यालय द्वारा जारी अनंतिम (Provisional) प्रमाण पत्र।",
    },
    {
      id: "pg_degree",
      category: "academic",
      number: "05",
      title: "Postgraduate Marksheets & Degree (If Basis of Admission)",
      hiTitle: "स्नातकोत्तर अंकतालिका एवं डिग्री (यदि लागू हो)",
      copies: "Original + 2 Self-Attested Photocopies",
      mandatory: false,
      description: "Required only if candidate is applying under Postgraduate eligibility (e.g., minimum 50% in Master's degree).",
      hiDescription: "यदि प्रवेश पात्रता स्नातकोत्तर (पीजी) अंकों के आधार पर ली जा रही है तभी यह दस्तावेज अनिवार्य है।",
    },
    {
      id: "character_cert",
      category: "conduct",
      number: "06",
      title: "Character Certificate from Institution Last Attended",
      hiTitle: "अंतिम संस्थान से मूल चरित्र प्रमाण पत्र",
      copies: "Original + 1 Photocopy",
      mandatory: true,
      description: "Original character certificate issued and stamped by the Head / Principal of the school or college last attended, not older than 6 months.",
      hiDescription: "अंतिम अध्ययनरत स्कूल/कॉलेज के प्राचार्य द्वारा जारी मूल चरित्र प्रमाण पत्र (प्रवेश तिथि से 6 माह से पुराना न हो)।",
    },
    {
      id: "migration_cert",
      category: "conduct",
      number: "07",
      title: "Migration Certificate",
      hiTitle: "मूल माइग्रेशन प्रमाण पत्र",
      copies: "Original",
      mandatory: true,
      description: "Original migration certificate issued by university/board other than GGSIPU. (Students already graduated from GGSIPU are exempted).",
      hiDescription: "जीजीएसआईपीयू के अलावा अन्य विश्वविद्यालयों से आने वाले विद्यार्थियों हेतु मूल माइग्रेशन प्रमाण पत्र (आईपीयू के पूर्व छात्रों को छूट)।",
    },
    {
      id: "medical_cert",
      category: "conduct",
      number: "08",
      title: "Medical Fitness Certificate",
      hiTitle: "चिकित्सा स्वास्थ्य प्रमाण पत्र (GGSIPU प्रारूप)",
      copies: "Original (Prescribed University Format)",
      mandatory: true,
      description: "Certificate in prescribed GGSIPU appendix format, signed and officially stamped by a registered MBBS government / private medical practitioner.",
      hiDescription: "विश्वविद्यालय द्वारा निर्धारित प्रारूप में पंजीकृत एमबीबीएस डॉक्टर द्वारा हस्ताक्षरित एवं मुहरबंद स्वास्थ्य प्रमाण पत्र।",
    },
    {
      id: "identity_proof",
      category: "identity",
      number: "09",
      title: "Aadhaar Card / Government Photo ID Proof",
      hiTitle: "आधार कार्ड / सरकारी फोटो पहचान पत्र",
      copies: "Original + 2 Photocopies",
      mandatory: true,
      description: "Valid Government of India identity proof (Aadhaar Card, Voter ID, or Passport) for physical reporting identity verification.",
      hiDescription: "सत्यापन एवं बायोमेट्रिक पहचान हेतु उम्मीदवार का वैध आधार कार्ड अथवा अन्य सरकारी पहचान पत्र।",
    },
    {
      id: "category_cert",
      category: "identity",
      number: "10",
      title: "Category / Caste Certificate (SC / ST / OBC / EWS / PwD)",
      hiTitle: "आरक्षित श्रेणी / जाति प्रमाण पत्र (यदि लागू हो)",
      copies: "Original + 2 Photocopies",
      mandatory: false,
      description: "Certificate issued by competent revenue authority in candidate's name. OBC certificates must have valid current Non-Creamy Layer (NCL) certificate as per Delhi NCT norms.",
      hiDescription: "सक्षम राजस्व प्राधिकारी द्वारा अभ्यर्थी के नाम जारी वैध जाति प्रमाण पत्र (ओबीसी हेतु चालू वित्तीय वर्ष का नॉन-क्रीमी लेयर प्रमाण पत्र)।",
    },
    {
      id: "photographs",
      category: "identity",
      number: "11",
      title: "Recent Passport Size Colored Photographs",
      hiTitle: "हालिया पासपोर्ट आकार के रंगीन फोटो",
      copies: "6 to 8 Identical Copies",
      mandatory: true,
      description: "Recent color photographs with candidate's face clearly visible against a plain light/white background.",
      hiDescription: "हल्के सफेद बैकग्राउंड में उम्मीदवार की हालिया समान 6 से 8 रंगीन पासपोर्ट साइज फोटो।",
    },
    {
      id: "undertakings",
      category: "conduct",
      number: "12",
      title: "Anti-Ragging Undertakings & Student Self-Declaration",
      hiTitle: "रैगिंग विरोधी शपथ पत्र (छात्र एवं अभिभावक)",
      copies: "Signed Printouts",
      mandatory: true,
      description: "Mandatory UGC anti-ragging undertakings filled online at antiragging.in, downloaded and signed by candidate and parent/guardian.",
      hiDescription: "यूजीसी एवं विश्वविद्यालय नियमानुसार ऑनलाइन पोर्टल (antiragging.in) से भरा गया एवं हस्ताक्षरित एंटी-रैगिंग अंडरटेकिंग।",
    },
  ];

  const filteredDocs =
    activeCategory === "all"
      ? documentsList
      : documentsList.filter((doc) => doc.category === activeCategory);

  const helplinePhone = collegeInfo.phone || "9953155054";
  const cleanPhone = helplinePhone.replace(/\D/g, "");

  return (
    <>
      <Helmet>
        <title>
          {isHindi
            ? "बी.एड. प्रवेश हेतु आवश्यक दस्तावेज सूची | हरियाणा शक्ति कॉलेज ऑफ एजुकेशन"
            : "Required Documents for B.Ed. Admission | Haryana Shakti College of Education"}
        </title>
        <meta
          name="description"
          content={
            isHindi
              ? "हरियाणा शक्ति कॉलेज ऑफ एजुकेशन में बी.एड. प्रवेश के समय सत्यापन हेतु आवश्यक मूल प्रमाण पत्रों एवं फोटो प्रतियों की संपूर्ण सूची।"
              : "Complete checklist of mandatory documents, marksheets, certificates, migration and medical fitness required for B.Ed. physical reporting at HSCE Delhi."
          }
        />
      </Helmet>

      {/* Page Header Banner */}
      <PageHeaderBanner
        title={isHindi ? "प्रवेश हेतु आवश्यक दस्तावेज" : "Required Documents for Admission"}
        subtitle={
          isHindi
            ? "हरियाणा शक्ति कॉलेज में भौतिक उपस्थिति एवं प्रवेश सत्यापन हेतु आवश्यक मूल प्रमाण पत्रों एवं सत्यापित प्रतियों की संपूर्ण आधिकारिक सूची।"
            : "Official document verification directory, self-attestation standards, and photocopy sets required during campus physical reporting."
        }
        breadcrumbs={[
          { label: isHindi ? "प्रवेश" : "Admissions", href: "/admissions/overview" },
          { label: isHindi ? "आवश्यक दस्तावेज" : "Required Documents" },
        ]}
      />

      {/* Tabbed Sub-Navigation */}
      <AdmissionSubNav activeTabId="documents" />

      {/* Main Content */}
      <section className="py-12 bg-[#F8F9FA]">
        <Container>
          {/* Official Verification Header Card */}
          <div className="mb-10 rounded-2xl bg-gradient-to-r from-[#1c3274] to-[#243d8a] text-white p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <span className="inline-block px-3 py-1 rounded-full bg-amber-400 text-[#0c1b33] text-xs font-bold uppercase tracking-wider font-poppins">
                  {isHindi ? "दस्तावेज सत्यापन सत्र 2026-27" : "Session 2026-27 Verification Guidelines"}
                </span>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-poppins leading-tight text-white">
                  {isHindi
                    ? "भौतिक सत्यापन हेतु दस्तावेज दिशानिर्देश"
                    : "Original Documents & Photocopy Guidelines"}
                </h2>
                <p className="text-white/85 text-xs sm:text-sm font-sans leading-relaxed">
                  {isHindi
                    ? "सभी आवंटित अभ्यर्थियों को परामर्श दिया जाता है कि वे सभी मूल दस्तावेजों के साथ 2 सेट स्व-सत्यापित फोटोकॉपी अनिवार्य रूप से लाएं।"
                    : "Candidates allotted seats must present all certificates in original for physical inspection at the college counter, along with 2 complete sets of self-attested photocopies."}
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
                  to="/contact/enquiry"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-5 py-3 font-poppins text-xs font-semibold text-white hover:bg-white/20 transition">
                  <Sparkles size={16} className="text-amber-300" />
                  <span>{isHindi ? "प्रवेश पूछताछ भेजें" : "Send Admission Enquiry"}</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Category Filter Pills (Simple & Clean) */}
          <div className="mb-8 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {documentCategories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-poppins font-semibold transition whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-[#1c3274] text-white shadow-xs"
                      : "bg-white text-gray-700 border border-gray-200 hover:border-[#1c3274] hover:text-[#1c3274]"
                  }`}>
                  {isHindi ? cat.hiLabel : cat.label}
                </button>
              );
            })}
          </div>

          {/* Simple, Professional Document Directory */}
          <div className="mb-12 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs">
            <div className="mb-6 pb-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4">
              <div>
                <SectionHeading
                  eyebrow={isHindi ? "आवश्यक दस्तावेज सूची" : "Official Verification List"}
                  title={isHindi ? "भौतिक सत्यापन हेतु प्रमाण पत्रों का विवरण" : "Required Certificates & Marksheets"}
                />
              </div>
              <span className="text-xs font-medium text-gray-600 bg-gray-100 px-3.5 py-1.5 rounded-full">
                Bring Original + 2 Self-Attested Sets
              </span>
            </div>

            <div className="divide-y divide-gray-100">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="py-4.5 sm:py-5 flex flex-col sm:flex-row sm:items-start gap-4 transition hover:bg-slate-50/70 p-3 rounded-xl -mx-3">
                  {/* Number Badge */}
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1c3274] font-poppins font-bold text-sm flex items-center justify-center shrink-0 border border-blue-100/80">
                    {doc.number}
                  </div>

                  {/* Document Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2.5 mb-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-poppins font-bold text-sm sm:text-base text-gray-900">
                          {isHindi ? doc.hiTitle : doc.title}
                        </h4>
                        {doc.mandatory ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 border border-red-200">
                            {isHindi ? "अनिवार्य" : "Mandatory"}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                            {isHindi ? "यदि लागू हो" : "If Applicable"}
                          </span>
                        )}
                      </div>

                      <span className="text-[11px] font-semibold text-[#1c3274] bg-blue-50 px-3 py-1 rounded-full border border-blue-100 shrink-0">
                        {doc.copies}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-600 font-sans leading-relaxed">
                      {isHindi ? doc.hiDescription : doc.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submission Instructions & Counter Guidelines */}
          <div className="grid gap-6 md:grid-cols-2 mb-10">
            <div className="p-6 sm:p-7 rounded-2xl bg-white border border-gray-200 shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-blue-50 text-[#1c3274]">
                  <FileCheck size={22} />
                </div>
                <h4 className="font-poppins font-bold text-base sm:text-lg text-gray-900">
                  {isHindi ? "स्व-सत्यापन एवं प्रति जमा नियम" : "Self-Attestation & Photocopy Rules"}
                </h4>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-gray-600 font-sans leading-relaxed list-disc pl-5">
                <li>Every photocopy must be clearly self-attested with the candidate&apos;s signature and date.</li>
                <li>Original certificates will be inspected by the admissions scrutiny officer and returned immediately on the spot, except the Migration Certificate which is retained for university registration.</li>
                <li>Ensure applicant name, father&apos;s name, and date of birth match exactly across 10th marksheet and qualifying graduation degree.</li>
              </ul>
            </div>

            <div className="p-6 sm:p-7 rounded-2xl bg-white border border-gray-200 shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
                  <ShieldCheck size={22} />
                </div>
                <h4 className="font-poppins font-bold text-base sm:text-lg text-gray-900">
                  {isHindi ? "सत्यापन केंद्र एवं समय सारिणी" : "Verification Timings & Desk Location"}
                </h4>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-gray-600 font-sans leading-relaxed list-disc pl-5">
                <li><strong>Venue:</strong> Administrative Verification Hall, Haryana Shakti College of Education, Kanjhawala, Delhi – 110081.</li>
                <li><strong>Desk Hours:</strong> 10:00 AM – 04:00 PM on all university-notified reporting days.</li>
                <li><strong>Admissions Helpline:</strong> +91 {helplinePhone} for direct document assistance.</li>
              </ul>
            </div>
          </div>

          {/* Bottom Helpline Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/70 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#1c3274] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Phone size={22} />
              </div>
              <div>
                <h4 className="font-poppins font-bold text-base sm:text-lg text-[#1c3274]">
                  {isHindi ? "दस्तावेज संबंधी कोई प्रश्न?" : "Have Questions About Your Documents?"}
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 font-sans mt-0.5">
                  {isHindi
                    ? "हमारे प्रवेश परामर्श विभाग से सीधे संपर्क करें अथवा कॉलेज परिसर में पधारें।"
                    : "Call our document verification helpline directly to clarify any equivalence or reservation requirements."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href={`tel:${cleanPhone}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1c3274] text-white text-xs font-bold font-poppins hover:bg-[#15275a] transition shadow-xs">
                <Phone size={14} />
                <span>Call +91 {helplinePhone}</span>
              </a>
              <Link
                to="/contact/enquiry"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-800 text-xs font-bold font-poppins hover:border-[#1c3274] hover:text-[#1c3274] transition">
                <span>{isHindi ? "पूछताछ भेजें" : "Submit Enquiry"}</span>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

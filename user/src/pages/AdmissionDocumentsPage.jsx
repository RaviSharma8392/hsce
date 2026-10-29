import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  FolderCheck,
  FileCheck,
  Phone,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { CollegiatePageLayout } from "../components/common/CollegiatePageLayout";
import { getAdmissionsSidebarConfig } from "../data/navigationConfig";
import { useLanguage } from "../context/LanguageContext";
import { useAdmissionModal } from "../context/AdmissionModalContext";
import { collegeInfo } from "../data/siteData";

export default function AdmissionDocumentsPage() {
  const { isHindi } = useLanguage();
  const { openAdmissionModal } = useAdmissionModal();
  const sidebarConfig = getAdmissionsSidebarConfig(isHindi);

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
      description: "Official provisional seat allotment letter downloaded from university portal (ipu.ac.in) along with proof of initial part-academic fee deposit slip.",
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
      title: "12th (Senior Secondary) Marksheet & Certificate",
      hiTitle: "12वीं कक्षा की अंकतालिका एवं प्रमाण पत्र",
      copies: "Original + 2 Self-Attested Photocopies",
      mandatory: true,
      description: "10+2 marksheet and passing certificate from CBSE or equivalent recognized state/central school board.",
      hiDescription: "सीबीएसई अथवा मान्यता प्राप्त राज्य/केंद्रीय बोर्ड से 12वीं कक्षा की मूल अंकतालिका एवं प्रमाण पत्र।",
    },
    {
      id: "graduation",
      category: "academic",
      number: "04",
      title: "Graduation Degree & Year-wise Marksheets",
      hiTitle: "स्नातक डिग्री एवं सभी वर्षों/सेमेस्टर की अंकतालिकाएं",
      copies: "Original + 2 Self-Attested Photocopies",
      mandatory: true,
      description: "Marksheets of all semesters/years and provisional degree or convocation degree of the qualifying bachelor's examination.",
      hiDescription: "योग्यता स्नातक परीक्षा के सभी सेमेस्टरों/वर्षों की अंकतालिकाएं एवं अनंतिम अथवा मूल डिग्री।",
    },
    {
      id: "post_graduation",
      category: "academic",
      number: "05",
      title: "Postgraduate Degree Marksheets (If Applicable)",
      hiTitle: "स्नातकोत्तर डिग्री एवं अंकतालिकाएं (यदि लागू हो)",
      copies: "Original + 2 Self-Attested Photocopies",
      mandatory: false,
      description: "Required for candidates applying on basis of PG degree qualification or seeking pedagogy subject mapping.",
      hiDescription: "उन अभ्यर्थियों हेतु आवश्यक जो स्नातकोत्तर योग्यता के आधार पर आवेदन कर रहे हैं।",
    },
    {
      id: "character_cert",
      category: "conduct",
      number: "06",
      title: "Character Certificate (Recent)",
      hiTitle: "चरित्र प्रमाण पत्र (नवीनतम)",
      copies: "Original + 1 Photocopy",
      mandatory: true,
      description: "Issued by head of institution last attended (valid within 6 months) or by a designated Gazetted Officer.",
      hiDescription: "अंतिम अध्ययनरत संस्थान के प्रमुख द्वारा 6 माह के भीतर जारी अथवा राजपत्रित अधिकारी द्वारा प्रमाणित।",
    },
    {
      id: "medical_cert",
      category: "conduct",
      number: "07",
      title: "Medical Fitness Certificate",
      hiTitle: "चिकित्सा स्वास्थ्य प्रमाण पत्र",
      copies: "Original (in GGSIPU Appendix Format)",
      mandatory: true,
      description: "Signed and stamped by registered medical practitioner (MBBS) in the standard GGSIPU format.",
      hiDescription: "जीजीएसआईपीयू विवरणिका प्रारूप में पंजीकृत एमबीबीएस चिकित्सक द्वारा हस्ताक्षरित एवं प्रमाणित।",
    },
    {
      id: "category_cert",
      category: "identity",
      number: "08",
      title: "Reserved Category Certificate (SC/ST/OBC/EWS/PwD)",
      hiTitle: "आरक्षित वर्ग प्रमाण पत्र (SC/ST/OBC/EWS/PwD)",
      copies: "Original + 2 Self-Attested Photocopies",
      mandatory: false,
      description: "Issued in candidate's name by competent authority (OBC certificates must be current financial year non-creamy layer).",
      hiDescription: "सक्षम प्राधिकारी द्वारा अभ्यर्थी के नाम जारी वैध प्रमाण पत्र (ओबीसी हेतु चालू वित्तीय वर्ष का नॉन-क्रीमी लेयर)।",
    },
    {
      id: "photos",
      category: "identity",
      number: "09",
      title: "Passport Size Photographs (6 Copies)",
      hiTitle: "पासपोर्ट आकार की नवीनतम रंगीन फोटो (6 प्रतियां)",
      copies: "6 Identical Colour Photographs",
      mandatory: true,
      description: "Recent color photographs with white background (identical to photograph uploaded in GGSIPU registration).",
      hiDescription: "सफेद पृष्ठभूमि वाली हाल ही की रंगीन फोटो (जो विश्वविद्यालय आवेदन में उपयोग की गई हो)।",
    },
  ];

  const helplinePhone = collegeInfo.phone || "9953155054";
  const cleanPhone = helplinePhone.replace(/\D/g, "");

  const filteredDocs =
    activeCategory === "all"
      ? documentsList
      : documentsList.filter((doc) => doc.category === activeCategory);

  return (
    <CollegiatePageLayout
      bannerTitle={isHindi ? "बी.एड. आवश्यक दस्तावेज" : "B.Ed. Required Documents"}
      bannerSubtitle={
        isHindi
          ? "जीजीएसआईपीयू काउंसलिंग एवं हरियाणा शक्ति कॉलेज ऑफ एजुकेशन में भौतिक सत्यापन हेतु आवश्यक प्रमाण पत्रों की चेकलिस्ट।"
          : "Comprehensive verification checklist of certificates, academic transcripts, and forms required for admission reporting."
      }
      breadcrumbs={[
        { label: isHindi ? "प्रवेश" : "Admissions", href: "/admissions" },
        { label: isHindi ? "आवश्यक दस्तावेज" : "Required Documents" },
      ]}
      sidebarTitle={sidebarConfig.title}
      sidebarItems={sidebarConfig.items}
      quickActions={sidebarConfig.quickActions}>
      <div className="space-y-8">
        {/* Verification Overview Banner */}
        <div className="rounded-md border border-gray-200/90 bg-[#2E3A8C] text-white p-6 sm:p-7 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="space-y-2 max-w-2xl">
              <span className="inline-block px-3 py-1 rounded bg-[#F5CB1E] text-slate-900 text-xs font-bold uppercase tracking-wider">
                {isHindi ? "दस्तावेज सत्यापन सत्र 2026-27" : "Session 2026-27 Verification Guidelines"}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-serif leading-tight">
                {isHindi
                  ? "भौतिक सत्यापन हेतु दस्तावेज दिशानिर्देश"
                  : "Original Documents & Photocopy Guidelines"}
              </h2>
              <p className="text-white/90 text-xs sm:text-sm font-sans leading-relaxed">
                {isHindi
                  ? "सभी आवंटित अभ्यर्थियों को परामर्श दिया जाता है कि वे सभी मूल दस्तावेजों के साथ 2 सेट स्व-सत्यापित फोटोकॉपी अनिवार्य रूप से लाएं।"
                  : "Candidates allotted seats must present all certificates in original for inspection at the college desk, along with 2 complete sets of self-attested photocopies."}
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

        {/* Category Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {documentCategories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded text-xs font-bold font-sans transition whitespace-nowrap cursor-pointer border ${
                  isActive
                    ? "bg-[#2E3A8C] text-white border-[#2E3A8C] shadow-xs"
                    : "bg-white text-slate-700 border-gray-200 hover:border-[#2E3A8C] hover:text-[#2E3A8C]"
                }`}>
                {isHindi ? cat.hiLabel : cat.label}
              </button>
            );
          })}
        </div>

        {/* Document Directory Card */}
        <div className="rounded-md border border-gray-200/90 bg-white p-6 sm:p-8 shadow-xs">
          <div className="border-b border-gray-200 pb-4 mb-6 flex items-center justify-between flex-wrap gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2E3A8C]">
                {isHindi ? "आवश्यक दस्तावेज सूची" : "Official Verification List"}
              </span>
              <h3 className="mt-1 font-serif text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {isHindi ? "भौतिक सत्यापन हेतु प्रमाण पत्रों का विवरण" : "Required Certificates & Marksheets"}
              </h3>
              <div className="mt-3 h-1 w-20 bg-[#2E3A8C] rounded-full" />
            </div>
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded border border-gray-200">
              Bring Original + 2 Self-Attested Sets
            </span>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="py-4 sm:py-5 flex flex-col sm:flex-row sm:items-start gap-4 transition hover:bg-slate-50/70 p-3 rounded -mx-3">
                <div className="w-9 h-9 rounded bg-blue-50 text-[#2E3A8C] font-serif font-bold text-sm flex items-center justify-center shrink-0 border border-blue-100">
                  {doc.number}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-serif font-bold text-sm sm:text-base text-slate-900">
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

                    <span className="text-[11px] font-semibold text-[#2E3A8C] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100 shrink-0">
                      {doc.copies}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
                    {isHindi ? doc.hiDescription : doc.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions & Guidelines */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="p-6 rounded-md bg-white border border-gray-200/90 shadow-xs">
            <div className="flex items-center gap-2.5 mb-3.5 pb-2 border-b border-gray-100">
              <FileCheck size={20} className="text-[#2E3A8C]" />
              <h4 className="font-serif font-bold text-base text-slate-900">
                {isHindi ? "स्व-सत्यापन नियम" : "Self-Attestation Rules"}
              </h4>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 font-sans leading-relaxed list-disc pl-5">
              <li>Every photocopy must be clearly self-attested with the candidate&apos;s signature and date.</li>
              <li>Original certificates will be inspected and returned immediately on the spot, except Migration Certificate which is retained for university enrollment.</li>
              <li>Ensure name, father&apos;s name, and date of birth match exactly across 10th certificate and qualifying degree.</li>
            </ul>
          </div>

          <div className="p-6 rounded-md bg-white border border-gray-200/90 shadow-xs">
            <div className="flex items-center gap-2.5 mb-3.5 pb-2 border-b border-gray-100">
              <ShieldCheck size={20} className="text-[#2E3A8C]" />
              <h4 className="font-serif font-bold text-base text-slate-900">
                {isHindi ? "सत्यापन केंद्र एवं समय" : "Verification Timings"}
              </h4>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 font-sans leading-relaxed list-disc pl-5">
              <li><strong>Venue:</strong> Administrative Verification Hall, HSCE Campus, Kanjhawala, Delhi – 110081.</li>
              <li><strong>Desk Hours:</strong> 10:00 AM – 04:00 PM on all university-notified reporting days.</li>
              <li><strong>Direct Help:</strong> Call +91 {helplinePhone} for instant document clarification.</li>
            </ul>
          </div>
        </div>
      </div>
    </CollegiatePageLayout>
  );
}

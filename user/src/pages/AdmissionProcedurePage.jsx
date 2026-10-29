import React from "react";
import { Link } from "react-router-dom";
import {
  ListOrdered,
  CheckCircle2,
  Phone,
  ArrowRight,
  ExternalLink,
  Building2,
  FolderCheck,
} from "lucide-react";
import { CollegiatePageLayout } from "../components/common/CollegiatePageLayout";
import { getAdmissionsSidebarConfig } from "../data/navigationConfig";
import { useLanguage } from "../context/LanguageContext";
import { collegeInfo } from "../data/siteData";

export default function AdmissionProcedurePage() {
  const { isHindi } = useLanguage();
  const sidebarConfig = getAdmissionsSidebarConfig(isHindi);

  const helplinePhone = collegeInfo.phone || "9953155054";
  const cleanPhone = helplinePhone.replace(/\D/g, "");

  const steps = [
    {
      step: "01",
      title: "GGSIPU Online Registration & Entrance",
      hiTitle: "विश्वविद्यालय ऑनलाइन पंजीकरण एवं प्रवेश परीक्षा",
      desc: "Candidates must register online on the centralized admission portal of Guru Gobind Singh Indraprastha University (ipu.ac.in). Fill in candidate details, upload qualifying degree marksheets, select the B.Ed. programme, and pay the non-refundable university counselling fee.",
      hiDesc: "अभ्यर्थियों को गुरु गोबिंद सिंह इंद्रप्रस्थ विश्वविद्यालय (ipu.ac.in) के केंद्रीकृत पोर्टल पर बी.एड. हेतु ऑनलाइन पंजीकरण करना होता है। आवश्यक शैक्षणिक विवरण भरें एवं विश्वविद्यालय परामर्श शुल्क जमा करें।",
      badge: "University Portal (ipu.ac.in)",
      icon: ExternalLink,
    },
    {
      step: "02",
      title: "Online Choice Filling & Preference Locking",
      hiTitle: "ऑनलाइन चॉइस फिलिंग एवं कॉलेज वरीयता",
      desc: "During the official choice-filling window announced by GGSIPU, log in to your admission dashboard and select Haryana Shakti College of Education (HSCE), Kanjhawala, Delhi (Code: 147) as your preferred institution. Lock choices before the university deadline.",
      hiDesc: "विश्वविद्यालय द्वारा घोषित चॉइस फिलिंग अवधि में अपने पोर्टल में लॉगिन कर हरियाणा शक्ति कॉलेज ऑफ एजुकेशन (HSCE, कंझावला - कोड: 147) को अपनी वरीयता सूची में चुनें एवं नियत समय से पूर्व लॉक करें।",
      badge: "Select HSCE (Code: 147)",
      icon: ListOrdered,
    },
    {
      step: "03",
      title: "Seat Allotment & Provisional Fee Payment",
      hiTitle: "केंद्रीकृत सीट आवंटन एवं अनंतिम शुल्क",
      desc: "GGSIPU releases round-wise seat allotment results on its official portal. Candidates allotted a seat at HSCE must download their Provisional Admission Allotment Letter and pay the prescribed part-academic fee online to the university to confirm the seat.",
      hiDesc: "विश्वविद्यालय पोर्टल पर राउंड-वार सीट आवंटन परिणाम जारी करता है। आवंटित छात्र अपना अनंतिम सीट आवंटन पत्र डाउनलोड करें एवं अपनी सीट सुरक्षित करने हेतु पार्ट-अकादमिक शुल्क विश्वविद्यालय में जमा करें।",
      badge: "GGSIPU Seat Allotment",
      icon: CheckCircle2,
    },
    {
      step: "04",
      title: "Document Verification & Campus Reporting",
      hiTitle: "दस्तावेज़ सत्यापन एवं कॉलेज रिपोर्टिंग",
      desc: "Report in person at Haryana Shakti College of Education campus in Kanjhawala, Delhi along with original certificates, self-attested photocopies, character certificate, migration certificate, and passport photographs for final verification and enrollment.",
      hiDesc: "मूल प्रमाण-पत्रों, स्व-सत्यापित प्रतियों, चरित्र प्रमाण पत्र, माइग्रेशन एवं पासपोर्ट फोटो के साथ हरियाणा शक्ति कॉलेज ऑफ एजुकेशन, कंझावला परिसर में भौतिक सत्यापन हेतु निर्धारित समयावधि में उपस्थित हों।",
      badge: "HSCE Kanjhawala Campus",
      icon: FolderCheck,
    },
  ];

  return (
    <CollegiatePageLayout
      bannerTitle={isHindi ? "बी.एड. प्रवेश प्रक्रिया" : "B.Ed. Admission Procedure"}
      bannerSubtitle={
        isHindi
          ? "जीजीएसआईपीयू केंद्रीकृत काउंसलिंग, चॉइस फिलिंग, सीट आवंटन एवं भौतिक सत्यापन के चरणबद्ध नियम।"
          : "Step-by-step guidance for GGSIPU centralized counselling, preference locking, seat allotment, and physical reporting at HSCE."
      }
      breadcrumbs={[
        { label: isHindi ? "प्रवेश" : "Admissions", href: "/admissions" },
        { label: isHindi ? "प्रवेश प्रक्रिया" : "Admission Procedure" },
      ]}
      sidebarTitle={sidebarConfig.title}
      sidebarItems={sidebarConfig.items}
      quickActions={sidebarConfig.quickActions}>
      <div className="space-y-8">
        {/* Step-by-Step Cards */}
        <div className="rounded-md border border-gray-200/90 bg-white p-6 sm:p-8 shadow-xs">
          {/* Header with Blue Underline */}
          <div className="border-b border-gray-200 pb-4 mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E3A8C]">
              {isHindi ? "चरणबद्ध मार्गदर्शिका" : "Step-by-Step Flow"}
            </span>
            <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {isHindi ? "जीजीएसआईपीयू काउंसलिंग एवं प्रवेश प्रक्रिया" : "GGSIPU Counselling & Enrollment Procedure"}
            </h2>
            <div className="mt-3 h-1 w-20 bg-[#2E3A8C] rounded-full" />
          </div>

          <div className="space-y-5">
            {steps.map((st, idx) => {
              const Icon = st.icon;
              return (
                <div
                  key={idx}
                  className="rounded-md border border-gray-200 bg-slate-50/50 p-5 sm:p-6 transition hover:border-[#2E3A8C] hover:bg-white shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200/80 pb-3 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[#2E3A8C] text-white font-serif font-bold text-sm">
                        {st.step}
                      </span>
                      <h3 className="font-serif font-bold text-base text-slate-900">
                        {isHindi ? st.hiTitle : st.title}
                      </h3>
                    </div>
                    <span className="inline-block self-start sm:self-auto rounded bg-slate-200/80 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                      {st.badge}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                    {isHindi ? st.hiDesc : st.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Physical Reporting & Helpdesk Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Reporting Venue */}
          <div className="rounded-md border border-gray-200/90 bg-white p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3 pb-2 border-b border-gray-100">
                <Building2 size={20} className="text-[#2E3A8C]" />
                <h4 className="font-serif font-bold text-base text-slate-900">
                  {isHindi ? "भौतिक रिपोर्टिंग स्थल" : "Campus Reporting Venue"}
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                <strong>Haryana Shakti College of Education</strong>
                <br />
                Near Kanjhawala Chowk, Kanjhawala, North West Delhi, Delhi - 110081
              </p>
              <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-slate-500 space-y-1">
                <p><strong>Reporting Hours:</strong> 10:00 AM – 4:00 PM (Monday to Saturday)</p>
                <p><strong>Helpline:</strong> {helplinePhone}</p>
              </div>
            </div>

            <div className="mt-5">
              <Link
                to="/book-a-tour"
                className="inline-flex w-full items-center justify-center gap-2 rounded bg-[#2E3A8C] py-2.5 px-4 text-xs font-bold text-white hover:bg-[#232d70] transition shadow-xs">
                <span>{isHindi ? "परिसर भ्रमण बुक करें" : "Book a Campus Visit"}</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Admission Assistance Desk */}
          <div className="rounded-md border border-gray-200/90 bg-white p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3 pb-2 border-b border-gray-100">
                <Phone size={20} className="text-[#2E3A8C]" />
                <h4 className="font-serif font-bold text-base text-slate-900">
                  {isHindi ? "प्रवेश सहायता डेस्क" : "Admission Assistance Desk"}
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                {isHindi
                  ? "यदि आपको GGSIPU काउंसलिंग, चॉइस फिलिंग अथवा आवश्यक प्रमाण-पत्रों के संबंध में कोई संदेह हो, तो हमारी प्रवेश टीम से सीधे संपर्क करें।"
                  : "If you have any queries regarding university choice-filling, fee vouchers, or document preparation, reach out to our admission cell."}
              </p>
              <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-slate-500 space-y-1">
                <p><strong>Phone:</strong> {helplinePhone}</p>
                <p><strong>Email:</strong> {collegeInfo.email || "info@haryanashakticollege.in"}</p>
              </div>
            </div>

            <div className="mt-5">
              <Link
                to="/enquiry"
                className="inline-flex w-full items-center justify-center gap-2 rounded bg-[#F5CB1E] py-2.5 px-4 text-xs font-bold text-slate-900 hover:bg-[#eab308] transition shadow-xs">
                <span>{isHindi ? "ऑनलाइन पूछताछ भेजें" : "Submit Admission Enquiry"}</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </CollegiatePageLayout>
  );
}

import React from "react";
import { CollegiatePageLayout } from "../components/common/CollegiatePageLayout";
import { getGovernanceSidebarConfig } from "../data/navigationConfig";
import { useLanguage } from "../context/LanguageContext";

export default function PrivacyPage() {
  const { isHindi } = useLanguage();
  const sidebarConfig = getGovernanceSidebarConfig(isHindi);

  return (
    <CollegiatePageLayout
      bannerTitle={isHindi ? "गोपनीयता नीति" : "Privacy Policy"}
      bannerSubtitle={
        isHindi
          ? "वेबसाइट फॉर्म, जानकारी के उपयोग और विश्लेषिकी के बारे में जानकारी।"
          : "Information about website forms, data security, usage, and institutional policies."
      }
      breadcrumbs={[{ label: isHindi ? "गोपनीयता नीति" : "Privacy Policy" }]}
      sidebarTitle={sidebarConfig.title}
      sidebarItems={sidebarConfig.items}
      quickActions={sidebarConfig.quickActions}>
      <div className="rounded-md border border-gray-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-6 text-slate-700 leading-relaxed font-sans text-xs sm:text-sm">
        {/* Header with Blue Underline */}
        <div className="border-b border-gray-200 pb-3 mb-5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#2E3A8C]">
            {isHindi ? "संस्थागत दिशानिर्देश" : "Institutional Policy"}
          </span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {isHindi ? "गोपनीयता एवं डेटा सुरक्षा नीति" : "Privacy & Data Protection Policy"}
          </h2>
          <div className="mt-2 h-1 w-16 bg-[#2E3A8C] rounded-full" />
        </div>

        <section>
          <h3 className="mb-2 font-serif text-base font-bold text-slate-900">
            {isHindi
              ? "1. कौन-सी जानकारी ली जा सकती है"
              : "1. Information You May Provide"}
          </h3>
          <p className="text-justify leading-relaxed">
            {isHindi
              ? "संपर्क, पूछताछ और चैटबॉट फॉर्म में नाम, फोन नंबर, ईमेल और संदेश मांगे जा सकते हैं। कैंपस भ्रमण अनुरोध में उम्मीदवार या अभिभावक के संपर्क विवरण, शहर, शैक्षणिक जानकारी, पसंदीदा तिथि/समय और भ्रमण संबंधी प्राथमिकताएं भी ली जा सकती हैं। कृपया फॉर्म में अनावश्यक संवेदनशील जानकारी न दें।"
              : "Contact, admission enquiry, and helpline forms may ask for your name, phone number, email address, and query. A campus tour request may also record candidate details, preferred date and time, and academic stream preferences. Sensitive personal data is neither requested nor stored."}
          </p>
        </section>

        <section>
          <h3 className="mb-2 font-serif text-base font-bold text-slate-900">
            {isHindi
              ? "2. जानकारी का उपयोग और भंडारण"
              : "2. How Information is Used & Secured"}
          </h3>
          <p className="text-justify leading-relaxed">
            {isHindi
              ? "फॉर्म में दी गई जानकारी का उपयोग आपके संदेश का उत्तर देने, प्रवेश संबंधी पूछताछ संभालने या भ्रमण अनुरोध का प्रबंधन करने के लिए किया जाता है। वेबसाइट फॉर्म सबमिशन को Firebase/Firestore सेवा में सुरक्षित रूप से भेजा जाता है।"
              : "Information submitted through these forms is used solely to respond to your queries, process admission consultations, or schedule physical campus visits. All submissions are stored securely in official cloud databases in compliance with university standards."}
          </p>
        </section>

        <section>
          <h3 className="mb-2 font-serif text-base font-bold text-slate-900">
            {isHindi ? "3. विश्लेषिकी और बाहरी सेवाएं" : "3. Analytics & Technical Logs"}
          </h3>
          <p className="text-justify leading-relaxed">
            {isHindi
              ? "यह वेबसाइट सुरक्षित ब्राउज़र वातावरण में बुनियादी प्रदर्शन विश्लेषिकी का उपयोग करती है ताकि उपयोगकर्ताओं को तेज एवं विश्वसनीय अनुभव प्राप्त हो सके।"
              : "This website uses secure, standard diagnostic analytics to monitor uptime, performance, and accessibility across devices."}
          </p>
        </section>

        <section>
          <h3 className="mb-2 font-serif text-base font-bold text-slate-900">
            {isHindi ? "4. प्रश्न या अनुरोध" : "4. Contact Academic Office"}
          </h3>
          <p className="text-justify leading-relaxed">
            {isHindi
              ? "यदि आपके पास इस नीति के बारे में कोई प्रश्न है, तो आप हमारे संपर्क पृष्ठ के माध्यम से कॉलेज प्रशासन से संपर्क कर सकते हैं।"
              : "If you have any questions regarding this policy or data management, feel free to reach our administrative office via the official Contact page."}
          </p>
        </section>
      </div>
    </CollegiatePageLayout>
  );
}

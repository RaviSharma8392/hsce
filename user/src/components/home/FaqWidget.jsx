import React, { useState } from "react";
import {
  ChevronDown,
  PhoneCall,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useLanguage } from "../../context/LanguageContext";
import { Container } from "../common/Container";

export function FaqWidget() {
  const { isHindi } = useLanguage();
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: isHindi
        ? "क्या हरियाणा शक्ति कॉलेज ऑफ एजुकेशन एनसीटीई से मान्यता प्राप्त एवं जीजीएसआईपीयू से संबद्ध है?"
        : "Is Haryana Shakti College of Education recognized by NCTE and affiliated to GGSIPU?",
      a: isHindi
        ? "हाँ, हरियाणा शक्ति कॉलेज ऑफ एजुकेशन (HSCE) राष्ट्रीय अध्यापक शिक्षा परिषद (NCTE), भारत सरकार द्वारा विधिवत मान्यता प्राप्त है और गुरु गोबिंद सिंह इंद्रप्रस्थ विश्वविद्यालय (GGSIPU), दिल्ली से संबद्ध है। कॉलेज सभी वैधानिक नियामक मानकों का कड़ाई से पालन करता है।"
        : "Yes, Haryana Shakti College of Education (HSCE), Kanjhawala is recognized by the National Council for Teacher Education (NCTE) Northern Regional Committee and affiliated to Guru Gobind Singh Indraprastha University (GGSIPU), Delhi (College Code: 147). Current approval orders and regulatory affidavits are publicly displayed in our Mandatory Disclosures section.",
    },
    {
      q: isHindi
        ? "बी.एड. (2-वर्षीय नियमित) पाठ्यक्रम में प्रवेश हेतु न्यूनतम पात्रता क्या है?"
        : "What is the minimum eligibility criteria for the 2-Year Regular B.Ed. programme?",
      a: isHindi
        ? "अभ्यर्थियों के पास किसी भी मान्यता प्राप्त विश्वविद्यालय से स्नातक (Bachelor's) अथवा स्नातकोत्तर (Master's) डिग्री में न्यूनतम 50% अंक (अनुसूचित जाति/जनजाति एवं दिव्यांग अभ्यर्थियों हेतु 45%) होने चाहिए। प्रवेश जीजीएसआईपीयू काउंसलिंग के माध्यम से होता है।"
        : "Candidates need a Bachelor's Degree and/or Master's Degree with at least 50% marks in aggregate (45% for SC/ST/PwD candidates) from a recognized university. Admissions are processed through centralized GGSIPU CET / CUET counseling.",
    },
    {
      q: isHindi
        ? "क्या कॉलेज में शिक्षण और परीक्षा का माध्यम हिन्दी एवं अंग्रेजी दोनों में उपलब्ध है?"
        : "Is the medium of instruction and examination available in both Hindi and English?",
      a: isHindi
        ? "हाँ, हरियाणा शक्ति कॉलेज ऑफ एजुकेशन में शिक्षण द्विभाषी (Bilingual) माध्यम से कराया जाता है। विद्यार्थी अपनी सुविधानुसार विश्वविद्यालय परीक्षा हिन्दी अथवा अंग्रेजी किसी भी माध्यम में दे सकते हैं।"
        : "Yes, instruction is bilingual (English and Hindi). Students are permitted to write assignments, lesson plans, and university term examinations in either English or Hindi according to their preference.",
    },
    {
      q: isHindi
        ? "क्या विद्यालय इंटर्नशिप (Practice Teaching) अनिवार्य है और यह कहाँ आयोजित होती है?"
        : "Is the school internship compulsory and where is it conducted?",
      a: isHindi
        ? "हाँ, एनसीटीई और जीजीएसआईपीयू पाठ्यचर्या के अनुसार 16 सप्ताह का गहन स्कूल इंटर्नशिप अनिवार्य है। कॉलेज दिल्ली सरकार के शिक्षा निदेशालय एवं मान्यता प्राप्त वरिष्ठ माध्यमिक विद्यालयों में छात्रों के प्रशिक्षण की व्यवस्था करता है।"
        : "Yes, as per NCTE and university norms, pupil-teachers undergo mandatory practical school teaching internship across Delhi Directorate of Education government and recognized secondary schools.",
    },
    {
      q: isHindi
        ? "क्या कॉलेज में सीटीईटी (CTET) और शिक्षक भर्ती परीक्षाओं हेतु मार्गदर्शन दिया जाता है?"
        : "Does the college provide coaching and guidance for CTET and teacher recruitment exams?",
      a: isHindi
        ? "हाँ, कॉलेज के अनुभवी प्राध्यापकों द्वारा नियमित पाठ्यचर्या के साथ-साथ सीटीईटी (पेपर I व II) और दिल्ली शिक्षक भर्ती (DSSSB, KVS) परीक्षाओं के लिए विशेष मार्गदर्शन एवं मॉक टेस्ट आयोजित किए जाते हैं।"
        : "Yes, our experienced faculty conduct specialized CTET workshops, mock problem sessions, and recruitment orientation drills alongside the standard B.Ed curriculum.",
    },
  ];

  return (
    <section className="relative overflow-hidden border-b border-gray-200/90 bg-white py-14 font-sans sm:py-16 lg:py-20">
      <Container>
        <div className="relative grid grid-cols-1 items-start gap-8 sm:gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12 xl:gap-16">
          {/* LEFT: INTRODUCTION & SOLID BLUE CONTACT BOX */}
          <div className="min-w-0 lg:sticky lg:top-24">
            {/* Eyebrow */}
            <div className="mb-2.5 flex items-center gap-2">
              <span className="h-0.5 w-6 bg-[#FBDD23]" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#2E3A8C]">
                {isHindi ? "प्रश्नोत्तरी एवं सहायता" : "FAQ & ADMISSION SUPPORT"}
              </span>
            </div>

            {/* Main Heading */}
            <h2 className="max-w-lg text-2xl font-bold leading-tight tracking-tight text-[#2E3A8C] sm:text-3xl lg:text-4xl">
              {isHindi ? (
                <>
                  आपके सवाल,
                  <span className="mt-1 block text-[#2E3A8C]">हमारे जवाब।</span>
                </>
              ) : (
                <>
                  Got Questions?
                  <span className="mt-1 block text-[#2E3A8C]">
                    We Have Answers.
                  </span>
                </>
              )}
            </h2>

            {/* Description */}
            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-600 sm:text-base font-normal">
              {isHindi
                ? "हरियाणा शक्ति कॉलेज ऑफ एजुकेशन में प्रवेश, पाठ्यक्रम और शैक्षणिक सुविधाओं से जुड़े सामान्य प्रश्नों के उत्तर यहाँ पाएँ।"
                : "Find answers to common questions about admissions, the B.Ed. programme, eligibility and academic life at Haryana Shakti College of Education."}
            </p>

            {/* Desktop Contact Card (Matching upper solid blue & gold design) */}
            <div className="mt-8 hidden rounded-2xl border border-[#232D70] bg-[#2E3A8C] p-6 sm:p-7 text-white shadow-md lg:block">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FBDD23] text-[#2E3A8C] shadow-xs">
                  <PhoneCall size={22} strokeWidth={2.2} />
                </div>

                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-bold leading-snug text-white">
                    {isHindi ? "अधिक जानकारी चाहिए?" : "Need more information?"}
                  </h3>

                  <p className="mt-1 text-xs sm:text-[13px] leading-relaxed text-blue-100 font-normal">
                    {isHindi
                      ? "हमारी टीम आपके सभी प्रश्नों में सहायता हेतु तत्पर है।"
                      : "Our counseling team is here to assist you with every query."}
                  </p>
                </div>
              </div>

              <Link
                to="/contact"
                className="mt-6 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-sm bg-[#FBDD23] hover:bg-[#FFDC13] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-900 transition-all shadow-xs hover:shadow-md cursor-pointer active:scale-[0.98]">
                <span>{isHindi ? "हमसे संपर्क करें" : "Contact Us"}</span>
                <ArrowRight size={14} strokeWidth={2.5} />
              </Link>
            </div>
          </div>

          {/* RIGHT: FAQ ACCORDION */}
          <div className="min-w-0">
            {/* FAQ Header */}
            <div className="mb-5 flex items-center justify-between gap-3 sm:mb-6">
              <h3 className="text-base font-bold tracking-tight text-[#2E3A8C] sm:text-lg">
                {isHindi ? "सामान्य प्रश्न" : "Frequently Asked Questions"}
              </h3>

              <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold tabular-nums text-[#2E3A8C]">
                {String(faqs.length).padStart(2, "0")}{" "}
                {isHindi ? "प्रश्न" : "Questions"}
              </span>
            </div>

            {/* FAQ Items */}
            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openIndex === idx;
                const answerId = `faq-answer-${idx}`;
                const questionId = `faq-question-${idx}`;

                return (
                  <article
                    key={faq.q}
                    className={`overflow-hidden rounded-xl border bg-white transition-all duration-200 ${
                      isOpen
                        ? "border-[#2E3A8C] shadow-sm"
                        : "border-gray-200/90 hover:border-gray-300"
                    }`}>
                    {/* Question Button */}
                    <button
                      id={questionId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={answerId}
                      onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                      className="flex w-full items-start gap-3 p-4 text-left focus-visible:outline-none sm:gap-4 sm:p-5 cursor-pointer">
                      {/* Question Number */}
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold tabular-nums transition-colors duration-200 ${
                          isOpen
                            ? "bg-[#2E3A8C] text-[#FBDD23]"
                            : "bg-[#2E3A8C]/5 text-[#2E3A8C]"
                        }`}>
                        {String(idx + 1).padStart(2, "0")}
                      </span>

                      {/* Question Text */}
                      <span className="min-w-0 flex-1 pt-0.5">
                        <span className="block text-sm sm:text-[15px] font-bold leading-snug text-[#2E3A8C]">
                          {faq.q}
                        </span>
                      </span>

                      {/* Expand Icon */}
                      <span
                        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
                          isOpen
                            ? "rotate-180 bg-[#2E3A8C]/10 text-[#2E3A8C]"
                            : "bg-gray-100 text-gray-500"
                        }`}>
                        <ChevronDown size={16} />
                      </span>
                    </button>

                    {/* Answer Panel */}
                    <div
                      id={answerId}
                      role="region"
                      aria-labelledby={questionId}
                      aria-hidden={!isOpen}
                      className={`grid transition-[grid-template-rows,opacity] duration-200 ease-in-out ${
                        isOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}>
                      <div className="overflow-hidden">
                        <div className="ml-4 mr-4 border-t border-gray-100 pb-5 pt-3.5 sm:ml-[3.75rem] sm:mr-5 sm:pb-6">
                          <p className="text-xs sm:text-sm leading-relaxed text-slate-600 font-normal">
                            {faq.a}
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Mobile Contact Card */}
            <div className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-slate-50 p-4 sm:p-5 lg:hidden">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#2E3A8C]/10 text-[#2E3A8C]">
                  <MessageCircle size={19} />
                </span>

                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#2E3A8C]">
                    {isHindi ? "कोई और सवाल है?" : "Still have questions?"}
                  </p>

                  <p className="mt-0.5 text-xs leading-snug text-slate-500">
                    {isHindi ? "हमारी टीम से बात करें" : "Talk to our team"}
                  </p>
                </div>
              </div>

              <Link
                to="/contact"
                aria-label={isHindi ? "संपर्क करें" : "Contact our team"}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2E3A8C] text-white">
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default FaqWidget;

import { useState } from "react";
import {
  ChevronDown,
  HelpCircle,
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
        : "Yes, Haryana Shakti College of Education (HSCE), Kanjhawala is recognized by the National Council for Teacher Education (NCTE) Northern Regional Committee and affiliated to Guru Gobind Singh Indraprastha University (GGSIPU), Delhi. Current approval orders and regulatory affidavits are publicly displayed in our Mandatory Disclosures section.",
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
    <section className="relative overflow-hidden border-b border-slate-200 bg-white py-10 font-sans sm:py-12 lg:py-16">
      {/* Decorative Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-72 w-72 translate-x-1/3 -translate-y-1/3 rounded-full bg-[#0a4b8c]/[0.035] sm:h-96 sm:w-96"
      />

      <Container>
        <div className="relative grid grid-cols-1 items-start gap-8 sm:gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12 xl:gap-16">
          {/* LEFT: INTRODUCTION */}
          <div className="min-w-0 lg:sticky lg:top-24">
            {/* Main Heading */}
            <h2 className="max-w-lg text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
              {isHindi ? (
                <>
                  आपके सवाल,
                  <span className="mt-1 block text-[#0a4b8c]">हमारे जवाब।</span>
                </>
              ) : (
                <>
                  Got Questions?
                  <span className="mt-1 block text-[#0a4b8c]">
                    We Have Answers.
                  </span>
                </>
              )}
            </h2>

            {/* Accent */}
            <div className="mt-4 h-0.5 w-12 rounded-full bg-[#FBDD23]" />

            {/* Description */}
            <p className="mt-5 max-w-md text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
              {isHindi
                ? "हरियाणा शक्ति कॉलेज ऑफ एजुकेशन में प्रवेश, पाठ्यक्रम और शैक्षणिक सुविधाओं से जुड़े सामान्य प्रश्नों के उत्तर यहाँ पाएँ।"
                : "Find answers to common questions about admissions, the B.Ed. programme, eligibility and academic life at Haryana Shakti College of Education."}
            </p>

            {/* Desktop Contact Card */}
            <div className="mt-8 hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 lg:block">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0a4b8c]/[0.08] text-[#0a4b8c]">
                  <PhoneCall size={21} />
                </div>

                <div className="min-w-0">
                  <h3 className="text-base font-bold leading-snug text-gray-900">
                    {isHindi ? "अधिक जानकारी चाहिए?" : "Need more information?"}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {isHindi
                      ? "हमारी टीम आपके प्रश्नों में सहायता करेगी।"
                      : "Our team is here to help with your questions."}
                  </p>
                </div>
              </div>

              <Link
                to="/contact"
                className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#0a4b8c] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#08396c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBDD23] focus-visible:ring-offset-2">
                {isHindi ? "हमसे संपर्क करें" : "Contact Us"}

                <ArrowRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>

          {/* RIGHT: FAQ ACCORDION */}
          <div className="min-w-0">
            {/* FAQ Header */}
            <div className="mb-5 flex items-center justify-between gap-3 sm:mb-6">
              <h3 className="text-base font-bold tracking-tight text-gray-900 sm:text-lg">
                {isHindi ? "सामान्य प्रश्न" : "Frequently Asked Questions"}
              </h3>

              <span className="shrink-0 rounded-full bg-[#0a4b8c]/[0.08] px-3 py-1.5 text-xs font-semibold tabular-nums text-[#0a4b8c]">
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
                    className={`overflow-hidden rounded-xl border bg-white transition-all duration-300 ${
                      isOpen
                        ? "border-[#0a4b8c]/25 shadow-[0_8px_24px_rgba(10,75,140,0.07)]"
                        : "border-gray-200 hover:border-[#0a4b8c]/25 hover:shadow-sm"
                    }`}>
                    {/* Question Button */}
                    <button
                      id={questionId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={answerId}
                      onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                      className="flex w-full items-start gap-3 p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0a4b8c] sm:gap-4 sm:p-5">
                      {/* Question Number */}
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-semibold tabular-nums transition-colors duration-300 ${
                          isOpen
                            ? "bg-[#0a4b8c] text-white"
                            : "bg-[#0a4b8c]/[0.08] text-[#0a4b8c]"
                        }`}>
                        {String(idx + 1).padStart(2, "0")}
                      </span>

                      {/* Question Text */}
                      <span className="min-w-0 flex-1 pt-1">
                        <span className="block text-sm font-semibold leading-6 text-gray-900 sm:text-base sm:leading-7">
                          {faq.q}
                        </span>
                      </span>

                      {/* Expand Icon */}
                      <span
                        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                          isOpen
                            ? "rotate-180 bg-[#0a4b8c]/[0.08] text-[#0a4b8c]"
                            : "bg-gray-100 text-gray-500"
                        }`}>
                        <ChevronDown size={18} />
                      </span>
                    </button>

                    {/* Answer Panel */}
                    <div
                      id={answerId}
                      role="region"
                      aria-labelledby={questionId}
                      aria-hidden={!isOpen}
                      className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                        isOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}>
                      <div className="overflow-hidden">
                        <div className="ml-4 mr-4 border-t border-gray-100 pb-5 pt-4 sm:ml-[4.25rem] sm:mr-5 sm:pb-6">
                          <p className="text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
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
            <div className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-dashed border-gray-300 bg-white p-4 sm:p-5 lg:hidden">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0a4b8c]/[0.08] text-[#0a4b8c]">
                  <MessageCircle size={19} />
                </span>

                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900">
                    {isHindi ? "कोई और सवाल है?" : "Still have questions?"}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-600">
                    {isHindi ? "हमारी टीम से बात करें" : "Talk to our team"}
                  </p>
                </div>
              </div>

              <Link
                to="/contact"
                aria-label={isHindi ? "संपर्क करें" : "Contact our team"}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0a4b8c] text-white transition-colors hover:bg-[#08396c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBDD23] focus-visible:ring-offset-2">
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default FaqWidget;

import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useAdmissionModal } from "../../context/AdmissionModalContext";

export function LatestUpdatesMarquee() {
  const { isHindi } = useLanguage();
  const { openAdmissionModal } = useAdmissionModal();

  const updatesEn = [
    {
      tag: "B.Ed. PROGRAMME",
      title: "Two-Year Bachelor of Education Programme",
      highlight: "GGSIPU Programme Code: 122",
      action: "View Programme",
      link: "/course",
    },
    {
      tag: "NCTE RECOGNITION",
      title: "Recognised by the National Council for Teacher Education",
      highlight: "NCTE Institute ID: NRCAPP-81",
      action: "Recognition Details",
      link: "/about/recognition",
    },
    {
      tag: "SCHOOL INTERNSHIP",
      title: "Study educational theory and develop teaching practice",
      highlight: "See the curriculum and school practice information",
      action: "Explore Curriculum",
      link: "/course",
    },
    {
      tag: "ADMISSIONS",
      title: "Check current B.Ed. eligibility and counselling guidance",
      highlight: "Follow the latest GGSIPU admission notices",
      action: "Admission Information",
      link: "/admissions",
    },
    {
      tag: "GGSIPU AFFILIATION",
      title: "Affiliated to Guru Gobind Singh Indraprastha University, Dwarka",
      highlight: "Recognized Teacher Education Institute",
      action: "University Profile",
      link: "/about",
    },
  ];

  const updatesHi = [
    {
      tag: "बी.एड. कार्यक्रम",
      title: "दो वर्षीय बैचलर ऑफ एजुकेशन कार्यक्रम",
      highlight: "GGSIPU कार्यक्रम कोड: 122",
      action: "कार्यक्रम देखें",
      link: "/course",
    },
    {
      tag: "NCTE मान्यता",
      title: "राष्ट्रीय अध्यापक शिक्षा परिषद (NCTE) से मान्यता प्राप्त",
      highlight: "NCTE संस्थान आईडी: NRCAPP-81",
      action: "मान्यता विवरण",
      link: "/about/recognition",
    },
    {
      tag: "विद्यालय इंटर्नशिप",
      title: "शैक्षिक सिद्धांत और शिक्षण अभ्यास का अध्ययन",
      highlight: "पाठ्यक्रम और विद्यालय अभ्यास की जानकारी देखें",
      action: "पाठ्यक्रम देखें",
      link: "/course",
    },
    {
      tag: "प्रवेश जानकारी",
      title: "बी.एड. पात्रता और काउंसलिंग प्रक्रिया जानें",
      highlight: "नवीनतम GGSIPU प्रवेश सूचनाएं देखें",
      action: "प्रवेश विवरण",
      link: "/admissions",
    },
    {
      tag: "GGSIPU संबद्धता",
      title: "गुरु गोबिंद सिंह इंद्रप्रस्थ विश्वविद्यालय (द्वारका, दिल्ली) से संबद्ध",
      highlight: "मान्यता प्राप्त शिक्षक प्रशिक्षण महाविद्यालय",
      action: "कॉलेज प्रोफाइल",
      link: "/about",
    },
  ];

  const updates = isHindi ? updatesHi : updatesEn;

  return (
    <div className="relative isolate z-30 w-full overflow-hidden border-y border-[#202965] bg-[#2E3A8C] font-sans text-white shadow-sm">
      <div className="flex items-center">
        {/* Sticky Left Live Pulse Label */}
        <div className="relative z-20 flex shrink-0 items-center gap-2 border-r border-white/20 bg-[#202965] px-3.5 py-2.5 shadow-md sm:px-5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FBDD23] opacity-80" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#FBDD23]" />
          </span>
          <span className="rounded-full bg-[#FBDD23] px-2.5 py-0.5 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#2E3A8C]">
            {isHindi ? "नवीनतम सूचनाएं" : "LATEST UPDATES"}
          </span>
        </div>

        {/* Continuous Running Marquee */}
        <div className="relative flex-1 overflow-hidden py-2 sm:py-2.5">
          <div className="animate-marquee flex items-center gap-6 whitespace-nowrap">
            {/* Double the list to loop seamlessly */}
            {[...updates, ...updates].map((item, idx) => (
              <React.Fragment key={`${item.tag}-${idx}`}>
                <div className="mx-2 flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.08] px-4 py-1.5 transition-colors hover:bg-white/[0.14] shadow-xs">
                  <span className="rounded-full bg-[#FBDD23] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#2E3A8C]">
                    {item.tag}
                  </span>

                  <span className="text-xs sm:text-sm font-semibold text-white">
                    {item.title}
                  </span>

                  <span className="text-xs font-medium text-blue-200 hidden md:inline">
                    ({item.highlight})
                  </span>

                  {item.isModal ? (
                    <button
                      type="button"
                      onClick={() => openAdmissionModal()}
                      className="inline-flex items-center gap-1 rounded-full border border-[#FBDD23] px-3 py-0.5 text-[11px] font-bold text-[#FBDD23] transition-all hover:bg-[#FBDD23] hover:text-[#2E3A8C] cursor-pointer">
                      <span>{item.action}</span>
                      <ArrowRight size={12} />
                    </button>
                  ) : (
                    <Link
                      to={item.link}
                      className="inline-flex items-center gap-1 rounded-full border border-[#FBDD23] px-3 py-0.5 text-[11px] font-bold text-[#FBDD23] transition-all hover:bg-[#FBDD23] hover:text-[#2E3A8C]">
                      <span>{item.action}</span>
                      <ArrowRight size={12} />
                    </Link>
                  )}
                </div>

                <span className="text-xs text-[#FBDD23] select-none opacity-80">
                  ✦
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LatestUpdatesMarquee;

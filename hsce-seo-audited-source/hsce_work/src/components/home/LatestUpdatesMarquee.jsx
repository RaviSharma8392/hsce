import React from "react";
import { Link } from "react-router-dom";
import { Bell, ArrowRight, Sparkles } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useAdmissionModal } from "../../context/AdmissionModalContext";

export function LatestUpdatesMarquee() {
  const { isHindi } = useLanguage();
  const { openAdmissionModal } = useAdmissionModal();

  const updatesEn = [
    {
      tag: "B.Ed. ADMISSION 2026-27",
      title: "Admissions Open for 2-Year Regular B.Ed. Degree (200 Seats)",
      highlight: "GGSIPU CET Code: 084",
      action: "Enquire Now",
      isModal: true,
    },
    {
      tag: "NCTE RECOGNITION",
      title: "Duly Approved by National Council for Teacher Education (NRC)",
      highlight: "Order No. F.NRC/NCTE/HR-451",
      action: "View Disclosures",
      link: "/about",
    },
    {
      tag: "SCHOOL INTERNSHIP",
      title: "16-Week Real Classroom Immersion & Micro-Teaching",
      highlight: "Across Premier Delhi Government & Private Schools",
      action: "Explore Curriculum",
      link: "/course/bed",
    },
    {
      tag: "CTET GUIDANCE",
      title: "Dedicated CTET Paper I & II Pedagogical Prep Sessions",
      highlight: "Targeted School Placement Guidance",
      action: "Student Voice",
      link: "/campus-life",
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
      tag: "बी.एड. प्रवेश 2026-27",
      title: "दो वर्षीय नियमित बी.एड. डिग्री में प्रवेश प्रारंभ (200 सीटें)",
      highlight: "GGSIPU सीईटी कोड: 084",
      action: "अभी पूछताछ करें",
      isModal: true,
    },
    {
      tag: "NCTE मान्यता",
      title: "राष्ट्रीय अध्यापक शिक्षा परिषद (NRC-NCTE) द्वारा विधिवत मान्यता प्राप्त",
      highlight: "वैधानिक आदेश संख्या: F.NRC/NCTE/HR-451",
      action: "मान्यता आदेश देखें",
      link: "/about",
    },
    {
      tag: "विद्यालय इंटर्नशिप",
      title: "16-सप्ताह का वास्तविक कक्षा शिक्षण अभ्यास एवं माइक्रो-टीचिंग",
      highlight: "दिल्ली के प्रतिष्ठित विद्यालयों में व्यावहारिक प्रशिक्षण",
      action: "पाठ्यक्रम देखें",
      link: "/course/bed",
    },
    {
      tag: "सीटेट मार्गदर्शन",
      title: "CTET पेपर I और II की विशेष तैयारी और मॉक इंटरव्यू",
      highlight: "शिक्षक भर्ती हेतु संपूर्ण मार्गदर्शन",
      action: "परिसर जीवन देखें",
      link: "/campus-life",
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
    <div className="relative isolate z-30 w-full overflow-hidden border-y border-[#0a4b8c]/30 bg-[#0a4b8c] font-sans text-white shadow-sm">
      <div className="flex items-center">
        {/* Sticky Left Live Pulse Label */}
        <div className="relative z-20 flex shrink-0 items-center gap-2 border-r border-white/20 bg-[#083a6f] px-3.5 py-3 shadow-md sm:px-5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FBDD23] opacity-80" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#FBDD23]" />
          </span>
          <span className="rounded-full bg-[#FBDD23] px-2.5 py-0.5 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-gray-950">
            {isHindi ? "नवीनतम सूचनाएं" : "LATEST UPDATES"}
          </span>
        </div>

        {/* Continuous Running Marquee */}
        <div className="relative flex-1 overflow-hidden py-2.5 sm:py-3">
          <div className="animate-marquee flex items-center gap-6 whitespace-nowrap">
            {/* Double the list to loop seamlessly */}
            {[...updates, ...updates].map((item, idx) => (
              <React.Fragment key={`${item.tag}-${idx}`}>
                <div className="mx-2 flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.08] px-4 py-1.5 transition-colors hover:bg-white/[0.14] shadow-xs">
                  <span className="rounded-full bg-[#FBDD23] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-950">
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
                      className="inline-flex items-center gap-1 rounded-full border border-[#FBDD23] px-3 py-0.5 text-[11px] font-bold text-[#FBDD23] transition-all hover:bg-[#FBDD23] hover:text-gray-950 cursor-pointer">
                      <span>{item.action}</span>
                      <ArrowRight size={12} />
                    </button>
                  ) : (
                    <Link
                      to={item.link}
                      className="inline-flex items-center gap-1 rounded-full border border-[#FBDD23] px-3 py-0.5 text-[11px] font-bold text-[#FBDD23] transition-all hover:bg-[#FBDD23] hover:text-gray-950">
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

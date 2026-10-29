import {
  ArrowRight,
  BookOpenCheck,
  GraduationCap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Container } from "../common/Container";
import { useLanguage } from "../../context/LanguageContext";

const BENEFITS = {
  en: {
    eyebrow: "INSTITUTIONAL STRENGTHS",
    title: "Why Choose HSCE?",
    description:
      "A premier teacher education college combining academic rigor, verified statutory approvals, intensive school practice, and personalized career preparation.",
    items: [
      {
        title: "Recognized & Affiliated",
        tag: "NCTE & GGSIPU Code 147",
        description:
          "Duly recognized by NCTE (Northern Regional Committee) and affiliated with Guru Gobind Singh Indraprastha University (GGSIPU), Delhi.",
      },
      {
        title: "Student-Centered Learning",
        tag: "1-on-1 Faculty Mentorship",
        description:
          "An inclusive, encouraging pedagogical environment where every aspiring teacher receives individual mentorship.",
      },
      {
        title: "Experienced Faculty",
        tag: "UGC-NET & Ph.D. Mentors",
        description:
          "Dedicated educators bring deep subject expertise, curriculum insights, research rigor, and classroom mastery.",
      },
      {
        title: "CTET & Placement Support",
        tag: "Mock Drills & CTET Guidance",
        description:
          "Specialized CTET coaching, mock recruitment workshops, and guided school placement assistance for future teachers.",
      },
      {
        title: "Micro-Teaching & Internship",
        tag: "16 Wks in Delhi Schools",
        description:
          "16 weeks of structured real-classroom teaching practice across recognized schools in Delhi.",
      },
      {
        title: "Curriculum Labs & Library",
        tag: "ICT, Psychology & TLM Labs",
        description:
          "Fully equipped science & psychology laboratories, curriculum resource centre, ICT computer lab, and rich library.",
      },
    ],
  },
  hi: {
    eyebrow: "हमारी प्रमुख विशेषताएं",
    title: "HSCE क्यों चुनें?",
    description:
      "गुणवत्तापूर्ण शिक्षक शिक्षा, व्यावहारिक प्रशिक्षण, अनुभवी संकाय और करियर मार्गदर्शन का एक प्रतिष्ठित केंद्र।",
    items: [
      {
        title: "मान्यता एवं संबद्धता",
        tag: "NCTE एवं GGSIPU कोड 147",
        description:
          "NCTE से विधिवत मान्यता प्राप्त और गुरु गोबिंद सिंह इंद्रप्रस्थ विश्वविद्यालय (GGSIPU), दिल्ली से संबद्ध।",
      },
      {
        title: "विद्यार्थी-केंद्रित शिक्षा",
        tag: "1-on-1 व्यक्तिगत मार्गदर्शन",
        description:
          "समावेशी एवं प्रेरक शैक्षणिक वातावरण, जहाँ प्रत्येक छात्र-अध्यापक को व्यक्तिगत मार्गदर्शन मिलता है।",
      },
      {
        title: "अनुभवी प्राध्यापक",
        tag: "यूजीसी-नेट एवं पीएच.डी. शिक्षक",
        description:
          "समर्पित एवं उच्च योग्यता प्राप्त शिक्षक जो विषय ज्ञान, शोध और शिक्षण विधियों का मार्गदर्शन करते हैं।",
      },
      {
        title: "सीटीईटी एवं प्लेसमेंट सहायता",
        tag: "मॉक इंटरव्यू व CTET तैयारी",
        description:
          "CTET कार्यशालाएं, साक्षात्कार की तैयारी और अग्रणी विद्यालयों में शिक्षण अवसर हेतु सहयोग।",
      },
      {
        title: "व्यावहारिक शिक्षण अभ्यास",
        tag: "16 सप्ताह स्कूल इंटर्नशिप",
        description:
          "दिल्ली के मान्यता प्राप्त विद्यालयों में 16 सप्ताह का गहन विद्यालय इंटर्नशिप और माइक्रो-टीचिंग अनुभव।",
      },
      {
        title: "प्रयोगशालाएं एवं पुस्तकालय",
        tag: "आईसीटी, मनोविज्ञान व पुस्तकालय",
        description:
          "मनोविज्ञान एवं विज्ञान प्रयोगशालाएं, पाठ्यचर्या संसाधन केंद्र, कंप्यूटर लैब और समृद्ध पुस्तकालय।",
      },
    ],
  },
};

const OPPORTUNITIES = {
  en: {
    eyebrow: "CAMPUS LIFE",
    title: "A Campus That Inspires Learning and Belonging",
    description:
      "Based in Kanjhawala, Delhi, HSCE brings together focused learning spaces and a welcoming college community for future teachers. From classrooms and practical learning facilities to shared campus activities, each part of college life supports purposeful learning, creativity and connection.",
    exploreTitle: "Explore Opportunities",
    links: [
      {
        title: "B.Ed. Programme",
        description:
          "Build subject knowledge and practical teaching skills through the two-year programme.",
        href: "/course/bed",
        icon: BookOpenCheck,
      },
      {
        title: "Campus & Facilities",
        description:
          "Explore the library, learning spaces and facilities that support college life.",
        href: "/campus-life",
        icon: GraduationCap,
      },
      {
        title: "Admissions",
        description:
          "Review programme information and find the next steps for applying.",
        href: "/admissions",
        icon: ArrowRight,
      },
    ],
  },
  hi: {
    eyebrow: "परिसर जीवन",
    title: "सीखने और अपनत्व को प्रेरित करने वाला परिसर",
    description:
      "दिल्ली के कंझावला में स्थित HSCE भावी शिक्षकों के लिए एक सहयोगी शैक्षणिक वातावरण प्रदान करता है। कक्षाओं और व्यावहारिक शिक्षण सुविधाओं से लेकर सामुदायिक गतिविधियों तक, परिसर उद्देश्यपूर्ण सीखने, रचनात्मकता और आपसी जुड़ाव को प्रोत्साहित करता है।",
    exploreTitle: "अवसरों को जानें",
    links: [
      {
        title: "बी.एड. कार्यक्रम",
        description:
          "दो वर्षीय कार्यक्रम के माध्यम से विषय ज्ञान और व्यावहारिक शिक्षण कौशल विकसित करें।",
        href: "/course/bed",
        icon: BookOpenCheck,
      },
      {
        title: "परिसर एवं सुविधाएँ",
        description:
          "कॉलेज जीवन में सहायक पुस्तकालय, अध्ययन स्थलों और सुविधाओं को जानें।",
        href: "/campus-life",
        icon: GraduationCap,
      },
      {
        title: "प्रवेश",
        description: "कार्यक्रम की जानकारी देखें और आवेदन के अगले चरण जानें।",
        href: "/admissions",
        icon: ArrowRight,
      },
    ],
  },
};

function DotPattern({ className = "" }) {
  return (
    <svg
      width="72"
      height="54"
      viewBox="0 0 72 54"
      fill="none"
      className={className}
      aria-hidden="true">
      <defs>
        <pattern
          id="why-choose-dots"
          x="0"
          y="0"
          width="12"
          height="12"
          patternUnits="userSpaceOnUse">
          <circle cx="2.5" cy="2.5" r="1.5" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="72" height="54" fill="url(#why-choose-dots)" />
    </svg>
  );
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <header className="mb-8 max-w-3xl">
      {eyebrow && (
        <div className="mb-2.5 flex items-center gap-2">
          <span className="h-1 w-7 bg-[#FBDD23] rounded-full" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#2E3A8C]">
            {eyebrow}
          </span>
        </div>
      )}
      <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold leading-tight tracking-tight text-[#2E3A8C]">
        {title}
      </h2>

      <p className="mt-3.5 max-w-3xl text-xs sm:text-sm leading-relaxed text-slate-600 font-normal">
        {description}
      </p>
    </header>
  );
}

export function WhyChooseSection() {
  const { isHindi } = useLanguage();
  const content = isHindi ? BENEFITS.hi : BENEFITS.en;

  return (
    <section className="bg-[#F8FAFC] py-14 font-sans sm:py-16 lg:py-20 border-b border-gray-200/90 relative overflow-hidden">
      {/* Subtle corner dot pattern */}
      <DotPattern className="absolute top-6 right-6 text-slate-300/80 pointer-events-none hidden sm:block" />

      <Container>
        <div className="mb-8 sm:mb-10 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow={content.eyebrow}
            title={content.title}
            description={content.description}
          />

          <Link
            to="/about"
            className="group inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#2E3A8C] hover:bg-[#1E255E] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all active:scale-[0.98]">
            <span>{isHindi ? "संस्थान परिचय देखें" : "About HSCE Profile"}</span>
            <ArrowRight size={13} className="text-[#FBDD23]" />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {content.items.map((item, index) => {
            return (
              <article
                key={item.title}
                className="group relative flex min-w-0 flex-col justify-between overflow-hidden rounded-2xl bg-white/90 backdrop-blur-md p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-10px_rgba(46,58,140,0.12)] hover:border-[#2E3A8C]/40 hover:bg-white">
                {/* Subtle crystalline top shimmer line */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#2E3A8C] via-[#FBDD23] to-[#2E3A8C] opacity-80 group-hover:opacity-100 transition-opacity" />

                <div>
                  {/* Top Row: Crystal Number Badge + Verified Category Tag (No Clunky Icons) */}
                  <div className="mb-5 flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200/80 text-[#2E3A8C] font-black text-sm tracking-tight shadow-2xs group-hover:bg-[#2E3A8C] group-hover:text-[#FBDD23] group-hover:border-[#2E3A8C] transition-all duration-300">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100/90 text-[#2E3A8C] border border-slate-200/60 group-hover:bg-[#FBDD23] group-hover:text-slate-900 group-hover:border-[#FBDD23] transition-colors duration-200 shadow-2xs">
                      {isHindi ? "स्तंभ " : "PILLAR "}
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-[19px] font-bold text-slate-900 group-hover:text-[#2E3A8C] transition-colors leading-snug tracking-tight">
                    {item.title}
                  </h3>

                  {/* Verified Subtitle Tag */}
                  {item.tag && (
                    <span className="inline-block mt-2 text-[11px] font-bold text-[#2E3A8C] bg-blue-50/80 border border-blue-200/60 px-2.5 py-0.5 rounded-md">
                      {item.tag}
                    </span>
                  )}

                  {/* Description */}
                  <p className="mt-3 text-xs sm:text-[13.5px] leading-relaxed text-slate-600 font-normal">
                    {item.description}
                  </p>
                </div>

                {/* Crystal Footer: Academic Rigor Indicator + Crystal Arrow */}
                <div className="mt-6 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500 group-hover:text-[#2E3A8C] transition-colors">
                  <span className="uppercase tracking-wider text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FBDD23]" />
                    {isHindi ? "शिक्षण उत्कृष्टता" : "Academic Rigor"}
                  </span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 border border-slate-200/60 text-[#2E3A8C] group-hover:bg-[#2E3A8C] group-hover:text-[#FBDD23] group-hover:border-[#2E3A8C] transition-all duration-200 group-hover:translate-x-0.5 shadow-2xs">
                    <ArrowRight size={13} strokeWidth={2.5} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export function CampusWelcomeSection() {
  const { isHindi } = useLanguage();
  const content = isHindi ? OPPORTUNITIES.hi : OPPORTUNITIES.en;

  return (
    <section
      aria-labelledby="campus-welcome-title"
      className="bg-[#fafcff] py-10 font-sans sm:py-12 lg:py-14">
      <Container>
        <SectionHeading
          eyebrow={content.eyebrow}
          title={content.title}
          description={content.description}
        />

        <div className="border-t border-[#E5E7EB] pt-6 sm:pt-7">
          <h3 className="mb-4 text-lg font-bold text-[#363991] sm:text-xl">
            {content.exploreTitle}
          </h3>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {content.links.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className="group flex min-w-0 flex-col border border-gray-200/90 rounded-xl bg-white p-5 transition-all duration-200 hover:border-[#363991] hover:shadow-md sm:p-6">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#363991]/10 text-[#363991] transition-colors group-hover:bg-[#363991] group-hover:text-[#FBDD23]">
                      <Icon aria-hidden="true" size={20} strokeWidth={2} />
                    </span>

                    <ArrowRight
                      aria-hidden="true"
                      size={18}
                      className="text-gray-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#FBDD23]"
                    />
                  </div>

                  <h4 className="text-base font-bold text-[#363991] transition-colors group-hover:text-[#282A70]">
                    {item.title}
                  </h4>

                  <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>

                  <span className="mt-4 border-t border-gray-100 pt-3 text-xs font-bold text-[#363991] group-hover:text-[#282A70] transition-colors">
                    {isHindi ? "और जानें →" : "Explore more →"}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}

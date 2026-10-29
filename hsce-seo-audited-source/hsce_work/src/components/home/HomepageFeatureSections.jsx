import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  BriefcaseBusiness,
  Building2,
  GraduationCap,
  Lightbulb,
  UsersRound,
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
        description:
          "Duly recognized by NCTE (Northern Regional Committee) and affiliated with Guru Gobind Singh Indraprastha University (GGSIPU), Delhi.",
        icon: BadgeCheck,
      },
      {
        title: "Student-Centered Learning",
        description:
          "An inclusive, encouraging pedagogical environment where every aspiring teacher receives individual mentorship.",
        icon: UsersRound,
      },
      {
        title: "Experienced Faculty",
        description:
          "Dedicated educators bring deep subject expertise, curriculum insights, research rigor, and classroom mastery.",
        icon: GraduationCap,
      },
      {
        title: "CTET & Placement Support",
        description:
          "Specialized CTET coaching, mock recruitment workshops, and guided school placement assistance for future teachers.",
        icon: BriefcaseBusiness,
      },
      {
        title: "Micro-Teaching & Internship",
        description:
          "16 weeks of structured real-classroom teaching practice across recognized schools in Delhi.",
        icon: Lightbulb,
      },
      {
        title: "Curriculum Labs & Library",
        description:
          "Fully equipped science & psychology laboratories, curriculum resource centre, ICT computer lab, and rich library.",
        icon: Building2,
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
        description:
          "NCTE से विधिवत मान्यता प्राप्त और गुरु गोबिंद सिंह इंद्रप्रस्थ विश्वविद्यालय (GGSIPU), दिल्ली से संबद्ध।",
        icon: BadgeCheck,
      },
      {
        title: "विद्यार्थी-केंद्रित शिक्षा",
        description:
          "समावेशी एवं प्रेरक शैक्षणिक वातावरण, जहाँ प्रत्येक छात्र-अध्यापक को व्यक्तिगत मार्गदर्शन मिलता है।",
        icon: UsersRound,
      },
      {
        title: "अनुभवी प्राध्यापक",
        description:
          "समर्पित एवं उच्च योग्यता प्राप्त शिक्षक जो विषय ज्ञान, शोध और शिक्षण विधियों का मार्गदर्शन करते हैं।",
        icon: GraduationCap,
      },
      {
        title: "सीटीईटी एवं प्लेसमेंट सहायता",
        description:
          "CTET कार्यशालाएं, साक्षात्कार की तैयारी और अग्रणी विद्यालयों में शिक्षण अवसर हेतु सहयोग।",
        icon: BriefcaseBusiness,
      },
      {
        title: "व्यावहारिक शिक्षण अभ्यास",
        description:
          "दिल्ली के मान्यता प्राप्त विद्यालयों में 16 सप्ताह का गहन विद्यालय इंटर्नशिप और माइक्रो-टीचिंग अनुभव।",
        icon: Lightbulb,
      },
      {
        title: "प्रयोगशालाएं एवं पुस्तकालय",
        description:
          "मनोविज्ञान एवं विज्ञान प्रयोगशालाएं, पाठ्यचर्या संसाधन केंद्र, कंप्यूटर लैब और समृद्ध पुस्तकालय।",
        icon: Building2,
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

function SectionHeading({ title, description }) {
  return (
    <header className="mb-7 max-w-3xl sm:mb-9">
      <h2 className="text-2xl font-bold leading-tight tracking-tight text-[#25283A] sm:text-3xl lg:text-[34px]">
        {title}
      </h2>

      <div className="mt-3.5 h-0.5 w-12 rounded-full bg-[#FBDD23]" />

      <p className="mt-3.5 max-w-3xl text-sm leading-7 text-[#626879] sm:text-base sm:leading-8">
        {description}
      </p>
    </header>
  );
}

export function WhyChooseSection() {
  const { isHindi } = useLanguage();
  const content = isHindi ? BENEFITS.hi : BENEFITS.en;

  const colorThemes = [
    {
      border: "border-blue-200/90 hover:border-blue-500",
      bg: "bg-gradient-to-br from-blue-50/70 via-white to-white",
      iconBg: "bg-[#0a4b8c] text-[#FBDD23]",
      badge: "bg-blue-100 text-[#0a4b8c]",
      accent: "bg-[#0a4b8c]",
      hoverText: "group-hover:text-[#0a4b8c]",
    },
    {
      border: "border-emerald-200/90 hover:border-emerald-500",
      bg: "bg-gradient-to-br from-emerald-50/70 via-white to-white",
      iconBg: "bg-emerald-600 text-white",
      badge: "bg-emerald-100 text-emerald-800",
      accent: "bg-emerald-500",
      hoverText: "group-hover:text-emerald-800",
    },
    {
      border: "border-amber-200/90 hover:border-amber-500",
      bg: "bg-gradient-to-br from-amber-50/70 via-white to-white",
      iconBg: "bg-amber-500 text-gray-950",
      badge: "bg-amber-100 text-amber-900",
      accent: "bg-amber-500",
      hoverText: "group-hover:text-amber-800",
    },
    {
      border: "border-indigo-200/90 hover:border-indigo-500",
      bg: "bg-gradient-to-br from-indigo-50/70 via-white to-white",
      iconBg: "bg-indigo-600 text-white",
      badge: "bg-indigo-100 text-indigo-900",
      accent: "bg-indigo-600",
      hoverText: "group-hover:text-indigo-800",
    },
    {
      border: "border-rose-200/90 hover:border-rose-500",
      bg: "bg-gradient-to-br from-rose-50/70 via-white to-white",
      iconBg: "bg-[#c8102e] text-white",
      badge: "bg-rose-100 text-rose-900",
      accent: "bg-[#c8102e]",
      hoverText: "group-hover:text-[#c8102e]",
    },
    {
      border: "border-cyan-200/90 hover:border-cyan-500",
      bg: "bg-gradient-to-br from-cyan-50/70 via-white to-white",
      iconBg: "bg-cyan-600 text-white",
      badge: "bg-cyan-100 text-cyan-900",
      accent: "bg-cyan-500",
      hoverText: "group-hover:text-cyan-800",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-slate-50/60 to-white py-14 font-sans sm:py-16 lg:py-20 border-t border-slate-200/80">
      <Container>
        <div className="mb-8 sm:mb-10 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <SectionHeading
            title={content.title}
            description={content.description}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {content.items.map((item, index) => {
            const Icon = item.icon;
            const theme = colorThemes[index % colorThemes.length];

            return (
              <article
                key={item.title}
                className={`group relative flex min-w-0 flex-col justify-between overflow-hidden rounded-2xl border ${theme.border} ${theme.bg} p-6 shadow-xs transition-all duration-300 hover:-translate-y-2 hover:shadow-xl`}>
                {/* Top colored accent indicator line */}
                <div className={`absolute top-0 inset-x-0 h-1 ${theme.accent}`} />

                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${theme.iconBg} shadow-sm transition-transform duration-300 group-hover:scale-110`}>
                      <Icon aria-hidden="true" size={22} strokeWidth={2.2} />
                    </span>

                    <span className={`text-xs font-bold tabular-nums ${theme.badge} px-3 py-1 rounded-full uppercase tracking-wider`}>
                      {isHindi ? "स्तंभ " : "Pillar "}
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className={`text-base sm:text-lg font-bold leading-snug text-gray-900 transition-colors ${theme.hoverText}`}>
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-slate-600 font-normal">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 group-hover:text-gray-900 transition-colors">
                    {isHindi ? "शिक्षण उत्कृष्टता" : "Academic Rigor"}
                  </span>
                  <div className={`flex items-center gap-1 text-xs font-bold ${theme.hoverText}`}>
                    <span>{isHindi ? "विवरण देखें" : "Explore"}</span>
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
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
          <h3 className="mb-4 text-lg font-bold text-[#25283A] sm:text-xl">
            {content.exploreTitle}
          </h3>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {content.links.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className="group flex min-w-0 flex-col border border-[#E5E7EB] bg-white p-5 transition-all duration-200 hover:border-[#0a4b8c] hover:shadow-xs sm:p-6">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0a4b8c]/10 text-[#0a4b8c] transition-colors group-hover:bg-[#FBDD23] group-hover:text-gray-900">
                      <Icon aria-hidden="true" size={20} strokeWidth={2} />
                    </span>

                    <ArrowRight
                      aria-hidden="true"
                      size={18}
                      className="text-[#0a4b8c] transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </div>

                  <h4 className="text-base font-bold text-[#25283A] transition-colors group-hover:text-[#0a4b8c]">
                    {item.title}
                  </h4>

                  <p className="mt-2 flex-1 text-sm leading-6 text-[#626879]">
                    {item.description}
                  </p>

                  <span className="mt-4 border-t border-[#E5E7EB] pt-3 text-xs font-bold text-[#0a4b8c] group-hover:underline">
                    {isHindi ? "और जानें" : "Explore more"}
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

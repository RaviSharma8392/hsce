import { BriefcaseBusiness } from "lucide-react";
import { CollegiatePageLayout } from "../components/common/CollegiatePageLayout";
import { getAboutSidebarConfig } from "../data/navigationConfig";
import { useLanguage } from "../context/LanguageContext";

const managerMessage = {
  en: {
    title: "Manager's Desk",
    subtitle:
      "A message of guidance and commitment from Prof. Ajit Singh Dabas, Manager of Haryana Shakti College of Education.",
    eyebrow: "Institutional Leadership",
    heading: "Message from the Manager",
    message:
      "At Haryana Shakti College of Education, we believe that strong institutions are built through a shared commitment to quality education, discipline, and service. Our aim is to provide future teachers with the knowledge, practical skills, and values they need to guide the next generation. I encourage our students to remain curious, work with sincerity, and uphold the responsibility that comes with the teaching profession. Together, let us continue building an inclusive and supportive learning environment.",
    designation: "Manager",
    roleLabel: "Institutional Management",
    aboutLabel: "About",
    breadcrumb: "Manager's Desk",
  },
  hi: {
    title: "प्रबंधक का संदेश",
    subtitle:
      "हरियाणा शक्ति कॉलेज ऑफ एजुकेशन के प्रबंधक प्रो. अजीत सिंह डबास का मार्गदर्शन एवं संदेश।",
    eyebrow: "संस्थागत नेतृत्व",
    heading: "प्रबंधक का संदेश",
    message:
      "हरियाणा शक्ति कॉलेज ऑफ एजुकेशन में हमारा विश्वास है कि गुणवत्तापूर्ण शिक्षा, अनुशासन और सेवा के साझा संकल्प से ही सशक्त संस्थान बनते हैं। हमारा उद्देश्य भावी शिक्षकों को ऐसा ज्ञान, व्यावहारिक कौशल और मूल्य प्रदान करना है, जिनसे वे अगली पीढ़ी का मार्गदर्शन कर सकें। मैं विद्यार्थियों से आग्रह करता हूं कि वे जिज्ञासु बने रहें, ईमानदारी से परिश्रम करें और शिक्षण पेशे से जुड़ी जिम्मेदारी का सम्मान करें। आइए, मिलकर एक समावेशी और सहयोगपूर्ण शिक्षण वातावरण को निरंतर विकसित करें।",
    designation: "प्रबंधक",
    roleLabel: "संस्थागत प्रबंधन",
    aboutLabel: "कॉलेज परिचय",
    breadcrumb: "प्रबंधक का संदेश",
  },
};

export default function AboutManagerPage() {
  const { isHindi } = useLanguage();
  const content = isHindi ? managerMessage.hi : managerMessage.en;
  const sidebarConfig = getAboutSidebarConfig(isHindi);

  return (
    <CollegiatePageLayout
      bannerTitle={content.title}
      bannerSubtitle={content.subtitle}
      breadcrumbs={[
        { label: content.aboutLabel, href: "/about" },
        { label: content.breadcrumb },
      ]}
      sidebarTitle={sidebarConfig.title}
      sidebarItems={sidebarConfig.items}
      quickActions={sidebarConfig.quickActions}>
      <article className="rounded-md border border-gray-200/90 bg-white p-6 shadow-xs sm:p-8">
        <header className="mb-6 border-b border-gray-200 pb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2E3A8C]">
            {content.eyebrow}
          </span>
          <h2 className="mt-1 font-serif text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {content.heading}
          </h2>
          <div className="mt-3 h-1 w-20 rounded-full bg-[#2E3A8C]" />
        </header>

        <div className="grid items-start gap-8 md:grid-cols-12">
          <div className="md:col-span-5 lg:col-span-4">
            <div className="rounded-md border border-gray-200 bg-slate-50/70 p-4 text-center">
              <img
                src="/assets/people/prof-ajit-singh-dabas.png"
                alt="Prof. Ajit Singh Dabas"
                width="768"
                height="768"
                className="mx-auto aspect-square w-full max-w-xs rounded-md border border-gray-300/80 bg-white object-cover"
              />
              <h3 className="mt-3.5 font-serif text-lg font-bold text-slate-900">
                Prof. Ajit Singh Dabas
              </h3>
              <p className="text-xs font-semibold text-[#2E3A8C]">
                {content.designation}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Haryana Shakti College of Education
              </p>
            </div>
          </div>

          <div className="space-y-5 md:col-span-7 lg:col-span-8">
            <blockquote className="rounded-md border-l-4 border-[#2E3A8C] bg-slate-50 p-5 font-serif text-sm italic leading-relaxed text-slate-800 shadow-2xs sm:text-base">
              &ldquo;{content.message}&rdquo;
            </blockquote>
            <div className="flex items-center justify-between border-t border-gray-100 pt-5">
              <div>
                <h4 className="font-serif text-sm font-bold text-slate-900">
                  Prof. Ajit Singh Dabas
                </h4>
                <p className="text-xs text-slate-500">
                  {content.designation}, HSCE
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#2E3A8C]">
                <BriefcaseBusiness size={16} />
                <span>{content.roleLabel}</span>
              </div>
            </div>
          </div>
        </div>
      </article>
    </CollegiatePageLayout>
  );
}

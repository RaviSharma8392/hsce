import { Link } from "react-router-dom";
import {
  GraduationCap,
  BookOpen,
  FileText,
  Bell,
  Camera,
  PhoneCall,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export function QuickAccessSection() {
  const { isHindi } = useLanguage();

  const cards = [
    {
      title: isHindi ? "प्रवेश" : "Admissions",
      to: "/admissions",
      theme: "blue",
      icon: GraduationCap,
    },
    {
      title: isHindi ? "बी.एड. कोर्स" : "B.Ed. Course",
      to: "/course",
      theme: "blue",
      icon: BookOpen,
    },
    {
      title: isHindi ? "सिलेबस" : "Syllabus",
      to: "/syllabus",
      theme: "blue",
      icon: FileText,
    },
    {
      title: isHindi ? "सूचनाएं" : "Notices",
      to: "/notices",
      theme: "blue",
      icon: Bell,
    },
    {
      title: isHindi ? "गैलरी" : "Gallery",
      to: "/gallery",
      theme: "yellow",
      icon: Camera,
    },
    {
      title: isHindi ? "संपर्क" : "Contact",
      to: "/contact",
      theme: "yellow",
      icon: PhoneCall,
    },
  ];

  return (
    <section className="bg-[#F4F6FA] border-b border-gray-200/80 py-5 sm:py-6 font-sans">
      <div className="mx-auto max-w-[1440px] px-4 xl:px-8">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 xl:gap-6">
          {/* Section Header */}
          <div className="flex items-center gap-3 shrink-0 pr-2 lg:border-r border-gray-200">
            <span className="h-8 w-1 rounded-full bg-[#FBDD23] shrink-0" />
            <div>
              <h2 className="text-[17px] xl:text-[19px] font-extrabold text-[#2E3A8C] leading-tight">
                {isHindi ? "त्वरित लिंक" : "Quick Access"}
              </h2>
              <p className="text-[11px] text-gray-500 font-medium">
                {isHindi ? "कॉलेज के मुख्य अनुभाग देखें" : "Explore key institutional sections"}
              </p>
            </div>
          </div>

          {/* Solid Box Blocks Grid (HFCON Box Design Reference) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 flex-1">
            {cards.map((card) => {
              const isYellow = card.theme === "yellow";
              const Icon = card.icon;

              return (
                <Link
                  key={card.title}
                  to={card.to}
                  className={`flex min-h-[48px] sm:min-h-[52px] items-center justify-center gap-2 text-center rounded-md px-3 py-3 text-xs sm:text-[13px] font-bold uppercase tracking-wider shadow-xs transition-all duration-150 active:scale-[0.98] ${
                    isYellow
                      ? "bg-[#FBDD23] hover:bg-[#FFDC13] text-slate-900 hover:shadow-md"
                      : "bg-[#2E3A8C] hover:bg-[#232D70] text-white hover:shadow-md"
                  }`}>
                  <Icon size={16} strokeWidth={2.2} className="shrink-0" />
                  <span className="line-clamp-1">{card.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default QuickAccessSection;

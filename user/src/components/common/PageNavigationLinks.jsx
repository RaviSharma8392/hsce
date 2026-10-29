import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Users,
  Building,
  CreditCard,
  FileText,
  Phone,
  Award,
  Compass,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

const iconMap = {
  about: Building,
  course: BookOpen,
  admissions: GraduationCap,
  faculty: Users,
  fees: CreditCard,
  notices: FileText,
  contact: Phone,
  recognition: Award,
};

export function PageNavigationLinks({
  previousPage,
  nextPage,
  relatedLinks = [],
  title,
  hiTitle,
}) {
  const { isHindi } = useLanguage();

  return (
    <div className="mt-12 pt-10 border-t border-gray-200">
      {/* 1. Related Links Cards Grid */}
      {relatedLinks.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-6">
            <Compass size={18} className="text-[#2E3A8C]" />
            <h3 className="font-poppins font-bold text-lg sm:text-xl text-gray-900">
              {isHindi
                ? hiTitle || "संबंधित महत्वपूर्ण पृष्ठ"
                : title || "Explore Related Sections"}
            </h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedLinks.map((item, idx) => {
              const IconComponent = iconMap[item.iconKey] || BookOpen;
              return (
                <Link
                  key={idx}
                  to={item.to}
                  className="group rounded-xl border border-gray-200 bg-white p-5 shadow-xs hover:border-[#1c3274]/50 hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-[#1c3274]/10 text-[#1c3274] group-hover:bg-[#1c3274] group-hover:text-white transition-colors flex items-center justify-center mb-3">
                      <IconComponent size={20} />
                    </div>
                    <h4 className="font-poppins font-bold text-gray-900 text-sm sm:text-base group-hover:text-[#1c3274] transition-colors mb-1">
                      {isHindi ? item.hiTitle || item.title : item.title}
                    </h4>
                    <p className="text-xs text-gray-600 line-clamp-2 font-sans leading-relaxed">
                      {isHindi
                        ? item.hiDescription || item.description
                        : item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-[#1c3274]">
                    <span>{isHindi ? "विस्तार से देखें" : "View Details"}</span>
                    <ArrowRight
                      size={14}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Previous & Next Page Walkthrough Bar */}
      {(previousPage || nextPage) && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
          {previousPage ? (
            <Link
              to={previousPage.to}
              className="group flex items-center gap-3 text-gray-700 hover:text-[#1c3274] transition w-full sm:w-auto">
              <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 group-hover:border-[#1c3274] group-hover:text-[#1c3274] transition shadow-2xs">
                <ArrowLeft size={16} />
              </div>
              <div className="text-left">
                <span className="block text-[11px] text-gray-500 uppercase font-medium">
                  {isHindi ? "पिछला पृष्ठ" : "Previous Page"}
                </span>
                <span className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#1c3274] transition font-poppins">
                  {isHindi
                    ? previousPage.hiTitle || previousPage.title
                    : previousPage.title}
                </span>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextPage ? (
            <Link
              to={nextPage.to}
              className="group flex items-center gap-3 text-gray-700 hover:text-[#1c3274] transition sm:flex-row-reverse w-full sm:w-auto justify-end">
              <div className="w-9 h-9 rounded-lg bg-[#1c3274] text-white flex items-center justify-center group-hover:bg-[#15275a] transition shadow-2xs">
                <ArrowRight size={16} />
              </div>
              <div className="text-left sm:text-right">
                <span className="block text-[11px] text-gray-500 uppercase font-medium">
                  {isHindi ? "अगला पृष्ठ" : "Next Page"}
                </span>
                <span className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#1c3274] transition font-poppins">
                  {isHindi ? nextPage.hiTitle || nextPage.title : nextPage.title}
                </span>
              </div>
            </Link>
          ) : (
            <div />
          )}
        </div>
      )}
    </div>
  );
}

export default PageNavigationLinks;

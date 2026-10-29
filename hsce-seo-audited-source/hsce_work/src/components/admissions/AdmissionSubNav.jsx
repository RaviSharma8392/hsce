import React from "react";
import { NavLink } from "react-router-dom";
import {
  FileText,
  CheckCircle2,
  ListOrdered,
  FolderCheck,
  GraduationCap,
  Calendar,
} from "lucide-react";
import { Container } from "../common/Container";
import { useLanguage } from "../../context/LanguageContext";
import { useAdmissionModal } from "../../context/AdmissionModalContext";

export const admissionTabs = [
  {
    id: "overview",
    to: "/admissions/overview",
    icon: FileText,
    label: "Admission Overview",
    hiLabel: "प्रवेश अवलोकन",
  },
  {
    id: "eligibility",
    to: "/admissions/eligibility",
    icon: CheckCircle2,
    label: "Eligibility Criteria",
    hiLabel: "पात्रता मापदंड",
  },
  {
    id: "procedure",
    to: "/admissions/procedure",
    icon: ListOrdered,
    label: "Admission Procedure",
    hiLabel: "प्रवेश प्रक्रिया",
  },
  {
    id: "documents",
    to: "/admissions/documents",
    icon: FolderCheck,
    label: "Required Documents",
    hiLabel: "आवश्यक दस्तावेज",
  },
];

export function AdmissionSubNav({ activeTabId = "overview" }) {
  const { isHindi } = useLanguage();
  const { openAdmissionModal } = useAdmissionModal();

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
      <Container>
        <div className="flex items-center justify-between gap-3 overflow-x-auto no-scrollbar py-2.5">
          {/* Tabs Group */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-nowrap shrink-0">
            {admissionTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTabId === tab.id;
              const text = isHindi ? tab.hiLabel : tab.label;

              return (
                <NavLink
                  key={tab.id}
                  to={tab.to}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-[13px] font-semibold font-poppins transition whitespace-nowrap ${
                    isActive
                      ? "bg-[#c8102e] text-white shadow-2xs font-bold"
                      : "text-gray-700 hover:text-[#c8102e] hover:bg-red-50/70"
                  }`}>
                  <Icon size={15} />
                  <span>{text}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 shrink-0 pl-2">
            <NavLink
              to="/contact/enquiry"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-amber-300 bg-amber-50 text-amber-900 text-xs font-bold hover:bg-amber-100 transition whitespace-nowrap shadow-2xs">
              <span>{isHindi ? "प्रवेश पूछताछ" : "Admission Enquiry"}</span>
            </NavLink>

            <button
              type="button"
              onClick={() => openAdmissionModal()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gray-900 text-white text-xs font-bold hover:bg-black transition whitespace-nowrap shadow-2xs cursor-pointer">
              <GraduationCap size={15} className="text-amber-400" />
              <span>{isHindi ? "ऑनलाइन आवेदन" : "Apply Online"}</span>
            </button>

            <NavLink
              to="/book-a-tour"
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-gray-300 text-gray-700 text-xs font-semibold hover:border-[#c8102e] hover:text-[#c8102e] transition whitespace-nowrap">
              <Calendar size={14} />
              <span>{isHindi ? "कैंपस टूर बुक करें" : "Book Campus Tour"}</span>
            </NavLink>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default AdmissionSubNav;

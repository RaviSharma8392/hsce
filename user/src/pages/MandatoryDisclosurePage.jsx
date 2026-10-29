import { useState } from "react";
import { FileText, CalendarDays, FolderOpen, ArrowUpRight } from "lucide-react";
import AdobePdfIcon from "../components/common/AdobePdfIcon";
import { CollegiatePageLayout } from "../components/common/CollegiatePageLayout";
import { getGovernanceSidebarConfig } from "../data/navigationConfig";
import { useLanguage } from "../context/LanguageContext";
import { usePublishedRecords } from "../hooks/usePublishedRecords";

const disclosureTitles = [
  "(A) Institute Information",
  "(B) Details of Academic Programmes",
  "1. Status of Accreditation",
  "2. Status of Teachers Availability",
  "2(a). List of Students (session 2024 - 2026)",
  "2(a) List of Students (session 2023-2025)",
  "2(b). No of Regular Teachers and Teachers Ratio",
  "3. Quality of Teachers and Teaching",
  "3(a). No of Teachers with Ph.D",
  "3(b.) (c.) (d.) Publications",
  "3 (e.) Courseteaching plan with details of number of lectures on each unit of curriculum in the assessment year",
  "3(f). No of Courses on LMS",
  "3 (g) classrooms available with mounted projectors and ict facilities",
  "3(h). Percentage of Teachers using ICT",
  "4. Institutional Support for Faculty Development",
  "4(a) Documentary evidence of Awards",
  "4(b) Documentary evidence of mechanisms",
  "4(c) Documentary evidence of Grant of Funds",
  "4(d) Individual computing facilities with internet",
  "5. Framework for Students’ Grievance Redressal Mechanism",
  "5(a)",
  "Framework for Students’ Grievance Redressal Mechanism",
  "6. Institutional support",
  "6. Centre Acceptance December 2025",
  "6. Institutional Support for University Examinations",
  "6. Institutional Support for University Examinations (1)",
  "6) Institutional Support Evidence",
  "6. Evidence",
  "7. Status of Library",
  "7. Status of Library Photographs",
  "7. Status of Library (Library Bills)",
  "Delnet Certificate",
  "8) Photos of Labs",
  "8. Status of Labs",
  "8. Broadband and electricity bill",
  "8. Stock Register",
  "9. Co-Curricular Activities Conducted by the Institution (Assessment Year)",
  "9) CCA Evidence",
  "9 (e) HSCE Value Added Courses Report",
  "10. Publications of the Institutions",
  "10(b) Newsletter Latest HSCE Chronicle 2023 - 24",
  "10 (b) HSCE Annual Magazine Reflections",
  "10 (b) Publication of Magazine",
  "11. Students’ Personality Development Activities",
  "11(a)Activities.pdf",
  "11(b)",
  "11 (c) Sports bill",
  "11(c) Sports facilities in the Institutions",
  "12. Placement Cell",
  "12. Placement List",
  "13. General parameters about the institution",
  "14 (a) and (b)",
  "14 (a) and (b) (1)",
];

const documentUrls = {};

const createDisclosureDocuments = () =>
  disclosureTitles.map((title, index) => ({
    id: index + 1,
    title,
    url: documentUrls[index + 1] || "",
  }));

const disclosureData = {
  "2025-2026": createDisclosureDocuments(),
  "2024-2025": createDisclosureDocuments(),
};

const fallbackSessions = ["2025-2026", "2024-2025"];

export default function MandatoryDisclosurePage() {
  const { isHindi } = useLanguage();
  const sidebarConfig = getGovernanceSidebarConfig(isHindi);

  const [selectedSession, setSelectedSession] = useState("");
  const publishedDocuments = usePublishedRecords("documents", [], {
    limitCount: 100,
  });
  const publishedSessions = [
    ...new Set(
      publishedDocuments
        .map((document) => String(document.session || "").trim())
        .filter(Boolean),
    ),
  ].sort((left, right) => {
    const leftYear = Number(left.match(/\d{4}/)?.[0] || 0);
    const rightYear = Number(right.match(/\d{4}/)?.[0] || 0);
    return rightYear - leftYear;
  });
  const sessions = [...new Set([...publishedSessions, ...fallbackSessions])];

  const session = sessions.includes(selectedSession)
    ? selectedSession
    : sessions[0];

  const liveDocuments = publishedDocuments
    .filter((document) => String(document.session || "").trim() === session)
    .map((document) => ({
      id: document.id,
      title: document.title,
      url: document.url || "",
    }));
  const sessionDocuments = liveDocuments.length
    ? liveDocuments
    : disclosureData[session] || [];

  const labels = {
    eyebrow: isHindi ? "सार्वजनिक दस्तावेज़" : "PUBLIC DISCLOSURES",
    heading: isHindi ? "अनिवार्य प्रकटीकरण (NCTE & GGSIPU)" : "Mandatory Disclosure (NCTE & GGSIPU)",
    description: isHindi
      ? "राष्ट्रीय अध्यापक शिक्षा परिषद एवं विश्वविद्यालय के मानकों के अनुसार संस्थागत अनिवार्य प्रकटीकरण प्रपत्र।"
      : "Official statutory disclosures, institutional compliance parameters, and regulatory reports organized by academic session.",
    session: isHindi ? "शैक्षणिक सत्र" : "Academic Session",
    documents: isHindi ? "दस्तावेज़" : "Documents",
    listed: isHindi ? "दस्तावेज़ उपलब्ध" : "documents listed",
    openDocument: isHindi ? "दस्तावेज़ खोलें" : "Open document",
  };

  return (
    <CollegiatePageLayout
      bannerTitle={isHindi ? "अनिवार्य प्रकटीकरण" : "Mandatory Disclosure"}
      bannerSubtitle={
        isHindi
          ? "राष्ट्रीय अध्यापक शिक्षा परिषद (NCTE) के वैधानिक प्रकटीकरण नियम एवं संस्थागत अभिलेख।"
          : "Regulatory transparency documents and annual institutional disclosures as prescribed by NCTE."
      }
      breadcrumbs={[
        { label: isHindi ? "वैधानिक प्रकटीकरण" : "Governance" },
        { label: isHindi ? "अनिवार्य प्रकटीकरण" : "Mandatory Disclosure" },
      ]}
      sidebarTitle={sidebarConfig.title}
      sidebarItems={sidebarConfig.items}
      quickActions={sidebarConfig.quickActions}>
      <div className="space-y-6">
        {/* Main Panel with Image 3 Style Lavender Bar */}
        <div className="overflow-hidden rounded-md border border-gray-200/90 bg-white shadow-xs">
          {/* Lavender Header Bar (Image 3 Style) */}
          <div className="bg-[#E4E7F5] px-6 py-4 border-b border-gray-200/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#2E3A8C]">
              {labels.eyebrow}
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1E242C] tracking-tight">
              {labels.heading}
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 font-sans">
              {labels.description}
            </p>
          </div>

          {/* Session Selector */}
          <div className="border-b border-gray-200/80 px-5 py-4 bg-slate-50/60 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <CalendarDays size={16} className="text-[#2E3A8C]" />
              <span>{labels.session}:</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {sessions.map((item) => {
                const isActive = item === session;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setSelectedSession(item)}
                    className={`rounded px-3.5 py-1.5 text-xs font-bold transition border cursor-pointer ${
                      isActive
                        ? "border-[#2E3A8C] bg-[#2E3A8C] text-white shadow-xs"
                        : "border-gray-300 bg-white text-slate-700 hover:border-[#2E3A8C] hover:text-[#2E3A8C]"
                    }`}>
                    {item.replace("-", "–")}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Session Summary Pill */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-white text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <FolderOpen size={16} className="text-[#2E3A8C]" />
              <span>Session {session.replace("-", "–")}</span>
            </div>
            <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded font-bold">
              {sessionDocuments.length} {labels.listed}
            </span>
          </div>

          {/* Documents Grid / Zebra Rows */}
          <ul className="grid grid-cols-1 divide-y divide-gray-100">
            {sessionDocuments.map((document, index) => (
              <li
                key={document.id}
                className={`group flex items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-blue-50/40 ${
                  index % 2 === 1 ? "bg-slate-50/50" : "bg-white"
                }`}>
                <div className="flex items-start gap-3 min-w-0">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-red-50 text-red-600 mt-0.5">
                    <AdobePdfIcon size={18} />
                  </span>
                  <div className="min-w-0">
                    {document.url ? (
                      <a
                        href={document.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block break-words text-xs sm:text-sm font-semibold text-slate-800 hover:text-[#2E3A8C] hover:underline">
                        {document.title}
                      </a>
                    ) : (
                      <p className="break-words text-xs sm:text-sm font-semibold text-slate-800">
                        {document.title}
                      </p>
                    )}
                    <span className="text-[11px] text-slate-400">
                      Session {session.replace("-", "–")} • NCTE Compliance Record
                    </span>
                  </div>
                </div>

                {document.url && (
                  <a
                    href={document.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-slate-100 text-slate-600 hover:bg-[#2E3A8C] hover:text-white transition">
                    <ArrowUpRight size={15} />
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </CollegiatePageLayout>
  );
}

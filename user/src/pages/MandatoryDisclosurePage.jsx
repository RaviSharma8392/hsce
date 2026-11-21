import { useState } from "react";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import { CollegiatePageLayout } from "../components/common/CollegiatePageLayout";
import { getGovernanceSidebarConfig } from "../data/navigationConfig";
import { useLanguage } from "../context/LanguageContext";

const disclosureSections = [
  {
    id: "A",
    title: "A. Institute Information",
  },
  {
    id: "B",
    title: "B. Details of Academic Programmes",
    children: [
      "B(a). Details of Academic Year",
      "B(b). Faculty List",
      "B(c). Timetable",
    ],
  },

  {
    id: "2",
    title: "2. Status of Teachers Availability",
    children: [
      "2(a). List of Students (session 2024 - 2026)",
      "2(a). List of Students (session 2025-2027)",
      "2(b). Faculty List",
    ],
  },
  {
    id: "3",
    title: "3. Quality of teachers and training",
    children: [
      "3(a). No. of teachers with Ph.D 2026",
      "3(b,c,d). Publications of the Faculty audit 2025-27",
      "3(e). Course teaching plan",
      "3(f). No of Courses on LMS",
      "3(g). Classrooms available with mounted projectors and ICT facilities",
      "3(h). Teachers using ICT",
    ],
  },
  {
    id: "4",
    title: "4. Institutional Support for Faculty Development",
    children: [
      "4(a). Documentary evidence of Awards",
      "4(b). Documentary evidence of mechanisms for study leave grant",
      "4(c). Documentary evidence of Grant of Funds",
      "4(d). Individual computing facilities with internet",
    ],
  },
  { id: "5", title: "5. SGRC Report" },
  {
    id: "6",
    title: "6. Institutional Support for University Examinations",
    children: ["6(a). Institutional Support Evidence"],
  },
  {
    id: "7",
    title: "7. Status of Library",
    children: [
      "7(a). Status of Library (Photographs)",
      "7(b). Library Status",
      "7(c). Library Bills",
      "7(d). Delnet Certificate",
    ],
  },
  {
    id: "8",
    title: "8. Status of Labs",
    children: ["8(a). Status of Labs (Photographs)"],
  },
  {
    id: "9",
    title:
      "9. Co-Curricular Activities Conducted by the Institution (Assessment Year)",
    children: [
      "9(a). CCA Evidence",
      "9(b). Seminar on Glimpses on multiple childhood",
      "9(c). Faculty Development Programme 10-14 Nov 2025",
      "9(d). Workshop",
      "9(e). Value Added Courses",
    ],
  },
  {
    id: "10",
    title: "10. Publications of the Institutions",
    children: [
      "10(a). Magazine",
      "10(b). Newsletter Latest SLCHE Chronicle 2025 - 26",
    ],
  },
  {
    id: "11",
    title: "11. Students’ Personality Development Activities",
    children: [
      "11(a). Activities",
      "11(b). Personality development labs, Provisions for trained faculty to conduct practical sessions and existence of qualified student counsellors",
      "11(c). Sports facilities in the Institutions",
    ],
  },
  {
    id: "12",
    title: "12. Status of Placement",
    children: [
      "12(a). Placement list for Assessment year",
      "12(b). Placement Cell",
    ],
  },
  {
    id: "13",
    title: "13. General parameters about the Institution (Format)",
    children: ["13(a). General Parameters about the Institution (Evidence)"],
  },
  {
    id: "14",
    title: "14. Feedback from Faculty and Students",
    children: ["14(a,b). Feedback Analysis"],
  },
];

const disclosureSections2024 = [
  {
    id: "A",
    title: "(A) Institute Information",
  },
  {
    id: "B",
    title: "(B) Details of Academic Programmes",
  },
  {
    id: "1",
    title: "1. Status of Accreditation",
    children: ["Point 1. Status of Accreditation (NOC 2024)"],
  },

  {
    id: "2",
    title: "2. Status of Teachers Availability",
    children: [
      "2(a). List of Students (session 2024 - 2026)",
      "2(a). List of Students (session 2023-2025)",
      "2(b). No of Regular Teachers and Teachers Ratio",
    ],
  },
  {
    id: "3",
    title: "3. Quality of Teachers and Teaching",
    children: [
      "3(a). No of Teachers with Ph.D",
      "3(b.) (c.) (d.) Publications",
      "3(e). Course teaching plan with details of number of lectures on each unit of curriculum in the assessment year",
      "3(f). No of Courses on LMS",
      "3(g). Classrooms available with mounted projectors and ICT facilities",
      "3(h). Percentage of Teachers using ICT",
    ],
  },
  {
    id: "4",
    title: "4. Institutional Support for Faculty Development",
    children: [
      "4(a). Documentary evidence of Awards",
      "4(b). Documentary evidence of mechanisms",
      "4(c). Documentary evidence of Grant of Funds",
      "4(d). Individual computing facilities with internet",
    ],
  },
  {
    id: "5",
    title: "5. Framework for Students’ Grievance Redressal Mechanism",
    children: ["5(a)"],
  },
  {
    id: "6",
    title: "6. Institutional Support",
    children: [
      "6. Centre Acceptance December 2025",
      "6. Institutional Support for University Examinations",
      "6. Institutional Support for University Examinations (1)",
      "6) Institutional Support Evidence",
      "6. Evidence",
    ],
  },
  {
    id: "7",
    title: "7. Status of Library",
    children: [
      "7. Status of Library Photographs",
      "7. Status of Library (Library Bills)",
      "Delnet Certificate",
    ],
  },
  {
    id: "8",
    title: "8. Status of Labs",
    children: [
      "8) Photos of Labs",
      "8. Broadband and electricity bill",
      "8. Stock Register",
    ],
  },
  {
    id: "9",
    title:
      "9. Co-Curricular Activities Conducted by the Institution (Assessment Year)",
    children: ["9) CCA Evidence", "9(e). SLCHE Value Added Courses Report"],
  },
  {
    id: "10",
    title: "10. Publications of the Institutions",
    children: [
      "10(b). Newsletter Latest SLCHE Chronicle 2023 - 24",
      "10(b). SLCHE Annual Magazine Reflections",
      "10(b). Publication of Magazine",
    ],
  },
  {
    id: "11",
    title: "11. Students’ Personality Development Activities",
    children: [
      "11(a) Activities",
      "11(b)",
      "11(c) Sports bill",
      "11(c). Sports facilities in the Institutions",
    ],
  },
  {
    id: "12",
    title: "12. Placement",
    children: ["12. Placement Cell", "12. Placement List"],
  },
  { id: "13", title: "13. General parameters about the institution" },
  {
    id: "14",
    title: "14. Feedback",
    children: ["14(a) and (b)", "14(a) and (b) (1)"],
  },
];

const sessions = ["2025-2026", "2024-2025"];

export default function MandatoryDisclosurePage() {
  const { isHindi } = useLanguage();
  const sidebarConfig = getGovernanceSidebarConfig(isHindi);

  const [selectedSession, setSelectedSession] = useState(sessions[0]);
  const session = selectedSession;
  const activeSections =
    session === "2025-2026" ? disclosureSections : disclosureSections2024;
  const getDocumentUrl = (title) => {
    const normalized = String(title || "").toLowerCase();
    if (normalized.includes("hsce college brochure")) {
      return `/documents/mandatory-disclosure/${session}/A-institute-information/hsce-college-brochure.pdf`;
    }
    if (normalized.includes("nrcapp")) {
      return `/documents/mandatory-disclosure/${session}/1-status-of-accreditation/nrcapp-81.pdf`;
    }
    if (normalized.includes("noc 2024")) {
      return `/documents/mandatory-disclosure/${session}/1-status-of-accreditation/noc-2024.pdf`;
    }
    if (normalized.includes("institute information")) {
      return `/documents/mandatory-disclosure/${session}/A-institute-information/hsce-college-brochure.pdf`;
    }
    return "";
  };
  const totalTitles = activeSections.reduce(
    (count, section) => count + 1 + (section.children?.length || 0),
    0,
  );

  const labels = {
    eyebrow: isHindi ? "सार्वजनिक दस्तावेज़" : "PUBLIC DISCLOSURES",
    heading: isHindi
      ? "अनिवार्य प्रकटीकरण (NCTE & GGSIPU)"
      : "Mandatory Disclosure (NCTE & GGSIPU)",
    description: isHindi
      ? "राष्ट्रीय अध्यापक शिक्षा परिषद एवं विश्वविद्यालय के मानकों के अनुसार संस्थागत अनिवार्य प्रकटीकरण प्रपत्र।"
      : "Official statutory disclosures, institutional compliance parameters, and regulatory reports organized by academic session.",
    session: isHindi ? "शैक्षणिक सत्र" : "Academic Session",
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
      <div className="overflow-hidden rounded-md border border-gray-200/90 bg-white shadow-xs">
        <header className="border-b border-gray-200/80 bg-[#E4E7F5] px-6 py-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#2E3A8C]">
            {labels.eyebrow}
          </span>
          <h2 className="font-serif text-xl font-bold tracking-tight text-[#1E242C] sm:text-2xl">
            {labels.heading}
          </h2>
          <p className="mt-1 text-xs text-slate-600 sm:text-sm">
            {labels.description}
          </p>
        </header>

        <div className="flex items-center justify-between gap-3 border-b border-gray-200 bg-slate-50 px-5 py-3.5">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <CalendarDays size={17} className="text-[#2E3A8C]" />
            <span>{labels.session}:</span>
          </div>
          <div className="flex gap-2">
            {sessions.map((item) => {
              const isActive = item === session;
              return (
                <button
                  key={item}
                  type="button"
                  aria-current={isActive ? "true" : undefined}
                  onClick={() => setSelectedSession(item)}
                  className={`rounded border px-3.5 py-1.5 text-xs font-bold transition-colors ${
                    isActive
                      ? "border-[#2E3A8C] bg-[#2E3A8C] text-white"
                      : "border-gray-300 bg-white text-slate-700 hover:border-[#2E3A8C] hover:text-[#2E3A8C]"
                  }`}>
                  {item.replace("-", "–")}
                </button>
              );
            })}
          </div>
        </div>

        <div className="min-h-[32rem]">
          <section className="min-w-0">
            <header className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 px-5 py-4">
              <div>
                <h1 className="font-serif text-xl font-bold text-slate-900">
                  {isHindi ? "दस्तावेज़" : "Documents"}
                </h1>
                <p className="mt-0.5 text-xs text-slate-500">
                  Session {session.replace("-", "–")}
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                {session.replace("-", "–")} · {totalTitles} {labels.listed}
              </span>
            </header>

            <div className="divide-y divide-gray-200">
              {activeSections.map((category) => (
                <section key={category.id} className="px-5 py-4 sm:px-6">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="h-5 w-1 rounded-full bg-[#D59A24]" />
                    {getDocumentUrl(category.title) ? (
                      <a
                        href={getDocumentUrl(category.title)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex min-w-0 items-center gap-1.5 font-serif text-sm font-bold text-slate-900 hover:text-[#2E3A8C]">
                        <span>{category.title}</span>
                        <ArrowUpRight
                          size={14}
                          className="shrink-0 text-slate-400 group-hover:text-[#2E3A8C]"
                        />
                      </a>
                    ) : (
                      <h2 className="font-serif text-sm font-bold text-slate-900">
                        {category.title}
                      </h2>
                    )}
                  </div>
                  {category.children?.length > 0 && (
                    <ul className="ml-2 space-y-1 border-l border-slate-200 pl-4 sm:ml-3 sm:pl-5">
                      {category.children.map((title) => {
                        const url = getDocumentUrl(title);
                        return (
                          <li
                            key={title}
                            className="break-words rounded px-2 py-1.5 text-sm leading-relaxed">
                            {url ? (
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-start gap-1.5 text-slate-700 hover:text-[#2E3A8C] hover:underline">
                                <span>{title}</span>
                                <ArrowUpRight
                                  size={13}
                                  className="mt-0.5 shrink-0 text-slate-400 group-hover:text-[#2E3A8C]"
                                />
                              </a>
                            ) : (
                              <span className="text-slate-700">{title}</span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </section>
              ))}
            </div>
          </section>
        </div>
      </div>
    </CollegiatePageLayout>
  );
}

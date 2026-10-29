import { useState } from "react";
import { FileText, CalendarDays, FolderOpen, ArrowUpRight } from "lucide-react";
import { Helmet } from "react-helmet-async";
import AdobePdfIcon from "../components/common/AdobePdfIcon";
import { Container } from "../components/common/Container";
import { PageHeaderBanner } from "../components/common/PageHeaderBanner";
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
  "9 (e) SLCHE Value_Added_Courses_Report",
  "10. Publications of the Institutions",
  "10(b) Newsletter Latest SLCHE Chronicle 2023 - 24",
  "10 (b) SLCHE Annual Magazine Reflections",
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

// Preserve identical titles and order for both sessions.
// Add real PDF paths to documentUrls when they are available.
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
    eyebrow: isHindi ? "सार्वजनिक दस्तावेज़" : "PUBLIC DOCUMENTS",
    heading: isHindi ? "अनिवार्य प्रकटीकरण" : "Mandatory Disclosure",
    description: isHindi
      ? "शैक्षणिक सत्र के अनुसार संस्थान के दस्तावेज़ देखें।"
      : "Access institutional disclosure documents organized by academic session.",
    session: isHindi ? "शैक्षणिक सत्र" : "Academic Session",
    documents: isHindi ? "दस्तावेज़" : "Documents",
    listed: isHindi ? "दस्तावेज़ सूची" : "documents listed",
    openDocument: isHindi ? "दस्तावेज़ खोलें" : "Open document",
    noLink: isHindi ? "PDF लिंक अभी उपलब्ध नहीं है" : "PDF link not configured",
  };

  return (
    <>
      <Helmet>
        <title>
          {isHindi
            ? "अनिवार्य प्रकटीकरण | हरियाणा शक्ति कॉलेज ऑफ एजुकेशन"
            : "Mandatory Disclosure | Haryana Shakti College of Education"}
        </title>
        <meta
          name="description"
          content="Mandatory disclosure documents for Haryana Shakti College of Education, organized by academic session."
        />
      </Helmet>

      <PageHeaderBanner
        title={isHindi ? "अनिवार्य प्रकटीकरण" : "Mandatory Disclosure"}
        subtitle={
          isHindi
            ? "शैक्षणिक सत्र के अनुसार संस्थागत दस्तावेज़"
            : "Institutional documents organized by academic session."
        }
        breadcrumbs={[
          {
            label: isHindi ? "अनिवार्य प्रकटीकरण" : "Mandatory Disclosure",
          },
        ]}
      />

      <main className="bg-[#F7F8FA] py-8 sm:py-12">
        <Container>
          <section
            aria-labelledby="disclosure-heading"
            className="mx-auto max-w-6xl">
            {/* Page introduction */}
            <div className="mb-7">
              <div className="mb-3 flex items-center gap-2">
                <span className="h-1 w-8 rounded-full bg-[#FBDD23]" />
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#363991]">
                  {labels.eyebrow}
                </p>
              </div>

              <h2
                id="disclosure-heading"
                className="text-2xl font-bold tracking-tight text-[#292C75] sm:text-3xl">
                {labels.heading}
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#626879] sm:text-base">
                {labels.description}
              </p>
            </div>

            {/* Main panel */}
            <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
              {/* Session selector */}
              <div className="border-b border-[#E5E7EB] px-4 py-5 sm:px-6 sm:py-6">
                <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#292C75]">
                  <CalendarDays
                    size={18}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                  <span>{labels.session}</span>
                </div>

                <div
                  className="flex flex-wrap gap-2"
                  role="group"
                  aria-label={labels.session}>
                  {sessions.map((item) => {
                    const isActive = session === item;

                    return (
                      <button
                        key={item}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => setSelectedSession(item)}
                        className={`min-h-10 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#363991] focus-visible:ring-offset-2 ${
                          isActive
                            ? "border-[#292C75] bg-[#292C75] text-white"
                            : "border-[#E5E7EB] bg-white text-[#4B5263] hover:border-[#363991] hover:bg-[#F7F8FA] hover:text-[#292C75]"
                        }`}>
                        {item.replace("-", "–")}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected session summary */}
              <div className="flex flex-col gap-3 border-b border-[#E5E7EB] bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F0F1FB] text-[#363991]">
                    <FolderOpen
                      size={20}
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-semibold text-[#25283A]">
                      {session.replace("-", "–")}
                    </h3>
                    <p className="mt-0.5 text-xs text-[#626879]">
                      {labels.documents}
                    </p>
                  </div>
                </div>

                <span className="inline-flex w-fit shrink-0 items-center rounded-md bg-[#F7F8FA] px-3 py-2 text-xs font-semibold text-[#626879]">
                  {sessionDocuments.length} {labels.listed}
                </span>
              </div>

              {/* Documents */}
              <ul
                className="grid grid-cols-1 sm:grid-cols-2"
                aria-label={`${labels.documents}: ${session}`}>
                {sessionDocuments.map((document, index) => (
                  <li
                    key={document.id}
                    className={`group flex min-w-0 items-center gap-3 border-b border-[#E5E7EB] px-4 py-4 transition-colors hover:bg-[#FAFAFC] sm:px-5 ${
                      index % 2 === 0 ? "sm:border-r" : ""
                    }`}>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 transition-colors group-hover:bg-red-100">
                      <AdobePdfIcon size={22} />
                    </span>

                    <div className="min-w-0 flex-1">
                      {document.url ? (
                        <a
                          href={document.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${labels.openDocument}: ${document.title}`}
                          className="block break-words text-sm font-medium leading-6 text-[#25283A] transition-colors hover:text-[#363991] hover:underline">
                          {document.title}
                        </a>
                      ) : (
                        <p className="break-words text-sm font-medium leading-6 text-[#25283A]">
                          {document.title}
                        </p>
                      )}

                      <p className="mt-1 text-xs text-[#858A98]">
                        {session.replace("-", "–")}
                      </p>
                    </div>

                    {document.url ? (
                      <a
                        href={document.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${labels.openDocument}: ${document.title}`}
                        title={labels.openDocument}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#858A98] transition-colors hover:bg-[#F0F1FB] hover:text-[#363991] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#363991]">
                        <ArrowUpRight size={17} aria-hidden="true" />
                      </a>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-4 text-xs leading-5 text-[#858A98]">
              {isHindi
                ? "नोट: दस्तावेज़ खोलने के लिए संबंधित PDF लिंक उपलब्ध होना आवश्यक है।"
                : "Note: A valid PDF URL must be configured to open a document."}
            </p>
          </section>
        </Container>
      </main>
    </>
  );
}

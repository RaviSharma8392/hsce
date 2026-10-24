import React, { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import {
  Download,
  ExternalLink,
  FileText,
  ChevronRight,
  BookOpen,
  Info,
} from "lucide-react";

import { Container } from "../components/common/Container";
import { PageHeaderBanner } from "../components/common/PageHeaderBanner";
import {
  fetchAllSyllabusItems,
  defaultSyllabusItems,
} from "../services/syllabusService";
import { useLanguage } from "../context/LanguageContext";

function formatPublicationDate(value) {
  if (!value) return "";
  const date =
    typeof value?.toDate === "function" ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleDateString("en-IN");
}

export default function SyllabusPage() {
  const { isHindi } = useLanguage();

  const [syllabusList, setSyllabusList] = useState(defaultSyllabusItems);
  const [selectedId, setSelectedId] = useState(
    defaultSyllabusItems?.[0]?.id ?? null,
  );
  const [loading, setLoading] = useState(true);
  const [pdfError, setPdfError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadSyllabus() {
      try {
        const items = await fetchAllSyllabusItems();

        if (isMounted && items?.length > 0) {
          setSyllabusList(items);

          setSelectedId((currentId) =>
            items.some((item) => item.id === currentId)
              ? currentId
              : items[0].id,
          );
        }
      } catch (error) {
        console.error("Unable to load syllabus:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadSyllabus();

    return () => {
      isMounted = false;
    };
  }, []);

  const activeItem = useMemo(
    () =>
      syllabusList.find((item) => item.id === selectedId) ||
      syllabusList[0] ||
      {},
    [syllabusList, selectedId],
  );

  // Reset the PDF error whenever a different syllabus is selected.
  useEffect(() => {
    setPdfError(false);
  }, [activeItem.pdfUrl]);

  const pdfUrl = activeItem.pdfUrl || "";

  const text = {
    syllabus: isHindi ? "पाठ्यक्रम" : "Syllabus",
    chooseYear: isHindi ? "शैक्षणिक सत्र चुनें" : "Select Academic Session",
    selectSession: isHindi
      ? "जिस सत्र का पाठ्यक्रम देखना है, उसे चुनें।"
      : "Choose a session to view its syllabus.",
    document: isHindi ? "पाठ्यक्रम दस्तावेज़" : "Syllabus Document",
    download: isHindi ? "PDF डाउनलोड करें" : "Download PDF",
    open: isHindi ? "नए टैब में खोलें" : "Open in New Tab",
    loading: isHindi ? "पाठ्यक्रम लोड हो रहा है..." : "Loading syllabus...",
    noPdf: isHindi
      ? "इस सत्र के लिए PDF अभी उपलब्ध नहीं है।"
      : "No PDF is available for this session yet.",
    adminNote: isHindi
      ? "कृपया बाद में देखें या कॉलेज कार्यालय से संपर्क करें।"
      : "Please check again later or contact the college office.",
    viewerNote: isHindi
      ? "PDF पढ़ने के लिए ज़ूम और स्क्रॉल का उपयोग करें।"
      : "Use the PDF viewer's zoom and scroll controls to read comfortably.",
    year: isHindi ? "शैक्षणिक सत्र" : "Academic Session",
  };

  return (
    <>
      <Helmet>
        <title>
          {isHindi
            ? "बी.एड. पाठ्यक्रम | हरियाणा शक्ति कॉलेज ऑफ एजुकेशन"
            : "B.Ed. Syllabus | Haryana Shakti College of Education"}
        </title>

        <meta
          name="description"
          content="View and download the B.Ed. syllabus and curriculum PDFs by academic session at Haryana Shakti College of Education."
        />
      </Helmet>

      <PageHeaderBanner
        title={isHindi ? "बी.एड. पाठ्यक्रम" : "B.Ed. Syllabus"}
        subtitle={
          isHindi
            ? "शैक्षणिक सत्र चुनें और पाठ्यक्रम PDF पढ़ें या डाउनलोड करें।"
            : "Choose an academic session to read or download the B.Ed. syllabus PDF."
        }
        breadcrumbs={[
          {
            label: isHindi ? "पाठ्यक्रम" : "Course",
            href: "/course/bed",
          },
          {
            label: isHindi ? "पाठ्यक्रम PDF" : "Syllabus",
          },
        ]}
      />

      <main className="min-h-screen bg-slate-50 py-5 sm:py-8">
        <Container>
          {/* Intro */}
          <div className="mb-5 sm:mb-7">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#2B358F]/10 text-[#2B358F]">
                <BookOpen size={23} />
              </div>

              <div>
                <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                  {text.syllabus}
                </h1>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                  {text.selectSession}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12 lg:gap-6">
            {/* Academic sessions */}
            <aside className="lg:col-span-4 xl:col-span-3">
              <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 bg-[#2B358F] px-4 py-3.5 text-white">
                  <h2 className="text-sm font-bold sm:text-base">
                    {text.chooseYear}
                  </h2>
                </div>

                {loading ? (
                  <div className="px-4 py-6 text-sm text-slate-500">
                    {text.loading}
                  </div>
                ) : syllabusList.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 lg:grid-cols-1 lg:gap-0 lg:p-0">
                    {syllabusList.map((item) => {
                      const selected = item.id === activeItem.id;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedId(item.id)}
                          aria-pressed={selected}
                          className={`flex min-h-12 items-center justify-between gap-2 rounded-md border px-3 py-3 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B358F] lg:rounded-none lg:border-0 lg:border-b lg:border-slate-100 lg:px-4 ${
                            selected
                              ? "border-[#2B358F]/20 bg-[#2B358F]/10 font-semibold text-[#2B358F] lg:border-l-4 lg:border-l-[#2B358F]"
                              : "border-slate-200 text-slate-700 hover:bg-slate-50"
                          }`}>
                          <span className="text-sm leading-5">
                            {item.year || item.session || item.title}
                          </span>

                          {selected && (
                            <ChevronRight size={17} className="shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="p-4 text-sm text-slate-500">{text.noPdf}</p>
                )}
              </div>

              <div className="mt-3 flex items-start gap-2 rounded-lg border border-slate-200 bg-white p-3 text-xs leading-5 text-slate-600">
                <Info size={16} className="mt-0.5 shrink-0 text-[#2B358F]" />
                <p>{text.viewerNote}</p>
              </div>
            </aside>

            {/* PDF reading area */}
            <section className="min-w-0 lg:col-span-8 xl:col-span-9">
              <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                {/* Document heading */}
                <div className="border-b border-slate-200 p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[#2B358F]">
                        <FileText size={21} />
                      </div>

                      <div className="min-w-0">
                        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                          {text.document}
                        </p>

                        <h2 className="break-words text-lg font-bold leading-snug text-slate-900 sm:text-xl">
                          {activeItem.title ||
                            `B.Ed. Syllabus (${activeItem.year || activeItem.session || ""})`}
                        </h2>

                        {(activeItem.year || activeItem.session) && (
                          <p className="mt-1 text-sm text-slate-600">
                            {text.year}: {activeItem.year || activeItem.session}
                          </p>
                        )}
                        {activeItem.publicationDate && (
                          <p className="mt-1 text-xs text-slate-500">
                            Published:{" "}
                            {formatPublicationDate(activeItem.publicationDate)}
                          </p>
                        )}
                      </div>
                    </div>

                    {pdfUrl && (
                      <div className="flex shrink-0 flex-wrap gap-2">
                        <a
                          href={pdfUrl}
                          download
                          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-[#2B358F] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#20286f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B358F] focus-visible:ring-offset-2">
                          <Download size={16} />
                          {text.download}
                        </a>

                        <a
                          href={pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B358F] focus-visible:ring-offset-2">
                          <ExternalLink size={16} />
                          {text.open}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* PDF viewer */}
                {loading ? (
                  <div className="flex min-h-[350px] items-center justify-center bg-slate-50 p-6 text-sm text-slate-500 sm:min-h-[600px]">
                    {text.loading}
                  </div>
                ) : pdfUrl && !pdfError ? (
                  <div className="bg-slate-200 p-1 sm:p-3">
                    <iframe
                      key={pdfUrl}
                      src={
                        pdfUrl.includes("drive.google.com")
                          ? pdfUrl.replace(/\/view(\?.*)?$/, "/preview")
                          : `${pdfUrl}#toolbar=1&navpanes=1&view=FitH`
                      }
                      title={
                        activeItem.title ||
                        `B.Ed. Syllabus ${activeItem.year || ""}`
                      }
                      className="block h-[70vh] min-h-[480px] w-full rounded border border-slate-300 bg-white sm:h-[850px] sm:min-h-[650px] lg:h-[900px]"
                      onError={() => setPdfError(true)}
                    />

                    <p className="px-2 py-3 text-center text-xs leading-5 text-slate-600">
                      {text.viewerNote}{" "}
                      <span>
                        {isHindi
                          ? "यदि PDF यहाँ न खुले, तो 'नए टैब में खोलें' चुनें।"
                          : "If the PDF does not appear here, choose 'Open in New Tab'."}
                      </span>
                    </p>
                  </div>
                ) : (
                  <div className="flex min-h-[300px] flex-col items-center justify-center bg-slate-50 px-5 py-12 text-center sm:min-h-[450px]">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 text-slate-500">
                      <FileText size={30} />
                    </div>

                    <h3 className="text-base font-semibold text-slate-800">
                      {text.noPdf}
                    </h3>

                    <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                      {text.adminNote}
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </Container>
      </main>
    </>
  );
}

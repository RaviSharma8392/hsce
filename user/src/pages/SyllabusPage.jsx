import React, { useState, useEffect, useMemo } from "react";
import {
  Download,
  ExternalLink,
  FileText,
  BookOpen,
  Info,
} from "lucide-react";

import { CollegiatePageLayout } from "../components/common/CollegiatePageLayout";
import { getAcademicsSidebarConfig } from "../data/navigationConfig";
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
  const sidebarConfig = getAcademicsSidebarConfig(isHindi);

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

  useEffect(() => {
    setPdfError(false);
  }, [activeItem.pdfUrl]);

  const pdfUrl = activeItem.pdfUrl || "";

  const text = {
    syllabus: isHindi ? "बी.एड. पाठ्यक्रम" : "B.Ed. Syllabus",
    chooseYear: isHindi ? "शैक्षणिक सत्र चुनें" : "Select Academic Session",
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
      : "Use the viewer's zoom and scroll controls to read comfortably.",
    year: isHindi ? "शैक्षणिक सत्र" : "Academic Session",
  };

  return (
    <CollegiatePageLayout
      bannerTitle={isHindi ? "बी.एड. पाठ्यक्रम एवं सिलेबस" : "Curriculum & Syllabus"}
      bannerSubtitle={
        isHindi
          ? "गुरु गोबिंद सिंह इंद्रप्रस्थ विश्वविद्यालय (GGSIPU) द्वारा अनुमोदित द्विवर्षीय बी.एड. पाठ्यक्रम का आधिकारिक सिलेबस।"
          : "Official semester-wise curriculum, examination scheme, and paper syllabi approved by GGSIPU."
      }
      breadcrumbs={[
        { label: isHindi ? "शैक्षणिक कार्यक्रम" : "Academics", href: "/course" },
        { label: isHindi ? "पाठ्यक्रम" : "Syllabus" },
      ]}
      sidebarTitle={sidebarConfig.title}
      sidebarItems={sidebarConfig.items}
      quickActions={sidebarConfig.quickActions}>
      <div className="space-y-6">
        {/* Session Selector Bar */}
        <div className="rounded-md border border-gray-200/90 bg-white p-5 shadow-xs">
          <div className="border-b border-gray-200 pb-3 mb-4 flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2E3A8C]">
                {text.chooseYear}
              </span>
              <h3 className="font-serif text-lg font-bold text-slate-900">
                {isHindi ? "सत्र-वार पाठ्यक्रम चुनें" : "Session-Wise Syllabus PDF"}
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-sans">
              GGSIPU Code: 147
            </span>
          </div>

          {loading ? (
            <div className="text-xs text-slate-500 py-3">{text.loading}</div>
          ) : (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {syllabusList.map((item) => {
                const selected = item.id === activeItem.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className={`px-4 py-2 rounded text-xs font-bold font-sans transition whitespace-nowrap cursor-pointer border ${
                      selected
                        ? "bg-[#2E3A8C] text-white border-[#2E3A8C] shadow-xs"
                        : "bg-white text-slate-700 border-gray-200 hover:border-[#2E3A8C] hover:text-[#2E3A8C]"
                    }`}>
                    {item.year || item.session || item.title}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* PDF Document Card */}
        <div className="rounded-md border border-gray-200/90 bg-white overflow-hidden shadow-xs">
          {/* Document Header Bar */}
          <div className="border-b border-gray-200 p-5 sm:p-6 bg-slate-50/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-[#2E3A8C] text-white">
                  <FileText size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E3A8C]">
                    {text.document}
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                    {activeItem.title || `B.Ed. Syllabus (${activeItem.year || activeItem.session || ""})`}
                  </h3>
                  {(activeItem.year || activeItem.session) && (
                    <p className="text-xs text-slate-600 mt-0.5">
                      {text.year}: {activeItem.year || activeItem.session}
                    </p>
                  )}
                  {activeItem.publicationDate && (
                    <p className="text-[11px] text-slate-400">
                      Published: {formatPublicationDate(activeItem.publicationDate)}
                    </p>
                  )}
                </div>
              </div>

              {pdfUrl && (
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={pdfUrl}
                    download
                    className="inline-flex items-center gap-1.5 rounded bg-[#2E3A8C] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#232d70] transition shadow-xs">
                    <Download size={14} />
                    <span>{text.download}</span>
                  </a>
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded border border-gray-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:border-[#2E3A8C] hover:text-[#2E3A8C] transition">
                    <ExternalLink size={14} />
                    <span>{text.open}</span>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* PDF Viewer Iframe */}
          {loading ? (
            <div className="flex min-h-[400px] items-center justify-center bg-slate-50 text-xs text-slate-500">
              {text.loading}
            </div>
          ) : pdfUrl && !pdfError ? (
            <div className="bg-slate-100 p-2 sm:p-3">
              <iframe
                key={pdfUrl}
                src={
                  pdfUrl.includes("drive.google.com")
                    ? pdfUrl.replace(/\/view(\?.*)?$/, "/preview")
                    : `${pdfUrl}#toolbar=1&navpanes=1&view=FitH`
                }
                title={activeItem.title || `B.Ed. Syllabus ${activeItem.year || ""}`}
                className="block h-[70vh] min-h-[500px] w-full rounded border border-gray-300 bg-white sm:h-[800px]"
                onError={() => setPdfError(true)}
              />
              <p className="px-2 py-2.5 text-center text-[11px] text-slate-500 font-sans">
                {text.viewerNote}{" "}
                <span>
                  {isHindi
                    ? "यदि PDF यहाँ न खुले, तो 'नए टैब में खोलें' चुनें।"
                    : "If the PDF does not display properly in your browser, click 'Open in New Tab'."}
                </span>
              </p>
            </div>
          ) : (
            <div className="flex min-h-[350px] flex-col items-center justify-center bg-slate-50 px-5 py-12 text-center">
              <FileText size={32} className="text-slate-400 mb-2" />
              <h4 className="font-serif font-bold text-sm text-slate-800">{text.noPdf}</h4>
              <p className="mt-1 text-xs text-slate-500">{text.adminNote}</p>
            </div>
          )}
        </div>
      </div>
    </CollegiatePageLayout>
  );
}

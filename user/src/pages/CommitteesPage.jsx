import React, { useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import {
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Users,
  Send,
  Lock,
} from "lucide-react";
import { CollegiatePageLayout } from "../components/common/CollegiatePageLayout";
import { getGovernanceSidebarConfig } from "../data/navigationConfig";
import { committeeData as seedCommittees } from "../data/siteData";
import { usePublishedRecords } from "../hooks/usePublishedRecords";
import { useLanguage } from "../context/LanguageContext";
import { submitGrievance } from "../services/grievanceService";

export default function CommitteesPage() {
  const { isHindi } = useLanguage();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const committeeData = usePublishedRecords("committees", seedCommittees);

  const tabParam = searchParams.get("tab");
  const hashVal = location.hash ? location.hash.replace("#", "") : null;
  const activeTab =
    tabParam === "lodge" ||
    hashVal === "grievance" ||
    hashVal === "complaint" ||
    location.pathname.includes("grievance")
      ? "lodge"
      : "directory";

  const handleTabSelect = (tabKey) => {
    setSearchParams({ tab: tabKey });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sidebarConfig = getGovernanceSidebarConfig(isHindi, activeTab);

  const enhancedSidebarItems = sidebarConfig.items.map((item) => {
    if (item.id === "committees") {
      return {
        ...item,
        onClick: (e) => {
          e?.preventDefault?.();
          handleTabSelect("directory");
        },
      };
    }
    if (item.id === "grievance") {
      return {
        ...item,
        onClick: (e) => {
          e?.preventDefault?.();
          handleTabSelect("lodge");
        },
      };
    }
    return item;
  });

  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    phone: "",
    email: "",
    category: "Student Grievance Redressal Committee",
    subject: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submittedId, setSubmittedId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!formData.name.trim()) {
      setSubmitError(
        isHindi ? "कृपया अपना नाम दर्ज करें।" : "Please enter your name.",
      );
      return;
    }

    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setSubmitError(
        isHindi
          ? "कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।"
          : "Please enter a valid 10-digit mobile number.",
      );
      return;
    }

    if (!formData.subject.trim()) {
      setSubmitError(
        isHindi
          ? "कृपया शिकायत का विषय लिखें।"
          : "Please enter grievance subject/heading.",
      );
      return;
    }

    if (
      !formData.description.trim() ||
      formData.description.trim().length < 15
    ) {
      setSubmitError(
        isHindi
          ? "कृपया कम से कम 15 अक्षरों में अपनी शिकायत का विस्तृत विवरण लिखें।"
          : "Please describe your complaint in detail (minimum 15 characters).",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await submitGrievance({
        ...formData,
        phone: cleanPhone,
      });

      setSubmittedId(res.grievanceId || "");
      setIsSubmitted(true);
      setFormData({
        name: "",
        rollNo: "",
        phone: "",
        email: "",
        category: "Student Grievance Redressal Committee",
        subject: "",
        description: "",
      });
    } catch (err) {
      console.error("Grievance submission error:", err);
      setSubmitError(
        isHindi
          ? "शिकायत दर्ज करने में समस्या आई। कृपया पुनः प्रयास करें या सीधे संपर्क करें।"
          : "Failed to submit grievance. Please try again or contact the college helpline.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded border border-gray-300 bg-slate-50/70 px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 outline-none transition placeholder:text-gray-400 focus:border-[#2E3A8C] focus:bg-white focus:ring-1 focus:ring-[#2E3A8C]";

  return (
    <CollegiatePageLayout
      bannerTitle={
        isHindi
          ? "संस्थागत समितियाँ एवं शिकायत निवारण"
          : "Institutional Committees & Grievance Cells"
      }
      bannerSubtitle={
        isHindi
          ? "शैक्षणिक सलाहकार, छात्र शिकायत निवारण, महिला सेल (ICC) एवं एंटी-रैगिंग समितियाँ।"
          : "Statutory committees ensuring institutional safety, equity, anti-ragging compliance, and student welfare."
      }
      breadcrumbs={[
        { label: isHindi ? "वैधानिक प्रकटीकरण" : "Governance" },
        { label: isHindi ? "समितियाँ एवं प्रकोष्ठ" : "Committees & Cells" },
      ]}
      sidebarTitle={sidebarConfig.title}
      sidebarItems={enhancedSidebarItems}
      quickActions={sidebarConfig.quickActions}>
      <div className="space-y-6">
        {/* Tab Switcher Pills */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
          <button
            type="button"
            onClick={() => handleTabSelect("directory")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded text-xs sm:text-sm font-bold transition border cursor-pointer ${
              activeTab === "directory"
                ? "bg-[#2E3A8C] text-white border-[#2E3A8C] shadow-xs"
                : "bg-white text-slate-700 border-gray-200 hover:border-[#2E3A8C] hover:text-[#2E3A8C]"
            }`}>
            <Users size={15} />
            <span>{isHindi ? "समिति निर्देशिका" : "Committees Directory"}</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabSelect("lodge")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded text-xs sm:text-sm font-bold transition border cursor-pointer ${
              activeTab === "lodge"
                ? "bg-[#800000] text-white border-[#800000] shadow-xs"
                : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
            }`}>
            <ShieldAlert size={15} />
            <span>
              {isHindi ? "ऑनलाइन शिकायत दर्ज करें" : "Lodge Online Grievance"}
            </span>
          </button>
        </div>

        {/* Tab 1: Directory */}
        {activeTab === "directory" && (
          <div className="space-y-6">
            {/* Quick Grievance Callout Card */}
            <div className="rounded-md border border-amber-200 bg-amber-50/70 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-amber-100 text-[#2E3A8C]">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm sm:text-base text-slate-900">
                    {isHindi
                      ? "क्या आपकी कोई शैक्षणिक अथवा संस्थागत शिकायत है?"
                      : "Have an Academic or Institutional Grievance?"}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5 font-sans">
                    {isHindi
                      ? "कॉलेज के आधिकारिक शिकायत निवारण सेल को अपनी बात गोपनीय रूप से प्रेषित करें।"
                      : "Submit your concern confidentially to our statutory Student Grievance Redressal Committee."}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab("lodge")}
                className="shrink-0 px-4 py-2 rounded bg-[#800000] text-white text-xs font-bold hover:bg-[#660000] transition shadow-xs cursor-pointer">
                {isHindi ? "शिकायत दर्ज करें" : "Lodge Complaint Now"} &rarr;
              </button>
            </div>

            {/* Committee Cards (Image 4 Header Style) */}
            {committeeData.map((committee) => (
              <div
                key={committee.name}
                className="rounded-md border border-gray-200/90 bg-white p-6 sm:p-7 shadow-xs">
                {/* Header with Blue Underline */}
                <div className="border-b border-gray-200 pb-3 mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#2E3A8C]">
                    {isHindi ? "वैधानिक समिति" : "Statutory Cell"}
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                    {committee.name}
                  </h3>
                  <div className="mt-2 h-1 w-16 bg-[#2E3A8C] rounded-full" />
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans mb-5">
                  {committee.description}
                </p>

                {/* Member Roster (Image 3 Style Zebra Box) */}
                <div className="grid gap-3 sm:grid-cols-2">
                  {committee.members.map((member, mIdx) => (
                    <div
                      key={`${committee.name}-${member.name}-${mIdx}`}
                      className="rounded border border-gray-200 bg-slate-50/60 p-3.5 flex items-center justify-between gap-2">
                      <div>
                        <h4 className="font-serif font-bold text-xs sm:text-sm text-slate-900">
                          {member.name}
                        </h4>
                        <p className="text-xs text-[#2E3A8C] font-semibold mt-0.5">
                          {member.designation}
                        </p>
                      </div>
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Online Grievance Form (Guest Book Style from Image 6) */}
        {activeTab === "lodge" && (
          <div className="rounded-md border border-gray-200/90 bg-white p-6 sm:p-8 shadow-xs">
            {/* Header with Maroon Accent (Image 6 Style) */}
            <div className="border-b border-[#800000] pb-3 mb-6">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
                {isHindi
                  ? "छात्र शिकायत / परिवाद पंजीकरण फॉर्म"
                  : "Student Grievance & Complaint Lodging Form"}
              </h3>
              <p className="text-xs text-slate-500 font-sans mt-1">
                {isHindi
                  ? "हरियाणा शक्ति कॉलेज ऑफ एजुकेशन की छात्र शिकायत निवारण समिति एवं संबंधित प्रकोष्ठ आपकी समस्या की निष्पक्ष जांच हेतु प्रतिबद्ध है।"
                  : "Fill this official form to lodge an academic, administrative, or campus concern. Submissions are reviewed confidentially."}
              </p>
            </div>

            {isSubmitted ? (
              <div className="py-8 text-center flex flex-col items-center justify-center">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                  <CheckCircle2 size={32} />
                </div>
                <h4 className="text-base font-bold text-slate-900 font-serif">
                  {isHindi
                    ? "आपकी शिकायत सफलतापूर्वक दर्ज कर ली गई है!"
                    : "Grievance Registered Successfully!"}
                </h4>
                {submittedId && (
                  <div className="mt-2.5 inline-block bg-blue-50 border border-blue-200 rounded px-3.5 py-1.5 text-xs text-[#2E3A8C] font-mono font-bold">
                    Tracking ID: <span>{submittedId}</span>
                  </div>
                )}
                <p className="text-xs text-slate-600 mt-2 max-w-md leading-relaxed font-sans">
                  {isHindi
                    ? "आपकी शिकायत संबंधित समिति के संज्ञान में भेज दी गई है।"
                    : "Your complaint has been delivered to the institutional Grievance Redressal Committee."}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setSubmittedId("");
                  }}
                  className="mt-4 px-4 py-2 rounded bg-[#2E3A8C] text-white text-xs font-bold hover:bg-[#232d70] transition">
                  {isHindi ? "एक और शिकायत दर्ज करें" : "Lodge Another Grievance"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {submitError && (
                  <div className="p-3 rounded bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle size={15} className="shrink-0 text-red-500" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      {isHindi ? "विद्यार्थी / प्रार्थी का नाम *" : "Student / Complainant Name *"}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      {isHindi ? "रोल नंबर / नामांकन संख्या" : "Roll No / Enrollment ID"}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. B.Ed. 2026-042 (or Visitor)"
                      value={formData.rollNo}
                      onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      {isHindi ? "मोबाइल नंबर *" : "Mobile Phone Number *"}
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="10-digit mobile number"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                        })
                      }
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      {isHindi ? "ईमेल आईडी" : "Email Address"}
                    </label>
                    <input
                      type="email"
                      placeholder="student@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    {isHindi ? "संबंधित समिति / शिकायत प्रकोष्ठ *" : "Concerned Committee / Category *"}
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className={inputClass}>
                    <option value="Student Grievance Redressal Committee">
                      Student Grievance Redressal Committee (छात्र शिकायत निवारण समिति)
                    </option>
                    <option value="Internal Complaints Committee (ICC) & Gender Cell">
                      Internal Complaints Committee (ICC) & Gender Cell (महिला शिकायत प्रकोष्ठ)
                    </option>
                    <option value="Anti-Ragging Committee & Cell">
                      Anti-Ragging Committee & Cell (एंटी-रैगिंग प्रकोष्ठ)
                    </option>
                    <option value="Academic Advisory & Examination Grievance">
                      Academic Advisory & Examination (शैक्षणिक एवं परीक्षा संबंधी)
                    </option>
                    <option value="Campus Facilities & Library">
                      Campus Facilities & Library (परिसर, प्रयोगशाला व पुस्तकालय)
                    </option>
                    <option value="General Administration / Other">
                      General Administration / Other (सामान्य प्रशासन / अन्य)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    {isHindi ? "शिकायत का विषय / शीर्षक *" : "Subject / Heading of Grievance *"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Brief heading or topic of complaint"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    {isHindi ? "विस्तृत विवरण *" : "Detailed Statement of Complaint *"}
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Please write a clear, factual, and detailed account of the issue..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div className="rounded bg-slate-50 border border-gray-200 p-3 flex items-start gap-2 text-xs text-slate-600">
                  <Lock size={14} className="shrink-0 text-slate-400 mt-0.5" />
                  <span>
                    {isHindi
                      ? "आपकी शिकायत सुरक्षित एवं विनियामक मानकों के अनुरूप केवल अधिकृत समिति सदस्यों द्वारा ही जांची जाएगी।"
                      : "Your grievance details are stored securely and treated with strict confidentiality under statutory university guidelines."}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#800000] hover:bg-[#660000] disabled:opacity-75 text-white font-bold py-2.5 rounded shadow-xs transition text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer">
                  {isSubmitting ? (
                    <span>Registering Grievance with Committee...</span>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>{isHindi ? "समिति को शिकायत प्रेषित करें" : "Submit Grievance to Committee"}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </CollegiatePageLayout>
  );
}

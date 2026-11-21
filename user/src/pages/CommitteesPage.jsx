import React, { useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Send,
  Lock,
} from "lucide-react";
import { CollegiatePageLayout } from "../components/common/CollegiatePageLayout";
import { getGovernanceSidebarConfig } from "../data/navigationConfig";
import { useLanguage } from "../context/LanguageContext";
import { submitGrievance } from "../services/grievanceService";

export default function CommitteesPage() {
  const { isHindi } = useLanguage();
  const activeTab = "lodge";
  const sidebarConfig = getGovernanceSidebarConfig(isHindi, activeTab);

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
          ? "छात्र शिकायत एवं परिवाद पंजीकरण"
          : "Student Grievance & Complaint Lodging"
      }
      bannerSubtitle={
        isHindi
          ? "अपनी शैक्षणिक, प्रशासनिक या परिसर संबंधी शिकायत सुरक्षित रूप से दर्ज करें।"
          : "Submit your academic, administrative, or campus concern securely."
      }
      breadcrumbs={[
        { label: isHindi ? "वैधानिक प्रकटीकरण" : "Governance" },
        { label: isHindi ? "छात्र शिकायत एवं परिवाद" : "Student Grievance & Complaint" },
      ]}
      sidebarTitle={sidebarConfig.title}
      sidebarItems={sidebarConfig.items}
      quickActions={sidebarConfig.quickActions}>
      <div className="space-y-6">
        {/* Student Grievance & Complaint Lodging Form */}
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
      </div>
    </CollegiatePageLayout>
  );
}

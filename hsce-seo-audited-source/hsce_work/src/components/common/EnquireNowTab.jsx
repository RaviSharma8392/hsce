import React, { useEffect, useState } from "react";
import {
  X,
  Check,
  Sparkles,
  Phone,
  ShieldCheck,
  User,
  Mail,
  MapPin,
  GraduationCap,
  MessageSquare,
  Send,
  MessageCircle,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { collegeInfo } from "../../data/siteData";
import { admissionModalData } from "../../data/admissionModalData";
import { imageData } from "../../data/imagesData";

const initialFormData = {
  name: "",
  phone: "",
  email: "",
  course: "B.Ed. (Bachelor of Education — 2-Year Regular)",
  city: "",
  query: "",
};

export function EnquireNowTab() {
  const { isHindi } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState(initialFormData);
  const [referenceId, setReferenceId] = useState("");

  const collegePhone =
    collegeInfo.phone || admissionModalData.helplinePhoneFallback;
  const cleanPhone = String(collegePhone).replace(/[^\d+]/g, "");
  const collegeWhatsapp = String(collegePhone).replace(/\D/g, "");

  // Prevent background scrolling when popup is open on mobile
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    if (window.innerWidth < 640) {
      document.body.style.overflow = "hidden";
    }
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const updateField = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value,
    }));
    if (submitError) setSubmitError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!formData.name.trim()) {
      setSubmitError(
        isHindi ? "कृपया अपना नाम दर्ज करें।" : "Please enter your name."
      );
      return;
    }

    if (formData.phone.length !== 10) {
      setSubmitError(
        isHindi
          ? "कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।"
          : "Please enter a valid 10-digit mobile number."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const generatedRefId = `ENQ-${Date.now().toString().slice(-6)}`;
      setReferenceId(generatedRefId);

      // 1. Submit to student enquiries collection
      const { submitStudentEnquiry } = await import(
        "../../services/enquiryService"
      );
      await submitStudentEnquiry({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        course: formData.course,
        city: formData.city.trim(),
        query: formData.query.trim() || `Session: ${admissionModalData.session} Enquiry`,
        source: "website_enquire_now_widget",
        contactConsent: true,
      });

      // 2. Dual-sync to contact feedback so admin sees it in all views
      const { submitFeedback } = await import(
        "../../services/feedbackService"
      );
      await submitFeedback({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        category: "Admission Enquiry",
        subject: `${formData.course} - ${formData.city.trim() || "Delhi NCR"}`,
        message: formData.query.trim() || "Prospective student requested B.Ed. admission information.",
      }).catch(() => {});

      setIsSubmitted(true);
    } catch (err) {
      console.error("Enquiry submission failed:", err);
      setSubmitError(
        isHindi
          ? "पूछताछ दर्ज नहीं हो सकी। कृपया दोबारा प्रयास करें या कॉल करें।"
          : "Unable to submit your enquiry. Please try again or call the college."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setSubmitError("");
    setFormData(initialFormData);
    setIsOpen(false);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello HSCE Admissions! I have an admission enquiry regarding B.Ed. (Session 2026-27). My name is ${formData.name || "Candidate"}.`
  );

  return (
    <>
      {/* ======================================================== */}
      {/* FLOATING LAUNCHER BUTTON (Bottom-Right, Elegant)         */}
      {/* ======================================================== */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
        {showTooltip && !isOpen && (
          <div className="relative mb-2 hidden sm:flex items-center gap-2 rounded-xl border border-blue-200/90 bg-white px-3.5 py-2 text-[#194178] shadow-xl animate-bounce duration-1000">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>

            <div className="flex flex-col text-left leading-tight">
              <span className="text-[11px] font-bold text-[#194178]">
                {isHindi ? "प्रवेश 2026–27 खुली है" : "Admissions 2026–27 Open"}
              </span>
              <span className="text-[10px] text-slate-500">
                {isHindi ? "त्वरित पूछताछ दर्ज करें" : "Quick B.Ed. Admission Enquiry"}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowTooltip(false)}
              aria-label="Dismiss"
              className="ml-1 rounded-full p-0.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <X size={13} />
            </button>

            <span className="absolute -bottom-1.5 right-6 h-3 w-3 rotate-45 border-b border-r border-blue-200/90 bg-white" />
          </div>
        )}

        {/* Circular Floating Trigger */}
        <button
          type="button"
          onClick={() => {
            setIsOpen((prev) => !prev);
            setShowTooltip(false);
          }}
          aria-label={isHindi ? "प्रवेश पूछताछ फॉर्म" : "Admission Enquiry Form"}
          aria-expanded={isOpen}
          className="group relative flex h-13 w-13 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#194178] via-[#203a7a] to-[#0c244d] text-white shadow-[0_8px_25px_rgba(25,65,120,0.35)] border-2 border-[#FBDD23] transition-all hover:scale-105 active:scale-95 focus:outline-none"
        >
          {isOpen ? (
            <X size={24} className="stroke-[2.2]" />
          ) : (
            <>
              <GraduationCap size={26} className="text-[#FBDD23] stroke-[2]" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              </span>
            </>
          )}
        </button>
      </div>

      {/* ======================================================== */}
      {/* POPUP ADMISSION ENQUIRY CARD                             */}
      {/* ======================================================== */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-end justify-center sm:justify-end sm:p-5 bg-black/50 sm:bg-transparent backdrop-blur-xs sm:backdrop-blur-none animate-in fade-in duration-200"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div className="relative w-full sm:w-[410px] max-h-[92vh] flex flex-col bg-white rounded-t-3xl sm:rounded-2xl shadow-[0_20px_60px_rgba(15,23,42,0.22)] border border-slate-200 overflow-hidden font-sans animate-in slide-in-from-bottom-5 duration-200">
            {/* Header: University Branding */}
            <div className="relative shrink-0 bg-gradient-to-r from-[#194178] via-[#233575] to-[#122852] p-4 sm:p-5 text-white">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
                className="absolute right-3.5 top-3.5 h-7 w-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-white p-1 shrink-0 shadow-sm flex items-center justify-center">
                  <img
                    src={imageData.collegeLogo}
                    width="432"
                    height="432"
                    alt="HSCE Logo"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="min-w-0 pr-6">
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#FBDD23] text-slate-900">
                      Admission 2026–27
                    </span>
                  </div>
                  <h2 className="text-sm sm:text-base font-bold text-white leading-tight mt-1 truncate">
                    Haryana Shakti College of Education
                  </h2>
                  <p className="text-[11px] text-blue-200/90 truncate">
                    Approved by NCTE &bull; Affiliated to GGSIPU, Delhi
                  </p>
                </div>
              </div>
            </div>

            {/* Scrollable Form Body */}
            <div className="p-4 sm:p-5 overflow-y-auto custom-scrollbar flex-1">
              {isSubmitted ? (
                /* SUCCESS SCREEN */
                <div className="py-6 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-400 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                    <Check size={32} className="stroke-[2.5]" />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {isHindi ? "पूछताछ सफलतापूर्वक प्राप्त हुई!" : "Enquiry Submitted Successfully!"}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      {isHindi
                        ? `धन्यवाद ${formData.name}। आपकी प्रवेश पूछताछ कॉलेज कार्यालय को भेज दी गई है। हमारी काउंसलिंग टीम शीघ्र आपसे संपर्क करेगी।`
                        : `Thank you, ${formData.name}. Your admission enquiry has been sent to our desk. Our counselor will connect with you shortly.`}
                    </p>
                  </div>

                  {referenceId && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                      <span className="text-slate-500 font-medium">
                        {isHindi ? "संदर्भ संख्या:" : "Reference ID:"}
                      </span>
                      <strong className="font-mono text-blue-900">{referenceId}</strong>
                    </div>
                  )}

                  <div className="pt-2 space-y-2">
                    <a
                      href={`https://wa.me/${collegeWhatsapp}?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
                    >
                      <MessageCircle size={15} />
                      <span>{isHindi ? "व्हाट्सएप पर तुरंत चैट करें" : "Instant WhatsApp Connect"}</span>
                    </a>

                    <a
                      href={`tel:${cleanPhone}`}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition"
                    >
                      <Phone size={14} className="text-blue-700" />
                      <span>{isHindi ? `हेल्पलाइन कॉल: ${collegePhone}` : `Call Helpline: ${collegePhone}`}</span>
                    </a>

                    <button
                      type="button"
                      onClick={resetForm}
                      className="text-xs font-semibold text-blue-700 hover:underline pt-1 block mx-auto"
                    >
                      {isHindi ? "एक और पूछताछ भेजें" : "Submit Another Enquiry"}
                    </button>
                  </div>
                </div>
              ) : (
                /* MAIN ADMISSION ENQUIRY FORM */
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div className="pb-1 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                        {isHindi ? "त्वरित प्रवेश पूछताछ फॉर्म" : "Quick Admission Enquiry"}
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        {isHindi
                          ? "नीचे विवरण भरें, हमारी टीम आपको तुरंत मार्गदर्शन प्रदान करेगी।"
                          : "Fill in your details for counselling and fee information."}
                      </p>
                    </div>
                  </div>

                  {submitError && (
                    <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
                      <span className="shrink-0 text-red-600 font-bold">&bull;</span>
                      <span>{submitError}</span>
                    </div>
                  )}

                  {/* Field: Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isHindi ? "पूरा नाम" : "Candidate Full Name"} *
                    </label>
                    <div className="relative">
                      <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={updateField}
                        placeholder={isHindi ? "अपना पूरा नाम लिखें" : "e.g. Rahul Sharma"}
                        required
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50/50 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Field: Mobile Number */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isHindi ? "10 अंकों का मोबाइल / व्हाट्सएप नंबर" : "10-Digit Mobile / WhatsApp"} *
                    </label>
                    <div className="flex rounded-lg border border-slate-300 overflow-hidden bg-slate-50/50 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                      <span className="px-2.5 py-2 bg-slate-100 border-r border-slate-300 text-xs font-bold text-slate-600 shrink-0">
                        +91
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={updateField}
                        maxLength={10}
                        placeholder="9876543210"
                        required
                        className="w-full px-3 py-2 text-xs text-slate-900 outline-none bg-transparent"
                      />
                    </div>
                  </div>

                  {/* Field: Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isHindi ? "ईमेल पता" : "Email Address"}
                    </label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={updateField}
                        placeholder={isHindi ? "अपना ईमेल लिखें" : "e.g. rahul@gmail.com"}
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50/50 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Field: Course & City Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isHindi ? "पाठ्यक्रम" : "Course"}
                      </label>
                      <select
                        name="course"
                        value={formData.course}
                        onChange={updateField}
                        className="w-full px-2.5 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 outline-none focus:border-blue-600 bg-slate-50/50 focus:bg-white font-medium"
                      >
                        <option value="B.Ed. (Bachelor of Education — 2-Year Regular)">
                          B.Ed. (2-Year Regular)
                        </option>
                        <option value="Management Quota / Direct Admission">
                          Management Quota
                        </option>
                        <option value="Eligibility & Counselling Guidance">
                          Counselling Guidance
                        </option>
                        <option value="Fee Structure Enquiry">
                          Fee Structure
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isHindi ? "शहर / क्षेत्र" : "City / State"}
                      </label>
                      <div className="relative">
                        <MapPin size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={updateField}
                          placeholder={isHindi ? "उदा. दिल्ली, रोहिणी" : "e.g. Delhi, Rohini"}
                          className="w-full pl-8 pr-2.5 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 outline-none focus:border-blue-600 bg-slate-50/50 focus:bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Field: Optional Query */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isHindi ? "संदेश या प्रश्न (वैकल्पिक)" : "Question / Query (Optional)"}
                    </label>
                    <textarea
                      name="query"
                      rows={2}
                      value={formData.query}
                      onChange={updateField}
                      placeholder={isHindi ? "प्रवेश या शुल्क से संबंधित कोई प्रश्न..." : "Ask about counselling, eligibility, syllabus..."}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 outline-none focus:border-blue-600 bg-slate-50/50 focus:bg-white resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-[#FBDD23] via-[#ffdf34] to-[#f5c900] hover:from-[#ffe652] hover:to-[#ebb800] text-slate-950 font-bold rounded-lg text-xs tracking-wider uppercase shadow-sm transition disabled:opacity-60 flex items-center justify-center gap-2 mt-1 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                        <span>{isHindi ? "जमा हो रहा है…" : "Submitting…" }</span>
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        <span>{isHindi ? "पूछताछ दर्ज करें" : "Submit Admission Enquiry"}</span>
                      </>
                    )}
                  </button>

                  {/* Security & Official note */}
                  <div className="flex items-center justify-center gap-1.5 pt-1 text-[10px] text-slate-400">
                    <ShieldCheck size={12} className="text-emerald-600" />
                    <span>Official HSCE Admission Cell &bull; Direct Callback</span>
                  </div>
                </form>
              )}
            </div>

            {/* Quick Helpline Strip Footer */}
            <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span className="font-semibold text-[11px] text-slate-500">
                {isHindi ? "हेल्पलाइन:" : "Helpline:"}
              </span>
              <div className="flex items-center gap-3">
                <a
                  href={`tel:${cleanPhone}`}
                  className="font-bold text-[#194178] hover:underline flex items-center gap-1 text-[11px]"
                >
                  <Phone size={12} />
                  <span>{collegePhone}</span>
                </a>
                <span className="text-slate-300">|</span>
                <a
                  href={`https://wa.me/${collegeWhatsapp}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-emerald-700 hover:underline flex items-center gap-1 text-[11px]"
                >
                  <MessageCircle size={12} />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EnquireNowTab;

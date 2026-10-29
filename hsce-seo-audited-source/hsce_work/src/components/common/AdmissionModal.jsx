import React, { useState, useEffect, useRef } from "react";
import {
  X,
  ChevronDown,
  CheckCircle2,
  Phone,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { useAdmissionModal } from "../../context/AdmissionModalContext";
import { useLanguage } from "../../context/LanguageContext";
import { collegeInfo } from "../../data/siteData";
import { admissionModalData } from "../../data/admissionModalData";

export function AdmissionModal() {
  const { isOpen, closeAdmissionModal, modalOptions } = useAdmissionModal();
  const { isHindi } = useLanguage();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    programme: "",
    state: "",
    city: "",
    agreed: true,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedRef, setSubmittedRef] = useState("");
  const modalRef = useRef(null);
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        // Auto-select the first course if there is only one
        programme:
          modalOptions?.defaultProgramme || admissionModalData.courses[0] || "",
        state: modalOptions?.defaultState || prev.state || "Delhi (NCT)",
      }));
      setIsSuccess(false);
      setErrors({});

      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const timer = setTimeout(() => {
        firstInputRef.current?.focus();
      }, 100);

      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          closeAdmissionModal();
        }
      };
      window.addEventListener("keydown", handleKeyDown);

      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener("keydown", handleKeyDown);
        clearTimeout(timer);
      };
    }
  }, [isOpen, modalOptions, closeAdmissionModal]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = isHindi
        ? "कृपया नाम दर्ज करें"
        : "Candidate's name is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errs.email = isHindi ? "ईमेल आवश्यक है" : "Email address is required";
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = isHindi
        ? "अमान्य ईमेल प्रारूप"
        : "Please enter a valid email address";
    }

    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (!cleanPhone) {
      errs.phone = isHindi
        ? "मोबाइल नंबर आवश्यक है"
        : "Mobile number is required";
    } else if (cleanPhone.length !== 10) {
      errs.phone = isHindi
        ? "10 अंकों का मान्य मोबाइल नंबर दर्ज करें"
        : "Enter a valid 10-digit mobile number";
    }

    if (!formData.programme) {
      errs.programme = isHindi
        ? "कृपया पाठ्यक्रम चुनें"
        : "Please select a programme";
    }

    if (!formData.state) {
      errs.state = isHindi ? "कृपया राज्य चुनें" : "Please select state";
    }

    if (!formData.city.trim()) {
      errs.city = isHindi ? "कृपया शहर दर्ज करें" : "City is required";
    }

    if (!formData.agreed) {
      errs.agreed = isHindi
        ? "कृपया सहमति बॉक्स को चेक करें"
        : "Please accept the agreement";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const refNumber = `HSCE-2026-${Math.floor(100000 + Math.random() * 900000)}`;

      const { submitStudentEnquiry } = await import(
        "../../services/enquiryService"
      );
      await submitStudentEnquiry({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        course: formData.programme,
        city: `${formData.city.trim()}, ${formData.state}`,
        state: formData.state,
        query: `Direct Online Admission Application (Session ${admissionModalData.session}). Reg Ref: ${refNumber}`,
        source: "admission_modal",
      });

      setSubmittedRef(refNumber);
      setIsSuccess(true);
    } catch (err) {
      console.error("Admission submission error:", err);
      setErrors({
        submit: isHindi
          ? "सबमिशन में त्रुटि हुई। कृपया पुनः प्रयास करें।"
          : "Could not submit application. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const helplinePhone =
    collegeInfo.phone || admissionModalData.helplinePhoneFallback;
  const cleanPhoneNum = helplinePhone.replace(/\D/g, "");

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admission-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center sm:p-4 overflow-y-auto bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Click outside backdrop */}
      <div
        className="fixed inset-0 -z-10"
        onClick={closeAdmissionModal}
        aria-hidden="true"
      />

      {/* Main Modal Card */}
      <div
        ref={modalRef}
        className="relative w-full h-full sm:h-auto sm:max-w-[560px] bg-white rounded-none shadow-2xl border border-slate-100 overflow-y-auto flex flex-col sm:block transform transition-all duration-300 animate-in zoom-in-95 sm:my-auto">
        {/* Close Button Top-Right */}
        <button
          type="button"
          onClick={closeAdmissionModal}
          className="absolute top-4 right-4 z-20 text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-1.5 rounded-none transition-colors"
          aria-label="Close admission modal">
          <X size={20} className="stroke-[2.5]" />
        </button>

        {isSuccess ? (
          /* SUCCESS STATE */
          <div className="flex-1 p-6 sm:p-8 text-center space-y-5 flex flex-col justify-center">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-none flex items-center justify-center mx-auto shadow-inner animate-in zoom-in duration-300">
              <CheckCircle2 size={36} className="stroke-[2.5]" />
            </div>

            <div>
              <span className="inline-block px-3 py-1 rounded-none text-xs font-semibold bg-blue-50 text-[#1b3b6f] mb-2">
                Session {admissionModalData.session}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-poppins text-gray-900">
                {isHindi
                  ? "आवेदन सफलतापूर्वक प्राप्त हुआ!"
                  : "Application Submitted Successfully!"}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 font-sans max-w-md mx-auto">
                {isHindi
                  ? `धन्यवाद ${formData.name}, आपका आवेदन दर्ज हो चुका है। हमारा प्रवेश परामर्श विभाग आपसे शीघ्र ही संपर्क करेगा।`
                  : `Thank you, ${formData.name}! Your admission enquiry for ${formData.programme} has been registered.`}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-none p-4 text-left space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between items-center text-gray-500">
                <span>
                  {isHindi
                    ? "आवेदन संदर्भ संख्या:"
                    : "Application Reference No:"}
                </span>
                <span className="font-mono font-bold text-[#1b3b6f] text-sm sm:text-base">
                  {submittedRef}
                </span>
              </div>
              <div className="flex justify-between items-center text-gray-500">
                <span>
                  {isHindi ? "पंजीकृत मोबाइल:" : "Registered Mobile:"}
                </span>
                <span className="font-medium text-gray-800">
                  +91 {formData.phone}
                </span>
              </div>
              <div className="flex justify-between items-center text-gray-500">
                <span>{isHindi ? "स्थान:" : "Location:"}</span>
                <span className="font-medium text-gray-800">
                  {formData.city}, {formData.state}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={`tel:${cleanPhoneNum}`}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-none bg-[#1b3b6f] text-white text-xs sm:text-sm font-semibold hover:bg-[#142d55] transition shadow-xs">
                <Phone size={16} />
                <span>
                  {isHindi ? "हेल्पलाइन पर कॉल करें" : "Call Helpline Now"}
                </span>
              </a>

              <button
                type="button"
                onClick={closeAdmissionModal}
                className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-none border border-gray-300 text-gray-700 text-xs sm:text-sm font-semibold hover:bg-gray-50 transition">
                {isHindi ? "समाप्त करें" : "Done / Close"}
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 pt-1">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>
                Official Haryana Shakti College of Education Admissions
              </span>
            </div>
          </div>
        ) : (
          /* FORM STATE */
          <div className="flex-1 p-6 sm:p-7 flex flex-col">
            {/* Header: Logo + Title + Subtitle */}
            <div className="flex items-center gap-3.5 pr-8 pb-5 border-b border-gray-100 mt-2 sm:mt-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-none border border-blue-100 p-1 bg-white shadow-xs flex-shrink-0 flex items-center justify-center overflow-hidden">
                <img
                  src={admissionModalData.logoSrc}
                  width="432"
                  height="432"
                  onError={(e) => {
                    e.currentTarget.src = admissionModalData.logoFallback;
                  }}
                  alt="College Logo"
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <h2
                  id="admission-modal-title"
                  className="font-poppins font-bold text-[19px] sm:text-[22px] text-[#1b3b6f] leading-tight tracking-tight">
                  Admission Form
                </h2>
                <p className="text-[12.5px] sm:text-[13.5px] font-semibold text-[#dc2626] mt-0.5 leading-snug">
                  Share your details to learn about courses, eligibility, fees,
                  and the admission process.{" "}
                </p>
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="mt-5 space-y-3.5 flex-1"
              noValidate>
              {/* Field 1: Candidate's name */}
              <div>
                <label
                  htmlFor="admission-name"
                  className="block text-[13px] font-normal text-gray-700 mb-1">
                  Candidate's name{" "}
                  <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  ref={firstInputRef}
                  id="admission-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Candidate's name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className={`w-full rounded-none border bg-white px-3.5 py-2.5 text-[13.5px] text-gray-800 placeholder-gray-400 outline-none transition focus:ring-2 focus:ring-[#1b3b6f]/20 ${
                    errors.name
                      ? "border-red-400 focus:border-red-500"
                      : "border-gray-300 hover:border-gray-400 focus:border-[#1b3b6f]"
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-[11px] text-red-600 font-medium">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Row: Email & Mobile number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Field 2: Candidate's email address */}
                <div>
                  <label
                    htmlFor="admission-email"
                    className="block text-[13px] font-normal text-gray-700 mb-1">
                    Candidate's email address{" "}
                    <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    id="admission-email"
                    type="email"
                    autoComplete="email"
                    placeholder="Candidate's email address"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className={`w-full rounded-none border bg-white px-3.5 py-2.5 text-[13.5px] text-gray-800 placeholder-gray-400 outline-none transition focus:ring-2 focus:ring-[#1b3b6f]/20 ${
                      errors.email
                        ? "border-red-400 focus:border-red-500"
                        : "border-gray-300 hover:border-gray-400 focus:border-[#1b3b6f]"
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-[11px] text-red-600 font-medium">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Field 3: Mobile number */}
                <div>
                  <label
                    htmlFor="admission-phone"
                    className="block text-[13px] font-normal text-gray-700 mb-1">
                    Mobile number{" "}
                    <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    id="admission-phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    autoComplete="tel"
                    placeholder="Mobile"
                    value={formData.phone}
                    onChange={(e) =>
                      handleChange("phone", e.target.value.replace(/\D/g, ""))
                    }
                    className={`w-full rounded-none border bg-white px-3.5 py-2.5 text-[13.5px] text-gray-800 placeholder-gray-400 outline-none transition focus:ring-2 focus:ring-[#1b3b6f]/20 ${
                      errors.phone
                        ? "border-red-400 focus:border-red-500"
                        : "border-gray-300 hover:border-gray-400 focus:border-[#1b3b6f]"
                    }`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-[11px] text-red-600 font-medium">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Field 4: Select programme */}
              <div>
                <label
                  htmlFor="admission-programme"
                  className="block text-[13px] font-normal text-gray-700 mb-1">
                  Select programme{" "}
                  <span className="text-red-500 font-bold">*</span>
                </label>
                <div className="relative">
                  <select
                    id="admission-programme"
                    value={formData.programme}
                    onChange={(e) => handleChange("programme", e.target.value)}
                    className={`w-full appearance-none rounded-none border bg-white px-3.5 py-2.5 pr-10 text-[13.5px] text-gray-800 outline-none transition focus:ring-2 focus:ring-[#1b3b6f]/20 cursor-pointer ${
                      errors.programme
                        ? "border-red-400 focus:border-red-500"
                        : "border-gray-300 hover:border-gray-400 focus:border-[#1b3b6f]"
                    } ${!formData.programme ? "text-gray-400" : "text-gray-800"}`}>
                    <option value="" disabled>
                      Select programme
                    </option>
                    {admissionModalData.courses.map((prog) => (
                      <option key={prog} value={prog} className="text-gray-800">
                        {prog}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={18}
                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                </div>
                {errors.programme && (
                  <p className="mt-1 text-[11px] text-red-600 font-medium">
                    {errors.programme}
                  </p>
                )}
              </div>

              {/* Row: Select State & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Field 5: Select State */}
                <div>
                  <label
                    htmlFor="admission-state"
                    className="block text-[13px] font-normal text-gray-700 mb-1">
                    Select State{" "}
                    <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="admission-state"
                      value={formData.state}
                      onChange={(e) => {
                        const newState = e.target.value;
                        handleChange("state", newState);
                        if (admissionModalData.popularCities[newState]) {
                          handleChange(
                            "city",
                            admissionModalData.popularCities[newState][0],
                          );
                        } else {
                          handleChange("city", "");
                        }
                      }}
                      className={`w-full appearance-none rounded-none border bg-white px-3.5 py-2.5 pr-10 text-[13.5px] text-gray-800 outline-none transition focus:ring-2 focus:ring-[#1b3b6f]/20 cursor-pointer ${
                        errors.state
                          ? "border-red-400 focus:border-red-500"
                          : "border-gray-300 hover:border-gray-400 focus:border-[#1b3b6f]"
                      } ${!formData.state ? "text-gray-400" : "text-gray-800"}`}>
                      <option value="" disabled>
                        Select state*
                      </option>
                      {admissionModalData.states.map((st) => (
                        <option key={st} value={st} className="text-gray-800">
                          {st}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={18}
                      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                  </div>
                  {errors.state && (
                    <p className="mt-1 text-[11px] text-red-600 font-medium">
                      {errors.state}
                    </p>
                  )}
                </div>

                {/* Field 6: City */}
                <div>
                  <label
                    htmlFor="admission-city"
                    className="block text-[13px] font-normal text-gray-700 mb-1">
                    City <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    {admissionModalData.popularCities[formData.state] ? (
                      <>
                        <select
                          id="admission-city"
                          value={formData.city}
                          onChange={(e) => handleChange("city", e.target.value)}
                          className={`w-full appearance-none rounded-none border bg-white px-3.5 py-2.5 pr-10 text-[13.5px] text-gray-800 outline-none transition focus:ring-2 focus:ring-[#1b3b6f]/20 cursor-pointer ${
                            errors.city
                              ? "border-red-400 focus:border-red-500"
                              : "border-gray-300 hover:border-gray-400 focus:border-[#1b3b6f]"
                          }`}>
                          <option value="" disabled>
                            Select city
                          </option>
                          {admissionModalData.popularCities[formData.state].map(
                            (c) => (
                              <option
                                key={c}
                                value={c}
                                className="text-gray-800">
                                {c}
                              </option>
                            ),
                          )}
                        </select>
                        <ChevronDown
                          size={18}
                          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500"
                        />
                      </>
                    ) : (
                      <input
                        id="admission-city"
                        type="text"
                        placeholder="Select city"
                        value={formData.city}
                        onChange={(e) => handleChange("city", e.target.value)}
                        className={`w-full rounded-none border bg-white px-3.5 py-2.5 text-[13.5px] text-gray-800 placeholder-gray-400 outline-none transition focus:ring-2 focus:ring-[#1b3b6f]/20 ${
                          errors.city
                            ? "border-red-400 focus:border-red-500"
                            : "border-gray-300 hover:border-gray-400 focus:border-[#1b3b6f]"
                        }`}
                      />
                    )}
                  </div>
                  {errors.city && (
                    <p className="mt-1 text-[11px] text-red-600 font-medium">
                      {errors.city}
                    </p>
                  )}
                </div>
              </div>

              {/* Checkbox Agreement */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.agreed}
                    onChange={(e) => handleChange("agreed", e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded-none border-gray-300 text-[#1b3b6f] focus:ring-[#1b3b6f] accent-[#1b3b6f] cursor-pointer"
                  />
                  <span className="text-[11.5px] sm:text-[12px] text-gray-600 leading-snug">
                    I agree to receive information regarding my submitted
                    application by signing up on Haryana Shakti College's
                    website.
                  </span>
                </label>
                {errors.agreed && (
                  <p className="mt-1 text-[11px] text-red-600 font-medium">
                    {errors.agreed}
                  </p>
                )}
              </div>

              {errors.submit && (
                <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-none border border-red-200">
                  {errors.submit}
                </p>
              )}

              {/* Submit Button */}
              <div className="pt-4 pb-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-none bg-[#1b3b6f] px-6 py-3 text-[13.5px] font-semibold text-white shadow-sm transition hover:bg-[#142d55] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed">
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>
                        {isHindi ? "जमा हो रहा है..." : "Submitting..."}
                      </span>
                    </>
                  ) : (
                    <span>Submit & Apply</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdmissionModal;

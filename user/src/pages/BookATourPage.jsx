import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Phone,
  UserRound,
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Printer,
  Check,
  AlertCircle,
  ExternalLink,
  Mail,
  BookOpen,
  Building2,
  HelpCircle,
  Compass,
} from "lucide-react";

import { Container } from "../components/common/Container";
import { PageHeaderBanner } from "../components/common/PageHeaderBanner";
import { CollegiateWatermarkBg } from "../components/common/CollegiateWatermarkBg";
import { useLanguage } from "../context/LanguageContext";
import { submitTourBooking } from "../services/tourService";

const TIME_SLOTS = [
  {
    id: "slot1",
    label: "Morning: 10:00 AM – 11:30 AM",
    hiLabel: "सुबह: 10:00 AM – 11:30 AM",
  },
  {
    id: "slot2",
    label: "Midday: 11:30 AM – 01:00 PM",
    hiLabel: "दोपहर: 11:30 AM – 01:00 PM",
  },
  {
    id: "slot3",
    label: "Afternoon: 01:30 PM – 03:00 PM",
    hiLabel: "अपराह्न: 01:30 PM – 03:00 PM",
  },
  {
    id: "slot4",
    label: "Late Afternoon: 03:00 PM – 04:30 PM",
    hiLabel: "शाम: 03:00 PM – 04:30 PM",
  },
];

const GRADUATION_DEGREES = [
  "B.A. (Bachelor of Arts)",
  "B.Sc. (Bachelor of Science — PCM / CBZ)",
  "B.Com. (Bachelor of Commerce)",
  "B.Tech. / B.E. (Engineering)",
  "M.A. / M.Sc. / M.Com. (Postgraduate)",
  "B.C.A. / B.B.A. / Other Degree",
];

const KEY_LABS = [
  {
    id: "curriculum_labs",
    label: "Curriculum Laboratories",
    hiLabel: "शिक्षण प्रयोगशालाएं",
  },
  {
    id: "psychology_lab",
    label: "Psychology Lab",
    hiLabel: "मनोविज्ञान लैब",
  },
  {
    id: "ict_center",
    label: "ICT & Digital Lab",
    hiLabel: "कंप्यूटर व आईसीटी लैब",
  },
  {
    id: "library",
    label: "Library & Reading Hall",
    hiLabel: "समृद्ध पुस्तकालय",
  },
  {
    id: "art_craft",
    label: "Art & Craft Studio",
    hiLabel: "कला एवं शिल्प केंद्र",
  },
  {
    id: "seminar_hall",
    label: "Seminar Hall",
    hiLabel: "बहुउद्देशीय सभागार",
  },
  {
    id: "principal_desk",
    label: "Principal & Faculty Desk",
    hiLabel: "प्राचार्या व संकाय परामर्श",
  },
];

const INITIAL_FORM = {
  candidateName: "",
  candidatePhone: "",
  candidateEmail: "",
  guardianName: "",
  guardianPhone: "",
  relationship: "Parent",
  city: "",
  graduationStatus: "Passed Graduation",
  graduationDegree: "B.A. (Bachelor of Arts)",
  graduationPercentage: "",
  previousCollege: "",
  pedagogyInterests: ["Social Science"],
  preferredDate: "",
  preferredTimeSlot: "Morning: 10:00 AM – 11:30 AM",
  visitorsCount: 2,
  facilitiesToInspect: ["curriculum_labs", "library", "principal_desk"],
  specialNotes: "",
};

const FIELD_CLASS =
  "w-full min-w-0 rounded-sm border border-gray-200 bg-[#F9FAFB] px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-gray-400 focus:border-[#2E3A8C] focus:bg-white focus:outline-none";

const LABEL_CLASS =
  "mb-1.5 block text-xs font-bold tracking-tight text-[#34374A]";

function Field({ id, label, error, required, children, className = "" }) {
  return (
    <div id={id ? `field-${id}` : undefined} className={`min-w-0 ${className}`}>
      <label className={LABEL_CLASS}>
        {label}
        {required && <span className="ml-1 text-red-600 font-semibold">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 flex items-start gap-1.5 text-xs font-medium text-red-600">
          <AlertCircle size={13} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

export default function BookATourPage() {
  const { isHindi } = useLanguage();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [formData, setFormData] = useState({ ...INITIAL_FORM });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  // Calculate minimum selectable date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateString = [
    tomorrow.getFullYear(),
    String(tomorrow.getMonth() + 1).padStart(2, "0"),
    String(tomorrow.getDate()).padStart(2, "0"),
  ].join("-");

  const t = (en, hi) => (isHindi ? hi : en);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setSubmitError("");
  };

  const toggleFacility = (id) => {
    setFormData((prev) => {
      const selected = prev.facilitiesToInspect || [];
      return {
        ...prev,
        facilitiesToInspect: selected.includes(id)
          ? selected.filter((item) => item !== id)
          : [...selected, id],
      };
    });
  };

  const validateAll = () => {
    const nextErrors = {};
    const phone = formData.candidatePhone.replace(/\D/g, "");

    // 1. Candidate Name
    if (!formData.candidateName.trim()) {
      nextErrors.candidateName = t(
        "Candidate name is required.",
        "छात्र का पूरा नाम आवश्यक है।",
      );
    }

    // 2. Candidate Phone
    if (!/^[6-9]\d{9}$/.test(phone)) {
      nextErrors.candidatePhone = t(
        "Enter a valid 10-digit Indian mobile number.",
        "वैध 10-अंकीय भारतीय मोबाइल नंबर दर्ज करें।",
      );
    }

    // 3. Candidate Email (optional, but validate format if entered)
    if (
      formData.candidateEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.candidateEmail.trim())
    ) {
      nextErrors.candidateEmail = t(
        "Enter a valid email address.",
        "कृपया वैध ईमेल पता दर्ज करें।",
      );
    }

    // 4. Guardian Name
    if (!formData.guardianName.trim()) {
      nextErrors.guardianName = t(
        "Parent / guardian name is required.",
        "अभिभावक का नाम आवश्यक है।",
      );
    }

    // 5. Graduation Percentage
    const percentage = Number(
      formData.graduationPercentage.replace("%", "").trim(),
    );
    if (!formData.graduationPercentage.trim()) {
      nextErrors.graduationPercentage = t(
        "Graduation percentage is required.",
        "स्नातक प्रतिशत दर्ज करना आवश्यक है।",
      );
    } else if (
      !Number.isFinite(percentage) ||
      percentage < 0 ||
      percentage > 100
    ) {
      nextErrors.graduationPercentage = t(
        "Enter a percentage between 0 and 100.",
        "0 से 100 के बीच प्रतिशत दर्ज करें।",
      );
    }

    // 6. Preferred Visit Date
    if (!formData.preferredDate) {
      nextErrors.preferredDate = t(
        "Please select a preferred visit date.",
        "कृपया भ्रमण की तिथि चुनें।",
      );
    } else if (formData.preferredDate < minDateString) {
      nextErrors.preferredDate = t(
        "Please choose tomorrow or a later date.",
        "कृपया कल या उसके बाद की तिथि चुनें।",
      );
    }

    setErrors(nextErrors);
    return nextErrors;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetBooking = () => {
    setFormData({ ...INITIAL_FORM });
    setErrors({});
    setSubmissionSuccess(false);
    setConfirmedBooking(null);
    setSubmitError("");
    scrollToTop();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateAll();
    const errorKeys = Object.keys(validationErrors);

    if (errorKeys.length > 0) {
      // Smoothly scroll to the first field that has an error
      const firstKey = errorKeys[0];
      const targetElement = document.getElementById(`field-${firstKey}`);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
        const input = targetElement.querySelector("input, select, textarea");
        if (input) input.focus();
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await submitTourBooking(formData);

      if (response?.success) {
        setConfirmedBooking(response.record);
        setSubmissionSuccess(true);
        scrollToTop();
      } else {
        setSubmitError(
          t(
            "We couldn't confirm your request. Please try again.",
            "आपका अनुरोध दर्ज नहीं हो पाया। कृपया दोबारा प्रयास करें।",
          ),
        );
      }
    } catch (error) {
      console.error("Tour booking submission error:", error);
      setSubmitError(
        t(
          "Something went wrong while submitting your request. Please try again or contact the college directly.",
          "अनुरोध भेजते समय समस्या हुई। कृपया दोबारा प्रयास करें या सीधे कॉलेज से संपर्क करें।",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CollegiateWatermarkBg className="pb-16 font-sans text-[#25283A]">
      <div className="hidden md:block">
        <PageHeaderBanner
          headingLevel="h2"
          title={t("Book a Campus Tour", "कैंपस टूर बुक करें")}
          subtitle={t(
            "Quick 1-minute booking to visit our campus, inspect teaching labs, and speak directly with faculty.",
            "परिसर भ्रमण, शिक्षण प्रयोगशालाओं का निरीक्षण और शिक्षकों से सीधी बातचीत के लिए 1-मिनट त्वरित बुकिंग।",
          )}
          breadcrumbs={[
            { label: t("Admissions", "प्रवेश"), href: "/admissions" },
            { label: t("Book a Tour", "कैंपस टूर") },
          ]}
        />
      </div>

      <Container className="max-w-6xl pt-6 md:pt-4">
        {submissionSuccess && confirmedBooking ? (
          /* SUCCESS STATE */
          <section className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-[#DCE0E8] bg-white shadow-sm">
            <div className="h-1.5 bg-[#FBDD23]" />

            <div className="px-6 py-9 sm:px-10 sm:py-12">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EDF7F0] text-[#25834A]">
                <CheckCircle2 size={36} strokeWidth={2} />
              </div>

              <div className="mx-auto mt-4 max-w-xl text-center">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#CDE9D5] bg-[#F3FAF5] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#267443]">
                  <Check size={14} strokeWidth={3} />
                  {t("Tour Request Confirmed", "टूर अनुरोध दर्ज हो गया")}
                </span>

                <h1 className="mt-3.5 text-2xl font-extrabold tracking-tight text-[#25283A] sm:text-3xl">
                  {t(
                    "We Look Forward to Welcoming You!",
                    "हम कॉलेज परिसर में आपके स्वागत के लिए उत्सुक हैं!",
                  )}
                </h1>

                <p className="mt-2 text-sm leading-6 text-[#686D7D]">
                  {t(
                    "Your campus tour has been successfully registered. Please save your reference code below. Our admission team will welcome you at the reception desk.",
                    "आपका कैंपस भ्रमण सफलतापूर्वक दर्ज कर लिया गया है। कृपया नीचे दिया गया संदर्भ कोड सुरक्षित रखें। हमारी प्रवेश टीम स्वागत डेस्क पर आपका मार्गदर्शन करेगी।",
                  )}
                </p>
              </div>

              {/* Reference Card */}
              <div className="mx-auto mt-7 max-w-2xl overflow-hidden rounded-xl border border-[#DCE0E8]">
                <div className="flex flex-col gap-3 bg-[#292C75] px-6 py-4 text-white sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-white/70">
                      {t("Booking Reference ID", "बुकिंग संदर्भ कोड")}
                    </p>
                    <p className="mt-0.5 text-xl font-extrabold tracking-wide sm:text-2xl">
                      {confirmedBooking.bookingReference || "HSCE-CONFIRMED"}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-xs text-white/70">
                      {t("Target Programme", "कार्यक्रम")}
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-[#FBDD23]">
                      B.Ed. (2-Year Regular)
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-px bg-[#E8EAF0] sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      icon: Calendar,
                      label: t("Visit Date", "भ्रमण तिथि"),
                      value: confirmedBooking.preferredDate,
                    },
                    {
                      icon: Clock,
                      label: t("Time Slot", "समय"),
                      value: confirmedBooking.preferredTimeSlot,
                    },
                    {
                      icon: Users,
                      label: t("Visitors", "आगंतुक"),
                      value: `${confirmedBooking.visitorsCount} ${t("person(s)", "व्यक्ति")}`,
                    },
                    {
                      icon: UserRound,
                      label: t("Candidate", "छात्र"),
                      value: confirmedBooking.candidateName,
                    },
                    {
                      icon: ShieldCheck,
                      label: t("Parent / Guardian", "अभिभावक"),
                      value: `${confirmedBooking.guardianName} (${confirmedBooking.relationship || "Parent"})`,
                    },
                    {
                      icon: Phone,
                      label: t("Phone (WhatsApp)", "संपर्क नंबर"),
                      value: confirmedBooking.candidatePhone,
                    },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="bg-white p-4">
                        <div className="flex items-center gap-1.5 text-[#73788A]">
                          <Icon size={14} className="text-[#292C75]" />
                          <span className="text-[11px] font-semibold">
                            {item.label}
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs font-bold text-[#25283A] truncate">
                          {item.value || "—"}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col gap-3 border-t border-[#E8EAF0] bg-[#FAFAFC] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                  <div className="flex items-start gap-2.5">
                    <MapPin
                      size={18}
                      className="mt-0.5 shrink-0 text-[#292C75]"
                    />
                    <div>
                      <p className="text-xs font-bold text-[#25283A]">
                        Haryana Shakti College of Education
                      </p>
                      <p className="text-[11px] text-[#686D7D]">
                        Kanjhawala, North-West Delhi – 110081
                      </p>
                    </div>
                  </div>

                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(
                      "Haryana Shakti College of Education, Kanjhawala, Delhi",
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-[#D5D9E2] bg-white px-3.5 py-2 text-xs font-bold text-[#292C75] transition hover:bg-[#F4F4FB]">
                    {t("Get Directions", "गूगल मैप पर देखें")}
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>

              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#292C75] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#20225E]">
                  <Printer size={15} />
                  {t("Print Confirmation Ticket", "कन्फर्मेशन रसीद प्रिंट करें")}
                </button>

                <button
                  type="button"
                  onClick={resetBooking}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#D5D9E2] bg-white px-5 py-2.5 text-xs font-bold text-[#292C75] transition hover:bg-[#F7F8FC]">
                  {t("Book Another Visit", "एक और भ्रमण बुक करें")}
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </section>
        ) : (
          /* UNIFIED STREAMLINED 1-PAGE QUICK FORM */
          <div>
            {/* Mobile Campus Visit Navigation Card (lg:hidden) */}
            <div className="lg:hidden mb-6 overflow-hidden rounded-xl border border-gray-200/90 bg-white shadow-md">
              <div className="bg-[#2E3A8C] px-5 py-4">
                <h3 className="font-serif text-lg font-bold text-white tracking-wide">
                  {t("Campus Visit", "परिसर भ्रमण")}
                </h3>
              </div>

              <nav aria-label="Campus Visit Navigation" className="divide-y divide-gray-100 font-sans">
                <div className="px-5 py-3.5 text-sm font-bold bg-slate-50 text-[#2E3A8C] border-l-4 border-l-[#2E3A8C] pl-4">
                  {t("Schedule Tour Slot", "भ्रमण समय तय करें")}
                </div>

                <Link
                  to="/campus-life"
                  className="flex items-center justify-between px-5 py-3.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#2E3A8C] transition-colors">
                  <span>{t("Curriculum Labs & Facilities", "शिक्षण लैब्स एवं सुविधाएं")}</span>
                  <ArrowUpRight size={14} className="text-gray-400" />
                </Link>

                <Link
                  to="/contact"
                  className="flex items-center justify-between px-5 py-3.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#2E3A8C] transition-colors">
                  <span>{t("Contact Details", "संपर्क विवरण")}</span>
                  <ArrowUpRight size={14} className="text-gray-400" />
                </Link>

                <Link
                  to="/contact/enquiry"
                  className="flex items-center justify-between px-5 py-3.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#2E3A8C] transition-colors">
                  <span>{t("Admission Enquiry", "प्रवेश पूछताछ")}</span>
                  <ArrowUpRight size={14} className="text-gray-400" />
                </Link>
              </nav>
            </div>

            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            {/* Main Form Card */}
            <div className="overflow-hidden rounded-md border border-gray-200/90 bg-white p-6 sm:p-8 shadow-xs">
              {/* Card Section Header */}
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E293B]">
                {t("Book a Campus Tour", "कैंपस टूर बुक करें")}
              </h2>

              {/* Thin Dark Red / Maroon Divider Line (Image Reference) */}
              <div className="mt-3 h-[1.5px] w-full bg-[#7C2D37] mb-6" />

              {/* Form Quick Header */}
              <div className="mb-6">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#2E3A8C]/15 bg-[#2E3A8C]/[0.06] px-3 py-1 text-[11px] font-bold text-[#2E3A8C]">
                    <Clock size={13} className="text-[#2E3A8C]" />
                    {t("Quick 1-Minute Booking", "त्वरित 1-मिनट बुकिंग")}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#666B7C]">
                    <ShieldCheck size={14} className="text-[#25834A]" />
                    {t("Free Guided Tour · Instant Confirmation", "निःशुल्क गाइडेड टूर · तुरंत पुष्टि")}
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl font-bold text-center text-[#1E293B]">
                  {t("Schedule Your Campus Visit", "कॉलेज परिसर भ्रमण तय करें")}
                </h1>
                <p className="mt-1 text-center text-xs leading-5 text-[#6B7082] sm:text-sm">
                  {t(
                    "Fill in your details below to inspect laboratories, library, and consult with the Principal & admission team.",
                    "प्रयोगशालाओं, पुस्तकालय का निरीक्षण करने और प्राचार्या व प्रवेश टीम से परामर्श के लिए नीचे अपनी जानकारी भरें।",
                  )}
                </p>
              </div>

              {/* The Form */}
              <form onSubmit={handleSubmit} noValidate className="p-5 sm:p-7 space-y-7">
                {/* SECTION 1: CANDIDATE & GUARDIAN */}
                <div>
                  <div className="mb-4 flex items-center gap-2 border-b border-[#EDEFF4] pb-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#292C75] text-[11px] font-extrabold text-white">
                      1
                    </span>
                    <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#292C75]">
                      {t("Candidate & Guardian Contact", "छात्र एवं अभिभावक संपर्क")}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                    <Field
                      id="candidateName"
                      label={t("Candidate's Full Name", "छात्र का पूरा नाम")}
                      required
                      error={errors.candidateName}>
                      <input
                        type="text"
                        autoComplete="name"
                        value={formData.candidateName}
                        onChange={(e) =>
                          handleInputChange("candidateName", e.target.value)
                        }
                        placeholder={t("Full name", "पूरा नाम")}
                        className={FIELD_CLASS}
                      />
                    </Field>

                    <Field
                      id="candidatePhone"
                      label={t("Mobile Number (WhatsApp)", "मोबाइल नंबर (व्हाट्सएप)")}
                      required
                      error={errors.candidatePhone}>
                      <input
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel"
                        maxLength={10}
                        value={formData.candidatePhone}
                        onChange={(e) =>
                          handleInputChange(
                            "candidatePhone",
                            e.target.value.replace(/\D/g, "").slice(0, 10),
                          )
                        }
                        placeholder="10-digit mobile number"
                        className={FIELD_CLASS}
                      />
                    </Field>

                    <Field
                      id="candidateEmail"
                      label={t("Email Address", "ईमेल पता")}
                      error={errors.candidateEmail}>
                      <input
                        type="email"
                        autoComplete="email"
                        value={formData.candidateEmail}
                        onChange={(e) =>
                          handleInputChange("candidateEmail", e.target.value)
                        }
                        placeholder={t("you@example.com (optional)", "you@example.com (वैकल्पिक)")}
                        className={FIELD_CLASS}
                      />
                    </Field>

                    <Field
                      id="guardianName"
                      label={t("Parent / Guardian Name", "अभिभावक का नाम")}
                      required
                      error={errors.guardianName}>
                      <input
                        type="text"
                        value={formData.guardianName}
                        onChange={(e) =>
                          handleInputChange("guardianName", e.target.value)
                        }
                        placeholder={t("Father / Mother / Guardian", "पिता / माता / अभिभावक")}
                        className={FIELD_CLASS}
                      />
                    </Field>

                    <Field
                      id="relationship"
                      label={t("Relationship to Candidate", "प्रत्याशी से संबंध")}>
                      <select
                        value={formData.relationship}
                        onChange={(e) =>
                          handleInputChange("relationship", e.target.value)
                        }
                        className={FIELD_CLASS}>
                        <option value="Parent">{t("Parent", "माता-पिता")}</option>
                        <option value="Father">{t("Father", "पिता")}</option>
                        <option value="Mother">{t("Mother", "माता")}</option>
                        <option value="Guardian">{t("Guardian", "अभिभावक")}</option>
                        <option value="Self">{t("Self / Candidate", "स्वयं छात्र")}</option>
                        <option value="Spouse">{t("Spouse", "पति / पत्नी")}</option>
                      </select>
                    </Field>

                    <Field
                      id="city"
                      label={t("City / Area Location", "शहर / क्षेत्र")}>
                      <input
                        type="text"
                        autoComplete="address-level2"
                        value={formData.city}
                        onChange={(e) =>
                          handleInputChange("city", e.target.value)
                        }
                        placeholder={t("e.g. Rohini, Delhi / Sonipat", "उदा. रोहिणी, दिल्ली / सोनीपत")}
                        className={FIELD_CLASS}
                      />
                    </Field>
                  </div>
                </div>

                {/* SECTION 2: ACADEMIC QUALIFICATIONS */}
                <div>
                  <div className="mb-4 flex items-center justify-between border-b border-[#EDEFF4] pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#292C75] text-[11px] font-extrabold text-white">
                        2
                      </span>
                      <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#292C75]">
                        {t("Academic Qualifications", "शैक्षणिक योग्यता")}
                      </h2>
                    </div>
                    <span className="text-[11px] font-bold text-[#555AA0] bg-[#F2F3FA] px-2 py-0.5 rounded">
                      B.Ed. (2-Yr)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Field
                      id="graduationStatus"
                      label={t("Graduation Status", "स्नातक स्थिति")}>
                      <select
                        value={formData.graduationStatus}
                        onChange={(e) =>
                          handleInputChange("graduationStatus", e.target.value)
                        }
                        className={FIELD_CLASS}>
                        <option value="Passed Graduation">
                          {t("Passed", "उत्तीर्ण (Passed)")}
                        </option>
                        <option value="Appearing Final Year">
                          {t("Final Year Appearing", "अंतिम वर्ष (Appearing)")}
                        </option>
                        <option value="Postgraduate">
                          {t("Postgraduate", "परास्नातक (PG)")}
                        </option>
                      </select>
                    </Field>

                    <Field
                      id="graduationDegree"
                      label={t("Degree / Stream", "डिग्री / विषय")}>
                      <select
                        value={formData.graduationDegree}
                        onChange={(e) =>
                          handleInputChange("graduationDegree", e.target.value)
                        }
                        className={FIELD_CLASS}>
                        {GRADUATION_DEGREES.map((deg) => (
                          <option key={deg} value={deg}>
                            {deg}
                          </option>
                        ))}
                      </select>
                    </Field>

                    <Field
                      id="graduationPercentage"
                      label={t("Aggregate %", "कुल प्रतिशत %")}
                      required
                      error={errors.graduationPercentage}>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={formData.graduationPercentage}
                        onChange={(e) =>
                          handleInputChange(
                            "graduationPercentage",
                            e.target.value.replace(/[^\d.%]/g, ""),
                          )
                        }
                        placeholder={t("e.g. 58.5%", "उदा. 58.5%")}
                        className={FIELD_CLASS}
                      />
                    </Field>

                    <Field
                      id="previousCollege"
                      label={t("Previous University / College", "विश्वविद्यालय / कॉलेज")}>
                      <input
                        type="text"
                        value={formData.previousCollege}
                        onChange={(e) =>
                          handleInputChange("previousCollege", e.target.value)
                        }
                        placeholder={t("e.g. DU, MDU, IPU", "उदा. DU, MDU, IPU")}
                        className={FIELD_CLASS}
                      />
                    </Field>
                  </div>
                </div>

                {/* SECTION 3: VISIT SCHEDULE & PREFERENCES */}
                <div>
                  <div className="mb-4 flex items-center gap-2 border-b border-[#EDEFF4] pb-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#292C75] text-[11px] font-extrabold text-white">
                      3
                    </span>
                    <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#292C75]">
                      {t("Tour Schedule & Preferences", "भ्रमण की योजना एवं प्राथमिकताएं")}
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {/* Date & Time Slot Grid */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field
                        id="preferredDate"
                        label={t("Preferred Visit Date", "भ्रमण की तिथि")}
                        required
                        error={errors.preferredDate}>
                        <div className="relative">
                          <Calendar
                            size={16}
                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777C8D]"
                          />
                          <input
                            type="date"
                            min={minDateString}
                            value={formData.preferredDate}
                            onChange={(e) =>
                              handleInputChange("preferredDate", e.target.value)
                            }
                            className={`${FIELD_CLASS} pl-10`}
                          />
                        </div>
                      </Field>

                      <Field
                        id="preferredTimeSlot"
                        label={t("Preferred Time Slot", "पसंदीदा समय")}>
                        <div className="relative">
                          <Clock
                            size={16}
                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777C8D]"
                          />
                          <select
                            value={formData.preferredTimeSlot}
                            onChange={(e) =>
                              handleInputChange(
                                "preferredTimeSlot",
                                e.target.value,
                              )
                            }
                            className={`${FIELD_CLASS} pl-10`}>
                            {TIME_SLOTS.map((slot) => (
                              <option key={slot.id} value={slot.label}>
                                {isHindi ? slot.hiLabel : slot.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </Field>
                    </div>

                    {/* Visitors Count Segmented Buttons */}
                    <div>
                      <label className={LABEL_CLASS}>
                        {t("Total Visitors Attending", "आने वाले कुल सदस्यों की संख्या")}
                      </label>
                      <div className="grid grid-cols-3 gap-2 sm:max-w-md">
                        {[1, 2, 3].map((num) => {
                          const active = formData.visitorsCount === num;
                          return (
                            <button
                              key={num}
                              type="button"
                              onClick={() => handleInputChange("visitorsCount", num)}
                              className={`flex items-center justify-center gap-1.5 rounded-lg border py-2 px-3 text-xs font-bold transition ${
                                active
                                  ? "border-[#292C75] bg-[#292C75] text-white shadow-sm ring-2 ring-[#292C75]/20"
                                  : "border-[#D5D9E2] bg-white text-[#4A4F60] hover:border-[#A8B0C4] hover:bg-[#F8F9FB]"
                              }`}>
                              <Users size={14} className={active ? "text-white" : "text-[#777C8D]"} />
                              <span>{num} {t("Person", "व्यक्ति")}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Facilities to Explore: Compact Clickable Tag Pills */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className={LABEL_CLASS}>
                          {t("Facilities You Wish to Explore", "देखने योग्य प्रमुख सुविधाएं")}
                        </label>
                        <span className="text-[11px] text-[#7A8092]">
                          {t("(Tap to select / unselect)", "(चुनने हेतु टैप करें)")}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {KEY_LABS.map((lab) => {
                          const selected = formData.facilitiesToInspect.includes(lab.id);
                          return (
                            <button
                              key={lab.id}
                              type="button"
                              onClick={() => toggleFacility(lab.id)}
                              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                                selected
                                  ? "border-[#292C75] bg-[#292C75]/[0.08] text-[#292C75] ring-1 ring-[#292C75]/25"
                                  : "border-[#DCE0E8] bg-white text-[#525768] hover:border-[#B5BBCB] hover:bg-[#F7F8FA]"
                              }`}>
                              <span
                                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] ${
                                  selected
                                    ? "bg-[#292C75] text-white"
                                    : "border border-[#CCD1DE] bg-white text-transparent"
                                }`}>
                                <Check size={10} strokeWidth={3} />
                              </span>
                              <span>{isHindi ? lab.hiLabel : lab.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Special Notes / Questions (compact) */}
                    <Field
                      id="specialNotes"
                      label={t("Any Questions or Special Assistance?", "कोई विशेष प्रश्न या सहायता?")}>
                      <textarea
                        rows={2}
                        value={formData.specialNotes}
                        onChange={(e) =>
                          handleInputChange("specialNotes", e.target.value)
                        }
                        placeholder={t(
                          "Optional: Ask about admission criteria, fees, transport, syllabus...",
                          "वैकल्पिक: प्रवेश प्रक्रिया, फीस, बस सुविधा या पाठ्यक्रम से जुड़े प्रश्न...",
                        )}
                        className={`${FIELD_CLASS} resize-none`}
                      />
                    </Field>
                  </div>
                </div>

                {submitError && (
                  <div
                    role="alert"
                    className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-xs font-medium text-red-700">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Submit Action */}
                <div className="border-t border-[#EDEFF4] pt-5">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#292C75] py-3.5 px-6 text-sm font-extrabold text-white shadow-md transition hover:bg-[#20225E] hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#292C75]/20 disabled:cursor-not-allowed disabled:opacity-60">
                    {isSubmitting ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        <span>{t("Submitting Your Tour Request...", "अनुरोध दर्ज हो रहा है...")}</span>
                      </>
                    ) : (
                      <>
                        <span>{t("Confirm & Book Campus Tour", "कैंपस भ्रमण सुनिश्चित एवं बुक करें")}</span>
                        <ArrowRight size={17} />
                      </>
                    )}
                  </button>

                  <p className="mt-2.5 text-center text-[11px] text-[#7A8092]">
                    {t(
                      "🔒 Instant confirmation. No booking fee or obligation. Need help? Call 9953155054",
                      "🔒 तुरंत पुष्टि। कोई शुल्क नहीं। सहायता हेतु कॉल करें: 9953155054",
                    )}
                  </p>
                </div>
              </form>
            </div>

            {/* Desktop Quick Info Sticky Sidebar */}
            <aside className="space-y-5 lg:sticky lg:top-24">
              {/* Sidebar Navigation Widget (Matching Reference Image) */}
              <div className="hidden lg:block overflow-hidden rounded-md border border-gray-200/90 bg-white shadow-md">
                <div className="bg-[#2E3A8C] px-5 py-4">
                  <h3 className="font-serif text-lg font-bold text-white tracking-wide">
                    {t("Campus Visit", "परिसर भ्रमण")}
                  </h3>
                </div>

                <nav aria-label="Campus Visit Navigation" className="divide-y divide-gray-100">
                  <div className="px-5 py-3.5 text-sm font-bold bg-slate-50 text-[#2E3A8C] border-l-4 border-l-[#2E3A8C] pl-4">
                    {t("Schedule Tour Slot", "भ्रमण समय तय करें")}
                  </div>

                  <Link
                    to="/campus-life"
                    className="flex items-center justify-between px-5 py-3.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#2E3A8C] transition-colors">
                    <span>{t("Curriculum Labs & Facilities", "शिक्षण लैब्स एवं सुविधाएं")}</span>
                    <ArrowUpRight size={14} className="text-gray-400" />
                  </Link>

                  <Link
                    to="/contact"
                    className="flex items-center justify-between px-5 py-3.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#2E3A8C] transition-colors">
                    <span>{t("Contact Details", "संपर्क विवरण")}</span>
                    <ArrowUpRight size={14} className="text-gray-400" />
                  </Link>

                  <Link
                    to="/contact/enquiry"
                    className="flex items-center justify-between px-5 py-3.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#2E3A8C] transition-colors">
                    <span>{t("Admission Enquiry", "प्रवेश पूछताछ")}</span>
                    <ArrowUpRight size={14} className="text-gray-400" />
                  </Link>
                </nav>
              </div>

              {/* Tour Highlights */}
              <div className="rounded-2xl border border-[#DCE0E8] bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 text-[#292C75] font-extrabold text-sm mb-3">
                  <Compass size={18} />
                  <h3>{t("What to Expect on Your Visit", "भ्रमण के दौरान क्या देखें?")}</h3>
                </div>

                <ul className="space-y-2.5 text-xs text-[#525768]">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#25834A]" />
                    <span>
                      <strong className="text-[#25283A]">{t("Guided Walkthrough:", "गाइडेड टूर:")}</strong>{" "}
                      {t("Explore smart classrooms, curriculum labs, and art studio.", "स्मार्ट क्लासरूम, शिक्षण लैब्स एवं कला स्टूडियो देखें।")}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#25834A]" />
                    <span>
                      <strong className="text-[#25283A]">{t("Faculty Interaction:", "संकाय संवाद:")}</strong>{" "}
                      {t("Meet senior teacher educators and discuss B.Ed. curriculum.", "वरिष्ठ प्राध्यापकों से बी.एड. पाठ्यक्रम पर चर्चा करें।")}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#25834A]" />
                    <span>
                      <strong className="text-[#25283A]">{t("Admission Desk:", "प्रवेश परामर्श:")}</strong>{" "}
                      {t("Get direct guidance on GGSIPU eligibility, documents & fees.", "आईपी यूनिवर्सिटी पात्रता, दस्तावेज एवं शुल्क की जानकारी लें।")}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Visiting Hours & Contact Card */}
              <div className="rounded-2xl border border-[#DCE0E8] bg-white p-5 shadow-sm space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#25283A] mb-1">
                    <Clock size={15} className="text-[#292C75]" />
                    <span>{t("Visiting Hours", "भ्रमण समय")}</span>
                  </div>
                  <p className="text-xs text-[#6B7082] pl-6">
                    {t("Monday – Saturday: 10:00 AM – 4:30 PM", "सोमवार से शनिवार: 10:00 AM – 4:30 PM")}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#25283A] mb-1">
                    <Phone size={15} className="text-[#292C75]" />
                    <span>{t("Tour Helpline", "हेल्पलाइन नंबर")}</span>
                  </div>
                  <div className="pl-6 text-xs text-[#6B7082] space-y-0.5">
                    <a
                      href="tel:9953155054"
                      className="block font-bold text-[#292C75] hover:underline">
                      +91 9953155054
                    </a>
                    <a
                      href="tel:8056777077"
                      className="block font-bold text-[#292C75] hover:underline">
                      +91 8056777077
                    </a>
                  </div>
                </div>

                <div className="border-t border-[#EDEFF4] pt-3">
                  <div className="flex items-start gap-2 text-xs">
                    <MapPin size={16} className="mt-0.5 shrink-0 text-[#292C75]" />
                    <div>
                      <p className="font-bold text-[#25283A]">
                        {t("Campus Address", "कैंपस का पता")}
                      </p>
                      <p className="text-[11px] text-[#6B7082] mt-0.5">
                        Kanjhawala, North-West Delhi – 110081
                      </p>
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(
                          "Haryana Shakti College of Education, Kanjhawala, Delhi",
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold text-[#292C75] hover:underline">
                        {t("Open Google Maps Directions", "गूगल मैप पर रास्ता देखें")}
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
        )}
      </Container>

      <style>{`
        @media print {
          body {
            background: white !important;
          }
          body * {
            visibility: hidden;
          }
          section,
          section * {
            visibility: visible;
          }
          button,
          a {
            print-color-adjust: exact;
          }
        }
      `}</style>
    </CollegiateWatermarkBg>
  );
}

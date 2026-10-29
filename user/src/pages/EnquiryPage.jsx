import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Building2,
  MessageCircle,
  BriefcaseBusiness,
  Compass,
} from "lucide-react";

import { Container } from "../components/common/Container";
import { PageHeaderBanner } from "../components/common/PageHeaderBanner";
import { CollegiateWatermarkBg } from "../components/common/CollegiateWatermarkBg";
import { useLanguage } from "../context/LanguageContext";
import { submitFeedback } from "../services/feedbackService";
import { submitStudentEnquiry } from "../services/enquiryService";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  category: "Pupil-Teacher (Student)",
  howKnowSite: "",
  queryType: "B.Ed. Regular",
  subject: "Admission Query",
  message: "",
};

export default function EnquiryPage() {
  const { isHindi } = useLanguage();

  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [referenceId, setReferenceId] = useState("");

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError(isHindi ? "कृपया अपना नाम लिखें।" : "Please enter your name.");
      return;
    }

    if (!form.email.trim() || !form.email.includes("@")) {
      setError(
        isHindi
          ? "कृपया मान्य ईमेल पता दर्ज करें।"
          : "Please enter a valid email address.",
      );
      return;
    }

    const cleanPhone = form.phone.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setError(
        isHindi
          ? "कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें।"
          : "Please enter a valid 10-digit Indian mobile number.",
      );
      return;
    }

    if (form.message.trim().length < 5) {
      setError(
        isHindi
          ? "संदेश कम से कम 5 अक्षरों का होना चाहिए।"
          : "Your message must be at least 5 characters long.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitFeedback({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: cleanPhone,
        category: form.category,
        howKnowSite: form.howKnowSite,
        subject: `[${form.queryType}] ${form.category}`,
        message: form.message.trim(),
      });

      // Dual-sync to studentEnquiries
      await submitStudentEnquiry({
        name: form.name.trim(),
        phone: cleanPhone,
        email: form.email.trim(),
        course: `B.Ed. (${form.queryType})`,
        query: `[${form.category}] Query Type: ${form.queryType} - ${form.message.trim()}`,
        source: "website_enquiry_page",
      }).catch((e) => console.warn("Student enquiry sync warning:", e));

      setReferenceId(result.feedbackId);
      setSubmitted(true);
      setForm(initialForm);
    } catch (submissionError) {
      console.error("Enquiry submission error:", submissionError);
      setError(
        submissionError.message ||
          (isHindi
            ? "आपकी पूछताछ भेजी नहीं जा सकी। कृपया दोबारा प्रयास करें।"
            : "We couldn't submit your enquiry. Please try again."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const sidebarLinks = [
    {
      id: "details",
      label: isHindi ? "संपर्क विवरण" : "Contact Details",
      href: "/contact",
      icon: Building2,
    },
    {
      id: "enquiry",
      label: isHindi ? "प्रवेश पूछताछ" : "Admission Enquiry",
      active: true,
      icon: MessageCircle,
    },
    {
      id: "guestbook",
      label: isHindi ? "अतिथि पुस्तिका (Guest Book)" : "Guest Book",
      href: "/contact?tab=guestbook",
      icon: MessageCircle,
    },
    {
      id: "jobs",
      label: isHindi ? "रोजगार के अवसर" : "Job Opportunities",
      href: "/contact?tab=jobs",
      icon: BriefcaseBusiness,
    },
    {
      id: "tour",
      label: isHindi ? "कैंपस टूर बुक करें" : "Book a Campus Tour",
      href: "/book-a-tour",
      icon: Compass,
    },
  ];

  return (
    <>
      <PageHeaderBanner
        headingLevel="h2"
        title={isHindi ? "प्रवेश पूछताछ" : "Admission Enquiry"}
        subtitle={
          isHindi
            ? "बी.एड. प्रवेश, पात्रता एवं पाठ्यक्रम संबंधी पूछताछ हेतु फॉर्म भरें।"
            : "Submit your admission queries, course details and guidance requests."
        }
        breadcrumbs={[
          { label: isHindi ? "संपर्क" : "Contact", to: "/contact" },
          { label: isHindi ? "पूछताछ" : "Enquiry" },
        ]}
      />

      {/* Subtle Collegiate Doodle Watermark Background (Image Reference) */}
      <CollegiateWatermarkBg className="py-8 sm:py-12">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* ============================================================== */}
            {/* SIDEBAR WIDGET (Matching Reference Image)                      */}
            {/* ============================================================== */}
            <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
              <div className="overflow-hidden rounded-md border border-gray-200/90 bg-white shadow-md">
                {/* Solid Royal Blue Header Bar */}
                <div className="bg-[#2E3A8C] px-5 py-4">
                  <h3 className="font-serif text-lg font-bold text-white tracking-wide">
                    {isHindi ? "संपर्क मेन्यू" : "Contact Us"}
                  </h3>
                </div>

                {/* Stacked Links List */}
                <nav
                  aria-label="Enquiry options"
                  className="divide-y divide-gray-100">
                  {sidebarLinks.map((item) => {
                    if (item.href) {
                      return (
                        <Link
                          key={item.id}
                          to={item.href}
                          className="flex w-full items-center justify-between px-5 py-3.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#2E3A8C] transition-colors">
                          <span>{item.label}</span>
                          <ArrowUpRight size={15} className="text-gray-400" />
                        </Link>
                      );
                    }

                    return (
                      <div
                        key={item.id}
                        className="flex w-full items-center justify-between px-5 py-3.5 text-left text-sm font-bold bg-slate-50 text-[#2E3A8C] border-l-4 border-l-[#2E3A8C] pl-4">
                        <span>{item.label}</span>
                      </div>
                    );
                  })}
                </nav>
              </div>

              {/* Verified College Trust Information */}
              <div className="rounded-md border border-gray-200/90 bg-white p-5 shadow-xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Official Admission Cell
                </p>
                <h4 className="mt-1 font-serif text-base font-bold text-slate-900">
                  Haryana Shakti College of Education
                </h4>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                  Kanjhawala, Delhi – 110081 • NCTE Approved & Affiliated to GGSIPU (Code 147)
                </p>

                <div className="mt-4 pt-3 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-500">
                    Direct Helpline:
                  </p>
                  <a
                    href="tel:9953155054"
                    className="mt-0.5 block text-sm font-bold text-[#2E3A8C] hover:underline">
                    +91 9953155054 / 8056777077
                  </a>
                </div>
              </div>
            </aside>

            {/* ============================================================== */}
            {/* MAIN ENQUIRY FORM CARD (Matching Reference Image)              */}
            {/* ============================================================== */}
            <main className="lg:col-span-8">
              <div className="rounded-md border border-gray-200/90 bg-white p-6 sm:p-8 lg:p-10 shadow-xs">
                {/* Card Section Header */}
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E293B]">
                  {isHindi ? "प्रवेश पूछताछ" : "Admission Enquiry"}
                </h2>

                {/* Thin Dark Red / Maroon Divider Line (Image Reference) */}
                <div className="mt-3 h-[1.5px] w-full bg-[#7C2D37]" />

                {/* Centered Form Title */}
                <h3 className="mt-6 mb-8 text-xl sm:text-2xl font-bold text-center text-[#1E293B]">
                  {isHindi ? "अपनी पूछताछ दर्ज करें" : "Post Your Enquiry"}
                </h3>

                {submitted ? (
                  <div className="rounded-md border border-emerald-200 bg-emerald-50 p-6 sm:p-8 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mb-3">
                      <CheckCircle2 size={30} />
                    </div>
                    <h4 className="text-xl font-bold text-emerald-900">
                      {isHindi
                        ? "आपकी पूछताछ सफलतापूर्वक प्राप्त हो गई है!"
                        : "Your Enquiry Has Been Received Successfully!"}
                    </h4>
                    <p className="mt-2 text-xs sm:text-sm text-emerald-700 max-w-md mx-auto">
                      {isHindi
                        ? "हमारे प्रवेश परामर्शदाता शीघ्र ही आपके फोन या ईमेल पर संपर्क करेंगे।"
                        : "Our admission counsellors will review your details and reach out to you shortly."}
                    </p>

                    {referenceId && (
                      <div className="mx-auto mt-4 inline-flex items-center gap-2 rounded-sm border border-emerald-200 bg-white px-4 py-2 text-xs font-bold text-emerald-900">
                        <span>Reference ID:</span>
                        <span className="font-mono text-sm">{referenceId}</span>
                      </div>
                    )}

                    <div className="mt-6">
                      <button
                        type="button"
                        onClick={() => {
                          setSubmitted(false);
                          setReferenceId("");
                        }}
                        className="inline-flex items-center rounded-sm bg-[#2E3A8C] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#232D70] transition-colors cursor-pointer">
                        {isHindi ? "एक और पूछताछ भेजें" : "Submit Another Enquiry"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                      <div className="rounded-sm border border-red-200 bg-red-50 p-3 text-xs text-red-700 flex items-center gap-2">
                        <AlertCircle size={15} className="shrink-0 text-red-600" />
                        <span>{error}</span>
                      </div>
                    )}

                    {/* Row 1: Name & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {isHindi ? "पूरा नाम" : "Name"} *
                        </label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => updateField("name", e.target.value)}
                          placeholder="Enter Name"
                          className="w-full rounded-sm border border-gray-200 bg-[#F9FAFB] px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-gray-400 focus:border-[#2E3A8C] focus:bg-white focus:outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {isHindi ? "ईमेल पता" : "Email"} *
                        </label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => updateField("email", e.target.value)}
                          placeholder="Enter Email"
                          className="w-full rounded-sm border border-gray-200 bg-[#F9FAFB] px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-gray-400 focus:border-[#2E3A8C] focus:bg-white focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    {/* Row 2: Phone & Category */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {isHindi ? "मोबाइल नंबर (10 अंक)" : "Mobile Number"} *
                        </label>
                        <input
                          type="tel"
                          maxLength={10}
                          value={form.phone}
                          onChange={(e) => updateField("phone", e.target.value)}
                          placeholder="Enter 10-Digit Mobile Number"
                          className="w-full rounded-sm border border-gray-200 bg-[#F9FAFB] px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-gray-400 focus:border-[#2E3A8C] focus:bg-white focus:outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {isHindi ? "आपकी श्रेणी" : "Profession / Category"}
                        </label>
                        <select
                          value={form.category}
                          onChange={(e) => updateField("category", e.target.value)}
                          className="w-full rounded-sm border border-gray-200 bg-[#F9FAFB] px-3.5 py-2.5 text-sm text-slate-800 focus:border-[#2E3A8C] focus:bg-white focus:outline-none transition-colors">
                          <option value="Pupil-Teacher (Student)">Pupil-Teacher (Prospective Student)</option>
                          <option value="Parent / Guardian">Parent / Guardian</option>
                          <option value="Working Educator">Working Educator</option>
                          <option value="Alumnus">Alumnus</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    {/* Row 3: How do you Know this Site / College? */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isHindi ? "आपको HSCE के बारे में कैसे पता चला?" : "How do you Know this Site?"}
                      </label>
                      <select
                        value={form.howKnowSite}
                        onChange={(e) => updateField("howKnowSite", e.target.value)}
                        className="w-full rounded-sm border border-gray-200 bg-[#F9FAFB] px-3.5 py-2.5 text-sm text-slate-800 focus:border-[#2E3A8C] focus:bg-white focus:outline-none transition-colors">
                        <option value="">- Select -</option>
                        <option value="GGSIPU Central Counselling Portal">GGSIPU Central Counselling Portal</option>
                        <option value="NCTE Official Directory">NCTE Official Directory</option>
                        <option value="Google Search">Google Search</option>
                        <option value="Friends & Family">Friends & Family</option>
                        <option value="Alumni Recommendation">Alumni Recommendation</option>
                        <option value="Social Media">Social Media</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Row 4: Query Topic / Area of Interest (Radio Buttons) */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">
                        {isHindi ? "पूछताछ का मुख्य विषय" : "Query Interest Focus:"}
                      </label>
                      <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-slate-700">
                        {[
                          "B.Ed. Regular",
                          "Eligibility Criteria",
                          "Fee Structure",
                          "Hostel & Transport",
                          "General Query",
                        ].map((opt) => (
                          <label key={opt} className="inline-flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="queryType"
                              value={opt}
                              checked={form.queryType === opt}
                              onChange={(e) => updateField("queryType", e.target.value)}
                              className="text-[#2E3A8C] focus:ring-[#2E3A8C]"
                            />
                            <span className="text-xs sm:text-sm font-medium">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Row 5: Message Textarea */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isHindi ? "पूछताछ विवरण / प्रश्न" : "Message"} *
                      </label>
                      <textarea
                        rows={5}
                        value={form.message}
                        onChange={(e) => updateField("message", e.target.value)}
                        placeholder="MARK YOUR COMMENTS AND IDEAS"
                        className="w-full rounded-sm border border-gray-200 bg-[#F9FAFB] p-3.5 text-sm text-slate-800 placeholder:text-gray-400 focus:border-[#2E3A8C] focus:bg-white focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center rounded-sm bg-[#2E3A8C] hover:bg-[#232D70] px-8 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition-colors cursor-pointer disabled:opacity-50">
                        <span>{isSubmitting ? "Submitting..." : "Submit Enquiry"}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </main>
          </div>
        </Container>
      </CollegiateWatermarkBg>
    </>
  );
}

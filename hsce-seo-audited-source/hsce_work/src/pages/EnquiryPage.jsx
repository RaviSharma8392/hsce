import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  ArrowRight,
  MessageCircle,
  UserRound,
  Phone,
  Mail,
  Tag,
  FileText,
  Send,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { Container } from "../components/common/Container";
import { PageHeaderBanner } from "../components/common/PageHeaderBanner";
import { useLanguage } from "../context/LanguageContext";
import { submitFeedback } from "../services/feedbackService";
import { submitStudentEnquiry } from "../services/enquiryService";

const BLUE = "#363991";

const initialForm = {
  name: "",
  phone: "",
  email: "",
  category: "Pupil-Teacher (Student)",
  subject: "",
  message: "",
};

export default function EnquiryPage() {
  const { isHindi } = useLanguage();

  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [referenceId, setReferenceId] = useState("");

  const text = {
    title: isHindi ? "अपनी पूछताछ भेजें" : "Send an Enquiry",
    subtitle: isHindi
      ? "प्रवेश, कॉलेज या अन्य जानकारी के लिए अपना संदेश भेजें।"
      : "Contact the college for admission information, general queries or feedback.",
    badge: isHindi ? "संपर्क एवं सहायता" : "CONTACT & SUPPORT",
    formTitle: isHindi ? "पूछताछ फॉर्म" : "Enquiry Form",
    formSubtitle: isHindi
      ? "नीचे दिए गए विवरण भरें। सभी * वाले फ़ील्ड अनिवार्य हैं।"
      : "Fill in the details below. Fields marked * are required.",
    name: isHindi ? "पूरा नाम" : "Full Name",
    phone: isHindi ? "मोबाइल नंबर" : "Mobile Number",
    email: isHindi ? "ईमेल पता" : "Email Address",
    category: isHindi ? "आपकी श्रेणी" : "I am a",
    subject: isHindi ? "विषय" : "Subject",
    message: isHindi ? "आपका संदेश" : "Your Message",
    namePlaceholder: isHindi ? "अपना पूरा नाम लिखें" : "Enter your full name",
    phonePlaceholder: isHindi
      ? "10 अंकों का मोबाइल नंबर"
      : "10-digit mobile number",
    subjectPlaceholder: isHindi
      ? "आप किस बारे में पूछना चाहते हैं?"
      : "What is your enquiry about?",
    messagePlaceholder: isHindi
      ? "अपना प्रश्न या सुझाव यहां लिखें..."
      : "Write your question, query or suggestion here...",
    submit: isHindi ? "पूछताछ भेजें" : "Submit Enquiry",
    submitting: isHindi ? "भेजा जा रहा है..." : "Submitting...",
    back: isHindi ? "संपर्क पेज पर वापस जाएं" : "Back to Contact Us",
  };

  const updateField = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError(isHindi ? "कृपया अपना नाम लिखें।" : "Please enter your name.");
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

    if (!form.subject.trim()) {
      setError(isHindi ? "कृपया विषय लिखें।" : "Please enter a subject.");
      return;
    }

    if (form.message.trim().length < 10) {
      setError(
        isHindi
          ? "संदेश कम से कम 10 अक्षरों का होना चाहिए।"
          : "Your message must be at least 10 characters long.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitFeedback({
        ...form,
        name: form.name.trim(),
        phone: cleanPhone,
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
      });

      // Dual-sync to studentEnquiries so it appears under both Admission Enquiries & Feedback in Admin
      await submitStudentEnquiry({
        name: form.name.trim(),
        phone: cleanPhone,
        email: form.email.trim(),
        course: "B.Ed. (Admission / College Enquiry)",
        city: "Delhi / NCR",
        query: `[${form.category}] Subject: ${form.subject.trim()} - ${form.message.trim()}`,
        source: "website_enquiry_page",
      }).catch((e) => console.warn("Student enquiry sync warning:", e));

      setReferenceId(result?.feedbackId || "");
      setSubmitted(true);
      setForm(initialForm);
    } catch (submissionError) {
      console.error("Enquiry submission error:", submissionError);
      setError(
        isHindi
          ? "आपकी पूछताछ भेजी नहीं जा सकी। कृपया दोबारा प्रयास करें।"
          : "We couldn't submit your enquiry. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>
          {isHindi ? "पूछताछ भेजें | HSCE" : "Submit an Enquiry | HSCE"}
        </title>
        <meta
          name="description"
          content={
            isHindi
              ? "हरियाणा शक्ति कॉलेज ऑफ एजुकेशन से संपर्क करने के लिए अपनी पूछताछ या सुझाव भेजें।"
              : "Send an enquiry or feedback to Haryana Shakti College of Education."
          }
        />
      </Helmet>

      <PageHeaderBanner
        title={text.title}
        subtitle={text.subtitle}
        breadcrumbs={[
          { label: isHindi ? "संपर्क" : "Contact", to: "/contact" },
          { label: isHindi ? "पूछताछ" : "Enquiry" },
        ]}
      />

      <main className="min-h-[65vh] bg-[#F7F8FC] py-8 sm:py-12 lg:py-14">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Link
              to="/contact"
              className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#363991] transition hover:gap-3">
              <ArrowLeft size={17} />
              {text.back}
            </Link>

            {submitted ? (
              <section
                className="rounded-2xl border border-gray-200 bg-white p-6 text-center sm:p-10"
                aria-live="polite">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
                  <CheckCircle2 size={34} />
                </div>

                <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-green-700">
                  {isHindi ? "सफलतापूर्वक सबमिट हुआ" : "SUBMISSION SUCCESSFUL"}
                </p>

                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">
                  {isHindi
                    ? "आपकी पूछताछ प्राप्त हो गई है"
                    : "Your Enquiry Has Been Received"}
                </h1>

                <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-gray-600">
                  {isHindi
                    ? "कॉलेज से संपर्क करने के लिए धन्यवाद। आपका संदेश सफलतापूर्वक दर्ज किया गया है।"
                    : "Thank you for contacting the college. Your message has been submitted successfully."}
                </p>

                {referenceId && (
                  <div className="mx-auto mt-5 inline-flex flex-wrap items-center justify-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm">
                    <span className="text-gray-500">
                      {isHindi ? "संदर्भ संख्या:" : "Reference ID:"}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {referenceId}
                    </span>
                  </div>
                )}

                <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setReferenceId("");
                      setError("");
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#363991] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#292d78]">
                    {isHindi ? "एक और पूछताछ भेजें" : "Submit Another Enquiry"}
                    <ArrowRight size={16} />
                  </button>

                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-[#363991] hover:text-[#363991]">
                    {isHindi ? "संपर्क विवरण देखें" : "View Contact Details"}
                  </Link>
                </div>
              </section>
            ) : (
              <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                <div className="border-b border-gray-100 p-5 sm:p-7">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#363991]/[0.07] text-[#363991]">
                      <MessageCircle size={23} />
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#363991]">
                        {text.badge}
                      </p>
                      <h1 className="mt-1 text-xl font-semibold text-gray-900 sm:text-2xl">
                        {text.formTitle}
                      </h1>
                      <p className="mt-2 text-sm leading-6 text-gray-500">
                        {text.formSubtitle}
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-7">
                  {error && (
                    <div
                      role="alert"
                      className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
                      <AlertCircle size={18} className="mt-0.5 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <UserRound size={16} className="text-gray-400" />
                        {text.name} *
                      </label>
                      <input
                        type="text"
                        autoComplete="name"
                        required
                        maxLength={100}
                        value={form.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        placeholder={text.namePlaceholder}
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#363991] focus:ring-4 focus:ring-[#363991]/10"
                      />
                    </div>

                    <div>
                      <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <Phone size={16} className="text-gray-400" />
                        {text.phone} *
                      </label>
                      <input
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel"
                        required
                        maxLength={10}
                        value={form.phone}
                        onChange={(e) =>
                          updateField(
                            "phone",
                            e.target.value.replace(/\D/g, "").slice(0, 10),
                          )
                        }
                        placeholder={text.phonePlaceholder}
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#363991] focus:ring-4 focus:ring-[#363991]/10"
                      />
                    </div>

                    <div>
                      <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <Mail size={16} className="text-gray-400" />
                        {text.email}
                      </label>
                      <input
                        type="email"
                        autoComplete="email"
                        maxLength={150}
                        value={form.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#363991] focus:ring-4 focus:ring-[#363991]/10"
                      />
                    </div>

                    <div>
                      <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <Tag size={16} className="text-gray-400" />
                        {text.category} *
                      </label>
                      <select
                        required
                        value={form.category}
                        onChange={(e) =>
                          updateField("category", e.target.value)
                        }
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#363991] focus:ring-4 focus:ring-[#363991]/10">
                        <option value="Pupil-Teacher (Student)">
                          {isHindi ? "वर्तमान छात्र" : "Current Student"}
                        </option>
                        <option value="Alumni">
                          {isHindi ? "पूर्व छात्र" : "Alumni"}
                        </option>
                        <option value="Parent / Guardian">
                          {isHindi ? "अभिभावक" : "Parent / Guardian"}
                        </option>
                        <option value="School Educator / Mentor">
                          {isHindi
                            ? "शिक्षक / मार्गदर्शक"
                            : "Educator / Mentor"}
                        </option>
                        <option value="Visitor / Prospective Candidate">
                          {isHindi
                            ? "आगंतुक / भावी विद्यार्थी"
                            : "Visitor / Prospective Student"}
                        </option>
                        <option value="Other">
                          {isHindi ? "अन्य" : "Other"}
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <FileText size={16} className="text-gray-400" />
                      {text.subject} *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={150}
                      value={form.subject}
                      onChange={(e) => updateField("subject", e.target.value)}
                      placeholder={text.subjectPlaceholder}
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#363991] focus:ring-4 focus:ring-[#363991]/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      {text.message} *
                    </label>
                    <textarea
                      required
                      rows={5}
                      minLength={10}
                      maxLength={3000}
                      value={form.message}
                      onChange={(e) => updateField("message", e.target.value)}
                      placeholder={text.messagePlaceholder}
                      className="w-full resize-y rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-gray-400 focus:border-[#363991] focus:ring-4 focus:ring-[#363991]/10"
                    />
                    <p className="mt-1.5 text-right text-xs text-gray-400">
                      {form.message.length}/3000
                    </p>
                  </div>

                  <div className="border-t border-gray-100 pt-5">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#363991] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#292d78] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-48">
                      <Send size={16} />
                      {isSubmitting ? text.submitting : text.submit}
                    </button>

                    <p className="mt-3 text-xs leading-5 text-gray-500">
                      {isHindi
                        ? "कृपया सही संपर्क विवरण दें ताकि आवश्यकता होने पर कॉलेज आपसे संपर्क कर सके।"
                        : "Please provide accurate contact details so the college can reach you if needed."}
                    </p>
                  </div>
                </form>
              </section>
            )}
          </div>
        </Container>
      </main>
    </>
  );
}

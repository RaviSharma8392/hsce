import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  Building2,
  Phone,
  Mail,
  Instagram,
  MapPin,
  Clock3,
  BriefcaseBusiness,
  MessageCircle,
  ArrowUpRight,
  ExternalLink,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  Send,
} from "lucide-react";

import { Container } from "../components/common/Container";
import { PageHeaderBanner } from "../components/common/PageHeaderBanner";
import { CollegiateWatermarkBg } from "../components/common/CollegiateWatermarkBg";
import {
  collegeInfo as defaultCollegeInfo,
  contactPageData,
} from "../data/siteData";
import { usePublishedRecords } from "../hooks/usePublishedRecords";
import { useLanguage } from "../context/LanguageContext";
import { submitFeedback } from "../services/feedbackService";

const initialGuestBook = {
  name: "",
  email: "",
  websiteAddress: "",
  profession: "",
  howKnowSite: "",
  siteRating: "Excellent",
  message: "",
};

export default function ContactPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isHindi } = useLanguage();

  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(
    tabParam === "guestbook"
      ? "guestbook"
      : tabParam === "jobs"
        ? "jobs"
        : "details",
  );

  useEffect(() => {
    if (tabParam === "guestbook") setActiveTab("guestbook");
    else if (tabParam === "jobs") setActiveTab("jobs");
    else if (!tabParam) setActiveTab("details");
  }, [tabParam]);

  const handleTabSelect = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
    setSubmitted(false);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const siteSettings = usePublishedRecords("siteContent", [defaultCollegeInfo]);

  const collegeInfo =
    siteSettings.find((record) => record.id === "settings") ||
    siteSettings[0] ||
    defaultCollegeInfo;

  const phone = collegeInfo.phone || "";
  const alternatePhone = collegeInfo.alternatePhone || "";
  const email = collegeInfo.email || "";
  const address = collegeInfo.address || "";
  const instagram =
    collegeInfo.instagram || "https://www.instagram.com/hscekanjhawala/";

  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address || "Haryana Shakti College of Education, Kanjhawala, Delhi",
  )}`;

  const intro = isHindi ? contactPageData.intro.hi : contactPageData.intro.en;
  const officeHours = isHindi
    ? contactPageData.officeHours.hi
    : contactPageData.officeHours.en;

  // Guest Book Form State
  const [guestForm, setGuestForm] = useState(initialGuestBook);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [feedbackId, setFeedbackId] = useState("");

  const updateGuestField = (field, value) => {
    setGuestForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleGuestSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!guestForm.name.trim()) {
      setError(isHindi ? "कृपया अपना नाम लिखें।" : "Please enter your name.");
      return;
    }

    if (!guestForm.email.trim() || !guestForm.email.includes("@")) {
      setError(
        isHindi
          ? "कृपया मान्य ईमेल पता दर्ज करें।"
          : "Please enter a valid email address.",
      );
      return;
    }

    if (guestForm.message.trim().length < 5) {
      setError(
        isHindi
          ? "कृपया अपनी टिप्पणी या संदेश लिखें।"
          : "Please write your comment or feedback.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await submitFeedback({
        name: guestForm.name.trim(),
        email: guestForm.email.trim(),
        websiteAddress: guestForm.websiteAddress.trim(),
        profession: guestForm.profession.trim(),
        howKnowSite: guestForm.howKnowSite,
        siteRating: guestForm.siteRating,
        message: guestForm.message.trim(),
        category: "Guest Book & Feedback",
        subject: "Website Guest Book Comment",
      });

      setFeedbackId(res.feedbackId || "FB-OK");
      setSubmitted(true);
      setGuestForm(initialGuestBook);
    } catch (err) {
      setError(
        err.message ||
          (isHindi
            ? "सबमिट करने में त्रुटि। कृपया पुनः प्रयास करें।"
            : "Error submitting comment. Please try again."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const sidebarLinks = [
    {
      id: "details",
      label: isHindi ? "संपर्क विवरण" : "Contact Details",
      icon: Building2,
    },
    {
      id: "guestbook",
      label: isHindi ? "अतिथि पुस्तिका (Guest Book)" : "Guest Book",
      icon: MessageCircle,
    },
    {
      id: "jobs",
      label: isHindi ? "रोजगार के अवसर" : "Job Opportunities",
      icon: BriefcaseBusiness,
    },
    {
      id: "enquiry",
      label: isHindi ? "प्रवेश पूछताछ" : "Admission Enquiry",
      href: "/contact/enquiry",
    },
    {
      id: "tour",
      label: isHindi ? "कैंपस टूर बुक करें" : "Book a Campus Tour",
      href: "/book-a-tour",
    },
  ];

  return (
    <>
      <PageHeaderBanner
        title={isHindi ? "संपर्क करें" : "Contact Us"}
        subtitle={
          isHindi
            ? "प्रवेश, परिसर एवं प्रशासनिक पूछताछ के लिए हमसे संपर्क करें।"
            : "Connect with us for admissions, campus information and general enquiries."
        }
        breadcrumbs={[{ label: isHindi ? "संपर्क" : "Contact" }]}
      />

      {/* Subtle Collegiate Doodle Watermark Background (from screenshot) */}
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
                  aria-label="Contact options"
                  className="divide-y divide-gray-100">
                  {sidebarLinks.map((item) => {
                    const isActive = activeTab === item.id;

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
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleTabSelect(item.id)}
                        className={`flex w-full items-center justify-between px-5 py-3.5 text-left text-sm font-medium transition-colors cursor-pointer ${
                          isActive
                            ? "bg-slate-50 text-[#2E3A8C] font-bold border-l-4 border-l-[#2E3A8C] pl-4"
                            : "text-slate-700 hover:bg-slate-50 hover:text-[#2E3A8C]"
                        }`}>
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Office Hours Card */}
              <div className="rounded-md border border-gray-200/90 bg-white p-5 shadow-xs">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2E3A8C]/10 text-[#2E3A8C]">
                    <Clock3 size={18} />
                  </div>
                  <h4 className="font-serif text-sm font-bold text-slate-900">
                    {officeHours.title}
                  </h4>
                </div>

                <p className="text-xs leading-relaxed text-slate-600">
                  {officeHours.schedule}
                </p>
                <p className="mt-1 text-sm font-bold text-[#2E3A8C]">
                  {officeHours.timing}
                </p>

                <div className="my-3 border-t border-dashed border-gray-200" />

                <p className="text-[11px] leading-relaxed text-gray-500">
                  {officeHours.note}
                </p>
              </div>

              {/* Instant Helpline Phone Card */}
              {phone && (
                <div className="rounded-md border border-gray-200/90 bg-white p-5 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FBDD23]/30 text-[#8F5E00]">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        {isHindi ? "हेल्पलाइन नंबर" : "Admissions Helpline"}
                      </p>
                      <a
                        href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                        className="text-sm font-bold text-[#2E3A8C] hover:underline">
                        +91 {phone}
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </aside>

            {/* ============================================================== */}
            {/* MAIN FORM / DETAILS CARD (Matching Reference Image)            */}
            {/* ============================================================== */}
            <main className="lg:col-span-8">
              {/* TAB 1: GUEST BOOK & FEEDBACK (The EXACT form from screenshot) */}
              {activeTab === "guestbook" && (
                <div className="rounded-md border border-gray-200/90 bg-white p-6 sm:p-8 lg:p-10 shadow-xs">
                  {/* Card Section Header */}
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E293B]">
                    {isHindi ? "अतिथि पुस्तिका" : "Guest Book"}
                  </h2>

                  {/* Thin Dark Red / Maroon Divider Line (Image Reference) */}
                  <div className="mt-3 h-[1.5px] w-full bg-[#7C2D37]" />

                  {/* Centered Form Title */}
                  <h3 className="mt-6 mb-8 text-xl sm:text-2xl font-bold text-center text-[#1E293B]">
                    {isHindi ? "अपनी प्रतिक्रिया दर्ज करें" : "Post Your comment"}
                  </h3>

                  {/* Success Banner */}
                  {submitted ? (
                    <div className="rounded-md border border-emerald-200 bg-emerald-50 p-6 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mb-3">
                        <CheckCircle2 size={24} />
                      </div>
                      <h4 className="text-base font-bold text-emerald-900">
                        {isHindi
                          ? "आपकी टिप्पणी सफलतापूर्वक दर्ज कर ली गई है!"
                          : "Thank you! Your comment has been recorded."}
                      </h4>
                      <p className="mt-1 text-xs text-emerald-700">
                        Reference ID: <span className="font-bold">{feedbackId}</span>
                      </p>
                      <button
                        type="button"
                        onClick={() => setSubmitted(false)}
                        className="mt-5 inline-flex items-center rounded-sm bg-[#2E3A8C] px-5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#232D70] transition-colors cursor-pointer">
                        {isHindi ? "एक और टिप्पणी भेजें" : "Post Another Comment"}
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleGuestSubmit} className="space-y-5">
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
                            {isHindi ? "नाम" : "Name"} *
                          </label>
                          <input
                            type="text"
                            value={guestForm.name}
                            onChange={(e) => updateGuestField("name", e.target.value)}
                            placeholder="Enter Name"
                            className="w-full rounded-sm border border-gray-200 bg-[#F9FAFB] px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-gray-400 focus:border-[#2E3A8C] focus:bg-white focus:outline-none transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {isHindi ? "ईमेल" : "Email"} *
                          </label>
                          <input
                            type="email"
                            value={guestForm.email}
                            onChange={(e) => updateGuestField("email", e.target.value)}
                            placeholder="Enter Email"
                            className="w-full rounded-sm border border-gray-200 bg-[#F9FAFB] px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-gray-400 focus:border-[#2E3A8C] focus:bg-white focus:outline-none transition-colors"
                          />
                        </div>
                      </div>

                      {/* Row 2: Website Address & Profession */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {isHindi ? "वेबसाइट पता (यदि कोई हो)" : "Website Address (If any)"}
                          </label>
                          <input
                            type="text"
                            value={guestForm.websiteAddress}
                            onChange={(e) => updateGuestField("websiteAddress", e.target.value)}
                            placeholder="Enter Website Address (If any)"
                            className="w-full rounded-sm border border-gray-200 bg-[#F9FAFB] px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-gray-400 focus:border-[#2E3A8C] focus:bg-white focus:outline-none transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {isHindi ? "व्यवसाय / पेशा" : "Profession"}
                          </label>
                          <input
                            type="text"
                            value={guestForm.profession}
                            onChange={(e) => updateGuestField("profession", e.target.value)}
                            placeholder="Enter Profession"
                            className="w-full rounded-sm border border-gray-200 bg-[#F9FAFB] px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-gray-400 focus:border-[#2E3A8C] focus:bg-white focus:outline-none transition-colors"
                          />
                        </div>
                      </div>

                      {/* Row 3: How do you Know this Site? */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {isHindi ? "आपको इस वेबसाइट के बारे में कैसे पता चला?" : "How do you Know this Site?"}
                        </label>
                        <select
                          value={guestForm.howKnowSite}
                          onChange={(e) => updateGuestField("howKnowSite", e.target.value)}
                          className="w-full rounded-sm border border-gray-200 bg-[#F9FAFB] px-3.5 py-2.5 text-sm text-slate-800 focus:border-[#2E3A8C] focus:bg-white focus:outline-none transition-colors">
                          <option value="">- Select -</option>
                          <option value="Google Search">Google Search</option>
                          <option value="GGSIPU / NCTE Portal">GGSIPU / NCTE Portal</option>
                          <option value="Social Media (Instagram/YouTube)">Social Media</option>
                          <option value="Friends & Relatives">Friends & Relatives</option>
                          <option value="Alumni Recommendation">Alumni Recommendation</option>
                          <option value="College Banner / Leaflet">College Banner / Leaflet</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      {/* Row 4: How do you Rate this Site? (Radio Options) */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2">
                          {isHindi ? "आप इस वेबसाइट को क्या रेटिंग देंगे?" : "How do you Rate this Site?"}
                        </label>
                        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-slate-700">
                          {["Excellent", "Very Good", "Good", "Average", "Poor"].map((rate) => (
                            <label key={rate} className="inline-flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="siteRating"
                                value={rate}
                                checked={guestForm.siteRating === rate}
                                onChange={(e) => updateGuestField("siteRating", e.target.value)}
                                className="text-[#2E3A8C] focus:ring-[#2E3A8C]"
                              />
                              <span className="text-xs sm:text-sm font-medium">{rate}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Row 5: Message Textarea */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {isHindi ? "संदेश / टिप्पणी" : "Message"} *
                        </label>
                        <textarea
                          rows={5}
                          value={guestForm.message}
                          onChange={(e) => updateGuestField("message", e.target.value)}
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
                          <span>{isSubmitting ? "Posting..." : "Post Comment"}</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* TAB 2: CONTACT DETAILS */}
              {activeTab === "details" && (
                <div className="rounded-md border border-gray-200/90 bg-white p-6 sm:p-8 lg:p-10 shadow-xs space-y-6">
                  {/* Card Section Header */}
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E293B]">
                    {isHindi ? "संपर्क विवरण" : "Contact Details"}
                  </h2>
                  <div className="h-[1.5px] w-full bg-[#7C2D37]" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                    {/* Campus Address Card */}
                    <div className="sm:col-span-2 rounded-xl border border-gray-200/80 bg-[#F9FAFB] p-5">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2E3A8C] text-[#FBDD23]">
                          <MapPin size={18} />
                        </div>
                        <h4 className="font-serif text-base font-bold text-[#2E3A8C]">
                          {isHindi ? "कॉलेज का पता" : "Campus Location & Address"}
                        </h4>
                      </div>
                      <p className="text-sm leading-relaxed text-slate-700 pl-12">
                        {address || "Kanjhawala, Delhi – 110081"}
                      </p>
                      <div className="mt-3 pl-12">
                        <a
                          href={mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2E3A8C] hover:underline">
                          <span>{isHindi ? "गूगल मैप पर देखें" : "View on Google Maps"}</span>
                          <ExternalLink size={13} />
                        </a>
                      </div>
                    </div>

                    {/* Phone Helpline */}
                    <div className="rounded-xl border border-gray-200/80 bg-[#F9FAFB] p-5">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2E3A8C] text-[#FBDD23]">
                          <Phone size={18} />
                        </div>
                        <h4 className="font-serif text-base font-bold text-[#2E3A8C]">
                          {isHindi ? "दूरभाष एवं हेल्पलाइन" : "Phone & Helpline"}
                        </h4>
                      </div>
                      <div className="pl-12 text-sm text-slate-700 space-y-1">
                        {phone && (
                          <p>
                            <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="hover:underline font-semibold">
                              +91 {phone}
                            </a>
                          </p>
                        )}
                        {alternatePhone && (
                          <p className="text-xs text-gray-500">
                            Alt: +91 {alternatePhone}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Official Email */}
                    <div className="rounded-xl border border-gray-200/80 bg-[#F9FAFB] p-5">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2E3A8C] text-[#FBDD23]">
                          <Mail size={18} />
                        </div>
                        <h4 className="font-serif text-base font-bold text-[#2E3A8C]">
                          {isHindi ? "ईमेल संपर्क" : "Official Email"}
                        </h4>
                      </div>
                      <div className="pl-12 text-sm text-slate-700">
                        {email && (
                          <a href={`mailto:${email}`} className="break-all font-semibold hover:underline">
                            {email}
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Social Media */}
                    <div className="sm:col-span-2 rounded-xl border border-gray-200/80 bg-[#F9FAFB] p-5">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2E3A8C] text-[#FBDD23]">
                          <Instagram size={18} />
                        </div>
                        <h4 className="font-serif text-base font-bold text-[#2E3A8C]">
                          {isHindi ? "सोशल मीडिया" : "Official Social Channels"}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-600 pl-12 mb-3">
                        {isHindi
                          ? "कॉलेज की गतिविधियों, कार्यशालाओं और कार्यक्रमों के अपडेट हेतु हमारे आधिकारिक सोशल मीडिया पेज पर जुड़ें।"
                          : "Follow our official handles for campus activities, pedagogy workshops, and institutional announcements."}
                      </p>
                      <div className="pl-12">
                        <a
                          href={instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-md bg-[#2E3A8C] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#232D70] transition-colors">
                          <Instagram size={14} />
                          <span>Instagram Page</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: JOB OPPORTUNITIES */}
              {activeTab === "jobs" && (
                <div className="rounded-md border border-gray-200/90 bg-white p-6 sm:p-8 lg:p-10 shadow-xs space-y-6">
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E293B]">
                    {isHindi ? "रोजगार के अवसर" : "Job Opportunities"}
                  </h2>
                  <div className="h-[1.5px] w-full bg-[#7C2D37]" />

                  <div className="rounded-xl border border-blue-100 bg-[#F9FAFB] p-6 text-sm text-slate-700 space-y-4">
                    <h3 className="font-serif text-lg font-bold text-[#2E3A8C]">
                      Faculty & Staff Recruitment
                    </h3>
                    <p className="leading-relaxed">
                      Haryana Shakti College of Education welcomes passionate, UGC-NET / Ph.D. qualified teacher educators in Education and Pedagogical disciplines (Science, Mathematics, Social Sciences, Languages) as well as administrative professionals.
                    </p>
                    <p className="leading-relaxed">
                      Interested candidates may submit their updated CV along with copies of academic testimonials and recent photograph to our official recruitment desk:
                    </p>
                    <div className="p-4 bg-white rounded-lg border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">
                          Submit Resume to
                        </p>
                        <p className="text-sm font-bold text-[#2E3A8C]">
                          hsce.kanjhawala@gmail.com
                        </p>
                      </div>
                      <a
                        href={`mailto:${email}?subject=Job%20Application%20at%20HSCE`}
                        className="inline-flex items-center gap-2 rounded-sm bg-[#2E3A8C] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#232D70] transition-colors">
                        <Mail size={14} />
                        <span>Send Application</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        </Container>
      </CollegiateWatermarkBg>
    </>
  );
}

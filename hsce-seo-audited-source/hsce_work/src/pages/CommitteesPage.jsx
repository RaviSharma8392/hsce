import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ShieldAlert,
  FileText,
  CheckCircle2,
  AlertCircle,
  Users,
  Send,
  HelpCircle,
  Phone,
  Mail,
  Lock,
} from "lucide-react";
import { Container } from "../components/common/Container";
import { PageHeaderBanner } from "../components/common/PageHeaderBanner";
import { PageNavigationLinks } from "../components/common/PageNavigationLinks";
import { SectionHeading } from "../components/common/SectionHeading";
import { committeeData as seedCommittees } from "../data/siteData";
import { usePublishedRecords } from "../hooks/usePublishedRecords";
import { useLanguage } from "../context/LanguageContext";
import { submitGrievance } from "../services/grievanceService";

export default function CommitteesPage() {
  const { isHindi } = useLanguage();
  const location = useLocation();
  const committeeData = usePublishedRecords("committees", seedCommittees);

  // Tab state: 'directory' or 'lodge'
  const [activeTab, setActiveTab] = useState("directory");

  // Switch to complaint form if URL has #grievance or #complaint or pathname is grievance
  useEffect(() => {
    if (
      location.hash === "#grievance" ||
      location.hash === "#complaint" ||
      location.pathname.includes("grievance")
    ) {
      setActiveTab("lodge");
    }
  }, [location]);

  // Form states
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

  return (
    <>
      <Helmet>
        <title>
          {isHindi
            ? "समितियाँ एवं शिकायत निवारण | हरियाणा शक्ति कॉलेज ऑफ एजुकेशन"
            : "Committees & Grievance Redressal | Haryana Shakti College of Education"}
        </title>
        <meta
          name="description"
          content={
            isHindi
              ? "हरियाणा शक्ति कॉलेज ऑफ एजुकेशन की अनुमोदित समितियाँ एवं ऑनलाइन छात्र शिकायत निवारण पोर्टल।"
              : "Institutional Committees & Online Student Grievance Redressal Portal for Haryana Shakti College of Education."
          }
        />
      </Helmet>

      <PageHeaderBanner
        title={
          isHindi
            ? "संस्थागत समितियाँ एवं शिकायत निवारण"
            : "Institutional Committees & Grievance Redressal"
        }
        subtitle={
          isHindi
            ? "शैक्षणिक सलाहकार, छात्र शिकायत निवारण, महिला सेल (ICC) एवं एंटी-रैगिंग समितियाँ"
            : "Academic Advisory, Student Grievance Redressal, ICC Gender Cell & Anti-Ragging Committees ensuring institutional safety, equity, and student welfare."
        }
        breadcrumbs={[
          {
            label: isHindi
              ? "समितियाँ एवं शिकायत निवारण"
              : "Committees & Grievance",
          },
        ]}
      />

      <Container className="py-10">
        {/* Navigation Tabs */}
        <div className="mb-8 flex items-center justify-center sm:justify-start gap-2 border-b border-gray-200 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab("directory")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-poppins text-xs sm:text-sm font-semibold transition ${
              activeTab === "directory"
                ? "bg-[#363991] text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}>
            <Users size={16} />
            <span>{isHindi ? "समिति निर्देशिका" : "Committees Directory"}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("lodge")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-poppins text-xs sm:text-sm font-semibold transition ${
              activeTab === "lodge"
                ? "bg-[#e2535d] text-white shadow-sm"
                : "bg-red-50 text-[#e2535d] hover:bg-red-100"
            }`}>
            <ShieldAlert size={16} />
            <span>
              {isHindi
                ? "ऑनलाइन शिकायत दर्ज करें"
                : "Lodge Grievance / Complaint"}
            </span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider">
              {isHindi ? "पोर्टल" : "Active"}
            </span>
          </button>
        </div>

        {/* TAB 1: Committees Directory */}
        {activeTab === "directory" && (
          <div className="space-y-6">
            {/* Quick CTA to Lodge Complaint */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-50 to-amber-50 border border-red-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#e2535d] text-white flex items-center justify-center shrink-0">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <h4 className="font-poppins font-bold text-sm text-gray-900">
                    {isHindi
                      ? "क्या आपकी कोई शैक्षणिक अथवा संस्थागत शिकायत है?"
                      : "Have an Academic or Institutional Grievance?"}
                  </h4>
                  <p className="text-xs text-gray-600 mt-0.5 font-sans">
                    {isHindi
                      ? "कॉलेज के आधिकारिक शिकायत निवारण सेल को अपनी बात गोपनीय रूप से प्रेषित करें।"
                      : "Submit your concern confidentially to our statutory Student Grievance Redressal Committee."}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab("lodge")}
                className="shrink-0 px-4 py-2 rounded-xl bg-[#e2535d] text-white text-xs sm:text-sm font-semibold font-poppins hover:bg-[#cf424c] transition shadow-xs">
                {isHindi ? "शिकायत दर्ज करें" : "Lodge Complaint Now"} &rarr;
              </button>
            </div>

            {committeeData.map((committee) => (
              <div
                key={committee.name}
                className="section-card hover:border-[#363991]/30 transition">
                <SectionHeading
                  eyebrow={isHindi ? "समिति" : "Committee"}
                  title={committee.name}
                />
                <p className="text-[#555555] leading-relaxed">
                  {committee.description}
                </p>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {committee.members.map((member) => (
                    <div
                      key={`${committee.name}-${member.name}`}
                      className="rounded border border-[#E5E5E5] bg-[#FAF9F9] p-4">
                      <div className="font-semibold text-[#222222] font-poppins text-sm">
                        {member.name}
                      </div>
                      <div className="mt-1 text-xs text-[#363991] font-medium">
                        {member.designation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: Online Grievance & Complaints Form */}
        {activeTab === "lodge" && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
              <div className="mb-6 pb-4 border-b border-gray-100">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-red-100 text-[#c8102e] px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider mb-2">
                  <ShieldAlert size={13} />
                  <span>
                    {isHindi
                      ? "गोपनीय शिकायत निवारण पोर्टल"
                      : "Confidential Redressal Portal"}
                  </span>
                </div>
                <h3 className="text-xl font-bold font-poppins text-gray-900">
                  {isHindi
                    ? "छात्र शिकायत / परिवाद पंजीकरण फॉर्म"
                    : "Student Grievance & Complaint Lodging Form"}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 font-sans mt-1">
                  {isHindi
                    ? "हरियाणा शक्ति कॉलेज ऑफ एजुकेशन की छात्र शिकायत निवारण समिति एवं संबंधित प्रकोष्ठ आपकी समस्या की निष्पक्ष जांच हेतु प्रतिबद्ध है।"
                    : "Fill this official form to lodge an academic, administrative, or campus concern. Submissions are reviewed impartially by the relevant committee."}
                </p>
              </div>

              {isSubmitted ? (
                <div className="py-10 text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 shadow-xs">
                    <CheckCircle2 size={36} />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 font-poppins">
                    {isHindi
                      ? "आपकी शिकायत सफलतापूर्वक दर्ज कर ली गई है!"
                      : "Grievance Registered Successfully!"}
                  </h4>
                  {submittedId && (
                    <div className="mt-3 inline-block bg-blue-50 border border-blue-200 rounded-xl px-4 py-2 text-sm text-[#1c3274] font-mono font-bold">
                      {isHindi
                        ? "शिकायत ट्रैकिंग आईडी: "
                        : "Grievance Tracking ID: "}
                      <span>{submittedId}</span>
                    </div>
                  )}
                  <p className="text-xs sm:text-sm text-gray-600 mt-3 font-sans max-w-md leading-relaxed">
                    {isHindi
                      ? "आपकी शिकायत संबंधित समिति के संज्ञान में भेज दी गई है। नियमानुसार 48-72 कार्य घंटों के भीतर प्राथमिक समीक्षा पूर्ण की जाएगी।"
                      : "Your complaint has been delivered to the institutional Grievance Redressal Committee. You will receive an update on your registered phone/email within statutory working hours."}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setSubmittedId("");
                    }}
                    className="mt-6 px-5 py-2.5 rounded-xl bg-[#363991] text-white text-xs sm:text-sm font-semibold font-poppins hover:bg-[#282b7d] transition shadow-xs">
                    {isHindi
                      ? "एक और शिकायत दर्ज करें"
                      : "Lodge Another Grievance"}
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 font-sans text-xs sm:text-sm">
                  {submitError && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
                      <AlertCircle
                        size={16}
                        className="shrink-0 text-red-500"
                      />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                        {isHindi
                          ? "विद्यार्थी / प्रार्थी का नाम *"
                          : "Student / Complainant Name *"}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={
                          isHindi ? "अपना पूरा नाम लिखें" : "Enter full name"
                        }
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#363991]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                        {isHindi
                          ? "रोल नंबर / नामांकन संख्या"
                          : "Roll No / Enrollment ID"}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. B.Ed. 2026-042 (or Visitor)"
                        value={formData.rollNo}
                        onChange={(e) =>
                          setFormData({ ...formData, rollNo: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#363991]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
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
                            phone: e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 10),
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#363991] font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                        {isHindi ? "ईमेल आईडी" : "Email Address"}
                      </label>
                      <input
                        type="email"
                        placeholder="student@example.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#363991]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                      {isHindi
                        ? "संबंधित समिति / शिकायत प्रकोष्ठ *"
                        : "Concerned Committee / Category *"}
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#363991] bg-white">
                      <option value="Student Grievance Redressal Committee">
                        Student Grievance Redressal Committee (छात्र शिकायत
                        निवारण समिति)
                      </option>
                      <option value="Internal Complaints Committee (ICC) & Gender Cell">
                        Internal Complaints Committee (ICC) & Gender Cell (महिला
                        शिकायत प्रकोष्ठ)
                      </option>
                      <option value="Anti-Ragging Committee & Cell">
                        Anti-Ragging Committee & Cell (एंटी-रैगिंग प्रकोष्ठ)
                      </option>
                      <option value="Academic Advisory & Examination Grievance">
                        Academic Advisory & Examination (शैक्षणिक एवं परीक्षा
                        संबंधी)
                      </option>
                      <option value="Campus Facilities & Library">
                        Campus Facilities & Library (परिसर, प्रयोगशाला व
                        पुस्तकालय)
                      </option>
                      <option value="General Administration / Other">
                        General Administration / Other (सामान्य प्रशासन / अन्य)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                      {isHindi
                        ? "शिकायत का विषय / शीर्षक *"
                        : "Subject / Heading of Grievance *"}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={
                        isHindi
                          ? "संक्षेप में विषय लिखें"
                          : "Brief heading or topic of complaint"
                      }
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#363991]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                      {isHindi
                        ? "विस्तृत विवरण *"
                        : "Detailed Statement of Complaint *"}
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder={
                        isHindi
                          ? "कृपया अपनी शिकायत का स्पष्ट एवं तथ्यात्मक विवरण लिखें..."
                          : "Please write a clear, factual, and detailed account of the issue..."
                      }
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#363991] leading-relaxed resize-y"
                    />
                  </div>

                  <div className="rounded-xl bg-gray-50 border border-gray-200 p-3.5 flex items-start gap-2.5 text-xs text-gray-600">
                    <Lock size={15} className="shrink-0 text-gray-400 mt-0.5" />
                    <span>
                      {isHindi
                        ? "आपकी शिकायत सुरक्षित एवं विनियामक मानकों के अनुरूप केवल अधिकृत समिति सदस्यों द्वारा ही जांची जाएगी।"
                        : "Your grievance details are stored securely and treated with strict confidentiality under institutional and university guidelines."}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#e2535d] hover:bg-[#cf424c] disabled:opacity-75 text-white font-bold py-3 rounded-xl shadow-md transition-all font-poppins text-xs sm:text-sm mt-3 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <span>
                        {isHindi
                          ? "शिकायत पंजीकृत की जा रही है..."
                          : "Registering Grievance with Committee..."}
                      </span>
                    ) : (
                      <>
                        <Send size={15} />
                        <span>
                          {isHindi
                            ? "समिति को शिकायत प्रेषित करें"
                            : "Submit Grievance to Committee"}
                        </span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        <PageNavigationLinks
          previousPage={{
            title: "Faculty & Staff",
            hiTitle: "संकाय एवं कर्मचारी",
            to: "/faculty",
          }}
          nextPage={{
            title: "Photo Gallery",
            hiTitle: "छायाचित्र दीर्घा",
            to: "/gallery",
          }}
          relatedLinks={[
            {
              title: "Mandatory Disclosures",
              hiTitle: "अनिवार्य प्रकटीकरण",
              description:
                "Regulatory approvals, NCTE affidavits, and institutional compliances.",
              hiDescription:
                "नियामक अनुमोदन, एनसीटीई शपथ पत्र एवं वैधानिक अनुपालन।",
              to: "/mandatory-disclosure",
              iconKey: "recognition",
            },
            {
              title: "Contact Campus Office",
              hiTitle: "कॉलेज कार्यालय संपर्क",
              description:
                "Helpline numbers, campus address, and grievance redressal contact.",
              hiDescription:
                "हेल्पलाइन नंबर, परिसर का पता एवं शिकायत निवारण संपर्क।",
              to: "/contact",
              iconKey: "contact",
            },
            {
              title: "Notices & Circulars",
              hiTitle: "सूचनाएं एवं परिपत्र",
              description:
                "Official notifications, examination schedules, and meeting circulars.",
              hiDescription:
                "आधिकारिक अधिसूचनाएं, परीक्षा कार्यक्रम एवं बैठक परिपत्र।",
              to: "/notices",
              iconKey: "notices",
            },
          ]}
        />
      </Container>
    </>
  );
}

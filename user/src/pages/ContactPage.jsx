import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
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
  ChevronRight,
  ExternalLink,
  GraduationCap,
} from "lucide-react";

import { Container } from "../components/common/Container";
import { PageHeaderBanner } from "../components/common/PageHeaderBanner";
import { PageNavigationLinks } from "../components/common/PageNavigationLinks";
import {
  collegeInfo as defaultCollegeInfo,
  contactPageData,
} from "../data/siteData";
import { usePublishedRecords } from "../hooks/usePublishedRecords";
import { useLanguage } from "../context/LanguageContext";

const BLUE = "#363991";
const YELLOW = "#FFD500";

const tabs = contactPageData.tabs.map((tab) => ({
  ...tab,
  icon:
    tab.id === "details"
      ? Building2
      : tab.id === "guestbook"
        ? MessageCircle
        : BriefcaseBusiness,
}));

function SectionTitle({ eyebrow, title, subtitle }) {
  return (
    <div className="mb-6 border-b border-gray-200 pb-5">
      <div className="mb-2 flex items-center gap-2">
        <span className="h-1 w-7 rounded-full" style={{ background: YELLOW }} />
        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#363991]">
          {eyebrow}
        </span>
      </div>

      <h2 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function ContactCard({ icon: Icon, title, children, className = "" }) {
  return (
    <article
      className={`rounded-xl border border-gray-200 bg-white p-5 transition-colors duration-200 hover:border-[#363991]/30 sm:p-6 ${className}`}>
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#363991]/[0.07] text-[#363991]">
        <Icon size={21} strokeWidth={1.8} />
      </div>

      <h3 className="mb-2 text-sm font-semibold text-gray-900">{title}</h3>
      <div className="text-sm leading-6 text-gray-600">{children}</div>
    </article>
  );
}

export default function ContactPage() {
  const navigate = useNavigate();
  const { isHindi } = useLanguage();

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

  const seo = isHindi ? contactPageData.seo.hi : contactPageData.seo.en;
  const intro = isHindi ? contactPageData.intro.hi : contactPageData.intro.en;
  const officeHours = isHindi
    ? contactPageData.officeHours.hi
    : contactPageData.officeHours.en;

  const tabText = (tab) => (isHindi ? tab.hi : tab.en);

  const openTab = (tabId) => {
    if (tabId === "guestbook") {
      navigate("/contact/enquiry");
      return;
    }

    // The job section remains available on this page.
    if (tabId === "jobs") {
      document.getElementById("contact-content")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }

    navigate("/contact");
  };

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta property="og:title" content={seo.ogTitle} />
        <meta property="og:description" content={seo.ogDescription} />
      </Helmet>

      <PageHeaderBanner
        title={isHindi ? "संपर्क करें" : "Contact Us"}
        subtitle={
          isHindi
            ? "प्रवेश, परिसर एवं प्रशासनिक पूछताछ के लिए हमसे संपर्क करें।"
            : "Connect with us for admissions, campus information and general enquiries."
        }
        breadcrumbs={[{ label: isHindi ? "संपर्क" : "Contact" }]}
      />

      <main className="bg-[#F7F8FC] py-8 sm:py-10 lg:py-14">
        <Container>
          {/* College introduction */}
          <section className="mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="h-1 w-full bg-[#FFD500]" />

            <div className="flex flex-col gap-5 p-5 sm:p-7 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#363991] text-white">
                  <GraduationCap size={25} />
                </div>

                <div className="min-w-0">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#363991]">
                    {intro.badge}
                  </p>

                  <h2 className="text-lg font-semibold tracking-tight text-gray-900 sm:text-xl">
                    {collegeInfo.name || "Haryana Shakti College of Education"}
                  </h2>

                  <p className="mt-1 max-w-xl text-sm leading-6 text-gray-500">
                    {intro.title}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 md:shrink-0">
                {phone && (
                  <a
                    href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#363991] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#292d78]">
                    <Phone size={16} />
                    {isHindi ? "अभी कॉल करें" : "Call the College"}
                    <ArrowUpRight size={15} />
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => navigate("/contact/enquiry")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#363991]/20 bg-white px-4 py-3 text-sm font-semibold text-[#363991] transition hover:bg-[#363991] hover:text-white">
                  <MessageCircle size={16} />
                  {isHindi ? "पूछताछ भेजें" : "Submit an Enquiry"}
                  <ArrowUpRight size={15} />
                </button>
              </div>
            </div>
          </section>

          <div className="grid items-start gap-6 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-8">
            {/* Sidebar */}
            <aside className="space-y-5 lg:sticky lg:top-24">
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                <div className="hidden border-b border-gray-100 px-5 py-5 lg:block">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#363991]">
                    {isHindi ? "सहायता केंद्र" : "HELP CENTRE"}
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-gray-900">
                    {isHindi ? "संपर्क मेन्यू" : "Contact Menu"}
                  </h2>
                </div>

                <nav
                  aria-label={isHindi ? "संपर्क विकल्प" : "Contact options"}
                  className="grid grid-cols-3 gap-1 p-2 lg:flex lg:flex-col">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isDetails = tab.id === "details";

                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => openTab(tab.id)}
                        aria-current={isDetails ? "page" : undefined}
                        className={`flex min-w-0 flex-col items-center justify-center gap-2 rounded-xl px-2 py-3 text-center text-xs font-medium leading-4 transition-colors sm:px-3 lg:flex-row lg:justify-start lg:gap-3 lg:px-4 lg:py-4 lg:text-left lg:text-sm ${
                          isDetails
                            ? "bg-[#363991] text-white"
                            : "text-gray-600 hover:bg-[#363991]/[0.06] hover:text-[#363991]"
                        }`}>
                        <Icon size={19} className="shrink-0" />
                        <span>{tabText(tab)}</span>
                        <ChevronRight
                          size={16}
                          className={`ml-auto hidden lg:block ${
                            isDetails ? "opacity-100" : "opacity-50"
                          }`}
                        />
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Office hours */}
              <section className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#363991]/[0.07] text-[#363991]">
                    <Clock3 size={19} />
                  </div>

                  <h3 className="text-sm font-semibold text-gray-900">
                    {isHindi ? "कार्यालय समय" : "Office Hours"}
                  </h3>
                </div>

                <p className="text-sm leading-6 text-gray-600">
                  {officeHours.schedule}
                </p>

                <p className="mt-1 text-sm font-semibold text-[#363991]">
                  {officeHours.timing}
                </p>

                <div className="my-4 border-t border-dashed border-gray-200" />

                <p className="text-xs leading-5 text-gray-500">
                  {officeHours.note}
                </p>
              </section>

              {/* Email support */}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="group flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4 transition hover:border-[#363991]/30">
                  <Mail size={19} className="mt-0.5 shrink-0 text-[#363991]" />

                  <span className="min-w-0">
                    <span className="block text-xs font-medium text-gray-500">
                      {isHindi ? "ईमेल सहायता" : "Email Support"}
                    </span>
                    <span className="mt-1 block break-all text-sm font-medium text-gray-800 group-hover:text-[#363991]">
                      {email}
                    </span>
                  </span>
                </a>
              )}
            </aside>

            {/* Main contact content */}
            <section
              id="contact-content"
              className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 sm:p-7 lg:p-8">
              <SectionTitle
                eyebrow={isHindi ? "हमसे जुड़ें" : "GET IN TOUCH"}
                title={isHindi ? "संपर्क विवरण" : "Official Contact Details"}
                subtitle={
                  isHindi
                    ? "कॉलेज से संपर्क करने के लिए नीचे दिए गए आधिकारिक विवरण देखें।"
                    : "Find the college's official address and communication channels below."
                }
              />

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Address */}
                <ContactCard
                  icon={MapPin}
                  title={isHindi ? "कॉलेज का पता" : "Campus Address"}
                  className="sm:col-span-2">
                  <p>
                    {address ||
                      (isHindi
                        ? "पता उपलब्ध नहीं है।"
                        : "Address not available.")}
                  </p>

                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#363991]/20 px-3 py-2 text-xs font-semibold text-[#363991] transition hover:bg-[#363991] hover:text-white">
                    {isHindi ? "गूगल मैप पर देखें" : "View on Google Maps"}
                    <ExternalLink size={14} />
                  </a>
                </ContactCard>

                {/* Phone */}
                <ContactCard
                  icon={Phone}
                  title={isHindi ? "फोन नंबर" : "Phone & Helpline"}>
                  {phone ? (
                    <a
                      href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                      className="font-medium text-[#363991] hover:underline">
                      {phone}
                    </a>
                  ) : (
                    <p>
                      {isHindi
                        ? "फोन नंबर उपलब्ध नहीं है।"
                        : "Phone number not available."}
                    </p>
                  )}

                  {alternatePhone && (
                    <p className="mt-2">
                      <span className="text-gray-500">
                        {isHindi ? "वैकल्पिक: " : "Alternate: "}
                      </span>
                      <a
                        href={`tel:${alternatePhone.replace(/[^\d+]/g, "")}`}
                        className="font-medium text-[#363991] hover:underline">
                        {alternatePhone}
                      </a>
                    </p>
                  )}
                </ContactCard>

                {/* Email */}
                <ContactCard
                  icon={Mail}
                  title={isHindi ? "आधिकारिक ईमेल" : "Official Email"}>
                  {email ? (
                    <a
                      href={`mailto:${email}`}
                      className="break-all font-medium text-[#363991] hover:underline">
                      {email}
                    </a>
                  ) : (
                    <p>
                      {isHindi
                        ? "ईमेल उपलब्ध नहीं है।"
                        : "Email not available."}
                    </p>
                  )}

                  {email && (
                    <a
                      href={`mailto:${email}`}
                      className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 transition hover:text-[#363991]">
                      {isHindi ? "ईमेल भेजें" : "Send an email"}
                      <ArrowUpRight size={14} />
                    </a>
                  )}
                </ContactCard>

                {/* Social media */}
                <ContactCard
                  icon={Instagram}
                  title={isHindi ? "सोशल मीडिया" : "Connect Online"}
                  className="sm:col-span-2">
                  <p>
                    {isHindi
                      ? "कॉलेज की ऑनलाइन गतिविधियों और अपडेट के लिए हमारे आधिकारिक सोशल मीडिया पेज पर जाएं।"
                      : "Visit our official social media page for college updates and activities."}
                  </p>

                  <a
                    href={instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#363991]/[0.06] px-3 py-2.5 text-sm font-medium text-[#363991] transition hover:bg-[#363991] hover:text-white">
                    <Instagram size={17} />
                    Instagram
                    <ArrowUpRight size={15} />
                  </a>
                </ContactCard>
              </div>

              {/* Admissions enquiry callout */}
              <section className="mt-6 rounded-2xl border border-yellow-200 bg-[#FFFBEB] p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#363991]">
                    <MessageCircle size={21} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-gray-900">
                      {isHindi
                        ? "प्रवेश एवं अन्य पूछताछ"
                        : "Admissions & General Enquiries"}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {isHindi
                        ? "प्रवेश, दस्तावेज़ सत्यापन और प्रशासनिक जानकारी के लिए कार्यालय समय में कॉलेज से संपर्क करें। परिसर आने से पहले फोन या ईमेल द्वारा जानकारी प्राप्त कर लें।"
                        : "For admissions, document verification and administrative information, contact the college during office hours. Please confirm details by phone or email before visiting the campus."}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => navigate("/contact/enquiry")}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#363991] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#292d78]">
                        <MessageCircle size={16} />
                        {isHindi ? "पूछताछ फॉर्म खोलें" : "Open Enquiry Form"}
                        <ArrowUpRight size={15} />
                      </button>

                      {phone && (
                        <a
                          href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-[#363991] hover:text-[#363991]">
                          <Phone size={16} />
                          {isHindi ? "कॉल करें" : "Call Now"}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </section>
          </div>
        </Container>
      </main>
    </>
  );
}

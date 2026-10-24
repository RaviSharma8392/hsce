import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  Instagram,
  Facebook,
  Linkedin,
} from "lucide-react";
import { doc, onSnapshot } from "firebase/firestore";
import { db, firebaseReady } from "../../config/firebase";
import { useLanguage } from "../../context/LanguageContext";
import { imageData } from "../../data/imagesData";
import { collegeInfo as defaultCollegeInfo } from "../../data/siteData";

const LOGO_SRC = imageData.collegeLogo;
const LOGO_FALLBACK = imageData.legacyCollegeLogo;

const CURRENT_YEAR = new Date().getFullYear();

const normalizePhone = (phone) => String(phone || "").replace(/[^\d+]/g, "");

function CollegeLogo() {
  const [logoSrc, setLogoSrc] = useState(LOGO_SRC);
  const [logoFailed, setLogoFailed] = useState(false);

  const handleLogoError = () => {
    if (logoSrc !== LOGO_FALLBACK) {
      setLogoSrc(LOGO_FALLBACK);
    } else {
      setLogoFailed(true);
    }
  };

  if (logoFailed) {
    return (
      <div className="flex h-16 w-16 items-center justify-center rounded bg-white text-center text-xs font-bold text-gray-800">
        HSCE
      </div>
    );
  }

  return (
    <img
      src={logoSrc}
      onError={handleLogoError}
      alt="Haryana Shakti College of Education logo"
      className="block h-16 w-auto max-w-full object-contain"
    />
  );
}

export function Footer({
  collegeInfo = {},
  displayedName,
  displayedAffiliation,
}) {
  const { t, isHindi } = useLanguage();

  // Real-time synchronization state with Firestore siteContent/settings document
  const [liveInfo, setLiveInfo] = useState({ ...defaultCollegeInfo, ...collegeInfo });

  useEffect(() => {
    setLiveInfo((prev) => ({ ...prev, ...collegeInfo }));
  }, [collegeInfo]);

  useEffect(() => {
    if (!firebaseReady) return undefined;
    const unsub = onSnapshot(
      doc(db, "siteContent", "settings"),
      (snap) => {
        if (snap.exists()) {
          setLiveInfo((prev) => ({ ...prev, ...snap.data() }));
        }
      },
      (err) => console.warn("Footer live settings sync:", err)
    );
    return () => unsub();
  }, []);

  const primaryPhone = liveInfo.phone || "9953155054";
  const alternatePhone = liveInfo.alternatePhone || "8056777077";
  const contactEmail = liveInfo.email || "hsce.kanjhawala@gmail.com";
  const locationText = liveInfo.address || "Kanjhawala, Delhi – 110081";
  const societyText = liveInfo.society || "Haryana Shakti Education Society";

  const collegeName = displayedName || liveInfo.name || "Haryana Shakti College of Education";
  const affiliationText = displayedAffiliation || liveInfo.affiliation || "Affiliated to Guru Gobind Singh Indraprastha University (GGSIPU)";

  const topLinks = [
    ["/course", "navAcademics", "Academics"],
    ["/admissions", "navAdmissions", "Admissions"],
    ["/gallery", "gallery", "Photo Gallery"],
    ["/faculty", "navFaculty", "Faculty"],
    ["/notices", "navNotices", "Notices"],
    ["/contact", "navContact", "Contact Us"],
  ];

  const linkColumns = [
    [
      ["/about", "aboutOverview", "About the College"],
      ["/about/history", "aboutHistory", "History & Genesis"],
      ["/about/chairman", "aboutChairman", "Chairman's Desk"],
      ["/about/principal", "aboutPrincipal", "Principal's Desk"],
      ["/course/bed", "bedCourse", "B.Ed Programme"],
      ["/syllabus", "curriculumPedagogy", "B.Ed. Syllabus"],
    ],
    [
      ["/admissions", "navAdmissions", "Admissions"],
      ["/committees", "footerGrievances", "Committees & Grievances"],
      ["/contact/enquiry", "sendAnEnquiry", "Send an Enquiry"],
      ["/book-a-tour", "bookTour", "Book a Campus Tour"],
      ["/faculty", "facultyStaff", "Faculty & Staff"],
    ],
    [
      ["/campus-life", "aboutFacilities", "Campus Life & Facilities"],
      ["/gallery", "gallery", "Photo Gallery"],
      ["/notices", "footerNoticeBoard", "Notices & Circulars"],
      ["/mandatory-disclosure", "navDisclosure", "Mandatory Disclosure"],
      ["/privacy", "footerPrivacyPolicy", "Privacy Policy"],
    ],
  ];

  // Social links strictly Facebook, Instagram, and LinkedIn as requested
  const socialLinks = [
    {
      name: "Facebook",
      url: liveInfo.facebook || "https://www.facebook.com",
      Icon: Facebook,
      className: "text-[#1877F2]",
    },
    {
      name: "Instagram",
      url: liveInfo.instagram || "https://www.instagram.com/hscekanjhawala/",
      Icon: Instagram,
      className: "text-[#E1306C]",
    },
    {
      name: "LinkedIn",
      url: liveInfo.linkedin || "https://www.linkedin.com",
      Icon: Linkedin,
      className: "text-[#0077B5]",
    },
  ];

  const renderLink = ([path, key, fallback]) => (
    <Link
      key={path}
      to={path}
      className="transition-colors duration-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
      {t(key, fallback)}
    </Link>
  );

  return (
    <footer className="bg-[#1f2026] font-sans text-white border-t border-slate-800">
      <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
          {/* College information */}
          <div className="w-full lg:w-1/4 lg:max-w-[300px]">
            <div className="mb-7">
              <div className="inline-flex min-h-[70px] max-w-full items-center justify-start">
                <CollegeLogo />
              </div>

              <h2 className="mt-4 text-base font-bold leading-snug text-white">
                {collegeName}
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                {affiliationText}
              </p>
            </div>

            <address className="space-y-3.5 text-sm not-italic leading-relaxed text-gray-300">
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                {locationText}
              </p>

              {primaryPhone && (
                <a
                  href={`tel:${normalizePhone(primaryPhone)}`}
                  className="flex items-center gap-3 break-all transition hover:text-[#FBDD23] text-xs sm:text-sm">
                  <Phone size={15} aria-hidden="true" className="shrink-0 text-[#FBDD23]" />
                  <span>{primaryPhone}</span>
                </a>
              )}

              {alternatePhone && (
                <a
                  href={`tel:${normalizePhone(alternatePhone)}`}
                  className="flex items-center gap-3 break-all transition hover:text-[#FBDD23] text-xs sm:text-sm">
                  <Phone
                    size={15}
                    aria-hidden="true"
                    className="shrink-0 text-[#FBDD23]"
                  />
                  <span>{alternatePhone}</span>
                </a>
              )}

              {contactEmail && (
                <a
                  href={`mailto:${contactEmail}`}
                  className="flex items-center gap-3 break-all transition hover:text-[#FBDD23] text-xs sm:text-sm">
                  <Mail size={15} aria-hidden="true" className="shrink-0 text-[#FBDD23]" />
                  <span>{contactEmail}</span>
                </a>
              )}
            </address>

            <div className="mt-8 h-px w-full bg-gray-800 lg:hidden" />
          </div>

          {/* Navigation and footer links */}
          <div className="min-w-0 flex-1">
            <nav
              aria-label="Main footer navigation"
              className="hidden flex-wrap gap-x-7 gap-y-4 border-b border-gray-800 pb-6 text-sm font-medium md:flex">
              {topLinks.map(renderLink)}
            </nav>

            <div className="grid grid-cols-1 gap-x-6 gap-y-9 pt-2 text-sm text-gray-300 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:pt-8">
              {linkColumns.map((column, index) => (
                <nav
                  key={index}
                  aria-label={`Footer links ${index + 1}`}
                  className="flex flex-col items-start gap-3.5 text-xs sm:text-sm">
                  {column.map(renderLink)}
                </nav>
              ))}

              {/* Governance, Management & Social Links */}
              <div className="flex flex-col items-start gap-5 text-xs text-gray-400">
                <div>
                  <p className="font-semibold text-white">
                    &copy; {CURRENT_YEAR} {collegeName}
                  </p>
                  <p className="mt-0.5 text-gray-400 text-[11px]">
                    {t("footerRightsReserved", "All Rights Reserved.")}
                  </p>
                </div>

                {/* Sponsoring Society & Managed by Ravi Sharma */}
                <div className="rounded-xl bg-white/5 border border-white/10 p-3.5 w-full space-y-1">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Governance &amp; Administration
                  </p>
                  <p className="font-semibold text-xs text-white">
                    {societyText}
                  </p>
                  <div className="pt-1.5 border-t border-white/10 flex items-center gap-1.5 text-xs font-bold text-[#FBDD23]">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                    <span>Made &amp; Managed by Ravi Sharma</span>
                  </div>
                </div>

                {/* Social Media Links */}
                {socialLinks.length > 0 && (
                  <nav aria-label="Social media links">
                    <div className="flex flex-wrap items-center gap-2.5">
                      {socialLinks.map(({ name, url, Icon, className }) => (
                        <a
                          key={name}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={name}
                          title={name}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-white transition duration-200 hover:-translate-y-0.5 hover:bg-gray-100 shadow-sm">
                          <Icon
                            size={16}
                            className={className}
                            aria-hidden="true"
                          />
                        </a>
                      ))}
                    </div>
                  </nav>
                )}
              </div>
            </div>

            {/* Mobile top navigation */}
            <nav
              aria-label="Additional footer navigation"
              className="mt-9 flex flex-wrap gap-x-5 gap-y-4 border-t border-gray-800 pt-6 text-xs sm:text-sm font-medium md:hidden">
              {topLinks.map(renderLink)}
            </nav>
          </div>
        </div>

        {/* Bottom Sub-bar */}
        <div className="mt-10 pt-6 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-3">
          <p className="text-center sm:text-left text-[11px] sm:text-xs text-gray-400">
            Haryana Shakti College of Education &bull; Approved by NCTE &bull; Affiliated to GGSIPU, Delhi
          </p>
          <p className="text-[11px] sm:text-xs text-gray-300 font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Made &amp; Managed by <strong>Ravi Sharma</strong></span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

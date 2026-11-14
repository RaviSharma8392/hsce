import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  Instagram,
  Facebook,
  Linkedin,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { imageData } from "../../data/imagesData";
import { collegeInfo as defaultCollegeInfo } from "../../data/siteData";

const LOGO_SRC = imageData.collegeLogo;
const LOGO_FALLBACK = imageData.legacyCollegeLogo;

const CURRENT_YEAR = new Date().getFullYear();

const normalizePhone = (phone) => String(phone || "").replace(/[^\d+]/g, "");

function WhatsAppIcon({ size = 18, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

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
      width="432"
      height="432"
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
  const { t } = useLanguage();

  // Site settings are loaded by the shared layout and passed into the footer.
  const [liveInfo, setLiveInfo] = useState({ ...defaultCollegeInfo, ...collegeInfo });
  const prevCollegeInfoRef = useRef(collegeInfo);

  useEffect(() => {
    if (prevCollegeInfoRef.current !== collegeInfo) {
      prevCollegeInfoRef.current = collegeInfo;
      setLiveInfo((prev) => ({ ...prev, ...collegeInfo }));
    }
  }, [collegeInfo]);

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
      ["/course", "bedCourse", "B.Ed. Programme"],
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
      url: liveInfo.facebook,
      Icon: Facebook,
      className: "text-[#1877F2]",
    },
    {
      name: "Instagram",
      url: liveInfo.instagram,
      Icon: Instagram,
      className: "text-[#E1306C]",
    },
    {
      name: "LinkedIn",
      url: liveInfo.linkedin,
      Icon: Linkedin,
      className: "text-[#0077B5]",
    },
  ].filter((socialLink) => Boolean(socialLink.url));

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
      <div className="mx-auto max-w-[1400px] px-6 py-10 sm:py-12 lg:px-8 lg:py-16">
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

            <div className="grid grid-cols-2 gap-x-4 gap-y-8 pt-2 text-sm text-gray-300 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:pt-8">
              {linkColumns.map((column, index) => (
                <nav
                  key={index}
                  aria-label={`Footer links ${index + 1}`}
                  className="flex flex-col items-start gap-3.5 text-xs sm:text-sm">
                  {column.map(renderLink)}
                </nav>
              ))}

              {/* Governance, Management & Social Links */}
              <div className="col-span-2 sm:col-span-1 md:col-span-1 lg:col-span-1 flex flex-col items-start gap-5 text-xs text-gray-400">
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

        {/* Developer Contact Strip (Matching reference image with exact footer background) */}
        <div className="mt-12 pt-10 border-t border-gray-800 text-center">
          {/* Header */}
          <h3 className="text-xl sm:text-2xl md:text-3xl font-medium text-white tracking-wide">
            <a
              href="https://wa.me/918392856993?text=Hi%20Ravi,%20I%20saw%20your%20work%20and%20would%20like%20to%20discuss%20a%20website%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-8 decoration-1 decoration-white/70 hover:decoration-[#FBDD23] hover:text-[#FBDD23] transition-colors">
              Want a Website Like This? Contact Us
            </a>
          </h3>

          {/* Subtext */}
          <p className="mx-auto mt-4 max-w-3xl text-sm sm:text-base text-[#d1d5db] font-normal leading-relaxed">
            Designed &amp; Developed by{" "}
            <strong className="font-semibold text-white">Ravi Sharma</strong>. Get
            a premium, blazing-fast college, university, school portal or custom
            institutional website. Call or WhatsApp:{" "}
            <a
              href="https://wa.me/918392856993"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-white hover:text-[#FBDD23] transition-colors">
              +91 83928 56993
            </a>
          </p>

          {/* Action Row */}
          <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Outlined WhatsApp button with arrow */}
            <a
              href="https://wa.me/918392856993?text=Hi%20Ravi,%20I%20saw%20the%20Haryana%20Shakti%20College%20website%20and%20would%20like%20to%20discuss%20a%20college/institutional%20website%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex w-full md:w-auto items-center justify-between gap-6 border border-white/60 hover:border-[#FBDD23] bg-transparent px-6 py-3.5 text-sm sm:text-base text-white hover:text-[#FBDD23] transition-all duration-200 cursor-pointer">
              <span>Connect directly on WhatsApp (+91 83928 56993)</span>
              <ArrowRight
                size={20}
                className="transition-transform duration-200 group-hover:translate-x-1 shrink-0"
              />
            </a>

            {/* 4 Circular Outline Icon Buttons */}
            <div className="flex items-center gap-3.5">
              <a
                href="https://www.instagram.com/raviiiiii._0/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram profile"
                title="Instagram"
                className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/60 bg-transparent text-white hover:border-[#FBDD23] hover:text-[#FBDD23] transition-all duration-200 hover:scale-105 active:scale-95">
                <Instagram size={20} />
              </a>

              <a
                href="https://wa.me/918392856993?text=Hi%20Ravi,%20I%20saw%20the%20Haryana%20Shakti%20College%20website%20and%20would%20like%20to%20discuss%20a%20college/institutional%20website%20project."
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp directly"
                title="WhatsApp"
                className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/60 bg-transparent text-white hover:border-[#25D366] hover:text-[#25D366] transition-all duration-200 hover:scale-105 active:scale-95">
                <WhatsAppIcon size={20} />
              </a>

              <a
                href="tel:+918392856993"
                aria-label="Call +91 83928 56993"
                title="Call"
                className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/60 bg-transparent text-white hover:border-[#FBDD23] hover:text-[#FBDD23] transition-all duration-200 hover:scale-105 active:scale-95">
                <Phone size={20} />
              </a>

              <a
                href="mailto:ravisharmabhimtal@gmail.com?subject=Website%20Inquiry%20for%20College%20or%20Educational%20Website"
                aria-label="Email Ravi Sharma"
                title="Email"
                className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/60 bg-transparent text-white hover:border-[#FBDD23] hover:text-[#FBDD23] transition-all duration-200 hover:scale-105 active:scale-95">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Sub-bar with Copyright Claim */}
        <div className="mt-10 pt-6 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-3">
          <p className="text-center sm:text-left text-[11px] sm:text-xs text-gray-400">
            &copy; {CURRENT_YEAR} Haryana Shakti College of Education. All Rights Reserved. Content &amp; Media Protected by Copyright.
          </p>
          <p className="text-center sm:text-right text-[11px] sm:text-xs text-gray-400">
            Approved by NCTE &bull; Affiliated to GGSIPU, Delhi &bull; Established 1999
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

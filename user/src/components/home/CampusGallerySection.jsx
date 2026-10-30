import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Camera, ArrowRight } from "lucide-react";
import { Container } from "../common/Container";
import { useLanguage } from "../../context/LanguageContext";
import { useAdmissionModal } from "../../context/AdmissionModalContext";
import { imageData } from "../../data/imagesData";

export function CampusGallerySection() {
  const { isHindi } = useLanguage();
  const { openAdmissionModal } = useAdmissionModal();

  // 4 Core Campus Photos for the 2x2 Photo Gallery Grid (Matching user screenshot 2)
  const galleryPhotos = [
    {
      src: imageData.principalStudentDiscussion,
      alt: "Faculty and pupil-teachers in academic discussion",
      caption: isHindi ? "शैक्षणिक विचार-विमर्श" : "Academic Discussion",
    },
    {
      src: imageData.studentCricket,
      alt: "Students playing cricket on college sports ground",
      caption: isHindi ? "खेल एवं शारीरिक गतिविधियाँ" : "Sports & Athletics",
    },
    {
      src: imageData.computerLab,
      alt: "Pupil-teachers in the ICT computer laboratory",
      caption: isHindi ? "आईसीटी एवं कंप्यूटर लैब" : "ICT Computer Lab",
    },
    {
      src: imageData.library,
      alt: "Curriculum library and reading room at HSCE",
      caption: isHindi ? "पाठ्यचर्या पुस्तकालय" : "Curriculum Library",
    },
  ];

  // 2 Featured Milestone Event Cards (Matching user screenshot 1)
  const milestoneAlbums = [
    {
      id: "sports-meet",
      image: imageData.studentCricket,
      titleEn: "Annual Sports Meet & Teacher Trainees Cultural Day",
      titleHi: "वार्षिक खेलकूद प्रतियोगिता एवं सांस्कृतिक महोत्सव",
      dateEn: "25th Oct 2024",
      dateHi: "25 अक्टूबर 2024",
      link: "/gallery",
    },
    {
      id: "tlm-workshop",
      image: imageData.computerLab,
      titleEn: "Pedagogical TLM Workshop & Curriculum Resource Exhibition",
      titleHi: "टीएलएम निर्माण कार्यशाला एवं शिक्षण सामग्री प्रदर्शनी",
      dateEn: "18th Mar 2024",
      dateHi: "18 मार्च 2024",
      link: "/gallery",
    },
  ];

  return (
    <section className="bg-[#EDF2F8] py-14 sm:py-16 lg:py-20 font-sans border-b border-gray-200/90">
      <Container>
        {/* ============================================================== */}
        {/* SECTION HEADER                                                 */}
        {/* ============================================================== */}
        <div className="mb-10 sm:mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2.5 flex items-center gap-2">
              <span className="h-0.5 w-6 bg-[#FBDD23]" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#2E3A8C]">
                {isHindi ? "त्वरित संदर्भ एवं परिसर झलकियां" : "QUICK REFERENCE & CAMPUS LIFE"}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#2E3A8C] leading-tight">
              {isHindi ? "परिसर की गतिविधियां एवं संदर्भ" : "Life, Learning & Quick Reference"}
            </h2>
          </div>

          <Link
            to="/gallery"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-2.5 text-xs sm:text-sm font-bold text-[#2E3A8C] transition-all hover:border-[#2E3A8C] hover:bg-slate-50 shadow-xs">
            <Camera size={15} className="text-[#2E3A8C]" />
            <span>{isHindi ? "पूरी गैलरी देखें" : "View Full Gallery"}</span>
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-1 text-[#FBDD23]"
            />
          </Link>
        </div>

        {/* ============================================================== */}
        {/* MAIN COMPOSITE GRID (Matching user screenshots 1 & 2)           */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* ============================================================ */}
          {/* LEFT SIDE: QUICK REFERENCE + 2 EVENT ALBUM CARDS           */}
          {/* ============================================================ */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            {/* Quick Reference Section with Rotated Vertical Label (Screenshot 2) */}
            <div className="bg-white/70 backdrop-blur-xs p-4 sm:p-6 rounded-2xl border border-[#2E3A8C]/15 shadow-xs">
              {/* Mobile top label (sm:hidden) */}
              <div className="sm:hidden mb-3 pb-2 border-b border-[#2E3A8C]/15 flex items-center gap-2">
                <span className="h-0.5 w-4 bg-[#FBDD23]" />
                <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#2E3A8C]">
                  {isHindi ? "त्वरित संदर्भ" : "QUICK REFERENCE"}
                </span>
              </div>

              <div className="flex gap-4 sm:gap-6">
                {/* Vertical Rotated Label on Tablet/Desktop */}
                <div className="hidden sm:flex items-center justify-center select-none shrink-0 border-r border-[#2E3A8C]/20 pr-3 sm:pr-4">
                  <span className="[writing-mode:vertical-rl] rotate-180 text-xs font-extrabold uppercase tracking-[0.28em] text-[#2E3A8C]">
                    {isHindi ? "त्वरित संदर्भ" : "QUICK REFERENCE"}
                  </span>
                </div>

                {/* 3 Horizontal Action Rows with Circular Yellow Arrow Buttons */}
                <div className="flex-1 space-y-4">
                  {/* Row 1: Admission / Appointment */}
                  <div className="pb-3.5 border-b border-[#2E3A8C]/15 flex items-center justify-between gap-3">
                    <div>
                      <h4 className="text-base sm:text-[17px] font-bold text-[#2E3A8C] leading-tight">
                        {isHindi ? "प्रवेश आमंत्रण" : "Request Admission"}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {isHindi ? "बी.एड. 2026-27 प्रवेश व काउंसलिंग" : "B.Ed. Counseling & Guidance"}
                      </p>
                      <button
                        type="button"
                        onClick={() => openAdmissionModal()}
                        className="mt-1 text-xs font-bold text-[#2E3A8C] hover:underline flex items-center gap-1 cursor-pointer">
                        <span>{isHindi ? "पूछताछ करें →" : "Make Enquiry →"}</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => openAdmissionModal()}
                      aria-label="Open admission enquiry form"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FBDD23] hover:bg-[#FFDC13] text-slate-900 shadow-xs transition-transform hover:scale-105 cursor-pointer">
                      <ArrowUpRight size={18} strokeWidth={2.5} />
                    </button>
                  </div>

                  {/* Row 2: B.Ed. Curriculum / Schedule */}
                  <div className="pb-3.5 border-b border-[#2E3A8C]/15 flex items-center justify-between gap-3">
                    <div>
                      <h4 className="text-base sm:text-[17px] font-bold text-[#2E3A8C] leading-tight">
                        {isHindi ? "बी.एड. पाठ्यक्रम" : "Curriculum & Syllabus"}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {isHindi ? "2-वर्षीय एनसीटीई एवं जीजीएसआईपीयू योजना" : "Two-Year GGSIPU Scheme"}
                      </p>
                      <Link
                        to="/course/bed"
                        className="mt-1 text-xs font-bold text-[#2E3A8C] hover:underline flex items-center gap-1">
                        <span>{isHindi ? "पाठ्यक्रम देखें →" : "View Syllabus →"}</span>
                      </Link>
                    </div>

                    <Link
                      to="/course/bed"
                      aria-label="View B.Ed. Syllabus"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FBDD23] hover:bg-[#FFDC13] text-slate-900 shadow-xs transition-transform hover:scale-105">
                      <ArrowUpRight size={18} strokeWidth={2.5} />
                    </Link>
                  </div>

                  {/* Row 3: Mandatory Disclosures */}
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h4 className="text-base sm:text-[17px] font-bold text-[#2E3A8C] leading-tight">
                        {isHindi ? "अनिवार्य प्रकटीकरण" : "Mandatory Disclosures"}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {isHindi ? "एनसीटीई आदेश एवं वैधानिक शपथ-पत्र" : "NCTE Orders & Affidavits"}
                      </p>
                      <Link
                        to="/mandatory-disclosure"
                        className="mt-1 text-xs font-bold text-[#2E3A8C] hover:underline flex items-center gap-1">
                        <span>{isHindi ? "दस्तावेज देखें →" : "Read more →"}</span>
                      </Link>
                    </div>

                    <Link
                      to="/mandatory-disclosure"
                      aria-label="View Mandatory Disclosures"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FBDD23] hover:bg-[#FFDC13] text-slate-900 shadow-xs transition-transform hover:scale-105">
                      <ArrowUpRight size={18} strokeWidth={2.5} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================== */}
            {/* 2 BLUE MILESTONE ALBUM CARDS (Screenshot 1)                */}
            {/* ========================================================== */}
            <div className="space-y-3.5">
              {milestoneAlbums.map((album) => (
                <div
                  key={album.id}
                  className="flex items-center gap-4 rounded-xl bg-[#2E3A8C] hover:bg-[#202965] p-4 text-white shadow-md transition-all duration-300 hover:shadow-lg">
                  {/* Photo Thumbnail */}
                  <div className="relative h-20 w-24 sm:h-22 sm:w-28 shrink-0 overflow-hidden rounded-lg bg-slate-200 border border-white/20">
                    <img
                      src={album.image}
                      alt={isHindi ? album.titleHi : album.titleEn}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Text Details & Yellow View Album Button */}
                  <div className="min-w-0 flex-1">
                    <h5 className="text-sm sm:text-base font-bold text-white leading-snug line-clamp-2">
                      {isHindi ? album.titleHi : album.titleEn}
                    </h5>

                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#FBDD23]">
                        {isHindi ? album.dateHi : album.dateEn}
                      </span>

                      <Link
                        to={album.link}
                        className="inline-flex items-center rounded-sm bg-[#FBDD23] hover:bg-[#FFDC13] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-900 shadow-2xs transition-all active:scale-95">
                        {isHindi ? "एल्बम देखें" : "View Album"}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT SIDE: PHOTO GALLERY ROTATED LABEL + 2x2 PHOTO GRID   */}
          {/* ============================================================ */}
          <div className="lg:col-span-7 flex gap-4 sm:gap-6 items-stretch">
            {/* Center Vertical Rotated Label (Screenshot 2) */}
            <div className="hidden sm:flex items-center justify-center select-none shrink-0 border-r border-[#2E3A8C]/20 pr-4">
              <span className="[writing-mode:vertical-rl] rotate-180 text-xs font-extrabold uppercase tracking-[0.28em] text-[#2E3A8C]">
                {isHindi ? "फोटो गैलरी" : "PHOTO GALLERY"}
              </span>
            </div>

            {/* 2x2 Photo Grid */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {galleryPhotos.map((photo) => (
                <div
                  key={photo.alt}
                  className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-200 border border-white/80 shadow-md">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Gradient Overlay & Caption */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-90 transition-opacity" />

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="inline-block rounded-sm bg-[#FBDD23] px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-slate-900">
                      HSCE Campus
                    </span>
                    <p className="mt-1 text-sm font-bold text-white line-clamp-1">
                      {photo.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default CampusGallerySection;

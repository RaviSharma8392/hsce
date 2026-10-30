import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  GraduationCap,
  Mail,
  UserRound,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import { Container } from "../components/common/Container";
import { PageHeaderBanner } from "../components/common/PageHeaderBanner";
import { db, firebaseReady } from "../config/firebase";
import { cloudinaryImageUrl } from "../data/imagesData";
import { useLanguage } from "../context/LanguageContext";

const labels = {
  en: {
    title: "Faculty & Staff",
    subtitle:
      "Meet our dedicated educators, pedagogy mentors, and administrative professionals.",
    sidebarTitle: "Faculty & Staff",
    all: "All Faculty & Staff",
    teaching: "Teaching Faculty",
    administration: "Administration",
    educationDept: "Education (Teacher Training)",
    name: "Name",
    designation: "Designation",
    subject: "Subject",
    qualifications: "Qualifications",
    searchPlaceholder: "Search faculty by name or subject...",
    allCategories: "All Designations",
    category: "Designation",
    noFaculty: "No faculty records match your criteria.",
    loadError: "Faculty details could not be loaded. Please try again later.",
    notConfigured: "Faculty details are currently unavailable.",
    noPhoto: "Faculty member",
    photo: "Photo",
    nameAndPost: "Name and Post",
    occupation: "Occupation",
  },
  hi: {
    title: "संकाय एवं कर्मचारी",
    subtitle:
      "हमारे समर्पित प्राध्यापकों, शिक्षाविदों और प्रशासनिक अधिकारियों का परिचय।",
    sidebarTitle: "संकाय एवं कर्मचारी",
    all: "सभी संकाय एवं कर्मचारी",
    teaching: "शिक्षण संकाय",
    administration: "प्रशासनिक कर्मचारी (Administration)",
    educationDept: "शिक्षक शिक्षा विभाग (Education)",
    name: "नाम (Name)",
    designation: "पदनाम (Designation)",
    subject: "विषय (Subject)",
    qualifications: "योग्यताएं",
    searchPlaceholder: "नाम या विषय से खोजें...",
    allCategories: "सभी पदनाम",
    category: "पदनाम",
    noFaculty: "कोई विवरण उपलब्ध नहीं है।",
    loadError: "संकाय विवरण लोड नहीं हो सके। कृपया बाद में पुनः प्रयास करें।",
    notConfigured: "संकाय विवरण अभी उपलब्ध नहीं हैं।",
    noPhoto: "संकाय सदस्य",
    photo: "फोटो (Photo)",
    nameAndPost: "नाम एवं पद (Name and Post)",
    occupation: "पदभार एवं संस्थान (Occupation)",
  },
};

function isNonTeaching(member) {
  return /non[\s-]*teaching|admin/i.test(member.staffType || "") ||
    /administration/i.test(member.department || "");
}

function getDepartment(member) {
  return member.department || member.subject || "Education";
}

function getCategory(member) {
  return member.category || member.designation || "Faculty";
}

function getQualifications(member) {
  return member.qualifications || member.qualification || "";
}

function getPhoto(member) {
  if (!member || typeof member !== "object") return "";
  let photo =
    member.image ||
    member.imageUrl ||
    member.photo ||
    member.photoUrl ||
    member.picture ||
    member.avatar ||
    member.img ||
    member.profileImage ||
    member.profilePic ||
    "";
  if (typeof photo !== "string") return "";
  photo = photo.trim();
  if (
    photo &&
    !photo.startsWith("http://") &&
    !photo.startsWith("https://") &&
    !photo.startsWith("/") &&
    !photo.startsWith("data:")
  ) {
    photo = "/" + photo;
  }
  if (!photo) {
    const nameStr = (member.name || "").toLowerCase();
    const desigStr = (member.designation || "").toLowerCase();
    if (nameStr.includes("savita") || desigStr.includes("principal")) {
      return "/assets/people/principal-savita-rathee.png";
    }
  }
  return photo;
}

function compareCreatedAt(first, second) {
  const getTime = (value) => {
    if (typeof value?.toDate === "function") return value.toDate().getTime();
    const parsed = Date.parse(value || "");
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  return getTime(first.createdAt) - getTime(second.createdAt);
}

/* ============================================================== */

/* ============================================================== */
/* TEACHING FACULTY ROW (Desktop Table)                           */
/* ============================================================== */
function FacultyTableRow({ member, text }) {
  const [failedPhoto, setFailedPhoto] = useState("");
  const photo = getPhoto(member);
  const isImageFailed = failedPhoto === photo;

  const post = member.post || member.designation || member.category || "Faculty";
  const qualifications = getQualifications(member);
  const dept = getDepartment(member);

  return (
    <tr className="border-b border-gray-200/80 transition-colors hover:bg-slate-50/70">
      {/* Column 1: Photo (Matching Image 1) */}
      <td className="py-5 px-4 sm:px-6 align-top border-r border-gray-200/80 w-[24%] sm:w-[22%]">
        <div className="h-32 w-24 sm:h-36 sm:w-28 overflow-hidden rounded-xs border border-gray-300 bg-white p-1 shadow-2xs">
          {photo && !isImageFailed ? (
            <img
              src={cloudinaryImageUrl(photo, 400)}
              width="400"
              height="500"
              alt={member.name || text.noPhoto}
              loading="lazy"
              className="h-full w-full object-cover object-top"
              onError={() => setFailedPhoto(photo)}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-slate-100 text-slate-400">
              <UserRound size={28} className="text-[#363991]" strokeWidth={1.5} />
              <span className="mt-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                HSCE
              </span>
            </div>
          )}
        </div>
      </td>

      {/* Column 2: Name and Post (Matching Image 1) */}
      <td className="py-5 px-4 sm:px-6 align-top border-r border-gray-200/80 w-[38%] sm:w-[38%]">
        <h4 className="font-sans text-base sm:text-lg font-bold text-[#1E242C] leading-snug">
          {member.name}
        </h4>
        <p className="mt-1 text-sm text-slate-700 font-normal">
          {post}
        </p>
        {member.subject && member.subject !== post && (
          <p className="mt-1.5 text-xs text-slate-500 font-normal">
            <span className="font-semibold text-slate-600">{text.subject}: </span>
            {member.subject}
          </p>
        )}
        {dept && dept !== "Education" && (
          <p className="mt-1 text-xs text-slate-500 font-normal">
            <span className="font-semibold text-slate-600">Department: </span>
            {dept}
          </p>
        )}
        {member.experience && (
          <p className="mt-1 text-xs text-amber-800 font-medium">
            <span>⭐ Experience: </span>
            {member.experience}
          </p>
        )}
      </td>

      {/* Column 3: Occupation (Matching Image 1) */}
      <td className="py-5 px-4 sm:px-6 align-top w-[38%] sm:w-[40%] text-sm text-slate-700">
        {member.occupation ? (
          <p className="font-normal text-slate-800 whitespace-pre-line leading-relaxed">
            {member.occupation}
          </p>
        ) : (
          <div className="space-y-0.5 leading-relaxed font-normal text-slate-800">
            <p>{post},</p>
            <p>
              {dept && dept !== "Education" ? `${dept}, ` : ""}Haryana Shakti College of Education,
            </p>
            <p>Kanjhawala, Delhi</p>
          </div>
        )}

        {qualifications && (
          <p className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-600">
            <GraduationCap size={14} className="shrink-0 text-[#2E3A8C]" />
            <span className="font-medium">{qualifications}</span>
          </p>
        )}

        <div className="mt-2.5 flex flex-wrap items-center gap-3">
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-[#2E3A8C] transition-colors break-all">
              <Mail size={13} className="shrink-0 text-[#2E3A8C]" />
              <span>{member.email}</span>
            </a>
          )}
          {(member.phone || member.mobile) && (
            <a
              href={`tel:${member.phone || member.mobile}`}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 hover:underline">
              <span>📞</span>
              <span>{member.phone || member.mobile}</span>
            </a>
          )}
        </div>
      </td>
    </tr>
  );
}

/* ============================================================== */
/* TEACHING FACULTY CARD (Mobile View: sm:hidden)                 */
/* ============================================================== */
function FacultyMobileCard({ member, text }) {
  const [failedPhoto, setFailedPhoto] = useState("");
  const photo = getPhoto(member);
  const isImageFailed = failedPhoto === photo;

  const post = member.post || member.designation || member.category || "Faculty";
  const qualifications = getQualifications(member);
  const dept = getDepartment(member);

  return (
    <div className="rounded-lg border border-gray-200/90 bg-white p-4 shadow-xs space-y-3">
      <div className="flex items-start gap-3.5">
        <div className="h-24 w-20 shrink-0 overflow-hidden rounded border border-gray-200 bg-white p-1 shadow-2xs">
          {photo && !isImageFailed ? (
            <img
              src={cloudinaryImageUrl(photo, 400)}
              width="400"
              height="500"
              alt={member.name || text.noPhoto}
              loading="lazy"
              className="h-full w-full object-cover object-top"
              onError={() => setFailedPhoto(photo)}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-slate-100 text-slate-400">
              <UserRound size={24} className="text-[#363991]" strokeWidth={1.5} />
              <span className="mt-1 text-[8px] font-bold uppercase tracking-wider text-slate-400">
                HSCE
              </span>
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-sans text-base font-bold text-[#1E242C] leading-snug">
            {member.name}
          </h4>
          <p className="mt-0.5 text-xs font-semibold text-[#2E3A8C]">
            {post}
          </p>
          {member.subject && member.subject !== post && (
            <p className="mt-1 text-xs text-slate-600">
              <span className="font-medium text-slate-500">{text.subject}: </span>
              {member.subject}
            </p>
          )}
          {dept && dept !== "Education" && (
            <p className="mt-0.5 text-xs text-slate-500">
              <span className="font-medium">Dept: </span>
              {dept}
            </p>
          )}
          {member.experience && (
            <p className="mt-1 text-[11px] text-amber-800 font-medium">
              ⭐ {member.experience}
            </p>
          )}
        </div>
      </div>

      {qualifications && (
        <div className="flex items-center gap-1.5 text-xs text-slate-700 bg-slate-50 rounded px-2.5 py-1.5 border border-slate-100">
          <GraduationCap size={14} className="shrink-0 text-[#2E3A8C]" />
          <span className="font-medium line-clamp-2">{qualifications}</span>
        </div>
      )}

      {member.occupation && (
        <p className="text-xs text-slate-600 font-normal leading-relaxed">
          {member.occupation}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-100 text-xs">
        {member.email && (
          <a
            href={`mailto:${member.email}`}
            className="inline-flex items-center gap-1.5 font-medium text-slate-700 hover:text-[#2E3A8C] transition-colors break-all">
            <Mail size={13} className="shrink-0 text-[#2E3A8C]" />
            <span>{member.email}</span>
          </a>
        )}
        {(member.phone || member.mobile) && (
          <a
            href={`tel:${member.phone || member.mobile}`}
            className="inline-flex items-center gap-1 font-medium text-emerald-700 hover:underline">
            <span>📞</span>
            <span>{member.phone || member.mobile}</span>
          </a>
        )}
      </div>
    </div>
  );
}

function TeachingFacultyTable({ staffList, text }) {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [staffList.length]);

  const totalPages = Math.max(1, Math.ceil(staffList.length / ITEMS_PER_PAGE));
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return staffList.slice(start, start + ITEMS_PER_PAGE);
  }, [staffList, currentPage]);

  return (
    <div className="overflow-hidden rounded-md border border-gray-200/90 bg-white shadow-xs">
      {/* Mobile Card List (sm:hidden) */}
      <div className="sm:hidden p-3.5 space-y-3 bg-slate-50/50">
        {paginatedList.map((member) => (
          <FacultyMobileCard
            key={member.id || member.name}
            member={member}
            text={text}
          />
        ))}
      </div>

      {/* Desktop Table (hidden sm:block) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm font-sans min-w-[580px]">
          <thead>
            <tr className="bg-[#1F242C] text-white">
              <th className="py-3.5 px-4 sm:px-6 font-bold text-sm tracking-wide border-r border-[#333a44] w-[24%] sm:w-[22%]">
                {text.photo}
              </th>
              <th className="py-3.5 px-4 sm:px-6 font-bold text-sm tracking-wide border-r border-[#333a44] w-[38%] sm:w-[38%]">
                {text.nameAndPost}
              </th>
              <th className="py-3.5 px-4 sm:px-6 font-bold text-sm tracking-wide w-[38%] sm:w-[40%]">
                {text.occupation}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/80 bg-white">
            {paginatedList.map((member) => (
              <FacultyTableRow
                key={member.id || member.name}
                member={member}
                text={text}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar (5 members per page) */}
      {staffList.length > ITEMS_PER_PAGE && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 bg-slate-50 border-t border-gray-200 text-xs text-slate-600">
          <div className="font-medium">
            Showing <span className="font-bold text-slate-900">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{" "}
            <span className="font-bold text-slate-900">{Math.min(currentPage * ITEMS_PER_PAGE, staffList.length)}</span> of{" "}
            <span className="font-bold text-slate-900">{staffList.length}</span> teaching faculty members
            <span className="ml-1.5 px-2 py-0.5 rounded-full bg-blue-100 text-[#2E3A8C] font-bold text-[10px]">
              5 members per page
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-gray-300 bg-white font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <ChevronLeft size={13} />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setCurrentPage(num)}
                  className={`h-7 min-w-[28px] px-1 text-xs font-bold rounded transition cursor-pointer ${
                    currentPage === num
                      ? "bg-[#2E3A8C] text-white shadow-xs"
                      : "border border-gray-300 bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-gray-300 bg-white font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================== */
/* ADMINISTRATION TABLE (Matching Reference Image 1)              */
/* ============================================================== */
function AdministrationTable({ staffList, text, isHindi }) {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [staffList.length]);

  const totalPages = Math.max(1, Math.ceil(staffList.length / ITEMS_PER_PAGE));
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return staffList.slice(start, start + ITEMS_PER_PAGE);
  }, [staffList, currentPage]);

  return (
    <div className="overflow-hidden rounded-md border border-gray-200/90 bg-white shadow-xs">
      {/* Soft Purple/Lavender Header Bar (Image 1 Style) */}
      <div className="bg-[#E4E7F5] px-6 py-4 border-b border-gray-200/80">
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1E242C] tracking-tight">
          {isHindi ? "प्रशासनिक कर्मचारी (Administration)" : "Administration"}
        </h3>
      </div>

      {/* Mobile Card List (sm:hidden) */}
      <div className="sm:hidden p-3.5 space-y-3 bg-slate-50/50">
        {paginatedList.map((staff) => {
          const qual = getQualifications(staff);
          const dept = staff.department && staff.department !== "Administration" ? staff.department : "";
          return (
            <div
              key={staff.id || staff.name}
              className="rounded-lg border border-gray-200/90 bg-white p-3.5 shadow-xs space-y-1.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{staff.name}</h4>
                  <p className="text-xs font-semibold text-[#2E3A8C] mt-0.5">{staff.designation}</p>
                </div>
                {staff.subject && (
                  <span className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded shrink-0">
                    {staff.subject}
                  </span>
                )}
              </div>
              {qual && (
                <div className="flex items-center gap-1.5 text-xs text-slate-600 pt-0.5">
                  <GraduationCap size={13} className="text-[#363991] shrink-0" />
                  <span>{qual}</span>
                </div>
              )}
              {dept && <p className="text-xs text-slate-500">{dept}</p>}
              {staff.email && (
                <div className="pt-1 border-t border-gray-100">
                  <a href={`mailto:${staff.email}`} className="text-xs text-blue-700 hover:underline break-all">
                    {staff.email}
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Desktop Zebra-Striped Table (hidden sm:block) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm font-sans">
          <thead>
            <tr className="bg-[#1F242C] text-white">
              <th className="py-3.5 px-6 font-bold text-sm tracking-wide border-r border-[#333a44] w-1/3">
                {text.name}
              </th>
              <th className="py-3.5 px-6 font-bold text-sm tracking-wide border-r border-[#333a44] w-1/3">
                {text.designation}
              </th>
              <th className="py-3.5 px-6 font-bold text-sm tracking-wide w-1/3">
                {isHindi ? "योग्यता एवं विवरण" : "Department & Qualifications"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/80">
            {paginatedList.map((staff, idx) => {
              const qual = getQualifications(staff);
              const dept = staff.department && staff.department !== "Administration" ? staff.department : "";
              return (
                <tr
                  key={staff.id || staff.name}
                  className={`transition-colors hover:bg-blue-50/50 ${
                    idx % 2 === 1 ? "bg-[#F9FAFB]" : "bg-white"
                  }`}>
                  <td className="py-3.5 px-6 font-medium text-slate-800 border-r border-gray-200/80">
                    <span className="font-bold text-slate-900 block">{staff.name}</span>
                    {staff.email && (
                      <a href={`mailto:${staff.email}`} className="text-xs text-blue-700 hover:underline">
                        {staff.email}
                      </a>
                    )}
                  </td>
                  <td className="py-3.5 px-6 text-slate-700 font-semibold border-r border-gray-200/80">
                    <span>{staff.designation}</span>
                    {staff.subject && (
                      <span className="block text-xs font-normal text-slate-500 mt-0.5">{staff.subject}</span>
                    )}
                  </td>
                  <td className="py-3.5 px-6 text-slate-600 text-xs">
                    {qual && (
                      <span className="font-medium text-slate-800 flex items-center gap-1">
                        <GraduationCap size={13} className="text-[#363991]" />
                        <span>{qual}</span>
                      </span>
                    )}
                    {dept && <span className="block text-slate-500 mt-0.5">{dept}</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar (5 members per page) */}
      {staffList.length > ITEMS_PER_PAGE && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 bg-slate-50 border-t border-gray-200 text-xs text-slate-600">
          <div className="font-medium">
            Showing <span className="font-bold text-slate-900">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{" "}
            <span className="font-bold text-slate-900">{Math.min(currentPage * ITEMS_PER_PAGE, staffList.length)}</span> of{" "}
            <span className="font-bold text-slate-900">{staffList.length}</span> staff members
            <span className="ml-1.5 px-2 py-0.5 rounded-full bg-purple-100 text-[#363991] font-bold text-[10px]">
              5 members per page
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-gray-300 bg-white font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <ChevronLeft size={13} />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setCurrentPage(num)}
                  className={`h-7 min-w-[28px] px-1 text-xs font-bold rounded transition cursor-pointer ${
                    currentPage === num
                      ? "bg-[#363991] text-white shadow-xs"
                      : "border border-gray-300 bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-gray-300 bg-white font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================== */
/* MAIN FACULTY PAGE COMPONENT                                    */
/* ============================================================== */
export default function FacultyPage() {
  const { isHindi } = useLanguage();
  const text = isHindi ? labels.hi : labels.en;
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get("tab");
  const initialView =
    tabParam === "teaching" || tabParam === "admin" ? tabParam : "all";

  const [faculty, setFaculty] = useState([]);
  const [currentView, setCurrentView] = useState(initialView); // "all" | "teaching" | "admin"
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [loading, setLoading] = useState(firebaseReady);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (tabParam === "teaching") setCurrentView("teaching");
    else if (tabParam === "admin") setCurrentView("admin");
    else if (tabParam === "all" || !tabParam) setCurrentView("all");
  }, [tabParam]);

  const handleViewChange = (viewId) => {
    setCurrentView(viewId);
    setActiveCategory("");
    setSearchParams({ tab: viewId });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (!firebaseReady) {
      setFaculty([]);
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    const facultyQuery = query(
      collection(db, "faculty"),
      where("isPublished", "==", true),
    );

    // Pure dynamic Firestore data - no hardcoded data shown on frontend
    const unsubscribe = onSnapshot(
      facultyQuery,
      (snapshot) => {
        const records = snapshot.docs
          .map((record) => ({ id: record.id, ...record.data() }))
          .sort(compareCreatedAt);
        setFaculty(records);
        setLoadError(false);
        setLoading(false);
      },
      (error) => {
        console.error("Unable to load published faculty records.", error);
        setFaculty([]);
        setLoadError(false);
        setLoading(false);
      }
    );

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  // Split into Teaching and Administrative Staff
  const teachingStaff = useMemo(
    () => faculty.filter((member) => !isNonTeaching(member)),
    [faculty],
  );

  const adminStaff = useMemo(
    () => faculty.filter((member) => isNonTeaching(member)),
    [faculty],
  );

  // Filtered lists based on search and category
  const filteredTeachingStaff = useMemo(() => {
    return teachingStaff.filter((member) => {
      const matchesSearch =
        !searchTerm ||
        (member.name &&
          member.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (member.subject &&
          member.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (member.designation &&
          member.designation.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory =
        !activeCategory || getCategory(member) === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [teachingStaff, searchTerm, activeCategory]);

  const filteredAdminStaff = useMemo(() => {
    return adminStaff.filter((member) => {
      const matchesSearch =
        !searchTerm ||
        (member.name &&
          member.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (member.designation &&
          member.designation.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesSearch;
    });
  }, [adminStaff, searchTerm]);

  // Designations / Categories for filter dropdown
  const categories = useMemo(() => {
    return [...new Set(teachingStaff.map(getCategory))].sort((a, b) =>
      a.localeCompare(b),
    );
  }, [teachingStaff]);

  // Sidebar navigation items
  const sidebarNavItems = [
    {
      id: "all",
      label: text.all,
      count: faculty.length,
    },
    {
      id: "teaching",
      label: text.teaching,
      count: teachingStaff.length,
    },
    {
      id: "admin",
      label: text.administration,
      count: adminStaff.length,
    },
  ];

  return (
    <>
      <PageHeaderBanner
        title={text.title}
        subtitle={text.subtitle}
        breadcrumbs={[
          { label: isHindi ? "अकादमिक" : "Academics", href: "/course" },
          { label: isHindi ? "संकाय" : "Faculty" },
        ]}
      />

      <main className="bg-[#F4F6FA] py-8 sm:py-12 font-sans border-b border-gray-200/90">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* ============================================================== */}
            {/* SIDEBAR NAVIGATION WIDGET (Desktop View: hidden on mobile)     */}
            {/* ============================================================== */}
            <aside className="hidden lg:block lg:col-span-4 space-y-6">
              <div className="overflow-hidden rounded-md border border-gray-200/90 bg-white shadow-md">
                {/* Solid Royal Blue Header (Image 3) */}
                <div className="bg-[#2E3A8C] px-5 py-4">
                  <h3 className="font-serif text-lg font-bold text-white tracking-wide">
                    {text.sidebarTitle}
                  </h3>
                </div>

                {/* Navigation Links Stack */}
                <nav
                  aria-label="Faculty Directory"
                  className="divide-y divide-gray-100">
                  {sidebarNavItems.map((item) => {
                    const isActive = currentView === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleViewChange(item.id)}
                        className={`flex w-full items-center justify-between px-5 py-3.5 text-left text-sm font-medium transition-colors cursor-pointer ${
                          isActive
                            ? "bg-slate-50 text-[#2E3A8C] font-bold border-l-4 border-l-[#2E3A8C] pl-4"
                            : "text-slate-700 hover:bg-slate-50 hover:text-[#2E3A8C]"
                        }`}>
                        <span>{item.label}</span>
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                            isActive
                              ? "bg-[#2E3A8C] text-white"
                              : "bg-slate-100 text-slate-600"
                          }`}>
                          {item.count}
                        </span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Institutional Statutory Trust Widget */}
              <div className="rounded-md border border-gray-200/90 bg-white p-5 shadow-xs">
                <div className="flex items-center gap-3 mb-2">
                  <span className="h-0.5 w-5 bg-[#FBDD23]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2E3A8C]">
                    {isHindi ? "वैधानिक मान्यता" : "Statutory Standard"}
                  </span>
                </div>

                <h4 className="font-serif text-base font-bold text-slate-900 leading-snug">
                  NCTE Approved & GGSIPU Affiliated
                </h4>

                <p className="mt-2 text-xs leading-relaxed text-slate-600 font-normal">
                  {isHindi
                    ? "हरियाणा शक्ति कॉलेज ऑफ एजुकेशन में सभी शिक्षक एवं प्राध्यापक एनसीटीई एवं जीजीएसआईपीयू मानकों के अनुरूप विधिवत अनुमोदित हैं।"
                    : "All faculty appointments adhere strictly to qualifications and standards prescribed by NCTE and Guru Gobind Singh Indraprastha University."}
                </p>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-[#2E3A8C]">
                  <span>Code: 147</span>
                  <span>100 B.Ed. Seats</span>
                </div>
              </div>
            </aside>

            {/* ============================================================== */}
            {/* MAIN CONTENT AREA: Faculty Cards & Admin Table                 */}
            {/* ============================================================== */}
            <section className="lg:col-span-8 space-y-6 sm:space-y-8">
              {/* Mobile Faculty Navigation Card (Matching Reference Image) */}
              <div className="lg:hidden overflow-hidden rounded-xl border border-gray-200/90 bg-white shadow-md">
                <div className="bg-[#2E3A8C] px-5 py-4">
                  <h3 className="font-serif text-lg font-bold text-white tracking-wide">
                    {text.sidebarTitle}
                  </h3>
                </div>

                <nav
                  aria-label="Faculty Directory"
                  className="divide-y divide-gray-100 font-sans">
                  {sidebarNavItems.map((item) => {
                    const isActive = currentView === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleViewChange(item.id)}
                        className={`group flex w-full items-center justify-between px-5 py-3.5 text-left text-sm font-medium transition-colors cursor-pointer ${
                          isActive
                            ? "bg-slate-50 text-[#2E3A8C] font-bold border-l-4 border-l-[#2E3A8C] pl-4"
                            : "text-slate-700 hover:bg-slate-50 hover:text-[#2E3A8C]"
                        }`}>
                        <span>{item.label}</span>
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                            isActive
                              ? "bg-[#2E3A8C] text-white"
                              : "bg-slate-100 text-slate-600"
                          }`}>
                          {item.count}
                        </span>
                      </button>
                    );
                  })}
                </nav>
              </div>
              {/* Filter and Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-md border border-gray-200/90 bg-white p-4 shadow-xs">
                {/* Search input */}
                <div className="relative flex-1">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={text.searchPlaceholder}
                    className="w-full rounded-md border border-gray-200 py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-800 placeholder:text-gray-400 focus:border-[#2E3A8C] focus:outline-none"
                  />
                </div>

                {/* Category filter dropdown (only for teaching staff views) */}
                {currentView !== "admin" && categories.length > 0 && (
                  <div className="shrink-0">
                    <select
                      value={activeCategory}
                      onChange={(e) => setActiveCategory(e.target.value)}
                      className="w-full sm:w-auto rounded-md border border-gray-200 py-2 px-3 text-xs sm:text-sm font-medium text-slate-700 bg-white focus:border-[#2E3A8C] focus:outline-none">
                      <option value="">{text.allCategories}</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* State Handling: Loading, Error */}
              {loading && (
                <div className="rounded-md border border-gray-200 bg-white p-12 text-center text-sm text-slate-500">
                  {isHindi ? "संकाय विवरण लोड हो रहे हैं..." : "Loading faculty profiles..."}
                </div>
              )}

              {loadError && (
                <div className="rounded-md border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
                  {text.loadError}
                </div>
              )}

              {!loading && !loadError && (
                <>
                  {/* VIEW: TEACHING FACULTY (or ALL) */}
                  {(currentView === "all" || currentView === "teaching") && (
                    <div className="space-y-6">
                      {/* Department Heading with Solid Blue Underline (Image 2) */}
                      <div>
                        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E293B]">
                          {text.educationDept}
                        </h2>
                        {/* Blue Underline Accent Bar (Image 2) */}
                        <div className="mt-2.5 h-1 w-16 bg-[#3B82F6] rounded-full" />
                      </div>

                      {filteredTeachingStaff.length > 0 ? (
                        <TeachingFacultyTable
                          staffList={filteredTeachingStaff}
                          text={text}
                        />
                      ) : (
                        <div className="rounded-md border border-gray-200 bg-white p-8 text-center text-sm text-slate-500">
                          {text.noFaculty}
                        </div>
                      )}
                    </div>
                  )}

                  {/* VIEW: ADMINISTRATION (or ALL) */}
                  {(currentView === "all" || currentView === "admin") && (
                    <div className="space-y-6 pt-4">
                      {/* Administration Table (Image 1) */}
                      <AdministrationTable
                        staffList={filteredAdminStaff}
                        text={text}
                        isHindi={isHindi}
                      />
                    </div>
                  )}
                </>
              )}

              {/* Institutional Statutory Trust Widget on Mobile (lg:hidden) */}
              <div className="lg:hidden rounded-md border border-gray-200/90 bg-white p-5 shadow-xs">
                <div className="flex items-center gap-3 mb-2">
                  <span className="h-0.5 w-5 bg-[#FBDD23]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2E3A8C]">
                    {isHindi ? "वैधानिक मान्यता" : "Statutory Standard"}
                  </span>
                </div>

                <h4 className="font-serif text-base font-bold text-slate-900 leading-snug">
                  NCTE Approved & GGSIPU Affiliated
                </h4>

                <p className="mt-2 text-xs leading-relaxed text-slate-600 font-normal">
                  {isHindi
                    ? "हरियाणा शक्ति कॉलेज ऑफ एजुकेशन में सभी शिक्षक एवं प्राध्यापक एनसीटीई एवं जीजीएसआईपीयू मानकों के अनुरूप विधिवत अनुमोदित हैं।"
                    : "All faculty appointments adhere strictly to qualifications and standards prescribed by NCTE and Guru Gobind Singh Indraprastha University."}
                </p>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-[#2E3A8C]">
                  <span>Code: 147</span>
                  <span>100 B.Ed. Seats</span>
                </div>
              </div>
            </section>
          </div>
        </Container>
      </main>
    </>
  );
}

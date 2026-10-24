import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { GraduationCap, Mail, UserRound } from "lucide-react";
import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import { Container } from "../components/common/Container";
import { PageHeaderBanner } from "../components/common/PageHeaderBanner";
import { db, firebaseReady } from "../config/firebase";
import { useLanguage } from "../context/LanguageContext";

const labels = {
  en: {
    title: "Faculty & Staff",
    subtitle:
      "Meet our educators and explore faculty profiles by subject and category.",
    directory: "Faculty",
    nonTeaching: "Non-Teaching Staff",
    teachingDepartments: "Departments",
    allCategories: "All Categories",
    category: "Category",
    subject: "Subject",
    noFaculty: "No faculty records have been published yet.",
    loadError: "Faculty details could not be loaded. Please try again later.",
    notConfigured: "Faculty details are currently unavailable.",
    noPhoto: "Faculty member",
    noDepartments: "Departments will appear here when faculty records are published.",
  },
  hi: {
    title: "संकाय एवं कर्मचारी",
    subtitle: "विषय और श्रेणी के अनुसार हमारे शिक्षकों का विवरण देखें।",
    directory: "संकाय",
    nonTeaching: "गैर-शिक्षण कर्मचारी",
    teachingDepartments: "विभाग",
    allCategories: "सभी श्रेणियाँ",
    category: "श्रेणी",
    subject: "विषय",
    noFaculty: "अभी तक कोई संकाय विवरण प्रकाशित नहीं किया गया है।",
    loadError: "संकाय विवरण लोड नहीं हो सके। कृपया बाद में पुनः प्रयास करें।",
    notConfigured: "संकाय विवरण अभी उपलब्ध नहीं हैं।",
    noPhoto: "संकाय सदस्य",
    noDepartments: "शिक्षक विवरण प्रकाशित होने पर विभाग यहाँ दिखाई देंगे।",
  },
};

const NON_TEACHING_VIEW = "__non_teaching_staff__";

function isNonTeaching(member) {
  return /non[\s-]*teaching/i.test(member.staffType || "");
}

function getDepartment(member) {
  return member.department || member.subject || "General";
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

const seedFaculty = [
  {
    id: "seed-savita-rathee",
    name: "Dr. Savita Rathee",
    designation: "Principal",
    staffType: "Teaching Staff",
    category: "Principal",
    department: "Education",
    subject: "Educational Leadership, Teacher Education",
    qualifications: "M.A., M.Ed., Ph.D. in Education",
    email: "hsce.kanjhawala@gmail.com",
    image: "/assets/people/principal-savita-rathee.png",
    imageUrl: "/assets/people/principal-savita-rathee.png",
    isPublished: true,
  },
  {
    id: "seed-rk-sharma",
    name: "Dr. R. K. Sharma",
    designation: "Senior Faculty Coordinator & Professor",
    staffType: "Teaching Staff",
    category: "Professor",
    department: "Education",
    subject: "Pedagogy of Science, Curriculum & Instruction",
    qualifications: "M.Sc., M.Ed., Ph.D.",
    email: "rksharma.hsce@gmail.com",
    isPublished: true,
  },
  {
    id: "seed-meenakshi-malik",
    name: "Mrs. Meenakshi Malik",
    designation: "Assistant Professor",
    staffType: "Teaching Staff",
    category: "Assistant Professor",
    department: "Education",
    subject: "Pedagogy of Social Sciences, Educational Psychology",
    qualifications: "M.A., M.Ed., NET",
    isPublished: true,
  },
  {
    id: "seed-suman-sharma",
    name: "Mrs. Suman Sharma",
    designation: "Associate Professor",
    staffType: "Teaching Staff",
    category: "Associate Professor",
    department: "Education",
    subject: "Pedagogy of Language, Educational Philosophy",
    qualifications: "M.A. (English), M.Ed., NET",
    isPublished: true,
  },
  {
    id: "seed-kavita-rani",
    name: "Mrs. Kavita Rani",
    designation: "Assistant Professor",
    staffType: "Teaching Staff",
    category: "Assistant Professor",
    department: "Education",
    subject: "Pedagogy of Mathematics, ICT in Education",
    qualifications: "M.Sc. (Maths), M.Ed., NET",
    isPublished: true,
  },
  {
    id: "seed-sunita-devi",
    name: "Mrs. Sunita Devi",
    designation: "Assistant Professor",
    staffType: "Teaching Staff",
    category: "Assistant Professor",
    department: "Education",
    subject: "Assessment for Learning, Gender and Society",
    qualifications: "M.A., M.Ed., NET",
    isPublished: true,
  },
  {
    id: "seed-rekha-vats",
    name: "Mrs. Rekha Vats",
    designation: "Assistant Professor",
    staffType: "Teaching Staff",
    category: "Assistant Professor",
    department: "Education",
    subject: "Creating an Inclusive School, Environmental Education",
    qualifications: "M.A., M.Ed.",
    isPublished: true,
  },
  {
    id: "seed-anil-kumar",
    name: "Mr. Anil Kumar",
    designation: "Administrative Officer",
    staffType: "Non-Teaching Staff",
    category: "Administrative Staff",
    department: "Administration",
    subject: "Campus Administration & Student Records",
    qualifications: "M.Com., MBA",
    email: "admin.hsce@gmail.com",
    isPublished: true,
  },
  {
    id: "seed-virender-singh",
    name: "Mr. Virender Singh",
    designation: "Nodal Discipline & Accounts Officer",
    staffType: "Non-Teaching Staff",
    category: "Administrative Staff",
    department: "Administration",
    subject: "Accounts, Statutory Filings & Discipline",
    qualifications: "B.Com., SAS",
    isPublished: true,
  },
];

function FacultyRecord({ member, text }) {
  const [imageFailed, setImageFailed] = useState(false);
  const photo = getPhoto(member);

  useEffect(() => {
    setImageFailed(false);
  }, [photo]);

  return (
    <article className="flex flex-col gap-5 border-t border-[#d5d5d5] px-4 py-6 sm:flex-row sm:gap-8 sm:px-5 sm:py-8">
      <div className="flex h-36 w-32 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-[#d5d5d5] bg-[#f1f3f6]">
        {photo && !imageFailed ? (
          <img
            src={photo}
            alt={member.name || text.noPhoto}
            loading="lazy"
            className="h-full w-full object-cover object-top transition-transform duration-300 hover:scale-105"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-slate-100 to-slate-200 text-slate-500">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-xs">
              <UserRound size={28} className="text-[#194178]" strokeWidth={1.6} />
            </div>
            <span className="mt-2 text-[10px] font-semibold tracking-wider uppercase text-slate-600">
              {member.staffType || text.noPhoto}
            </span>
          </div>
        )}
      </div>

      <div className="min-w-0 pt-1">
        <h3 className="break-words text-lg font-semibold text-[#172033]">
          {member.name}
        </h3>
        {member.designation && (
          <p className="mt-2 text-base italic text-[#394150]">
            {member.designation}
          </p>
        )}
        {isNonTeaching(member) && member.staffType && (
          <p className="mt-1 text-sm text-[#4b5563]">{member.staffType}</p>
        )}
        {getQualifications(member) && (
          <p className="mt-2 flex items-start gap-2 text-sm leading-6 text-[#283142] sm:text-base">
            <GraduationCap
              size={19}
              className="mt-0.5 shrink-0"
              aria-hidden="true"
            />
            <span>{getQualifications(member)}</span>
          </p>
        )}
        {member.subject && member.subject !== getDepartment(member) && (
          <p className="mt-2 text-sm text-[#4b5563]">
            <span className="font-medium">{text.subject}: </span>
            {member.subject}
          </p>
        )}
        {member.email && (
          <a
            href={`mailto:${member.email}`}
            className="mt-2 inline-flex max-w-full items-center gap-2 break-all text-sm text-[#172033] hover:text-[#438fda] hover:underline sm:text-base">
            <Mail size={18} className="shrink-0" aria-hidden="true" />
            {member.email}
          </a>
        )}
      </div>
    </article>
  );
}

export default function FacultyPage() {
  const { isHindi } = useLanguage();
  const text = isHindi ? labels.hi : labels.en;
  const [faculty, setFaculty] = useState([]);
  const [activeDepartment, setActiveDepartment] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [loading, setLoading] = useState(firebaseReady);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!firebaseReady) {
      setFaculty(seedFaculty);
      setLoading(false);
      return undefined;
    }

    const facultyQuery = query(
      collection(db, "faculty"),
      where("isPublished", "==", true),
    );

    return onSnapshot(
      facultyQuery,
      (snapshot) => {
        const records = snapshot.docs
          .map((record) => ({ id: record.id, ...record.data() }))
          .sort(compareCreatedAt);
        setFaculty(records.length ? records : seedFaculty);
        setLoadError(false);
        setLoading(false);
      },
      (error) => {
        console.error("Unable to load published faculty records.", error);
        setFaculty(seedFaculty);
        setLoadError(false);
        setLoading(false);
      },
    );
  }, []);

  const departments = useMemo(
    () => {
      const teachingDepartments = faculty
        .filter((member) => !isNonTeaching(member))
        .map(getDepartment);
      return [...new Set(teachingDepartments)].sort((a, b) =>
        a.localeCompare(b),
      );
    },
    [faculty],
  );
  const selectedDepartment =
    activeDepartment === NON_TEACHING_VIEW
      ? NON_TEACHING_VIEW
      : departments.includes(activeDepartment)
        ? activeDepartment
        : departments[0] || "";
  const viewingNonTeaching = selectedDepartment === NON_TEACHING_VIEW;
  const categories = useMemo(
    () =>
      [
        ...new Set(
          faculty
            .filter((member) =>
              viewingNonTeaching
                ? isNonTeaching(member)
                : !isNonTeaching(member) &&
                  getDepartment(member) === selectedDepartment,
            )
            .map(getCategory),
        ),
      ].sort((a, b) => a.localeCompare(b)),
    [faculty, selectedDepartment, viewingNonTeaching],
  );
  const visibleFaculty = faculty.filter(
    (member) =>
      (viewingNonTeaching
        ? isNonTeaching(member)
        : !isNonTeaching(member) &&
          getDepartment(member) === selectedDepartment) &&
      (!activeCategory || getCategory(member) === activeCategory),
  );

  const changeDepartment = (department) => {
    setActiveDepartment(department);
    setActiveCategory("");
  };

  return (
    <>
      <Helmet>
        <title>
          {isHindi
            ? "संकाय एवं कर्मचारी | हरियाणा शक्ति कॉलेज ऑफ एजुकेशन"
            : "Faculty & Staff | Haryana Shakti College of Education"}
        </title>
        <meta
          name="description"
          content={
            isHindi
              ? "विषय और श्रेणी के अनुसार हरियाणा शक्ति कॉलेज ऑफ एजुकेशन के संकाय सदस्यों का विवरण।"
              : "Explore Haryana Shakti College of Education faculty members by subject and category."
          }
        />
      </Helmet>

      <PageHeaderBanner
        title={text.title}
        subtitle={text.subtitle}
        breadcrumbs={[
          { label: isHindi ? "अकादमिक" : "Academics", href: "/course" },
          { label: isHindi ? "संकाय" : "Faculty" },
        ]}
      />

      <main className="bg-[#f7f7f7] py-6 sm:py-8">
        <Container>
          <div className="grid items-start gap-5 lg:grid-cols-[minmax(260px,1fr)_minmax(0,2fr)] lg:gap-8">
            <aside className="min-w-0 bg-white p-4 shadow-[0_2px_16px_rgba(0,0,0,0.12)] sm:p-5 lg:p-6">
              <h1 className="relative border-b-2 border-[#d4d4d4] pb-3 text-2xl font-semibold text-black after:absolute after:bottom-[-2px] after:left-0 after:h-[4px] after:w-20 after:bg-[#5599dc]">
                {text.directory}
              </h1>
              <h2 className="mb-2 mt-4 text-xs font-semibold uppercase tracking-[0.08em] text-[#64748b]">
                {text.teachingDepartments}
              </h2>
              <nav
                aria-label={text.directory}
                className="flex max-w-full gap-2 overflow-x-auto overscroll-x-contain pb-2 lg:mt-2 lg:block lg:space-y-0 lg:overflow-visible lg:border-t lg:border-[#d5d5d5] lg:pb-0">
                {departments.map((department) => (
                  <button
                    type="button"
                    key={department}
                    onClick={() => changeDepartment(department)}
                    aria-current={selectedDepartment === department ? "page" : undefined}
                    className={`min-h-11 min-w-max border border-[#d5d5d5] px-3 py-2.5 text-left text-sm transition-colors sm:text-base lg:w-full lg:border-x-0 lg:border-t-0 lg:px-3 lg:py-3 ${
                      selectedDepartment === department
                        ? "bg-[#5599dc] text-white"
                        : "text-[#111827] hover:bg-[#eef5fc]"
                    }`}>
                    {department}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => changeDepartment(NON_TEACHING_VIEW)}
                  aria-current={viewingNonTeaching ? "page" : undefined}
                  className={`min-h-11 min-w-max border px-3 py-2.5 text-left text-sm transition-colors sm:text-base lg:w-full lg:border-x-0 lg:border-t-0 lg:px-3 lg:py-3 ${
                    viewingNonTeaching
                      ? "border-[#5599dc] bg-[#5599dc] text-white"
                      : "border-[#d5d5d5] text-[#111827] hover:bg-[#eef5fc]"
                  }`}>
                  {text.nonTeaching}
                </button>
                {!departments.length && (
                  <p className="hidden border-b border-[#d5d5d5] px-3 py-4 text-sm leading-6 text-[#64748b] lg:block">
                    {text.noDepartments}
                  </p>
                )}
              </nav>
            </aside>

            <section className="min-h-[360px] min-w-0 bg-white p-4 shadow-[0_2px_16px_rgba(0,0,0,0.12)] sm:p-5 lg:p-6">
              <div className="relative flex flex-col gap-4 border-b-2 border-[#d4d4d4] pb-3 after:absolute after:bottom-[-2px] after:left-0 after:h-[4px] after:w-20 after:bg-[#5599dc] sm:flex-row sm:items-center sm:justify-between">
                <h2 className="break-words text-2xl font-semibold text-black">
                  {viewingNonTeaching
                    ? text.nonTeaching
                    : selectedDepartment || text.directory}
                </h2>
                {categories.length > 0 && (
                  <label className="flex items-center gap-2 text-sm text-[#334155]">
                    <span>{text.category}</span>
                    <select
                      value={activeCategory}
                      onChange={(event) => setActiveCategory(event.target.value)}
                      className="min-h-10 max-w-[min(65vw,280px)] border border-[#d5d5d5] bg-white px-3 text-sm text-[#172033] sm:max-w-full">
                      <option value="">{text.allCategories}</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
              </div>

              {loading ? (
                <p className="py-12 text-center text-sm text-[#5b6472]">
                  {isHindi ? "संकाय विवरण लोड हो रहे हैं..." : "Loading faculty..."}
                </p>
              ) : loadError ? (
                <p role="alert" className="py-12 text-center text-sm text-[#9b1c1c]">
                  {text.loadError}
                </p>
              ) : !firebaseReady ? (
                <p className="py-12 text-center text-sm text-[#5b6472]">
                  {text.notConfigured}
                </p>
              ) : visibleFaculty.length ? (
                visibleFaculty.map((member) => (
                  <FacultyRecord key={member.id} member={member} text={text} />
                ))
              ) : (
                <p className="py-12 text-center text-sm text-[#5b6472]">
                  {text.noFaculty}
                </p>
              )}
            </section>
          </div>
        </Container>
      </main>
    </>
  );
}

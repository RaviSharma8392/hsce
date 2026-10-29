/**
 * Data for Homepage 3-Column Widget (Notices | Events | Important Links)
 * Perfectly aligned with the College Administration and Staff Console.
 */

export const fallbackWidgetNotices = [
  {
    id: "notice-mock-1",
    slug: "quotation-lift-epublishing-system",
    title: "Quotation for LIFT_ePublishing System, Government of India.pdf",
    category: "General Notice",
    publicationDate: "2026-10-08",
    publishedAt: "2026-10-08T09:30:00Z",
    type: "latest",
    pdfUrl: "#",
    isPublished: true,
    description:
      "Sealed quotations are invited for LIFT_ePublishing System for Government of India portal integration and administrative digitization.",
  },
  {
    id: "notice-mock-2",
    slug: "internal-complaints-committee-icc-election",
    title: "Internal Complaints Committee (ICC) Election (2026-27)",
    category: "General Notice",
    publicationDate: "2026-10-07",
    publishedAt: "2026-10-07T11:00:00Z",
    type: "latest",
    pdfUrl: "#",
    isPublished: true,
    description:
      "Notification regarding the constitution and student representation election for the Internal Complaints Committee (ICC) for the academic session 2026-27.",
  },
  {
    id: "notice-mock-3",
    slug: "icc-election-2026-code-of-conduct",
    title: "ICC Election 2026",
    category: "General Notice",
    publicationDate: "2026-09-29",
    publishedAt: "2026-09-29T10:15:00Z",
    type: "latest",
    pdfUrl: "#",
    isPublished: true,
    description:
      "Detailed guidelines, eligibility criteria, and timeline for student representatives in the ICC Election 2026.",
  },
  {
    id: "notice-mock-4",
    slug: "prevention-of-defacement-committee",
    title: "Prevention of Defacement of College Property Committee",
    category: "Circular",
    publicationDate: "2026-09-14",
    publishedAt: "2026-09-14T08:45:00Z",
    type: "latest",
    pdfUrl: "#",
    isPublished: true,
    description:
      "Order regarding constitution of vigilance committee for prevention of defacement of college property and campus cleanliness.",
  },
  {
    id: "notice-mock-5",
    slug: "bed-admission-counseling-guidance-2026",
    title: "B.Ed. Admission Counseling & Document Verification Guidelines (2026-27)",
    category: "Admission",
    publicationDate: "2026-09-10",
    publishedAt: "2026-09-10T14:00:00Z",
    type: "admission",
    pdfUrl: "#",
    isPublished: true,
    description:
      "Instructions for candidates allocated seats in B.Ed. programme under GGSIPU CET counseling.",
  },
  {
    id: "notice-mock-6",
    slug: "staff-development-curriculum-framework",
    title: "Faculty & Staff Development Programme on NEP 2020 Pedagogical Modules",
    category: "Recruitment",
    publicationDate: "2026-09-04",
    publishedAt: "2026-09-04T12:00:00Z",
    type: "latest",
    pdfUrl: "#",
    isPublished: true,
    description:
      "Official circular inviting faculty members and staff to participate in the National Education Policy teaching workshop.",
  },
];

export const fallbackEvents = {
  upcoming: [
    {
      id: "ev-up-1",
      title: "National Seminar on NEP 2020 & 21st Century Pedagogical Approaches",
      date: "2026-10-25",
      venue: "Multipurpose Seminar Hall",
      category: "Academic Seminar",
      description: "Expert panel discussions on constructive classroom teaching, blended learning tools, and multidisciplinary pedagogy.",
    },
    {
      id: "ev-up-2",
      title: "B.Ed. Pupil-Teacher Practice Teaching & School Induction Program",
      date: "2026-11-05",
      venue: "Associated Practice Schools, Delhi",
      category: "School Internship",
      description: "Orientation drill for secondary school internship, micro-lesson planning, and practical classroom delivery.",
    },
    {
      id: "ev-up-3",
      title: "Workshop on Educational Technology & Smart Classroom TLM Development",
      date: "2026-11-18",
      venue: "ICT & Computer Resource Centre",
      category: "Workshop",
      description: "Hands-on preparation of low-cost teaching learning materials (TLM) and digital multimedia presentation creation.",
    },
    {
      id: "ev-up-4",
      title: "Annual Sports Meet & Inter-House Athletic Championship 2026",
      date: "2026-12-10",
      venue: "College Campus Grounds",
      category: "Sports & Culture",
      description: "Track and field events, relay races, badminton championship, and prize distribution ceremony.",
    },
  ],
  past: [
    {
      id: "ev-1",
      title: "National Seminar on Innovative Pedagogies & NEP 2020 Framework",
      date: "2026-09-15",
      venue: "Multipurpose Seminar Hall",
      category: "Academic Seminar",
      description: "Symposium on modern classroom methodologies and experiential teacher education.",
    },
    {
      id: "ev-2",
      title: "Orientation Induction Programme for B.Ed. Pupil-Teachers",
      date: "2026-08-22",
      venue: "College Auditorium",
      category: "Orientation",
      description: "Welcoming address by Principal Dr. Savita Rathee and introduction to curriculum laboratories.",
    },
    {
      id: "ev-3",
      title: "International Yoga Day Celebration & Holistic Well-being Session",
      date: "2026-06-21",
      venue: "Campus Grounds",
      category: "Health & Wellness",
      description: "Interactive yoga practice session and mindfulness workshop for staff and students.",
    },
    {
      id: "ev-4",
      title: "Annual Athletic Meet & Inter-House Sports Championship",
      date: "2026-03-14",
      venue: "Sports Complex",
      category: "Sports",
      description: "Track and field events, relay races, and award ceremony for student-teachers.",
    },
  ],
};

export const importantLinksList = [
  {
    id: "link-1",
    title: "Surety Bond for Nomination for College Union Election",
    to: "/mandatory-disclosure",
    isExternal: false,
  },
  {
    id: "link-2",
    title: "SmartProf (Teaching and Student login)",
    to: "https://www.sggscc.ac.in/smartprof",
    isExternal: true,
  },
  {
    id: "link-3",
    title: "Internal and Continuous Assessment",
    to: "/course",
    isExternal: false,
  },
  {
    id: "link-4",
    title: "Online library",
    to: "/about/facilities",
    isExternal: false,
  },
  {
    id: "link-5",
    title: "Public Mandatory Disclosure (NCTE Compliance)",
    to: "/mandatory-disclosure",
    isExternal: false,
  },
  {
    id: "link-6",
    title: "GGSIPU Affiliation & University Portal",
    to: "http://www.ipu.ac.in/",
    isExternal: true,
  },
  {
    id: "link-7",
    title: "Internal Complaints Committee (ICC) & Anti-Ragging",
    to: "/committees",
    isExternal: false,
  },
];

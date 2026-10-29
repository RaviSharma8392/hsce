import { cloudinaryImageUrl, imageData } from "./imagesData.js";

export const siteUrl = "https://hscekanjhawala.com";
export const collegeName = "Haryana Shakti College of Education";

const campusImage = cloudinaryImageUrl(imageData.campusHero, 1400);
const chairmanImage = cloudinaryImageUrl(imageData.chairmanPortrait, 1400);
const principalImage = cloudinaryImageUrl(imageData.principalPortrait, 1400);

export const seoPages = [
  {
    path: "/",
    title: `Haryana Shakti College of Education | NCTE Approved B.Ed. in Delhi`,
    description:
      "Haryana Shakti College of Education (HSCE), Kanjhawala, Delhi offers NCTE-approved & GGSIPU-affiliated 2-year B.Ed. Apply for admissions, view fees & campus.",
    image: campusImage,
    imageAlt: "Haryana Shakti College of Education campus",
    breadcrumbs: [],
    pageType: "home",
  },
  {
    path: "/about",
    title: `About the College | Haryana Shakti College of Education (HSCE Delhi)`,
    description:
      "Learn about HSCE Kanjhawala, Delhi, established in 2012 by Haryana Shakti Education Society. NCTE approved & GGSIPU affiliated premier teacher education college.",
    image: campusImage,
    imageAlt: "Haryana Shakti College of Education campus",
    breadcrumbs: [{ name: "About the College" }],
  },
  {
    path: "/about/history",
    title: `History & Genesis | Haryana Shakti College of Education, Delhi`,
    description:
      "Trace the history and milestones of HSCE Kanjhawala since 2012, dedicated to quality teacher training and professional education across North-West Delhi.",
    image: campusImage,
    imageAlt: "Haryana Shakti College of Education campus",
    breadcrumbs: [
      { name: "About the College", path: "/about" },
      { name: "History & Genesis" },
    ],
  },
  {
    path: "/about/vision-mission",
    title: `Vision & Mission | Haryana Shakti College of Education, Delhi`,
    description:
      "Explore our vision and mission to nurture innovative, reflective educators committed to transformative teaching, constitutional values, and academic excellence.",
    image: campusImage,
    imageAlt: "Haryana Shakti College of Education campus",
    breadcrumbs: [
      { name: "About the College", path: "/about" },
      { name: "Vision & Mission" },
    ],
  },
  {
    path: "/about/chairman",
    title: `Chairman's Desk | Sh. Raj Singh Dabas | HSCE Delhi`,
    description:
      "Read the message from Sh. Raj Singh Dabas, Chairman of Haryana Shakti Education Society, on educational leadership, moral integrity, and teacher preparation.",
    image: chairmanImage,
    imageAlt: "Chairman of Haryana Shakti College of Education",
    breadcrumbs: [
      { name: "About the College", path: "/about" },
      { name: "Chairman's Desk" },
    ],
  },
  {
    path: "/about/principal",
    title: `Principal's Desk | Dr. Savita Rathee | HSCE Delhi`,
    description:
      "Read the message from Dr. Savita Rathee, Principal of Haryana Shakti College of Education, on academic excellence, pedagogical rigor, and student mentoring.",
    image: principalImage,
    imageAlt: "Principal of Haryana Shakti College of Education",
    breadcrumbs: [
      { name: "About the College", path: "/about" },
      { name: "Principal's Desk" },
    ],
  },
  {
    path: "/about/recognition",
    title: `NCTE Recognition & GGSIPU Affiliation | HSCE Delhi`,
    description:
      "Official regulatory recognition by NCTE (NRC) and academic affiliation to Guru Gobind Singh Indraprastha University (GGSIPU), Delhi for 2-year B.Ed. programme.",
    image: campusImage,
    imageAlt: "Haryana Shakti College of Education campus",
    breadcrumbs: [
      { name: "About the College", path: "/about" },
      { name: "Recognition & Affiliation" },
    ],
  },
  {
    path: "/about/facts",
    title: `Institutional Fact Sheet & Key Metrics | HSCE Delhi`,
    description:
      "Key institutional facts of HSCE Delhi: 100 sanctioned B.Ed. seats, NCTE approval, GGSIPU affiliation, address on Ghevra Road Kanjhawala, and official helplines.",
    image: campusImage,
    imageAlt: "Haryana Shakti College of Education campus",
    breadcrumbs: [
      { name: "About the College", path: "/about" },
      { name: "College Facts" },
    ],
  },
  {
    path: "/campus-life",
    title: `Campus Life & Facilities | Haryana Shakti College of Education`,
    description:
      "Explore campus life at HSCE Delhi: ICT lab, psychology and curriculum labs, academic library, multipurpose seminar hall, sports facilities, and cultural events.",
    image: campusImage,
    imageAlt: "Haryana Shakti College of Education campus",
    breadcrumbs: [{ name: "Campus Life" }],
  },
  {
    path: "/course",
    title: `Bachelor of Education (B.Ed.) Programme | 2 Years | HSCE Delhi`,
    description:
      "NCTE-approved 2-year regular Bachelor of Education (B.Ed.) affiliated to GGSIPU Delhi. Explore semester-wise curriculum, pedagogy subjects, and school practice.",
    image: campusImage,
    imageAlt: "Haryana Shakti College of Education campus",
    breadcrumbs: [{ name: "Bachelor of Education (B.Ed.)" }],
    pageType: "course",
  },
  {
    path: "/syllabus",
    title: `B.Ed. Syllabus & Curriculum PDF | HSCE Delhi`,
    description:
      "Download official B.Ed. syllabus PDFs for 2026-27 and earlier sessions. View complete 4-semester curriculum structure, credits, practicals, and subject details.",
    image: campusImage,
    imageAlt: "Haryana Shakti College of Education campus",
    breadcrumbs: [
      { name: "B.Ed. Course", path: "/course" },
      { name: "B.Ed. Syllabus" },
    ],
  },
  {
    path: "/faculty",
    title: `Faculty & Academic Staff Directory | HSCE Delhi`,
    description:
      "Meet qualified teacher educators at HSCE Delhi, led by Principal Dr. Savita Rathee. Explore faculty qualifications, pedagogy specializations, and staff profiles.",
    image: campusImage,
    imageAlt: "Haryana Shakti College of Education campus",
    breadcrumbs: [
      { name: "Academics", path: "/course" },
      { name: "Faculty" },
    ],
  },
  {
    path: "/admissions",
    title: `B.Ed. Admissions 2026-27 | Haryana Shakti College of Education`,
    description:
      "Apply for 2-Year regular B.Ed. admissions 2026-27 at HSCE Delhi. Explore GGSIPU counselling steps, eligibility criteria, document checklist, and fee helpline.",
    image: campusImage,
    imageAlt: "Haryana Shakti College of Education campus",
    breadcrumbs: [{ name: "B.Ed. Admissions" }],
  },
  {
    path: "/admissions/eligibility",
    title: `B.Ed. Eligibility Criteria & Qualifying Marks | HSCE Delhi`,
    description:
      "Review B.Ed. admission eligibility criteria at HSCE Delhi: 50% in Bachelor or Master degrees, 55% for B.Tech/B.E., 45% for SC/ST/PwD, and pedagogy requirements.",
    image: campusImage,
    imageAlt: "Haryana Shakti College of Education campus",
    breadcrumbs: [
      { name: "Admissions", path: "/admissions" },
      { name: "B.Ed. Eligibility Criteria" },
    ],
    faqs: [
      {
        question: "What is the minimum percentage required for B.Ed. admission at HSCE Delhi?",
        answer: "Candidates need at least 50% marks in aggregate in Bachelor's or Master's degree in Sciences, Social Sciences, or Humanities. Candidates with B.Tech. or B.E. degrees require a minimum of 55% marks with Science and Mathematics specialization. A 5% relaxation (minimum 45%) is applicable for SC, ST, and PwD candidates.",
      },
      {
        question: "Is Haryana Shakti College of Education recognized by NCTE and affiliated to GGSIPU?",
        answer: "Yes, Haryana Shakti College of Education is approved and recognized by the National Council for Teacher Education (NCTE - Northern Regional Committee) and is affiliated to Guru Gobind Singh Indraprastha University (GGSIPU), Dwarka, Delhi.",
      },
      {
        question: "What is the sanctioned annual seat intake for the B.Ed. programme?",
        answer: "The college has a sanctioned annual intake of 100 seats for the 2-Year regular Bachelor of Education (B.Ed.) programme.",
      },
    ],
  },
  {
    path: "/admissions/procedure",
    title: `B.Ed. Admission Procedure & Counselling Steps | HSCE Delhi`,
    description:
      "Step-by-step guide to B.Ed. admissions at HSCE Delhi: GGSIPU online portal registration, choice filling, CET counselling, seat allotment, and campus reporting.",
    image: campusImage,
    imageAlt: "Haryana Shakti College of Education campus",
    breadcrumbs: [
      { name: "Admissions", path: "/admissions" },
      { name: "Admission Procedure" },
    ],
    faqs: [
      {
        question: "How are admissions conducted for B.Ed. at Haryana Shakti College of Education?",
        answer: "Admissions are conducted through centralized online counselling by Guru Gobind Singh Indraprastha University (GGSIPU), Delhi based on merit in the university Common Entrance Test (GGSIPU CET) or National Common Entrance Test.",
      },
      {
        question: "What is the physical document verification procedure at HSCE Delhi?",
        answer: "Allotted candidates must report to the campus with original marksheets (10th, 12th, graduation/postgraduation), GGSIPU allotment letter, fee receipt, category certificate (if applicable), and 2 sets of self-attested photocopies.",
      },
    ],
  },
  {
    path: "/admissions/documents",
    title: `B.Ed. Admission Documents Checklist | HSCE Delhi`,
    description:
      "Official checklist of original documents and self-attested photocopies required for B.Ed. physical verification and seat confirmation at HSCE Kanjhawala, Delhi.",
    image: campusImage,
    imageAlt: "Haryana Shakti College of Education campus",
    breadcrumbs: [
      { name: "Admissions", path: "/admissions" },
      { name: "Required Documents" },
    ],
  },
  {
    path: "/notices",
    title: `Official Notices & Academic Circulars | HSCE Delhi`,
    description:
      "Stay updated with official academic circulars, GGSIPU examination notifications, admission schedules, fee reminders, and college announcements from HSCE Delhi.",
    image: campusImage,
    imageAlt: "Haryana Shakti College of Education campus",
    breadcrumbs: [{ name: "Notices & Announcements" }],
  },
  {
    path: "/mandatory-disclosure",
    title: `Mandatory Regulatory Disclosures & NCTE Orders | HSCE Delhi`,
    description:
      "Access statutory public disclosures of HSCE Delhi pursuant to NCTE norms: formal recognition orders, GGSIPU affiliation letters, faculty list, and intake norms.",
    image: campusImage,
    imageAlt: "Haryana Shakti College of Education campus",
    breadcrumbs: [{ name: "Mandatory Disclosure" }],
  },
  {
    path: "/gallery",
    title: `Photo Gallery & Campus Moments | HSCE Delhi`,
    description:
      "Browse campus photos of Haryana Shakti College of Education: smart classrooms, ICT and psychology labs, campus sports, cultural festivals, and community camps.",
    image: campusImage,
    imageAlt: "Haryana Shakti College of Education campus",
    breadcrumbs: [{ name: "Photo Gallery" }],
  },
  {
    path: "/committees",
    title: `Institutional Committees & Grievance Redressal | HSCE Delhi`,
    description:
      "Details of HSCE Delhi statutory bodies: Student Grievance Redressal Committee, Anti-Ragging Squad, Internal Complaints Committee (ICC), and grievance redressal.",
    image: campusImage,
    imageAlt: "Haryana Shakti College of Education campus",
    breadcrumbs: [{ name: "Committees & Grievance Redressal" }],
  },
  {
    path: "/book-a-tour",
    title: `Book a Campus Visit & Guided Tour | HSCE Delhi`,
    description:
      "Schedule a guided campus tour of HSCE in Kanjhawala, Delhi. Visit our curriculum labs, library, and meet faculty advisors for B.Ed. admission guidance.",
    image: campusImage,
    imageAlt: "Haryana Shakti College of Education campus",
    breadcrumbs: [
      { name: "Admissions", path: "/admissions" },
      { name: "Book a Campus Tour" },
    ],
  },
  {
    path: "/contact",
    title: `Contact Us & Campus Directions | Kanjhawala, Delhi | HSCE`,
    description:
      "Contact HSCE, Ghevra Road, Kanjhawala, Delhi - 110081 (Near Ghevra Metro). Helplines: 9953155054, 8056777077. Official email, map directions, and office hours.",
    image: campusImage,
    imageAlt: "Haryana Shakti College of Education campus",
    breadcrumbs: [{ name: "Contact Us" }],
  },
  {
    path: "/contact/enquiry",
    title: `Admission Enquiry & Feedback Form | HSCE Delhi`,
    description:
      "Submit an online enquiry or feedback to HSCE Delhi. Get prompt guidance on B.Ed. course structure, GGSIPU counselling, seat intake, and campus facilities.",
    image: campusImage,
    imageAlt: "Haryana Shakti College of Education campus",
    breadcrumbs: [
      { name: "Contact", path: "/contact" },
      { name: "Enquiry" },
    ],
  },
  {
    path: "/privacy",
    title: `Privacy Policy & Data Protection | HSCE Delhi`,
    description:
      "Read the official privacy policy of Haryana Shakti College of Education regarding website data collection, form submissions, security, and user rights.",
    image: campusImage,
    imageAlt: "Haryana Shakti College of Education campus",
    breadcrumbs: [{ name: "Privacy Policy" }],
  },
  {
    path: "/search",
    title: `Search Academic & Admission Information | HSCE Delhi`,
    description:
      "Search across Haryana Shakti College of Education courses, admissions, eligibility criteria, syllabus, faculty directory, circulars, and campus facilities.",
    image: campusImage,
    imageAlt: "Haryana Shakti College of Education campus",
    breadcrumbs: [{ name: "Search" }],
    indexable: false,
  },
];

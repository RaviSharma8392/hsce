import { cloudinaryImageUrl, imageData } from "./imagesData.js";

export const siteUrl = "https://hscekanjhawala.com";
export const collegeName = "Haryana Shakti College of Education";

const campusImage = cloudinaryImageUrl(imageData.campusHero, 1400);
const chairmanImage = cloudinaryImageUrl(imageData.chairmanPortrait, 1400);
const principalImage = cloudinaryImageUrl(imageData.principalPortrait, 1400);

export const seoPages = [
  {
    path: "/",
    title: `Haryana Shakti College of Education, Kanjhawala, Delhi`,
    description:
      "Official site of Haryana Shakti College of Education (HSCE), Kanjhawala, Delhi. Explore the B.Ed. programme, GGSIPU admissions, NCTE recognition, academics and campus.",
    image: campusImage,
    imageAlt: "Haryana Shakti College of Education campus",
    breadcrumbs: [],
    pageType: "home",
    faqs: [
      {
        question:
          "Is Haryana Shakti College of Education recognized by NCTE and affiliated to GGSIPU?",
        answer:
          "Yes, Haryana Shakti College of Education (HSCE), Kanjhawala is recognized by the National Council for Teacher Education (NCTE) Northern Regional Committee and affiliated to Guru Gobind Singh Indraprastha University (GGSIPU), Delhi (College Code: 147). Current approval orders and regulatory affidavits are publicly displayed in our Mandatory Disclosures section.",
      },
      {
        question:
          "What is the minimum eligibility criteria for the 2-Year Regular B.Ed. programme?",
        answer:
          "Candidates need a Bachelor's Degree and/or Master's Degree with at least 50% marks in aggregate (45% for SC/ST/PwD candidates) from a recognized university. Admissions are processed through centralized GGSIPU CET / CUET counseling.",
      },
      {
        question:
          "Is the medium of instruction and examination available in both Hindi and English?",
        answer:
          "Yes, instruction is bilingual (English and Hindi). Students are permitted to write assignments, lesson plans, and university term examinations in either English or Hindi according to their preference.",
      },
      {
        question:
          "Is the school internship compulsory and where is it conducted?",
        answer:
          "Yes, as per NCTE and university norms, pupil-teachers undergo mandatory practical school teaching internship across Delhi Directorate of Education government and recognized secondary schools.",
      },
      {
        question:
          "Does the college provide coaching and guidance for CTET and teacher recruitment exams?",
        answer:
          "Yes, our experienced faculty conduct specialized CTET workshops, mock problem sessions, and recruitment orientation drills alongside the standard B.Ed curriculum.",
      },
    ],
  },
  {
    path: "/about",
    title: `About Haryana Shakti College of Education`,
    description:
      "Learn about Haryana Shakti College of Education in Kanjhawala, Delhi: its history, leadership, teacher education programme, NCTE recognition and GGSIPU affiliation.",
    image: campusImage,
    imageAlt: "Haryana Shakti College of Education campus",
    breadcrumbs: [{ name: "About the College" }],
  },
  {
    path: "/about/history",
    title: `History & Genesis | HSCE Delhi`,
    description:
      "Read about the establishment and development of Haryana Shakti College of Education, a teacher education institution in Kanjhawala, Delhi.",
    image: campusImage,
    imageAlt: "Haryana Shakti College of Education campus",
    breadcrumbs: [
      { name: "About the College", path: "/about" },
      { name: "History & Genesis" },
    ],
  },
  {
    path: "/about/vision-mission",
    title: `Vision & Mission | HSCE Delhi`,
    description:
      "Read the college's vision and mission for preparing competent, ethical and professionally skilled teachers through reflective and innovative teaching practice.",
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
    path: "/about/manager",
    title: `Manager's Desk | Prof. Ajit Singh Dabas | HSCE Delhi`,
    description:
      "Read the message from Prof. Ajit Singh Dabas, Manager of Haryana Shakti College of Education, on quality education, student growth, and institutional commitment.",
    image: "/assets/people/prof-ajit-singh-dabas.png",
    imageAlt: "Prof. Ajit Singh Dabas, Manager of Haryana Shakti College of Education",
    breadcrumbs: [
      { name: "About the College", path: "/about" },
      { name: "Manager's Desk" },
    ],
  },
  {
    path: "/about/recognition",
    title: `NCTE Recognition & GGSIPU Affiliation | HSCE Delhi`,
    description:
      "Find information about Haryana Shakti College of Education's NCTE recognition and GGSIPU affiliation for its two-year Bachelor of Education (B.Ed.) programme.",
    image: campusImage,
    imageAlt: "Haryana Shakti College of Education campus",
    breadcrumbs: [
      { name: "About the College", path: "/about" },
      { name: "Recognition & Affiliation" },
    ],
  },
  {
    path: "/about/facts",
    title: `Institutional Facts & Metrics | HSCE Delhi`,
    description:
      "Verified institutional information for Haryana Shakti College of Education, including its Kanjhawala, Delhi location, B.Ed. programme, recognition and affiliation.",
    image: campusImage,
    imageAlt: "Haryana Shakti College of Education campus",
    breadcrumbs: [
      { name: "About the College", path: "/about" },
      { name: "College Facts" },
    ],
  },
  {
    path: "/gallery",
    title: `Photo Gallery | HSCE`,
    description:
      "Explore the learning spaces and student activities at Haryana Shakti College of Education in Kanjhawala, Delhi, including academic facilities and campus resources.",
    image: campusImage,
    imageAlt: "Haryana Shakti College of Education campus",
    breadcrumbs: [{ name: "Photo Gallery" }],
  },
  {
    path: "/course",
    title: `B.Ed. Programme | HSCE Delhi`,
    description:
      "Learn about the two-year Bachelor of Education (B.Ed.) programme at Haryana Shakti College of Education, affiliated with GGSIPU and recognised by NCTE.",
    image: campusImage,
    imageAlt: "Haryana Shakti College of Education campus",
    breadcrumbs: [{ name: "Bachelor of Education (B.Ed.)" }],
    pageType: "course",
  },
  {
    path: "/syllabus",
    title: `B.Ed. Syllabus & Curriculum PDF | HSCE Delhi`,
    description:
      "View B.Ed. syllabus and curriculum information published by Haryana Shakti College of Education, including available semester and session documents.",
    image: campusImage,
    imageAlt: "Haryana Shakti College of Education campus",
    breadcrumbs: [
      { name: "B.Ed. Course", path: "/course" },
      { name: "B.Ed. Syllabus" },
    ],
  },
  {
    path: "/faculty",
    title: `Faculty & Academics | Haryana Shakti College of Education`,
    description:
      "Find faculty and academic staff information for Haryana Shakti College of Education in Kanjhawala, Delhi, including the college's academic leadership.",
    image: campusImage,
    imageAlt: "Haryana Shakti College of Education campus",
    breadcrumbs: [
      { name: "Academics", path: "/course" },
      { name: "Faculty" },
    ],
  },
  {
    path: "/admissions",
    title: `B.Ed. Admissions | Haryana Shakti College of Education`,
    description:
      "B.Ed. admissions at HSCE, Kanjhawala, Delhi: GGSIPU counselling, eligibility, documents and official college contact information.",
    image: campusImage,
    imageAlt: "Haryana Shakti College of Education campus",
    breadcrumbs: [{ name: "B.Ed. Admissions" }],
  },
  {
    path: "/admissions/eligibility",
    title: `B.Ed. Eligibility Criteria | HSCE Delhi`,
    description:
      "Check B.Ed. eligibility at HSCE. Confirm qualifying marks, subject rules and applicable relaxations in the current GGSIPU admission brochure.",
    image: campusImage,
    imageAlt: "Haryana Shakti College of Education campus",
    breadcrumbs: [
      { name: "Admissions", path: "/admissions" },
      { name: "B.Ed. Eligibility Criteria" },
    ],
    faqs: [
      {
        question: "What is the minimum percentage required for B.Ed. admission at HSCE Delhi?",
        answer: "Eligibility depends on the qualifying degree, subject background and the rules for the applicable admission session. Candidates should check the current GGSIPU admission brochure and counselling notices before applying.",
      },
      {
        question: "Is Haryana Shakti College of Education recognized by NCTE and affiliated to GGSIPU?",
        answer: "Yes, Haryana Shakti College of Education is approved and recognized by the National Council for Teacher Education (NCTE - Northern Regional Committee) and is affiliated to Guru Gobind Singh Indraprastha University (GGSIPU), Dwarka, Delhi.",
      },
    ],
  },
  {
    path: "/admissions/procedure",
    title: `B.Ed. Admission Procedure | HSCE`,
    description:
      "Understand B.Ed. admission steps at HSCE, including the applicable GGSIPU application, counselling, seat allotment and reporting process.",
    image: campusImage,
    imageAlt: "Haryana Shakti College of Education campus",
    breadcrumbs: [
      { name: "Admissions", path: "/admissions" },
      { name: "Admission Procedure" },
    ],
    faqs: [
      {
        question: "How are admissions conducted for B.Ed. at Haryana Shakti College of Education?",
        answer: "The process follows the applicable GGSIPU admission brochure and counselling notices. Check the current session's instructions for the entrance test, registration, counselling and seat allotment route.",
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
      "Review the B.Ed. admission document checklist for HSCE, Kanjhawala. Follow the current GGSIPU allotment and verification instructions.",
    image: campusImage,
    imageAlt: "Haryana Shakti College of Education campus",
    breadcrumbs: [
      { name: "Admissions", path: "/admissions" },
      { name: "Required Documents" },
    ],
  },
  {
    path: "/notices",
    title: `College Notices & Academic Updates | HSCE`,
    description:
      "Stay updated with official academic circulars, GGSIPU examination notifications, admission schedules, fee reminders, and college announcements from HSCE Delhi.",
    image: campusImage,
    imageAlt: "Haryana Shakti College of Education campus",
    breadcrumbs: [{ name: "Notices & Announcements" }],
  },
  {
    path: "/mandatory-disclosure",
    title: `NCTE Mandatory Disclosure | HSCE Delhi`,
    description:
      "Access statutory public disclosures of HSCE Delhi pursuant to NCTE norms: formal recognition orders, GGSIPU affiliation letters, faculty list, and intake norms.",
    image: campusImage,
    imageAlt: "Haryana Shakti College of Education campus",
    breadcrumbs: [{ name: "Mandatory Disclosure" }],
  },
  {
    path: "/committees",
    title: `Student Grievance & Complaint Lodging | HSCE Delhi`,
    description:
      "Submit an academic, administrative, or campus grievance securely at Haryana Shakti College of Education, Kanjhawala, Delhi.",
    image: campusImage,
    imageAlt: "Haryana Shakti College of Education campus",
    breadcrumbs: [{ name: "Student Grievance & Complaint Lodging" }],
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
    title: `Contact Haryana Shakti College of Education | Kanjhawala Delhi`,
    description:
      "Contact HSCE in Kanjhawala, Delhi 110081, for B.Ed. admissions and college information. Find the official phone number, email and directions.",
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
    path: "/website-developer",
    title: `Website Developer in Uttarakhand | Ravi Sharma (RSDEV)`,
    description:
      "Ravi Sharma (RSDEV) is a website developer based in Nainital and Bhimtal, Uttarakhand, working on education, business, and eCommerce websites.",
    image: campusImage,
    imageAlt: "Haryana Shakti College of Education official website",
    breadcrumbs: [{ name: "Website Developer" }],
    pageType: "developer",
    faqs: [
      {
        question: "Who developed the Haryana Shakti College website?",
        answer:
          "Ravi Sharma (RSDEV) is credited with designing, developing, and managing the official Haryana Shakti College of Education website.",
      },
      {
        question: "How can I contact Ravi Sharma about a website project?",
        answer:
          "Call or WhatsApp +91 83928 56993, email ravisharmabhimtal@gmail.com, or message @raviiiiii._0 on Instagram.",
      },
      {
        question: "What types of websites does Ravi Sharma develop?",
        answer:
          "Ravi Sharma develops websites for educational institutions, businesses, and online stores, along with React and Firebase web applications and admin panels.",
      },
    ],
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

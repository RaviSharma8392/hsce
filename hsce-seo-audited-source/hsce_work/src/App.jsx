import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
const AboutPage = lazy(() => import("./pages/AboutPage"));
const AboutHistoryPage = lazy(() => import("./pages/AboutHistoryPage"));
const AboutVisionMissionPage = lazy(
  () => import("./pages/AboutVisionMissionPage"),
);
const AboutChairmanPage = lazy(() => import("./pages/AboutChairmanPage"));
const AboutPrincipalPage = lazy(() => import("./pages/AboutPrincipalPage"));
const AboutRecognitionPage = lazy(() => import("./pages/AboutRecognitionPage"));
const CampusLifePage = lazy(() => import("./pages/CampusLifePage"));
const AboutFactsPage = lazy(() => import("./pages/AboutFactsPage"));
const GalleryPage = lazy(() => import("./pages/GalleryPage"));
const AdmissionsPage = lazy(() => import("./pages/AdmissionsPage"));
const AdmissionEligibilityPage = lazy(
  () => import("./pages/AdmissionEligibilityPage"),
);
const AdmissionProcedurePage = lazy(
  () => import("./pages/AdmissionProcedurePage"),
);
const AdmissionDocumentsPage = lazy(
  () => import("./pages/AdmissionDocumentsPage"),
);
const CommitteesPage = lazy(() => import("./pages/CommitteesPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const CoursePage = lazy(() => import("./pages/CoursePage"));
const FacultyPage = lazy(() => import("./pages/FacultyPage"));
import HomePage from "./pages/HomePage";
import Layout from "../../../user/src/components/layout/Layout";
const MandatoryDisclosurePage = lazy(
  () => import("./pages/MandatoryDisclosurePage"),
);
const NoticesPage = lazy(() => import("./pages/NoticesPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const BookATourPage = lazy(() => import("./pages/BookATourPage"));
const SyllabusPage = lazy(() => import("./pages/SyllabusPage"));
const EnquiryPage = lazy(() => import("./pages/EnquiryPage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));

function App() {
  return (
    <Layout>
      <Suspense
        fallback={
          <div
            className="flex min-h-[40vh] items-center justify-center text-sm text-gray-600"
            role="status">
            Loading page...
          </div>
        }>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />

          {/* Dedicated About Pages & Section Redirects */}
          <Route path="/about" element={<AboutPage />} />
          <Route
            path="/about/campus-life"
            element={<Navigate to="/campus-life" replace />}
          />
          <Route
            path="/about/overview"
            element={<Navigate to="/about" replace />}
          />
          <Route path="/about/history" element={<AboutHistoryPage />} />
          <Route
            path="/about/history-genesis"
            element={<Navigate to="/about/history" replace />}
          />
          <Route
            path="/about/vision-mission"
            element={<AboutVisionMissionPage />}
          />
          <Route
            path="/about/vision"
            element={<Navigate to="/about/vision-mission" replace />}
          />
          <Route
            path="/about/mission"
            element={<Navigate to="/about/vision-mission" replace />}
          />
          <Route path="/about/chairman" element={<AboutChairmanPage />} />
          <Route
            path="/about/chairman-desk"
            element={<Navigate to="/about/chairman" replace />}
          />
          <Route
            path="/about/chairman-message"
            element={<Navigate to="/about/chairman" replace />}
          />
          <Route path="/about/principal" element={<AboutPrincipalPage />} />
          <Route
            path="/about/principal-desk"
            element={<Navigate to="/about/principal" replace />}
          />
          <Route path="/about/recognition" element={<AboutRecognitionPage />} />
          <Route
            path="/about/recognition-affiliation"
            element={<Navigate to="/about/recognition" replace />}
          />
          <Route
            path="/about/affiliation"
            element={<Navigate to="/about/recognition" replace />}
          />
          <Route path="/campus-life" element={<CampusLifePage />} />
          <Route path="/about/facilities" element={<CampusLifePage />} />
          <Route
            path="/about/campus"
            element={<Navigate to="/campus-life" replace />}
          />
          <Route
            path="/about/campus-labs"
            element={<Navigate to="/campus-life" replace />}
          />
          <Route path="/about/facts" element={<AboutFactsPage />} />
          <Route
            path="/about/fact-sheet"
            element={<Navigate to="/about/facts" replace />}
          />

          {/* Academics & Courses */}
          <Route path="/course" element={<CoursePage />} />
          <Route path="/course/bed" element={<CoursePage />} />
          <Route path="/course/syllabus" element={<SyllabusPage />} />
          <Route path="/bed" element={<Navigate to="/course" replace />} />
          <Route path="/syllabus" element={<SyllabusPage />} />
          <Route
            path="/curriculum"
            element={<Navigate to="/syllabus" replace />}
          />
          <Route path="/calendar" element={<Navigate to="/course" replace />} />
          <Route path="/faculty" element={<FacultyPage />} />
          <Route
            path="/faculty-staff"
            element={<Navigate to="/faculty" replace />}
          />

          {/* Admissions */}
          <Route path="/admissions" element={<AdmissionsPage />} />
          <Route path="/admissions/overview" element={<AdmissionsPage />} />
          <Route path="/admission" element={<AdmissionsPage />} />
          <Route path="/admission/overview" element={<AdmissionsPage />} />
          <Route
            path="/admissions/eligibility"
            element={<AdmissionEligibilityPage />}
          />
          <Route
            path="/admission/eligibility"
            element={<AdmissionEligibilityPage />}
          />
          <Route
            path="/admissions/procedure"
            element={<AdmissionProcedurePage />}
          />
          <Route
            path="/admission/procedure"
            element={<AdmissionProcedurePage />}
          />
          <Route
            path="/admissions/documents"
            element={<AdmissionDocumentsPage />}
          />
          <Route
            path="/admission/documents"
            element={<AdmissionDocumentsPage />}
          />

          {/* Notices */}
          <Route path="/notices" element={<NoticesPage />} />
          <Route path="/notice" element={<Navigate to="/notices" replace />} />
          <Route
            path="/notices/:slug"
            element={<Navigate to="/notices" replace />}
          />

          {/* Disclosures & Activities */}
          <Route
            path="/mandatory-disclosure"
            element={<MandatoryDisclosurePage />}
          />
          <Route
            path="/iqac"
            element={<Navigate to="/mandatory-disclosure" replace />}
          />
          <Route
            path="/disclosure"
            element={<Navigate to="/mandatory-disclosure" replace />}
          />
          <Route
            path="/disclosures"
            element={<Navigate to="/mandatory-disclosure" replace />}
          />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route
            path="/activities"
            element={<Navigate to="/gallery" replace />}
          />
          <Route path="/events" element={<Navigate to="/gallery" replace />} />
          <Route path="/photos" element={<Navigate to="/gallery" replace />} />
          <Route path="/committees" element={<CommitteesPage />} />
          <Route
            path="/committees/overview"
            element={<Navigate to="/committees" replace />}
          />
          <Route
            path="/committees/academic"
            element={<Navigate to="/committees" replace />}
          />
          <Route
            path="/committees/grievance"
            element={<Navigate to="/committees" replace />}
          />
          <Route
            path="/committees/anti-ragging"
            element={<Navigate to="/committees" replace />}
          />

          {/* Book a Campus Tour */}
          <Route path="/book-a-tour" element={<BookATourPage />} />
          <Route
            path="/tour"
            element={<Navigate to="/book-a-tour" replace />}
          />
          <Route
            path="/campus-tour"
            element={<Navigate to="/book-a-tour" replace />}
          />
          <Route
            path="/visit"
            element={<Navigate to="/book-a-tour" replace />}
          />

          {/* Contact & Legal */}
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/contact/enquiry" element={<EnquiryPage />} />
          <Route
            path="/enquiry"
            element={<Navigate to="/contact/enquiry" replace />}
          />
          <Route
            path="/enquiries"
            element={<Navigate to="/contact/enquiry" replace />}
          />
          <Route
            path="/admission-enquiry"
            element={<Navigate to="/contact/enquiry" replace />}
          />
          <Route
            path="/contact-us"
            element={<Navigate to="/contact" replace />}
          />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route
            path="/privacy-policy"
            element={<Navigate to="/privacy" replace />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;

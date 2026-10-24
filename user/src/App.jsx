import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import AboutPage from "./pages/AboutPage";
import AboutHistoryPage from "./pages/AboutHistoryPage";
import AboutVisionMissionPage from "./pages/AboutVisionMissionPage";
import AboutChairmanPage from "./pages/AboutChairmanPage";
import AboutPrincipalPage from "./pages/AboutPrincipalPage";
import AboutRecognitionPage from "./pages/AboutRecognitionPage";
import CampusLifePage from "./pages/CampusLifePage";
import AboutFactsPage from "./pages/AboutFactsPage";
import GalleryPage from "./pages/GalleryPage";
import AdmissionsPage from "./pages/AdmissionsPage";
import AdmissionEligibilityPage from "./pages/AdmissionEligibilityPage";
import AdmissionProcedurePage from "./pages/AdmissionProcedurePage";
import AdmissionDocumentsPage from "./pages/AdmissionDocumentsPage";
import CommitteesPage from "./pages/CommitteesPage";
import ContactPage from "./pages/ContactPage";
import CoursePage from "./pages/CoursePage";
import FacultyPage from "./pages/FacultyPage";
import HomePage from "./pages/HomePage";
import MandatoryDisclosurePage from "./pages/MandatoryDisclosurePage";
import NoticesPage from "./pages/NoticesPage";
import NotFoundPage from "./pages/NotFoundPage";
import PrivacyPage from "./pages/PrivacyPage";
import BookATourPage from "./pages/BookATourPage";
import SyllabusPage from "./pages/SyllabusPage";
import EnquiryPage from "./pages/EnquiryPage";
import SearchPage from "./pages/SearchPage";

function App() {
  return (
    <Layout>
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
        <Route path="/tour" element={<Navigate to="/book-a-tour" replace />} />
        <Route
          path="/campus-tour"
          element={<Navigate to="/book-a-tour" replace />}
        />
        <Route path="/visit" element={<Navigate to="/book-a-tour" replace />} />

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
    </Layout>
  );
}

export default App;

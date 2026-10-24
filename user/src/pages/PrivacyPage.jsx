import { Helmet } from "react-helmet-async";
import { Container } from "../components/common/Container";
import { PageHeaderBanner } from "../components/common/PageHeaderBanner";
import { PageNavigationLinks } from "../components/common/PageNavigationLinks";
import { useLanguage } from "../context/LanguageContext";

export default function PrivacyPage() {
  const { isHindi } = useLanguage();

  return (
    <>
      <Helmet>
        <title>
          {isHindi
            ? "गोपनीयता नीति | हरियाणा शक्ति कॉलेज ऑफ एजुकेशन"
            : "Privacy Policy | Haryana Shakti College of Education"}
        </title>
        <meta
          name="description"
          content={
            isHindi
              ? "हरियाणा शक्ति कॉलेज ऑफ एजुकेशन वेबसाइट की गोपनीयता नीति।"
              : "Privacy policy for Haryana Shakti College of Education website."
          }
        />
      </Helmet>
      <PageHeaderBanner
        title={isHindi ? "गोपनीयता नीति" : "Privacy Policy"}
        subtitle={
          isHindi
            ? "संस्थागत डेटा सुरक्षा एवं उपयोगकर्ता गोपनीयता दिशानिर्देश"
            : "Institutional Data Protection & User Privacy Guidelines."
        }
        breadcrumbs={[{ label: isHindi ? "गोपनीयता नीति" : "Privacy Policy" }]}
      />
      <Container className="py-10">
        <div className="section-card text-[#555555] leading-relaxed space-y-4">
          <p>
            {isHindi
              ? "यह वेबसाइट सार्वजनिक संस्थागत सूचनाओं, पाठ्यक्रमों और आधिकारिक परिपत्रों को साझा करने के लिए प्रयुक्त होती है। हम केवल वही सूचनाएं एकत्र करते हैं जो संस्थागत संचार या वेबसाइट प्रबंधन हेतु आवश्यक हैं। हम इस सार्वजनिक पोर्टल पर कोई भी संवेदनशील व्यक्तिगत जानकारी प्रकाशित नहीं करते।"
              : "This website is used to share public institutional information and official notices. We only collect information that is required for legitimate institutional communication or website administration. We do not publish sensitive or private user information on this public website."}
          </p>
          <p>
            {isHindi
              ? "वेबसाइट पर उपलब्ध सभी संपर्क फॉर्म और पूछताछ प्रक्रियाएं सुरक्षा एवं प्रामाणिकता के मानकों के अनुरूप संचालित होती हैं। गोपनीय या व्यक्तिगत शैक्षणिक मामलों के लिए छात्र सीधे कॉलेज कार्यालय से संपर्क कर सकते हैं।"
              : "Any forms or contact processes are managed according to security, validation, and lawful communication guidelines. Users are encouraged to contact the institution directly for confidential matters."}
          </p>
        </div>

        {/* Inter-linking Component */}
        <PageNavigationLinks
          previousPage={{
            title: "Mandatory Disclosures",
            hiTitle: "अनिवार्य प्रकटीकरण",
            to: "/mandatory-disclosure",
          }}
          nextPage={{
            title: "Contact Campus Office",
            hiTitle: "कॉलेज कार्यालय संपर्क",
            to: "/contact",
          }}
          relatedLinks={[
            {
              title: "About the College",
              hiTitle: "कॉलेज परिचय",
              description:
                "Legacy, NCTE approval, GGSIPU affiliation, and vision.",
              hiDescription:
                "संस्थागत इतिहास, एनसीटीई मान्यता, संबद्धता एवं विजन।",
              to: "/about",
              iconKey: "about",
            },
            {
              title: "B.Ed. Admissions 2026-27",
              hiTitle: "बी.एड. प्रवेश 2026-27",
              description:
                "Detailed eligibility criteria, counselling, and document checklist.",
              hiDescription:
                "पात्रता मापदंड, काउंसलिंग चरण एवं दस्तावेज़ सत्यापन चेकलिस्ट।",
              to: "/admissions",
              iconKey: "admissions",
            },
          ]}
        />
      </Container>
    </>
  );
}

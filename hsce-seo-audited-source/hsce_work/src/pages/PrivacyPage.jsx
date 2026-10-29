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
            ? "हरियाणा शक्ति कॉलेज ऑफ एजुकेशन वेबसाइट के फॉर्म में दी गई जानकारी, उसके उपयोग और Firebase सेवाओं के बारे में जानें।"
            : "Learn what information may be submitted through Haryana Shakti College of Education website forms, how it is used, and which Firebase services are used."
          }
        />
      </Helmet>
      <PageHeaderBanner
        title={isHindi ? "गोपनीयता नीति" : "Privacy Policy"}
        subtitle={
          isHindi
            ? "वेबसाइट फॉर्म, जानकारी के उपयोग और विश्लेषिकी के बारे में जानकारी"
            : "Information about website forms, data use and analytics"
        }
        breadcrumbs={[{ label: isHindi ? "गोपनीयता नीति" : "Privacy Policy" }]}
      />
      <Container className="py-10">
        <div className="section-card space-y-6 text-[#555555] leading-relaxed">
          <section>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              {isHindi
                ? "कौन-सी जानकारी ली जा सकती है"
                : "Information you may provide"}
            </h2>
            <p>
              {isHindi
                ? "संपर्क, पूछताछ और चैटबॉट फॉर्म में नाम, फोन नंबर, ईमेल और संदेश मांगे जा सकते हैं। कैंपस भ्रमण अनुरोध में उम्मीदवार या अभिभावक के संपर्क विवरण, शहर, शैक्षणिक जानकारी, पसंदीदा तिथि/समय और भ्रमण संबंधी प्राथमिकताएं भी ली जा सकती हैं। कृपया फॉर्म में अनावश्यक संवेदनशील जानकारी न दें।"
                : "Contact, enquiry and chatbot forms may ask for your name, phone number, email address and message. A campus-tour request may also ask for candidate or guardian contact details, city, academic information, a preferred date and time, and tour preferences. Please do not include sensitive information that is not needed for your request."}
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              {isHindi
                ? "जानकारी का उपयोग और भंडारण"
                : "How information is used and stored"}
            </h2>
            <p>
              {isHindi
                ? "फॉर्म में दी गई जानकारी का उपयोग आपके संदेश का उत्तर देने, प्रवेश संबंधी पूछताछ संभालने या भ्रमण अनुरोध का प्रबंधन करने के लिए किया जाता है। वेबसाइट फॉर्म सबमिशन को Firebase/Firestore सेवा में भेजती है और इस वेबसाइट के प्रशासनिक कार्यों के लिए ब्राउज़र के स्थानीय स्टोरेज में भी प्रति रख सकती है। स्थानीय प्रति आपके ब्राउज़र में तब तक रह सकती है जब तक वह वहां से हटाई न जाए।"
                : "Information submitted through these forms is used to respond to your message, handle an admissions enquiry or manage a tour request. Form submissions are sent to Firebase/Firestore and may also be copied to this website's browser local storage for site administration. A local copy may remain in that browser until it is removed there."}
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              {isHindi ? "विश्लेषिकी और बाहरी सेवाएं" : "Analytics and service providers"}
            </h2>
            <p>
              {isHindi
                ? "यह वेबसाइट समर्थित ब्राउज़र और वातावरण में Firebase Analytics का उपयोग कर सकती है। Firebase/Google अपनी सेवाओं के संचालन के दौरान जानकारी संसाधित कर सकते हैं। उनकी गोपनीयता और डेटा प्रबंधन की जानकारी के लिए संबंधित सेवा प्रदाता की नीति देखें।"
                : "This website may use Firebase Analytics where it is supported by the browser and environment. Firebase/Google may process information while providing these services. Refer to the service provider's policies for details about its privacy and data handling practices."}
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              {isHindi ? "प्रश्न या अनुरोध" : "Questions or requests"}
            </h2>
            <p>
              {isHindi
                ? "अपने फॉर्म सबमिशन से जुड़े प्रश्न या अनुरोध के लिए कॉलेज से hsce.kanjhawala@gmail.com पर या +91 99531 55054 पर संपर्क करें। गोपनीय या संवेदनशील जानकारी वेबसाइट फॉर्म के बजाय सीधे कॉलेज कार्यालय को दें।"
                : "For questions or requests concerning a form submission, contact the college at hsce.kanjhawala@gmail.com or +91 99531 55054. Share confidential or sensitive information directly with the college office rather than through a website form."}
            </p>
          </section>
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
              description: "College profile, history and educational programme.",
              hiDescription:
                "कॉलेज परिचय, इतिहास एवं शैक्षणिक कार्यक्रम।",
              to: "/about",
              iconKey: "about",
            },
            {
              title: "B.Ed. Admissions",
              hiTitle: "बी.एड. प्रवेश",
              description:
                "Admission eligibility, procedure and document information.",
              hiDescription:
                "प्रवेश पात्रता, प्रक्रिया एवं दस्तावेज़ संबंधी जानकारी।",
              to: "/admissions",
              iconKey: "admissions",
            },
          ]}
        />
      </Container>
    </>
  );
}

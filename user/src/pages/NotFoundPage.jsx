import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Container } from "../components/common/Container";
import { PageHeaderBanner } from "../components/common/PageHeaderBanner";
import { useLanguage } from "../context/LanguageContext";

export default function NotFoundPage() {
  const { isHindi } = useLanguage();

  return (
    <>
      <Helmet>
        <title>
          {isHindi
            ? "पृष्ठ नहीं मिला (404) | हरियाणा शक्ति कॉलेज ऑफ एजुकेशन"
            : "Page Not Found | HSCE"}
        </title>
        <meta
          name="description"
          content={
            isHindi
              ? "आपके द्वारा खोजा गया पृष्ठ उपलब्ध नहीं है।"
              : "The page you requested could not be found."
          }
        />
      </Helmet>
      <PageHeaderBanner
        title={isHindi ? "404 - पृष्ठ नहीं मिला" : "404 - Page Not Found"}
        subtitle={
          isHindi
            ? "आप जिस पृष्ठ की खोज कर रहे हैं वह मौजूद नहीं है अथवा स्थानांतरित कर दिया गया है।"
            : "The page you are looking for does not exist or has been moved."
        }
        breadcrumbs={[{ label: "404" }]}
      />
      <Container className="py-20">
        <div className="section-card text-center max-w-lg mx-auto p-10">
          <h1 className="mb-3 text-5xl font-bold text-[#1c3274] font-poppins">
            404
          </h1>
          <h2 className="text-xl font-bold text-[#222222] mb-2 font-poppins">
            {isHindi ? "पृष्ठ नहीं मिला" : "Page Not Found"}
          </h2>
          <p className="text-[#555555] text-sm leading-relaxed mb-6 font-sans">
            {isHindi
              ? "आप जिस पृष्ठ की खोज कर रहे हैं वह मौजूद नहीं है अथवा स्थानांतरित कर दिया गया है।"
              : "The page you are looking for does not exist or has been moved."}
          </p>
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-[#1c3274] px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#15275a] transition">
            {isHindi ? "मुख्य पृष्ठ पर लौटें" : "Back to Home"}
          </Link>
        </div>
      </Container>
    </>
  );
}

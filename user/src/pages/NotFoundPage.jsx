import { Link } from "react-router-dom";
import { Container } from "../components/common/Container";
import { PageHeaderBanner } from "../components/common/PageHeaderBanner";
import { useLanguage } from "../context/LanguageContext";

export default function NotFoundPage() {
  const { isHindi } = useLanguage();

  return (
    <>
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
          <h2 className="mb-3 text-5xl font-bold text-[#363991] font-poppins">
            404
          </h2>
          <h2 className="text-xl font-bold text-[#222222] mb-2 font-poppins">
            {isHindi ? "पृष्ठ नहीं मिला" : "Page Not Found"}
          </h2>
          <p className="text-[#555555] text-sm leading-relaxed mb-6 font-sans">
            {isHindi
              ? "आप जिस पृष्ठ की खोज कर रहे हैं वह मौजूद नहीं है अथवा स्थानांतरित कर दिया गया है।"
              : "The page you are looking for does not exist or has been moved."}
          </p>
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-[#363991] px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#272A70] transition">
            {isHindi ? "मुख्य पृष्ठ पर लौटें" : "Back to Home"}
          </Link>
        </div>
      </Container>
    </>
  );
}

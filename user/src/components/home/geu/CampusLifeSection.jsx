import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Users,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";

export default function CampusLifeSection() {
  const { isHindi } = useLanguage();
  const [activeCard, setActiveCard] = useState(0);

  const features = [
    {
      number: "01",
      titleEn: "Learning",
      titleHi: "अधिगम एवं शिक्षण",
      descEn: "Classrooms, laboratories and hands-on learning experiences.",
      descHi: "आधुनिक कक्षाएं, पाठ्यचर्या प्रयोगशालाएं और व्यावहारिक अनुभव।",
      icon: BookOpen,
    },
    {
      number: "02",
      titleEn: "Participation",
      titleHi: "सहभागिता एवं संस्कृति",
      descEn: "Cultural events, shared experiences and campus activities.",
      descHi: "सांस्कृतिक उत्सव, सह-शैक्षणिक गतिविधियां और सामूहिक सहभागिता।",
      icon: Users,
    },
    {
      number: "03",
      titleEn: "Development",
      titleHi: "व्यावसायिक विकास",
      descEn: "Teaching practice, essential skills and career preparation.",
      descHi: "शिक्षण अभ्यास (School Internship), कौशल विकास और करियर तैयारी।",
      icon: TrendingUp,
    },
  ];

  return (
    <section
      style={{ backgroundColor: "#07264e" }}
      className="relative isolate overflow-hidden bg-[#07264e] font-sans text-white border-y border-blue-900/60 py-16 sm:py-20 lg:py-24">
      {/* Dynamic background gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_70%_20%,rgba(10,75,140,0.45),rgba(7,38,78,0.95)_70%)]"
      />

      {/* Sweeping decorative wave lines fanning from bottom-left across the cards */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg
          className="absolute -bottom-32 left-[10%] h-[750px] w-[1100px] max-w-none opacity-25 sm:left-[15%] lg:left-[22%] lg:h-[900px] lg:w-[1300px]"
          viewBox="0 0 1000 800"
          fill="none">
          {Array.from({ length: 36 }).map((_, i) => (
            <path
              key={i}
              d={`M ${-50 + i * 14} 850 C ${160 + i * 18} ${
                600 - i * 6
              }, ${440 + i * 12} ${280 - i * 8}, ${1050} ${
                40 + i * 14
              }`}
              stroke="white"
              strokeWidth="1.1"
              strokeOpacity={0.25 + (i % 5) * 0.08}
            />
          ))}
        </svg>

        {/* Top-right subtle concentric circular accents */}
        <div className="absolute -right-36 -top-36 h-[460px] w-[460px] rounded-full border border-white/[0.08] pointer-events-none" />
        <div className="absolute -right-20 -top-20 h-[340px] w-[340px] rounded-full border border-white/[0.07] pointer-events-none" />
        <div className="absolute -right-6 -top-6 h-[220px] w-[220px] rounded-full border border-white/[0.06] pointer-events-none" />
      </div>

      <div className="relative mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.78fr_1.62fr] lg:gap-14 xl:gap-20">
          {/* Left Column: Brand Identity & Big Watermark */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Eyebrow */}
              <div className="mb-6 flex items-center gap-2.5">
                <span className="h-0.5 w-7 bg-[#FBDD23]" />
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#FBDD23]">
                  {isHindi ? "परिसर जीवन" : "LIFE AT HSCE"}
                </span>
              </div>

              {/* Main Heading */}
              <h2 className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.25rem]">
                <span className="text-white block font-black">
                  {isHindi ? "परिसर जीवन" : "Campus Life"}
                </span>
                <span className="block font-medium text-white/75 mt-1 sm:mt-2">
                  {isHindi ? "कक्षाओं से आगे।" : "Beyond the Classroom."}
                </span>
              </h2>

              {/* Subtitle */}
              <p className="mt-6 max-w-sm text-sm sm:text-base leading-relaxed text-blue-100/80 font-normal">
                {isHindi
                  ? "एक प्रेरक वातावरण जहां भावी शिक्षक एक साथ सीखते, जुड़ते और आगे बढ़ते हैं।"
                  : "A welcoming environment where future educators learn, connect and grow together."}
              </p>

              {/* Translucent Badge */}
              <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2.5 backdrop-blur-sm shadow-xs">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center text-[#FBDD23]">
                  <Sparkles size={16} />
                </span>
                <span className="text-xs sm:text-sm font-medium text-white/90">
                  {isHindi
                    ? "उद्देश्य के साथ सीखें। आत्मविश्वास के साथ बढ़ें।"
                    : "Learn with purpose. Grow with confidence."}
                </span>
              </div>
            </div>

            {/* Bottom-left Watermark */}
            <div className="mt-12 lg:mt-20 select-none pointer-events-none">
              <span className="text-7xl sm:text-8xl lg:text-[130px] font-black tracking-wider text-white/[0.06] leading-none block">
                HSCE
              </span>
            </div>
          </div>

          {/* Right Column: Campus narrative, 3 step cards & CTA */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Heading */}
              <h3 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[2.65rem]">
                {isHindi ? (
                  <>
                    सीखने और अपनेपन को{" "}
                    <span className="text-[#FBDD23]">
                      प्रेरित करने वाला परिसर
                    </span>
                  </>
                ) : (
                  <>
                    A Campus That Inspires{" "}
                    <span className="text-[#FBDD23]">
                      Learning and Belonging
                    </span>
                  </>
                )}
              </h3>

              {/* Paragraphs */}
              <div className="mt-6 max-w-3xl space-y-4 text-sm sm:text-base leading-relaxed text-blue-100/80 font-normal">
                <p>
                  {isHindi
                    ? "कंझावला, दिल्ली में स्थित हरियाणा शक्ति कॉलेज ऑफ एजुकेशन भावी शिक्षकों के लिए एक सहयोगी वातावरण प्रदान करता है, जहां जिज्ञासा, नवाचार और सहयोग को बढ़ावा दिया जाता है।"
                    : "Located in Kanjhawala, Delhi, HSCE offers a supportive learning environment for aspiring teachers, with spaces and experiences designed to encourage curiosity, creativity and collaboration."}
                </p>

                <p>
                  {isHindi
                    ? "कक्षाओं और व्यावहारिक शिक्षण प्रयोगशालाओं से लेकर सांस्कृतिक गतिविधियों और अनुभवों तक, परिसर जीवन विद्यार्थियों को कुशल और आत्मविश्वास से परिपूर्ण शिक्षक बनने के लिए सशक्त बनाता है।"
                    : "From classrooms and practical learning facilities to shared activities and meaningful interactions, campus life encourages students to develop their teaching abilities and grow as confident professionals."}
                </p>
              </div>

              {/* 3 Step Cards */}
              <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-5">
                {features.map((feature, idx) => {
                  const Icon = feature.icon;
                  const isActive = activeCard === idx;

                  return (
                    <article
                      key={feature.number}
                      onMouseEnter={() => setActiveCard(idx)}
                      tabIndex={0}
                      onFocus={() => setActiveCard(idx)}
                      className={`group relative min-w-0 rounded-2xl p-6 transition-all duration-300 cursor-pointer ${
                        isActive
                          ? "border border-[#FBDD23] bg-[#0c315c]/60 shadow-[0_8px_30px_rgb(0,0,0,0.3)] -translate-y-1"
                          : "border border-white/15 bg-white/[0.04] hover:border-white/30 hover:bg-white/[0.07]"
                      }`}>
                      {/* Top row: Icon + Number */}
                      <div className="mb-6 flex items-center justify-between gap-2">
                        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#FBDD23] text-gray-950 shadow-sm transition-transform duration-300 group-hover:scale-105">
                          <Icon size={20} strokeWidth={2.2} />
                        </span>

                        <span className="text-xs font-semibold tracking-wider text-white/55">
                          {feature.number}
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="text-base sm:text-lg font-bold text-white leading-snug">
                        {isHindi ? feature.titleHi : feature.titleEn}
                      </h4>

                      {/* Description */}
                      <p className="mt-2 text-xs sm:text-sm leading-relaxed text-blue-100/75">
                        {isHindi ? feature.descHi : feature.descEn}
                      </p>

                      {/* Short yellow indicator line */}
                      <div
                        className={`mt-6 h-0.5 w-8 rounded-full bg-[#FBDD23] transition-all duration-300 ${
                          isActive ? "w-12 bg-[#FBDD23]" : "group-hover:w-12"
                        }`}
                      />
                    </article>
                  );
                })}
              </div>
            </div>

            {/* Bottom Row: Informational line & Explore Campus CTA */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-4">
              <div>
                <p className="text-base sm:text-lg font-bold text-white">
                  {isHindi
                    ? "अपने भावी परिसर को जानें।"
                    : "Get to know your future campus."}
                </p>
                <p className="mt-1 text-xs sm:text-sm text-blue-100/70">
                  {isHindi
                    ? "HSCE में उपलब्ध सुविधाओं और अवसरों को देखें।"
                    : "Explore the spaces and opportunities at HSCE."}
                </p>
              </div>

              <Link
                to="/campus-life"
                className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2.5 rounded-full bg-[#FBDD23] px-7 py-3.5 text-sm font-bold text-gray-950 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ffe338] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBDD23] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07264e]">
                <span>{isHindi ? "परिसर भ्रमण करें" : "Explore Campus"}</span>
                <ArrowRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1 text-gray-950"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

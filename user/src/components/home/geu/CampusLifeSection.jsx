import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpenCheck,
  UsersRound,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";

export default function CampusLifeSection() {
  const { isHindi } = useLanguage();

  const features = [
    {
      number: "01",
      titleEn: "Learning",
      titleHi: "अधिगम एवं शिक्षण",
      descEn: "Classrooms, laboratories and hands-on learning experiences.",
      descHi: "आधुनिक कक्षाएं, पाठ्यचर्या प्रयोगशालाएं और व्यावहारिक अनुभव।",
      icon: BookOpenCheck,
    },
    {
      number: "02",
      titleEn: "Participation",
      titleHi: "सहभागिता एवं संस्कृति",
      descEn: "Cultural events, shared experiences and campus activities.",
      descHi: "सांस्कृतिक उत्सव, सह-शैक्षणिक गतिविधियां और सामूहिक सहभागिता।",
      icon: UsersRound,
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
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#0a4b8c] via-[#094179] to-[#062c55] font-sans text-white border-y border-blue-900/50">
      {/* Decorative wave background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg
          className="absolute -bottom-20 -left-24 h-[650px] w-[850px] max-w-none opacity-20 sm:-left-10 lg:-bottom-32 lg:left-[5%] lg:h-[850px] lg:w-[1000px]"
          viewBox="0 0 800 800"
          fill="none">
          {Array.from({ length: 32 }).map((_, i) => (
            <path
              key={i}
              d={`M ${40 + i * 8} 820 C ${
                100 + i * 12
              } ${560 - i * 5}, ${320 + i * 8} ${
                260 - i * 7
              }, ${800} ${80 + i * 12}`}
              stroke="white"
              strokeWidth="1.2"
              strokeOpacity={0.3 + (i % 4) * 0.1}
            />
          ))}
        </svg>

        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/15 sm:h-[450px] sm:w-[450px]" />
        <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full border border-white/15 sm:h-[350px] sm:w-[350px]" />

        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-[#052243]/50" />
      </div>

      <div className="relative mx-auto grid max-w-[1500px] grid-cols-1 lg:grid-cols-[0.72fr_1.65fr] px-4 sm:px-6 lg:px-8">
        {/* Left: Section identity */}
        <div className="relative flex flex-col justify-center px-4 pb-8 pt-12 sm:px-8 sm:pb-10 sm:pt-16 lg:border-r lg:border-white/15 lg:px-10 lg:py-24 xl:px-12">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-0.5 w-8 bg-[#FBDD23]" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#FBDD23]">
              {isHindi ? "परिसर जीवन" : "Life at HSCE"}
            </span>
          </div>

          <h2 className="max-w-sm text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.2rem]">
            {isHindi ? "परिसर जीवन" : "Campus Life"}
            <span className="mt-2 block font-medium text-white/80">
              {isHindi ? "कक्षाओं से आगे।" : "Beyond the Classroom."}
            </span>
          </h2>

          <p className="mt-6 max-w-xs text-sm leading-7 text-white/85 sm:text-base">
            {isHindi
              ? "एक प्रेरक वातावरण जहां भावी शिक्षक एक साथ सीखते, जुड़ते और आगे बढ़ते हैं।"
              : "A welcoming environment where future educators learn, connect and grow together."}
          </p>

          <div className="mt-8 flex items-center gap-3 text-sm font-medium text-white/90">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/30 text-[#FBDD23]">
              <Sparkles size={16} />
            </span>
            <span>
              {isHindi
                ? "उद्देश्य के साथ सीखें। आत्मविश्वास के साथ बढ़ें।"
                : "Learn with purpose. Grow with confidence."}
            </span>
          </div>

          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-6 right-8 hidden text-[100px] font-bold leading-none text-white/[0.07] lg:block xl:right-12 xl:text-[140px]">
            HSCE
          </span>
        </div>

        {/* Right: Campus introduction */}
        <div className="px-4 pb-12 pt-5 sm:px-8 sm:pb-16 lg:px-10 lg:py-24 xl:px-12">
          <h3 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.65rem]">
            {isHindi ? (
              <>
                सीखने और अपनेपन को{" "}
                <span className="text-[#FBDD23]">प्रेरित करने वाला परिसर</span>
              </>
            ) : (
              <>
                A Campus That Inspires{" "}
                <span className="text-[#FBDD23]">Learning and Belonging</span>
              </>
            )}
          </h3>

          <div className="mt-6 max-w-3xl space-y-4 text-sm leading-7 text-blue-50/90 sm:text-base sm:leading-8 font-normal">
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

          {/* Feature cards */}
          <div className="mt-9 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.number}
                  className="group relative min-w-0 overflow-hidden rounded-xl border border-white/20 bg-white/[0.08] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#FBDD23]/70 hover:bg-white/[0.14] sm:p-4 lg:p-5">
                  <div className="mb-6 flex items-center justify-between gap-2">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FBDD23] text-[#0a4b8c] shadow-xs">
                      <Icon size={20} strokeWidth={2} />
                    </span>

                    <span className="text-xs font-bold tracking-widest text-white/55">
                      {feature.number}
                    </span>
                  </div>

                  <h4 className="text-base font-bold leading-snug sm:text-lg">
                    {isHindi ? feature.titleHi : feature.titleEn}
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-blue-50/80">
                    {isHindi ? feature.descHi : feature.descEn}
                  </p>

                  <div className="mt-5 h-0.5 w-8 rounded-full bg-[#FBDD23] transition-all duration-300 group-hover:w-14" />
                </article>
              );
            })}
          </div>

          {/* Campus CTA */}
          <div className="mt-8 flex flex-col gap-4 border-t border-white/20 pt-7 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-white">
                {isHindi
                  ? "अपने भावी परिसर को जानें।"
                  : "Get to know your future campus."}
              </p>
              <p className="mt-1 text-sm text-blue-100/75">
                {isHindi
                  ? "HSCE में उपलब्ध सुविधाओं और अवसरों को देखें।"
                  : "Explore the spaces and opportunities at HSCE."}
              </p>
            </div>

            <Link
              to="/campus-life"
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-3 rounded-full bg-[#FBDD23] px-7 py-3 text-sm font-bold text-gray-900 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ffe338] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBDD23] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a4b8c]">
              <span>{isHindi ? "परिसर देखें" : "Explore Campus"}</span>
              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1 text-gray-900"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

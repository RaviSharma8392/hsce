import { useEffect, useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import {
  Monitor,
  Laptop,
  FlaskConical,
  BookOpen,
  Landmark,
  Trophy,
  Camera,
  CheckCircle2,
  X,
  ArrowRight,
  ArrowLeft,
  Clock,
  UserCheck,
  ShieldCheck,
  Users,
  Award,
  GraduationCap,
  Sparkles,
} from "lucide-react";

import { CollegiatePageLayout } from "../components/common/CollegiatePageLayout";
import { getCampusLifeSidebarConfig } from "../data/navigationConfig";
import { useLanguage } from "../context/LanguageContext";
import { imageData, imageFallbacks } from "../data/imagesData";

const campusPhotos = [
  {
    title: "Computer & ICT Laboratory",
    category: "Learning spaces",
    image: imageData.computerLab,
    alt: "Computer laboratory at Haryana Shakti College of Education",
    size: "feature",
  },
  {
    title: "Campus Outdoors",
    category: "Campus moments",
    image: imageData.campusOutdoor,
    alt: "Outdoor spaces at the college",
    size: "standard",
  },
  {
    title: "Cricket on Campus",
    category: "Student activities",
    image: imageData.studentCricket,
    alt: "Students playing cricket together",
    size: "standard",
  },
  {
    title: "The College Library",
    category: "Learning spaces",
    image: imageData.library,
    alt: "Bookshelves and reading spaces in the college library",
    size: "standard",
  },
  {
    title: "A Game of Carrom",
    category: "Campus moments",
    image: imageData.studentCarrom,
    alt: "Students playing carrom",
    size: "standard",
  },
  {
    title: "Ideas in Conversation",
    category: "Student voices",
    image: imageData.studentDiscussion,
    alt: "Students exchanging ideas",
    size: "feature",
  },
  {
    title: "A Moment to Reflect",
    category: "Student voices",
    image: imageData.studentThinking,
    alt: "Students thinking and reflecting together",
    size: "standard",
  },
  {
    title: "Learning Together",
    category: "Student voices",
    image: imageData.principalStudentDiscussion,
    alt: "The principal speaking with students",
    size: "wide",
  },
];

const facilitiesList = [
  {
    id: "classrooms",
    title: "Smart Classrooms",
    hiTitle: "स्मार्ट क्लासरूम",
    icon: Monitor,
    badge: "Interactive Teaching & Micro-Pedagogy",
    image: imageData.classroom || imageData.campusHero,
    fallbackImage: imageFallbacks.classroom,
    summary:
      "Acoustically optimized lecture halls equipped with ceiling-mounted multimedia projectors, interactive smart touch panels, Wi-Fi connectivity, and ergonomic modular seating designed for micro-teaching, seminar presentations, and interactive peer group discussions.",
    hiSummary:
      "ध्वनिक रूप से अनुकूलित व्याख्यान कक्ष जो सीलिंग-माउंटेड मल्टीमीडिया प्रोजेक्टर, इंटरएक्टिव टच पैनल, वाई-फाई और एर्गोनोमिक मॉड्यूलर बैठने की व्यवस्था से सुसज्जित हैं। यह सूक्ष्म शिक्षण (Micro-teaching) एवं संगोष्ठी प्रस्तुतियों के लिए आदर्श हैं।",
    features: [
      "Overhead digital LCD projectors with automated projection screens",
      "Interactive smart boards for digital lesson delivery and multimedia teaching",
      "Spacious tiered seating accommodating 50+ teacher trainees comfortably",
      "Natural cross-ventilation and glare-free natural lighting",
      "Acoustic wall paneling minimizing exterior sound interference",
      "Dedicated podium setup for student teacher micro-teaching trials",
    ],
    operationalHours: "09:00 AM – 04:00 PM (Monday to Saturday)",
    inCharge: "Academic Dean & Pedagogy Department",
    guidelines:
      "Student teachers are trained here in pedagogical delivery, digital lesson planning, and student engagement strategies under direct faculty supervision.",
  },
  {
    id: "ict-lab",
    title: "ICT & Computer Lab",
    hiTitle: "आईसीटी व कंप्यूटर लैब",
    icon: Laptop,
    badge: "Digital Pedagogy & E-Learning",
    image: imageData.computerLab,
    fallbackImage: imageFallbacks.computerLab,
    summary:
      "A state-of-the-art educational technology laboratory with networked computer workstations, high-speed 100 Mbps fiber broadband, licensed educational applications, and specialized multimedia equipment for training future educators in digital instructional design.",
    hiSummary:
      "उच्च गति 100 एमबीपीएस फाइबर ब्रॉडबैंड, नेटवर्क वाले कंप्यूटर वर्कस्टेशन और लाइसेंस प्राप्त शैक्षणिक सॉफ्टवेयर से सुसज्जित आधुनिक कंप्यूटर लैब। यहाँ प्रशिक्षुओं को डिजिटल शिक्षण तकनीक सिखाई जाती है।",
    features: [
      "Dedicated workstations with modern operating systems and antivirus protection",
      "High-speed 100 Mbps dedicated fiber broadband connectivity",
      "Educational software, LMS portal access, and digital lesson planning tools",
      "Digital podium with integrated audio-visual controls and presentation monitor",
      "Full uninterrupted power backup (Online UPS & generator system)",
      "Structured hands-on ICT practical sessions aligned with GGSIPU syllabus",
    ],
    operationalHours: "09:30 AM – 03:30 PM (Practical Batches)",
    inCharge: "ICT Department / Mr. Mukesh Kumar",
    guidelines:
      "Students utilize the lab to develop multimedia teaching modules, interactive quizzes, and e-learning resources for their school teaching internship.",
  },
  {
    id: "science-lab",
    title: "Curriculum Resource Lab (Science & Math)",
    hiTitle: "पाठ्यक्रम संसाधन लैब (विज्ञान व गणित)",
    icon: FlaskConical,
    badge: "Hands-on Experiential Learning",
    image: imageData.scienceLab || imageData.computerLab,
    fallbackImage: imageFallbacks.scienceLab,
    summary:
      "A fully equipped practical resource center catering to Physics, Chemistry, Biology, and Mathematics pedagogy. Equipped with precision apparatus, glassware, chemicals, 3D anatomical charts, mathematical geometry kits, and manipulative models for experiential teacher training.",
    hiSummary:
      "भौतिक, रसायन, जीव विज्ञान एवं गणित शिक्षण हेतु पूर्णतः सुसज्जित व्यावहारिक संसाधन केंद्र, जिसमें सटीक वैज्ञानिक उपकरण, 3D मॉडल और गणितीय किट उपलब्ध हैं।",
    features: [
      "Full laboratory inventory of Physics, Chemistry, and Biology demonstration apparatus",
      "Comprehensive Mathematics kits, geometry boards, and concrete manipulative models",
      "Safety gear, eye-wash stations, first-aid kits, and ABC fire extinguishers",
      "Sturdy demonstration worktables configured for individual and group experiments",
      "Low-cost, no-cost teaching learning material (TLM) fabrication zone",
      "Experiential lesson planning resources aligned with CBSE science curricula",
    ],
    operationalHours: "10:00 AM – 03:00 PM (Practical Demonstration Hours)",
    inCharge: "Science & Mathematics Pedagogy Faculty",
    guidelines:
      "Trainee teachers gain hands-on competence in setting up laboratory demonstrations and conducting guided school science experiments safely.",
  },
  {
    id: "library",
    title: "Library & Resource Center",
    hiTitle: "पुस्तकालय एवं वाचनालय",
    icon: BookOpen,
    badge: "8,000+ Volumes & DELNET Digital Database",
    image: imageData.library,
    fallbackImage: imageFallbacks.library,
    summary:
      "The academic heart of HSCE featuring over 8,000 reference and text volumes, national education journals, competitive exam archives (CTET, NET), DELNET digital consortium access, and a quiet, reading hall accommodating 100+ scholar students simultaneously.",
    hiSummary:
      "8,000 से अधिक संदर्भ और पाठ्य पुस्तकों, राष्ट्रीय शिक्षा पत्रिकाओं, सीटीईटी/नेट अभिलेखागार और डेलनेट डिजिटल कंसोर्टियम से समृद्ध केंद्रीय पुस्तकालय। इसमें 100 छात्रों के बैठने की व्यवस्था है।",
    features: [
      "Over 8,000 curated titles covering Education, Pedagogy, Psychology, and Philosophy",
      "DELNET consortium membership providing access to millions of global e-journals & e-books",
      "Quiet 100-seater reading hall with dedicated scholar study cubicles and Wi-Fi",
      "Daily national newspapers in English & Hindi, plus leading educational periodicals",
      "Automated digital catalogue, barcode circulation, and student book-bank facility",
      "Specialized resource corner for CTET, DSSSB, KVS, and UGC-NET exam preparation",
    ],
    operationalHours: "09:00 AM – 04:30 PM (Monday to Saturday)",
    inCharge: "Mr. Ram Kishan (Head Librarian)",
    guidelines:
      "The library operates on an open-access system where students can borrow curriculum textbooks, consult reference encyclopedias, and download research papers.",
  },
  {
    id: "auditorium",
    title: "Multipurpose Hall & Auditorium",
    hiTitle: "बहुउद्देशीय सभागार",
    icon: Landmark,
    badge: "250+ Seating Capacity & Assemblies",
    image: imageData.auditorium || imageData.campusOutdoor,
    fallbackImage: imageFallbacks.campusHero,
    summary:
      "A spacious 250+ capacity multipurpose hall with an elevated stage, professional audio-visual acoustics, podium sound system, and projection screen used for daily college assemblies, national seminars, faculty development workshops, and vibrant cultural celebrations.",
    hiSummary:
      "250+ क्षमता वाला विशाल बहुउद्देशीय सभागार जिसमें मंच, पेशेवर ध्वनि प्रणाली और प्रोजेक्टर स्क्रीन स्थापित है। यहाँ दैनिक प्रार्थना, संगोष्ठी एवं सांस्कृतिक कार्यक्रम होते हैं।",
    features: [
      "250+ comfortable auditorium seating capacity arranged with unobstructed sightlines",
      "Elevated performance stage with specialized theatrical acoustic lighting and backdrops",
      "Integrated PA sound system with wireless collar & handheld mics and podium audio",
      "High-lumen motorized ceiling projection screen for seminar video presentations",
      "Venue for National Education Day, Shiksha Samvaad, debate competitions, and annual fest",
      "Daily morning college assembly setting an inspiring institutional tone for each academic day",
    ],
    operationalHours: "Assembly & Event Timings as per Academic Schedule",
    inCharge: "Cultural & Co-Curricular Committee",
    guidelines:
      "Hosts major institutional events, guest lectures by eminent educationists, drama workshops, and university examinations.",
  },
  {
    id: "sports",
    title: "Sports, Yoga & Recreation Ground",
    hiTitle: "खेल एवं योग केंद्र",
    icon: Trophy,
    badge: "Physical Vitality & Wellness",
    image: imageData.studentCricket,
    fallbackImage: imageFallbacks.campusOutdoor,
    summary:
      "An expansive open sports field and athletic area supporting cricket, volleyball, badminton, and daily morning yoga practice, complemented by an indoor games room for table tennis and carrom, fostering physical vitality and sportsmanship.",
    hiSummary:
      "क्रिकेट, वॉलीबॉल, बैडमिंटन और नियमित योग अभ्यास हेतु विस्तृत खुला खेल मैदान तथा इनडोर खेलों की उत्तम सुविधा, जो शारीरिक स्वास्थ्य एवं खेल भावना को बढ़ावा देती है।",
    features: [
      "Open manicured playground marked for cricket, volleyball, and athletic track events",
      "Dedicated peaceful lawn zone for morning yoga, pranayama, and mindfulness sessions",
      "Indoor recreation center equipped with tournament-standard carrom and table tennis tables",
      "Annual Athletic Meet, inter-house sports tournaments, and fitness challenges",
      "Dedicated sports locker room with high quality equipment for all enrolled students",
      "Guidance from qualified physical education faculty fostering mental alertness",
    ],
    operationalHours: "08:30 AM – 05:00 PM (Sports Ground & Activity Area)",
    inCharge: "Sports & Physical Education Committee",
    guidelines:
      "Teacher trainees actively participate in team sports and daily yoga to develop holistic personal wellness and sports leadership skills.",
  },
];

const studentBenefits = [
  {
    number: "01",
    title: "A culture of respect",
    description:
      "An inclusive environment where different perspectives are welcomed and every learner is encouraged to participate.",
  },
  {
    number: "02",
    title: "Learning beyond lectures",
    description:
      "Opportunities to explore ideas, work together and connect academic learning with everyday experience.",
  },
  {
    number: "03",
    title: "Guidance that matters",
    description:
      "Supportive faculty interactions that encourage questions, reflection and steady personal growth.",
  },
  {
    number: "04",
    title: "Room to discover",
    description:
      "Spaces and activities that make time for creativity, recreation and a healthy balance in campus life.",
  },
];

/* ========================================================================= */
/* COMPONENT 1: CAMPUS LIFE OVERVIEW COMPONENT (Top-rendered)               */
/* ========================================================================= */
function CampusOverviewComponent({ isHindi, onSelectTab }) {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Main Campus Feature Card */}
      <div className="rounded-md border border-gray-200/90 bg-white p-6 sm:p-8 shadow-xs">
        {/* Header with Royal Navy Underline */}
        <div className="border-b border-gray-200 pb-4 mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2E3A8C]">
            {isHindi ? "हमारा परिसर" : "Our Campus"}
          </span>
          <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {isHindi
              ? "सीखने और आगे बढ़ने का आदर्श वातावरण"
              : "Space to Learn. Room to Grow."}
          </h2>
          <div className="mt-3 h-1 w-20 bg-[#2E3A8C] rounded-full" />
        </div>

        {/* Featured Campus Hero Image */}
        <div className="relative aspect-[16/9] overflow-hidden rounded border border-gray-200 bg-slate-100 shadow-2xs mb-6">
          <img
            src={imageData.campusHero}
            alt="Haryana Shakti College of Education Campus"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = imageFallbacks.campusHero;
            }}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/85 via-gray-950/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FBDD23] bg-black/50 px-2 py-0.5 rounded border border-yellow-400/30">
              Kanjhawala, Delhi - 110081
            </span>
            <p className="mt-1 text-base sm:text-lg font-serif font-bold">
              Haryana Shakti College of Education · Dedicated to Teacher Excellence Since 1999
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans text-justify mb-6">
          {isHindi
            ? "हरियाणा शक्ति कॉलेज ऑफ एजुकेशन, कंझावला, दिल्ली का परिसर शांत एवं अध्ययन के अनुकूल वातावरण में स्थित है। यहाँ आधुनिक स्मार्ट क्लासरूम, उन्नत आईसीटी कंप्यूटर लैब, विज्ञान संसाधन केंद्र, बहुउद्देशीय सभागार एवं 8,000 से अधिक पुस्तकों से समृद्ध पुस्तकालय उपलब्ध हैं। हमारा उद्देश्य भावी शिक्षकों को आधुनिक शिक्षण पद्धतियों में पारंगत करना है।"
            : "Situated in Kanjhawala, North West Delhi, Haryana Shakti College of Education provides an exceptional, peaceful environment tailored specifically for modern teacher training. The campus hosts fully equipped smart classrooms, advanced educational technology and computer labs, science and math curriculum resource centers, a multipurpose auditorium, and extensive library facilities."}
        </p>

        {/* Image 2 Reference Style Statistics Boxes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-gray-100 pt-5">
          <div className="rounded bg-slate-50 p-3.5 border border-gray-200/80 text-center">
            <Users size={20} className="mx-auto text-[#2E3A8C] mb-1.5" />
            <span className="block font-serif text-lg sm:text-xl font-bold text-slate-900">
              100 / Yr
            </span>
            <span className="text-[11px] font-medium text-slate-600">
              {isHindi ? "वार्षिक प्रवेश क्षमता" : "Enrolled Trainees"}
            </span>
          </div>

          <div className="rounded bg-slate-50 p-3.5 border border-gray-200/80 text-center">
            <GraduationCap size={20} className="mx-auto text-[#2E3A8C] mb-1.5" />
            <span className="block font-serif text-lg sm:text-xl font-bold text-slate-900">
              2,400+
            </span>
            <span className="text-[11px] font-medium text-slate-600">
              {isHindi ? "सफल पूर्व छात्र (Alumni)" : "Teacher Alumni"}
            </span>
          </div>

          <div className="rounded bg-slate-50 p-3.5 border border-gray-200/80 text-center">
            <Award size={20} className="mx-auto text-[#2E3A8C] mb-1.5" />
            <span className="block font-serif text-lg sm:text-xl font-bold text-slate-900">
              16+
            </span>
            <span className="text-[11px] font-medium text-slate-600">
              {isHindi ? "समर्पित संकाय सदस्य" : "Pedagogy Faculty"}
            </span>
          </div>

          <div className="rounded bg-slate-50 p-3.5 border border-gray-200/80 text-center">
            <Sparkles size={20} className="mx-auto text-[#2E3A8C] mb-1.5" />
            <span className="block font-serif text-lg sm:text-xl font-bold text-slate-900">
              6+
            </span>
            <span className="text-[11px] font-medium text-slate-600">
              {isHindi ? "विशेष प्रयोगशालाएं" : "Specialized Labs"}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Direct Facility Quick-Launch Cards (Clicking renders that component directly) */}
      <div className="rounded-md border border-gray-200/90 bg-white p-6 sm:p-8 shadow-xs">
        <div className="border-b border-gray-200 pb-4 mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2E3A8C]">
            {isHindi ? "संस्थागत सुविधाएं" : "Campus Facilities"}
          </span>
          <h3 className="mt-1 font-serif text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {isHindi
              ? "महाविद्यालय की प्रमुख सुविधाएं व प्रयोगशालाएं"
              : "Explore Campus Facilities & Resource Hubs"}
          </h3>
          <div className="mt-2 h-1 w-16 bg-[#2E3A8C] rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {facilitiesList.map((fac) => {
            const Icon = fac.icon;
            return (
              <button
                key={fac.id}
                type="button"
                onClick={() => onSelectTab(fac.id)}
                className="group flex flex-col justify-between rounded-md border border-gray-200 bg-slate-50/60 p-4 text-left transition hover:border-[#2E3A8C] hover:bg-white hover:shadow-sm cursor-pointer">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded bg-[#2E3A8C] text-white group-hover:scale-105 transition-transform">
                      <Icon size={18} />
                    </div>
                    <span className="text-[10px] font-bold text-[#2E3A8C] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      View Specs
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-slate-900 group-hover:text-[#2E3A8C] transition-colors">
                    {isHindi ? fac.hiTitle : fac.title}
                  </h4>
                  <p className="mt-1.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {isHindi ? fac.hiSummary : fac.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-200/70 flex items-center justify-between text-xs font-bold text-[#2E3A8C]">
                  <span>{isHindi ? "विस्तृत विवरण देखें" : "Explore Facility"}</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Shiksha Samvaad Initiative Card */}
      <div className="rounded-md border border-gray-200/90 bg-[#2E3A8C] text-white p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <span className="h-0.5 w-6 bg-[#FBDD23]" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#FBDD23]">
            Dialogue · Ideas · Possibility
          </span>
        </div>

        <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
          Shiksha <span className="text-[#FBDD23]">Samvaad</span>
        </h3>

        <p className="mt-1 text-sm font-semibold text-white/90">
          Ek Nayi Soch
        </p>

        <p className="mt-3 text-xs sm:text-sm text-white/85 leading-relaxed font-sans max-w-2xl text-justify">
          Education moves forward when people come together to ask questions, exchange perspectives, and learn from one another. Through interactive student forums, teacher workshops, and national webinars, Shiksha Samvaad brings educators and student teachers together on key contemporary issues in Indian education.
        </p>
      </div>

      {/* 4. Student Experience & Growth */}
      <div className="rounded-md border border-gray-200/90 bg-white p-6 sm:p-8 shadow-xs">
        <div className="border-b border-gray-200 pb-4 mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2E3A8C]">
            {isHindi ? "छात्र अनुभव" : "Student Experience"}
          </span>
          <h3 className="mt-1 font-serif text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {isHindi ? "सीखने और संवरने का वातावरण" : "An Environment Built for Growth"}
          </h3>
          <div className="mt-2 h-1 w-16 bg-[#2E3A8C] rounded-full" />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {studentBenefits.map((benefit) => (
            <div
              key={benefit.number}
              className="rounded border border-gray-200 bg-slate-50/60 p-4 transition hover:bg-white hover:border-[#2E3A8C]">
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="text-xs font-bold font-serif text-[#2E3A8C] bg-white px-2 py-0.5 rounded border border-gray-200">
                  {benefit.number}
                </span>
                <h4 className="font-serif font-bold text-sm text-slate-900">
                  {benefit.title}
                </h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ========================================================================= */
/* COMPONENT 2: INDIVIDUAL FACILITY COMPONENT (Top-rendered on tab select)   */
/* ========================================================================= */
function FacilityDetailComponent({ facility, isHindi, onSelectTab }) {
  const Icon = facility.icon;

  // Find previous and next facilities for navigation
  const currentIndex = facilitiesList.findIndex((f) => f.id === facility.id);
  const prevFacility = currentIndex > 0 ? facilitiesList[currentIndex - 1] : null;
  const nextFacility =
    currentIndex < facilitiesList.length - 1 ? facilitiesList[currentIndex + 1] : null;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner & Title Box */}
      <div className="rounded-md border border-gray-200/90 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4 mb-6">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-[#2E3A8C] text-white shadow-xs">
              <Icon size={24} />
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#2E3A8C] uppercase tracking-wider">
                HSCE Institutional Facility
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {isHindi ? facility.hiTitle : facility.title}
              </h2>
            </div>
          </div>

          <span className="self-start sm:self-auto rounded bg-blue-50 text-[#2E3A8C] border border-blue-200/80 px-3.5 py-1.5 text-xs font-bold">
            {facility.badge}
          </span>
        </div>

        {/* Featured Facility Image */}
        <div className="relative aspect-[16/9] max-h-[380px] w-full overflow-hidden rounded border border-gray-200 bg-slate-100 shadow-2xs mb-6">
          <img
            src={facility.image}
            alt={facility.title}
            onError={(e) => {
              e.currentTarget.onerror = null;
              if (facility.fallbackImage) {
                e.currentTarget.src = facility.fallbackImage;
              } else {
                e.currentTarget.src = imageFallbacks.campusHero;
              }
            }}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4 text-white flex items-center justify-between">
            <span className="text-xs font-semibold bg-black/50 px-2.5 py-1 rounded">
              Haryana Shakti College of Education Campus
            </span>
            <span className="text-[11px] text-[#FBDD23] font-bold">
              Kanjhawala, Delhi - 110081
            </span>
          </div>
        </div>

        {/* Detailed Summary */}
        <div className="space-y-3 mb-6">
          <h3 className="font-serif font-bold text-base text-slate-900">
            {isHindi ? "सुविधा का उद्देश्य एवं महत्व" : "Facility Purpose & Overview"}
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans text-justify">
            {isHindi ? facility.hiSummary : facility.summary}
          </p>
          {facility.guidelines && (
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans text-justify italic bg-slate-50 p-3 rounded border border-gray-200/70">
              "{facility.guidelines}"
            </p>
          )}
        </div>

        {/* Technical Features & Specifications Grid */}
        <div className="rounded-md bg-slate-50/80 border border-gray-200 p-5 mb-6">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
            <ShieldCheck size={16} className="text-[#2E3A8C]" />
            <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-slate-800">
              {isHindi ? "प्रमुख तकनीकी विशेषताएं व उपकरण:" : "Key Specifications & Equipment Inventory:"}
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {facility.features.map((feat, fIdx) => (
              <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-700">
                <CheckCircle2 size={15} className="text-[#2E3A8C] shrink-0 mt-0.5" />
                <span className="leading-snug">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Timings & Faculty Supervision Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-gray-100 pt-5">
          <div className="flex items-center gap-3 rounded bg-blue-50/50 p-3 border border-blue-100">
            <Clock size={18} className="text-[#2E3A8C] shrink-0" />
            <div className="min-w-0">
              <span className="block text-[11px] font-bold text-[#2E3A8C] uppercase tracking-wider">
                {isHindi ? "संचालन समय" : "Operational Hours"}
              </span>
              <span className="text-xs text-slate-800 font-medium">{facility.operationalHours}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded bg-blue-50/50 p-3 border border-blue-100">
            <UserCheck size={18} className="text-[#2E3A8C] shrink-0" />
            <div className="min-w-0">
              <span className="block text-[11px] font-bold text-[#2E3A8C] uppercase tracking-wider">
                {isHindi ? "पर्यवेक्षक / प्रभारी" : "Faculty Supervision"}
              </span>
              <span className="text-xs text-slate-800 font-medium">{facility.inCharge}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Prev / Next Navigation Between Facilities */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {prevFacility ? (
          <button
            type="button"
            onClick={() => onSelectTab(prevFacility.id)}
            className="flex items-center gap-2 rounded border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:border-[#2E3A8C] hover:text-[#2E3A8C] transition cursor-pointer">
            <ArrowLeft size={14} />
            <span>
              {isHindi ? "पिछली सुविधा: " : "Previous: "}
              {isHindi ? prevFacility.hiTitle : prevFacility.title}
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onSelectTab("overview")}
            className="flex items-center gap-2 rounded border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:border-[#2E3A8C] hover:text-[#2E3A8C] transition cursor-pointer">
            <ArrowLeft size={14} />
            <span>{isHindi ? "परिसर अवलोकन पर लौटें" : "Back to Campus Overview"}</span>
          </button>
        )}

        {nextFacility ? (
          <button
            type="button"
            onClick={() => onSelectTab(nextFacility.id)}
            className="flex items-center gap-2 rounded bg-[#2E3A8C] text-white px-4 py-2.5 text-xs font-bold hover:bg-[#232d70] transition ml-auto cursor-pointer">
            <span>
              {isHindi ? "अगली सुविधा: " : "Next: "}
              {isHindi ? nextFacility.hiTitle : nextFacility.title}
            </span>
            <ArrowRight size={14} />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onSelectTab("gallery")}
            className="flex items-center gap-2 rounded bg-[#2E3A8C] text-white px-4 py-2.5 text-xs font-bold hover:bg-[#232d70] transition ml-auto cursor-pointer">
            <span>{isHindi ? "फोटो गैलरी देखें" : "View Photo Gallery"}</span>
            <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

/* ========================================================================= */
/* COMPONENT 3: CAMPUS GALLERY COMPONENT (Top-rendered on tab select)        */
/* ========================================================================= */
function CampusGalleryComponent({ isHindi, onSelectPhoto }) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: isHindi ? "सभी तस्वीरें" : "All Photos" },
    { id: "Learning spaces", label: isHindi ? "शिक्षण कक्ष" : "Learning Spaces" },
    { id: "Campus moments", label: isHindi ? "परिसर के पल" : "Campus Moments" },
    { id: "Student activities", label: isHindi ? "छात्र गतिविधियां" : "Activities" },
    { id: "Student voices", label: isHindi ? "छात्र संवाद" : "Student Voices" },
  ];

  const filteredPhotos = useMemo(() => {
    if (selectedCategory === "all") return campusPhotos;
    return campusPhotos.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="rounded-md border border-gray-200/90 bg-white p-6 sm:p-8 shadow-xs">
        <div className="border-b border-gray-200 pb-4 mb-6 flex items-center justify-between flex-wrap gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E3A8C]">
              {isHindi ? "छायाचित्र दीर्घा" : "Photo Highlights"}
            </span>
            <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {isHindi ? "परिसर की झलकियां एवं कार्यक्रम" : "Everyday Campus Moments & Activities"}
            </h2>
            <div className="mt-2 h-1 w-16 bg-[#2E3A8C] rounded-full" />
          </div>

          <Link
            to="/gallery"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2E3A8C] bg-blue-50 px-3 py-1.5 rounded border border-blue-200/70 hover:bg-blue-100 transition">
            <span>{isHindi ? "सम्पूर्ण गैलरी संग्रह खोलें" : "Open Full Gallery Archive"}</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap mb-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded text-xs font-bold transition cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-[#2E3A8C] text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredPhotos.map((photo, index) => (
            <CampusPhoto
              key={photo.title || index}
              photo={photo}
              onOpen={onSelectPhoto}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function CampusPhoto({ photo, onOpen }) {
  const [failed, setFailed] = useState(false);

  return (
    <button
      type="button"
      onClick={() => onOpen(photo)}
      aria-label={`View ${photo.title} photo`}
      className="group relative block h-48 sm:h-56 w-full overflow-hidden rounded border border-gray-200 bg-slate-100 text-left focus:outline-none focus:ring-2 focus:ring-[#2E3A8C] cursor-pointer">
      {!failed ? (
        <img
          src={photo.image}
          width="600"
          height="450"
          alt={photo.alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-100 p-4 text-center text-slate-500">
          <Camera size={24} />
          <span className="text-xs font-medium">{photo.title}</span>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/20 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />

      <div className="absolute inset-x-0 bottom-0 p-3.5 text-white">
        <span className="text-[10px] uppercase font-bold tracking-wider text-[#FBDD23]">
          {photo.category}
        </span>
        <h4 className="font-serif font-bold text-sm leading-snug line-clamp-1">
          {photo.title}
        </h4>
      </div>
    </button>
  );
}

function CampusPhotoViewer({ photo, onClose }) {
  useEffect(() => {
    if (!photo) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [photo, onClose]);

  if (!photo) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs"
      onClick={onClose}>
      <div
        className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-md bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close photo"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black transition cursor-pointer">
          <X size={18} />
        </button>

        <img
          src={photo.image}
          alt={photo.alt}
          className="max-h-[75vh] w-full object-contain bg-black"
        />

        <div className="p-4 sm:p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2E3A8C]">
            {photo.category}
          </span>
          <h3 className="font-serif text-lg font-bold text-slate-900 mt-0.5">
            {photo.title}
          </h3>
          <p className="text-xs text-slate-600 mt-1">{photo.alt}</p>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================= */
/* MAIN PAGE CONTROLLER: CAMPUS LIFE (Modular Component-Based Rendering)     */
/* ========================================================================= */
export default function CampusLifePage() {
  const { isHindi } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  // Tab synchronization: sync from ?tab=... or fallback to hash or "overview"
  const tabQuery = searchParams.get("tab");
  const hashVal = location.hash ? location.hash.replace("#", "") : null;
  const validTabKeys = [
    "overview",
    "classrooms",
    "ict-lab",
    "science-lab",
    "library",
    "auditorium",
    "sports",
    "gallery",
  ];

  const activeTab = tabQuery && validTabKeys.includes(tabQuery)
    ? tabQuery
    : hashVal && validTabKeys.includes(hashVal)
    ? hashVal
    : "overview";

  // Auto clean hash to tab if user navigated with an old hash URL
  useEffect(() => {
    if (hashVal && validTabKeys.includes(hashVal) && tabQuery !== hashVal) {
      setSearchParams({ tab: hashVal }, { replace: true });
    }
  }, [hashVal, tabQuery, setSearchParams]);

  const handleTabSelect = (tabKey) => {
    setSearchParams({ tab: tabKey });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sidebarConfig = getCampusLifeSidebarConfig(isHindi, activeTab);

  // Attach onClick to sidebar items so they switch tabs cleanly without page refresh or jumping below
  const enhancedSidebarItems = sidebarConfig.items.map((item) => ({
    ...item,
    onClick: (e) => {
      e?.preventDefault?.();
      handleTabSelect(item.id);
    },
  }));

  const [activePhoto, setActivePhoto] = useState(null);

  // Determine current active facility object if in a facility tab
  const activeFacility = facilitiesList.find((f) => f.id === activeTab);

  // Dynamic breadcrumb label
  const activeBreadcrumbLabel =
    activeTab === "overview"
      ? isHindi ? "परिसर अवलोकन" : "Overview"
      : activeTab === "gallery"
      ? isHindi ? "फोटो गैलरी" : "Gallery"
      : activeFacility
      ? isHindi ? activeFacility.hiTitle : activeFacility.title
      : isHindi ? "परिसर का जीवन" : "Campus Life";

  return (
    <>
      <Helmet>
        <title>
          {activeBreadcrumbLabel} | {isHindi ? "परिसर एवं सुविधाएं" : "Facilities & Campus Life"} | HSCE
        </title>
      </Helmet>

      <CollegiatePageLayout
        bannerTitle={isHindi ? "परिसर का जीवन एवं सुविधाएं" : "Facilities & Campus Life"}
        bannerSubtitle={
          isHindi
            ? "शिक्षण, नवाचार, खेलकूद, पुस्तकालय एवं बहुउद्देशीय सभागार से सुसज्जित आदर्श शिक्षण परिसर।"
            : "An inspiring collegiate atmosphere built for learning, pedagogical practice, sports, and holistic development."
        }
        breadcrumbs={[
          { label: isHindi ? "सुविधाएं एवं परिसर" : "Facilities", href: "/campus-life?tab=overview" },
          { label: activeBreadcrumbLabel },
        ]}
        sidebarTitle={sidebarConfig.title}
        sidebarItems={enhancedSidebarItems}
        quickActions={sidebarConfig.quickActions}>
        {/* ============================================================== */}
        {/* MODULAR COMPONENT RENDERING AT TOP (NO SCROLLING BELOW)        */}
        {/* ============================================================== */}
        {activeTab === "overview" && (
          <CampusOverviewComponent
            isHindi={isHindi}
            onSelectTab={handleTabSelect}
          />
        )}

        {activeFacility && (
          <FacilityDetailComponent
            facility={activeFacility}
            isHindi={isHindi}
            onSelectTab={handleTabSelect}
          />
        )}

        {activeTab === "gallery" && (
          <CampusGalleryComponent
            isHindi={isHindi}
            onSelectPhoto={setActivePhoto}
          />
        )}
      </CollegiatePageLayout>

      <CampusPhotoViewer
        photo={activePhoto}
        onClose={() => setActivePhoto(null)}
      />
    </>
  );
}

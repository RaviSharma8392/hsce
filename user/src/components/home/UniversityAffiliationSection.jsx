import React from "react";
import { Link } from "react-router-dom";
import {
  ExternalLink,
  Award,
  Eye,
  Target,
  ShieldCheck,
  Building2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

import { Container } from "../common/Container";
import { useLanguage } from "../../context/LanguageContext";
import { imageData } from "../../data/imagesData";

export function UniversityAffiliationSection() {
  const { isHindi } = useLanguage();

  const universityData = {
    campusImage: "/assets/affiliations/ggsipu-campus.png",
    logoUrl: imageData.ggsipuLogo || "/assets/affiliations/ggsipu-logo.png",
    portalUrl: "http://www.ipu.ac.in",

    en: {
      eyebrow: "STATUTORY UNIVERSITY AFFILIATION",
      titleLead: "Guru Gobind Singh",
      titleAccent: "Indraprastha University (GGSIPU)",
      badge: "Govt. of NCT of Delhi • UGC 12B Recognized",
      para1:
        "Guru Gobind Singh Indraprastha University (GGSIPU) is the first University established in 1998 by Govt. of NCT of Delhi under the provisions of Guru Gobind Singh Indraprastha University Act, 1998 read with its Amendment in 1999. The University is recognized by University Grants Commission (UGC), India under section 12B of UGC Act.",
      para2:
        'It is a teaching and affiliating University with the explicit objective of facilitating and promoting "studies, research and extension work in emerging areas of higher education with focus on professional education,',
      para3:
        'for example engineering, technology, management studies, medicine, pharmacy, nursing, education, law, etc. and also to achieve excellence in these and connected fields and other matters connected therewith or incidental thereto." In order to serve the broad purposes for which the University was established, it set out its statements of Vision, Mission and Quality Policy which read as under:',

      pillars: [
        {
          id: "vision",
          title: "VISION",
          icon: Eye,
          content:
            "The University will stimulate both the hearts and minds of scholars, empower them to contribute to the welfare of society at large, train them to adopt themselves to the changing needs of the economy, advocate them for cultural leadership to ensure peace, harmony and prosperity for all.",
        },
        {
          id: "mission",
          title: "MISSION",
          icon: Target,
          content:
            "Guru Gobind Singh Indraprastha University shall strive hard to provide a market oriented professional education to the student community of India and particularly in Delhi. It will serve the education as well as meet the needs of the growing Indian Industries by promoting establishment of Schools and colleges as learning Centres of Excellence. Guru Gobind Singh Indraprastha University will focus on emerging areas of professional education in the field of Engineering, Technology, Medicine, Education, Pharmacy, Nursing, Law and more.",
        },
        {
          id: "quality",
          title: "QUALITY POLICY",
          icon: ShieldCheck,
          content:
            "Guru Gobind Singh Indraprastha University is committed to providing professional education with thrust on creativity, innovation, continuous change and motivating environment for knowledge creation and dissemination through its effective quality management system.",
        },
      ],
      portalBtn: "Visit Official GGSIPU Portal",
      affiliationNote: "HSCE is permanently affiliated to GGSIPU, Delhi for B.Ed. (Approved Intake: 100 Seats)",
    },

    hi: {
      eyebrow: "वैधानिक विश्वविद्यालय संबद्धता",
      titleLead: "गुरु गोबिंद सिंह",
      titleAccent: "इंद्रप्रस्थ विश्वविद्यालय (GGSIPU)",
      badge: "दिल्ली राष्ट्रीय राजधानी क्षेत्र सरकार • यूजीसी 12B मान्यता प्राप्त",
      para1:
        "गुरु गोबिंद सिंह इंद्रप्रस्थ विश्वविद्यालय (GGSIPU) दिल्ली राष्ट्रीय राजधानी क्षेत्र सरकार द्वारा गुरु गोबिंद सिंह इंद्रप्रस्थ विश्वविद्यालय अधिनियम, 1998 (1999 में संशोधित) के प्रावधानों के तहत 1998 में स्थापित प्रथम विश्वविद्यालय है। यह विश्वविद्यालय यूजीसी अधिनियम की धारा 12B के अंतर्गत विश्वविद्यालय अनुदान आयोग (UGC) द्वारा मान्यता प्राप्त है।",
      para2:
        'यह एक शिक्षण एवं संबद्धक विश्वविद्यालय है जिसका स्पष्ट उद्देश्य "व्यावसायिक शिक्षा पर ध्यान केंद्रित करते हुए उच्च शिक्षा के उभरते क्षेत्रों में अध्ययन, अनुसंधान एवं विस्तार कार्य को सुगम एवं प्रोत्साहित करना है,',
      para3:
        'उदाहरणार्थ इंजीनियरिंग, प्रौद्योगिकी, प्रबंधन अध्ययन, चिकित्सा, फार्मेसी, नर्सिंग, शिक्षा, कानून आदि और इन तथा संबद्ध क्षेत्रों में उत्कृष्टता प्राप्त करना।" जिन व्यापक उद्देश्यों के लिए विश्वविद्यालय स्थापित किया गया था, उनकी पूर्ति हेतु विश्वविद्यालय ने अपने विज़न, मिशन एवं गुणवत्ता नीति के कथन निर्धारित किए हैं जो निम्नानुसार हैं:',

      pillars: [
        {
          id: "vision",
          title: "दृष्टिकोण (VISION)",
          icon: Eye,
          content:
            "विश्वविद्यालय विद्वानों के हृदय और मस्तिष्क दोनों को प्रेरित करेगा, उन्हें व्यापक समाज के कल्याण में योगदान देने के लिए सशक्त बनाएगा, अर्थव्यवस्था की बदलती आवश्यकताओं के अनुरूप स्वयं को ढालने के लिए प्रशिक्षित करेगा तथा सभी के लिए शांति, सद्भाव और समृद्धि सुनिश्चित करने हेतु सांस्कृतिक नेतृत्व को बढ़ावा देगा।",
        },
        {
          id: "mission",
          title: "ध्येय (MISSION)",
          icon: Target,
          content:
            "गुरु गोबिंद सिंह इंद्रप्रस्थ विश्वविद्यालय भारत और विशेष रूप से दिल्ली के छात्र समुदाय को बाजारोन्मुखी व्यावसायिक शिक्षा प्रदान करने हेतु निरंतर प्रयासरत रहेगा। यह स्कूलों और कॉलेजों को उत्कृष्टता के शिक्षण केंद्रों के रूप में स्थापित कर शिक्षा की सेवा करेगा तथा भारतीय उद्योगों की आवश्यकताओं को पूरा करेगा। विश्वविद्यालय इंजीनियरिंग, प्रौद्योगिकी, चिकित्सा, शिक्षा, फार्मेसी, नर्सिंग, कानून आदि क्षेत्रों में व्यावसायिक शिक्षा पर ध्यान केंद्रित करेगा।",
        },
        {
          id: "quality",
          title: "गुणवत्ता नीति (QUALITY POLICY)",
          icon: ShieldCheck,
          content:
            "गुरु गोबिंद सिंह इंद्रप्रस्थ विश्वविद्यालय अपनी प्रभावी गुणवत्ता प्रबंधन प्रणाली के माध्यम से ज्ञान सृजन और प्रसार हेतु रचनात्मकता, नवाचार, निरंतर परिवर्तन और प्रेरणादायक वातावरण पर बल देते हुए गुणवत्तापूर्ण व्यावसायिक शिक्षा प्रदान करने के लिए प्रतिबद्ध है।",
        },
      ],
      portalBtn: "आधिकारिक जीजीएसआईपीयू पोर्टल देखें",
      affiliationNote: "हरियाणा शक्ति कॉलेज ऑफ एजुकेशन बी.एड. हेतु जीजीएसआईपीयू दिल्ली से स्थायी रूप से संबद्ध है (वार्षिक स्वीकृत सीटें: 100)",
    },
  };

  const content = isHindi ? universityData.hi : universityData.en;

  return (
    <section className="py-14 sm:py-16 bg-[#F8F9FA] border-y border-[#E6E9F0] relative overflow-hidden">
      {/* Background Subtle Watermark Crest */}
      <div
        className="absolute -right-20 -bottom-20 w-96 h-96 opacity-[0.03] pointer-events-none select-none"
        aria-hidden="true"
      >
        <img
          src={universityData.logoUrl}
          alt=""
          className="w-full h-full object-contain grayscale"
        />
      </div>

      <Container>
        {/* Top Header Eyebrow */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[#194178] text-[11px] font-bold uppercase tracking-wider font-poppins">
            <Building2 size={13} className="text-[#c8102e]" />
            <span>{content.eyebrow}</span>
          </div>

          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-2xs">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>{content.badge}</span>
          </span>
        </div>

        {/* Main 2-Column Content: Left Campus Photo + Right University Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-8">
          {/* Left: University Campus Photo */}
          <div className="lg:col-span-5">
            <div className="relative group rounded-2xl overflow-hidden shadow-md border-2 border-white bg-white">
              <img
                src={universityData.campusImage}
                alt="Guru Gobind Singh Indraprastha University (GGSIPU) Campus"
                className="w-full h-auto max-h-[340px] sm:max-h-[380px] object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />

              {/* Gradient Scrim & Identification Ribbon */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/10 flex flex-col justify-end p-4 sm:p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white p-1 shrink-0 shadow-md">
                    <img
                      src={universityData.logoUrl}
                      alt="GGSIPU Crest"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-white">
                    <p className="font-poppins font-bold text-xs sm:text-sm drop-shadow-sm leading-tight">
                      GGS Indraprastha University
                    </p>
                    <p className="text-[11px] text-white/80 font-sans">
                      Sector 16-C, Dwarka, New Delhi – 110078
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Statutory Establishment & Objective */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold font-serif leading-tight text-[#194178] mb-4">
              {content.titleLead}{" "}
              <span className="text-[#c8102e]">{content.titleAccent}</span>
            </h2>

            <div className="space-y-3.5 text-xs sm:text-sm text-slate-700 font-sans leading-relaxed text-justify">
              <p className="bg-white/80 p-3.5 rounded-xl border border-gray-200/80 shadow-2xs">
                {content.para1}
              </p>
              <p>
                {content.para2}
              </p>
            </div>
          </div>
        </div>

        {/* Connecting Broad-Purpose Statement */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200/90 shadow-2xs mb-8 text-xs sm:text-sm text-slate-700 font-sans leading-relaxed text-justify">
          <p>{content.para3}</p>
        </div>

        {/* 3 Synchronized Color Cards: Vision, Mission & Quality Policy */}
        <div className="space-y-5">
          {content.pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                className="rounded-2xl overflow-hidden border border-[#E6E9F0] bg-white shadow-xs transition hover:shadow-md"
              >
                {/* Synced Header Bar: Rich Collegiate Crimson with Gold Accent Indicator */}
                <div className="bg-gradient-to-r from-[#c8102e] via-[#b50e29] to-[#990c22] text-white px-5 sm:px-6 py-3 flex items-center justify-between gap-3 border-b-2 border-[#FBDD23]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center shrink-0 text-[#FBDD23]">
                      <Icon size={16} />
                    </div>
                    <h3 className="font-poppins font-bold text-sm sm:text-base tracking-wider uppercase">
                      {pillar.title}
                    </h3>
                  </div>

                  <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-200 bg-black/20 px-2.5 py-0.5 rounded-full hidden sm:inline-block">
                    GGSIPU Core Directive
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-5 sm:p-6 text-xs sm:text-sm text-slate-700 font-sans leading-relaxed text-justify">
                  <p>{pillar.content}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Institutional Verification Footnote & Portal Redirect */}
        <div className="mt-8 pt-5 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <Sparkles size={16} className="text-[#c8102e] shrink-0" />
            <p className="font-medium text-slate-700">
              {content.affiliationNote}
            </p>
          </div>

          <a
            href={universityData.portalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#194178] hover:bg-[#122e56] text-white font-poppins font-semibold text-xs transition shadow-2xs shrink-0"
          >
            <span>{content.portalBtn}</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </Container>
    </section>
  );
}

export default UniversityAffiliationSection;

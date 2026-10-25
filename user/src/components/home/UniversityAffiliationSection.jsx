import React from "react";
import {
  ExternalLink,
  Award,
  ShieldCheck,
  Building2,
  Eye,
  Target,
  CheckCircle2,
} from "lucide-react";
import { Container } from "../common/Container";
import { useLanguage } from "../../context/LanguageContext";
import { imageData } from "../../data/imagesData";

export function UniversityAffiliationSection() {
  const { isHindi } = useLanguage();

  const universityData = {
    campusImage:
      "https://res.cloudinary.com/dljt6vgkk/image/upload/v1792904388/e1e2e5a9-77dd-4b2e-9142-acaeaff75b79.png",
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
          title: "Quality Policy",
          icon: ShieldCheck,
          content:
            "Guru Gobind Singh Indraprastha University is committed to providing professional education with thrust on creativity, innovation, continuous change and motivating environment for knowledge creation and dissemination through its effective quality management system.",
        },
      ],
      portalBtn: "Visit Official GGSIPU Portal (ipu.ac.in)",
      affiliationBadge:
        "HSCE Affiliation Code: 147 • Approved B.Ed. Intake: 100 Seats",
    },

    hi: {
      eyebrow: "वैधानिक विश्वविद्यालय संबद्धता",
      titleLead: "गुरु गोबिंद सिंह",
      titleAccent: "इंद्रप्रस्थ विश्वविद्यालय (GGSIPU)",
      badge: "दिल्ली सरकार • यूजीसी 12B मान्यता प्राप्त",
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
          title: "गुणवत्ता नीति (Quality Policy)",
          icon: ShieldCheck,
          content:
            "गुरु गोबिंद सिंह इंद्रप्रस्थ विश्वविद्यालय अपनी प्रभावी गुणवत्ता प्रबंधन प्रणाली के माध्यम से ज्ञान सृजन और प्रसार हेतु रचनात्मकता, नवाचार, निरंतर परिवर्तन और प्रेरणादायक वातावरण पर बल देते हुए गुणवत्तापूर्ण व्यावसायिक शिक्षा प्रदान करने के लिए प्रतिबद्ध है।",
        },
      ],
      portalBtn: "आधिकारिक जीजीएसआईपीयू पोर्टल (ipu.ac.in) देखें",
      affiliationBadge:
        "HSCE संबद्धता कोड: 147 • बी.एड. स्वीकृत वार्षिक सीटें: 100",
    },
  };

  const content = isHindi ? universityData.hi : universityData.en;

  return (
    <section className="relative overflow-hidden border-y border-slate-200/80 bg-[radial-gradient(circle_at_top_left,_rgba(247,201,72,0.14),transparent_28%),linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)] py-12 sm:py-16 font-sans">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,75,140,0.025),transparent_18%,transparent_82%,rgba(200,16,46,0.025))]" />

      <Container>
        <div className="relative mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#0a4b8c]">
              {content.eyebrow}
            </p>
            <h2 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-3xl lg:text-[32px]">
              {content.titleLead}{" "}
              <span className="font-extrabold text-[#0a4b8c]">
                {content.titleAccent}
              </span>
            </h2>
            <div className="mt-3 h-0.5 w-12 rounded-full bg-[#FBDD23]" />
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0a4b8c]/15 bg-[#0a4b8c]/5 px-3.5 py-1.5 text-xs font-semibold text-[#0a4b8c] shadow-xs">
              <ShieldCheck size={14} className="shrink-0 text-[#0a4b8c]" />
              <span>{content.badge}</span>
            </span>

            <a
              href={universityData.portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-lg border border-[#0a4b8c]/20 bg-[#0a4b8c] px-4 py-2 text-xs font-bold text-white shadow-[0_12px_24px_rgba(10,75,140,0.18)] transition hover:bg-[#083a6f]">
              <span>{content.portalBtn}</span>
              <ExternalLink
                size={13}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </a>
          </div>
        </div>

        <div className="relative mb-6 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="group relative h-full overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_18px_38px_rgba(15,23,42,0.08)]">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#FBDD23] via-[#0a4b8c] to-[#c8102e]" />

              <img
                src={universityData.campusImage}
                alt="Guru Gobind Singh Indraprastha University (GGSIPU) Campus"
                className="h-full max-h-[320px] w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:max-h-[360px]"
                loading="lazy"
              />

              <div className="flex items-center justify-between border-t border-slate-100 bg-[#f4f7fb] p-3 text-xs font-medium text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Building2 size={14} className="text-[#c8102e]" />
                  <span>Main Campus: Dwarka, New Delhi</span>
                </span>
                <span className="rounded-full border border-[#0a4b8c]/20 bg-white px-2.5 py-0.5 text-[11px] font-bold text-[#0a4b8c]">
                  Estd. 1998
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-4 lg:col-span-7">
            <div className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_14px_30px_rgba(15,23,42,0.04)] sm:p-6">
              <div className="mb-3 flex items-center gap-2">
                <div className="h-10 w-10 rounded-xl bg-[#0a4b8c]/10 p-2 text-[#0a4b8c]">
                  <Award size={18} className="h-full w-full" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#0a4b8c]">
                  Institutional Legacy
                </span>
              </div>

              <div className="space-y-4 text-justify text-sm leading-relaxed text-slate-700 sm:text-base">
                <p className="rounded-xl bg-[#f7faff] p-4 text-slate-700 ring-1 ring-slate-200/80">
                  {content.para1}
                </p>
                <p>{content.para2}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-10 rounded-[24px] border border-slate-200/80 bg-white p-5 text-justify text-sm leading-relaxed text-slate-700 shadow-[0_12px_25px_rgba(15,23,42,0.04)] sm:p-6 sm:text-base">
          <p>{content.para3}</p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          {[
            {
              label: "Founded",
              value: "1998",
              tone: "bg-[#0a4b8c] text-white",
            },
            {
              label: "UGC Status",
              value: "12B",
              tone: "bg-[#FBDD23] text-[#0c1b33]",
            },
            {
              label: "Affiliation",
              value: "HSCE • 147",
              tone: "bg-[#c8102e] text-white",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`rounded-2xl border border-slate-200/80 p-4 shadow-sm ${stat.tone}`}>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">
                {stat.label}
              </p>
              <p className="mt-2 text-2xl font-extrabold tracking-tight">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {content.pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_12px_28px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(15,23,42,0.08)]">
                <div className="flex items-center justify-between gap-3 border-b-2 border-[#FBDD23] bg-gradient-to-r from-[#0a4b8c] to-[#123f7b] px-5 py-3 text-white sm:px-6">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/10">
                      <Icon size={16} className="shrink-0 text-[#FBDD23]" />
                    </span>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white sm:text-base">
                      {pillar.title}
                    </h3>
                  </div>
                </div>

                <div className="bg-white p-5 text-justify text-sm leading-relaxed text-slate-700 sm:p-6 sm:text-[15px]">
                  <p>{pillar.content}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export default UniversityAffiliationSection;

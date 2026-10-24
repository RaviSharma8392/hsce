import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { Container } from "../common/Container";
import { galleryItems } from "../../data/siteData";

const MOSAIC_LAYOUTS = {
  5: [
    "col-span-2 row-span-2 lg:col-span-1 lg:col-start-1 lg:row-start-1",
    "lg:col-start-2 lg:row-start-1",
    "lg:col-span-2 lg:col-start-3 lg:row-start-1",
    "lg:col-start-5 lg:row-start-1",
    "lg:col-span-4 lg:col-start-2 lg:row-start-2",
  ],
  6: [
    "col-span-2 row-span-2 lg:col-span-1 lg:col-start-1 lg:row-start-1",
    "lg:col-start-2 lg:row-start-1",
    "lg:col-span-2 lg:col-start-3 lg:row-start-1",
    "lg:col-start-5 lg:row-start-1",
    "lg:col-span-2 lg:col-start-2 lg:row-start-2",
    "col-span-2 lg:col-span-2 lg:col-start-4 lg:row-start-2",
  ],
};

const easeOutExpo = (t) => (t === 1 ? 1 : 1 - 2 ** (-10 * t));

function AnimatedNumber({ value, run, delay = 0, duration = 1600 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !run) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = String(value);
      return;
    }

    let frameId;
    const startAt = performance.now() + delay;

    const tick = (now) => {
      const progress = Math.min(Math.max((now - startAt) / duration, 0), 1);

      el.textContent = String(Math.round(value * easeOutExpo(progress)));

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [run, value, delay, duration]);

  return <span ref={ref}>0</span>;
}

export function StatsCounterWidget() {
  const { isHindi } = useLanguage();
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  const stats = [
    {
      value: 14,
      suffix: "+",
      unit: isHindi ? "वर्ष" : "Years",
      label: isHindi ? "शैक्षणिक उत्कृष्टता का इतिहास" : "Legacy of Excellence",
      subLabel: isHindi ? "स्थापना वर्ष 2012" : "Estd. 2012 in Kanjhawala",
      image: galleryItems[0]?.image,
    },
    {
      value: 100,
      suffix: "%",
      label: isHindi ? "एनसीटीई एवं जीजीएसआईपीयू" : "NCTE & GGSIPU",
      subLabel: isHindi
        ? "पूर्ण वैधानिक मान्यता प्राप्त"
        : "Approved & Affiliated",
      image: galleryItems[0]?.image,
    },
    {
      value: 1250,
      suffix: "+",
      label: isHindi ? "सफल प्रशिक्षित शिक्षक" : "Qualified Educators",
      subLabel: isHindi ? "राष्ट्र निर्माण में कार्यरत" : "Graduated & Serving",
      image: galleryItems[1]?.image,
    },
    {
      value: 25,
      suffix: "+",
      label: isHindi ? "संबद्ध इंटर्नशिप विद्यालय" : "Practice Partner Schools",
      subLabel: isHindi ? "गहन व्यावहारिक प्रशिक्षण" : "16-Week Real Immersion",
      image: galleryItems[2]?.image,
    },
    {
      value: 100,
      suffix: "%",
      label: isHindi ? "सीटीईटी/टीईटी मार्गदर्शन" : "CTET & TET Guidance",
      subLabel: isHindi ? "नियमित मॉक व कोचिंग" : "Special Mentorship Sessions",
      image: galleryItems[3]?.image,
    },
  ];

  const layout = MOSAIC_LAYOUTS[stats.length] ?? MOSAIC_LAYOUTS[5];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label={isHindi ? "महाविद्यालय एक नज़र में" : "HSCE at a glance"}
      data-stats-visible={visible ? "true" : "false"}
      className="home-animated-section relative bg-white py-8 sm:py-10 lg:py-12">
      <Container>
        <div
          className="
            grid grid-cols-2 gap-2.5
            auto-rows-[145px]
            min-[420px]:auto-rows-[160px]
            sm:gap-3 sm:auto-rows-[175px]
            md:auto-rows-[190px]
            lg:grid-cols-5 lg:gap-4 lg:auto-rows-[180px]
            xl:gap-5 xl:auto-rows-[210px]
          ">
          {stats.map((stat, index) => (
            <article
              key={stat.label}
              style={{ "--stats-delay": `${index * 100}ms` }}
              className={`
                stats-card group relative isolate min-w-0
                overflow-hidden rounded-xl
                bg-[#0b2a5c] text-white
                shadow-[0_8px_24px_-14px_rgba(11,42,92,0.65)]
                sm:rounded-2xl
                ${layout[index] ?? ""}
              `}>
              {/* Background image */}
              {stat.image && (
                <img
                  src={stat.image}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="
                    absolute inset-0 h-full w-full object-cover
                    transition-transform duration-700 ease-out
                    group-hover:scale-105
                  "
                />
              )}

              {/* Blue overlay */}
              <div className="absolute inset-0 bg-[#17477d]/45 mix-blend-multiply" />

              {/* Text readability gradient */}
              <div
                className="
                  absolute inset-0
                  bg-gradient-to-b
                  from-[#071d42]/90
                  via-[#0b2a5c]/55
                  to-[#0b2a5c]/15
                "
              />

              {/* Card content */}
              <div
                className="
                  relative z-10 flex h-full min-w-0 flex-col
                  items-start p-3
                  min-[420px]:p-3.5
                  sm:p-4 md:p-5
                  lg:p-4 xl:p-5
                ">
                <div className="flex max-w-full flex-wrap items-baseline gap-x-1.5 gap-y-1">
                  <span className="sr-only">
                    {`${stat.value}${stat.suffix} ${stat.unit ?? ""}`}
                  </span>

                  <span
                    aria-hidden="true"
                    className="
                      flex items-baseline
                      text-3xl font-extrabold leading-none tracking-tight
                      tabular-nums
                      min-[420px]:text-4xl
                      sm:text-4xl md:text-5xl
                      lg:text-4xl xl:text-5xl
                    ">
                    <AnimatedNumber
                      value={stat.value}
                      run={visible}
                      delay={index * 100 + 200}
                    />

                    {/* Navbar yellow/gold accent */}
                    <span className="text-[#facc15]">{stat.suffix}</span>
                  </span>

                  {stat.unit && (
                    <span
                      aria-hidden="true"
                      className="
                        text-xs font-bold text-[#fde68a]
                        min-[420px]:text-sm
                        sm:text-sm md:text-base
                      ">
                      {stat.unit}
                    </span>
                  )}
                </div>

                <h3
                  className="
                    mt-2 max-w-full break-words
                    text-xs font-semibold leading-snug text-white
                    min-[420px]:text-sm
                    sm:text-sm md:text-base
                    lg:text-sm xl:text-base
                  ">
                  {stat.label}
                </h3>

                <p
                  className="
                    mt-1 max-w-full break-words
                    text-[11px] leading-relaxed text-white/85
                    min-[420px]:text-xs
                    sm:text-xs md:text-sm
                    lg:text-xs xl:text-sm
                  ">
                  {stat.subLabel}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Container>

      <style>{`
        .stats-card {
          opacity: 0;
        }

        [data-stats-visible="true"] .stats-card {
          opacity: 1;
          animation: stats-card-in 700ms
            cubic-bezier(0.22, 1, 0.36, 1)
            var(--stats-delay) backwards;
        }

        @keyframes stats-card-in {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.985);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .stats-card {
            opacity: 1;
            animation: none !important;
          }

          .stats-card img {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}

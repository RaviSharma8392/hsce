import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, Camera } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { Container } from "../common/Container";
import { imageData } from "../../data/imagesData";

function useInView() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      typeof IntersectionObserver === "undefined"
    ) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}

function GalleryCell({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

/* Gentle automatic image slideshow */
function AutoFadingImage({ images, interval = 4500 }) {
  const [index, setIndex] = useState(0);
  const [ref, started] = useInView();

  useEffect(() => {
    if (
      !started ||
      images.length < 2 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % images.length);
    }, interval);

    return () => window.clearInterval(timer);
  }, [started, images.length, interval]);

  return (
    <div
      ref={ref}
      className="gallery-image relative h-full w-full overflow-hidden bg-gray-100">
      {images.map((image, imageIndex) => {
        const isActive = index === imageIndex;

        return (
          <img
            key={image.src}
            src={image.src}
            alt={image.alt}
            aria-hidden={!isActive}
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
          />
        );
      })}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

      {images.length > 1 && (
        <div className="absolute bottom-4 left-4 z-10 flex gap-1.5">
          {images.map((_, dotIndex) => (
            <button
              key={dotIndex}
              type="button"
              aria-label={`Show gallery image ${dotIndex + 1}`}
              aria-pressed={dotIndex === index}
              onClick={() => setIndex(dotIndex)}
              className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40 ${
                dotIndex === index ? "w-6 bg-[#F4D46A]" : "w-2 bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CampusGallerySection() {
  const { isHindi } = useLanguage();

  const mainImages = [
    {
      src: imageData.campusOutdoor,
      alt: "Tree-lined entrance to Haryana Shakti College of Education",
    },
    {
      src: imageData.campusHero,
      alt: "Haryana Shakti College of Education campus entrance",
    },
  ];

  const topRightImages = [
    {
      src: imageData.studentDiscussion,
      alt: "Student-teachers discussing coursework together",
    },
    {
      src: imageData.principalStudentDiscussion,
      alt: "The principal meeting with students",
    },
  ];

  const bottomMiddleImages = [
    {
      src: imageData.computerLab,
      alt: "Students learning in the college computer laboratory",
    },
    {
      src: imageData.library,
      alt: "Bookshelves in the college library",
    },
  ];

  const bottomRightImages = [
    {
      src: imageData.studentCricket,
      alt: "Students playing cricket on the college grounds",
    },
    {
      src: imageData.studentCarrom,
      alt: "Students playing carrom in the college",
    },
  ];

  const cardClass =
    "h-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg";

  return (
    <section className="overflow-hidden bg-white py-12 font-sans sm:py-16 lg:py-20 border-t border-slate-200/80">
      <Container>
        <GalleryCell className="mb-8 flex flex-col justify-between gap-5 sm:mb-10 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-3xl lg:text-[34px]">
              {isHindi ? (
                <>
                  सीखने और साथ{" "}
                  <span className="text-[#0a4b8c]">बढ़ने के पल</span>
                </>
              ) : (
                <>
                  Life & Learning at{" "}
                  <span className="text-[#0a4b8c]">HSCE Campus</span>
                </>
              )}
            </h2>

            <div className="mt-3.5 h-0.5 w-12 rounded-full bg-[#FBDD23]" />

            <p className="mt-3 max-w-xl text-sm leading-relaxed text-gray-600 sm:text-base">
              {isHindi
                ? "परिसर के स्थानों, गतिविधियों और उन पलों की झलक जो हमारे कॉलेज जीवन को खास बनाते हैं।"
                : "A closer look at the people, places, curriculum labs and everyday moments that make campus life meaningful."}
            </p>
          </div>

          <Link
            to="/gallery"
            className="group inline-flex shrink-0 items-center gap-2 rounded-lg border border-[#0a4b8c]/20 bg-blue-50/50 px-4 py-2.5 text-sm font-semibold text-[#0a4b8c] transition-all duration-200 hover:bg-[#0a4b8c] hover:text-white hover:shadow-xs">
            <span>{isHindi ? "पूरी गैलरी देखें" : "Explore Full Gallery"}</span>
            <ArrowRight
              size={16}
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </GalleryCell>

        {/* Gallery grid */}
        <div className="grid auto-rows-[230px] grid-cols-1 gap-4 sm:auto-rows-[260px] sm:grid-cols-2 lg:auto-rows-[250px] lg:grid-cols-4 lg:gap-5">
          {/* Large feature image */}
          <GalleryCell className="h-[320px] sm:h-[360px] lg:col-span-2 lg:row-span-2 lg:h-full">
            <div className={`${cardClass} relative`}>
              <AutoFadingImage images={mainImages} interval={5000} />

              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/75 to-transparent px-5 pb-6 pt-16 sm:px-6">
                <span className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#F4D46A]">
                  <Camera size={14} />
                  {isHindi ? "कैंपस जीवन" : "Campus life"}
                </span>

                <h3 className="text-xl font-semibold text-white sm:text-2xl">
                  {isHindi
                    ? "सीखने और आगे बढ़ने का स्थान"
                    : "A place to learn and grow"}
                </h3>
              </div>
            </div>
          </GalleryCell>

          {/* Campus events card */}
          <GalleryCell className="min-h-[230px]">
            <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-[#0a4b8c] via-[#094179] to-[#062c55] border border-blue-900/40 p-6 text-white shadow-sm transition-all duration-300 hover:shadow-lg sm:p-7">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full border-[24px] border-white/5"
              />

              <div className="relative">
                <span className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-[#FBDD23]">
                  <Camera size={20} />
                </span>

                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#FBDD23]">
                  {isHindi ? "कॉलेज गतिविधियाँ" : "College activities"}
                </p>

                <h3 className="text-2xl font-bold leading-tight">
                  {isHindi
                    ? "कैंपस में क्या हो रहा है?"
                    : "What's happening on campus?"}
                </h3>
              </div>

              <Link
                to="/events"
                className="group relative mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-[#FBDD23]">
                <span>{isHindi ? "आगामी कार्यक्रम" : "Upcoming events"}</span>
                <ArrowRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-1 text-[#FBDD23]"
                />
              </Link>
            </div>
          </GalleryCell>

          {/* Image cards */}
          <GalleryCell className="min-h-[230px]">
            <div className={cardClass}>
              <AutoFadingImage images={topRightImages} interval={4800} />
            </div>
          </GalleryCell>

          <GalleryCell className="min-h-[230px]">
            <div className={cardClass}>
              <AutoFadingImage images={bottomMiddleImages} interval={5200} />
            </div>
          </GalleryCell>

          <GalleryCell className="min-h-[230px]">
            <div className={cardClass}>
              <AutoFadingImage images={bottomRightImages} interval={4900} />
            </div>
          </GalleryCell>
        </div>
      </Container>

      <style>{`
        @media (hover: hover) and (prefers-reduced-motion: no-preference) {
          .gallery-image img {
            transition: opacity 500ms ease, transform 700ms ease;
          }

          .gallery-image:hover img.opacity-100 {
            transform: scale(1.035);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .gallery-image img {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}

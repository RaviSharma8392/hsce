import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  ArrowDownRight,
  ArrowRight,
  BookOpen,
  Camera,
  Check,
  GraduationCap,
  MessageSquareText,
  Users,
  X,
} from "lucide-react";

import { Container } from "../components/common/Container";
import { PageHeaderBanner } from "../components/common/PageHeaderBanner";
import { imageData, imageFallbacks } from "../data/imagesData";

const COLORS = {
  navy: "#292C75",
  blue: "#363991",
  yellow: "#FBDD23",
  text: "#25283A",
  muted: "#626879",
  border: "#E5E7EB",
  background: "#F7F8FA",
};

const campusPhotos = [
  {
    title: "Computer Laboratory",
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

function SectionIntro({ eyebrow, title, description, action }) {
  return (
    <header className="max-w-3xl">
      <p className="mb-3 flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.14em] text-[#363991]">
        <span
          aria-hidden="true"
          className="h-[3px] w-7 shrink-0 bg-[#FBDD23]"
        />
        {eyebrow}
      </p>

      <h2 className="text-2xl font-bold leading-tight tracking-tight text-[#25283A] sm:text-3xl lg:text-[34px]">
        {title}
      </h2>

      {description && (
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#626879] sm:text-base sm:leading-8">
          {description}
        </p>
      )}

      {action}
    </header>
  );
}

function CampusPhoto({ photo, index, onOpen }) {
  const [failed, setFailed] = useState(false);

  const sizeClasses = {
    feature: "sm:col-span-2 sm:row-span-2",
    standard: "",
    wide: "sm:col-span-2",
  };

  return (
    <button
      type="button"
      onClick={() => onOpen(photo)}
      aria-label={`View ${photo.title} photo`}
      className={`group relative block h-full min-h-[230px] w-full overflow-hidden border border-[#E5E7EB] bg-[#F1F2F6] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#363991] ${
        sizeClasses[photo.size] || ""
      }`}>
      {!failed ? (
        <img
          src={photo.image}
          alt={photo.alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.035]"
        />
      ) : (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#F1F2F6] p-5 text-center text-[#626879]"
          aria-hidden="true">
          <Camera size={25} strokeWidth={1.5} />
          <span className="text-sm font-medium">{photo.title}</span>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-[#17182D]/85 via-[#17182D]/10 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#FBDD23]">
          {photo.category}
        </p>

        <div className="flex items-end justify-between gap-3">
          <span className="text-base font-semibold leading-snug text-white sm:text-lg">
            {photo.title}
          </span>

          <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/50 text-white transition-colors group-hover:border-[#FBDD23] group-hover:bg-[#FBDD23] group-hover:text-[#25283A]">
            <ArrowRight size={17} />
          </span>
        </div>
      </div>

      <span className="absolute right-3 top-3 flex h-7 min-w-7 items-center justify-center bg-[#292C75]/90 px-1.5 text-[10px] font-semibold text-white">
        {String(index + 1).padStart(2, "0")}
      </span>
    </button>
  );
}

function CampusPhotoViewer({ photo, onClose }) {
  useEffect(() => {
    if (!photo) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [photo, onClose]);

  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#17182D]/95 p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={photo.title}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}>
      <div className="w-full max-w-5xl">
        <div className="mb-4 flex items-center justify-between gap-4 text-white">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#FBDD23]">
              Haryana Shakti College of Education
            </p>
            <h3 className="mt-1 text-lg font-semibold sm:text-xl">
              {photo.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/30 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBDD23]"
            aria-label="Close photo viewer">
            <X size={21} />
          </button>
        </div>

        <img
          src={photo.image}
          alt={photo.alt}
          className="max-h-[75vh] w-full bg-[#17182D] object-contain"
        />
      </div>
    </div>
  );
}

export default function CampusLifePage() {
  const [activePhoto, setActivePhoto] = useState(null);

  return (
    <>
      <Helmet>
        <title>Campus Life | Haryana Shakti College of Education</title>
        <meta
          name="description"
          content="Discover campus life at Haryana Shakti College of Education, Kanjhawala, Delhi. Explore learning spaces, student activities and the college community."
        />
        <meta name="theme-color" content={COLORS.navy} />
      </Helmet>

      <PageHeaderBanner
        title="Campus Life"
        subtitle="A place to learn, connect and find your own perspective"
        breadcrumbs={[{ label: "Campus Life" }]}
      />

      <main className="overflow-hidden bg-white font-sans text-[#25283A]">
        {/* INTRODUCTION */}
        <section className="py-10 sm:py-14 lg:py-16">
          <Container>
            <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
              <div>
                <SectionIntro
                  eyebrow="Life at Haryana Shakti"
                  title="A place where learning feels meaningful."
                  description="College life is shaped by more than lessons and lectures. It grows through conversations, shared experiences, new ideas and the confidence to see things differently."
                />

                <p className="mt-4 max-w-2xl text-sm leading-7 text-[#626879] sm:text-base sm:leading-8">
                  At Haryana Shakti College of Education, these everyday
                  experiences form part of the journey towards becoming
                  thoughtful, capable and responsible educators.
                </p>

                <a
                  href="#campus-gallery"
                  className="mt-6 inline-flex items-center gap-2 border-b-2 border-[#FBDD23] pb-2 text-sm font-semibold text-[#363991] transition-colors hover:text-[#292C75]">
                  Explore campus life
                  <ArrowDownRight size={17} />
                </a>
              </div>

              <figure className="min-w-0">
                <div className="relative aspect-[4/3] overflow-hidden border border-[#E5E7EB] bg-[#F1F2F6] sm:aspect-[16/11]">
                  <img
                    src={imageData.campusHero}
                    alt="Campus entrance at Haryana Shakti College of Education"
                    fetchPriority="high"
                    decoding="async"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = imageFallbacks.campusHero;
                    }}
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#17182D]/75 via-transparent to-transparent" />

                  <figcaption className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#FBDD23]">
                      Our campus
                    </p>
                    <p className="mt-2 text-xl font-semibold sm:text-2xl">
                      Space to learn. Room to grow.
                    </p>
                  </figcaption>
                </div>
                <figcaption className="mt-3 flex items-center gap-2 text-xs text-[#626879]">
                  <span className="h-1.5 w-1.5 bg-[#FBDD23]" />
                  Haryana Shakti College of Education
                </figcaption>
              </figure>
            </div>
          </Container>
        </section>

        {/* CAMPUS VALUES */}
        <section className="border-y border-[#E5E7EB] bg-[#F7F8FA]">
          <Container>
            <div className="grid divide-y divide-[#E5E7EB] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              <div className="flex items-start gap-4 py-5 sm:px-5 sm:py-6 sm:first:pl-0">
                <BookOpen
                  size={22}
                  strokeWidth={1.7}
                  className="mt-0.5 shrink-0 text-[#363991]"
                />
                <div>
                  <h2 className="text-sm font-bold text-[#25283A]">
                    A culture of learning
                  </h2>
                  <p className="mt-1 text-xs leading-5 text-[#626879]">
                    Curiosity beyond the classroom
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 py-5 sm:px-5 sm:py-6">
                <Users
                  size={22}
                  strokeWidth={1.7}
                  className="mt-0.5 shrink-0 text-[#363991]"
                />
                <div>
                  <h2 className="text-sm font-bold text-[#25283A]">
                    Learning together
                  </h2>
                  <p className="mt-1 text-xs leading-5 text-[#626879]">
                    Ideas shaped through conversation
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 py-5 sm:px-5 sm:py-6 sm:last:pr-0">
                <GraduationCap
                  size={23}
                  strokeWidth={1.7}
                  className="mt-0.5 shrink-0 text-[#363991]"
                />
                <div>
                  <h2 className="text-sm font-bold text-[#25283A]">
                    Growing with purpose
                  </h2>
                  <p className="mt-1 text-xs leading-5 text-[#626879]">
                    Confidence, values and responsibility
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* CAMPUS GALLERY */}
        <section
          id="campus-gallery"
          className="scroll-mt-20 py-10 sm:py-14 lg:py-16">
          <Container>
            <div className="mb-7 flex flex-col justify-between gap-5 sm:mb-9 sm:flex-row sm:items-end">
              <SectionIntro
                eyebrow="A glimpse of everyday life"
                title="The moments that make a campus."
                description="From focused learning to time spent together, explore the spaces and experiences that shape life at Haryana Shakti."
              />

              <div className="flex shrink-0 items-center gap-3 border-t border-[#E5E7EB] pt-3 sm:mb-1">
                <Camera
                  size={18}
                  strokeWidth={1.7}
                  className="text-[#363991]"
                />
                <span className="text-xs text-[#626879]">Campus gallery</span>
                <span className="border-l border-[#E5E7EB] pl-3 text-xs font-bold text-[#25283A]">
                  {String(campusPhotos.length).padStart(2, "0")} photos
                </span>
              </div>
            </div>

            <div className="grid auto-rows-[230px] grid-cols-1 gap-3 sm:auto-rows-[185px] sm:grid-cols-2 sm:gap-4 lg:auto-rows-[205px] lg:grid-cols-4">
              {campusPhotos.map((photo, index) => (
                <CampusPhoto
                  key={photo.title}
                  photo={photo}
                  index={index}
                  onOpen={setActivePhoto}
                />
              ))}
            </div>

            <div className="mt-5 flex items-start gap-2 text-xs leading-5 text-[#626879]">
              <Camera size={15} className="mt-0.5 shrink-0 text-[#363991]" />
              <p>Select any photograph to view it in a larger format.</p>
            </div>
          </Container>
        </section>

        {/* SHIKSHA SAMVAAD */}
        <section className="bg-[#363991] py-10 text-white sm:py-14 lg:py-16">
          <Container>
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
              <div>
                <p className="mb-4 flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.14em] text-[#FBDD23]">
                  <span className="h-[3px] w-7 bg-[#FBDD23]" />
                  Dialogue · Ideas · Possibility
                </p>

                <p className="mb-3 text-sm text-white/70">
                  An initiative for meaningful conversations
                </p>

                <h2 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-[56px]">
                  Shiksha
                  <br />
                  <span className="font-medium text-[#FBDD23]">Samvaad</span>
                </h2>

                <p className="mt-4 text-lg font-medium text-white/90 sm:text-xl">
                  Ek Nayi Soch
                </p>
              </div>

              <div className="border-t border-white/20 pt-7 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
                <MessageSquareText
                  size={27}
                  strokeWidth={1.6}
                  className="mb-5 text-[#FBDD23]"
                />

                <p className="max-w-2xl text-lg leading-8 text-white sm:text-xl sm:leading-9">
                  Education moves forward when people come together to ask
                  questions, exchange perspectives and learn from one another.
                </p>

                <p className="mt-4 max-w-xl text-sm leading-7 text-white/75">
                  Through interactive forums and national webinars, Shiksha
                  Samvaad brings educators, experts and students into
                  conversations about life skills, values and education in the
                  21st century.
                </p>

                <p className="mt-4 max-w-xl text-xs leading-6 text-white/60">
                  Organised in association with EdVantage 360 Solutions, these
                  conversations encourage thoughtful participation, intellectual
                  exchange and responsible citizenship.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* STUDENT EXPERIENCE */}
        <section className="py-10 sm:py-14 lg:py-16">
          <Container>
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
              <div>
                <SectionIntro
                  eyebrow="Beyond the timetable"
                  title="An environment that helps you grow."
                  description="The experiences we share, the questions we ask and the people we learn from all contribute to becoming a more thoughtful educator."
                />

                <div className="mt-6 hidden border-l-[3px] border-[#FBDD23] bg-[#F7F8FA] py-4 pl-5 pr-4 sm:block">
                  <p className="text-sm italic leading-7 text-[#626879]">
                    Learning is not only about what we know, but also about how
                    we understand, collaborate and contribute.
                  </p>
                </div>
              </div>

              <div className="border-t border-[#E5E7EB]">
                {studentBenefits.map((benefit) => (
                  <article
                    key={benefit.number}
                    className="group grid grid-cols-[34px_1fr_18px] gap-3 border-b border-[#E5E7EB] py-5 sm:grid-cols-[44px_1fr_20px] sm:gap-4 sm:py-6">
                    <span className="pt-1 text-xs font-bold tabular-nums text-[#363991]">
                      {benefit.number}
                    </span>

                    <div>
                      <h3 className="text-base font-bold text-[#25283A] transition-colors group-hover:text-[#363991] sm:text-lg">
                        {benefit.title}
                      </h3>
                      <p className="mt-2 max-w-xl text-sm leading-7 text-[#626879]">
                        {benefit.description}
                      </p>
                    </div>

                    <Check
                      size={17}
                      strokeWidth={1.8}
                      className="mt-1 text-[#363991] opacity-50 transition-opacity group-hover:opacity-100"
                    />
                  </article>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* CLOSING STATEMENT */}
        <section className="border-t border-[#E5E7EB] bg-[#F7F8FA] py-10 sm:py-14 lg:py-16">
          <Container>
            <div className="grid gap-5 lg:grid-cols-[150px_1fr] lg:gap-10">
              <div className="flex items-start gap-2.5">
                <span className="mt-1 h-[3px] w-7 shrink-0 bg-[#FBDD23]" />
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#363991]">
                  Our philosophy
                </p>
              </div>

              <div>
                <p className="max-w-4xl text-2xl font-bold leading-[1.4] tracking-tight text-[#25283A] sm:text-3xl lg:text-[40px]">
                  Education is the beginning of a journey — towards greater
                  understanding,{" "}
                  <span className="font-semibold text-[#363991]">
                    meaningful relationships
                  </span>{" "}
                  and the ability to make a difference.
                </p>

                <div className="mt-6 flex items-center gap-3">
                  <span className="h-[3px] w-7 bg-[#FBDD23]" />
                  <p className="text-xs font-semibold text-[#626879]">
                    Haryana Shakti College of Education
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <CampusPhotoViewer
        photo={activePhoto}
        onClose={() => setActivePhoto(null)}
      />
    </>
  );
}

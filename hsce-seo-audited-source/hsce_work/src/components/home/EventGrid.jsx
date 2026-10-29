import React, { useState, useEffect } from "react";
import { Container } from "../common/Container";
import { imageData } from "../../data/imagesData";

// Grouped images for each block so they cycle automatically
const EVENTS = [
  {
    id: 1,
    layout: "lg:col-span-2 lg:row-span-2",
    images: [imageData.event5, imageData.event4, imageData.event1],
  },
  {
    id: 2,
    layout: "",
    images: [imageData.event6, imageData.event2, imageData.event8],
  },
  {
    id: 3,
    layout: "",
    images: [imageData.event8, imageData.event6, imageData.event1],
  },
  {
    id: 4,
    layout: "",
    images: [imageData.event5, imageData.event2, imageData.event6],
  },
  {
    id: 5,
    layout: "",
    images: [imageData.event3, imageData.event5, imageData.event1],
  },
  {
    id: 6,
    layout: "lg:col-span-2",
    images: [imageData.event8, imageData.event9, imageData.event5],
  },
];

const EventGrid = () => {
  // State to track the currently active image index
  const [activeIndex, setActiveIndex] = useState(0);

  // Automatically change images every 3.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => prevIndex + 1);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full overflow-hidden bg-[#fafcff] py-10 font-sans sm:py-12 lg:py-16">
      <Container>
        {/* Section Heading (Original Text Colors Restored) */}
        <div className="mb-7 flex flex-col justify-between gap-4 sm:mb-9 sm:flex-row sm:items-end lg:mb-10">
          <div className="max-w-2xl">
            <div className="mb-2 flex items-center gap-2">
              <span className="h-[3px] w-6 shrink-0 rounded-full bg-[#FBDD23]" />
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0a4b8c]">
                Explore Our Campus
              </p>
            </div>

            <h2 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-3xl">
              Learning Beyond the Classroom
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
              Discover the spaces, activities and shared experiences that
              contribute to life at Haryana Shakti College of Education.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#0a4b8c] sm:shrink-0">
            <span className="h-px w-7 bg-[#0a4b8c]" />
            <span>Campus Life & Facilities</span>
          </div>
        </div>

        {/* Dynamic Bento Gallery Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:auto-rows-[240px] lg:grid-cols-4 lg:gap-5">
          {EVENTS.map((event) => (
            <div
              key={event.id}
              // Dark background specifically applied to the image containers
              className={`group relative min-h-[250px] w-full overflow-hidden rounded-2xl bg-gray-900 border border-gray-200 shadow-sm transition-shadow duration-300 hover:shadow-xl ${event.layout || ""}`}>
              {/* Image Cross-fade mapping */}
              {event.images.map((img, index) => {
                // Calculate which image should be visible based on the global activeIndex
                const isVisible = index === activeIndex % event.images.length;

                return (
                  <img
                    key={index}
                    src={img}
                    width="800"
                    height="600"
                    alt=""
                    loading="lazy"
                    decoding="async"
                    // Pure CSS animations handling the automatic fade and scale
                    className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ease-in-out
                      ${isVisible ? "opacity-100 scale-105" : "opacity-0 scale-100"}
                    `}
                    onError={(e) => {
                      e.currentTarget.style.visibility = "hidden";
                    }}
                  />
                );
              })}

              {/* Subtle inner shadow overlay for depth on the images */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_0_20px_rgba(0,0,0,0.3)]" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default EventGrid;

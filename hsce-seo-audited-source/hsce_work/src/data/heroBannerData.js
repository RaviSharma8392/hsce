/**
 * Hero Banner & Slider Data
 * Desktop and mobile images for each slide.
 */
import { cloudinaryImageUrl, imageData } from "./imagesData";

export const heroSlides = [
  {
    id: 1,
    desktopImage: imageData.legacyAdmissionSlide,
    mobileImage: cloudinaryImageUrl(imageData.legacyAdmissionSlide, 800),
    alt: "Haryana Shakti College of Education — admissions",
  },
  {
    id: 2,
    desktopImage: imageData.sliderImage,
    mobileImage: cloudinaryImageUrl(imageData.sliderImage, 800),
    alt: "Haryana Shakti College of Education — admissions",
  },
  {
    id: 3,
    desktopImage: imageData.slideTwo,
    mobileImage: cloudinaryImageUrl(imageData.slideTwo, 800),
    alt: "Haryana Shakti College of Education — college banner",
  },
];
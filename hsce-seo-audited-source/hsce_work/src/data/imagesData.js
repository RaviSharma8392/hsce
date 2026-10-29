const cloudinaryUpload = "https://res.cloudinary.com/dljt6vgkk/image/upload";
export const cloudinaryImageUrl = (url, width = 1200) => {
  if (!url?.startsWith(cloudinaryUpload)) return url;
  return url.replace(
    /\/image\/upload\/(?:f_auto,q_auto,w_\d+\/)?/,
    `/image/upload/f_auto,q_auto,w_${width}/`,
  );
};

export const cloudinaryImages = {
  principalPortrait: `${cloudinaryUpload}/f_auto,q_auto,w_900/v1792002698/principal-savita-rathee_mtyemk.png`,
  campusHero: `${cloudinaryUpload}/f_auto,q_auto,w_1400/v1792002734/college-campus-hero_y0tjjk.png`,
  teacherEducationHighlight: `${cloudinaryUpload}/f_auto,q_auto,w_1200/v1791912750/haryana-shakti-college-of-education-kanjhawala-delhi-colleges-p471u7pzyd_ibap5z.avif`,
};

export const imageData = {
  chairmanPortrait: "https://res.cloudinary.com/dljt6vgkk/image/upload/v1792836120/f7ee605c-f392-4a7a-8c6b-0c1c71f1a1b9.png",
  principalPortrait: cloudinaryImages.principalPortrait,
  campusHero: cloudinaryImages.campusHero,
  teacherEducationHighlight: cloudinaryImages.teacherEducationHighlight,
  legacyCollegeLogo: "/assets/brand/favicon.png",
  legacyAdmissionSlide: "https://res.cloudinary.com/dljt6vgkk/image/upload/v1792035696/e01b6318-d7f9-4961-bf96-4409af4b5e5e.png",
  collegeLogo: "/assets/brand/college-logo.png",
  favicon: "/assets/brand/favicon.png",
  certificate:"https://graphicsfamily.com/wp-content/uploads/edd/2022/01/Award-Certificate-Template-1180x858.jpg",
  ncteLogo: "https://res.cloudinary.com/dljt6vgkk/image/upload/v1792004101/ncte-logo_a9idxk.png",
  ggsipuLogo: "/assets/affiliations/ggsipu-logo-removebg-preview.png",
  naacLogo: "https://res.cloudinary.com/dljt6vgkk/image/upload/v1792004035/naac-logo_ezsl2r.png",
  computerLab: "https://res.cloudinary.com/dljt6vgkk/image/upload/v1792003597/computer_lab_jkxyff.png",
  campusOutdoor: "https://res.cloudinary.com/dljt6vgkk/image/upload/v1792003623/campus-outdoor_eribfv.png",
  library: "https://res.cloudinary.com/dljt6vgkk/image/upload/v1792004471/library_msckcs.png",
  studentCricket: "https://res.cloudinary.com/dljt6vgkk/image/upload/v1792003817/student-cricket_blbcdn.png",
  studentCarrom: "https://res.cloudinary.com/dljt6vgkk/image/upload/v1792004613/student-carrom_bvye3p.png",
  studentDiscussion: "https://res.cloudinary.com/dljt6vgkk/image/upload/v1792003836/student-discussion_ejgcih.png",
  studentThinking: "https://res.cloudinary.com/dljt6vgkk/image/upload/v1792003901/b3133ed2-7264-41f9-9f5b-a3fe722d1b71.png",
  principalStudentDiscussion: "https://res.cloudinary.com/dljt6vgkk/image/upload/v1792004247/principal-student-discussion_vdgd3i.png",
  badminton: "https://res.cloudinary.com/dljt6vgkk/image/upload/v1792004487/badminton_na9luh.png",
  firstYearStudent: "https://res.cloudinary.com/dljt6vgkk/image/upload/v1792004107/first-year-student_ml2zv9.png",
  admissionBanner: "/assets/banner/image.png",
  admissionBot: "/assets/chatbot/admission-bot.png",
  slideOne: "https://res.cloudinary.com/dljt6vgkk/image/upload/v1792035808/7423a30c-e2e9-45d3-8b8f-45a0da0f3f18.png",
  slideOneMobile: "/assets/slider/slide1-mobile.png",
  slideTwo: "https://res.cloudinary.com/dljt6vgkk/image/upload/v1792035808/7423a30c-e2e9-45d3-8b8f-45a0da0f3f18.png",
  sliderImage: "https://res.cloudinary.com/dljt6vgkk/image/upload/v1792041230/3dca4d03-5052-4d6c-872b-987def98f2c4.png",
  pdfIcon: "/assets/icons/pdf-icon.svg",
  awardGoldMedal: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80",
  awardUniversityTopper: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
  awardSilverMedal: "https://images.unsplash.com/photo-1541339907198-e9f8b2d4e2b8?auto=format&fit=crop&w=800&q=80",
  awardResults: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
  newsConvocation: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1400&q=85",
  newsPlacement: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=85",
  newsSeminar: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=85",
  newsGuestLecture: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=85",
  
  // Existing single event image
  event1: "https://res.cloudinary.com/dljt6vgkk/image/upload/v1792036222/f1db771b-1ba3-447c-bcf6-a40234d4ed4b.png",
  
  event2: "https://res.cloudinary.com/dljt6vgkk/image/upload/v1792036222/f1db771b-1ba3-447c-bcf6-a40234d4ed4b.png",
  event3: "https://res.cloudinary.com/dljt6vgkk/image/upload/v1792041230/3dca4d03-5052-4d6c-872b-987def98f2c4.png",
  event4: "https://res.cloudinary.com/dljt6vgkk/image/upload/v1792051949/23bcdb41-a59d-40d2-90ff-a85969c2a280.png",
  event5: "https://res.cloudinary.com/dljt6vgkk/image/upload/v1792035696/e01b6318-d7f9-4961-bf96-4409af4b5e5e.png",
event6:"https://res.cloudinary.com/dljt6vgkk/image/upload/v1792055199/136ca9d7-c5b1-4b88-8548-9ac5d485c7fa.png",
event7:"https://res.cloudinary.com/dljt6vgkk/image/upload/v1792055317/563237f4-ad6a-44c1-ab41-86c04b6997df.png"
  ,event8:"https://res.cloudinary.com/dljt6vgkk/image/upload/v1792055397/edfdca66-96d3-41eb-baea-c74175e1a294.png",
  event9:"https://res.cloudinary.com/dljt6vgkk/image/upload/v1792035808/7423a30c-e2e9-45d3-8b8f-45a0da0f3f18.png",
};

const cloudinaryWidths = {
  chairmanPortrait: 800,
  principalPortrait: 800,
  firstYearStudent: 800,
  ncteLogo: 500,
  naacLogo: 500,
  legacyAdmissionSlide: 1400,
  slideOne: 1400,
  slideTwo: 1400,
  sliderImage: 1400,
  computerLab: 1000,
  campusOutdoor: 1000,
  library: 1000,
  studentCricket: 1000,
  studentCarrom: 1000,
  studentDiscussion: 1000,
  studentThinking: 1000,
  principalStudentDiscussion: 1000,
  badminton: 1000,
  event1: 900,
  event2: 900,
  event3: 900,
  event4: 900,
  event5: 900,
  event6: 900,
  event7: 900,
  event8: 900,
  event9: 900,
};

for (const [key, url] of Object.entries(imageData)) {
  if (typeof url === "string") {
    imageData[key] = cloudinaryImageUrl(url, cloudinaryWidths[key] ?? 1000);
  }
}

export const imageFallbacks = {
  chairmanPortrait: "/assets/people/chairman.jpg",
  principalPortrait: "/assets/people/principal-savita-rathee.png",
  campusHero: "/assets/campus/college-campus-hero.png",
  teacherEducationHighlight: "/assets/campus/college-campus-hero.png",
  collegeLogo: "/assets/brand/favicon.png",
  ncteLogo: "/assets/affiliations/ncte-logo.png",
  ggsipuLogo: "/assets/affiliations/ggsipu-logo.png",
  naacLogo: "/assets/affiliations/naac-logo.webp",
  computerLab: "/assets/campus/computer_lab.png",
  studentCricket: "/assets/campus/student-cricket.png",
  studentThinking: "/assets/campus/student-thinking.png",
  principalStudentDiscussion: "/assets/campus/principal-student-discussion.png",
  firstYearStudent: "/assets/people/first-year-student.png",
  

};
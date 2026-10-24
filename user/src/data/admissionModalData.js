import { imageData } from "./imagesData";

export const admissionModalData = {
  // Admission session
  session: "2026 - 2027",
  
  // Assets & Contact Fallbacks
  logoSrc: imageData.collegeLogo,
  logoFallback: imageData.legacyCollegeLogo,
  helplinePhoneFallback: "9953155054",

  // Form Dropdown Options
  courses: [
    "B.Ed. (Bachelor of Education - 2 Years)"
  ],
  states: [
    "Delhi (NCT)",
    "Haryana",
    "Uttar Pradesh",
    "Punjab",
    "Rajasthan",
    "Bihar",
    "Uttarakhand",
    "Himachal Pradesh",
    "Madhya Pradesh",
    "Chandigarh",
    "Other State",
  ],
  popularCities: {
    "Delhi (NCT)": [
      "North West Delhi (Kanjhawala / Rohini)",
      "North Delhi (Narela / Alipur)",
      "West Delhi (Punjabi Bagh / Janakpuri)",
      "South Delhi",
      "East Delhi",
      "Central Delhi",
      "Other Delhi Area",
    ],
    Haryana: [
      "Bahadurgarh",
      "Sonipat",
      "Jhajjar",
      "Rohtak",
      "Gurugram",
      "Faridabad",
      "Panipat",
      "Karnal",
      "Rewari",
      "Other Haryana City",
    ],
    "Uttar Pradesh": [
      "Noida / Greater Noida",
      "Ghaziabad",
      "Meerut",
      "Baghpat",
      "Aligarh",
      "Other UP City",
    ],
  },
};
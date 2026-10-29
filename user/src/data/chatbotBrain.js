/**
 * HSCE AI Assistant Knowledge Brain

export const COLLEGE_BRAIN_INFO = {
  name: "Haryana Shakti College of Education",
  shortName: "HSCE",
  tagline: "Empowering Educators, Transforming Tomorrow",
  established: "2012",
  chairman: "Sh. Raj Singh Dabas",
  principal: "Dr. Savita Rathee (M.A., M.Ed., Ph.D.)",
  address: "Kanjhawala, Delhi – 110081 (North-West Delhi)",
  phone: "9953155054",
  altPhone: "8056777077",
  officeLandline: "011-25953510",
  whatsapp: "9953155054",
  email: "hsce.kanjhawala@gmail.com",
  affiliation: "Guru Gobind Singh Indraprastha University (GGSIPU), Delhi",
  recognition: "National Council for Teacher Education (NCTE)",
  accreditation: "NAAC Accredited",
  society: "Haryana Shakti Education Society",
  course: "Bachelor of Education (B.Ed.) — 2-Year Regular Full Time",
  intake: "100 Seats (2 Units)",
  timings: "9:00 AM to 4:00 PM (Monday to Saturday)",
  nearestMetro: "Rithala Metro Station (Red Line) & Samaypur Badli (Yellow Line)",
  admissionStatus: "Admissions for the upcoming session are not open yet. General enquiries are accepted for early guidance & notification alerts.",
};

/**
 * FAQ & Knowledge Base records
 */
export const KNOWLEDGE_BASE = [
  {
    id: "general_admission_enquiry",
    intent: "admissions",
    keywords: [
      "admission", "admissions", "apply", "how to apply", "registration", "form",
      "open", "start", "date", "counselling", "cet", "cuet", "seat", "seats", "quota",
      "प्रवेश", "एडमिशन", "आवेदन", "फॉर्म", "सीट", "कब खुलेंगे", "तारीख"
    ],
    title: "General Admission Enquiry (B.Ed.)",
    reply: `**Admission Status & General Enquiry:**

• **Current Status:** Formal admissions for the upcoming academic cycle are **not open yet**.
• **Programme:** B.Ed. (Bachelor of Education — 2-Year Regular, 4 Semesters)
• **Affiliation & Approval:** NCTE Approved & Affiliated to Guru Gobind Singh Indraprastha University (GGSIPU), Delhi.
• **Intake:** 100 Seats.

You can submit a **General Admission Enquiry** right now to receive early counselling, eligibility assessment, and immediate notification as soon as GGSIPU schedules and admission forms are officially announced.`,
    hiReply: `**प्रवेश स्थिति एवं सामान्य पूछताछ:**

• **वर्तमान स्थिति:** आगामी शैक्षणिक सत्र हेतु औपचारिक प्रवेश प्रक्रिया अभी **प्रारंभ नहीं हुई है**।
• **पाठ्यक्रम:** बी.एड. (2-वर्षीय नियमित डिग्री, 4 सेमेस्टर)
• **मान्यता:** NCTE द्वारा अनुमोदित एवं GGSIPU दिल्ली से संबद्ध।
• **कुल सीटें:** 100 सीटें।

आप अभी **सामान्य प्रवेश पूछताछ (General Admission Enquiry)** दर्ज करा सकते हैं ताकि GGSIPU प्रवेश सूचना व फॉर्म जारी होते ही आपको प्राथमिकता पर जानकारी व मार्गदर्शन मिल सके।`,
    action: "show_form",
    quickReplies: [
      { label: "Submit General Enquiry 📝", action: "open_form" },
      { label: "Eligibility Criteria 🎓", query: "eligibility criteria for bed" },
      { label: "Fee Guidance 💰", query: "what is the fee structure" },
      { label: "Talk to Counsellor 📞", action: "talk_counsellor" },
    ],
  },

  {
    id: "eligibility",
    intent: "eligibility",
    keywords: [
      "eligibility", "criteria", "percentage", "marks", "qualification", "eligible",
      "graduate", "graduation", "minimum marks", "btech", "b.tech", "post graduate",
      "पात्रता", "योग्यता", "प्रतिशत", "न्यूनतम अंक", "ग्रेजुएशन"
    ],
    title: "B.Ed. Eligibility Criteria",
    reply: `**Eligibility Criteria for B.Ed. (2-Year Regular Course):**

1. **Graduation / Post-Graduation:** Candidates must have secured at least **50% marks** in Bachelor's Degree and/or Master's Degree in Sciences, Social Sciences, or Humanities.
2. **B.Tech / Technical Degrees:** Candidates holding a Bachelor's in Engineering or Technology (with specialization in Science and Mathematics) require a minimum of **55% marks**.
3. **Category Relaxation:** A **5% relaxation** in minimum marks is provided to SC / ST / PWD candidates in accordance with statutory university guidelines.
4. **Age Limit:** There is no upper age limit for seeking admission to the B.Ed. programme under GGSIPU norms.`,
    hiReply: `**बी.एड. (2-वर्षीय नियमित) प्रवेश हेतु पात्रता मापदंड:**

1. **स्नातक / स्नातकोत्तर:** विज्ञान, सामाजिक विज्ञान या मानविकी में न्यूनतम **50% अंक**।
2. **इंजीनियरिंग स्नातक:** बी.टेक/बी.ई. (विज्ञान एवं गणित विशेषज्ञता) हेतु न्यूनतम **55% अंक**।
3. **आरक्षित वर्ग हेतु छूट:** SC / ST / PWD वर्ग के अभ्यर्थियों को नियमानुसार न्यूनतम अंकों में **5% की छूट**।
4. **आयु सीमा:** GGSIPU नियमानुसार कोई ऊपरी आयु सीमा नहीं है।`,
    quickReplies: [
      { label: "General Enquiry 📝", action: "open_form" },
      { label: "Required Documents 📑", query: "what documents are required" },
      { label: "Fee Details 💰", query: "fee structure" },
      { label: "Talk to Counsellor 📞", action: "talk_counsellor" },
    ],
  },

  {
    id: "fee_structure",
    intent: "fees",
    keywords: [
      "fee", "fees", "cost", "charges", "structure", "annual fee", "instalment", "installment",
      "payment", "scholarship", "kharcha", "kitni fees", "फीस", "शुल्क", "खर्च", "किस्त"
    ],
    title: "Fee Structure Guidance",
    reply: `**B.Ed. Fee Structure at HSCE:**

• **Approved Guidelines:** The tuition and institutional fees are strictly regulated as per **Guru Gobind Singh Indraprastha University (GGSIPU)** and the State Fee Regulatory Committee norms.
• **Transparent & Fair:** No capitation fees or hidden charges.
• **Installment Options:** Semester-wise installment convenience is available for enrolled students.
• **Government Scholarships:** Eligible SC, ST, OBC, and EWS students can avail Delhi Government & Central Post-Matric scholarship schemes.

For full fee estimates and guidance, you can connect with our admission desk.`,
    hiReply: `**HSCE बी.एड. शुल्क मार्गदर्शन:**

• **मान्यता प्राप्त नियम:** शुल्क संरचना **GGSIPU** एवं राज्य शुल्क नियामक समिति के दिशा-निर्देशों के अनुरूप है।
• **पारदर्शी व्यवस्था:** कोई गुप्त शुल्क या डोनेशन नहीं।
• **किस्त सुविधा:** सेमेस्टर अनुसार किस्तों में भुगतान की सुविधा।
• **सरकारी छात्रवृत्तियां:** SC/ST/OBC/EWS वर्ग के पात्र छात्र सरकारी छात्रवृत्तियों के लिए आवेदन कर सकते हैं।`,
    quickReplies: [
      { label: "Ask Counsellor 📞", action: "talk_counsellor" },
      { label: "General Admission Enquiry 📝", action: "open_form" },
      { label: "B.Ed. Syllabus 📚", query: "syllabus and subjects" },
    ],
  },

  {
    id: "courses_academics",
    intent: "course",
    keywords: [
      "course", "courses", "programme", "program", "bed", "b.ed", "bachelor of education",
      "subjects", "syllabus", "semesters", "pedagogy", "curriculum", "पाठ्यक्रम", "विषय", "सिलेबस"
    ],
    title: "B.Ed. Academic Programme",
    reply: `**Bachelor of Education (B.Ed.) — 2-Year Regular Course:**

• **Duration:** 2 Academic Years (Divided into 4 Semesters)
• **Affiliation:** Guru Gobind Singh Indraprastha University (GGSIPU), Delhi
• **Regulatory Recognition:** National Council for Teacher Education (NCTE)
• **Key Highlights:**
  - 16 Weeks comprehensive School Internship Programme (SIP) in Delhi Government and reputed private schools
  - Micro-teaching simulation & ICT-enabled digital classrooms
  - Teaching Subject Pedagogies: English, Hindi, Mathematics, Social Sciences, Integrated Science, Commerce, Economics, etc.`,
    hiReply: `**बैचलर ऑफ एजुकेशन (बी.एड.) — 2-वर्षीय नियमित डिग्री:**

• **अवधि:** 2 वर्ष (4 सेमेस्टर)
• **संबद्धता:** गुरु गोबिंद सिंह इंद्रप्रस्थ विश्वविद्यालय (GGSIPU), दिल्ली
• **मान्यता:** राष्ट्रीय अध्यापक शिक्षा परिषद (NCTE)
• **प्रमुख बिंदु:** 16 सप्ताह की अनिवार्य विद्यालयी इंटर्नशिप, सूक्ष्म शिक्षण अभ्यास, एवं आधुनिक शिक्षण विधियां।`,
    quickReplies: [
      { label: "Download Syllabus 📥", action: "download_brochure" },
      { label: "General Enquiry 📝", action: "open_form" },
      { label: "Campus Facilities 🏛️", query: "campus facilities" },
    ],
  },

  {
    id: "contact_location",
    intent: "contact",
    keywords: [
      "location", "address", "where", "reach", "direction", "metro", "route", "map",
      "kanjhawala", "phone", "contact", "email", "helpline", "call", "whatsapp",
      "पता", "कहाँ", "रास्ता", "मेट्रो", "स्थान", "फोन", "संपर्क", "कॉल"
    ],
    title: "Location & Contact Information",
    reply: `**Haryana Shakti College of Education (HSCE):**

📍 **Address:** Kanjhawala, Delhi – 110081 (North-West Delhi)
📞 **Helpline:** [9953155054](tel:9953155054) / [8056777077](tel:8056777077)
☎️ **Landline:** 011-25953510
💬 **WhatsApp:** [9953155054](https://wa.me/919953155054)
✉️ **Email:** hsce.kanjhawala@gmail.com
⏰ **Working Hours:** Monday to Saturday, 9:00 AM – 4:00 PM

🚇 **Metro Connectivity:**
• **Nearest Metro Station:** Rithala (Red Line) & Samaypur Badli (Yellow Line)
• Direct DTC feeder buses and e-rickshaws connect from Rithala and Nangloi to Kanjhawala Chowk.`,
    hiReply: `**हरियाणा शक्ति कॉलेज ऑफ एजुकेशन (HSCE) संपर्क व पता:**

📍 **पता:** कंझावला, दिल्ली – 110081 (उत्तर-पश्चिम दिल्ली)
📞 **हेल्पलाइन:** 9953155054 / 8056777077
💬 **व्हाट्सएप:** 9953155054
✉️ **ईमेल:** hsce.kanjhawala@gmail.com
⏰ **समय:** सोमवार से शनिवार, प्रातः 9:00 से सायं 4:00 बजे तक

🚇 **निकटतम मेट्रो:** रिठाला मेट्रो स्टेशन (रेड लाइन) एवं समयपुर बादली (येलो लाइन)। नियमित बसें एवं ई-रिक्शा उपलब्ध हैं।`,
    action: "show_counsellor_options",
    quickReplies: [
      { label: "Talk to Counsellor 📞", action: "talk_counsellor" },
      { label: "WhatsApp Connect 💬", action: "whatsapp_direct" },
      { label: "General Enquiry 📝", action: "open_form" },
    ],
  },

  {
    id: "approvals_recognition",
    intent: "approval",
    keywords: [
      "ncte", "ggsipu", "naac", "affiliated", "affiliation", "approved", "recognition",
      "recognized", "ipu", "indraprastha", "university", "government", "valid",
      "मान्यता", "संबद्धता", "अनुमोदन", "सरकारी"
    ],
    title: "Accreditation & Approvals",
    reply: `**Statutory Recognition & Affiliations:**

✅ **NCTE Approved:** Haryana Shakti College of Education is recognized by the National Council for Teacher Education (NCTE), Northern Regional Committee.
✅ **GGSIPU Affiliated:** Officially affiliated with Guru Gobind Singh Indraprastha University (GGSIPU), Delhi.
✅ **NAAC Accredited:** Institutional quality recognized by the National Assessment and Accreditation Council.
✅ **Society:** Run by Haryana Shakti Education Society (Est. 2012).`,
    hiReply: `**मान्यता एवं वैधानिक संबद्धता:**

✅ **NCTE से अनुमोदित:** राष्ट्रीय अध्यापक शिक्षा परिषद द्वारा मान्यता प्राप्त।
✅ **GGSIPU से संबद्ध:** गुरु गोविंद सिंह इंद्रप्रस्थ विश्वविद्यालय, दिल्ली से संबद्ध।
✅ **NAAC प्रत्यायित:** NAAC द्वारा गुणवत्ता प्रमाणित संस्थान।`,
    quickReplies: [
      { label: "General Enquiry 📝", action: "open_form" },
      { label: "Campus Facilities 🏛️", query: "campus facilities" },
      { label: "Principal's Desk 🎓", query: "who is the principal" },
    ],
  },

  {
    id: "documents_required",
    intent: "documents",
    keywords: [
      "documents", "document", "certificate", "checklist", "papers", "marksheet",
      "migration", "character", "affidavit", "photo", "दस्तावेज़", "प्रमाण पत्र", "कागजात"
    ],
    title: "Required Documents for Admission",
    reply: `**Document Checklist for Verification:**

1. Class 10th Marksheet & Certificate (Date of Birth proof)
2. Class 12th Marksheet & Certificate
3. Graduation / Post-Graduation Marksheets & Degree / Provisional Certificate
4. GGSIPU CET / CUET Score Card / Allotment Letter (when applicable)
5. Original Migration Certificate from last attended University
6. Character Certificate from the last attended institution
7. Category Certificate (SC/ST/OBC/EWS/PWD) if applicable
8. Recent Passport-size Photographs (6-8 copies) & Aadhaar Card`,
    hiReply: `**प्रवेश सत्यापन हेतु आवश्यक दस्तावेज़ चेकलिस्ट:**

1. 10वीं व 12वीं की अंकतालिका एवं प्रमाण पत्र
2. स्नातक / स्नातकोत्तर की अंकतालिकाएं एवं डिग्री
3. GGSIPU आवंटन / स्कोर कार्ड (आवश्यकतानुसार)
4. माइग्रेशन सर्टिफिकेट (मूल प्रति)
5. चरित्र प्रमाण पत्र (Character Certificate)
6. आरक्षण प्रमाण पत्र (यदि लागू हो)
7. पासपोर्ट आकार के फोटो एवं आधार कार्ड`,
    quickReplies: [
      { label: "General Enquiry 📝", action: "open_form" },
      { label: "Eligibility Criteria 🎓", query: "eligibility" },
      { label: "Talk to Counsellor 📞", action: "talk_counsellor" },
    ],
  },

  {
    id: "facilities_infrastructure",
    intent: "facilities",
    keywords: [
      "facility", "facilities", "campus", "infrastructure", "library", "lab", "labs",
      "computer", "canteen", "hostel", "sports", "wifi", "playground", "सुविधाएं", "कैंपस", "लाइब्रेरी", "लैब"
    ],
    title: "Campus Infrastructure & Facilities",
    reply: `**Campus Infrastructure at HSCE Kanjhawala:**

• **Academic Library:** 10,000+ textbooks, reference journals, DELNET digital database, and quiet reading hall.
• **ICT Computer Lab:** Modern multimedia lab with high-speed internet and digital learning tools.
• **Curriculum Labs:** Educational Psychology Lab, Science & Mathematics Resource Centre, Art & Craft Studio.
• **Multipurpose Auditorium:** Equipped for academic seminars, workshops, and cultural events.
• **Sports & Recreation:** Spacious grounds for Cricket, Badminton, Volleyball, and Athletics.
• **Campus Amenities:** 100% RO Purified Drinking Water, Cafeteria, CCTV Surveillance, and Common Rooms.`,
    hiReply: `**HSCE की सुविधाएं एवं बुनियादी ढांचा:**

• **पुस्तकालय:** 10,000+ पुस्तकें, शैक्षणिक शोध पत्रिकाएं एवं डिजिटल ई-लाइब्रेरी।
• **कंप्यूटर व विज्ञान लैब:** आईसीटी लैब, मनोविज्ञान लैब, विज्ञान एवं गणित संसाधन केंद्र।
• **ऑडिटोरियम व खेल:** सेमिनार हॉल, क्रिकेट, बैडमिंटन, वॉलीबॉल व अन्य खेल सुविधाएं।
• **परिसर सुविधाएं:** शुद्ध आरओ पेयजल, कैंटीन, सुरक्षा व वाई-फाई परिसर।`,
    quickReplies: [
      { label: "General Enquiry 📝", action: "open_form" },
      { label: "Contact College 📞", action: "talk_counsellor" },
    ],
  },

  {
    id: "principal_leadership",
    intent: "leadership",
    keywords: [
      "principal", "director", "chairman", "savita", "rathee", "raj singh", "dabas",
      "management", "head", "प्राचार्य", "प्राचार्या", "चेयरमैन", "सविता राठी"
    ],
    title: "College Leadership & Mentorship",
    reply: `**Institutional Leadership at HSCE:**

• **Chairman:** **Sh. Raj Singh Dabas** — Visionary Leader and Patron, Haryana Shakti Education Society.
• **Principal:** **Dr. Savita Rathee** (M.A., M.Ed., Ph.D. in Education) — Experienced teacher educator and administrator.
• **Academic Faculty:** UGC-NET qualified, M.Ed. & Ph.D. faculty mentors specializing in diverse pedagogical disciplines.`,
    hiReply: `**महाविद्यालय नेतृत्व:**

• **चेयरमैन:** **श्री राज सिंह डबास** (अध्यक्ष, हरियाणा शक्ति एजुकेशन सोसाइटी)।
• **प्राचार्या:** **डॉ. सविता राठी** (M.A., M.Ed., Ph.D. शिक्षाशास्त्र)।
• **संकाय सदस्य:** अनुभवी एवं उच्च योग्यता प्राप्त (UGC-NET, Ph.D.) शिक्षक प्राध्यापक।`,
    quickReplies: [
      { label: "General Enquiry 📝", action: "open_form" },
      { label: "Talk to Counsellor 📞", action: "talk_counsellor" },
    ],
  },

  {
    id: "timings_schedule",
    intent: "timings",
    keywords: [
      "timing", "timings", "time", "hours", "working hours", "open", "holiday",
      "saturday", "sunday", "समय", "कॉलेज का समय", "छुट्टी"
    ],
    title: "College Timings & Office Hours",
    reply: `**College Timings & Working Hours:**

⏰ **Class & Office Timings:** 9:00 AM to 4:00 PM
📅 **Working Days:** Monday to Saturday
🚫 **Closed:** Sundays & Gazetted Government Holidays

For online enquiries and questions, this AI Assistant is available 24x7.`,
    hiReply: `**कॉलेज का समय एवं कार्य दिवस:**

⏰ **समय:** प्रातः 9:00 बजे से सायं 4:00 बजे तक
📅 **कार्य दिवस:** सोमवार से शनिवार
🚫 **अवकाश:** रविवार एवं सरकारी राजपत्रित अवकाश।`,
    quickReplies: [
      { label: "Call Helpline 📞", action: "talk_counsellor" },
      { label: "General Enquiry 📝", action: "open_form" },
    ],
  },
];

/**
 * Intelligent query resolver
 * Analyzes natural language strings against keyword weights and patterns.
 * If answer is NOT available, offers to transfer message to a human agent/counsellor!
 */
export function resolveBotQuery(userInput = "", isHindi = false) {
  const cleanInput = userInput.trim().toLowerCase();

  if (!cleanInput) {
    return {
      reply: isHindi
        ? "कृपया अपना प्रश्न लिखें या नीचे दिए गए विकल्पों में से चुनें।"
        : "Please type your question or choose one of the options below.",
      quickReplies: [
        { label: "General Admission Enquiry 📝", action: "open_form" },
        { label: "Eligibility & Fees 💰", query: "eligibility and fees" },
        { label: "Talk to a Counsellor 📞", action: "talk_counsellor" },
      ],
    };
  }

  // Greetings
  if (/^(hi|hello|hey|namaste|pranam|good\s+morning|good\s+afternoon|good\s+evening)/i.test(cleanInput)) {
    return {
      reply: isHindi
        ? `नमस्ते! हरियाणा शक्ति कॉलेज ऑफ एजुकेशन (HSCE) प्रवेश हेल्प डेस्क में आपका स्वागत है। हम आपकी क्या सहायता कर सकते हैं?`
        : `Hello! Welcome to Haryana Shakti College of Education (HSCE) Admission Help Desk. How can our counselling desk assist you today?`,
      quickReplies: [
        { label: "General Admission Enquiry 📝", action: "open_form" },
        { label: "B.Ed. Course & Syllabus 📚", query: "bed course details" },
        { label: "Eligibility & Fees 💰", query: "eligibility criteria" },
        { label: "Talk to a Counsellor 📞", action: "talk_counsellor" },
      ],
    };
  }

  // Check knowledge base
  let bestMatch = null;
  let highestScore = 0;

  for (const item of KNOWLEDGE_BASE) {
    let score = 0;
    for (const kw of item.keywords) {
      if (cleanInput.includes(kw)) {
        score += kw.length > 4 ? 3 : 2;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  }

  // If a reliable match is found (score >= 2)
  if (bestMatch && highestScore >= 2) {
    return {
      reply: isHindi && bestMatch.hiReply ? bestMatch.hiReply : bestMatch.reply,
      action: bestMatch.action,
      quickReplies: bestMatch.quickReplies || [],
    };
  }

  // ========================================================
  // FALLBACK: When answer is NOT in system, offer to transfer
  // user's query to human admission counsellor
  // ========================================================
  return {
    reply: isHindi
      ? `इस विषय की विशिष्ट जानकारी वर्तमान हेल्प डेस्क रिकॉर्ड में उपलब्ध नहीं है। क्या हम आपका संदेश सीधे कॉलेज प्रवेश परामर्शदाता को अग्रेषित (transfer) कर दें? हमारी काउंसलिंग टीम आपसे सीधे संपर्क करेगी।`
      : `This specific detail is not in our immediate help desk records. Would you like us to transfer your query directly to our admission counsellor? Our counselling team will connect with you directly.`,
    isUnanswered: true,
    userQueryToTransfer: userInput,
    quickReplies: [
      {
        label: isHindi ? "हाँ, परामर्शदाता को भेजें 👤" : "Yes, Connect to Counsellor 👤",
        action: "transfer_to_agent",
        queryText: userInput,
      },
      {
        label: isHindi ? "सीधे कॉल करें 📞" : "Direct Helpline Call 📞",
        action: "talk_counsellor",
      },
      {
        label: isHindi ? "सामान्य पूछताछ दर्ज करें 📝" : "General Admission Enquiry 📝",
        action: "open_form",
      },
    ],
  };
}

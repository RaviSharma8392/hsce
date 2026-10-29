import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  Phone,
  Send,
  User,
  MapPin,
  RotateCcw,
  ChevronRight,
  Mail,
  MessageSquare,
  Edit3,
  ExternalLink,
} from "lucide-react";

import { useLanguage } from "../../context/LanguageContext";
import { collegeInfo } from "../../data/siteData";
import { admissionModalData } from "../../data/admissionModalData";
import { imageData } from "../../data/imagesData";
import { submitStudentEnquiry } from "../../services/enquiryService";

const LOCAL_PROFILE_KEY = "hsce_visitor_profile";

const loadSavedProfile = () => {
  try {
    const raw = localStorage.getItem(LOCAL_PROFILE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return {
          name: parsed.name || "",
          phone: parsed.phone || "",
          email: parsed.email || "",
          city: parsed.city || "",
          course: "B.Ed. (Bachelor of Education — 2-Year Regular)",
        };
      }
    }
  } catch {
    // ignore
  }
  return {
    name: "",
    phone: "",
    email: "",
    city: "",
    course: "B.Ed. (Bachelor of Education — 2-Year Regular)",
  };
};

const saveProfileToStorage = (profile) => {
  try {
    localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // ignore
  }
};

// Purely Button-Based & Page-Redirecting Navigation Configuration
const BOT_CONTENT = {
  en: {
    welcome:
      "Welcome to Haryana Shakti College of Education (HSCE) Admission Help Desk.\n\n• GGSIPU Affiliated (College Code: 147)\n• NCTE Approved • NAAC Accredited\n• B.Ed. (2-Year Regular, 100 Approved Seats)\n\nPlease select an option below:",
    menuOptions: [
      { id: "opt-bed", label: "🎓 B.Ed. Programme Details", action: "open_course" },
      { id: "opt-syllabus", label: "📑 4-Semester Syllabus (View Page)", action: "open_syllabus" },
      { id: "opt-eligibility", label: "📋 Eligibility & Admission Process", action: "open_admissions" },
      { id: "opt-facilities", label: "🏫 Campus Facilities & Labs", action: "open_campus" },
      { id: "opt-tour", label: "🏛️ Book a Campus Visit", action: "book_tour" },
      { id: "opt-fees", label: "💰 Fee Structure & Scholarships (Ask Counsellor)", action: "fees" },
      { id: "opt-counsellor", label: "📞 Talk to Admission Counsellor", action: "counsellor" },
      { id: "opt-enquiry", label: "📝 Request Counsellor Callback", action: "enquiry_form" },
      { id: "opt-ask", label: "💬 Type a Custom Question", action: "ask_custom" },
      { id: "opt-lang", label: "🌐 भाषा बदलें (हिन्दी)", action: "change_lang" },
    ],
    responses: {
      fees: {
        text: "💰 Fee Structure & Scholarship Guidance:\n\nOfficial fee structures, scholarship concession eligibility, and payment installment options are guided directly by our official HSCE admission counsellors.\n\nPlease connect directly or request a callback:",
        buttons: [
          { label: "📞 Call Helpline: 9953155054", action: "call_now" },
          { label: "💬 WhatsApp Counsellor", action: "whatsapp_now" },
          { label: "📝 Request Free Callback", action: "enquiry_form" },
          { label: "↩️ Main Menu", action: "main_menu" },
        ],
      },
      counsellor: {
        text: "📞 Talk to Official HSCE Admission Counsellor:\n\n• Admission Helplines: +91 9953155054 / +91 8056777077\n• Campus Location: Kanjhawala, Delhi – 110081\n• Office Hours: Monday to Saturday, 09:00 AM – 04:00 PM\n\nOur counsellors provide free personalized assistance for GGSIPU choice filling and verification.",
        buttons: [
          { label: "📞 Call Helpline Now", action: "call_now" },
          { label: "💬 WhatsApp Counsellor", action: "whatsapp_now" },
          { label: "📝 Request Free Callback", action: "enquiry_form" },
          { label: "↩️ Main Menu", action: "main_menu" },
        ],
      },
    },
  },
  hi: {
    welcome:
      "हरियाणा शक्ति कॉलेज ऑफ एजुकेशन (HSCE) हेल्प डेस्क में आपका स्वागत है।\n\n• GGSIPU संबद्ध (कॉलेज कोड: 147)\n• NCTE अनुमोदित • NAAC प्रत्यायित\n• बी.एड. (2-वर्षीय नियमित डिग्री, 100 स्वीकृत सीटें)\n\nकृपया नीचे दिए गए विकल्पों में से चुनें:",
    menuOptions: [
      { id: "opt-bed", label: "🎓 बी.एड. पाठ्यक्रम विवरण (पेज देखें)", action: "open_course" },
      { id: "opt-syllabus", label: "📑 4-सेमेस्टर सिलेबस (पेज देखें)", action: "open_syllabus" },
      { id: "opt-eligibility", label: "📋 पात्रता एवं प्रवेश प्रक्रिया (पेज देखें)", action: "open_admissions" },
      { id: "opt-facilities", label: "🏫 परिसर एवं प्रयोगशालाएं (पेज देखें)", action: "open_campus" },
      { id: "opt-tour", label: "🏛️ परिसर भ्रमण बुक करें", action: "book_tour" },
      { id: "opt-fees", label: "💰 फीस एवं छात्रवृत्ति (काउंसलर से पूछें)", action: "fees" },
      { id: "opt-counsellor", label: "📞 प्रवेश परामर्शदाता से बात करें", action: "counsellor" },
      { id: "opt-enquiry", label: "📝 कॉलबैक हेतु अनुरोध भेजें", action: "enquiry_form" },
      { id: "opt-ask", label: "💬 प्रश्न टाइप करें", action: "ask_custom" },
      { id: "opt-lang", label: "🌐 Switch to English", action: "change_lang" },
    ],
    responses: {
      fees: {
        text: "💰 शुल्क एवं छात्रवृत्ति मार्गदर्शन:\n\nकॉलेज का आधिकारिक शुल्क ढांचा, छात्रवृत्ति छूट एवं किश्तों की सुविधा हमारे आधिकारिक प्रवेश परामर्शदाता द्वारा सीधे समझाई जाती है।\n\nकृपया सीधे काउंसलर से संपर्क करें या कॉलबैक का अनुरोध करें:",
        buttons: [
          { label: "📞 हेल्पलाइन कॉल करें: 9953155054", action: "call_now" },
          { label: "💬 व्हाट्सएप पर पूछें", action: "whatsapp_now" },
          { label: "📝 कॉलबैक अनुरोध भेजें", action: "enquiry_form" },
          { label: "↩️ मुख्य मेन्यू", action: "main_menu" },
        ],
      },
      counsellor: {
        text: "📞 HSCE प्रवेश परामर्शदाता से सीधा संपर्क:\n\n• हेल्पलाइन नंबर: +91 9953155054 / +91 8056777077\n• स्थान: कंझावला, दिल्ली - 110081\n• समय: सोमवार से शनिवार, प्रातः 09:00 से सायं 04:00 बजे तक\n\nहमारे काउंसलर GGSIPU काउंसलिंग एवं दस्तावेज सत्यापन में निःशुल्क मार्गदर्शन देते हैं।",
        buttons: [
          { label: "📞 अभी कॉल करें", action: "call_now" },
          { label: "💬 व्हाट्सएप पर बात करें", action: "whatsapp_now" },
          { label: "📝 कॉलबैक अनुरोध भेजें", action: "enquiry_form" },
          { label: "↩️ मुख्य मेन्यू", action: "main_menu" },
        ],
      },
    },
  },
};

export function EnquireNowTab() {
  const { isHindi: globalIsHindi } = useLanguage();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  // Active language in chatbot
  const [chatLang, setChatLang] = useState(null);

  // Student profile state (loaded locally)
  const [profile, setProfile] = useState(() => loadSavedProfile());

  // Input Box Visibility: ONLY opens when needed! null = HIDDEN
  // Values: null | "name" | "phone" | "email" | "city" | "question"
  const [activeStep, setActiveStep] = useState(null);
  const [inputVal, setInputVal] = useState("");
  const [stepError, setStepError] = useState("");
  const [lastQuestion, setLastQuestion] = useState("");

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const collegePhone =
    collegeInfo.phone ||
    admissionModalData.helplinePhoneFallback ||
    "9953155054";
  const cleanPhone = String(collegePhone).replace(/[^\d+]/g, "");

  // Build the initial greeting or language selection message
  const buildInitialMessages = useCallback(() => {
    const saved = loadSavedProfile();
    if (saved && saved.name && saved.phone) {
      const firstName = saved.name.trim().split(" ")[0];
      return [
        {
          id: "msg-welcome-back",
          sender: "bot",
          time: "just now",
          text: `Hi ${firstName}! Welcome back to Haryana Shakti College of Education (HSCE) Admission Help Desk 👋\n\nPlease select an option below:`,
          type: "button_menu",
          options: BOT_CONTENT.en.menuOptions,
        },
      ];
    }

    return [
      {
        id: "msg-lang-select",
        sender: "bot",
        time: "just now",
        text: "Please select your preferred language / भाषा चुनें",
        type: "language_select",
        options: [
          { id: "lang-en", label: "English", lang: "en" },
          { id: "lang-hi", label: "हिन्दी (Hindi)", lang: "hi" },
        ],
      },
    ];
  }, []);

  const [messages, setMessages] = useState(() => buildInitialMessages());

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, activeStep]);

  // Focus input automatically whenever activeStep opens
  useEffect(() => {
    if (activeStep && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [activeStep]);

  // Listen for custom trigger event
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setShowTooltip(false);
    };
    window.addEventListener("open-enquire-tab", handleOpen);
    return () => window.removeEventListener("open-enquire-tab", handleOpen);
  }, []);

  // Prevent background scroll on mobile
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    if (window.innerWidth < 640) {
      document.body.style.overflow = "hidden";
    }
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Reset conversation
  const handleResetChat = () => {
    setIsTyping(false);
    setActiveStep(null);
    setInputVal("");
    setStepError("");
    setMessages(buildInitialMessages());
  };

  // Helper to append a user message and a bot response
  const appendConversation = (userText, botResponseObj, delay = 240) => {
    if (userText) {
      const userMsg = {
        id: `user-${Date.now()}`,
        sender: "user",
        time: "just now",
        text: userText,
      };
      setMessages((prev) => [...prev, userMsg]);
    }

    if (botResponseObj) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: "bot",
            time: "just now",
            ...botResponseObj,
          },
        ]);
      }, delay);
    }
  };

  // 1. Language Selected (Input box stays CLOSED!)
  const handleLanguageSelect = (selectedLang) => {
    setChatLang(selectedLang);
    const content = BOT_CONTENT[selectedLang] || BOT_CONTENT.en;
    setActiveStep(null); // Input box stays CLOSED!

    if (profile.name) {
      const firstName = profile.name.trim().split(" ")[0];
      appendConversation(
        selectedLang === "hi" ? "हिन्दी" : "English",
        {
          text:
            selectedLang === "hi"
              ? `नमस्ते ${firstName}! हरियाणा शक्ति कॉलेज ऑफ एजुकेशन में आपका स्वागत है।\n\nकृपया नीचे दिए गए विकल्पों में से चुनें:`
              : `Hi ${firstName}! Welcome to Haryana Shakti College of Education.\n\nPlease select an option below:`,
          type: "button_menu",
          options: content.menuOptions,
        }
      );
      return;
    }

    // New visitor: Display welcome message with pure button options
    appendConversation(
      selectedLang === "hi" ? "हिन्दी" : "English",
      {
        text: content.welcome,
        type: "button_menu",
        options: content.menuOptions,
      }
    );
  };

  // 2. Step-by-Step Input Submission (Opens ONLY when needed, then immediately closes)
  const handleStepSubmit = async (e) => {
    if (e) e.preventDefault();
    setStepError("");
    const trimmed = inputVal.trim();
    const lang = chatLang || "en";

    // --- STEP: NAME ---
    if (activeStep === "name") {
      if (!trimmed || trimmed.length < 2) {
        setStepError(
          lang === "hi" ? "कृपया अपना पूरा नाम लिखें।" : "Please enter your full name."
        );
        return;
      }

      const updatedProfile = { ...profile, name: trimmed };
      setProfile(updatedProfile);
      saveProfileToStorage(updatedProfile);
      setInputVal("");

      const firstName = trimmed.split(" ")[0];

      // Greet personally by name!
      appendConversation(trimmed, {
        text:
          lang === "hi"
            ? `नमस्ते ${firstName}! 😊 कृपया अपना 10 अंकों का मोबाइल नंबर दर्ज करें:`
            : `Hi ${firstName}! 😊 Please enter your 10-digit mobile number for the callback:`,
      });

      // Next step: Phone
      setActiveStep("phone");
      return;
    }

    // --- STEP: PHONE ---
    if (activeStep === "phone") {
      const digits = trimmed.replace(/\D/g, "");
      if (digits.length !== 10) {
        setStepError(
          lang === "hi"
            ? "कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।"
            : "Please enter a valid 10-digit mobile number."
        );
        return;
      }

      const updatedProfile = { ...profile, phone: digits };
      setProfile(updatedProfile);
      saveProfileToStorage(updatedProfile);
      setInputVal("");

      const firstName = (updatedProfile.name || "Student").split(" ")[0];

      appendConversation(digits, {
        text:
          lang === "hi"
            ? `धन्यवाद ${firstName}! 👍 क्या आप अपना ईमेल पता भी साझा करना चाहेंगे? (वैकल्पिक, 'छोड़ें' दबा सकते हैं)`
            : `Got it, ${firstName}! 👍 Could you also share your email address? (Optional, you can click 'Skip Email')`,
      });

      // Next step: Email
      setActiveStep("email");
      return;
    }

    // --- STEP: EMAIL ---
    if (activeStep === "email") {
      const emailValue = trimmed;
      const updatedProfile = { ...profile, email: emailValue };
      setProfile(updatedProfile);
      saveProfileToStorage(updatedProfile);
      setInputVal("");

      const firstName = (updatedProfile.name || "Student").split(" ")[0];

      appendConversation(emailValue || "Skipped Email", {
        text:
          lang === "hi"
            ? `बहुत अच्छा ${firstName}! आप किस शहर या राज्य से हैं?`
            : `Thanks, ${firstName}! Which city or state are you from?`,
      });

      // Next step: City
      setActiveStep("city");
      return;
    }

    // --- STEP: CITY ---
    if (activeStep === "city") {
      const cityValue = trimmed || "Delhi-NCR";
      const updatedProfile = { ...profile, city: cityValue };
      setProfile(updatedProfile);
      saveProfileToStorage(updatedProfile);
      setInputVal("");

      const firstName = (updatedProfile.name || "Student").split(" ")[0];
      const content = BOT_CONTENT[lang] || BOT_CONTENT.en;

      // Automatically send enquiry directly to backend / Admin page!
      try {
        await submitStudentEnquiry({
          name: updatedProfile.name,
          phone: updatedProfile.phone,
          email: updatedProfile.email || "",
          city: updatedProfile.city,
          course: "B.Ed. (Bachelor of Education — 2-Year Regular)",
          query: lastQuestion
            ? `Question: "${lastQuestion}" (Callback requested)`
            : "Admission callback scheduled via Chatbot Help Desk",
          source: "chatbot_button_enquiry",
          language: lang,
        });
      } catch {
        // saved locally regardless
      }

      // CLOSE the input box!
      setActiveStep(null);

      appendConversation(cityValue, {
        text:
          lang === "hi"
            ? `✅ धन्यवाद ${firstName}! आपका कॉलबैक अनुरोध सीधे हमारे कॉलेज प्रशासन को भेज दिया गया है। हमारे प्रवेश परामर्शदाता शीघ्र ही ${updatedProfile.phone} पर संपर्क करेंगे।\n\nआप नीचे दिए गए विकल्पों में से किसी भी पेज पर जा सकते हैं:`
            : `✅ Thank you, ${firstName}! Your callback request has been sent directly to our college administration. Our admissions counsellor will contact you on ${updatedProfile.phone} shortly.\n\nYou can also explore any page below:`,
        type: "button_menu",
        options: content.menuOptions,
      });
      return;
    }

    // --- STEP: CUSTOM QUESTION ---
    if (activeStep === "question") {
      if (!trimmed) return;
      setInputVal("");
      setLastQuestion(trimmed);
      const content = BOT_CONTENT[lang] || BOT_CONTENT.en;

      // ALWAYS DIRECTLY submit the question to backend & Admin page immediately!
      submitStudentEnquiry({
        name: profile.name || "Student Visitor",
        phone: profile.phone || "",
        email: profile.email || "",
        city: profile.city || "Delhi-NCR",
        course: "B.Ed. (Bachelor of Education — 2-Year Regular)",
        query: trimmed,
        source: "chatbot_button_enquiry",
        language: lang,
      }).catch((err) => console.warn("Failed to send question to backend:", err));

      const needsContact = !profile.phone;

      // Close the input box!
      setActiveStep(null);

      // Confirm directly that question is sent to admin page
      appendConversation(trimmed, {
        text:
          lang === "hi"
            ? `✅ धन्यवाद! आपका प्रश्न सीधे हमारे कॉलेज प्रशासन एवं प्रवेश काउंसलर को भेज दिया गया है:\n\n"${trimmed}"\n\nकृपया नीचे दिए गए विकल्पों में से संबंधित पेज देखें या काउंसलर से बात करें:`
            : `✅ Thank you! Your question has been forwarded directly to our college administration and admission counsellors:\n\n"${trimmed}"\n\nPlease explore the relevant pages below or connect directly:`,
        type: "button_menu",
        options: content.menuOptions,
      });

      // If phone is missing, invite them to share their number so counsellor can call them with the answer!
      if (needsContact) {
        setTimeout(() => {
          const firstName = profile.name ? profile.name.split(" ")[0] : "";
          const followMsg = firstName
            ? lang === "hi"
              ? `नमस्ते ${firstName}! हमारे प्रवेश काउंसलर से आपके प्रश्न पर सीधा फोन/व्हाट्सएप उत्तर पाने के लिए अपना 10 अंकों का मोबाइल नंबर दर्ज करें:`
              : `Hi ${firstName}! To receive a direct phone/WhatsApp answer from our admission counsellor regarding your question, please share your 10-digit mobile number:`
            : lang === "hi"
              ? "कॉलेज काउंसलर से आपके प्रश्न पर सीधा उत्तर एवं सहायता पाने के लिए अपना पूरा नाम बताएं:"
              : "To have our college counsellor contact you regarding your question, may I know your full name?";

          setMessages((prev) => [
            ...prev,
            {
              id: `bot-contact-invite-${Date.now()}`,
              sender: "bot",
              time: "just now",
              text: followMsg,
            },
          ]);
          setActiveStep(profile.name ? "phone" : "name");
        }, 800);
      }
    }
  };

  // Helper to skip email
  const handleSkipEmail = () => {
    setInputVal("");
    setStepError("");
    const lang = chatLang || "en";
    const firstName = (profile.name || "Student").split(" ")[0];

    appendConversation(lang === "hi" ? "ईमेल छोड़ा" : "Skipped Email", {
      text:
        lang === "hi"
          ? `कोई बात नहीं ${firstName}! आप किस शहर या राज्य से हैं?`
          : `No problem, ${firstName}! Which city or state are you from?`,
    });
    setActiveStep("city");
  };

  // Helper to select quick city
  const handleSelectCity = (cityName) => {
    setInputVal(cityName);
    setTimeout(() => {
      handleStepSubmit();
    }, 100);
  };

  // 3. Button Action Click Handler (DIRECT PAGE REDIRECTS)
  const handleActionClick = async (action, label) => {
    const lang = chatLang || "en";
    const content = BOT_CONTENT[lang] || BOT_CONTENT.en;

    // DIRECT PAGE REDIRECTS (Navigates directly to the page and closes chatbot)
    if (action === "open_course") {
      setIsOpen(false);
      navigate("/course");
      return;
    }

    if (action === "open_syllabus") {
      setIsOpen(false);
      navigate("/syllabus");
      return;
    }

    if (action === "open_admissions") {
      setIsOpen(false);
      navigate("/admissions");
      return;
    }

    if (action === "open_campus") {
      setIsOpen(false);
      navigate("/campus-life");
      return;
    }

    if (action === "book_tour") {
      setIsOpen(false);
      navigate("/book-a-tour");
      return;
    }

    // Direct phone call
    if (action === "call_now") {
      window.location.href = `tel:${cleanPhone}`;
      return;
    }

    // Direct WhatsApp
    if (action === "whatsapp_now") {
      const studentName = profile.name ? ` My name is ${profile.name}.` : "";
      window.open(
        `https://wa.me/919953155054?text=${encodeURIComponent(
          lang === "hi"
            ? `नमस्ते! मुझे हरियाणा शक्ति कॉलेज ऑफ एजुकेशन में बी.एड. प्रवेश के बारे में जानकारी चाहिए।${studentName}`
            : `Hello! I would like to enquire about B.Ed. Admissions at Haryana Shakti College of Education.${studentName}`
        )}`,
        "_blank"
      );
      return;
    }

    // Change language
    if (action === "change_lang") {
      handleResetChat();
      return;
    }

    // Main Menu
    if (action === "main_menu") {
      setActiveStep(null); // Keep input box closed!
      appendConversation(label, {
        text:
          lang === "hi"
            ? "मुख्य मेन्यू: कृपया नीचे दिए गए विकल्पों में से चुनें:"
            : "Main Menu: Please choose an option below:",
        type: "button_menu",
        options: content.menuOptions,
      });
      return;
    }

    // User explicitly wants to type a custom question
    if (action === "ask_custom") {
      appendConversation(label, {
        text:
          lang === "hi"
            ? "कृपया अपना प्रश्न नीचे टाइप करें (यह सीधे हमारे कॉलेज प्रशासन को जाएगा):"
            : "Please type your question below (it will be sent directly to our administration desk):",
      });
      setActiveStep("question"); // Open input box specifically for their question!
      return;
    }

    // Request Callback / Enquiry
    if (action === "enquiry_form") {
      // 1. If name is not known yet -> Ask for Name
      if (!profile.name) {
        appendConversation(label, {
          text:
            lang === "hi"
              ? "कॉलबैक अनुरोध दर्ज करने के लिए, कृपया अपना पूरा नाम बताएं:"
              : "To schedule your admission callback, may I know your full name?",
        });
        setActiveStep("name"); // Open input box for Name!
        return;
      }

      // 2. If phone is not known yet -> Ask for Phone
      if (!profile.phone) {
        const firstName = profile.name.split(" ")[0];
        appendConversation(label, {
          text:
            lang === "hi"
              ? `नमस्ते ${firstName}! कृपया अपना 10 अंकों का मोबाइल नंबर बताएं:`
              : `Hi ${firstName}! Please enter your 10-digit mobile number for the callback:`,
        });
        setActiveStep("phone"); // Open input box for Phone!
        return;
      }

      // 3. Profile is already known -> Send callback request immediately to Admin!
      try {
        await submitStudentEnquiry({
          name: profile.name,
          phone: profile.phone,
          email: profile.email || "",
          city: profile.city || "Delhi-NCR",
          course: "B.Ed. (Bachelor of Education — 2-Year Regular)",
          query: "Candidate requested direct admission callback",
          source: "chatbot_button_enquiry",
          language: lang,
        });
      } catch {
        // ignore
      }

      setActiveStep(null); // Keep input box closed!

      appendConversation(label, {
        text:
          lang === "hi"
            ? `✅ धन्यवाद ${profile.name}! आपका कॉलबैक अनुरोध दर्ज हो गया है। हमारे प्रवेश परामर्शदाता शीघ्र ही ${profile.phone} पर संपर्क करेंगे।`
            : `✅ Thank you, ${profile.name}! Your callback request has been received. Our admission counsellor will contact you on ${profile.phone} shortly.`,
        type: "button_response",
        buttons: [
          { label: lang === "hi" ? "📞 अभी कॉल करें" : "📞 Call Helpline Now", action: "call_now" },
          { label: lang === "hi" ? "💬 व्हाट्सएप पर पूछें" : "💬 WhatsApp Counsellor", action: "whatsapp_now" },
          { label: lang === "hi" ? "↩️ मुख्य मेन्यू" : "↩️ Main Menu", action: "main_menu" },
        ],
      });
      return;
    }

    // Response for fees or counsellor
    const responseData = content.responses[action];
    if (responseData) {
      setActiveStep(null); // Keep input box closed!
      appendConversation(label, {
        text: responseData.text,
        type: "button_response",
        buttons: responseData.buttons,
      });
    }
  };

  // Edit profile button in header
  const handleEditProfile = () => {
    setActiveStep("name");
    appendConversation(null, {
      text:
        chatLang === "hi"
          ? "अपना विवरण अपडेट करने के लिए, कृपया अपना पूरा नाम लिखें:"
          : "To update your details, please enter your full name:",
    });
  };

  return (
    <>
      {/* 1. FLOATING LAUNCHER BUTTON */}
      <div className="hidden sm:flex fixed sm:bottom-6 sm:right-6 z-50 flex-col items-end pointer-events-auto">
        {/* Tooltip */}
        {showTooltip && !isOpen && (
          <div className="relative mb-2.5 hidden sm:flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[#2E3A8C] shadow-md animate-in fade-in duration-300">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold font-sans">
              {profile.name
                ? `Hi ${profile.name.split(" ")[0]}! B.Ed. Help Desk`
                : globalIsHindi
                  ? "बी.एड. प्रवेश सहायता"
                  : "B.Ed. Admission Assistant"}
            </span>
            <button
              type="button"
              onClick={() => setShowTooltip(false)}
              aria-label="Dismiss"
              className="ml-1 rounded-full p-1 text-slate-400 hover:text-slate-600 transition cursor-pointer">
              <X size={12} />
            </button>
            <span className="absolute -bottom-1.5 right-5 h-3 w-3 rotate-45 border-b border-r border-slate-200 bg-white" />
          </div>
        )}

        {/* Floating Button with College Logo Image */}
        <button
          type="button"
          onClick={() => {
            setIsOpen((prev) => !prev);
            setShowTooltip(false);
          }}
          aria-label="Open Admission Assistant"
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-white border-2 border-[#2E3A8C] shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#2E3A8C]/20 cursor-pointer overflow-hidden p-1.5">
          <img
            src={imageData.collegeLogo}
            alt="Haryana Shakti College of Education"
            className="h-full w-full object-contain"
          />
          <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FBDD23] opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#FBDD23] border border-white" />
          </span>
        </button>
      </div>

      {/* 2. CHAT MODAL WINDOW */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[390px] sm:max-h-[620px] sm:h-[90vh] z-[120] flex flex-col overflow-hidden bg-white sm:rounded-2xl shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 duration-200 font-sans">
          {/* Header Bar */}
          <div className="shrink-0 bg-[#2E3A8C] px-4 py-3 text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white p-1 border border-yellow-300">
                <img
                  src={imageData.collegeLogo}
                  alt="HSCE"
                  className="h-full w-full object-contain"
                />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white" />
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold leading-tight flex items-center gap-1.5">
                  <span>Admission Help Desk</span>
                  <span className="text-[10px] bg-[#FBDD23] text-slate-900 font-bold px-1.5 py-0.2 rounded font-sans">
                    HSCE
                  </span>
                </h3>
                <p className="text-[11px] text-white/80">
                  {profile.name ? `Assisting: ${profile.name}` : "GGSIPU Code: 147 • NCTE Approved"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                title="Restart Chat"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer">
                <RotateCcw size={14} />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Profile Strip (If user has completed name & phone) */}
          {profile.name && profile.phone && (
            <div className="shrink-0 bg-blue-50/80 border-b border-blue-200/70 px-3.5 py-1.5 flex items-center justify-between text-xs text-[#2E3A8C]">
              <div className="flex items-center gap-1.5 truncate">
                <User size={12} className="shrink-0 text-[#2E3A8C]" />
                <span className="font-bold truncate">{profile.name}</span>
                <span className="text-slate-400">•</span>
                <span className="font-mono">{profile.phone}</span>
              </div>
              <button
                type="button"
                onClick={handleEditProfile}
                className="text-[11px] font-bold text-blue-700 hover:underline flex items-center gap-1 cursor-pointer shrink-0 ml-2">
                <Edit3 size={11} />
                <span>Edit</span>
              </button>
            </div>
          )}

          {/* Chat Messages Body */}
          <div className="flex-1 space-y-4 overflow-y-auto bg-[#F4F6FA] p-3 sm:p-4">
            {messages.map((msg) => {
              const isBot = msg.sender === "bot";

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isBot ? "items-start" : "items-end"} animate-in fade-in duration-150`}>
                  {/* Sender Header */}
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1 px-1">
                    {isBot && (
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white p-0.5 border border-slate-200 overflow-hidden">
                        <img
                          src={imageData.collegeLogo}
                          alt="Admission Assistant"
                          className="h-full w-full object-contain"
                        />
                      </span>
                    )}
                    <span className="font-bold text-slate-800">
                      {isBot ? "Admission Help Desk" : "You"}
                    </span>
                    <span>•</span>
                    <span>{msg.time}</span>
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[88%] whitespace-pre-wrap rounded-2xl border px-4 py-3 text-[13px] leading-relaxed shadow-2xs ${
                      isBot
                        ? "border-slate-200/90 bg-white text-slate-800"
                        : "border-[#2E3A8C] bg-[#2E3A8C] text-white"
                    }`}>
                    {msg.text}
                  </div>

                  {/* Language Selection Buttons */}
                  {msg.type === "language_select" && (
                    <div className="flex flex-wrap gap-2.5 mt-2.5 max-w-[94%]">
                      {msg.options.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleLanguageSelect(opt.lang)}
                          className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-bold text-slate-800 shadow-2xs hover:border-[#2E3A8C] hover:bg-blue-50/50 hover:text-[#2E3A8C] transition-all cursor-pointer">
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Button-Based Menu Options (Redirects Directly to Website Pages) */}
                  {msg.type === "button_menu" && (
                    <div className="w-full max-w-[96%] mt-2 space-y-1.5">
                      {msg.options.map((opt) => {
                        const isPageRedirect =
                          opt.action === "open_course" ||
                          opt.action === "open_syllabus" ||
                          opt.action === "open_admissions" ||
                          opt.action === "open_campus" ||
                          opt.action === "book_tour";

                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleActionClick(opt.action, opt.label)}
                            className="w-full flex items-center justify-between rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-left text-xs sm:text-sm font-bold text-slate-800 shadow-2xs hover:border-[#2E3A8C] hover:bg-blue-50/50 hover:text-[#2E3A8C] transition cursor-pointer">
                            <span>{opt.label}</span>
                            {isPageRedirect ? (
                              <ExternalLink size={13} className="text-[#2E3A8C] shrink-0" />
                            ) : (
                              <ChevronRight size={14} className="text-slate-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Follow-Up Action Buttons */}
                  {msg.type === "button_response" && msg.buttons && msg.buttons.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-[96%]">
                      {msg.buttons.map((btn, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleActionClick(btn.action, btn.label)}
                          className="rounded-xl border border-[#2E3A8C]/30 bg-white px-3 py-1.5 text-xs font-bold text-[#2E3A8C] shadow-2xs hover:bg-[#2E3A8C] hover:text-white transition cursor-pointer">
                          {btn.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-500 bg-white rounded-xl border border-slate-200 p-2.5 w-max">
                <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-white p-0.5 border border-slate-200 overflow-hidden">
                  <img src={imageData.collegeLogo} alt="AI" className="h-full w-full object-contain" />
                </span>
                <span className="font-semibold text-slate-700">Connecting</span>
                <span className="inline-flex gap-1 ml-1">
                  <span className="h-1.5 w-1.5 bg-[#2E3A8C] rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 bg-[#2E3A8C] rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 bg-[#2E3A8C] rounded-full animate-bounce" />
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Area: Input box opens ONLY when activeStep is active! */}
          {activeStep !== null ? (
            <div className="shrink-0 border-t border-slate-200 bg-white p-3 space-y-2 animate-in slide-in-from-bottom-2 duration-200">
              {/* Header of input step with cancel button */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#2E3A8C] flex items-center gap-1">
                  {activeStep === "name"
                    ? chatLang === "hi" ? "चरण 1: अपना पूरा नाम दर्ज करें" : "Step 1: Enter Your Full Name"
                    : activeStep === "phone"
                      ? chatLang === "hi" ? "चरण 2: मोबाइल नंबर दर्ज करें" : "Step 2: Enter Mobile Number"
                      : activeStep === "email"
                        ? chatLang === "hi" ? "चरण 3: ईमेल पता (वैकल्पिक)" : "Step 3: Email Address (Optional)"
                        : activeStep === "city"
                          ? chatLang === "hi" ? "चरण 4: शहर / राज्य" : "Step 4: City / State"
                          : chatLang === "hi" ? "अपना प्रश्न लिखें (सीधे एडमिन को जाएगा)" : "Type Question (Sends Directly to Admin)"}
                </span>

                <div className="flex items-center gap-2">
                  {activeStep === "email" && (
                    <button
                      type="button"
                      onClick={handleSkipEmail}
                      className="text-xs font-bold text-blue-700 hover:underline cursor-pointer">
                      {chatLang === "hi" ? "छोड़ें ➔" : "Skip Email ➔"}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveStep(null);
                      setInputVal("");
                      setStepError("");
                    }}
                    title="Close input"
                    className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer">
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Quick Cities for City Step */}
              {activeStep === "city" && (
                <div className="flex items-center gap-1.5 flex-wrap text-xs">
                  <span className="text-slate-400 font-medium text-[11px]">Quick select:</span>
                  {["Delhi-NCR", "Delhi", "Haryana", "Haldwani", "UP"].map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => handleSelectCity(city)}
                      className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-blue-50 hover:text-[#2E3A8C] text-slate-700 font-semibold text-[11px] border border-slate-200 transition cursor-pointer">
                      {city}
                    </button>
                  ))}
                </div>
              )}

              {/* Validation error message */}
              {stepError && (
                <div className="text-[11px] font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg animate-in fade-in">
                  {stepError}
                </div>
              )}

              {/* Input Form */}
              <form onSubmit={handleStepSubmit} className="flex items-center gap-1.5">
                <div className="relative flex-1 flex items-center">
                  <span className="absolute left-3 text-slate-400 pointer-events-none">
                    {activeStep === "name" ? (
                      <User size={15} className="text-[#2E3A8C]" />
                    ) : activeStep === "phone" ? (
                      <Phone size={15} className="text-emerald-600" />
                    ) : activeStep === "email" ? (
                      <Mail size={15} className="text-blue-600" />
                    ) : activeStep === "city" ? (
                      <MapPin size={15} className="text-amber-600" />
                    ) : (
                      <MessageSquare size={15} />
                    )}
                  </span>

                  <input
                    ref={inputRef}
                    type={
                      activeStep === "phone"
                        ? "tel"
                        : activeStep === "email"
                          ? "email"
                          : "text"
                    }
                    value={inputVal}
                    onChange={(e) => {
                      const val = e.target.value;
                      setInputVal(
                        activeStep === "phone"
                          ? val.replace(/\D/g, "").slice(0, 10)
                          : val
                      );
                      if (stepError) setStepError("");
                    }}
                    placeholder={
                      activeStep === "name"
                        ? chatLang === "hi"
                          ? "उदा. रवि शर्मा..."
                          : "e.g. Ravi Sharma..."
                        : activeStep === "phone"
                          ? chatLang === "hi"
                            ? "10 अंकों का मोबाइल नंबर..."
                            : "10-digit mobile number..."
                          : activeStep === "email"
                            ? chatLang === "hi"
                              ? "ईमेल पता दर्ज करें..."
                              : "Enter email address..."
                            : activeStep === "city"
                              ? chatLang === "hi"
                                ? "अपना शहर लिखें..."
                                : "Enter your city..."
                              : chatLang === "hi"
                                ? "अपना प्रश्न लिखें..."
                                : "Type your question here..."
                    }
                    className="w-full rounded-xl border border-gray-300 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#2E3A8C] focus:ring-1 focus:ring-[#2E3A8C] focus:outline-none transition shadow-2xs font-sans"
                  />
                </div>

                <button
                  type="submit"
                  aria-label="Send"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#2E3A8C] text-[#FBDD23] hover:bg-[#202965] active:scale-95 transition shadow-2xs cursor-pointer">
                  <Send size={15} />
                </button>
              </form>
            </div>
          ) : (
            /* When input is not needed: Bottom remains clean with direct question button */
            <div className="shrink-0 border-t border-slate-100 bg-slate-50/80 px-3.5 py-2 flex items-center justify-between text-xs text-slate-500">
              <span className="text-[11px] font-medium">Need personal guidance?</span>
              <button
                type="button"
                onClick={() => {
                  setActiveStep("question");
                  appendConversation(null, {
                    text:
                      chatLang === "hi"
                        ? "कृपया अपना प्रश्न नीचे टाइप करें (यह सीधे हमारे कॉलेज प्रशासन को जाएगा):"
                        : "Please type your question below (it will be sent directly to our administration desk):",
                  });
                }}
                className="inline-flex items-center gap-1 font-bold text-[#2E3A8C] hover:underline cursor-pointer text-xs">
                <MessageSquare size={12} />
                <span>{chatLang === "hi" ? "प्रश्न टाइप करें" : "Type a Question"}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default EnquireNowTab;

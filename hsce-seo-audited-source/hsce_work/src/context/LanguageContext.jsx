import { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../data/translations";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem("hsce_lang");
      if (saved === "hi" || saved === "en") return saved;
    } catch {
      // ignore
    }
    return "en";
  });

  const setLanguage = (lang) => {
    if (lang !== "en" && lang !== "hi") return;
    setLanguageState(lang);
    try {
      localStorage.setItem("hsce_lang", lang);
    } catch {
      // ignore
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hi" : "en");
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const isHindi = language === "hi";

  // Translate by key
  const t = (key, fallback = "") => {
    const langDict = translations[language] || translations.en;
    if (langDict && langDict[key] !== undefined) {
      return langDict[key];
    }
    const defaultDict = translations.en;
    if (defaultDict && defaultDict[key] !== undefined) {
      return defaultDict[key];
    }
    return fallback || key;
  };

  // Select between English and Hindi content
  const locale = (enVal, hiVal) => {
    if (isHindi && hiVal) return hiVal;
    return enVal;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        isHindi,
        t,
        locale,
      }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Provide safe fallback if accessed outside provider
    return {
      language: "en",
      setLanguage: () => {},
      toggleLanguage: () => {},
      isHindi: false,
      t: (key, fallback = "") => translations.en[key] || fallback || key,
      locale: (enVal) => enVal,
    };
  }
  return context;
}

import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "vi" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="bg-amber-600 text-white px-3 py-2 rounded-lg hover:bg-amber-500 transition"
    >
      {i18n.language === "en" ? "EN" : "VI"}
    </button>
  );
};

export default LanguageSwitcher;

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import hi from "./locales/hi.json"
import gu from "./locales/gu.json"
import pa from "./locales/pa.json"
import bn from "./locales/bn.json"
 
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    hi : {
      translation : hi,
    },
    gu : {
      translation : gu,
    },
    pa : {
      translation : pa,
    },
    bn : {
      translation : bn,
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
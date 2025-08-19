import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;


// hi: {
//   translation: {
//     'hello': 'नमस्ते',
//     'login': 'लॉग इन',
//     'Login': 'लॉग इन करें',
//     'enter email' : 'ईमेल दर्ज करें',
//     'enter password': 'पास वर्ड दर्ज करें',
//     'Dont any account':'कोई खाता नहीं',
//     'Registration':'पंजीकरण',
//   },
// },
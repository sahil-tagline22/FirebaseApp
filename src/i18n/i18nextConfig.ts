import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "react-native-localize";

i18n.use(initReactI18next).init({
    lng: getLocales()[0].languageCode,
    fallbackLng:'hi',
    resources: {
    en: {
      translation: {
        'hello': 'hello',
        'login': 'login',
      },
    },
    hi: {
      translation: {
        'hello': 'नमस्ते',
        'login': 'लॉग इन',
        'Login': 'लॉग इन करें',
        'enter email' : 'ईमेल दर्ज करें',
        'enter password': 'पास वर्ड दर्ज करें',
        'Dont any account':'कोई खाता नहीं',
        'Registration':'पंजीकरण',
      },
    },
   
  },
})

export default i18n;
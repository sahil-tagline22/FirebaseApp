
import { useTranslation } from "react-i18next";
import { TranslationKeys } from "../i18n/locales/TranslationKeys";

export const useAppTranslation = () => {
  const { t } = useTranslation();

  const translate = (key: keyof typeof TranslationKeys) => {
    return t(key);
  };

  return {
    t: translate,
  };
};

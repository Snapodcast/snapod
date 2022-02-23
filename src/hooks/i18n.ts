import { useTranslation } from 'react-i18next';
import Store from '../lib/Store';

const useI18n = () => {
  const { t, i18n, ready } = useTranslation(undefined, { useSuspense: false });

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    Store.set('appLang', language);
  };

  return { t, language: i18n.language, changeLanguage, ready };
};

export default useI18n;

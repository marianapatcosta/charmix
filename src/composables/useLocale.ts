import { useLocalStorage } from './useLocalStorage';
import { COLLECTION_LOCALE } from '@/constants';
import { i18n } from '@/locales';

type UseLocaleProps = {
  currentLocale: string;
  t: (sentence: string, dynamicFields?: Object) => string;
  getStoredLocale: () => void;
  defineLocale: (locale: string) => void;
};

const useLocale = (): UseLocaleProps => {
  const { getStoredItem, saveItemInStorage } = useLocalStorage();

  const getStoredLocale = () => {
    const storedLocale = getStoredItem(COLLECTION_LOCALE);
    if (!!storedLocale) {
      (i18n.global.locale as any).value = storedLocale;
      return;
    }
    const deviceLanguage = window.navigator.language;
    if (!!deviceLanguage) {
      defineLocale(deviceLanguage);
    }
  };

  const defineLocale = (newLocale: string) => {
    (i18n.global.locale as any).value = newLocale;
    saveItemInStorage(COLLECTION_LOCALE, newLocale);
  };

  return {
    currentLocale: i18n.global.locale,
    t: i18n.global.t,
    defineLocale,
    getStoredLocale,
  };
};

export { useLocale };

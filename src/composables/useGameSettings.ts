import { useLocalStorage } from './useLocalStorage';
import { COLLECTION_LOCALE } from '@/constants';
import { i18n } from '@/locales';

type GameSettings = { columnsNumber: number; rowsNumber: number; hardMode: boolean };

type UseGameSettingsProps = {
  gameSettings: GameSettings;
  getStoredSettings: () => void;
  saveSettings: (locale: string) => void;
};

const useGameSettings = (): UseGameSettingsProps => {
  const { getStoredItem, saveItemInStorage } = useLocalStorage();
  const gameSettings: GameSettings = {} as GameSettings;

  const getStoredSettings = () => {
    const storedLocale = getStoredItem<string>(COLLECTION_LOCALE);
    if (!!storedLocale) {
      (i18n.global.locale as any).value = storedLocale;
      return;
    }
    const deviceLanguage = window.navigator.language;
    if (!!deviceLanguage) {
      saveSettings(deviceLanguage);
    }
  };

  const saveSettings = (newLocale: string) => {
    (i18n.global.locale as any).value = newLocale;
    saveItemInStorage(COLLECTION_LOCALE, newLocale);
  };

  return {
    gameSettings,
    saveSettings,
    getStoredSettings,
  };
};

export { useGameSettings };

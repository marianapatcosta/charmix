import { Ref } from 'vue';
import { useLocalStorage, useState } from '@/composables';
import { COLLECTION_DARK_THEME } from '@/constants';
import { Theme } from '@/types';

type UseThemeProps = {
  isDarkTheme: Readonly<Ref<boolean>>;
  setTheme: (updatedIsDarkTheme: boolean) => void;
  getStoredTheme: () => void;
};

const useTheme = (): UseThemeProps => {
  const { getStoredItem, saveItemInStorage } = useLocalStorage();
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);

  const setTheme = (isDarkTheme: boolean) => {
    document.documentElement.setAttribute('theme', isDarkTheme ? Theme.DARK : Theme.LIGHT);
    saveItemInStorage(COLLECTION_DARK_THEME, isDarkTheme);
    setIsDarkTheme(isDarkTheme);
  };

  const getStoredTheme = () => {
    const storedIsDarkTheme = getStoredItem(COLLECTION_DARK_THEME);
    if (!storedIsDarkTheme) {
      const isDeviceThemeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(isDeviceThemeDark);
      return;
    }
    setTheme(storedIsDarkTheme as boolean);
  };

  return {
    isDarkTheme,
    setTheme,
    getStoredTheme,
  };
};

export { useTheme };

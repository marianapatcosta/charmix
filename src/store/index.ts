import { defineStore, acceptHMRUpdate } from 'pinia';
import {
  COLLECTION_DARK_THEME,
  COLLECTION_GAME_SETTINGS,
  DEFAULT_COLUMNS_NUMBER,
  DEFAULT_ROWS_NUMBER,
} from '@/constants';
import { useLocalStorage } from '@/composables';
import { GameCellType, Theme } from '@/types';

export type StoreState = {
  isDarkMode: boolean;
  columnsNumber: number;
  rowsNumber: number;
  hardMode: boolean;
};

const { getStoredItem, saveItemInStorage } = useLocalStorage();

export const useStore = defineStore('main', {
  state: (): StoreState => ({
    isDarkMode: false,
    columnsNumber: DEFAULT_COLUMNS_NUMBER,
    rowsNumber: DEFAULT_ROWS_NUMBER,
    hardMode: false,
  }),
  getters: {},
  actions: {
    setTheme(isDarkMode: boolean) {
      document.documentElement.setAttribute('theme', isDarkMode ? Theme.DARK : Theme.LIGHT);
      saveItemInStorage(COLLECTION_DARK_THEME, isDarkMode);
      this.isDarkMode = isDarkMode;
    },
    getStoredTheme() {
      const storedIsDarkTheme = getStoredItem(COLLECTION_DARK_THEME);
      if (!storedIsDarkTheme) {
        const isDeviceThemeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.setTheme(isDeviceThemeDark);
        return;
      }
      this.setTheme(storedIsDarkTheme);
    },
    getStoredGameSettings() {
      const storedSettings = getStoredItem(COLLECTION_GAME_SETTINGS);
      if (storedSettings) {
        this.$patch((state: StoreState) => {
          for (const setting in storedSettings) {
            state[setting as keyof StoreState] = storedSettings[setting as keyof StoreState];
          }
        });
      }
      this.saveGameSettings();
    },
    saveGameSettings() {
      const gameSettings = {
        columnsNumber: this.columnsNumber,
        rowsNumber: this.rowsNumber,
        hardMode: this.hardMode,
      };

      saveItemInStorage(COLLECTION_GAME_SETTINGS, gameSettings);
    },
    updateGameSettingsItem(stateItemName: keyof StoreState, newValue: unknown) {
      this[stateItemName] = newValue;
      this.saveGameSettings();
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot));
}

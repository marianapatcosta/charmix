import { i18n } from '@/locales';
import { Locale, InputData, KeyboardKey, LetterStatus } from '@/types';
import { France, Germany, Italy, Portugal, Spain, UK } from '@/assets/icons';

export const GAME_NAME = 'CharMix';

export const LocalesData: InputData[] = [
  { value: Locale.EN, caption: i18n.global.t('english') },
  { value: Locale.PT, caption: i18n.global.t('portuguese') },
  { value: Locale.DE, caption: i18n.global.t('german') },
  { value: Locale.FR, caption: i18n.global.t('french') },
  { value: Locale.ES, caption: i18n.global.t('spanish') },
  { value: Locale.IT, caption: i18n.global.t('italian') },
];

export const COUNTRY_FLAGS = {
  [Locale.EN]: UK,
  [Locale.PT]: Portugal,
  [Locale.DE]: Germany,
  [Locale.FR]: France,
  [Locale.ES]: Spain,
  [Locale.IT]: Italy,
};

const DATABASE_NAME = '@charmix';

// @app:collection;
export const COLLECTION_LOCALE = `${DATABASE_NAME}:locale`;
export const COLLECTION_DARK_THEME = `${DATABASE_NAME}:theme`;
export const COLLECTION_GAME_SETTINGS = `${DATABASE_NAME}:game-settings`;
export const COLLECTION_ONGOING_GAME = `${DATABASE_NAME}:active-game`;
export const COLLECTION_STATS = `${DATABASE_NAME}:stats`;

export const DEFAULT_AUTODISMISS_TIME = 1500;

export const ENTER_KEY = 'Enter';
export const BACKSPACE_KEY = '⌫';
export const KEYBOARD_LETTERS: KeyboardKey[] = [
  { value: 'Q', eventCode: 'KeyQ' },
  { value: 'W', eventCode: 'KeyW' },
  { value: 'E', eventCode: 'KeyE' },
  { value: 'R', eventCode: 'KeyR' },
  { value: 'T', eventCode: 'KeyT' },
  { value: 'Y', eventCode: 'KeyY' },
  { value: 'U', eventCode: 'KeyU' },
  { value: 'I', eventCode: 'KeyI' },
  { value: 'O', eventCode: 'KeyO' },
  { value: 'P', eventCode: 'KeyP' },
  { value: 'A', eventCode: 'KeyA' },
  { value: 'S', eventCode: 'KeyS' },
  { value: 'D', eventCode: 'KeyD' },
  { value: 'F', eventCode: 'KeyF' },
  { value: 'G', eventCode: 'KeyG' },
  { value: 'H', eventCode: 'KeyH' },
  { value: 'J', eventCode: 'KeyJ' },
  { value: 'K', eventCode: 'KeyK' },
  { value: 'L', eventCode: 'KeyL' },
  { value: ENTER_KEY, eventCode: ENTER_KEY },
  { value: 'Z', eventCode: 'KeyZ' },
  { value: 'X', eventCode: 'KeyX' },
  { value: 'C', eventCode: 'KeyC' },
  { value: 'V', eventCode: 'KeyV' },
  { value: 'B', eventCode: 'KeyB' },
  { value: 'N', eventCode: 'KeyN' },
  { value: 'M', eventCode: 'KeyM' },
  { value: BACKSPACE_KEY, eventCode: 'Backspace' },
];

export const VALID_EVENTS = KEYBOARD_LETTERS.map(item => item.eventCode);

/* GAME constants */
export const DEFAULT_ROWS_NUMBER = 6;

export const DEFAULT_COLUMNS_NUMBER = 5;

export const MIN_COLUMNS_ROWS = 4;
export const MAX_COLUMNS_ROWS = 10;

export const getAriaLabelForLetter = (letter: string, status: LetterStatus) => {
  const labels: { [key: string]: string } = {
    [LetterStatus.INCLUDED]: i18n.global.t('includedLetter', { letter }),
    [LetterStatus.MATCHED]: i18n.global.t('matchedLetter', { letter }),
    [LetterStatus.NOT_MATCHED]: i18n.global.t('notMatchedLetter', { letter }),
  };
  return labels[status] || '';
};

export const MODALS_DATA = {
  ABOUT: {
    title: 'about',
    component: 'About',
    modalClass: '',
  },
  SETTINGS: {
    title: 'settings',
    component: 'Settings',
  },
  STATISTICS: {
    title: 'statistics',
    component: 'Statistics',
  },
  PRIVACY_POLICY: {
    title: 'privacyPolicy',
    component: 'PrivacyPolicy',
  },
};

export const WORDLE_URL = 'https://www.nytimes.com/games/wordle/index.html';

export const GITHUB_URL = 'https://github.com/marianapatcosta';

export const GAME_EXAMPLES = {
  [Locale.EN]: { solution: 'PRIME', guess: 'MOIST' },
  [Locale.PT]: { solution: 'TEMPO', guess: 'PERNA' },
  [Locale.DE]: { solution: 'LADEN', guess: 'NACHT' },
};

export const DICTIONARY_URLS = (locale: string, word: string): string => {
  const language = locale.split('-')[0];
  const URLS = {
    [Locale.EN]: `https://api.dictionaryapi.dev/api/v2/entries/${language}/${word}`,
    [Locale.PT]: `https://api.dicionario-aberto.net/word/${word}`,
  };

  return URLS[locale];
};

export const SHOW_MORE_AT = 95;

export const ANIMATION_DELAY = 500; // in ms

export const GAME_OVER_MESSAGES: { [key: number]: string } = {
  0: 'unbelievable',
  1: 'magnificent',
  2: 'amazing',
  3: 'incredible',
  4: 'great',
  5: 'phew',
};

export const GAME_STATISTICS = ['numberOfGames', 'winRate', 'currentStreak', 'bestStreak'];

export const EMOJI_BOARD = {
  [LetterStatus.MATCHED]: '🟩',
  [LetterStatus.INCLUDED]: '🟨',
  [LetterStatus.NOT_MATCHED]: '⬛',
};

import { i18n } from '@/locales';
import { KEYBOARD_LETTERS } from '@/constants';
import { GameCellType, KeyboardKey, LetterStatus } from '@/types';
import { useLocalStorage } from '@/composables';
import {
  COLLECTION_ONGOING_GAME,
  GAME_OVER_MESSAGES,
  DICTIONARY_URL,
  DICTIONARY_PT_URL,
  COLLECTION_STATS,
  MAX_COLUMNS_ROWS,
} from '../constants';
import { useHttpRequest } from '../composables';
import { GameStatus, HttpMethod, Locale, StoredGameStatistics } from '../types';
import {
  areWordsEqual,
  getNumberOccurrences,
  getRandomNumber,
  isLetterIncludedInWord,
  normalizeWord,
} from './general';

const { getStoredItem, saveItemInStorage } = useLocalStorage();

export const defineInitialGameBoard = (
  rowsNumber: number,
  columnsNumber: number
): GameCellType[][] =>
  Array(rowsNumber)
    .fill([])
    .map(() =>
      Array(columnsNumber)
        .fill({})
        .map(() => ({ value: '', status: LetterStatus.UNKNOWN }))
    );

export const defineInitialKeyboard = (): KeyboardKey[] =>
  KEYBOARD_LETTERS.map((key: KeyboardKey) => ({ ...key, status: LetterStatus.UNKNOWN }));

/* move to general */
// to normalize words and remove accents

/* move to general */

export const saveOngoingGame = (
  keyboard: KeyboardKey[],
  gameBoard: GameCellType[],
  wordToGuess: string,
  guessedLetters: string[]
) => {
  const gameData = {
    keyboard: keyboard.filter((key: KeyboardKey) => key.status !== LetterStatus.UNKNOWN),
    gameBoard: gameBoard,
    wordToGuess: window.btoa(wordToGuess),
    guessedLetters,
  };
  saveItemInStorage(COLLECTION_ONGOING_GAME, gameData);
};

export const updateKeyboardLetterState = (
  keyboardKeysToUpdate: KeyboardKey[],
  keyboard: KeyboardKey[]
) => {
  keyboardKeysToUpdate.forEach(({ value, status }) => {
    const keyIndex = keyboard.findIndex((key: KeyboardKey) => areWordsEqual(key.value, value));
    if (keyboard[keyIndex].status !== LetterStatus.MATCHED) {
      keyboard[keyIndex].status = status;
    }
  });
};

const getLetterMap = (letterArray: string[]): { [key: string]: number } => {
  return letterArray.reduce((letterMap: { [key: string]: number }, currentLetter: string) => {
    const normalizedLetter = normalizeWord(currentLetter);
    letterMap[normalizedLetter] =
      normalizedLetter in letterMap ? letterMap[normalizedLetter] + 1 : 1;
    return letterMap;
  }, {});
};

export const includesAllGuessedLetters = (
  currentGuess: string,
  guessedLetters: string[]
): boolean => {
  if (!guessedLetters.length) {
    return true;
  }
  const guessedLettersMap = getLetterMap(guessedLetters);
  const currentGuessMap = getLetterMap(currentGuess.split(''));

  for (const letter in guessedLettersMap) {
    if ((currentGuessMap[letter] || 0) < (guessedLettersMap[letter] || 0)) {
      return false;
    }
  }

  return true;
};

const handleGuessedLetters = (
  guessedLetters: string[],
  wordToGuess: string,
  letter: string
): void => {
  if (!guessedLetters.length) {
    guessedLetters.push(letter);
    return;
  }
  const normalizedLetter = normalizeWord(letter);
  const wordToGuessMap = getLetterMap(wordToGuess.split(''));
  const nrOccurrencesInGuessedLetters = getNumberOccurrences(normalizedLetter, guessedLetters);

  const letterNotGuessedYet1 =
    (wordToGuessMap[normalizedLetter] || 0) > nrOccurrencesInGuessedLetters;
  letterNotGuessedYet1 && guessedLetters.push(letter);
};

export const getGameValuesToUpdate = (
  currentGuess: string[],
  wordToGuess: string,
  guessedLetters: string[]
): {
  keyboardKeysToUpdate: KeyboardKey[];
  updatedRowStatuses: LetterStatus[];
  updatedGuessedLetters: string[];
} => {
  const keyboardKeysToUpdate: KeyboardKey[] = [];
  const updatedRowStatuses: string[] = Array(currentGuess.length).fill('');
  const updatedGuessedLetters: string[] = [...guessedLetters];

  currentGuess.forEach((letter: string, index: number) => {
    const isRightPosition = areWordsEqual(letter, wordToGuess[index]);

    if (isRightPosition) {
      updatedRowStatuses[index] = LetterStatus.MATCHED;
      handleGuessedLetters(updatedGuessedLetters, wordToGuess, letter);
      keyboardKeysToUpdate.push({ value: letter, status: LetterStatus.MATCHED });
    }
  });

  for (let index = 0; index < currentGuess.length; index++) {
    if (updatedRowStatuses[index]) {
      continue;
    }
    const letter = currentGuess[index];
    let isLetterIncluded = isLetterIncludedInWord(letter, wordToGuess);
    const nrOccurrencesInPreviousLetters = getNumberOccurrences(
      letter,
      currentGuess.slice(0, index)
    );
    const nrOccurrencesInWordToGuess = getNumberOccurrences(letter, wordToGuess.split(''));
    const isNotGuessed = nrOccurrencesInPreviousLetters < nrOccurrencesInWordToGuess;

    if (isLetterIncluded && isNotGuessed) {
      updatedRowStatuses[index] = LetterStatus.INCLUDED;
      handleGuessedLetters(updatedGuessedLetters, wordToGuess, letter);
      keyboardKeysToUpdate.push({ value: letter, status: LetterStatus.INCLUDED });
      continue;
    }

    updatedRowStatuses[index] = LetterStatus.NOT_MATCHED;
    keyboardKeysToUpdate.push({ value: letter, status: LetterStatus.NOT_MATCHED });
  }

  return { keyboardKeysToUpdate, updatedRowStatuses, updatedGuessedLetters };
};

export const getWords = async (nrLettersInWord: number): Promise<string[]> => {
  const fetchedWords = await import(`../words/${i18n.global.locale.value}.json`);
  return fetchedWords.default[nrLettersInWord];
};

export const getRandomWord = (words: string[]): string => {
  const randomIndex = getRandomNumber(0, words.length - 1);
  return words[randomIndex];
};

export const extractWordDefinition = (data: any): string => {
  if (!data[0]) {
    return '';
  }
  return data[0].meanings.reduce(
    (meanings: string, currentMeaning: any) =>
      `${meanings} \n [${currentMeaning.partOfSpeech}]: ${currentMeaning.definitions.reduce(
        (definitions: string, currentDefinition: any) =>
          `${definitions} ${currentDefinition.definition}`,
        ''
      )}`,
    ''
  );
};

export const extractWordDefinitionPt = (data: any): string => {
  if (!data[0] || !window.DOMParser) {
    return '';
  }

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(data[0].xml, 'text/xml');
  const definitionsTags = xmlDoc?.getElementsByTagName('def');

  if (!definitionsTags?.length) {
    return '';
  }

  return Array.from(definitionsTags).reduce(
    (definitions, currentDefinition) =>
      `${definitions} ${currentDefinition.childNodes[0].nodeValue?.replace(
        /(\r\n|\n|\r)/gm,
        ''
      )}\n`,
    ''
  );
};

export const fetchWordDefinition = async (word: string): Promise<string> => {
  const { sendRequest } = useHttpRequest();
  const isPT = i18n.global.locale.value === Locale.PT;
  const url = isPT
    ? DICTIONARY_PT_URL(word)
    : DICTIONARY_URL(i18n.global.locale.value.split('-')[0], word);
  const data = await sendRequest(url, HttpMethod.GET);
  const definition = isPT ? extractWordDefinitionPt(data) : extractWordDefinition(data);
  return definition;
};

export const getGameOverMessage = (
  currentRow: number,
  rowNumber: number,
  lost?: boolean
): string => {
  if (lost) {
    return 'lossMessage';
  }
  const indexToReturn: number = Math.round(
    (currentRow * Object.keys(GAME_OVER_MESSAGES).length) / rowNumber
  );
  return GAME_OVER_MESSAGES[indexToReturn];
};

export const updateGameStatistics = (currentRow: number, gameStatus: GameStatus) => {
  const statistics = getStatistics();

  statistics.numberOfGames = statistics.numberOfGames + 1;
  statistics.currentStreak = gameStatus === GameStatus.LOST ? 0 : statistics.currentStreak + 1;
  if (statistics.currentStreak > statistics.bestStreak) {
    statistics.bestStreak = statistics.currentStreak;
  }

  const guessToUpdate = gameStatus === GameStatus.LOST ? 'lost' : currentRow;
  statistics.guessesDistribution[guessToUpdate] = statistics.guessesDistribution[currentRow] + 1;

  saveItemInStorage(COLLECTION_STATS, statistics);
};

export const getStatistics = (): StoredGameStatistics => {
  const storedStatistics: StoredGameStatistics = getStoredItem(COLLECTION_STATS);

  if (storedStatistics) {
    return storedStatistics;
  }

  const guessesDistribution = {} as { [key: string]: number };
  for (let index = 1; index <= MAX_COLUMNS_ROWS; index++) {
    guessesDistribution[index] = 0;
  }
  guessesDistribution['❌'] = 0;

  return {
    numberOfGames: 0,
    currentStreak: 0,
    bestStreak: 0,
    guessesDistribution,
  };
};

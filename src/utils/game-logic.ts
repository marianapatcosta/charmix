import { KEYBOARD_LETTERS } from '@/constants';
import { GameCellType, KeyboardKey, LetterStatus } from '@/types';
import { useLocalStorage } from '@/composables';
import {
  COLLECTION_ONGOING_GAME,
  GAME_OVER_MESSAGES,
} from '../constants';
import {
  areWordsEqual,
  getNumberOccurrences,
  isLetterIncludedInWord,
  normalizeWord,
} from './general';

const { saveItemInStorage } = useLocalStorage();

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

export const saveOngoingGame = (
  keyboard: KeyboardKey[],
  gameBoard: GameCellType[][],
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

  const letterNotGuessed = (wordToGuessMap[normalizedLetter] || 0) > nrOccurrencesInGuessedLetters;
  letterNotGuessed && guessedLetters.push(letter);
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
  const updatedRowStatuses: LetterStatus[] = Array(currentGuess.length).fill('');
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

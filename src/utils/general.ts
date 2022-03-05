const toClockString = (time: number) => String(time).padStart(2, '0');

export const formatTime = (timeInMilliseconds: number): string => {
  // 1h = 36000ms
  const hours = toClockString(Math.floor(timeInMilliseconds / 3600000));
  // 1min = 60000ms
  const minutes = toClockString(Math.floor((timeInMilliseconds % 3600000) / 60000));
  // 1s = 1000ms
  const seconds = toClockString(Math.floor(((timeInMilliseconds % 360000) % 60000) / 1000)); // 1s = 1000ms
  return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
};

export const deepClone = (objectToCopy: object): object => {
  // check if the value is a primitive
  if (typeof objectToCopy !== 'object' || objectToCopy === null) {
    return objectToCopy;
  }

  if (objectToCopy instanceof Date) {
    return new Date(objectToCopy);
  }

  if (objectToCopy instanceof RegExp) {
    return new RegExp(objectToCopy);
  }

  const copiedObject = Array.isArray(objectToCopy) ? [] : ({} as { [key: string]: unknown });

  for (const key in objectToCopy as { [key: string]: unknown }) {
    const value = objectToCopy[key];
    copiedObject[key] = deepClone(value);
  }

  return copiedObject;
};

// returns a number between min and max , inclusive
export const getRandomNumber = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const normalizeWord = (word: string): string =>
  word
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export const areWordsEqual = (wordA: string, wordB: string) =>
  normalizeWord(wordA) === normalizeWord(wordB);

export const isLetterIncludedInWord = (letter: string, word: string) =>
  normalizeWord(word).includes(normalizeWord(letter));

export const getNumberOccurrences = (letter: string, letterArray: string[]): number =>
  letterArray.filter(letterInArray => areWordsEqual(letterInArray, letter)).length;

export const findWordInList = (wordToFind: string, wordList: string[]): string | undefined => {
  for (const word of wordList) {
    if (areWordsEqual(word, wordToFind)) {
      return word;
    }
  }
};

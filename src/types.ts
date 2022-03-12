import { DefineComponent } from 'vue';

export const enum Locale {
  EN = 'en-UK',
  PT = 'pt-PT',
  DE = 'de-DE',
  FR = 'fr-FR',
  ES = 'es-ES',
  IT = 'it-IT',
}

export const enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

export enum GameStatus {
  READY = 'ready',
  PLAYING = 'playing',
  WIN = 'win',
  LOST = 'lost',
}

export enum LetterStatus {
  UNKNOWN = 'unknown',
  INCLUDED = 'included',
  MATCHED = 'matched',
  NOT_MATCHED = 'not-matched',
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export enum ToastType {
  ALERT = 'alert',
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
}

export enum CellAnimation {
  FLIP = 'flip',
  WIN = 'wave',
  ERROR = 'shake',
}

export type InputData = { value: string; caption: string };

export type ResponseData = Promise<any>;

export type GameCellType = { value: string; status: LetterStatus; animation?: string };

export type KeyboardKey = { value: string; eventCode?: string; status?: LetterStatus };

export type ToastData = { message: string; type: ToastType | null };

export type Game = {
  currentRow: number;
  currentColumn: number;
  gameBoard: GameCellType[][];
  keyboard: KeyboardKey[];
  guessedLetters: string[];
  currentGameStatus: GameStatus;
  isGameDisabled: boolean;
  wordToGuess: string;
};

export type StoredGame = {
  keyboard: KeyboardKey[];
  gameBoard: GameCellType[][];
  wordToGuess: string;
  guessedLetters: string[];
};

export type StoredGameSettings = {
  columnsNumber: number;
  rowsNumber: number;
  hardMode: boolean;
};

export type StoredGameStatistics = {
  numberOfGames: number;
  currentStreak: number;
  bestStreak: number;
  guessesDistribution: { [key: string]: number };
};

export type ModalData = { title: string; component: string; };

export type GameType = {
  currentRow: number;
  currentColumn: number;
  gameBoard: GameCellType[][];
  keyboard: KeyboardKey[];
  guessedLetters: string[];
  currentGameStatus: GameStatus;
  isGameDisabled: boolean;
  wordToGuess: string;
};

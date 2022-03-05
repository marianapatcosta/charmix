<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, toRefs, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useLocale, useState, useLocalStorage } from '@/composables';
import { useStore } from '@/store';
import * as components from '@/components';
import {
  CellAnimation,
  GameCellType,
  GameStatus,
  GameType,
  ModalData,
  ToastData,
  ToastType,
  StoredGame,
} from '@/types';
import {
  BACKSPACE_KEY,
  COLLECTION_ONGOING_GAME,
  ENTER_KEY,
  MODALS_DATA,
  SHOW_MORE_AT,
  ANIMATION_DELAY,
} from '@/constants';
import {
  defineInitialGameBoard,
  defineInitialKeyboard,
  getWords,
  getRandomWord,
  updateKeyboardLetterState,
  saveOngoingGame,
  includesAllGuessedLetters,
  getGameOverMessage,
} from '@/utils/game-logic';
import { areWordsEqual, findWordInList } from './utils/general';
import { deepClone } from '@/utils/general';
import {
  fetchWordDefinition,
  getGameValuesToUpdate,
  updateGameStatistics,
} from './utils/game-logic';
const { Definition, GameBoard, Header, Keyboard, Modal, Toast } = components;

const { t, currentLocale, getStoredLocale } = useLocale();
const { getStoredItem, removeStoredItem } = useLocalStorage();

const store = useStore();
const { columnsNumber, rowsNumber, hardMode } = storeToRefs(store);
const [words, setWords] = useState<string[]>([]);

const initialGameState: GameType = {
  currentRow: 0,
  currentColumn: 0,
  gameBoard: defineInitialGameBoard(rowsNumber.value, columnsNumber.value),
  keyboard: defineInitialKeyboard(),
  guessedLetters: [] as string[],
  currentGameStatus: GameStatus.READY,
  isGameDisabled: false,
  wordToGuess: '',
};

let game = reactive(deepClone(initialGameState) as GameType);
const {
  currentRow,
  currentColumn,
  currentGameStatus,
  gameBoard,
  keyboard,
  guessedLetters,
  isGameDisabled,
  wordToGuess,
} = toRefs(game);

const isGameStarted = computed(() => currentGameStatus.value === GameStatus.PLAYING);
const isGameOver = computed(() =>
  [GameStatus.WIN, GameStatus.LOST].includes(currentGameStatus.value)
);

const [wordDictionaryDefinition, setDictionaryDefinition] = useState<string>('');
const toastData = reactive<ToastData>({ message: '', type: null });

const cssGridVars = computed(() => ({
  '--grid-columns': columnsNumber.value,
  '--grid-rows': rowsNumber.value,
}));
const delayToFinishFlip = computed(() => ANIMATION_DELAY * columnsNumber.value - 2);

const [modalData, setModalData] = useState<ModalData | null>(null);

const selectLetter = (letter: string) => {
  if (letter === ENTER_KEY) {
    return checkGuess();
  }

  if (letter === BACKSPACE_KEY) {
    return deleteLetter();
  }

  if (currentGameStatus.value !== GameStatus.PLAYING) {
    currentGameStatus.value = GameStatus.PLAYING;
  }
  addLetter(letter);
};

const checkGuess = () => {
  if (game.currentColumn <= columnsNumber.value - 1) {
    return onCheckError(t('lowLetterNumberError', { numberOfLetters: columnsNumber.value }));
  }
  const currentGuess = [...game.gameBoard[game.currentRow]].map(({ value }) => value).join('');
  const wordInList = findWordInList(currentGuess, words.value);

  if (!wordInList) {
    return onCheckError(t('invalidWordError'));
  }

  if (hardMode.value && !includesAllGuessedLetters(currentGuess, guessedLetters.value)) {
    return onCheckError(t('guessedLettersNotIncludedError'));
  }

  updateGame(wordInList);
  const isCorrectGuess = areWordsEqual(currentGuess, wordToGuess.value.toUpperCase());

  if (isCorrectGuess) {
    return onGameOver(GameStatus.WIN);
  }

  if (currentRow.value >= rowsNumber.value) {
    return onGameOver(GameStatus.LOST);
  }

  setTimeout(() => {
    currentRow.value = currentRow.value + 1;
    currentColumn.value = 0;
  }, delayToFinishFlip.value);
};

const onCheckError = (message: string) => {
  isGameDisabled.value = true;
  addCellAnimation(CellAnimation.ERROR);
  setToastData(message, ToastType.ALERT);
};

const onGameOver = (gameStatus: GameStatus) => {
  const animation = gameStatus === GameStatus.WIN ? CellAnimation.WIN : CellAnimation.ERROR;
  currentGameStatus.value = gameStatus;
  updateGameStatistics(currentRow.value, gameStatus);

  setTimeout(() => {
    isGameDisabled.value = true;
    addCellAnimation(animation);
  }, delayToFinishFlip.value);

  setTimeout(() => {
    setToastData(
      t(getGameOverMessage(currentRow.value, rowsNumber.value, gameStatus === GameStatus.LOST), {
        solution: wordToGuess,
      }),
      ToastType.INFO
    );
    openModal(MODALS_DATA.STATISTICS);
    // 1.5 because wave/shake animations have 0.25s duration instead of 0.5s
  }, delayToFinishFlip.value * 1.5 + 1000);
};

const resetGame = () => {
  currentRow.value = initialGameState.currentRow;
  currentColumn.value = initialGameState.currentColumn;
  currentGameStatus.value = initialGameState.currentGameStatus;
  gameBoard.value = defineInitialGameBoard(rowsNumber.value, columnsNumber.value);
  keyboard.value = defineInitialKeyboard();
  guessedLetters.value = initialGameState.guessedLetters;
  isGameDisabled.value = initialGameState.isGameDisabled;
  wordToGuess.value = getRandomWord(words.value);
  removeStoredItem(COLLECTION_ONGOING_GAME);
};

const updateGame = (wordInList: string) => {
  const currentGuess = gameBoard.value[currentRow.value].map((cell: GameCellType) => cell.value);
  const isGuessedWordExactlyTheSame = wordInList === currentGuess.join('');
  const { keyboardKeysToUpdate, updatedRowStatuses, updatedGuessedLetters } = getGameValuesToUpdate(
    currentGuess,
    wordToGuess.value,
    guessedLetters.value
  );

  guessedLetters.value = updatedGuessedLetters;
  gameBoard.value[currentRow.value].forEach((letter: GameCellType, index: number) => {
    setTimeout(() => {
      letter.animation = CellAnimation.FLIP;
      if (updatedRowStatuses[index]) {
        letter.status = updatedRowStatuses[index];
      }

      // to correct the letters if the guessed the word is not exactly equal to the word found in DB (e.g. pátio vs patio)
      if (!isGuessedWordExactlyTheSame) {
        letter.value = wordInList[index].toUpperCase();
      }
    }, ANIMATION_DELAY * index);
  });

  setTimeout(() => {
    updateKeyboardLetterState(keyboardKeysToUpdate, keyboard.value);
    saveOngoingGame(keyboard.value, gameBoard.value, wordToGuess.value, guessedLetters.value);
  }, delayToFinishFlip.value);
};

const addLetter = (letter: string) => {
  if (currentColumn.value < columnsNumber.value && currentRow.value < rowsNumber.value) {
    gameBoard.value[currentRow.value][currentColumn.value].value = letter;
    currentColumn.value = currentColumn.value + 1;
  }
};

const deleteLetter = () => {
  if (currentColumn.value > 0) {
    currentColumn.value = currentColumn.value - 1;
    gameBoard.value[currentRow.value][currentColumn.value].value = '';
  }
};

const setToastData = (message: string, type: ToastType | null) => {
  toastData.message = message;
  toastData.type = type;
};

const addCellAnimation = (animation: string) =>
  gameBoard.value[currentRow.value].forEach((cell: GameCellType) => (cell.animation = animation));

const clearCellAnimation = () => {
  gameBoard.value[currentRow.value].forEach((cell: GameCellType) => delete cell.animation);
};

const onToastDismiss = () => {
  toastData.message = '';
  toastData.type = null;
  clearCellAnimation();
  !isGameOver.value && (isGameDisabled.value = false);
};

const openModal = (modalData: ModalData) => {
  setModalData(modalData);
  isGameDisabled.value = true;
};
const closeModal = () => {
  setModalData(null);
  isGameDisabled.value = false;
  if (isGameOver.value) {
    resetGame();
  }
};

const setupWord = async () => {
  const word = getRandomWord(words.value);
  wordToGuess.value = word;
  const definition = await fetchWordDefinition(word) || '';
  setDictionaryDefinition(definition);
};

const onGameInit = async () => {
  const storedGame = getStoredItem(COLLECTION_ONGOING_GAME) as StoredGame;

  if (storedGame) {
    updateKeyboardLetterState(storedGame.keyboard, keyboard.value);
    storedGame.gameBoard.forEach(
      (gameRow: GameCellType[], index: number) => gameRow[0] && (gameBoard.value[index] = gameRow)
    );
    wordToGuess.value = window.atob(storedGame.wordToGuess);
    guessedLetters.value = storedGame.guessedLetters;
    currentRow.value = storedGame.gameBoard.filter(
      (gameRow: GameCellType[]) => gameRow[0].value
    ).length;
    currentGameStatus.value = GameStatus.PLAYING;
    return;
  }

  if (!wordToGuess.value) {
    setupWord();
  }
};

watch([currentLocale, columnsNumber], async () => {
  const words = await getWords(columnsNumber.value);
  setWords(words);
  setupWord();
});

watch(
  [columnsNumber, rowsNumber],
  () => (gameBoard.value = defineInitialGameBoard(rowsNumber.value, columnsNumber.value))
);

onMounted(async () => {
  getStoredLocale();
  store.getStoredTheme();
  store.getStoredGameSettings();
  const words = await getWords(columnsNumber.value);
  setWords(words);
  onGameInit();
});

onBeforeUnmount(() =>
  currentGameStatus.value === GameStatus.PLAYING
    ? saveOngoingGame(keyboard.value, gameBoard.value, wordToGuess.value)
    : removeStoredItem(COLLECTION_ONGOING_GAME)
);
</script>

<template>
  <Header @open-modal="openModal" @reset-game="resetGame" />
  <GameBoard :board="gameBoard.flat()" :style="cssGridVars" />
  <Keyboard :keyboard="keyboard" :disabled="isGameDisabled" @select-letter="selectLetter" />
  <transition name="fade">
    <Modal v-if="!!modalData" :title="t(modalData.title)" @close-modal="closeModal">
      <component
        :is="components[modalData.component]"
        :isGameOver="isGameOver"
        :isGameStarted="isGameStarted"
        :gameBoard="gameBoard"
        @set-toast="setToastData"
      />
    </Modal>
  </transition>
  <transition name="slide-fade">
    <Toast
      v-if="!!toastData.message"
      :message="toastData.message"
      :type="toastData.type"
      :autoDismissable="!isGameOver"
      @dismiss="onToastDismiss"
    >
      <Definition
        v-if="isGameOver"
        :title="toastData.message"
        :wordToGuess="wordToGuess"
        :wordDefinition="wordDictionaryDefinition"
        :showMoreAt="SHOW_MORE_AT"
      />
    </Toast>
  </transition>
</template>

<style lang="scss" src="./App.scss"></style>

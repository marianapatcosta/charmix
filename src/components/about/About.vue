<script setup lang="ts" >
import { computed, onMounted, reactive, ref } from 'vue';
import { GameBoard } from '@/components';
import { useLocale } from '@/composables';
import { GAME_NAME, GAME_EXAMPLES, WORDLE_URL } from '@/constants';
import { CellAnimation, LetterStatus, GameCellType } from '@/types';
import { defineInitialGameBoard } from '@/utils/game-logic';

const { t, currentLocale } = useLocale();
const { solution, guess } = GAME_EXAMPLES[currentLocale.value];
const gameBoard = reactive(defineInitialGameBoard(1, 5));
const cssGridVars = computed(() => ({
  '--grid-columns': 5,
  '--grid-rows': 1,
}));

const matchedLetter = ref('');
const includedLetter = ref('');
const otherLetters = ref<string[]>([]);

const getCellStatus = (index: number): LetterStatus => {
  if (solution[index] === guess[index]) {
    matchedLetter.value = guess[index];
    return LetterStatus.MATCHED;
  }

  if (solution.includes(guess[index])) {
    includedLetter.value = guess[index];
    return LetterStatus.INCLUDED;
  }
  otherLetters.value.push(guess[index]);
  return LetterStatus.NOT_MATCHED;
};

onMounted(() => {
  gameBoard[0].forEach((cell: GameCellType, index: number) => {
    cell.value = guess[index];
    cell.status = getCellStatus(index);
    cell.animation = CellAnimation.FLIP;
  });
});
</script>

<template>
  <div class="about">
    <i18n-t keypath="about1" tag="p" scope="global">
      <strong>{{ GAME_NAME }}</strong>
      <a :href="WORDLE_URL" target="_blank" rel="nofollow noopener noreferrer">Wordle</a>
      <strong>{{ GAME_NAME }}</strong>
    </i18n-t>
    <h5>{{ t('howToPlay') }}</h5>
    <p>{{ t('howToPlay1') }}</p>
    <i18n-t keypath="howToPlay2" tag="p" scope="global">
      <kbd>Enter</kbd>
    </i18n-t>
    <i18n-t keypath="howToPlay3" tag="p" scope="global">
      <strong> {{ guess }}</strong>
      <strong> {{ solution }}</strong>
    </i18n-t>
    <GameBoard :board="gameBoard.flat()" :style="cssGridVars" />
    <i18n-t keypath="howToPlay4" tag="p" scope="global">
      <span class="about__letter about__letter--matched">{{ matchedLetter }}</span>
    </i18n-t>
    <i18n-t keypath="howToPlay5" tag="p" scope="global">
      <span class="about__letter about__letter--included">{{ includedLetter }}</span>
    </i18n-t>
    <i18n-t keypath="howToPlay6" tag="p" scope="global">
      <span
        class="about__letter about__letter--not-matched"
        v-for="letter in otherLetters"
        :key="`other-${letter}`"
      >
        {{ letter }}
      </span>
    </i18n-t>
  </div>
</template>

<style scoped lang="scss" src="./About.scss"></style>

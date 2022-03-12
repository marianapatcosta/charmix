<script setup lang="ts">
import { StyleValue } from 'vue';
import { storeToRefs } from 'pinia';
import { getAriaLabelForLetter } from '@/constants';
import { useStore } from '@/store';
import { GameCellType } from '@/types';

interface GameCellProps {
  data: GameCellType;
  cellIndex: number;
}
const store = useStore();
const { columnsNumber } = storeToRefs(store);
const props = defineProps<GameCellProps>();

const cssProps = { '--animation-delay': props.cellIndex % columnsNumber.value } as StyleValue; 


</script>
<template>
  <div
    :class="['game-cell', `game-cell--${data.status} game-cell--${data.animation}`]"
    :style="cssProps"
    :aria-label="getAriaLabelForLetter(data.value, data.status)"
  >
    {{ data.value }}
  </div>
</template>

<style scoped lang="scss" src="./GameCell.scss"></style>

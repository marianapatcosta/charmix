<script setup lang="ts">
import { GameCellType } from '@/types';
import { getAriaLabelForLetter } from '@/constants';

interface GameCellProps {
  data: GameCellType;
  index: number;
}

defineProps<GameCellProps>();
</script>
<template>
  <div
    :class="['game-cell', `game-cell--${data.status} game-cell--${data.animation}`]"
    :style="{ '--animation-delay': index }"
    :aria-label="getAriaLabelForLetter(data.value, data.status)"
  >
    {{ data.value }}
  </div>
</template>

<style scoped lang="scss" src="./GameCell.scss"></style>

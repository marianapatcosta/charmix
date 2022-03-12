<script setup lang="ts">
import { GameCellType } from '@/types';
import { GameCell } from '@/components';

interface GameBoardProps {
  board: Array<GameCellType>;
}

defineProps<GameBoardProps>();
</script>
<template>
  <div class="board">
    <GameCell
      v-for="(cell, index) in board"
      :key="`letter-${cell.value}-${index}`"
      :data="cell"
      :cellIndex="index"
    />
  </div>
</template>
<style scoped lang="scss" src="./GameBoard.scss"></style>

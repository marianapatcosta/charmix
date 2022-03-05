<script setup lang="ts">
import { computed } from 'vue';

interface DefinitionProps {
  title: string;
  wordToGuess: string;
  wordDefinition: string;
  showMoreAt: number;
}

const props = defineProps<DefinitionProps>();

const word = computed(() => `${props.wordToGuess[0]?.toUpperCase()}${props.wordToGuess.slice(1)}`);
</script>
<template>
  <div class="definition">
    <h6>{{ title }}</h6>
    <details v-if="wordDefinition">
      <summary>
        <strong> {{ word }}</strong>
        <br />
        <p>{{ wordDefinition.slice(0, showMoreAt) }}</p>
      </summary>
      <p>{{ wordDefinition.slice(showMoreAt) }}</p>
    </details>
    <p v-else-if="wordDefinition?.length < showMoreAt">
      <strong> {{ word }}</strong>
      <br />
      {{ wordDefinition }}
    </p>
    <p v-else>
      <strong> {{ word }}</strong>
    </p>
  </div>
</template>

<style scoped lang="scss" src="./Definition.scss"></style>

<script setup lang="ts">
import { useLocale } from '@/composables';
import { computed } from 'vue';

interface DefinitionProps {
  title: string;
  wordToGuess: string;
  wordDefinition: string;
  showMoreAt: number;
}
const { t } = useLocale()

const props = defineProps<DefinitionProps>();

const word = computed(() => `${props.wordToGuess[0]?.toUpperCase()}${props.wordToGuess.slice(1)}`);
</script>
<template>
  <div class="definition">
    <h6>{{ title }}</h6>
    <details v-if="wordDefinition">
      <summary>
        <strong> {{ t('correctWord', { word }) }}</strong>
        <br />
      </summary>
      <p>{{ wordDefinition }}</p>
    </details>
    <p v-else>
      <strong> {{ t('correctWord', { word }) }}</strong>
    </p>
  </div>
</template>

<style scoped lang="scss" src="./Definition.scss"></style>

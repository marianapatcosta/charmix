<script setup lang="ts">
import { computed } from 'vue';
import { useLocale } from '@/composables';

interface HistogramProps {
  histogramData: { [key: string]: number };
  histogramHeight?: string;
}

const { t } = useLocale();
const props = withDefaults(defineProps<HistogramProps>(), { histogramHeight: '10rem' });

const maxBar = Math.max(...Object.values(props.histogramData));
const histogramDataToDisplay = computed(() => Object.entries(props.histogramData));
console.log(777, histogramDataToDisplay.value)
const getBarHeight = (value: number): number => (value / maxBar) * 100 || 1;
</script>
<template>
  <div class="histogram" :style="{ height: histogramHeight }">
    <div
      class="histogram__bar"
      v-for="bar in histogramDataToDisplay"
      :key="`bar-${bar[0]}`"
      :style="{ height: `${getBarHeight(bar[1])}%` }"
      :data-value="bar[0]"
      role="progressbar"
      :value="bar[1]"
      :aria-label="t('histogramBarLabel', { bar: bar[0], value: bar[1] })"
      :aria-valuemin="0"
      :aria-valuenow="bar[1]"
      :aria-valuemax="maxBar"
      :max="maxBar"
    >
    {{ bar[1] ? bar[1] : ''}}
    </div>
  </div>
</template>

<style scoped lang="scss" src="./Histogram.scss"></style>

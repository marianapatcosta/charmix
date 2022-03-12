<script setup lang="ts" >
import { StoreState, storeToRefs } from 'pinia';
import { InputNumber, Select, Toggle } from '@/components';
import { useLocale } from '@/composables';
import { LocalesData, MIN_COLUMNS_ROWS, MAX_COLUMNS_ROWS } from '@/constants.ts';
import { useStore } from '@/store';

interface SettingsProps {
  isGameStarted: boolean;
}

defineProps<SettingsProps>();

const { t, currentLocale, defineLocale } = useLocale();
const store = useStore();
const { isDarkMode, columnsNumber, rowsNumber, hardMode } = storeToRefs(store);

const onLanguageUpdate = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  defineLocale(target.value);
};

const onThemeUpdate = (event: Event) => {
  const target = event.target as HTMLInputElement;
  store.setTheme(target.checked);
};

const onCheckboxUpdate = (event: Event) => {
  const target = event.target as HTMLInputElement;
  store.updateGameSettingsItem(target.name as keyof StoreState, target.checked);
};

const onInputUpdate = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.value < MIN_COLUMNS_ROWS || target.value > MAX_COLUMNS_ROWS) {
    return;
  }
  store.updateGameSettingsItem(target.name, parseInt(target.value));
};
</script>

<template>
  <div class="settings">
    <Toggle
      class="settings__item"
      :label="t('darkMode')"
      name="darkMode"
      :checked="isDarkMode"
      :aria-label="t('changeDarkMode', { status: isDarkMode ? t('disable') : t('enable') })"
      @change="onThemeUpdate"
    />
    <Toggle
      class="settings__item"
      :label="t('hardMode')"
      name="hardMode"
      :disabled="isGameStarted"
      :checked="hardMode"
      :aria-label="t('changeHardMode', { status: hardMode ? t('disable') : t('enable') })"
      :showAsterisk="isGameStarted"
      @change="onCheckboxUpdate"
    />
    <InputNumber
      class="settings__item"
      :label="t('columnsNumber')"
      name="columnsNumber"
      :min="MIN_COLUMNS_ROWS"
      :max="MAX_COLUMNS_ROWS"
      :disabled="isGameStarted"
      :value="columnsNumber"
      :aria-label="t('changeColumnsNumber')"
      :showAsterisk="isGameStarted"
      @change="onInputUpdate"
    />
    <InputNumber
      class="settings__item"
      :label="t('rowsNumber')"
      name="rowsNumber"
      :min="MIN_COLUMNS_ROWS"
      :max="MAX_COLUMNS_ROWS"
      :disabled="isGameStarted"
      :value="rowsNumber"
      :aria-label="t('changeRowsNumber')"
      :showAsterisk="isGameStarted"
      @change="onInputUpdate"
    />
    <Select
      class="settings__item"
      :label="t('language')"
      name="language-picker"
      :value="currentLocale"
      :aria-label="t('changeLanguage')"
      :disabled="isGameStarted"
      :options="LocalesData"
      optionValueKey="value"
      optionLabelKey="caption"
      :showAsterisk="isGameStarted"
      @change="onLanguageUpdate"
    />
    <p class="settings__error" v-if="isGameStarted">*{{ t('cannotUpdateError') }}</p>
  </div>
</template>

<style scoped lang="scss" src="./Settings.scss"></style>

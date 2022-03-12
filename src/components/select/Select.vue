<script setup lang="ts">
import { useLocale } from '@/composables';
const { t } = useLocale();

interface SelectProps {
  label: string;
  value: unknown;
  options: Array<unknown>;
  name?: string;
  disabled?: boolean;
  ariaLabel?: string;
  optionValueKey?: string;
  optionLabelKey?: string;
  showAsterisk?: boolean;
}

defineProps<SelectProps>();
</script>
<template>
  <label class="select">
    <p>{{ label }}<span class="select__asterisk" v-if="showAsterisk">*</span></p>
    <select :name="name" :value="value" :aria-label="ariaLabel" :disabled="disabled">
      <option
        v-for="option in options"
        :key="`${name}-${optionLabelKey ? t(option[optionLabelKey] as string) : t(option )}`"
        :value="optionValueKey ? option[optionValueKey] : option"
      >
        {{ optionLabelKey ? t(option[optionLabelKey]) : t(option) }}
      </option>
    </select>
    <slot></slot>
  </label>
</template>

<style scoped lang="scss" src="./Select.scss"></style>

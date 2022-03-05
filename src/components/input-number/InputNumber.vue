<script setup lang="ts">
interface InputNumberProps {
  label: string;
  value: unknown;
  name?: string;
  disabled?: boolean;
  ariaLabel?: string;
  showAsterisk?: boolean;
  min?: number;
  max?: number;
}

defineProps<InputNumberProps>();
</script>
<template>
  <label class="input-number">
    <p>{{ label }}<span class="input-number__asterisk" v-if="showAsterisk">*</span></p>
    <span class="input-number__arrows">
      <input
        type="number"
        :name="name"
        :min="min"
        :max="max"
        :disabled="disabled"
        :value="value"
        :aria-label="ariaLabel"
      />
    </span>
  </label>
</template>

<style scoped lang="scss" src="./InputNumber.scss"></style>

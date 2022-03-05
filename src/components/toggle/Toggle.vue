<script setup lang="ts">
interface ToggleProps {
  label: string;
  checked: boolean;
  name?: string;
  disabled?: boolean;
  ariaLabel?: string;
  showAsterisk?: boolean;
}

defineProps<ToggleProps>();
</script>
<template>
  <label class="toggle">
    <p>{{ label }}<span class="toggle__asterisk" v-if="showAsterisk">*</span></p>

    <input
      type="checkbox"
      :name="name"
      :disabled="disabled"
      :checked="checked"
      :aria-label="ariaLabel"
    />
    <span class="toggle__slider"></span>
    <slot></slot>
  </label>
</template>

<style scoped lang="scss" src="./Toggle.scss"></style>

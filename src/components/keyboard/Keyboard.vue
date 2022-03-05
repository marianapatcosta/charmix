<script setup lang="ts">
import { onBeforeMount, onMounted, watch } from 'vue';
import { KeyboardKey } from '@/types';
import { getAriaLabelForLetter, KEYBOARD_LETTERS, VALID_EVENTS } from '@/constants';

interface KeyboardProps {
  keyboard: Array<KeyboardKey>;
  disabled: boolean;
}

const props = defineProps<KeyboardProps>();

const emit = defineEmits<{ (event: 'select-letter', letter: string): void }>();

const addLetter = (letter: string) => emit('select-letter', letter);

const handleKeyDown = (event: KeyboardEvent) => {
  if (!VALID_EVENTS.includes(event.code)) return;
  const letter = KEYBOARD_LETTERS.find((item: KeyboardKey) => item.eventCode === event.code)
    ?.value as string;
  addLetter(letter);
};

const addEventListener = () => window.addEventListener('keydown', handleKeyDown);

const removeEventListener = () => window.removeEventListener('keydown', handleKeyDown);

onMounted(addEventListener);

onBeforeMount(removeEventListener);

watch(
  () => props.disabled,
  () => {
    if (props.disabled) {
      return removeEventListener();
    }
    addEventListener();
  }
);
</script>

<template>
  <div :class="['keyboard', { 'keyboard--disabled': disabled }]">
    <button
      v-for="key in keyboard"
      :key="`key-${key.value}`"
      :class="['keyboard__key', `keyboard__key--${key.status}`]"
      :data-key="key.value"
      :aria-label="getAriaLabelForLetter(key.value, key.status)"
      @click="addLetter(key.value)"
    >
      {{ key.value }}
    </button>
  </div>
</template>

<style scoped lang="scss" src="./Keyboard.scss"></style>

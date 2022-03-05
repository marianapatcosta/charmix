<script setup lang="ts">
import { useLocale } from '@/composables';

interface ModalProps {
  title: string;
}

const { t } = useLocale();

defineProps<ModalProps>();

const emit = defineEmits<{ (event: 'close-modal'): void }>();

const closeModal = () => emit('close-modal');
</script>


<template>
  <div class="modal modal__overlay" @click="closeModal">
    <div class="modal__content" @click.stop="">
      <header class="modal__header">
        <h4>{{ title }}</h4>
        <button :aria-label="t('modalClose')" @click.stop="closeModal" @keydown.enter="closeModal">
          <span>✖</span>
        </button>
      </header>
      <main class="modal__main">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<style scoped lang="scss" src="./Modal.scss"></style>

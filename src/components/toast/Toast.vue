
<script setup lang="ts">
import { onBeforeMount, onMounted } from '@vue/runtime-core';
import { useState } from '@/composables';
import { DEFAULT_AUTODISMISS_TIME } from '@/constants';
import { useLocale } from '@/composables';
import { ToastType } from '@/types';

interface ToastProps {
  message: string;
  type: ToastType;
  autoDismissable?: boolean;
  timeToAutoDismiss?: number;
}

const { t } = useLocale();

const props = withDefaults(defineProps<ToastProps>(), {
  message: '',
  type: ToastType.INFO,
  autoDismissable: true,
  timeToAutoDismiss: DEFAULT_AUTODISMISS_TIME,
});

const emit = defineEmits<{ (event: 'dismiss'): void }>();
const handleToastDismiss = () => emit('dismiss');

const [autoDismissTimer, setAutoDismissTimer] = useState<number | null>(null);

const handleTimerSetup = () => {
  setAutoDismissTimer(setTimeout(handleToastDismiss, props.timeToAutoDismiss));
};

onMounted(() => props.autoDismissable && handleTimerSetup());

onBeforeMount(() => clearTimeout(autoDismissTimer.value as number));
</script>

<template>
  <div :class="['toast', `toast--${type}`]">
    <button
      class="toast__close"
      :aria-label="t('toastDismiss')"
      @click="handleToastDismiss"
      @keydown.enter="handleToastDismiss"
    >
      <span>✖</span>
    </button>
    <div class="toast__content">
      <slot>
        <p>{{ message }}</p>
      </slot>
    </div>
  </div>
</template>

<style scoped lang="scss" src="./Toast.scss"></style>

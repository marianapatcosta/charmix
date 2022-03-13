<script setup lang="ts" >
import { Info, Reset, Settings, Statistics } from '@/assets/icons';
import { MODALS_DATA, COUNTRY_FLAGS, GAME_NAME } from '@/constants';
import { useLocale } from '@/composables';
import { ModalData } from '@/types';

const { t, currentLocale } = useLocale();
const emit =
  defineEmits<{ (event: 'open-modal', modalData: ModalData): void; (event: 'reset-game'): void }>();
const openModal = (modalData: ModalData) => emit('open-modal', modalData);
const resetGame = () => emit('reset-game');
</script>

<template>
  <header class="header">
    <div class="header__left">
      <button
        :aria-label="t('openModal', { modal: t('about') })"
        @click="openModal(MODALS_DATA.ABOUT)"
      >
        <img :src="Info" :alt="t('about')"  />
      </button>
      <button :aria-label="t('resetGame')" @click="resetGame">
        <img :src="Reset" :alt="t('reset')" />
      </button>
    </div>
    <h1>
      {{ GAME_NAME }}
      <img :src="COUNTRY_FLAGS[currentLocale]" :alt="`${t('language')}-${currentLocale}`" />
    </h1>
    <div class="header__right">
      <button
        :aria-label="t('openModal', { modal: t('statistics') })"
        @click="openModal(MODALS_DATA.STATISTICS)"
      >
        <img :src="Statistics" :alt="t('statistics')" />
      </button>
      <button
        :aria-label="t('openModal', { modal: t('settings') })"
        @click="openModal(MODALS_DATA.SETTINGS)"
      >
        <img :src="Settings" :alt="t('settings')" />
      </button>
    </div>
  </header>
</template>

<style scoped lang="scss" src="./Header.scss"></style>

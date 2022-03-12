<script setup lang="ts">
import { useLocale } from '@/composables';
import { GITHUB_URL } from '@/constants';
const { t } = useLocale();
</script>

<template>
  <div class="privacy-policy">
   <p>{{ t('privacyPolicyDate') }}</p> 
   <p><strong>{{ t('privacyPolicyTerms1') }}</strong></p> 
   <p>{{ t('privacyPolicyTerms2') }}</p> 
   <p>{{ t('privacyPolicyTerms3') }}</p> 
   <p>{{ t('privacyPolicyTerms4') }}</p> 
    <i18n-t keypath="privacyPolicyTerms5" tag="p" scope="global">
      <a :href="GITHUB_URL" target="_blank" rel="nofollow noopener noreferrer">{{ t('here') }}</a>
    </i18n-t>
  </div>
</template>

<style scoped lang="scss" src="./PrivacyPolicy.scss"></style>

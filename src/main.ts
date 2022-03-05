import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from '@/App.vue';
import { i18n } from '@/locales';

const pinia = createPinia();

const app = createApp(App).use(i18n).use(pinia).mount('#app');

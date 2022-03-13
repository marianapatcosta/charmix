import { createApp } from 'vue';
import { useRegisterSW } from 'virtual:pwa-register/vue';
import { createPinia } from 'pinia';
import App from '@/App.vue';
import { i18n } from '@/locales';

const intervalMS = 60 * 60 * 1000;

const { updateServiceWorker } = useRegisterSW({
  onRegistered(r: ServiceWorkerRegistration | undefined) {
    r &&
      setInterval(() => {
        r.update();
      }, intervalMS);
  },
});

const pinia = createPinia();

const app = createApp(App).use(i18n).use(pinia).mount('#app');

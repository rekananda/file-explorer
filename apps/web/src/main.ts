import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import App from './App.vue'
import './style.css'
import Aura from '@primevue/themes/aura';
import 'primeicons/primeicons.css'

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
      options: {
        prefix: 'p',
        darkModeSelector: false,
        cssLayer: false
      }
  }
});

app.mount('#app');

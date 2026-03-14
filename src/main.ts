import { definePreset } from "@primeuix/themes";
import Aura from '@primeuix/themes/aura';
import PrimeVue from 'primevue/config'
import { createApp } from 'vue'

import './style.css'
import 'primeicons/primeicons.css'

import App from './App.vue'

const mainPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{orange.50}',
      100: '{orange.100}',
      200: '{orange.200}',
      300: '{orange.300}',
      400: '{orange.400}',
      500: '{orange.500}',
      600: '{orange.600}',
      700: '{orange.700}',
      800: '{orange.800}',
      900: '{orange.900}',
      950: '{orange.950}'
    }
  }
});

createApp(App)
  .use(PrimeVue, {
    theme: {
      preset: mainPreset
    },
    locale: {
      apply: "Применить",
      clear: "Очистить"
    }
  })
  .mount('#app')

import { createApp, ref } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import overflow from "@/directive/overflow";
import filters from '@/filter'

(async () => {
  const app = createApp(App)
  app.config.globalProperties.$filters = filters
  app.config.globalProperties.$utools = (window as any).utools
  app.config.globalProperties.$init = ref(false);
  app.use(vuetify)
      .directive('overflow', overflow)
      .mount('#app')
})()


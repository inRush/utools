import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import overflow from "@/directive/overflow";
import filters from '@/filter'
import Storage from '@/tools/db'

(async () => {
  await Storage.ready();
  const app = createApp(App)
  app.config.globalProperties.$filters = filters
  app.config.globalProperties.$utools = (window as any).utools
  app.use(vuetify)
      .directive('overflow', overflow)
      .mount('#app')
})()


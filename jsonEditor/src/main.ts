import { createApp } from 'vue'
import App from './App.vue'
// @ts-ignore
import vuetify from './plugins/vuetify'
// @ts-ignore
import { loadFonts } from './plugins/webfontloader'

loadFonts()

createApp(App)
    .use(vuetify)
    .mount('#app')

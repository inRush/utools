import { createApp } from 'vue'
import App from './App.vue'
// @ts-ignore
import vuetify from './plugins/vuetify'
// @ts-ignore
import { loadFonts } from './plugins/webfontloader'
import overflow from "@/directive/overflow";
loadFonts()

createApp(App)
    .use(vuetify)
    .directive('overflow',overflow)
    .mount('#app')

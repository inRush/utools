<script setup lang="ts">
import JsonViewer from '@/components/JsonViewer.vue'
import { ref } from "vue";

let show = ref(false)
let detail = ref("window.utools && utools.onPluginEnter(({code, type, payload}) => {\n" +
    "  if (payload) {\n" +
    "    let value = payload.toLowerCase();\n" +
    "    if (value !== 'json') {\n" +
    "      content.value = payload;\n" +
    "    }\n" +
    "  }\n" +
    "})\n")
const content = ref("");
// @ts-ignore
window.utools && utools.onPluginEnter(({code, type, payload}) => {
  if (payload) {
    let value = payload.toLowerCase();
    if (value !== 'json') {
      content.value = payload;
    }
  }
})
</script>

<template>
  <v-app class="app">
    <v-main>
      <!--      <button @click="show=true"> 打开</button>-->
      <!--      <history-panel v-model:show="show"></history-panel>-->
      <json-viewer v-model:value="content"></json-viewer>
      <!--      <detail-viewer :detail="detail" v-model:show="show"></detail-viewer>-->
    </v-main>
  </v-app>
</template>

<style>
#app, html, body, .app {
  height: 100% !important;
  width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden !important;
  background-color: #202124;
}

.v-text-field input {
  color: #fff !important;
}

pre {
  font-family: "Roboto", sans-serif !important;
}
</style>

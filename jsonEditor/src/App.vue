<script setup lang="ts">
import JsonViewer from '@/components/JsonViewer.vue'
import HelloWorld from '@/components/HelloWorld.vue'
import { ref } from "vue";

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
      <json-viewer v-model:value="content"></json-viewer>
<!--      <hello-world v-model:value="content"></hello-world>-->
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
</style>

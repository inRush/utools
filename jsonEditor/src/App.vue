<script setup lang="ts">
import JsonViewer from '@/components/JsonViewer.vue';
import { ref } from "vue";
import Json from "@/tools/json";

const content = ref("");
window.utools && utools.onPluginEnter(({code, type, payload}) => {
  if (payload) {
    let value = payload.toLowerCase();
    if (value && value !== 'json' && value !== '') {
      content.value = Json.beautify(payload) || payload;
    }
  }
})

function onDrop(e: DragEvent) {
  const files = e.dataTransfer?.files;
  if (files) {
    // @ts-ignore
    const fileContent = _getFile(files[0].path)?.toString();
    if (fileContent) {
      content.value = fileContent;
    }
  }
}


</script>

<template>
  <v-app class="app" @drop.prevent="onDrop" @dragenter.prevent @dragover.prevent>
    <v-main>
      <json-viewer v-model:value="content"></json-viewer>
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

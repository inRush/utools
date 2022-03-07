<script setup lang="ts">
import JsonViewer from '@/components/JsonViewer.vue';
import MonacoEditor from '@/components/MonacoEditor.vue'
import JsonPathViewer from '@/components/JsonPathViewer.vue';
import { ref } from "vue";
import Db from "@/tools/db";

const jsonObj = {
  "main": "index.html",
  "logo": "logo.png",
  "platform": [
    "win32",
    "darwin",
    "linux"
  ],
  "development": {
    "main": "http://localhost:3000"
  },
  "pluginSetting": {
    "single": false,
    "height": 0
  },
  "features": [
    {
      "code": "Json编辑器",
      "explain": "json编辑器",
      "platform": [
        "win32",
        "darwin",
        "linux"
      ],
      "cmds": [
        "Json",
        {
          "type": "regex",
          "label": "JSON",
          "match": "/^(?={)[\\s\\S]*(?<=})[\\r]*[\\n]*|^(?=\\[)[\\s\\S]*(?<=\\])[\\r]*[\\n]*/i",
          "minLength": 2
        }
      ]
    }
  ]
}
let show = ref(false)
let detail = ref(JSON.stringify(jsonObj))
const content = ref("");
// @ts-ignore
window.utools && utools.onPluginEnter(({code, type, payload}) => {
  if (payload) {
    let value = payload.toLowerCase();
    if (value && value !== 'json' && value !== '') {
      content.value = payload;
      Db.get().addHistory(payload);
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
      <!--      <json-path-viewer :json="jsonObj"/>-->
      <!--      <monaco-editor :value="detail" language="json"/>-->
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

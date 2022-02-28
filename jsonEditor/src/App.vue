<script setup lang="ts">
import JsonViewer from '@/components/JsonViewer.vue'
import { ref } from "vue";

const content = ref();

utools.onPluginEnter(({code, type, payload}) => {
  content.value = payload;
})
</script>

<template>
  <json-viewer v-model:value="content"></json-viewer>
</template>

<style>
#app, html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>

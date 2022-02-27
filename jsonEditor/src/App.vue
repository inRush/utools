<script setup lang="ts">
import JsonViewer from '@/components/JsonViewer.vue'
import { ref } from "vue";

const content = ref('{"b":1,"a":2}')
</script>

<template>
  <json-viewer :placeholder="'请输入JSON'" v-model:value="content" language="json"></json-viewer>
</template>

<style>
#app, html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>

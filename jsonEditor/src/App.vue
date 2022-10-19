<script setup lang="ts">
import JsonViewer from "@/components/JsonViewer.vue";
import Tab from "@/components/Tab.vue";
import { ref } from "vue";

const content = ref("");
const tabArr = ref([
  {
    id: new Date().getTime(),
    label: "Tab-" + new Date().getTime(),
    content: "",
  },
]);
const currTab = ref(tabArr.value[0].id);

function onDrop(e: DragEvent) {
  const files = e.dataTransfer?.files;
  if (files) {
    // @ts-ignore
    const fileContent = _getFile(files[0].path)?.toString();
    if (fileContent) {
      for (let i = 0; i < tabArr.value.length; i++) {
        const el = tabArr.value[i];
        if (el.id === currTab.value) {
          tabArr.value.splice(i, 1, { ...el, content: fileContent });
          break;
        }
      }
      // content.value = fileContent;
    }
  }
}

function onTabChange(tabInfo) {
  const { newCurrTab, newtabArr } = tabInfo;
  tabArr.value = newtabArr;
  currTab.value = newCurrTab;
}
</script>

<template>
  <v-app
    class="app"
    @drop.prevent="onDrop"
    @dragenter.prevent
    @dragover.prevent
  >
    <tab @tabChange="onTabChange" :tab-arr="tabArr"></tab>
    <template v-for="item in tabArr">
      <json-viewer
        v-model:value="item.content"
        v-if="currTab === item.id"
        :key="item.id"
      ></json-viewer>
    </template>
  </v-app>
</template>
<style>
#app,
html,
body,
.app {
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

.v-list::-webkit-scrollbar {
  display: none;
}

pre {
  font-family: "Roboto", sans-serif !important;
}
</style>

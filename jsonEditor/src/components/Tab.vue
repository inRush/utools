<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  tabArr: any[];
  currTab: any;
}>();
const emit = defineEmits<{
  (e: "tabChange", value: object): void;
}>();

function addTab() {
  let newTab = {
    id: new Date().getTime(),
    label: "Tab-" + new Date().getTime(),
    content: ""
  }
  props.tabArr.push(newTab);
  emit("tabChange", {
    newtabArr: props.tabArr,
    newCurrTab: newTab.id
  });
}

function changeTab(el, id) {
  emit("tabChange", {
    newtabArr: props.tabArr,
    newCurrTab: id,
  });
}
function deleteTab(id) {
  if(props.tabArr.length < 2) return

  let currIdx: number = 0;
  for (let i = 0; i < props.tabArr.length; i++) {
    const el = props.tabArr[i];
    if (el.id === id) {
      currIdx = i ? i-1 : 0;
      props.tabArr.splice(i, 1);
      break;
    }
  }
  emit("tabChange", {
    newtabArr: props.tabArr,
    newCurrTab: props.tabArr[currIdx].id
  });
}
</script>
<template>
  <div class="tab-bar">
    <div class="tabs">
      <span v-for="item in tabArr" :key="item.id">
        <span @click="changeTab($event, item.id)">{{ item.label }}</span>
        <span @click="deleteTab(item.id)">关闭</span>
      </span>
    </div>
    <div class="add-btn" @click="addTab">+</div>
  </div>
</template>
<style>
.tab-bar {
  display: flex;
  align-items: center;
  padding: 0 10px;
}
.tabs span {
  margin-right: 10px;
  cursor: pointer;
}
</style>


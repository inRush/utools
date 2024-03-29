<template>
  <mask-viewer :show="props.show" @click="$emit('update:show', false)"/>
  <transition>
    <div v-show="props.show" class="history-panel">
      <v-row class="search-wrapper" align="center">
        <v-col cols="12" sm="2" class="search-label text-center">历史记录</v-col>
        <v-col cols="12" sm="9" class="search-input-wrapper ">
          <input type="text" placeholder="搜索" class="search-input" v-model="searchInput">
        </v-col>
        <v-col class="text-center">
        </v-col>
      </v-row>
      <v-list class="history-list">
        <v-divider></v-divider>
        <template v-for="(item,index) in histories" :key="item">
          <v-list-item :value="index" @click="onItemClick(item)">
            <v-row align="center" style="width: 100vw;overflow: hidden">
              <v-col class="text-center" cols="12" sm="2">{{ $filters.timeStepFormat(item.time) }}</v-col>
              <v-col cols="12" sm="10">
                <pre v-overflow="historyCfg" :data-index="index" class="history-list-item-text"
                     style="flex: 0 1">{{ item.text.substring(0, 350) }}</pre>
              </v-col>
            </v-row>
          </v-list-item>
          <v-divider></v-divider>
        </template>
      </v-list>
    </div>
  </transition>
  <detail-viewer v-model:show="detailShow" :detail="detailText"></detail-viewer>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import MaskViewer from '@/components/MaskViewer.vue'
import DetailViewer from './DetailViewer.vue'
import { History } from '@/model'
import Db from '@/tools/db'
import { isNumber, toNumber } from "lodash";

let props = withDefaults(defineProps<{
  show: boolean
}>(), {show: false})
// data
let detailShow = ref(false), detailText = ref('');
let searchInput = ref('');
let histories = computed(() => {
  if (!searchInput.value || searchInput.value === '') {
    return Db.get()?.histories.value;
  }
  let filterItems = [];
  for (let history of Db.get()?.histories.value || []) {
    if (history.text.indexOf(searchInput.value) >= 0) {
      filterItems.push(history);
    }
  }
  return filterItems;
});

let historyCfg = {
  text: '查看详情',
  maxLine: 3,
  onClick: (el: HTMLElement) => {
    let index = toNumber(el.getAttribute("data-index"));
    if (isNumber(index)) {
      detailText.value = histories.value[index].text;
      detailShow.value = true;
    }
  }
}
// emit
const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'itemClick', value: History): void
}>();


function onItemClick(item: History) {
  emit('itemClick', item);
  emit('update:show', false);
}

</script>

<style lang="scss" scoped>
$panelHeight: 70vh;
$searchWrapperHeight: '84px';


.history-panel {
  background-color: #212121;
  height: $panelHeight;
  width: 100%;
  position: absolute;
  bottom: 0;
  transform: translate3d(0, 0, 0);

  &.v-enter-active, &.v-leave-active {
    transition: transform .3s;
  }

  &.v-enter-from, &.v-leave-to {
    transform: translate3d(0, $panelHeight, 0) !important;
  }

}

.history-list {
  padding: 0;
  overflow-y: scroll;
  height: calc(#{$panelHeight} - #{$searchWrapperHeight});
}

.history-list-item-text {
  overflow: hidden;
  word-break: break-all;
  word-wrap: break-word;
  white-space: break-spaces;
}

.history-list::-webkit-scrollbar {
  display: none;
}

.search-wrapper {
  padding: 10px;
  height: $searchWrapperHeight;

  .search-label {
    font-size: 16px;
  }

  .search-input-wrapper {
    .search-input {
      background-color: #505050;
      height: 2.5rem;
      width: 50vw;
      border-radius: 4px;
      padding: 4px 6px;
      color: #eee;

      &:focus {
        outline: none;
      }
    }
  }
}


</style>

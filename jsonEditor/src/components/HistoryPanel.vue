<template>
  <mask-viewer :show="props.show" @click="$emit('update:show', false)"/>
  <transition>
    <div class="history-panel" v-show="props.show">
      <v-row class="search-wrapper" align="center">
        <v-col cols="12" sm="2" class="search-label text-center">历史记录</v-col>
        <v-col cols="12" sm="9" class="search-input-wrapper ">
          <input type="text" placeholder="搜索" class="search-input" v-model="searchInput">
        </v-col>
        <v-col class="text-center">
          <v-icon icon="mdi-close" @click="$emit('update:show',false)"></v-icon>
        </v-col>
      </v-row>
      <v-list class="history-list">
        <v-divider></v-divider>
        <template v-for="(item,index) in histories" :key="index">
          <v-list-item :value="index" @click="onItemClick(item)">
            <v-row align="center">
              <v-col cols="12" sm="2" class="text-center">{{ $filters.timeStepFormat(item.time) }}</v-col>
              <v-col cols="12" sm="10">
                <pre class="history-list-item-text" v-overflow="historyCfg">{{ item.text }}</pre>
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
import { computed, reactive, ref, toRefs, watch } from "vue";
import MaskViewer from '@/components/MaskViewer.vue'
import DetailViewer from './DetailViewer.vue'
import { History } from '@/model'
import Filter from "@/filter";

let props = withDefaults(defineProps<{
  show: boolean,
  items: History[]
}>(), {show: false})
// data
let detailShow = ref(false), detailText = ref('');
let searchInput = ref('');
let histories = computed(()=>{
  if (!searchInput.value || searchInput.value === '') {
    return props.items;
  }
  let filterItems = [];
  for (let history of props.items) {
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
    detailText.value = el.innerText;
    detailShow.value = true;
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

  &.v-enter-active, &.v-leave-active {
    transition: bottom .3s;
  }

  &.v-enter-from, &.v-leave-to {
    bottom: -$panelHeight !important;
  }

}

.history-list {
  padding: 0;
  overflow-y: scroll;
  height: calc(#{$panelHeight} - #{$searchWrapperHeight});
}

.history-list-item-text {
  overflow: hidden;
  text-overflow: ellipsis;
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

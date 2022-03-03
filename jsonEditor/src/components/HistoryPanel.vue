<template>
  <mask-viewer :show="props.show" @click="$emit('update:show', false)"/>
  <transition>
    <div class="history-panel" v-show="props.show">
      <v-row class="search-wrapper" align="center">
        <v-col cols="12" sm="2" class="search-label text-center">历史记录</v-col>
        <v-col cols="12" sm="9" class="search-input-wrapper ">
          <input type="text" placeholder="搜索" class="search-input">
        </v-col>
        <v-col class="text-center">
          <v-icon icon="mdi-close" @click="$emit('update:show',false)"></v-icon>
        </v-col>
      </v-row>
      <v-list class="history-list">
        <v-divider></v-divider>
        <template v-for="(item,index) in items" :key="index">
          <v-list-item :value="index">
            <v-row align="center">
              <v-col cols="12" sm="2" class="text-center">{{ item.time }}</v-col>
              <v-col cols="12" sm="10">
                <div class="history-list-item-text" v-overflow="historyCfg">
                  {{ item.text }}
                </div>
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
import { reactive, ref } from "vue";
import MaskViewer from '@/components/MaskViewer.vue'
import DetailViewer from './DetailViewer.vue'

let props = withDefaults(defineProps<{
  show: boolean
}>(), {show: false})
// data
let detailShow = ref(false), detailText = ref('');
let items = reactive([
  {
    'time': '刚刚',
    'text': '<script setup lang="ts">' +
        '<v-list-item value="1" >\n' +
        '    <v-row align="center">\n' +
        '      <v-col cols="12" sm="2" class="text-center">12分钟前</v-col>\n' +
        '      <v-col cols="12" sm="9" >{{text}}</v-col>\n' +
        '      <v-col cols="12" sm="1" class="text-center">1</v-col>\n' +
        '    </v-row>\n' +
        '  </v-list-item><v-list-item value="1">\n' +
        '    <v-row align="center">\n' +
        '      <v-col cols="12" sm="2" class="text-center">12分钟前</v-col>\n' +
        '      <v-col cols="12" sm="9" >{{text}}</v-col>\n' +
        '      <v-col cols="12" sm="1" class="text-center">1</v-col>\n' +
        '    </v-row>\n' +
        '  </v-list-item>'
  },
  {
    'time': '1分钟前',
    'text': '123'
  }
])
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
}>();

function onMaskClick() {
  emit('update:show', false);
}

</script>

<style lang="scss" scoped>


.history-panel {
  background-color: #212121;
  height: 70vh;
  position: absolute;
  bottom: 0;

  &.v-enter-active, &.v-leave-active {
    transition: bottom .3s;
  }

  &.v-enter-from, &.v-leave-to {
    bottom: -70vh !important;
  }

  //line-height: 200px;
}

.history-list {
  padding: 0;
}

.history-list-item-text {
  overflow: hidden;
  text-overflow: ellipsis
}

.history-list::-webkit-scrollbar {
  display: none;
}

.search-wrapper {
  padding: 10px;

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

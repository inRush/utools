<script setup lang="ts">
import MaskViewer from './MaskViewer.vue'

const props = defineProps<{
  detail: string,
  show: boolean
}>()
</script>


<template>
  <mask-viewer :show="props.show" @click="$emit('update:show',false)"/>
  <transition>
    <pre contenteditable="true" class="detail-viewer" v-show="props.show">{{ props.detail }}</pre>
  </transition>
</template>

<style lang="scss">
.detail-viewer {
  width: 50vw;
  height: 100%;
  z-index: 100;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: #2b2c2d;
  padding: 10px;
  elevation: above;
  overflow-y: scroll;
  word-break: break-all;
  word-wrap: break-word;
  white-space: break-spaces;
  transform: translate3d(0, 0, 0);

  &.v-enter-active, &.v-leave-active {
    transition: transform .3s;
  }

  &.v-enter-from, &.v-leave-to {
    transform: translate3d(50vw, 0, 0) !important;
  }

  &::-webkit-scrollbar {
    display: none;
  }

  &:focus {
    outline: none;
  }

}
</style>

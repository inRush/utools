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
    <div class="detail-viewer" v-show="props.show">{{ props.detail }}</div>
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
  padding: 20px;
  elevation: above;

  &.v-enter-active, &.v-leave-active {
    transition: right .3s;
  }

  &.v-enter-from, &.v-leave-to {
    right: -50vw !important;
  }
}
</style>

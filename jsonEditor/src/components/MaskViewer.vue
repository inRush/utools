<script setup lang="ts">
const props = withDefaults(defineProps<{
  show: boolean,
}>(), {});

const emit = defineEmits<{
  (e: 'click'): void
}>();

function onMaskClick() {
  emit('click')
}
</script>

<template>
  <transition>
    <div class="mask-viewer" v-show="props.show" @click="onMaskClick"></div>
  </transition>
</template>

<style lang="scss">

.mask-viewer {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #00000088;
  opacity: 1;

  &.v-enter-active, &.v-leave-active {
    transition: opacity .3s;
  }

  &.v-enter-from, &.v-leave-to {
    opacity: 0;
  }
}
</style>

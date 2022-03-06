<script setup lang="ts">
import JsonPath from 'jsonpath';
import { computed, ref } from "vue";
// props
const props = defineProps<{
  json: any
}>();

// data
const pathExpression = ref("");

const jsonPathValue = computed(() => {
  try {
    if (!pathExpression.value || pathExpression.value === '') {
      return '请输入Json-Path';
    }
    const values = JsonPath.query(props.json, pathExpression.value);
    try {
      return JSON.stringify(values, null, 4);
    } catch (e) {
      return values;
    }
  } catch (e: any) {
    return e.toString()
  }
})

</script>

<template>
  <div class="json-path-editor-wrapper">
    <input type="text" class="json-path-input" v-model="pathExpression">
    <pre class="json-path-editor" contenteditable="true">{{ jsonPathValue }}</pre>
  </div>
</template>


<style scoped lang="scss">

.json-path-editor-wrapper {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;

  .json-path-input {
    width: 100%;
    height: 40px;
    background-color: #505050;
    padding: 0 0.5rem;
    color: #fff;

    &:focus {
      outline: none;
    }
  }

  .json-path-editor {
    flex: 1;
    width: 100%;

    &:focus {
      outline: none;
    }
  }
}
</style>

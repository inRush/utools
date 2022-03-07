<script setup lang="ts">
import JsonPath from 'jsonpath';
import MonacoEditor, { MonacoType, EditorType } from './MonacoEditor.vue';
import { computed, onMounted, ref } from "vue";
// props
const props = defineProps<{
  json: any
}>();
// data
const pathExpression = ref("");
const editorOption = {
  lineNumbers: 'off',
  glyphMargin: false,
  folding: false,
  lineDecorationsWidth: 0,
  lineNumbersMinChars: 0,
  readOnly: true,
  contextmenu: false
}
const jsonPathValue = computed(() => {
  try {
    if (typeof props.json === 'string') {
      return props.json;
    }
    const values = JsonPath.query(props.json, "$" + pathExpression.value);
    try {
      return JSON.stringify(values, null, 4);
    } catch (e) {
      return values.toString();
    }
  } catch (e: any) {
    return e.toString()
  }
})

// method
function onEditorMounted(editor: EditorType, monaco: MonacoType) {
}

</script>

<template>
  <div class="json-path-editor-wrapper">
    <monaco-editor ref="editorRef"
                   :value="jsonPathValue" class="json-path-editor" language="json"
                   :editor-mounted="onEditorMounted" :option="editorOption"/>
    <div class="json-path-input-wrapper">
      <span class="json-path-start">$</span><input type="text" class="json-path-input" v-model="pathExpression" placeholder="请输入Json Path表达式">
    </div>
  </div>
</template>


<style scoped lang="scss">

.json-path-editor-wrapper {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;

  .json-path-input-wrapper {
    width: 100%;
    height: 40px;
    display: flex;

    .json-path-start {
      width: 40px;
      line-height: 40px;
      text-align: center;
      background-color: #303133;
      font-size: 18px;
      font-weight: bold;
    }

    .json-path-input {
      flex: 1;
      background-color: #505050;
      padding: 0 0.5rem;
      color: #fff;

      &:focus {
        outline: none;
      }
    }

  }

  .json-path-editor {
    flex: 1;
    width: 100%;
  }
}
</style>

<script setup lang="ts">
import * as monaco from 'monaco-editor';
import { onDeactivated, onMounted, ref, Ref, watch } from "vue";
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import TypeScriptWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';

if (!(self as any).MonacoEnvironment) {
  (self as any).MonacoEnvironment = {
    getWorker(workerId: Number, label: string) {
      if (label === 'json') {
        return new JsonWorker();
      }
      if (label === 'javascript' || label === 'typescript') {
        return new TypeScriptWorker();
      }
      if (label === 'html') {
        return new HtmlWorker();
      }
      if (label === 'css') {
        return new CssWorker();
      }
      return new EditorWorker();
    },
  };
}

// props
const props = withDefaults(defineProps<{
  value: string,
  language?: 'javascript' | 'typescript' | 'json' | 'html' | 'css',
  option?: monaco.editor.IStandaloneEditorConstructionOptions
}>(), {});
//data
let editor: monaco.editor.IStandaloneCodeEditor;
//refs
const editorContainer: Ref<HTMLElement | null> = ref(null);
// emit
const emit = defineEmits<{
  (e: 'update:value', value: string | undefined): void
}>();
// watch
watch(() => props.value, (newValue) => {
  editor?.executeEdits('', [{
    // @ts-ignore
    range: editor?.getModel()?.getFullModelRange(),
    text: newValue
  }]);
})
// life cycle
onMounted(() => {
  if (editorContainer.value) {
    editor = monaco.editor.create(editorContainer.value, Object.assign({
      value: props.value,
      language: props.language,
      tabSize: 4,
      automaticLayout: true,
      scrollBeyondLastLine: false,
      minimap: {enabled: false},
      theme: 'vs-dark',
      lineDecorationsWidth: 0
    }, props.option));
    editor?.onDidChangeModelContent(() => {
      emit('update:value', editor?.getValue())
    })
  }
})

onDeactivated(() => {
  editor?.dispose();
})
defineExpose({
  getEditor(): monaco.editor.IStandaloneCodeEditor {
    return editor;
  }
})
</script>

<template>
  <div class="editor-container" ref="editorContainer"></div>
</template>


<style scoped>
.editor-container {
  width: 100%;
  height: 100%;
}
</style>

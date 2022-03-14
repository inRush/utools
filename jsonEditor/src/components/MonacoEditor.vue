<script lang="ts">
import * as monaco from 'monaco-editor';
import { defineComponent, onDeactivated, onMounted, PropType, ref, watch } from "vue";
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';

if (!(self as any).MonacoEnvironment) {
  (self as any).MonacoEnvironment = {
    getWorker(workerId: Number, label: string) {
      return new JsonWorker();
    },
  };
}
export * from 'monaco-editor';
export type MonacoType = typeof monaco;
export type EditorType = monaco.editor.IStandaloneCodeEditor;
export default defineComponent({
  props: {
    value: String,
    language: {
      type: String,
      validator: (language: string) => ['javascript', 'typescript', 'json', 'html', 'css', 'java'].indexOf(language) >= 0
    },
    option: {
      type: Object as PropType<monaco.editor.IStandaloneEditorConstructionOptions>
    },
    editorMounted: {
      type: Function as PropType<(editor: EditorType, monaco: MonacoType) => void>
    },
  },
  setup(props, context) {
    let editor: monaco.editor.IStandaloneCodeEditor | undefined = undefined;
    const editorContainer = ref<HTMLElement | null>(null);
    watch(() => props.value, (newValue) => {
      if (newValue === editor?.getValue()) {
        return;
      }
      if (props.option?.readOnly) {
        editor?.setValue(newValue || "");
      } else {
        editor?.executeEdits('', [{
          // @ts-ignore
          range: editor?.getModel()?.getFullModelRange(),
          text: newValue || ""
        }]);
      }
    })
    onMounted(async () => {
      if (editorContainer.value) {
        editor = monaco.editor.create(editorContainer.value, Object.assign({
          validate: false,
          value: props.value,
          language: props.language,
          tabSize: 4,
          automaticLayout: true,
          scrollBeyondLastLine: false,
          minimap: {enabled: false},
          theme: 'vs-dark',
          lineDecorationsWidth: 0,
        }, props.option));
        editor?.onDidChangeModelContent(() => {
          context.emit('update:value', editor?.getValue())
        })
        props.editorMounted && props.editorMounted(editor, monaco);
      }
    })
    onDeactivated(() => {
      editor?.dispose();
    })
    return {
      editor, editorContainer
    }
  },
  expose: ['editor']
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

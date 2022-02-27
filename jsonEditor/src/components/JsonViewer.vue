<script setup lang="ts">
import { onMounted, Ref, ref } from "vue";
import * as Json from '../tools/json';
import * as monaco from 'monaco-editor';

import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';

(self as any).MonacoEnvironment = {
  getWorker(workerId: Number, label: string) {
    if (label === 'json') {
      return new JsonWorker();
    }
    return new EditorWorker();
  },
};


interface Props {
  value: string
}

const props = withDefaults(defineProps<Props>(), {});
// data
let editor: monaco.editor.IStandaloneCodeEditor | null = null;
// refs
const container: Ref<HTMLElement | null> = ref(null);
// emits
const emit = defineEmits<{
  (e: 'input', value: string | undefined): void
}>()

// method
function format() {
  editor?.getAction("editor.action.formatDocument").run();
}

function escape() {
  compress()
  let escapeCode = Json.escape(editor?.getValue());
  escapeCode && editor?.setValue(escapeCode)
}

function clearEscape() {
  let clearEscapeCode = Json.clearEscape(editor?.getValue());
  clearEscapeCode && editor?.setValue(Json.beautify(clearEscapeCode) || clearEscapeCode);
}

function compress() {
  let compressCode = Json.compress(editor?.getValue());
  compressCode && editor?.setValue(compressCode)
}

monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
  validate: false,
  allowComments: true
});


// life cycle
onMounted(() => {
  if (container.value) {
    let jsonModel = monaco.editor.getModel(monaco.Uri.parse('json://grid/settings.json'));
    if (!jsonModel) {
      jsonModel = monaco.editor.createModel(Json.beautify(props.value) || props.value, 'json', monaco.Uri.parse('json://grid/settings.json'))
    }
    editor = monaco.editor.create(container.value, {
      model: jsonModel,
      tabSize: 2,
      automaticLayout: true,
      scrollBeyondLastLine: false,
      minimap: {enabled: false},
      theme: 'vs-dark',
    });
    editor.onDidPaste(() => {
      format()
    })
  }
})
</script>

<template>
  <div class="json-editor">
    <div class="editor-wrapper">
      <div ref="container" class="code-editor"></div>
    </div>
    <div class="tools">
      <span class="tool-item" @click="format">格式化</span>
      <span class="tool-item" @click="compress">压缩</span>
      <span class="tool-item" @click="escape">转义</span>
      <span class="tool-item" @click="clearEscape">去转义</span>
    </div>
  </div>
</template>

<style lang="scss">
.CodeMirror {
  height: 100%;

  pre.CodeMirror-placeholder {
    color: #999;
  }
}

.json-editor {
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  overflow: hidden;

  .editor-wrapper {
    flex: 1;

    .code-editor {
      height: 100%;
    }
  }

  .tools {
    padding: 0;
    height: 30px;
    width: 100%;

    .tool-item {
      display: inline-block;
      cursor: pointer;
      height: 30px;
      line-height: 30px;
      padding: 0 0.5rem;
      border: #333 1px solid;
    }
  }
}

</style>


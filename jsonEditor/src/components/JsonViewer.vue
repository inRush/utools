<script setup lang="ts">
import { nextTick, onDeactivated, onMounted, reactive, Ref, ref, watch } from "vue";
import * as Json from '../tools/json';
import * as monaco from 'monaco-editor';
import HistoryPanel from './HistoryPanel.vue'

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
let editor: monaco.editor.IStandaloneCodeEditor;
let openMultipleCursorDialog = ref(false), openHistoryPanel = ref(false);
let multipleCursorPoints = reactive({start: undefined, end: undefined});
// refs
const container: Ref<HTMLElement | null> = ref(null);
// watch
watch(() => props.value, () => {
  editor?.setValue(Json.beautify(props.value) || props.value);
})

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

function convertBase64() {
  let jsonValue = editor?.getValue();
  if (!jsonValue) {
    return;
  }
  try {
    let json = JSON.parse(jsonValue);
    loopConvertBase64(json);
    editor?.executeEdits('', [{
      // @ts-ignore
      range: editor?.getModel()?.getFullModelRange(),
      text: JSON.stringify(json, null, 4)
    }])

  } catch (e) {
  }
}

function isBase64(str: string) {
  if (str === '' || str.trim() === '') {
    return false;
  }
  try {
    return btoa(atob(str)) == str;
  } catch (err) {
    return false;
  }
}

function b64_to_utf8(str: string) {
  return decodeURIComponent(window.escape(window.atob(str)));
}

function loopConvertBase64(json: any) {
  if (typeof json === 'string') {
    return;
  }
  for (let key in json) {
    if (!json.hasOwnProperty(key)) {
      continue;
    }
    if (typeof json[key] === 'object') {
      if (json[key].length) {

      } else {
        loopConvertBase64(json[key]);
      }
    } else if (typeof json[key] === 'string' && isBase64(json[key])) {
      try {
        let decodeStr = b64_to_utf8(json[key]);
        json[key] = JSON.parse(decodeStr);
        loopConvertBase64(json[key]);
      } catch (e) {
      }
    }
  }
}

function multipleCursors(points: { start: number, end: number }) {
  if (points) {
    openMultipleCursorDialog.value = false;
    if (points.end <= points.start) {
      return;
    }
    if (points.start < 1) {
      points.start = 1;
    }
    let lineCount = editor.getModel()?.getLineCount() || 0;
    if (points.end > lineCount) {
      points.end = lineCount;
    }
    if (points.start > points.end) {
      points.start = points.end;
    }
    let selections: monaco.ISelection[] = [];
    for (let i = points.start; i <= points.end; i++) {
      let lineContent = editor.getModel()?.getLineContent(i) || "";
      const endOfLineColNumber = lineContent.length + 1;
      selections.push(new monaco.Selection(i, endOfLineColNumber, i, endOfLineColNumber));
    }
    editor.setSelections(selections)
    nextTick(() => {
      editor?.focus();
    });
    return;
  }
  let selections = editor.getSelections();
  if (selections) {
    if (selections.length > 1) {
      editor.setSelections([selections[0]])
      openMultipleCursorDialog.value = true;
      return;
    }
    let selection = selections[0];
    if (selection.startLineNumber != selection.endLineNumber) {
      editor?.getAction("editor.action.insertCursorAtEndOfEachLineSelected").run();
      editor?.focus()
    } else {
      openMultipleCursorDialog.value = true;
    }
  }
}

monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
  validate: true,
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
      tabSize: 4,
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
onDeactivated(() => {
  editor?.dispose();
})
</script>

<template>
  <div style="height: 100vh" class="d-flex flex-column ">
    <div class="editor-wrapper">
      <div ref="container" class="code-editor"></div>
    </div>
    <div class="tools-list">
      <v-btn color="blue" variant="text" @click="format">格式化</v-btn>
      <v-btn color="blue" variant="text" @click="compress">压缩</v-btn>
      <v-btn color="blue" variant="text" @click="escape">转义</v-btn>
      <v-btn color="blue" variant="text" @click="clearEscape">去转义</v-btn>
      <v-btn color="blue" variant="text" @click="convertBase64">去base64</v-btn>
      <v-btn color="blue" variant="text" @click="multipleCursors(null)">多光标</v-btn>
    </div>
    <div class="tools-point">
      <v-btn class="mx-2" icon="mdi-history" color="cyan" size="x-small" @click="openHistoryPanel=true">
      </v-btn>
    </div>
    <history-panel v-model:show="openHistoryPanel"/>
    <v-dialog v-model="openMultipleCursorDialog" persistent>
      <v-card>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field :autofocus="true" class="input" v-model:model-value="multipleCursorPoints.start"
                              label="起始行" required type="number"
                              hide-details></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field class="input" v-model:model-value="multipleCursorPoints.end" label="结束行" required
                              type="number"
                              hide-details></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue" variant="text" @click="openMultipleCursorDialog = false">
            关闭
          </v-btn>
          <v-btn color="blue" variant="text" @click="multipleCursors(multipleCursorPoints)">
            确认
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped>
$tools-list-height: 36px;
$tools-point-bottom: 10px;
$tools-point-right: 10px;
$history-list-height: 300px;
$history-list-header-height: 48px;

.editor-wrapper {
  height: 100%;
  width: 100%;
  padding-bottom: $tools-list-height;

  .code-editor {
    height: 100%;
    width: 100%;
  }
}

.tools-list {
  height: $tools-list-height;
  position: absolute;
  bottom: 0;
}

.tools-point {
  position: absolute;
  right: $tools-point-right;
  bottom: calc(#{$tools-list-height} + #{$tools-point-right});
}


.history-list-item-wrapper {
  overflow-y: scroll !important;
  height: calc(#{$history-list-height} - #{$history-list-header-height} - 9px);

  &::-webkit-scrollbar {
    display: none;
  }
}


</style>


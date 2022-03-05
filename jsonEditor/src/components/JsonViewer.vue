<script setup lang="ts">
import { nextTick, onDeactivated, onMounted, reactive, Ref, ref, watch } from "vue";
import * as Json from '../tools/json';
import * as monaco from 'monaco-editor';
import Base64 from "@/tools/base64";
import HistoryPanel from './HistoryPanel.vue'
import Db from '@/tools/db'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import { History } from "@/model";

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
let canFormat = true;
// refs
const container: Ref<HTMLElement | null> = ref(null);

// watch
watch(() => props.value, (newValue) => {
  if (newValue === editor.getValue()) {
    return;
  }
  editor?.executeEdits('', [{
    // @ts-ignore
    range: editor?.getModel()?.getFullModelRange(),
    text: canFormat ? Json.beautify(newValue) || newValue : newValue
  }]);
  canFormat = true;
})

// emit
const emit = defineEmits<{
  (e: 'update:value', value: string | undefined): void
}>();

// method
function updateValue(value: string | undefined) {
  emit('update:value', value);
}

function format() {
  editor?.getAction("editor.action.formatDocument").run();
}

/**
 * 转义
 */
function escape() {
  updateValue(Json.escape(Json.compress(editor?.getValue())))
  canFormat = false;
}

/**
 * 去转义
 */
function clearEscape() {
  updateValue(Json.clearEscape(editor?.getValue()))
}

/**
 * 压缩
 */
function compress() {
  updateValue(Json.compress(editor?.getValue()))
  canFormat = false;
}

/**
 * 转换base64
 */
function convertBase64() {
  let jsonValue = editor?.getValue();
  if (!jsonValue) {
    return;
  }
  try {
    const json = JSON.parse(jsonValue);
    Base64.convertBase64Obj(json);
    updateValue(JSON.stringify(json, null, 4))
  } catch (e) {
    if (Base64.isBase64(jsonValue)) {
      updateValue(Base64.convertBase64Str(jsonValue))
    }
  }
}

/**
 * 多光标
 * @param points
 */
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


function onHistorySelect(history: History) {
  updateValue(history.text)
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
    editor.onDidPaste((e) => {
      let value = editor.getValue();
      Db.get().addHistory(value);
      updateValue(value);
    });
    editor.onDidChangeModelContent((e) => {
      updateValue(editor.getValue());
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
      <v-btn color="blue" size="small" variant="text" @click="openHistoryPanel=true">历史</v-btn>
      <v-btn color="blue" size="small" variant="text" @click="compress">压缩</v-btn>
      <v-btn color="blue" size="small" variant="text" @click="escape">转义</v-btn>
      <v-btn color="blue" size="small" variant="text" @click="clearEscape">去转义</v-btn>
      <v-btn color="blue" size="small" variant="text" @click="convertBase64">去base64</v-btn>
      <v-btn color="blue" size="small" variant="text" @click="multipleCursors(null)">多光标</v-btn>
    </div>
    <history-panel v-model:show="openHistoryPanel" @itemClick="onHistorySelect"/>
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
$tools-list-height: 28px;
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


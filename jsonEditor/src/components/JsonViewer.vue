<script setup lang="ts">
import { computed, nextTick, reactive, ref } from "vue";
import * as Json from '../tools/json';
import Base64 from "@/tools/base64";
import Db from '@/tools/db';
import HistoryPanel from './HistoryPanel.vue'
import MonacoEditor from './MonacoEditor.vue';
import { History } from "@/model";
import { EditorType, ISelection, MonacoType, Selection } from "@/components/MonacoEditor.vue";
import JsonPathViewer from './JsonPathViewer.vue';
import xmlToJson from '@/tools/xml/xmlToJson'
import xmlToJsonConvertor from "@/tools/xml/xmlToJsonConvertor";
import ExposeViewer from './ExposeViewer.vue';

const exposeViewerEditorConfig = {
  lineNumbers: 'off',
  glyphMargin: false,
  folding: false,
  lineDecorationsWidth: 0,
  lineNumbersMinChars: 0,
  contextmenu: false
}
const props = withDefaults(defineProps<{
  value: string
}>(), {});
// data
let openMultipleCursorDialog = ref(false), openHistoryPanel = ref(false);
let multipleCursorPoints = reactive({start: undefined, end: undefined});
let monacoEditor: EditorType;
let openJsonPathViewer = ref(false);
const detailViewerShow = ref(false);
const jsonPathObj = computed(() => {
  if (!openJsonPathViewer.value) {
    return {};
  }
  try {
    return JSON.parse(props.value);
  } catch (e) {
    return 'json格式错误';
  }
});
const jsonExposeObj = computed(() => {
  if (!detailViewerShow.value) {
    return '{}';
  }
  return props.value;
});
// emit
const emit = defineEmits<{
  (e: 'update:value', value: string | undefined): void
}>();

// method
function getEditor() {
  return monacoEditor;
}

function updateValue(value: string | undefined) {
  emit('update:value', value);
}

function format() {
  nextTick(() => {
    getEditor()?.getAction("editor.action.formatDocument").run();
  })
}

/**
 * 转义
 */
function escape() {
  updateValue(Json.escape(Json.compress(getEditor()?.getValue())))
}

/**
 * 去转义
 */
function clearEscape() {
  updateValue(Json.beautify(Json.clearEscape(getEditor()?.getValue())));
}

/**
 * 压缩
 */
function compress() {
  updateValue(Json.compress(getEditor()?.getValue()))
}

/**
 * 转换base64
 */
function convertBase64() {
  let jsonValue = getEditor()?.getValue();
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
  const editor = getEditor();
  if (points) {
    openMultipleCursorDialog.value = false;
    if (points.end <= points.start) {
      return;
    }
    if (points.start < 1) {
      points.start = 1;
    }
    let lineCount = editor?.getModel()?.getLineCount() || 0;
    if (points.end > lineCount) {
      points.end = lineCount;
    }
    if (points.start > points.end) {
      points.start = points.end;
    }
    let selections: ISelection[] = [];
    for (let i = points.start; i <= points.end; i++) {
      let lineContent = editor?.getModel()?.getLineContent(i) || "";
      const endOfLineColNumber = lineContent.length + 1;
      selections.push(new Selection(i, endOfLineColNumber, i, endOfLineColNumber));
    }
    editor?.setSelections(selections)
    nextTick(() => {
      editor?.focus();
    });
    return;
  }
  let selections = editor?.getSelections();
  if (selections) {
    if (selections.length > 1) {
      editor?.setSelections([selections[0]])
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

function jsonPathClick() {
  openJsonPathViewer.value = !openJsonPathViewer.value;
  detailViewerShow.value = false;
}

async function languageConvert() {
  detailViewerShow.value = !detailViewerShow.value;
  openJsonPathViewer.value = false;
}

function onHistorySelect(history: History) {
  updateValue(history.text)
}

function onEditorMounted(editor: EditorType, monaco: MonacoType) {
  monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    validate: false,
    allowComments: true
  });
  editor.onDidPaste(() => {
    let value = getEditor()?.getValue();
    try {
      value = JSON.stringify(xmlToJson.convertXML(value, xmlToJsonConvertor), null, 4);
    } catch (e) {
    }
    Db.get().addHistory(value);
    updateValue(value);
    format();
  });
  monacoEditor = editor;
}


</script>

<template>
  <div style="height: 100vh" class="d-flex flex-column ">
    <div class="editor-panel">
      <div class="json-editor-wrapper" :class="{'half-width':openJsonPathViewer||detailViewerShow}">
        <monaco-editor :value="props.value" ref="editorRef" @update:value="$emit('update:value',$event)"
                       :editor-mounted="onEditorMounted" language="json"/>
      </div>
      <div class="other-viewer-wrapper json-path-viewer-wrapper" v-show="openJsonPathViewer">
        <json-path-viewer :json="jsonPathObj"/>
      </div>
      <div class="other-viewer-wrapper expose-viewer-wrapper" v-show="detailViewerShow">
        <expose-viewer :json="jsonExposeObj"/>
      </div>
    </div>

    <div class="tools-list">
      <v-btn color="blue" size="small" variant="text" @click="openHistoryPanel=true">历史</v-btn>
      <v-btn color="blue" size="small" variant="text" @click="compress">压缩</v-btn>
      <v-btn color="blue" size="small" variant="text" @click="escape">转义</v-btn>
      <v-btn color="blue" size="small" variant="text" @click="clearEscape">去转义</v-btn>
      <v-btn color="blue" size="small" variant="text" @click="convertBase64">去base64</v-btn>
      <v-btn color="blue" size="small" variant="text" @click="multipleCursors(null)">多光标</v-btn>
      <v-btn color="blue" size="small" variant="text" @click="jsonPathClick">JSON-PATH
      </v-btn>
      <v-btn color="blue" size="small" variant="text" @click="languageConvert">语言转换</v-btn>
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
    <!--    <detail-viewer :detail="exposeObj" v-model:show="detailViewerShow"/>-->
  </div>
</template>

<style lang="scss" scoped>
$tools-list-height: 28px;
$tools-point-bottom: 10px;
$tools-point-right: 10px;
$history-list-height: 300px;
$history-list-header-height: 48px;
.editor-panel {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  padding-bottom: $tools-list-height;

  .json-editor-wrapper {
    height: 100%;
    flex: 1;

    &.half-width {
      width: 50%;
    }
  }

  .other-viewer-wrapper {
    height: 100%;
    width: 50%;
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


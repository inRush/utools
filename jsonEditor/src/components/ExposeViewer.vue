<script setup lang="ts">
import MonacoEditor, { EditorType, MonacoType } from './MonacoEditor.vue';
import { ref, watch } from "vue";
import { InputData, jsonInputForTargetLanguage, Options, quicktype } from "quicktype-core";
// props
const props = defineProps<{
  json: string
}>();
// data
const editorOption = {
  lineNumbers: 'off',
  glyphMargin: false,
  folding: false,
  lineDecorationsWidth: 0,
  lineNumbersMinChars: 0,
  readOnly: true,
  contextmenu: false
}
const code = ref(""), showOptions = ref(true);
const language = ref('java'), className = ref('')
let editor: EditorType

watch(() => props.json, (newValue) => {
  convert(newValue);
})

async function convert(data: string) {
  if (!data || data === '') {
    return;
  }
  // console.log(_quickType.languageNamed('Java')?.optionDefinitions);
  // _quickType.inferenceFlagsObject
  // const suppportsIntegerAndBooleanInference = ["C#", "Python"].indexOf(this.storeState.language) !== -1;
  //  (k === "inferIntegerStrings" || k === "inferBooleanStrings")
  const {lines: JavaCodes, annotations} = await _convert(
      "Java",
      "Json",
      data,
      // @ts-ignore
      {
        rendererOptions: {'just-types': 'true'}
      }
  );
  code.value = JavaCodes.join("\n");
}

// method
function onEditorMounted(e: EditorType, m: MonacoType) {
  editor = e;
  convert(props.json);
}

async function getInput(targetLanguage: string, typeName: string, jsonString: string) {
  const jsonInput = jsonInputForTargetLanguage(targetLanguage);

  // We could add multiple samples for the same desired
  // type, or many sources for other types. Here we're
  // just making one type from one piece of sample JSON.
  await jsonInput.addSource({
    name: typeName,
    samples: [jsonString],
  });

  const inputData = new InputData();
  inputData.addInput(jsonInput);
  return inputData;
}

async function _convert(targetLanguage: string, typeName: string, jsonString: string, options: Options) {
  return await quicktype(Object.assign({
    inputData: await getInput(targetLanguage, typeName, jsonString),
    lang: targetLanguage,
  }, options));
}


</script>

<template>
  <div class="expose-editor-wrapper">
    <monaco-editor ref="editorRef"
                   :value="code" class="expose-editor" :language="language"
                   :editor-mounted="onEditorMounted" :option="editorOption"/>
    <!--    <mask-viewer :show="showOptions"/>-->
    <!--    <div class="options-viewer">-->
    <!--      <v-tabs>-->
    <!--        <v-tab>语言选项</v-tab>-->
    <!--        <v-tab>其他</v-tab>-->
    <!--      </v-tabs>-->
    <!--    </div>-->
  </div>
</template>


<style scoped lang="scss">
$optionViewerWidth: 40vw;
$optionViewerHeight: 70vh;

.expose-editor-wrapper {
  height: 100%;
  width: 100%;
}

.options-viewer {
  position: absolute;
  width: $optionViewerWidth;
  height: $optionViewerHeight;
  top: calc((100vh - #{$optionViewerHeight}) / 2);
  left: calc((100vw - #{$optionViewerWidth}) / 2);
  background-color: #212121;
  border-radius: 6px;
}
</style>

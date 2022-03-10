<script setup lang="ts">
import MonacoEditor, { EditorType, MonacoType } from './MonacoEditor.vue';
import { computed, reactive, ref, watch } from "vue";
import {
  defaultInferenceFlags,
  defaultTargetLanguages,
  InputData,
  jsonInputForTargetLanguage,
  languageNamed,
  Options,
  quicktype
} from "quicktype-core";
import MaskViewer from './MaskViewer.vue'

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

const languages = defaultTargetLanguages
    .sort((a, b) => a.displayName.localeCompare(b.displayName))
    .map(language => language.displayName)
type LanguageOptionType = { [key: string]: Options }
// @ts-ignore
const languageOptions: LanguageOptionType = reactive({
  'Java': {
    lang: 'Java',
    ...defaultInferenceFlags,
    rendererOptions: {}
  }
})
const currentLanguage = ref("Java")
const currentLanguageOption = computed(() => {
  return languageOptions[currentLanguage.value];
})


const languagePrimaryOptions = computed(() => {
  languageNamed(currentLanguage.value)?.optionDefinitions.forEach(option => {
    if (!languageOptions[currentLanguage.value].rendererOptions[option.name]) {
      languageOptions[currentLanguage.value].rendererOptions[option.name] = option.defaultValue;
    }
  })
  return languageNamed(currentLanguage.value)?.optionDefinitions
      .filter(option => option.kind === 'primary')
      .sort((a, b) => {
        if (a.type === Boolean && b.type === String) {
          return 1;
        }
        if (a.type === String && b.type === Boolean) {
          return -1;
        }
        return a.name.localeCompare(b.name);
      })
})
const languageSecondaryOptions = computed(() => {
  return languageNamed(currentLanguage.value)?.optionDefinitions
      .filter(option => option.kind === 'secondary')
      .sort((a, b) => {
        if (a.type === Boolean) {
          return 1;
        }
        return a.name.localeCompare(b.name)
      })
})


</script>

<template>
  <div class="expose-editor-wrapper">
    <monaco-editor ref="editorRef"
                   :value="code" class="expose-editor" :language="language"
                   :editor-mounted="onEditorMounted" :option="editorOption"/>
    <mask-viewer :show="showOptions"/>
    <v-container class="options-viewer">
      <v-select
          v-model="currentLanguage"
          :items="languages"
          label="语言"
          hide-details
      ></v-select>
      <template v-for="(option,index) in languagePrimaryOptions" :key="index">
        <v-select v-if="option.legalValues"
                  v-model="languageOptions[currentLanguage].rendererOptions[option.name]"
                  :items="option.legalValues"
                  :label="option.description"
                  hide-details
        ></v-select>
        <v-text-field v-else-if="option.type === String"
                      v-model="languageOptions[currentLanguage].rendererOptions[option.name]"
                      :label="option.description"
                      hide-details
        ></v-text-field>
        <v-switch v-else
                  v-model="languageOptions[currentLanguage].rendererOptions[option.name]"
                  :label="option.description"
                  hide-details
        ></v-switch>
      </template>
      <v-switch
          v-model="languageOptions[currentLanguage].rendererOptions['allPropertiesOptional']"
          label="Make all properties optional"
          hide-details
      ></v-switch>
    </v-container>
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
  overflow-y: scroll;

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>

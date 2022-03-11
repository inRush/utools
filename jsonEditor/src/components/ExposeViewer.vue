<script setup lang="ts">
import MonacoEditor, { EditorType, MonacoType } from './MonacoEditor.vue';
import { computed, ref, watch } from "vue";
import {
  defaultTargetLanguages,
  InferenceFlagName,
  inferenceFlagsObject,
  InputData,
  jsonInputForTargetLanguage,
  languageNamed,
  Options,
  quicktype
} from "quicktype-core";
import MaskViewer from './MaskViewer.vue'
import Db from "@/tools/db";
import * as _ from 'lodash'
import { quicktypeMultiFile } from "quicktype-core/dist/Run";
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
const code = ref(""), showOptions = ref(false);
const language = ref('java'), className = ref('')
const currentLanguage = Db.get().currentLanguage;
let languageOptions = Db.get().languageOptions.value;
const currentLanguageOption = computed(() => {
  return languageOptions[currentLanguage.value];
})
const languages = defaultTargetLanguages
    .sort((a, b) => a.displayName.localeCompare(b.displayName))
    .map(language => language.displayName)

let editor: EditorType

const languagePrimaryOptions = computed(() => {
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
const languageFlags = computed(() => {
  const supportsIntegerAndBooleanInference = ["C#", "Python"].indexOf(currentLanguage.value) !== -1;
  let flags = [];
  let key: InferenceFlagName;
  for (key in inferenceFlagsObject) {
    if (!supportsIntegerAndBooleanInference && key === "inferIntegerStrings" || key === "inferBooleanStrings") {
      continue;
    }
    flags.push(inferenceFlagsObject[key]);
  }
  return flags;
})

watch(() => props.json, (newValue) => {
  debounceConvert(newValue);
})
watch(currentLanguage, () => {
  convert(props.json);
})
watch(languageOptions, () => {
  debounceConvert(props.json)
})

async function convert(data: string) {
  if (!data || data === '') {
    data = '{}'
  }
  try {
    const {lines: JavaCodes, annotations} = await _convert(
        currentLanguage.value,
        "Json",
        data,
        // @ts-ignore
        languageOptions[currentLanguage.value]
    );
    code.value = JavaCodes.join("\n");
  } catch (e) {
  }
}

async function getInput(targetLanguage: string, typeName: string, jsonString: string) {
  const jsonInput = jsonInputForTargetLanguage(targetLanguage);
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

async function exportFiles() {
  let data = props.json;
  if (!data || data === '') {
    data = '{}'
  }
  try {
    const fileMap = await _export(
        currentLanguage.value,
        "Json",
        data,
        // @ts-ignore
        languageOptions[currentLanguage.value]
    );
    let files: File[] = []
    fileMap.forEach(({lines}, key, map) => {
      const code = lines.join("\n");
      console.log(code)
    })
    // const path = utools.showSaveDialog({
    //   title: '保存位置',
    //   defaultPath: utools.getPath('downloads').concat("/1.java"),
    //   buttonLabel: '保存'
    // })
    // console.log(path)
  } catch (e) {
    console.log(e)
  }
}


async function _export(targetLanguage: string, typeName: string, jsonString: string, options: Options) {
  return await quicktypeMultiFile(Object.assign({
    inputData: await getInput(targetLanguage, typeName, jsonString),
    lang: targetLanguage,
  }, options));
}


const debounceConvert = _.debounce(convert, 500)

// method
function onEditorMounted(e: EditorType, m: MonacoType) {
  editor = e;
  convert(props.json);
}


</script>

<template>
  <div class="expose-editor-wrapper">
    <monaco-editor ref="editorRef"
                   :value="code" class="expose-editor" :language="language"
                   :editor-mounted="onEditorMounted" :option="editorOption"/>
    <div class="configs-viewer">
      <div class="setting">
        <v-btn color="success" icon size="small" @click="showOptions=true"></v-btn>
        <v-btn color="info" icon size="small" @click="exportFiles"></v-btn>
      </div>
    </div>
    <mask-viewer v-model:show="showOptions" @click="showOptions = false"/>
    <v-container v-show="showOptions" class="options-viewer">
      <v-select
          v-model="currentLanguage"
          :items="languages"
          label="语言"
          hide-details
      ></v-select>
      <template v-for="(option,index) in languagePrimaryOptions" :key="option">
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
                  :model-value="languageOptions[currentLanguage].rendererOptions[option.name] === 'true'"
                  @update:modelValue="languageOptions[currentLanguage].rendererOptions[option.name] = $event.toString()"
                  :label="option.description"
                  hide-details
        ></v-switch>
      </template>
      <v-switch
          v-model="languageOptions[currentLanguage]['allPropertiesOptional']"
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

.configs-viewer {
  position: absolute;
  right: 1rem;
  bottom: 2rem;

  .setting {
    display: flex;
    flex-direction: column;
  }
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

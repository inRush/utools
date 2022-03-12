<script setup lang="ts">
import MonacoEditor, { EditorType, MonacoType } from './MonacoEditor.vue';
import { computed, onMounted, ref, watch } from "vue";
import {
  defaultTargetLanguages,
  InferenceFlagName,
  inferenceFlagsObject,
  InputData,
  jsonInputForTargetLanguage,
  languageNamed,
  Options,
  quicktype,
  quicktypeMultiFile
} from "quicktype-core";
import MaskViewer from './MaskViewer.vue'
import Db from "@/tools/db";
import * as _ from 'lodash'
import { exportFile } from '@/tools/file'
import { outerHeight } from "@/tools/dom";
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
const typeName = Db.get().languageTypeName;
const optionCategoryBgRef = ref<HTMLElement>();
const optionsPanel = ref('base')
const showLoading = ref(false)
let optionCategoryHeight = 0;
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
    flags.push({
      ...inferenceFlagsObject[key],
      name: key
    });
  }
  return flags;
})
watch(() => props.json, (newValue) => {
  debounceConvert(newValue);
})
watch([languageOptions, currentLanguage, typeName], () => {
  debounceConvert(props.json)
})
watch(optionsPanel, (newPanel) => {
  const move = optionCategoryBgRef.value?.getAttribute("data-move");
  if (!move || !optionCategoryBgRef.value) {
    return;
  }
  if (newPanel === 'other') {
    optionCategoryBgRef.value.style.transform = `translate3d(0,${move},0)`;
  } else {
    optionCategoryBgRef.value.style.transform = 'translate3d(0,0,0)';
  }
})

async function convert(data: string) {
  if (!data || data === '') {
    data = '{}'
  }
  try {
    const {lines: JavaCodes, annotations} = await _convert(
        currentLanguage.value,
        typeName.value,
        data,
        // @ts-ignore
        languageOptions[currentLanguage.value]
    );
    code.value = JavaCodes.join("\n");
  } catch (e: any) {
    code.value = e.toString()
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
        typeName.value,
        data,
        // @ts-ignore
        languageOptions[currentLanguage.value]
    );
    let files: Map<string, string> = new Map<string, string>();
    fileMap.forEach(({lines}, key, map) => {
      const code = lines.join("\n");
      files.set(key, code);
    })
    showLoading.value = true;
    exportFile(typeName.value + '-' + currentLanguage.value, files).then(() => {
      setTimeout(() => {
        showLoading.value = false;
      }, 500)
    });
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

onMounted(() => {
  if (optionCategoryBgRef.value) {
    const height = outerHeight(optionCategoryBgRef.value);
    optionCategoryBgRef.value?.setAttribute('data-move', height + 'px');
  }
})
</script>

<template>
  <div class="expose-editor-wrapper">
    <monaco-editor ref="editorRef"
                   :value="code" class="expose-editor" :language="language"
                   :editor-mounted="onEditorMounted" :option="editorOption"/>
    <div class="configs-viewer">
      <div class="setting">
        <v-btn class="setting-item" color="success" icon size="small" @click="showOptions=true">设置</v-btn>
        <v-btn class="setting-item" color="info" icon size="small" @click="exportFiles">导出</v-btn>
      </div>
    </div>
    <mask-viewer v-model:show="showOptions" @click="showOptions = false"/>
    <v-container v-show="showOptions" class="options-viewer">
      <div class="option-category-wrapper">
        <span class="option-category-bg" ref="optionCategoryBgRef"></span>
        <span class="option-category" :class="{'option-category-active':optionsPanel === 'base'}"
              @click="optionsPanel = 'base'">基本</span>
        <span class="option-category" :class="{'option-category-active':optionsPanel === 'other'}"
              @click="optionsPanel = 'other'">其他</span>
      </div>
      <div class="base-options-wrapper" v-show="optionsPanel === 'base'">
        <v-text-field v-model="typeName"
                      label="类名"
                      hide-details
        ></v-text-field>
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
                    color="success"
                    hide-details
          ></v-switch>
        </template>
        <v-switch
            v-model="languageOptions[currentLanguage]['allPropertiesOptional']"
            label="Make all properties optional"
            color="success"
            hide-details
        ></v-switch>
      </div>
      <div class="other-options-wrapper" v-show="optionsPanel === 'other'">
        <template v-for="(option,index) in languageSecondaryOptions" :key="option">
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
                    color="success"
                    hide-details
          ></v-switch>
        </template>
        <v-switch v-for="flag in languageFlags" :key="flag"
                  v-model="languageOptions[currentLanguage][flag.name]"
                  :label="flag.description"
                  color="success"
                  hide-details
        ></v-switch>
      </div>
    </v-container>
    <v-overlay theme="light" v-model="showLoading">
      <v-dialog v-model="showLoading" hide-overlay>
        <v-card color="success">
          <v-card-text>
            导出中
            <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-overlay>
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

    .setting-item {
      font-size: 12px;
      margin-bottom: 10px;
      margin-right: 8px;
    }
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

  .base-options-wrapper, .other-options-wrapper {
    width: 100%;
    height: 100%;
    overflow-y: scroll;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .option-category-wrapper {
    width: 40px;
    position: absolute;
    right: -40px;
    display: flex;
    flex-direction: column;
    background-color: #212121;
    align-items: center;
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
    box-sizing: border-box;
    text-align: center;

    .option-category, .option-category-bg {
      display: inline-block;
      width: 30px;
      height: 60px;
      line-height: 20px;
      margin: 6px 4px;
      padding: 10px 4px;
      border-radius: 6px;
      z-index: 1;
      cursor: pointer;
      color: #999;
    }

    .option-category-active {
      color: #fff;
    }

    .option-category-bg {
      transition: transform .3s;
      transform: translate3d(0, 0, 0);
      position: absolute;
      background-color: #323232;
    }
  }

}
</style>

import { defaultInferenceFlags, defaultTargetLanguages, languageNamed, Options } from "quicktype-core";
import { LanguageOptionType } from "@/model/expose";

function initLanguageOptions() {
  const languageOptions = {} as LanguageOptionType;
  for (let language of languages) {
    if (!languageOptions[language]) {
      languageOptions[language] = {rendererOptions: {}} as Options;
    }
    let flag: (keyof typeof defaultInferenceFlags)
    for (flag in defaultInferenceFlags) {
      if (!languageOptions[language][flag]) {
        languageOptions[language][flag] = defaultInferenceFlags[flag];
      }
    }
    languageNamed(language)?.optionDefinitions.forEach(option => {
      if (!languageOptions[language].rendererOptions[option.name]) {
        if (option.defaultValue === true) {
          languageOptions[language].rendererOptions[option.name] = 'true';
        } else if (option.defaultValue === false) {
          languageOptions[language].rendererOptions[option.name] = 'false';
        }
        languageOptions[language].rendererOptions[option.name] = option.defaultValue;
      }
    });
    languageOptions[language]['allPropertiesOptional'] = false
  }
  return languageOptions;
}

export const languages = defaultTargetLanguages
    .sort((a, b) => a.displayName.localeCompare(b.displayName))
    .map(language => language.displayName)

export const languageOptions: LanguageOptionType = initLanguageOptions()

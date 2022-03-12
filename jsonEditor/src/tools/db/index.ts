import { History } from "@/model";
import { ref, Ref, watchEffect } from "vue";
import App from "@/tools/app";
import { LanguageOptionType } from "@/model/expose";
import { UnwrapRef } from "@vue/reactivity";
import Env from "@/tools/env";
import Utools from "@/tools/db/utools";
import Local from "@/tools/db/local";
import { languageOptions } from './quicktype'

export interface IStorage {
  /**
   * 添加值
   * @param key 键名
   * @param value 键值
   */
  setItem(key: string, value: any): void;

  /**
   * 获取值
   * @param key 键名
   * @return 键值
   */
  getItem(key: string): any;

  /**
   * 移除键值对
   * @param key
   */
  removeItem(key: string): any;
}

let storage: IStorage;
if (Env.isUtools()) {
  storage = new Utools();
} else {
  storage = new Local();
}

function initAndWatch(key: string, variable: Ref) {
  let storageValue = storage.getItem(key);
  if (storageValue) {
    if (variable.value && typeof variable.value === 'object') {
      if (variable.value.length && storageValue.length) {
        [].push.apply(variable.value, storageValue);
      } else {
        variable.value = Object.assign(variable.value, storageValue);
      }
    } else {
      variable.value = storageValue;
    }
  }
  watchEffect(() => {
    storage.setItem(key, variable.value)
  });
}

export class Db {
  private readonly _histories: Ref<UnwrapRef<History[]>> = ref([]);
  private readonly _languageOptions: Ref<UnwrapRef<LanguageOptionType>> = ref(languageOptions);
  private readonly _currentLanguage: Ref<string> = ref('Java');
  private readonly _languageTypeName: Ref<string> = ref('Welcome');

  constructor() {
    App.init().value ? this._init() : App.ready().then(() => {
      this._init()
    });
  }

  get languageOptions() {
    return this._languageOptions;
  }

  get histories() {
    return this._histories;
  }

  get currentLanguage() {
    return this._currentLanguage;
  }

  get languageTypeName() {
    return this._languageTypeName;
  }

  _init() {
    for (let key in this) {
      console.log(key)
      if (this.hasOwnProperty(key) && key.indexOf("_") === 0) {
        // @ts-ignore
        initAndWatch(key.replace("_", ""), this[key]);
      }
    }
  }

  addHistory(text: string) {
    if (!text) {
      return;
    }
    if (this._histories.value.length && this._histories.value[0].text === text) {
      return;
    }
    this._histories.value.unshift(new History(new Date().getTime(), text));
  }

  clearHistories() {
    this._histories.value.splice(0, this._histories.value.length);
  }

  clearTimeoutHistory(timeoutLimit: number = 7 * 24 * 3600000) {
    if (!this._histories.value.length) {
      return;
    }
    // 检查有没有超过七天的记录
    const now = (new Date()).getTime();
    if (now - this._histories.value[this._histories.value.length - 1].time > timeoutLimit) {
      let lastIndex = -1;
      for (let i = this._histories.value.length; i > 50; i--) {
        if (now - this._histories.value[i].time > timeoutLimit) {
          lastIndex = i;
        } else {
          break;
        }
      }
      // 删除超期的
      if (lastIndex != -1) {
        this._histories.value.splice(lastIndex);
      }
    }
  }
}

let instance: Db = new Db();
export default {
  init() {
    App.init().value ? instance = new Db : App.ready().then(() => {
      instance = new Db();
    })
  },
  get(): Db {
    return instance;
  }
}

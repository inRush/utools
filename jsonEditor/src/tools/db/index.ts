import Env from "@/tools/env";
import { utools } from '@/tools/variable'
import { History } from "@/model";
import StorageRef from "@/tools/db/storageRef";
import { ref, Ref } from "vue";

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

export class Db {
  private readonly _histories: Ref<History[]>;

  constructor() {
    this._histories = StorageRef('histories', []) as Ref<History[]>;
  }

  get histories() {
    return this._histories;
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

let instance: Db;
const init = ref(false)
export default {
  init() {
    return init;
  },
  get(): Db {
    return instance;
  },
  ready() {
    return new Promise<void>((resolve, reject) => {
      if (Env.isUtools()) {
        utools.onPluginReady(() => {
          instance = new Db();
          init.value = true;
          resolve();
        });
      } else {
        instance = new Db();
        resolve();
      }
    });
  }
}

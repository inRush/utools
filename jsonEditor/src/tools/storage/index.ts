import Utools from "@/tools/storage/utools";
import Local from "@/tools/storage/local";
import Env from "@/tools/env";
import { utools } from '@/tools/variable'

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


export default {
  get(): IStorage {
    if (Env.isUtools()) {
      return new Utools();
    }
    return new Local();
  },
  ready(callback: Function) {
    if (Env.isUtools()) {
      utools.onPluginReady(callback);
    } else {
      callback();
    }
  }
}

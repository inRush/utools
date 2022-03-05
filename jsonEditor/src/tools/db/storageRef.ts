import { customRef } from "vue";
import { IStorage } from "./index";
import Env from "@/tools/env";
import Utools from "@/tools/db/utools";
import Local from "@/tools/db/local";

let storage: IStorage;
if (Env.isUtools()) {
  storage = new Utools();
} else {
  storage = new Local();
}


export default (key: string, initValue: any) => {
  return customRef((track, trigger) => {
    if (typeof initValue === 'object') {
      if (storage.getItem(key)) {
        initValue = storage.getItem(key);
      }
      initValue = new Proxy(initValue, {
        get(target: any, p: string | symbol, receiver: any): any {
          return target[p];
        },
        set(target: any, p: string | symbol, value: any, receiver: any): boolean {
          target[p] = value;
          console.log("set", p, value)
          storage.setItem(key, target);
          return true;
        }
      })
    }
    return {
      get() {
        track();
        return initValue;
      },
      set(newValue) {
        initValue = newValue;
        storage.setItem(key, initValue);
        trigger();
      }
    }
  })
}

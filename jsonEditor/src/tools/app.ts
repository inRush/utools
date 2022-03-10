import { ref } from "vue";
import Env from "@/tools/env";
import { utools } from "@/tools/variable";

export interface EnterValue {
  type: 'browser' | 'utools',
  data?: any
}

const init = ref(false)
export default {
  init() {
    return init;
  },
  ready() {
    return new Promise<void>((resolve, reject) => {
      if (Env.isUtools()) {
        utools.onPluginReady(() => {
          init.value = true;
          resolve();
        });
      } else {
        init.value = true;
        resolve();
      }
    });
  },
  enter() {
    return new Promise<EnterValue>((resolve, reject) => {
      if (Env.isUtools()) {
        utools.onPluginEnter((data: any) => {
          if (init.value) {
            resolve({type: 'utools', data});
          } else {
            this.ready().then(() => resolve({type: 'utools', data}))
          }
        });
      } else {
        resolve({type: 'browser'});
      }
    });
  }
}

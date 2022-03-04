import { IStorage } from "@/tools/storage/index";
import { utools } from '@/tools/variable'

const typeCode = "<<$$$$>>";

class Utools implements IStorage {
  /**
   * 添加值
   * @param key 键名
   * @param value 键值
   */
  setItem(key: string, value: any) {
    if (value) {
      const type = typeof value;
      let strValue = value;
      if (type == 'object') {
        strValue = JSON.stringify(value);
      }
      strValue = type + typeCode + strValue;
      utools.dbStorage.setItem(key, strValue);
    } else {
      utools.dbStorage.setItem(key, value)
    }
  }

  /**
   * 获取值
   * @param key 键名
   * @return 键值
   */
  getItem(key: string) {
    let value = utools.dbStorage.getItem(key);
    if (!value) {
      return value;
    }
    let strings = value.split(typeCode);
    if (strings.length == 1) {
      return strings;
    }
    if (strings[0] == 'number') {
      return +strings[1];
    }
    if (strings[0] == 'object') {
      return JSON.parse(strings[1]);
    }
    return strings[1];
  }

  removeItem(key: string): any {
    utools.dbStorage.removeItem(key);
  }
}

export default Utools;

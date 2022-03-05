import { IStorage } from "@/tools/db/index";

const typeCode = "<<$$$$>>";

class Local implements IStorage {
  getItem(key: string): any {
    let value = window.localStorage.getItem(key);
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

  setItem(key: string, value: any): void {
    if (value) {
      const type = typeof value;
      let strValue = value;
      if (type == 'object') {
        strValue = JSON.stringify(value);
      }
      strValue = type + typeCode + strValue;
      window.localStorage.setItem(key, strValue);
    } else {
      window.localStorage.setItem(key, value)
    }
  }

  removeItem(key: string): any {
    window.localStorage.removeItem(key)
  }

}

export default Local;

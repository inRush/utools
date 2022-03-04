export default {
  isBase64(str: string) {
    if (str === '' || str.trim() === '') {
      return false;
    }
    try {
      return btoa(atob(str)) == str;
    } catch (err) {
      return false;
    }
  },

  convertBase64Str(str: string) {
    return decodeURIComponent(window.escape(window.atob(str)));
  },


  convertBase64Obj(json: any) {
    if (typeof json === 'string') {
      return;
    }
    for (let key in json) {
      if (!json.hasOwnProperty(key)) {
        continue;
      }
      if (typeof json[key] === 'object') {
        if (json[key].length) {

        } else {
          this.convertBase64Obj(json[key]);
        }
      } else if (typeof json[key] === 'string' && this.isBase64(json[key])) {
        try {
          let decodeStr = this.convertBase64Str(json[key]);
          json[key] = JSON.parse(decodeStr);
          this.convertBase64Obj(json[key]);
        } catch (e) {
        }
      }
    }
  }
}

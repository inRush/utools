interface DbSaveDoc {
  _id: string;

  [key: string]: any;
}

interface DbRet {
  id: string;
  ok: boolean;
  _rev: string;
}

interface DbGetDoc {
  _id: string;
  _rev: string;

  [key: string]: any;
}

interface FeatureConf {
  code: string;
  explain: string;
  cmds: CmdImg[] | CmdFiles[] | CmdRegex[] | CmdOver[] | string[];
}

interface CmdBase {
  label: string;
}

interface CmdImg extends CmdBase {
  type: 'img';
}

interface CmdFiles extends CmdBase {
  type: 'files';
  fileType?: 'file' | 'directory';
  minNum: number;
  maxNum: number;
}

interface CmdRegex extends CmdBase {
  type: 'regex';
  match: string;
  minLength: number;
  maxLength: number;
}

interface CmdOver extends CmdBase {
  type: 'over';
}

declare interface UTools {
  db: {
    /**
     * 执行该方法将会创建或更新数据库文档
     * @param {DbSaveDoc} doc
     * @return {DbRet}
     */
    put: (doc: DbSaveDoc) => DbRet;

    /**
     * 执行该方法将会根据文档ID获取数据
     * @param {string} id
     * @return {DbGetDoc}
     */
    get: (id: string) => DbGetDoc;

    /**
     * 执行该方法将会删除数据库文档，可以传入文档对象或文档id进行操作。
     * @param {string} id
     * @return {DbRet}
     */
    remove: (id: string) => DbRet;

    /**
     * 执行该方法将会批量更新数据库文档，传入需要更改的文档对象合并成数组进行批量更新。
     * @param {DbSaveDoc[]} docs
     * @return {DbRet[]}
     */
    bulkDocs: (docs: DbSaveDoc[]) => DbRet[];

    /**
     * 执行该方法将会获取所有数据库文档，如果传入字符串，则会返回以字符串开头的文档，也可以传入指定ID的数组，不传入则为获取所有文档。
     * @param {string[]} prevKey
     * @return {DbGetDoc[]}
     */
    allDocs: (prevKey: string[]) => DbGetDoc[];
  };

  dbStorage: {
    setItem(key: string, value: any): void
    getItem(key: string): any
    removeItem(key: string): void
  }

  // event
  /**
   *
   * 当插件装载成功，uTools将会主动调用这个方法（生命周期内仅调用一次）。
   * 注意：在此方法未被执行前，无法调用其他方法。
   *
   * @param {Function} callback
   *
   */
  onPluginReady: (callback: Function) => void;

  /**
   * 每当插件从后台进入到前台时，uTools将会主动调用这个方法
   * @param {(param: onPluginEnterFuncCallbackParam) => void} callback
   */
  onPluginEnter: (
      callback: (param: {
        code: string;
        type: string;
        payload: any;
      }) => void) => void;

  /**
   * 每当插件从前台进入到后台时，uTools将会主动调用这个方法。
   * @param {Function} callback
   */
  onPluginOut: (callback: Function) => void;

  /**
   * 用户对插件进行分离操作时，uTools将会主动调用这个方法。
   * @param {Function} callback
   */
  onPluginDetach: (callback: Function) => void;

  /**
   * 当此插件的数据在其他设备上被更改后同步到此设备时，uTools将会主动调用这个方法（必须在插件可视的情况下才会触发）
   * @param {Function} callback
   */
  onDbPull: (callback: Function) => void;

  // others

  /**
   * 该方法只适用于在macOS下执行，用于判断uTools是否拥有辅助权限，如果没有可以调用API方法requestPrivilege请求
   * @return {boolean}
   */
  isHadPrivilege: () => boolean;

  /**
   * @param {string} name
   * @return {string}
   */
  getPath: (name: 'home' | 'appData' | 'userData' | 'temp' | 'exe' | 'desktop' | 'documents' | 'downloads' | 'music' | 'pictures' | 'videos' | 'logs') => string;

  /**
   * 该方法只适用于在macOS下执行，该方法调用后会弹出窗口向用户申请辅助权限。
   * @return {boolean}
   */
  requestPrivilege: () => boolean;

  /**
   * 执行该方法将会隐藏uTools主窗口，包括此时正在主窗口运行的插件，分离的插件不会被隐藏。
   * @return {boolean}
   */
  hideMainWindow: () => boolean;

  /**
   * 执行该方法将会显示uTools主窗口，包括此时正在主窗口运行的插件。
   * @return {boolean}
   */
  showMainWindow: () => boolean;

  /**
   * 弹出文件保存框
   * @param options
   */
  showSaveDialog: (options: any) => string

  /**
   * 执行该方法将会修改插件窗口的高度。
   * @param {number} height
   * @return {boolean}
   */
  setExpendHeight: (height: number) => boolean;

  /**
   * 设置子输入框，进入插件后，原本uTools的搜索条主输入框将会变成子输入框，设置完子输入框搜索条子输入框可以为插件所使用。
   * @param {() => void} onChange
   * @param {string} placeholder
   * @return {boolean}
   */
  setSubInput: (onChange: (params: { text: string }) => void, placeholder?: string) => boolean;

  /**
   * 移出先前设置的子输入框，在插件切换到其他页面时可以重新设置子输入框为其所用。
   * @return {boolean}
   */
  removeSubInput: () => boolean;

  /**
   * 直接对子输入框的值进行设置。
   * @param {string} value
   * @return {boolean}
   */
  setSubInputValue: (value: string) => boolean;

  /**
   * 执行该方法将会退出当前插件。
   * @return {boolean}
   */
  outPlugin: () => boolean;

  /**
   *
   * @param {string} body 显示的内容
   * @param {string | null} clickFeatureCode 用户点击系统通知时，uTools将会使用此`code`进入插件
   * @param {boolean} silent 是否播放声音
   * @return {boolean}
   */
  showNotification: (body: string, clickFeatureCode: string | null, silent: boolean) => boolean;

  /**
   * 返回本插件所有动态增加的功能。
   * @return {FeatureConf[]}
   */
  getFeatures: () => FeatureConf[];

  /**
   * 为本插件动态新增某个功能。
   * @param {FeatureConf} featureConf
   * @return {boolean}
   */
  setFeature: (featureConf: FeatureConf) => boolean;

  /**
   * 动态删除本插件的某个功能。
   * @param {string} featureCode
   * @return {boolean}
   */
  removeFeature: (featureCode: string) => boolean;


  /**
   * 跳转到某个插件
   * @param {string} cmdText 激活这个插件的指令
   * @param payloadCmd 这个指令将收到的参数
   */
  redirect: (cmdText: string, payloadCmd: any) => void;
}

declare const utools: UTools;

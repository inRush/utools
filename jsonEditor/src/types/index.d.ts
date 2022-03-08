import * as quicktype from "quicktype-core";
import { SerializedRenderResult } from "quicktype-core/dist/Source";

export {}

type QuickType = typeof quicktype;
declare global {
  function _getFile(path: string): Buffer

  const _quickType: QuickType

  /**
   * 转换json到其他语言
   * @param targetLanguage 目标语言
   * @param typeName 类名
   * @param jsonString json字符串
   */
  function _convertJson(targetLanguage: string, typeName: string, jsonString: string): Promise<SerializedRenderResult>;
}

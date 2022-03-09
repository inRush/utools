import * as quicktype from "quicktype-core";
import { SerializedRenderResult } from "quicktype-core/dist/Source";
import { Options } from "quicktype-core/dist/Run";
import { MultiFileRenderResult } from "quicktype-core/dist/TargetLanguage";

export {}

type QuickType = typeof quicktype;
declare global {
  function _getFile(path: string): Buffer

  const _quickType: QuickType

  /**
   * 转换json到其他语言，放到同一个文件
   * @param targetLanguage 目标语言
   * @param typeName 类名
   * @param jsonString json字符串
   * @param options 配置
   */
  function _convertJson(targetLanguage: string, typeName: string, jsonString: string, options?: Partial<Options>): Promise<SerializedRenderResult>;

  /**
   * 转换json到其他语言，分开多个文件
   * @param targetLanguage
   * @param typeName
   * @param jsonString
   * @param options
   */
  function _convertMultipleJson(targetLanguage: string, typeName: string, jsonString: string, options?: Partial<Options>): Promise<MultiFileRenderResult>;
}

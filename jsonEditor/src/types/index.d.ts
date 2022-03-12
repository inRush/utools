import * as quicktype from "quicktype-core";

export {}

type QuickType = typeof quicktype;
declare global {
  function _getFile(path: string): Buffer

  function _saveDownloadFiles(dirName: string, files: Map<string, string>): Promise<string>

  interface Window {
    utools: UTools
  }
}

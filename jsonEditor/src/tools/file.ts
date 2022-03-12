import Env from './env'
import JsZip from 'jszip';
import FileSaver from 'file-saver'

const zip = new JsZip();

export function exportFile(dirName: string, files: Map<string, string>) {
  return new Promise<void>((resolve) => {
    if (Env.isUtools()) {
      _saveDownloadFiles(dirName, files).then((path: string) => {
        utools.shellShowItemInFolder(path);
        resolve()
      });
    } else {
      if (files.size > 1) {
        files.forEach((file, fileName, map) => {
          zip.file(fileName, file);
        });
        zip.generateAsync({type: 'blob'}).then((content) => {
          FileSaver.saveAs(content, dirName + '.zip');
          resolve()
        })
      } else {
        files.forEach((file, fileName, map) => {
          const blob = new Blob([file]);
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = fileName;
          link.click();
        });
        resolve()
      }
    }
  })

}

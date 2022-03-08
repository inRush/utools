export {}
declare global {
  interface Window {
    getFile: (path: string) => Buffer
  }
}

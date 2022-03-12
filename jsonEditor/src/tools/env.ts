let _env = 'browser';
if ((window as any).utools) {
  _env = 'utools'
}
export const env = _env;
export default {
  isUtools(): boolean {
    return env === 'utools';
  }
}

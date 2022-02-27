import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: './',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "components": path.resolve(__dirname, "./src/components"),
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 全局的scss ，跨域放多个，例如：主题的变量，和一些混合等
        // additionalData: `@import "./src/style/mixin.scss";`,
      }
    }
  }
})

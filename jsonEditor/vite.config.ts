import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path';
// @ts-ignore
import vuetify from "@vuetify/vite-plugin";
import { viteCommonjs, esbuildCommonjs } from '@originjs/vite-plugin-commonjs';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    viteCommonjs(),
    vue(),
    vuetify({
      autoImport: true,
    })
  ],
  base: './',
  define: { 'process.env': {} },
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
  },
  optimizeDeps:{
    include:['./src/tools/xml/xmlToJson.js']
    // esbuildOptions:{
    //
    //   plugins:[
    //       esbuildCommonjs(["monaco-vscode-textmate-theme-converter"])
    //   ]
    // }
  }
})

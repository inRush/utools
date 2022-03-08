import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path';
// @ts-ignore
import vuetify from "@vuetify/vite-plugin";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // viteCommonjs(),
    vuetify({
      autoImport: true,
    })
  ],
  server: {
    fs: {
      strict: false
    }
  },
  base: './',
  define: {'process.env': {}},
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
  optimizeDeps: {
    esbuildOptions: {
      // plugins:[
      //     esbuildCommonjs(["quicktype-core"])
      // ]
    }
  }
})

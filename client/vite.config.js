import {fileURLToPath, URL} from 'node:url';
import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';

const backendTarget = 'http://localhost:3000';

export default defineConfig({
  plugins: [vue({
    template: {
      compilerOptions: {
        onWarn(warning, defaultHandler) {
          const message = warning.message || '';
          if (
            message.includes('cannot be child of') ||
            message.includes('according to HTML specifications') ||
            message.includes('has no matching end tag') ||
            message.includes('Element is missing end tag')
          ) {
            return;
          }
          defaultHandler(warning);
        },
      },
    },
  })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 8080,
    strictPort: true,
    proxy: {
      '^/api': {target: backendTarget},
      '^/auth': {target: backendTarget},
      '^/t': {target: backendTarget},
      '^/l': {target: backendTarget},
      '^/o': {target: backendTarget},
      '^/g': {target: backendTarget},
      '^/a': {target: backendTarget},
    },
  },
});

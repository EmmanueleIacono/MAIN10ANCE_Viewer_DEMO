import {fileURLToPath, URL} from 'node:url';
import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';

const backendTarget = 'http://localhost:3000';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 8080,
    strictPort: true,
    proxy: {
      '^/api(?:/|$)': {target: backendTarget},
      '^/auth(?:/|$)': {target: backendTarget},
      '^/t(?:/|$)': {target: backendTarget},
      '^/l(?:/|$)': {target: backendTarget},
      '^/o(?:/|$)': {target: backendTarget},
      '^/g(?:/|$)': {target: backendTarget},
      '^/a(?:/|$)': {target: backendTarget},
    },
  },
});

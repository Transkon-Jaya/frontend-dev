import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [
    vue(),
],
  base: '/office/',
  resolve: {
    alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@images': fileURLToPath(new URL('./src/assets/images', import.meta.url)),
    //   '@': path.resolve(__dirname, './src'),
    //   '@images': path.resolve(__dirname, './src/assets/images'),
    //   '@core': path.resolve(__dirname, './src/composable'),
    },
  },
  server: {
    port: 5173,
    historyApiFallback: true,
  },
});

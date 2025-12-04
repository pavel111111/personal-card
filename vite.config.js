//import { defineConfig } from 'vite'
//import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
//export default defineConfig({
  //plugins: [vue()],
//})

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      // всі запити на /api будуть прокситись на твій бекенд
      '/api': {
        target: 'https://personal-card-pied.vercel.app',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
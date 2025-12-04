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
      '/api': {
        target: 'https://personal-card-pied.vercel.app', // твій бекенд
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'), // зберігаємо шлях
      },
    },
  },
});
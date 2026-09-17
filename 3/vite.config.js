import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
  },
});
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    port: 5173, // можно явно задать порт
  },
  build: {
    outDir: 'dist', // папка для сборки
    sourcemap: true, // удобно для отладки в продакшене
  },
  resolve: {
    alias: {
      '@': '/src', // алиас для импортов, например import Foo from '@/components/Foo'
    },
  },
})

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  // Relative paths so the build works on GitHub Pages (served from /<repo>/).
  base: './',
  plugins: [react(), tailwindcss()],
});

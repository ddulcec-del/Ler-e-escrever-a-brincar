import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// The source page lives in src/index.html. `npm run build` writes the finished
// site (index.html + assets/) to the repository root, because GitHub Pages is
// set to publish the root of the main branch as-is.
export default defineConfig({
  root: 'src',
  base: './',
  publicDir: '../public',
  plugins: [react(), tailwindcss()],
  build: {
    outDir: '..',
    emptyOutDir: false,
  },
});

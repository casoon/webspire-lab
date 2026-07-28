import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

// Design-Lab: rein statisch, kein Adapter, kein Client-Framework.
// Islands werden hier bewusst NICHT konfiguriert — wer Interaktivität braucht,
// baut sie im Produktionsprojekt, nicht im Lab.
export default defineConfig({
  site: 'http://localhost:4321',
  trailingSlash: 'always',
  output: 'static',
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    inlineStylesheets: 'auto',
  },
});

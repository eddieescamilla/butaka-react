import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: en la tercera entrega (GitHub Pages) se cambia con la variable VITE_BASE.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || '/',
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: en GitHub Pages la app se publica en https://eddieescamilla.github.io/butaka-react/
// build y preview usan esa base; en desarrollo (npm run dev) se sirve en la raíz.
// VITE_BASE permite cambiarla si el repositorio se publica con otro nombre.
export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? (process.env.VITE_BASE ?? '/butaka-react/') : '/',
  plugins: [react()],
}));

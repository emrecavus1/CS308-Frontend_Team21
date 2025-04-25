// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,          // front‑end stays on 5173
    proxy: {
      // every request that starts with /api
      // will be forwarded to http://localhost:8080
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,   // makes the host header look like 8080
        secure: false         // ignore self‑signed HTTPS certs, if any
      }
    }
  }
});

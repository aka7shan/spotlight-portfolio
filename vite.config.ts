import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    // One React instance — avoids "useLayoutEffect of undefined" when vendor chunks load first.
    dedupe: ['react', 'react-dom'],
  },
  server: {
    port: 5173,
    strictPort: false,
    open: false,
  },
  preview: {
    port: 4173,
  },
  build: {
    target: 'es2022',
    sourcemap: mode !== 'production',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 800,
  },
  esbuild: {
    // Strip debugger statements and noisy console.log/debug/info calls in
    // production, but keep console.error / console.warn so real runtime issues
    // still show up in browser devtools and any wrapping error tracker.
    drop: mode === 'production' ? ['debugger'] : [],
    pure: mode === 'production' ? ['console.log', 'console.debug', 'console.info'] : [],
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'framer-motion',
      'lucide-react',
      'sonner',
    ],
  },
}));

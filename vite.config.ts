import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// Splits node_modules into stable, cacheable vendor chunks instead of one giant bundle.
// Order matters: react/react-dom -> react; @radix-ui/* -> radix; etc.
const splitVendorChunk = (id: string): string | undefined => {
  if (!id.includes('node_modules')) return undefined;
  if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/scheduler/')) {
    return 'react';
  }
  if (id.includes('@radix-ui')) return 'radix';
  if (id.includes('framer-motion')) return 'framer';
  if (id.includes('lucide-react')) return 'icons';
  if (id.includes('react-day-picker') || id.includes('date-fns')) return 'date';
  if (id.includes('react-hook-form')) return 'forms';
  if (id.includes('sonner')) return 'sonner';
  return 'vendor';
};

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
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
    rollupOptions: {
      output: {
        manualChunks: splitVendorChunk,
      },
    },
  },
  esbuild: {
    // Strip console + debugger in production builds for a smaller, cleaner bundle.
    drop: mode === 'production' ? ['console', 'debugger'] : [],
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

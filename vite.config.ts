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
    rollupOptions: {
      output: {
        // Manual vendor chunks. The previous attempt at this was reverted
        // because it caused a "useLayoutEffect of undefined" race on first
        // paint (React was being split into its own chunk that loaded after
        // some consumer). The fix lives in resolve.dedupe below — React and
        // ReactDOM are now de-duplicated so every consumer references the
        // SAME module instance regardless of which chunk imported it. With
        // that in place, manual chunks are safe again.
        //
        // Why split: the old single 810 KB chunk forced the browser to
        // download, parse, and execute everything before the app could even
        // start. Splitting lets the browser parallelize, lets the user keep
        // a long-lived cached copy of stable vendor code (so app-only
        // releases re-download <200 KB instead of 800 KB), and reduces
        // main-thread blocking on slow CPUs.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;

          // React + router travel together — splitting them apart just
          // creates more parallel HTTP requests for tightly-coupled code.
          if (
            id.includes('/node_modules/react/') ||
            id.includes('/node_modules/react-dom/') ||
            id.includes('/node_modules/react-router') ||
            id.includes('/node_modules/scheduler/')
          ) {
            return 'react-vendor';
          }

          // Radix UI is huge (2 MB on disk) and used widely. Its own chunk.
          if (id.includes('/node_modules/@radix-ui/')) return 'radix';

          // Framer Motion is animation-heavy and only needed by a few pages.
          if (id.includes('/node_modules/framer-motion/')) return 'motion';

          // Supabase client + its postgrest/realtime/storage subpackages.
          if (id.includes('/node_modules/@supabase/')) return 'supabase';

          // Profile-page-only heavy libs. Returning undefined lets Rollup
          // place them in whatever chunk consumes them — so they land in
          // ProfilePage's lazy chunk instead of the eagerly-downloaded
          // vendor bucket. Same goes for chart libs and other niche deps.
          if (
            id.includes('/node_modules/react-day-picker/') ||
            id.includes('/node_modules/react-phone-number-input/') ||
            id.includes('/node_modules/react-hook-form/') ||
            id.includes('/node_modules/libphonenumber-js/') ||
            id.includes('/node_modules/recharts/') ||
            id.includes('/node_modules/date-fns/')
          ) {
            return undefined;
          }

          // Catch-all "vendor" bucket so the main app chunk stays lean.
          // (Mostly lucide-react icons, sonner, zod, class-variance-authority,
          // clsx, tailwind-merge — small, widely-shared utility deps.)
          return 'vendor';
        },
      },
    },
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

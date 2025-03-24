import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  build: {
    sourcemap: process.env.NODE_ENV !== 'production',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
      },
    },
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: false, // Speed up builds
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        manualChunks: (id) => {
          // Dynamically create chunks based on node_modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'noscript.css') {
            return 'assets/[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
    outDir: 'dist',
    emptyOutDir: true, // Ensure clean build
  },
  css: {
    devSourcemap: process.env.NODE_ENV !== 'production',
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "./_variables" as *;
        `,
      },
    },
  },
  optimizeDeps: {
    // No specific dependencies listed, will be auto-detected
  },
  setupFiles: ['./src/tests/setup.ts'],
  environmentOptions: {
    happyDOM: {
      settings: {
        disableJavaScriptEvaluation: false,
        disableJavaScriptFileLoading: false,
      },
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./tests/setup.ts'],
    testTimeout: 10000,
    fakeTimers: {
      enable: true,
      toFake: [
        'setTimeout',
        'clearTimeout',
        'setInterval',
        'clearInterval',
        'Date',
      ],
    },
  },
  define: {
    'import.meta.env.VITE_APP_API_URL_PROD': JSON.stringify(
      process.env.VITE_APP_API_URL_PROD
    ),
  },
});

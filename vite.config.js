import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/contact-form-app/',
  build: {
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
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
  },
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "src/styles/variables" as *;
        `,
      },
    },
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
});

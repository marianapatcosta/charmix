import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

const path = require('path');

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 3000,
  },
  plugins: [
    vue(),
    VitePWA({
      base: '/',
      srcDir: 'src',
      filename: 'sw.ts',
      includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      strategies: 'injectManifest',
      registerType: 'autoUpdate',
      manifest: {
        name: 'CharMix',
        short_name: 'CharMix',
        theme_color: '#06080f',
        description:
          'CharMix is a word game based on Wordle, but has the following extra features: \n - Can be at any time, no need to wait for the next day to play again; \n - Customizable number of letters of word to guess, between 4 and 10; \n  - Customizable number of tries, between 4 and 10; \n - Customizable game language.',
        start_url: '/',
        display: 'standalone',
        background_color: '#06080f',
        icons: [
          {
            src: 'images/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: 'images/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'images/apple-touch-icon.png',
            type: 'image/png',
          },
          {
            src: 'images/mstile-150x150.png',
            sizes: '150x150',
            type: 'image/png',
          },
          {
            src: 'images/safari-pinned-tab.png',
            type: 'image/png',
          },
        ],
      },
      injectManifest: {
        globPatterns: ['**.{html, js, css, svg, json}', '**'],
        globIgnores: ['**/node_modules/**/*'],
        maximumFileSizeToCacheInBytes: 3000000,
      },
      workbox: {
        cleanupOutdatedCaches: false,
        sourcemap: true,
        globIgnores: ['**/node_modules/**/*'],
      },
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/styles/_index.scss";`,
      },
    },
  },
});

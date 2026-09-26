import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'path'

// Replaces the previous Blob-based service worker (built at runtime
// from a string, no real cache versioning) with vite-plugin-pwa,
// which generates a real precache manifest from the actual build
// output. This is the web/laptop install path — separate from the
// Android native app, but sharing the same source and IndexedDB
// engine, so "laptop" use means installing this as a PWA from a
// browser, not the Android build.

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png'],
      manifest: {
        name: 'CAT 2026 — Master Execution System',
        short_name: 'CAT 2026',
        description: 'Personal CAT 2026 execution and mastery tracking system — 75-day countdown.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#050B0E',
        theme_color: '#050B0E',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icons/maskable-icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,webmanifest,ics}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
      },
    }),
  ],
  resolve: {
    alias: { '@': resolve(__dirname, './src') },
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: { manualChunks: { vendor: ['react', 'react-dom'] } },
    },
  },
  server: { port: 5173, host: true },
})

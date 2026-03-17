import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/bundle-stats.html',
      gzipSize: true,
      brotliSize: true,
      open: false,
    }),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        runtimeCaching: [
          // API responses — NetworkFirst so fresh data wins, but stale content
          // is served when offline (better than nothing).
          // Excludes /api/auth/* to prevent stale auth responses from being cached.
          {
            urlPattern: /\/api\/(?!auth\/).*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 10,
              expiration: { maxEntries: 200, maxAgeSeconds: 24 * 60 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Static assets (JS / CSS / fonts) — CacheFirst with 30-day expiry
          {
            urlPattern: /\.(?:js|css|woff2?)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-assets',
              expiration: { maxEntries: 100, maxAgeSeconds: 30 * 24 * 60 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Images — CacheFirst with 30-day expiry
          {
            urlPattern: /^https:\/\/.*\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: { maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Uploaded content — CacheFirst with 7-day expiry
          {
            urlPattern: /\/uploads\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'uploads-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 7 * 24 * 60 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Google Fonts stylesheets — StaleWhileRevalidate
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: { maxEntries: 10, maxAgeSeconds: 30 * 24 * 60 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Google Fonts webfont files — CacheFirst (they are immutable)
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 30, maxAgeSeconds: 365 * 24 * 60 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Other external resources (CDNs, analytics, etc.) — StaleWhileRevalidate
          {
            urlPattern: /^https:\/\/(?!fonts\.googleapis\.com|fonts\.gstatic\.com).+/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'external-resources',
              expiration: { maxEntries: 50, maxAgeSeconds: 7 * 24 * 60 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      manifest: false, // use static manifest.json in public/
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor: React core
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Vendor: TanStack Query
          'vendor-query': ['@tanstack/react-query'],
          // Vendor: Editor.js (heavy, admin-only)
          'vendor-editorjs': [
            '@editorjs/editorjs',
            '@editorjs/code',
            '@editorjs/delimiter',
            '@editorjs/embed',
            '@editorjs/header',
            '@editorjs/image',
            '@editorjs/list',
            '@editorjs/paragraph',
            '@editorjs/quote',
            '@editorjs/table',
            '@editorjs/warning',
          ],
          // Vendor: Icons (Lucide — tree-shakeable)
          'vendor-icons': [
            'lucide-react',
          ],
          // Vendor: Recharts (admin analytics)
          'vendor-recharts': ['recharts', 'd3-shape', 'd3-scale', 'd3-interpolate', 'd3-path', 'd3-time', 'd3-time-format', 'd3-format', 'd3-color', 'd3-array'],
          // Vendor: DOMPurify
          'vendor-sanitize': ['dompurify'],
        },
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            const auth = req.headers?.authorization
            if (auth) proxyReq.setHeader('Authorization', auth)
          })
        },
      },
      '/uploads': { target: 'http://localhost:8080', changeOrigin: true },
    },
  },
})

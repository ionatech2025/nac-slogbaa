import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
            handler: 'CacheFirst',
            options: { cacheName: 'images', expiration: { maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 } },
          },
          {
            urlPattern: /^https:\/\/.*\/api\//i,
            handler: 'NetworkFirst',
            options: { cacheName: 'api', expiration: { maxEntries: 50, maxAgeSeconds: 5 * 60 } },
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

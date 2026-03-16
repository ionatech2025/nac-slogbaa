import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
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

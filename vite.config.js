import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa' // 🟢 NEW: Import the plugin
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    // 🟢 NEW: PWA Configuration
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Collaborative Learning Partner System',
        short_name: '',
        description: 'An AI-powered platform to connect, match, and study efficiently.',
        theme_color: '#0a0e1a', // Your dark mode background color
        background_color: '#0a0e1a',
        display: 'standalone', // This hides the browser URL bar!
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Safer chunking: Only isolate the truly massive libraries, leave React in the main vendor chunk
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('recharts')) return 'vendor-recharts';
            if (id.includes('framer-motion') || id.includes('motion')) return 'vendor-motion';
            if (id.includes('lucide-react') || id.includes('react-icons')) return 'vendor-icons';
            // Notice we removed the custom React rule here so it stays with the main app!
          }
        }
      }
    }
  }
})
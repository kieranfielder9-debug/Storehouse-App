import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'apple-touch-icon.png', 'favicon-32.png'],
      manifest: {
        name: 'Storehouse',
        short_name: 'Storehouse',
        description: 'Where your treasure is — faith-aligned banking, investing & giving.',
        theme_color: '#0B0F19',
        background_color: '#0B0F19',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        categories: ['finance', 'lifestyle'],
        icons: [
          { src: 'icon-192.png',           sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png',           sizes: '512x512', type: 'image/png' },
          { src: 'icon-512-maskable.png',  sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webp,woff,woff2}']
      }
    })
  ],
  server: {
    host: true,
    port: 5173
  }
})

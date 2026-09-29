import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Production guard. Without VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY the app
// silently runs in SANDBOX mode (src/backend/supabaseClient.js): localStorage
// only, and anyone can "sign in" with any email and any 6-digit code. A
// missing or misnamed env var in Netlify would therefore put a fake-login app
// on the live domain with no error anywhere — so a Netlify *production* build
// (NETLIFY=true, CONTEXT=production) fails loudly instead. Local
// `npm run dev` / `npm run build`, deploy previews and branch deploys are
// unaffected and keep working without a .env (sandbox mode).
function requireSupabaseEnvOnNetlifyProduction() {
  return {
    name: 'storehouse-require-supabase-env',
    config(_, { command, mode }) {
      if (command !== 'build' || process.env.NETLIFY !== 'true' || process.env.CONTEXT !== 'production') return
      const env = loadEnv(mode, process.cwd(), 'VITE_')
      const missing = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'].filter((key) => !(env[key] || '').trim())
      if (missing.length === 0) return
      throw new Error(
        `\n\n[storehouse] BUILD STOPPED: ${missing.join(' and ')} ${missing.length > 1 ? 'are' : 'is'} not set for this Netlify production build.\n` +
        `Without ${missing.length > 1 ? 'them' : 'it'} the site would deploy in sandbox mode, where anyone can "sign in" with any email and code.\n` +
        `Fix: Netlify > Site configuration > Environment variables — add ${missing.join(' and ')} (available to builds), then redeploy.\n`
      )
    }
  }
}

export default defineConfig({
  plugins: [
    requireSupabaseEnvOnNetlifyProduction(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'apple-touch-icon.png', 'favicon-32.png'],
      manifest: {
        name: 'Storehouse',
        short_name: 'Storehouse',
        description: 'Where your treasure is — faith-aligned budgeting, giving and stewardship.',
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

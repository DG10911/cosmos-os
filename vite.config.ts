import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base path is host-aware:
//  - Vercel (root domain)      -> '/'   (Vercel sets process.env.VERCEL)
//  - GitHub Pages project site -> '/cosmos-os/'
// HashRouter handles in-app routing, so this only affects asset URLs.
export default defineConfig({
  base: process.env.VERCEL ? '/' : '/cosmos-os/',
  plugins: [react()],
})

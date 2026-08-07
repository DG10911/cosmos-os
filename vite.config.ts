import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base path for GitHub Pages project site (https://<user>.github.io/cosmos-os/).
// HashRouter handles in-app routing so this only affects asset URLs.
export default defineConfig({
  base: '/cosmos-os/',
  plugins: [react()],
})

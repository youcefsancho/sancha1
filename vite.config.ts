import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base './' + HashRouter = works on GitHub Pages, Vercel and any static host
export default defineConfig({ base: './', plugins: [react(), tailwindcss()] })

import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// GitHub Pages serves the site from /<repo>/; override with BASE_PATH for other hosts.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/ielts-mock-platform/',
  plugins: [react(), tailwindcss()],
})

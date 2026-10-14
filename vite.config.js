import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/descubre-cochabamba-react/',
  plugins: [
    react(),
    {
      name: 'github-pages-spa-fallback',
      apply: 'build',
      closeBundle() {
        const outputDirectory = resolve(process.cwd(), 'dist')
        copyFileSync(resolve(outputDirectory, 'index.html'), resolve(outputDirectory, '404.html'))
      },
    },
  ],
})

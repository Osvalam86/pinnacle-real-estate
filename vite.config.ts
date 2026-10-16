import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const nodeModules = (packages: string[]) => new RegExp(`[\\\\/]node_modules[\\\\/](${packages.join('|')})[\\\\/]`)

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: 'react', test: nodeModules(['react', 'react-dom', 'scheduler', 'react-router']) },
            { name: 'react-aria', test: nodeModules(['react-aria-components', 'react-aria', 'react-stately', 'clsx', 'use-sync-external-store']) },
          ],
        },
      },
    },
  },
})

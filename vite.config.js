import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    // Tailwind v4 runs as a Vite plugin — no separate tailwind.config file needed.
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Lets us import with "@/..." instead of long "../../" chains.
      // e.g. import { cn } from "@/lib/utils"
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})

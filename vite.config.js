import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // base: "/", //   for netlify server 
  base: "/js-c",
  plugins: [react()],
})

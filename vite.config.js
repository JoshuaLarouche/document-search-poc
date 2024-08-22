import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from "dotenv";

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // proxy: {
    //   '/tika': {
    //     // target: 'http://localhost:9998',
    //     // target: 'https://tika-test.apps.silver.devops.gov.bc.ca/',
    //     target: process.env.VITE_TIKA_URL,
    //     changeOrigin: true,
    //     rewrite: path => path.replace(/^\/tika/, '')
    //   }
    // }
  },
  build: {
    outDir: 'dist'
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react()
    //,
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   devOptions: {
    //     enabled: true
    //   },
    //   workbox: {
    //     globPatterns: ['**/*.{js,css,html,ico,png,svg}']
    //   },
    //   manifest: {
    //     name: "Connect",
    //     short_name: "Connect",
    //     description: "A social media and real time chat application.",
    //     theme_color: "#ffffff",
    //     display: "minimal-ui",
    //     icons: [
    //       {
    //         "src": "pwa-64x64.png",
    //         "sizes": "64x64",
    //         "type": "image/png"
    //       },
    //       {
    //         "src": "android-chrome-192x192.png",
    //         "sizes": "192x192",
    //         "type": "image/png"
    //       },
    //       {
    //         "src": "android-chrome-512x512.png",
    //         "sizes": "512x512",
    //         "type": "image/png"
    //       },
    //       {
    //         "src": "android-chrome-512x512.png",
    //         "sizes": "512x512",
    //         "type": "image/png",
    //         "purpose": "any"
    //       },
    //       {
    //         "src": "maskable-icon-512x512.png",
    //         "sizes": "512x512",
    //         "type": "image/png",
    //         "purpose": "maskable"
    //       }
    //     ]
    //   }
    // })
  ],
  server :{
    proxy: {
      '/api' : {
        target: "http://localhost:4000",
        changeOrigin: true
      }
    }
  }
})

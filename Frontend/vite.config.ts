import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "pwa-icons/*"],
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        navigateFallback: "index.html",
        navigateFallbackAllowlist: [
          /^\/user/,
          /^\/play/,
          /^\/leaderboard/,
          /^\/puzzles/,
          /^\/friends/,
          /^\/landing-page/,
          /^\/settings/,
        ],
      },
      manifest: {
        name: "Knightly",
        short_name: "Knightly",
        description: "A premium chess platform",
        theme_color: "#6b21a8",
        background_color: "#1e1b4b",
        display: "standalone",
        icons: [
          {
            src: "/pwa-icons/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-icons/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/pwa-icons/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
});

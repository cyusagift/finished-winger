import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

const renderExternalHostname = process.env.RENDER_EXTERNAL_HOSTNAME;
const additionalAllowedHosts = [
  "finished-winger.onrender.com",
  renderExternalHostname,
].filter(Boolean);

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      // Ensures a production build is installable (and SPA routes work offline).
      workbox: {
        navigateFallback: "/index.html",
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest}"],
      },
      includeAssets: [
        "favicon.ico",
        "pwa.png",
        "pwa-192x192.png",
        "pwa-512x512.png",
      ],
      manifest: {
        id: "/",
        name: "Winger Inventory",
        short_name: "Winger",
        description: "Inventory Management System for Winger, Kigali",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#f8f5f2",
        theme_color: "#c75a2a",
        orientation: "portrait",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    port: process.env.PORT ? Number(process.env.PORT) : undefined,
    strictPort: Boolean(process.env.PORT),
    allowedHosts: additionalAllowedHosts.length ? additionalAllowedHosts : undefined,
  },
  preview: {
    host: true,
    port: process.env.PORT ? Number(process.env.PORT) : undefined,
    strictPort: Boolean(process.env.PORT),
    allowedHosts: additionalAllowedHosts.length ? additionalAllowedHosts : undefined,
  },
});


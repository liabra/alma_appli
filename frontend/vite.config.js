import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/*.png", "icons/*.svg"],
      manifest: {
        name: "Alma",
        short_name: "Alma",
        description: "Ton espace maternité — allaitement, bébé, post-partum",
        id: "/",
        scope: "/",
        lang: "fr",
        dir: "ltr",
        categories: ["health", "lifestyle", "parenting"],
        theme_color: "#C4714A",
        background_color: "#F5EDE3",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        icons: [
          { src: "/icons/alma-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "/icons/alma-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "/icons/alma-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
        shortcuts: [
          { name: "Ajouter une tétée", short_name: "Tétée", url: "/?action=tetee",
            icons: [{ src: "/icons/alma-192.png", sizes: "192x192" }] },
          { name: "Carnet de soins", short_name: "Carnet", url: "/?section=carnet",
            icons: [{ src: "/icons/alma-192.png", sizes: "192x192" }] },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
      },
    }),
  ],
  server: { port: 5173 },
});

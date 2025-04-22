import { defineConfig } from "vite";
import { resolve } from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  root: resolve(__dirname, "src"),
  publicDir: resolve(__dirname, "src", "public"),
  build: {
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },

  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      useWebmanifestExtension: true,
      manifest: false,
      injectRegister: "null",
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ url }) => {
              return url.origin === "https://fonts.googleapis.com" || url.origin === "https://fonts.gstatic.com";
            },
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts",
            },
          },
          {
            urlPattern: ({ url }) => {
              return url.origin === "https://cdn.jsdelivr.net";
            },
            handler: "CacheFirst",
            options: {
              cacheName: "mdi-icons",
            },
          },
          {
            urlPattern: ({ request, url }) => {
              const baseUrl = new URL("https://story-api.dicoding.dev/v1");
              return baseUrl.origin === url.origin && request.destination !== "image";
            },
            handler: "NetworkFirst",
            options: {
              cacheName: "stories-api",
            },
          },
          {
            urlPattern: ({ request, url }) => {
              const baseUrl = new URL("https://story-api.dicoding.dev/v1");
              return baseUrl.origin === url.origin && request.destination === "image";
            },
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "stories-images",
            },
          },
          {
            urlPattern: ({ url }) => {
              return url.origin.includes("maptiler");
            },
            handler: "CacheFirst",
            options: {
              cacheName: "maptiler-geocoding",
            },
          },
        ],
      },
    }),
  ],
});

import { defineConfig } from "vite";

export default defineConfig({
  // root: "public",

  build: {
    outDir: "dist",
    emptyOutDir: true,
  },

  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});

import { defineConfig } from "vite";

export default defineConfig({
  // root: "public",

  build: {
    outDir: "dist",
    emptyOutDir: true,
    minify: "terser",

    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      format: {
        comments: false,
      },
    },
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

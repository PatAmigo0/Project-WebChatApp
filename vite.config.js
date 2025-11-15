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
        ecma: 2020,
        unsafe: true,
        passes: 3,
      },
      format: {
        comments: false,
        ecma: 2020,
      },
      mangle: {},
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

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname),
  publicDir: false,
  server: {
    host: "0.0.0.0",
    port: 4173,
  },
  resolve: {
    alias: {
      "@playground": path.resolve(__dirname, "src"),
      "@packages": path.resolve(__dirname, "../src/packages"),
    },
  },
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { copyFileSync } from "fs";

function copyToDistPlugin() {
  return {
    name: "copy-files",
    writeBundle() {
      copyFileSync("manifest.json", "dist/manifest.json");
      copyFileSync("public/background.js", "dist/background.js");
      copyFileSync("public/content.js", "dist/content.js");
      copyFileSync("public/content.css", "dist/content.css");
    },
  };
}

export default defineConfig({
  plugins: [react(), copyToDistPlugin()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
      },
      output: {
        manualChunks: undefined,
      },
    },
  },
});

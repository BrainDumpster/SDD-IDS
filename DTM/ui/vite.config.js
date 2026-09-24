import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

export default defineConfig({
  plugins: [react()],
  root: path.join(root, "DTM", "ui"),
  server: {
    port: 8111,
    fs: { allow: [root] },
    proxy: {
      "/design": "http://127.0.0.1:8110",
      "/health": "http://127.0.0.1:8110",
    },
  },
  resolve: {
    alias: {
      "@ids": path.join(root, "lib", "react", "ids"),
    },
  },
});

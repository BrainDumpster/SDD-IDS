import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const apiTarget = (process.env.DTM_URL ?? "http://127.0.0.1:8110").replace(/\/$/, "");

export default defineConfig({
  plugins: [react()],
  root: path.join(root, "DTM", "ui"),
  server: {
    port: 8111,
    fs: { allow: [root] },
    // Dev-only proxy. Production UI must set VITE_DTM_API_URL; it never imports DTM/features.
    proxy: {
      "/design": apiTarget,
      "/health": apiTarget,
      "/me": apiTarget,
      "/admin": apiTarget,
    },
  },
  resolve: {
    alias: {
      "@ids": path.join(root, "lib", "react", "ids"),
    },
  },
});

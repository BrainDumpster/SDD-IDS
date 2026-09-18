import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { libInjectCss } from "vite-plugin-lib-inject-css";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = __dirname;
const repoRoot = path.resolve(pkgRoot, "../../..");

const INTERNAL_DIRS = new Set([
  "dropdown-shared",
  "scripts",
  "dist",
  "styles",
  "assets",
  "fonts",
  "node_modules",
]);

function publicEntries(): Record<string, string> {
  const entries: Record<string, string> = {
    index: path.join(pkgRoot, "index.ts"),
  };

  for (const ent of readdirSync(pkgRoot, { withFileTypes: true })) {
    if (!ent.isDirectory() || INTERNAL_DIRS.has(ent.name) || ent.name.startsWith(".")) {
      continue;
    }
    const indexTs = path.join(pkgRoot, ent.name, "index.ts");
    if (existsSync(indexTs)) {
      entries[`${ent.name}/index`] = indexTs;
    }
  }

  return entries;
}

export default defineConfig({
  plugins: [
    react({ jsxRuntime: "automatic" }),
    libInjectCss(),
    dts({
      include: [
        "./**/*.ts",
        "./**/*.tsx",
        "../shared/**/*.ts",
        "../shared/**/*.tsx",
      ],
      exclude: [
        "**/node_modules/**",
        "**/dist/**",
        "**/scripts/**",
        "**/assets/**",
        "**/fonts/**",
        "**/styles/**",
        "vite.config.ts",
      ],
      entryRoot: pkgRoot,
      outDir: "dist",
      insertTypesEntry: false,
      rollupTypes: false,
      copyDtsFiles: true,
      tsconfigPath: path.join(pkgRoot, "tsconfig.json"),
    }),
  ],
  build: {
    lib: {
      entry: publicEntries(),
      formats: ["es"],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        /^react\//,
        /^react-dom\//,
      ],
      output: {
        preserveModules: false,
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name]-[hash].js",
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || "asset";
          if (name.endsWith(".css")) {
            return "css/[name]-[hash][extname]";
          }
          return "media/[name]-[hash][extname]";
        },
      },
    },
    cssCodeSplit: true,
    sourcemap: true,
    emptyOutDir: true,
    target: "es2020",
    minify: false,
  },
  server: {
    fs: {
      allow: [repoRoot],
    },
  },
});

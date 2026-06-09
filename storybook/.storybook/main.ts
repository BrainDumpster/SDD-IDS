import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { StorybookConfig } from "@storybook/react-vite";
import type { Plugin } from "vite";
import { mergeConfig } from "vite";

// Story globs are resolved from `.storybook/` (not `storybook/`). Use `../../` to reach repo-root
// `storybook-generated/` (a single `../` only searches under `storybook/storybook-generated`).
const storybookConfigDir = path.dirname(fileURLToPath(import.meta.url));
const storybookPackageRoot = path.resolve(storybookConfigDir, "..");
const repoRoot = path.resolve(storybookPackageRoot, "..");

/**
 * Storybook builds a static story→importer map at startup. Hot-added `.stories.*`
 * files are indexed in the sidebar but throw `importers[path] is not a function`
 * until the dev server restarts (full-reload alone is not enough).
 */
function restartOnNewStoryFiles(): Plugin {
  const storyRoots = [
    path.join(storybookPackageRoot, "src"),
    path.join(repoRoot, "storybook-generated"),
  ];
  const storybookCacheDir = path.join(storybookPackageRoot, "node_modules/.cache/storybook");

  const clearStorybookCache = () => {
    try {
      fs.rmSync(storybookCacheDir, { recursive: true, force: true });
    } catch {
      // Cache may already be absent; ignore.
    }
  };

  return {
    name: "restart-on-new-story-files",
    configureServer(server) {
      let restartPending = false;

      const scheduleRestart = (file: string, reason: "add" | "unlink") => {
        const normalized = path.normalize(file);
        if (!/\.stories\.(tsx|ts|mdx)$/.test(normalized)) return;
        if (!storyRoots.some((root) => normalized.startsWith(root + path.sep))) return;
        if (restartPending) return;
        restartPending = true;

        server.config.logger.warn(
          `\n[storybook] Story file ${reason === "add" ? "added" : "removed"}: ${path.basename(normalized)}\n` +
            "Clearing Storybook cache and restarting dev server " +
            "(fixes `importers[path] is not a function`).\n",
        );

        // Defer so the file write finishes before Vite rescans globs.
        setTimeout(() => {
          clearStorybookCache();
          void server.restart().finally(() => {
            restartPending = false;
          });
        }, 200);
      };

      server.watcher.on("add", (file) => scheduleRestart(file, "add"));
      server.watcher.on("unlink", (file) => scheduleRestart(file, "unlink"));
    },
  };
}

const config: StorybookConfig = {
  // Absolute globs keep Vite importer keys aligned with the story index (avoids
  // `importers[path] is not a function` for files under repo-root storybook-generated/).
  stories: [
    path.join(storybookPackageRoot, "src/**/*.stories.@(ts|tsx)"),
    path.join(repoRoot, "storybook-generated/ids/src/**/*.stories.@(ts|tsx)"),
    path.join(repoRoot, "storybook-generated/dap/src/**/*.stories.@(ts|tsx)"),
    path.join(repoRoot, "storybook-generated/synapse/src/**/*.stories.@(ts|tsx)"),
  ],
  addons: ["@storybook/addon-essentials"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      plugins: [restartOnNewStoryFiles()],
      server: {
        fs: {
          allow: [storybookPackageRoot, repoRoot],
        },
        // If 6006 is taken, fail fast instead of silently picking another port
        // (a mismatched URL often yields non-JSON /index.json responses).
        strictPort: true,
      },
      build: {
        assetsInlineLimit: 0,
      },
    });
  },
};

export default config;

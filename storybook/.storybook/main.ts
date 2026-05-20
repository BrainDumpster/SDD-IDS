import path from "node:path";
import { fileURLToPath } from "node:url";

import type { StorybookConfig } from "@storybook/react-vite";
import type { Plugin } from "vite";
import { mergeConfig } from "vite";

// Story globs are resolved from `.storybook/` (not `storybook/`). Use `../../` to reach repo-root
// `storybook-generated/` (a single `../` only searches under `storybook/storybook-generated`).
const storybookConfigDir = path.dirname(fileURLToPath(import.meta.url));
const storybookPackageRoot = path.resolve(storybookConfigDir, "..");

/** New files under storybook-generated are not in the startup importers map until restart. */
function warnOnNewSpecGeneratedStories(): Plugin {
  return {
    name: "warn-on-new-spec-generated-stories",
    configureServer(server) {
      server.watcher.on("add", (file) => {
        const normalized = path.normalize(file);
        if (
          !normalized.includes(`${path.sep}storybook-generated${path.sep}`) ||
          !/\.stories\.(tsx|ts|mdx)$/.test(normalized)
        ) {
          return;
        }
        server.config.logger.warn(
          "\n[storybook] New spec-generated story file detected. Stop and restart Storybook " +
            "(pnpm dev:clean) or you may see: importers[path] is not a function\n",
        );
      });
    },
  };
}

const repoRoot = path.resolve(storybookPackageRoot, "..");

const config: StorybookConfig = {
  stories: [
    "../src/**/*.stories.@(ts|tsx)",
    "../../storybook-generated/ids/src/**/*.stories.@(ts|tsx)",
    "../../storybook-generated/dap/src/**/*.stories.@(ts|tsx)",
  ],
  addons: ["@storybook/addon-essentials"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      plugins: [warnOnNewSpecGeneratedStories()],
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

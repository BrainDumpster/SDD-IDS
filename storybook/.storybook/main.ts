import path from "node:path";
import { fileURLToPath } from "node:url";

import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";

// Resolve story globs to absolute paths so Vite's story importer map matches runtime
// `importFn(path)` keys (avoids "importers[path] is not a function" when .storybook lives
// under storybook/ and stories live outside that package).
const storybookConfigDir = path.dirname(fileURLToPath(import.meta.url));
const storybookPackageRoot = path.resolve(storybookConfigDir, "..");
const repoRoot = path.resolve(storybookPackageRoot, "..");

const config: StorybookConfig = {
  stories: [
    path.join(storybookPackageRoot, "src/**/*.stories.@(ts|tsx)"),
    // Spec-generated: IDS + DAP only (exclude IDS-AI generated duplicates from sidebar).
    path.join(repoRoot, "storybook-generated/ids/src/**/*.stories.@(ts|tsx)"),
    path.join(repoRoot, "storybook-generated/dap/src/**/*.stories.@(ts|tsx)"),
  ],
  addons: ["@storybook/addon-essentials"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      server: {
        fs: {
          allow: [storybookPackageRoot, repoRoot],
        },
      },
      build: {
        assetsInlineLimit: 0,
      },
    });
  },
};

export default config;

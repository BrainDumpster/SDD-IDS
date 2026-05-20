import path from "node:path";
import { fileURLToPath } from "node:url";

import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";

// Story globs are resolved from `.storybook/` (not `storybook/`). Use `../../` to reach repo-root
// `storybook-generated/` (a single `../` only searches under `storybook/storybook-generated`).
const storybookConfigDir = path.dirname(fileURLToPath(import.meta.url));
const storybookPackageRoot = path.resolve(storybookConfigDir, "..");
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

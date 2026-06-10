import path from "node:path";
import { fileURLToPath } from "node:url";

import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";

// Story globs are resolved from `.storybook/` (not `storybook/`). Use `../../` to reach repo-root
// `storybook-generated/` (a single `../` only searches under `storybook/storybook-generated`).
const storybookConfigDir = path.dirname(fileURLToPath(import.meta.url));
const storybookPackageRoot = path.resolve(storybookConfigDir, "..");
const repoRoot = path.resolve(storybookPackageRoot, "..");
const reactRoot = path.join(storybookPackageRoot, "node_modules/react");
const reactDomRoot = path.join(storybookPackageRoot, "node_modules/react-dom");

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
      resolve: {
        dedupe: ["react", "react-dom", "@base-ui-components/utils"],
        alias: {
          react: reactRoot,
          "react-dom": reactDomRoot,
          "react/jsx-runtime": path.join(reactRoot, "jsx-runtime.js"),
          "react/jsx-dev-runtime": path.join(reactRoot, "jsx-dev-runtime.js"),
        },
      },
      optimizeDeps: {
        include: [
          "react",
          "react-dom",
          "react/jsx-runtime",
          "react/jsx-dev-runtime",
          "@base-ui-components/react/popover",
        ],
      },
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

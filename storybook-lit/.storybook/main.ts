import type { StorybookConfig } from "@storybook/web-components-vite";
import { mergeConfig } from "vite";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-essentials"],
  framework: {
    name: "@storybook/web-components-vite",
    options: {},
  },
  staticDirs: [
    { from: join(root, "assets"), to: "/assets" },
    { from: join(root, "components"), to: "/components" },
  ],
  async viteFinal(config) {
    return mergeConfig(config, {
      server: {
        fs: {
          allow: [root],
        },
        strictPort: true,
      },
      resolve: {
        alias: {
          "@ids/core/ids-theme.css": join(root, "lib/lit/ids/styles/ids-theme.css"),
          "@ids/core": join(root, "lib/lit/ids/src"),
        },
      },
      // Vite 6 + Storybook 8: hashed DocsRenderer chunks in sb-vite/deps go stale
      // (404 for DocsRenderer-*-KO4JAI74.js while a different hash exists). Exclude
      // docs packages from prebundling so the optimizer cannot serve dead hashes.
      optimizeDeps: {
        exclude: [
          "@storybook/addon-docs",
          "@storybook/addon-docs/blocks",
          "@storybook/blocks",
          "@storybook/addon-essentials",
        ],
      },
    });
  },
};

export default config;

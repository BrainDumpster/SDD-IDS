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
      resolve: {
        alias: {
          "@ids/lit/ids-theme.css": join(root, "lib/lit/ids/styles/ids-theme.css"),
          "@ids/lit": join(root, "lib/lit/ids/src"),
        },
      },
    });
  },
};

export default config;

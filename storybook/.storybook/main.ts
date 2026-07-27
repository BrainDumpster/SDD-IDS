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
const reactRoot = path.join(storybookPackageRoot, "node_modules/react");
const reactDomRoot = path.join(storybookPackageRoot, "node_modules/react-dom");

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
          "\n[storybook] New spec-generated story file detected. Reloading Storybook " +
            "(if errors persist, stop and run: pnpm dev:clean)\n",
        );
        server.ws.send({ type: "full-reload" });
      });
    },
  };
}

const config: StorybookConfig = {
  // Absolute globs keep Vite importer keys aligned with the story index (avoids
  // `importers[path] is not a function` for files under repo-root storybook-generated/).
  stories: [
    path.join(storybookPackageRoot, "src/**/*.stories.@(ts|tsx)"),
    path.join(repoRoot, "storybook-generated/*/src/**/*.stories.@(ts|tsx)"),
  ],
  addons: ["@storybook/addon-essentials"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      plugins: [warnOnNewSpecGeneratedStories()],
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
        // Toggle / ToggleGroup pull CJS subpaths from @base-ui-components/utils; prebundle
        // avoids intermittent dev "Missing \".\" specifier" resolution failures (Vite 6).
        include: [
          "react",
          "react-dom",
          "react/jsx-runtime",
          "react/jsx-dev-runtime",
          "@base-ui-components/react/popover",
          "@base-ui-components/react/progress",
          "@base-ui-components/react/toggle-group",
          "@base-ui-components/react/toggle",
          "@base-ui-components/utils/useStableCallback",
          "@base-ui-components/utils/useControlled",
          "@base-ui-components/utils/formatErrorMessage",
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

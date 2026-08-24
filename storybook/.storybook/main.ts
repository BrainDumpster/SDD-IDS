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
const reactRoot = path.join(storybookPackageRoot, "node_modules/react");
const reactDomRoot = path.join(storybookPackageRoot, "node_modules/react-dom");

/**
 * Canonical IDS React stories: `src/components/lib-generated/` → `Components/IDS/...`.
 * Legacy hand ports + overlapping `storybook-generated/ids` entries are omitted so
 * Storybook does not fail indexing on duplicate story IDs (index.json 500).
 * Angular Storybook (port 6007) is a separate app and is unaffected.
 */
const hiddenHandStories = new Set([
  "IdsAccordion.stories.tsx",
  "IdsAnchorMenu.stories.tsx",
  "IdsCheckbox.stories.tsx",
  "IdsDetailPanel.stories.tsx",
  "IdsDropdownComboBox.stories.tsx",
  "IdsDropdownMultiSelect.stories.tsx",
  "IdsDropdownSingleSelect.stories.tsx",
  "IdsGetStarted.stories.tsx",
  "IdsMastheadIntegration.stories.tsx",
  "IdsRadioButton.stories.tsx",
  "IdsTabs.stories.tsx",
  "IdsTag.stories.tsx",
  "IdsTextBox.stories.tsx",
  "IdsTooltip.stories.tsx",
  "IdsWhatsNew.stories.tsx",
  "IdsWizard.stories.tsx",
  "Link.stories.tsx",
  "Slider.stories.tsx",
  "Spinner.stories.tsx",
  "ToggleSwitch.stories.tsx",
]);

const hiddenIdsGeneratedStories = new Set([
  "Accordion.stories.tsx",
  "AppLauncher.stories.tsx",
  "AppShell.stories.tsx",
  "Badge.stories.tsx",
  "Button.stories.tsx",
  "Card.stories.tsx",
  "Checkbox.stories.tsx",
  "Dashboard.stories.tsx",
  "Datagrid.stories.tsx",
  "DatePicker.stories.tsx",
  "DetailPanel.stories.tsx",
  "DropdownButton.stories.tsx",
  "DropdownComboBox.stories.tsx",
  "DropdownMultiselect.stories.tsx",
  "DropdownSingleSelect.stories.tsx",
  "DualListBox.stories.tsx",
  "Footer.stories.tsx",
  "Link.stories.tsx",
  "MainMenuLeft.stories.tsx",
  "Masthead.stories.tsx",
  "Modal.stories.tsx",
  "Pagination.stories.tsx",
  "ProgressBar.stories.tsx",
  "RadioButton.stories.tsx",
  "SegmentedButton.stories.tsx",
  "Slider.stories.tsx",
  "Spinner.stories.tsx",
  "StatusBar.stories.tsx",
  "Tag.stories.tsx",
  "TextBox.stories.tsx",
  "TimePicker.stories.tsx",
  "Toast.stories.tsx",
  "ToggleSwitch.stories.tsx",
  "Tooltip.stories.tsx",
  "Tree.stories.tsx",
  "Wizard.stories.tsx",
]);

function listStoryFiles(dir: string, ignoreBasenames?: Set<string>): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip intentionally disabled / WIP trees.
      if (entry.name.startsWith("_") || entry.name.endsWith("-disabled")) continue;
      out.push(...listStoryFiles(full, ignoreBasenames));
      continue;
    }
    if (!/\.stories\.(ts|tsx)$/.test(entry.name)) continue;
    if (ignoreBasenames?.has(entry.name)) continue;
    out.push(full);
  }
  return out;
}

/** Explicit file list — negation globs with absolute paths are ignored by Storybook's indexer. */
const storyFiles = [
  ...listStoryFiles(path.join(storybookPackageRoot, "src"), hiddenHandStories),
  ...listStoryFiles(
    path.join(repoRoot, "storybook-generated/ids/src"),
    hiddenIdsGeneratedStories,
  ),
  ...listStoryFiles(path.join(repoRoot, "storybook-generated/dap/src")),
  ...listStoryFiles(path.join(repoRoot, "storybook-generated/synapse/src")),
];

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
            "(if errors persist, stop and run: npm run dev:clean)\n",
        );
        server.ws.send({ type: "full-reload" });
      });
    },
  };
}

const config: StorybookConfig = {
  // Absolute paths keep Vite importer keys aligned with the story index (avoids
  // `importers[path] is not a function` for files under repo-root storybook-generated/).
  stories: storyFiles,
  addons: ["@storybook/addon-essentials"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  // Shared icons / images for Foundations + runtime `/assets` (same as Angular staticDirs).
  staticDirs: [
    { from: path.join(repoRoot, "assets"), to: "/assets" },
  ],
  // Avoid babel react-docgen parsing `@types/*.d.ts` (ambient `const x: T` has no initializer).
  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      plugins: [warnOnNewSpecGeneratedStories()],
      // `lib/` lives outside the storybook package root; force automatic JSX
      // so components there do not need a classic `React` global.
      esbuild: {
        jsx: "automatic",
      },
      resolve: {
        dedupe: ["react", "react-dom", "@base-ui-components/utils"],
        alias: {
          "@component-contracts": path.join(repoRoot, "component-contracts"),
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
          "@base-ui-components/react/accordion",
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

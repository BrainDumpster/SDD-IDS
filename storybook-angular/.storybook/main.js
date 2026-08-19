const path = require("node:path");
const { AngularWebpackPlugin } = require("@ngtools/webpack");

const storybookPackageRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(storybookPackageRoot, "..");
const compiledRoot = path.join(storybookPackageRoot, "compiled");

/** Runs after Storybook merges Angular CLI plugins (webpackFinal is too early for jitMode). */
class PatchAngularAotPlugin {
  apply(compiler) {
    compiler.hooks.afterPlugins.tap("PatchAngularAotPlugin", () => {
      for (const plugin of compiler.options.plugins ?? []) {
        if (plugin instanceof AngularWebpackPlugin) {
          plugin.pluginOptions.jitMode = false;
        }
      }
    });
  }
}

function patchNgtoolsExclude(rules, excludePath) {
  if (!Array.isArray(rules)) return;

  for (const rule of rules) {
    if (!rule || typeof rule !== "object") continue;

    const uses = Array.isArray(rule.use)
      ? rule.use
      : rule.use
        ? [rule.use]
        : [];
    const loader = rule.loader ?? uses.find((u) => u?.loader)?.loader;

    if (loader && String(loader).includes("@ngtools/webpack")) {
      const existing = rule.exclude;
      rule.exclude = existing
        ? Array.isArray(existing)
          ? [...existing, excludePath]
          : [existing, excludePath]
        : excludePath;
    }

    if (rule.oneOf) patchNgtoolsExclude(rule.oneOf, excludePath);
    if (rule.rules) patchNgtoolsExclude(rule.rules, excludePath);
  }
}

/** @type {import("@storybook/angular").StorybookConfig} */
const config = {
  stories: [path.join(storybookPackageRoot, "src/**/*.stories.@(js|ts|mdx)")],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: {
    name: "@storybook/angular",
    options: {},
  },
  staticDirs: [
    { from: path.join(repoRoot, "assets"), to: "/assets" },
    { from: path.join(repoRoot, "components"), to: "/components" },
  ],
  webpackFinal: async (config) => {
    config.resolve = config.resolve ?? {};
    config.resolve.extensions = Array.from(
      new Set([".js", ".mjs", ".jsx", ...(config.resolve.extensions ?? [".ts", ".tsx"])]),
    );
    config.resolve.alias = {
      ...config.resolve.alias,
      "@component-contracts/ids/accordion.contract": path.join(
        compiledRoot,
        "component-contracts/ids/accordion.contract.js",
      ),
      "@component-contracts/ids/button.contract": path.join(
        compiledRoot,
        "component-contracts/ids/button.contract.js",
      ),
      "@component-contracts/ids/badge.contract": path.join(
        compiledRoot,
        "component-contracts/ids/badge.contract.js",
      ),
      "@component-contracts/ids/alert.contract": path.join(
        compiledRoot,
        "component-contracts/ids/alert.contract.js",
      ),
      "@component-contracts/ids/checkbox.contract": path.join(
        compiledRoot,
        "component-contracts/ids/checkbox.contract.js",
      ),
      "@component-contracts/ids/radio-button.contract": path.join(
        compiledRoot,
        "component-contracts/ids/radio-button.contract.js",
      ),
      "@component-contracts/ids/modal.contract": path.join(
        compiledRoot,
        "component-contracts/ids/modal.contract.js",
      ),
      "@component-contracts/ids/masthead.contract": path.join(
        compiledRoot,
        "component-contracts/ids/masthead.contract.js",
      ),
      "@component-contracts/ids/anchor-menu.contract": path.join(
        compiledRoot,
        "component-contracts/ids/anchor-menu.contract.js",
      ),
      "@component-contracts/ids/toggle-switch.contract": path.join(
        compiledRoot,
        "component-contracts/ids/toggle-switch.contract.js",
      ),
      "@component-contracts/ids/toast.contract": path.join(
        compiledRoot,
        "component-contracts/ids/toast.contract.js",
      ),
      "@component-contracts/ids/wizard.contract": path.join(
        compiledRoot,
        "component-contracts/ids/wizard.contract.js",
      ),
      "@component-contracts": path.join(compiledRoot, "component-contracts"),
    };

    config.module = config.module ?? {};
    config.module.rules = config.module.rules ?? [];

    patchNgtoolsExclude(config.module.rules, compiledRoot);
    patchNgtoolsExclude(config.module.rules, path.join(repoRoot, "component-contracts"));
    patchNgtoolsExclude(config.module.rules, path.join(repoRoot, "lib"));

    config.plugins = config.plugins ?? [];
    config.plugins.push(new PatchAngularAotPlugin());

    return config;
  },
};

module.exports = config;

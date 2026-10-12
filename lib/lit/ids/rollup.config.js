/**
 * Rollup build for `@ids/lit` (`lib/lit/ids`) — mirrors edf-core's ESM approach
 * (simplified: no scss?inline / istanbul).
 *
 * @see edf-core packages/core/rollup.config.js
 */
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

const prod = !process.env.ROLLUP_WATCH;

/** @type {import('rollup').RollupOptions} */
export default {
  input: {
    index: "src/index.ts",
    "accordion/index": "src/accordion/index.ts",
    "accordion/register": "src/accordion/register.ts",
    "icon/index": "src/icon/index.ts",
    "icon/register": "src/icon/register.ts",
    "theme/index": "src/theme/index.ts",
    "assets/index": "src/assets/index.ts",
    "progress-bar/index": "src/progress-bar/index.ts",
    "progress-bar/register": "src/progress-bar/register.ts",
    "button/index": "src/button/index.ts",
    "button/register": "src/button/register.ts",
    "checkbox/index": "src/checkbox/index.ts",
    "checkbox/register": "src/checkbox/register.ts",
    "radio-button/index": "src/radio-button/index.ts",
    "radio-button/register": "src/radio-button/register.ts",
  },
  external: [/^lit($|\/)/, /^@lit\//, /^tslib/],
  output: {
    dir: "dist",
    format: "esm",
    sourcemap: !prod,
    preserveModules: false,
    entryFileNames: "[name].js",
  },
  watch: {
    clearScreen: false,
    include: "src/**",
    exclude: ["node_modules/**", "dist/**"],
  },
  plugins: [
    resolve(),
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: true,
      declarationDir: "dist",
      rootDir: "src",
    }),
  ],
};

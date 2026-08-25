import React from "react";
import type { Preview } from "@storybook/react";
import "../../components/ids-theme.css";
import "../../components/dap-theme.css";
import "../../components/synapse-theme.css";
import "../../components/ids-foundations-docs.css";

/**
 * Shared sidebar roots live in `storybook-shared/sidebar.js`.
 * Keep this `order` in sync — Storybook's indexer requires a plain serializable
 * `storySort.order` (function closures / imported bindings break index.json).
 */
const preview: Preview = {
  initialGlobals: {
    theme: "light",
  },
  parameters: {
    // Let html/body use design-system tokens; the backgrounds addon used fixed hex
    // values that did not follow the Theme toolbar or IDS / DAP / Synapse variable sets.
    backgrounds: { disable: true },
    docs: {
      autodocs: "tag",
    },
    options: {
      storySort: {
        order: [
          "Foundations",
          [
            "Icons",
            "Design tokens",
            ["Overview", "Modes", "Primitives", "Semantic", "Components"],
          ],
          "Components",
          [
            "IDS",
            [
              "About",
              "Accordion",
              "Alert",
              ["Overview", "Global Alert", "Inline Alert"],
              "Anchor Menu",
              "App Launcher",
              "App Shell",
              "Badge",
              "Breadcrumb",
              "Button",
              "Card",
              "Checkbox",
              "Dashboard",
              "Datagrid",
              "Date Picker",
              "Detail Panel",
              "Dropdown",
              ["Combo Box", "Multi Select", "Single Select"],
              "Dropdown Button",
              "Dual List Box",
              "Footer",
              "Get Started",
              "Global Search",
              "Link",
              "Main Menu Left",
              "Main Menu Top",
              "Masthead",
              "Modal",
              ["Dialog"],
              "Page Error",
              "Pagination",
              "Progress Bar",
              "Radio Button",
              "Scroll Bar",
              "Segmented Button",
              "Skeleton Loader",
              "Slider",
              "Spinner",
              "Status Bar",
              "Tab",
              "Tag",
              "Text Box",
              "Time Picker",
              "Toast",
              "Toggle Switch",
              "Tooltip",
              "Tree",
              "Whats New",
              "Wizard",
              "Wizard Inline",
              "Wizard Modal",
            ],
            "DAP",
            "Synapse",
          ],
        ],
      },
    },
  },
  globalTypes: {
    theme: {
      description: "Theme mode",
      defaultValue: "light",
      toolbar: {
        title: "Theme",
        icon: "mirror",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
        showName: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || "light";
      const resolvedTheme = theme === "dark" ? "dark" : "light";
      const title = context.title || "";
      const upperTitle = title.toUpperCase();
      // Legacy folders (IDS/, DAP/), Components (IDS + DAP), Synapse defaults.
      const designSystem =
        upperTitle.includes("/DAP/") || upperTitle.startsWith("DAP/")
          ? "dap"
          : upperTitle.includes("/SYNAPSE/") || upperTitle.startsWith("SYNAPSE/")
            ? "synapse"
            : "ids";
      document.documentElement.setAttribute("data-theme", resolvedTheme);
      document.body.setAttribute("data-theme", resolvedTheme);
      document.documentElement.setAttribute("data-design-system", designSystem);
      document.body.setAttribute("data-design-system", designSystem);

      const surface = "var(--color-background-surface-1)";
      document.documentElement.style.backgroundColor = surface;
      document.body.style.backgroundColor = surface;
      return <Story />;
    },
  ],
};

export default preview;

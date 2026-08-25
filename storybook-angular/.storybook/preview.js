import "zone.js";
import {
  IDS_THEME_STYLESHEETS,
  idsComponentsUrl,
} from "../../lib/shared/ids-assets-base.js";

/**
 * Shared sidebar roots live in `storybook-shared/sidebar.js`.
 * Keep this `order` in sync — Storybook's indexer requires a plain serializable
 * `storySort.order` (function closures / imported bindings break index.json).
 */

function ensureThemeStylesheets() {
  for (const file of IDS_THEME_STYLESHEETS) {
    const href = idsComponentsUrl(file);
    if (document.querySelector(`link[data-ids-theme="${file}"]`)) {
      continue;
    }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.setAttribute("data-ids-theme", file);
    document.head.appendChild(link);
  }
}

/** @type {import("@storybook/angular").Preview} */
const preview = {
  initialGlobals: {
    theme: "light",
  },
  parameters: {
    backgrounds: { disable: true },
    docs: {
      autodocs: "tag",
    },
    options: {
      storySort: {
        order: [
          "Getting Started",
          ["Installation"],
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
              "Avatar",
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
              ["Angular Composition"],
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
      },
    },
  },
  decorators: [
    (storyFn, context) => {
      ensureThemeStylesheets();

      const theme = context.globals["theme"] || "light";
      const resolvedTheme = theme === "dark" ? "dark" : "light";
      const title = context.title || "";
      const upperTitle = title.toUpperCase();
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
      return storyFn();
    },
  ],
};

export default preview;

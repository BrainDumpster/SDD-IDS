import "zone.js";

const THEME_STYLESHEETS = [
  "/components/ids-theme.css",
  "/components/dap-theme.css",
  "/components/synapse-theme.css",
];

function ensureThemeStylesheets() {
  for (const href of THEME_STYLESHEETS) {
    if (document.querySelector(`link[data-ids-theme="${href}"]`)) {
      continue;
    }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.setAttribute("data-ids-theme", href);
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
      storySort: (a, b) => {
        const titleFrom = (entry) => {
          if (Array.isArray(entry)) {
            const [, meta] = entry;
            return (meta && meta.title) || entry[0] || "";
          }
          const obj = entry || {};
          return obj.title || obj.id || "";
        };

        const titleA = titleFrom(a);
        const titleB = titleFrom(b);
        const partsA = titleA.split("/");
        const partsB = titleB.split("/");

        const rootOrder = ["Spec Generated"];
        const rootA = rootOrder.indexOf(partsA[0] ?? "");
        const rootB = rootOrder.indexOf(partsB[0] ?? "");

        if (rootA !== rootB) {
          if (rootA === -1) return 1;
          if (rootB === -1) return -1;
          return rootA - rootB;
        }

        if (partsA[0] === "Spec Generated" && partsB[0] === "Spec Generated") {
          const specGroupOrder = ["IDS", "DAP", "Synapse"];
          const groupA = specGroupOrder.indexOf(partsA[1] ?? "");
          const groupB = specGroupOrder.indexOf(partsB[1] ?? "");
          if (groupA !== groupB) {
            if (groupA === -1) return 1;
            if (groupB === -1) return -1;
            return groupA - groupB;
          }
        }

        const maxLen = Math.max(partsA.length, partsB.length);
        for (let i = 0; i < maxLen; i++) {
          const segA = partsA[i] ?? "";
          const segB = partsB[i] ?? "";
          if (segA === segB) continue;
          if (!segA) return -1;
          if (!segB) return 1;
          return segA.localeCompare(segB, undefined, { sensitivity: "base" });
        }
        return 0;
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

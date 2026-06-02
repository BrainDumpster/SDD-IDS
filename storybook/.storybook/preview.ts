import type { Preview } from "@storybook/react";
import "../../components/ids-theme.css";
import "../../components/dap-theme.css";
import "../src/synapse-theme.css";

const preview: Preview = {
  initialGlobals: {
    theme: "light",
  },
  parameters: {
    // Let html/body use design-system tokens; the backgrounds addon used fixed hex
    // values that did not follow the Theme toolbar or IDS / DAP / Synapse variable sets.
    backgrounds: { disable: true },
    options: {
      storySort: (a, b) => {
        const titleFrom = (entry) => {
          // Storybook v8 passes index entries; older versions may pass tuple-style items.
          if (Array.isArray(entry)) {
            const [id, meta] = entry;
            return (meta && meta.title) || id || "";
          }
          const obj = entry || {};
          return obj.title || obj.id || "";
        };

        const titleA = titleFrom(a);
        const titleB = titleFrom(b);

        const partsA = titleA.split("/");
        const partsB = titleB.split("/");

        const rootOrder = ["Synapse", "Spec Generated"];
        const rootA = rootOrder.indexOf(partsA[0] ?? "");
        const rootB = rootOrder.indexOf(partsB[0] ?? "");

        if (rootA !== rootB) {
          if (rootA === -1) return 1;
          if (rootB === -1) return -1;
          return rootA - rootB;
        }

        if (partsA[0] === "Spec Generated" && partsB[0] === "Spec Generated") {
          const specGroupOrder = ["IDS", "DAP"];
          const groupA = specGroupOrder.indexOf(partsA[1] ?? "");
          const groupB = specGroupOrder.indexOf(partsB[1] ?? "");
          if (groupA !== groupB) {
            if (groupA === -1) return 1;
            if (groupB === -1) return -1;
            return groupA - groupB;
          }
        }

        return titleA.localeCompare(titleB, undefined, { sensitivity: "base" });
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
      // Legacy folders (IDS/, DAP/), Spec Generated (IDS + DAP), Synapse defaults.
      const designSystem =
        upperTitle.includes("/DAP/") || upperTitle.startsWith("DAP/")
          ? "dap"
          : upperTitle.includes("/IDS/") || upperTitle.startsWith("IDS/")
            ? "ids"
            : "synapse";
      document.documentElement.setAttribute("data-theme", resolvedTheme);
      document.body.setAttribute("data-theme", resolvedTheme);
      document.documentElement.setAttribute("data-design-system", designSystem);
      document.body.setAttribute("data-design-system", designSystem);

      const surface = "var(--color-background-surface-1)";
      document.documentElement.style.backgroundColor = surface;
      document.body.style.backgroundColor = surface;
      return Story();
    },
  ],
};

export default preview;

import type { Preview } from "@storybook/react";
import "../src/synapse-theme.css";
import "../../components/ids-ai-theme.css";
import "../../components/ids-theme.css";
import "../../components/dap-theme.css";

const preview: Preview = {
  initialGlobals: {
    theme: "light",
  },
  parameters: {
    // Let html/body use design-system tokens; the backgrounds addon used fixed hex
    // values that did not follow the Theme toolbar or IDS / IDS-AI / DAP variable sets.
    backgrounds: { disable: true },
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
      // Support legacy folders (IDS/, DAP/), IDS-AI (must run before IDS substring checks),
      // and generated folders (Spec Generated/IDS/*, Spec Generated/DAP/*).
      const designSystem =
        upperTitle.includes("/DAP/") || upperTitle.startsWith("DAP/")
          ? "dap"
          : upperTitle.includes("IDS-AI")
            ? "ids-ai"
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

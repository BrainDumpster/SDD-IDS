import type { Preview } from "@storybook/react";
import "../src/synapse-theme.css";
import "../src/ids-theme.css";
import "../../components/dap-theme.css";

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#f4f4f4" },
        { name: "dark", value: "#111619" },
      ],
    },
  },
  globalTypes: {
    theme: {
      description: "Synapse theme",
      toolbar: {
        title: "Theme",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || "light";
      const resolvedTheme = theme === "dark" ? "dark" : "light";
      const title = context.title || "";
      const isDapStory = title.startsWith("IDS/DAP/");
      const designSystem = isDapStory
        ? "dap"
        : title.startsWith("IDS/")
          ? "ids"
          : "synapse";
      document.documentElement.setAttribute("data-theme", resolvedTheme);
      document.body.setAttribute("data-theme", resolvedTheme);
      document.documentElement.setAttribute("data-design-system", designSystem);
      document.body.setAttribute("data-design-system", designSystem);

      document.body.style.backgroundColor = "var(--color-background-surface-1)";
      return Story();
    },
  ],
};

export default preview;

import type { Preview } from "@storybook/react";
import "../src/synapse-theme.css";

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
      document.documentElement.setAttribute("data-theme", resolvedTheme);
      document.body.setAttribute("data-theme", resolvedTheme);

      document.body.style.backgroundColor = "var(--color-background-surface-1)";
      return Story();
    },
  ],
};

export default preview;

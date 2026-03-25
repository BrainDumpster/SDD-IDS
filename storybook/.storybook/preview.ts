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
      document.documentElement.setAttribute(
        "data-theme",
        theme === "dark" ? "dark" : ""
      );
      return Story();
    },
  ],
};

export default preview;

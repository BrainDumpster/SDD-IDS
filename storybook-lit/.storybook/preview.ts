import type { Preview } from "@storybook/web-components";
import {
  applyIdsTheme,
  ensureIdsThemeStylesheet,
  resolveIdsThemeMode,
} from "@ids/lit/theme/index.js";

/**
 * Global theme stylesheet — single source: `components/ids-theme.css`
 * (also exported as `@ids/lit/ids-theme.css` for app bundlers).
 *
 * Do not import theme CSS inside individual Lit components; tokens inherit
 * into shadow roots via CSS variables once host attributes are set.
 */
import "@ids/lit/ids-theme.css";

const preview: Preview = {
  initialGlobals: {
    theme: "light",
  },
  parameters: {
    backgrounds: { disable: true },
    docs: {
      autodocs: "tag",
    },
  },
  globalTypes: {
    theme: {
      description: "IDS theme mode (drives data-theme on html/body)",
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
    (story, context) => {
      // Runtime fallback when CSS is served from Storybook staticDirs
      ensureIdsThemeStylesheet("/components/ids-theme.css");

      const theme = resolveIdsThemeMode(context.globals.theme);
      applyIdsTheme({
        theme,
        designSystem: "ids",
      });

      return story();
    },
  ],
};

export default preview;

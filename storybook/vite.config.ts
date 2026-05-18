import { defineConfig } from "vite";

// Keep this minimal: `@storybook/react-vite` already registers `@vitejs/plugin-react`.
// Registering `react()` here as well merges duplicate React plugins and can cause
// unstable transforms in dev (sometimes surfacing as preview / story-index issues).
export default defineConfig({});

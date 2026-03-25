"""
Base UI (@base-ui-components/react) framework adapter.
Generates React components using Base UI compound component patterns.
"""

from generation.framework_adapters.base_adapter import FrameworkAdapter


class BaseUIAdapter(FrameworkAdapter):
    """Adapter for React + Base UI component generation."""

    def get_import_rules(self) -> str:
        return """
BASE UI IMPORT RULES:

• Import from `@base-ui-components/react/<component>` (e.g., `@base-ui-components/react/select`)
• Each Base UI component is imported from its own sub-path
• Do NOT import from `@mui/base`, `@radix-ui`, `@headlessui`, or other UI libraries
• Import React and Base UI components at the top of the file
• Use named imports for compound component parts (e.g., `import { Select } from '@base-ui-components/react/select'`)
"""

    def get_component_structure(self) -> str:
        return """
BASE UI COMPONENT STRUCTURE:

• Use Base UI compound component pattern: Root > Parts
  Example: Select.Root > Select.Trigger + Select.Positioner > Select.Popup > Select.Option
• Never flatten compound components into prop-based APIs
• Use React.forwardRef when the component needs ref forwarding
• Use TypeScript interfaces for all props
• Implement controlled and uncontrolled patterns where applicable
• Use `render` prop for custom element rendering when needed
• Compose multiple Base UI primitives for complex components

COMPOUND COMPONENT PATTERNS:

Simple (1:1 mapping):
  <Button>Click me</Button>

Compound (Root + Parts):
  <Select.Root>
    <Select.Trigger>
      <Select.Value />
    </Select.Trigger>
    <Select.Positioner>
      <Select.Popup>
        <Select.Option value="a">Option A</Select.Option>
      </Select.Popup>
    </Select.Positioner>
  </Select.Root>

Composition (multiple Base UI components):
  <Dialog.Root>
    <Dialog.Backdrop />
    <Dialog.Popup>
      <Field.Root>
        <Field.Label>Name</Field.Label>
        <Input />
      </Field.Root>
    </Dialog.Popup>
  </Dialog.Root>
"""

    def get_styling_rules(self) -> str:
        return """
BASE UI STYLING RULES:

• Use CSS Modules for component-scoped styles
• Use `data-*` attribute selectors for state-based styling:
    [data-checked] { ... }
    [data-selected] { ... }
    [data-open] { ... }
    [data-disabled] { ... }
    [data-highlighted] { ... }
    [data-invalid] { ... }
• Use `className` callback for dynamic class names:
    className={(state) => clsx(styles.trigger, state.open && styles.open)}
• All colors, spacing, and other values MUST use Synapse CSS custom properties
• NEVER hardcode hex, rgb, or pixel values
• Use Synapse elevation tokens for shadows (--shadow-drop-shadow-*)
• Use Synapse spacing tokens for all padding/margin (--spacing-space-*)
• Use Synapse radius tokens for border-radius (--corner-radius-radius-*)
• Light/dark theme support comes from CSS custom properties (no JS theme switching)
"""

    def get_output_structure(self) -> str:
        return """
OUTPUT STRUCTURE:

=== COMPONENT ===
React TypeScript component using Base UI compound components:
- Imports from @base-ui-components/react
- TypeScript interfaces for props
- Compound component composition
- className callbacks for state-aware styling
- Accessibility built-in via Base UI
- Export statement

=== CSS ===
CSS Module with:
- Synapse design token usage (CSS custom properties)
- data-* attribute selectors for state styling
- Component-scoped class names
- Light/dark theme via CSS variables (no theme-specific selectors needed)
- Responsive design with Synapse breakpoints
"""

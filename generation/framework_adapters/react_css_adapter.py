"""
React CSS Modules / CSS-in-JS adapter.
Extracted from existing prompt_templates.py logic for backward compatibility.
"""

from generation.framework_adapters.base_adapter import FrameworkAdapter
from generation.style_modes import StyleMode


class ReactCSSAdapter(FrameworkAdapter):
    """Adapter for React + CSS Modules or CSS-in-JS."""

    def __init__(self, style_mode: StyleMode = StyleMode.CSS_MODULE):
        self.style_mode = style_mode

    def get_import_rules(self) -> str:
        if self.style_mode == StyleMode.CSS_IN_JS:
            return """
REACT CSS-IN-JS IMPORT RULES:
• Import styled-components or emotion
• Import React and hooks
• Keep component and styles in a single file
"""
        return """
REACT CSS MODULE IMPORT RULES:
• Import the CSS Module: import styles from './Component.module.css'
• Import React and hooks
• Use className={styles.className} binding
"""

    def get_component_structure(self) -> str:
        return """
REACT COMPONENT STRUCTURE:
• Use functional components with hooks
• Use TypeScript interfaces for props
• Implement controlled components for form elements
• Use React.forwardRef for ref forwarding
• Follow React best practices for composition
"""

    def get_styling_rules(self) -> str:
        if self.style_mode == StyleMode.CSS_IN_JS:
            return """
CSS-IN-JS STYLING:
• Use styled-components tagged template literals
• Use CSS custom properties for all design tokens
• Implement prop-based conditional styling
• Keep styles collocated with the component
"""
        return """
CSS MODULE STYLING:
• Use modular, descriptive class names
• NO global selectors or element selectors
• Use CSS custom properties for all design tokens
• Avoid cascading side effects
"""

    def get_output_structure(self) -> str:
        if self.style_mode == StyleMode.CSS_IN_JS:
            return """
OUTPUT STRUCTURE:

=== COMPONENT ===
Complete React component with styled-components

=== STORYBOOK ===
Storybook CSF stories file
"""
        return """
OUTPUT STRUCTURE:

=== COMPONENT ===
React functional component with CSS Modules

=== CSS ===
CSS Module stylesheet

=== STORYBOOK ===
Storybook CSF stories file
"""

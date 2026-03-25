"""
Angular SCSS adapter.
Extracted from existing prompt_templates.py logic for backward compatibility.
"""

from generation.framework_adapters.base_adapter import FrameworkAdapter


class AngularAdapter(FrameworkAdapter):
    """Adapter for Angular + SCSS component generation."""

    def get_import_rules(self) -> str:
        return """
ANGULAR IMPORT RULES:
• Use @Component decorator with proper metadata
• Import from @angular/core, @angular/forms as needed
• Use Angular dependency injection for services
"""

    def get_component_structure(self) -> str:
        return """
ANGULAR COMPONENT STRUCTURE:
• Include @Component decorator
• Use templateUrl and styleUrls
• Implement Input/Output properties
• Use Angular lifecycle hooks
• Use ReactiveForms for form elements
• Follow Angular style guide
"""

    def get_styling_rules(self) -> str:
        return """
ANGULAR SCSS STYLING:
• SCSS must be component-scoped using ViewEncapsulation
• Use :host selector for root styles
• Use BEM-like naming for child elements
• Use CSS custom properties for design tokens
• NO global CSS or style bleeding
"""

    def get_output_structure(self) -> str:
        return """
OUTPUT STRUCTURE:

=== COMPONENT_TS ===
Angular TypeScript component

=== COMPONENT_HTML ===
Angular HTML template

=== COMPONENT_SCSS ===
Angular SCSS stylesheet
"""

"""
Figma-Enhanced Prompt Templates
Enhanced prompt templates that leverage Figma specifications for better code generation
"""

from typing import Dict, Any, List
from generation.style_modes import StyleMode
from tokens.figma_spec_extractor import ComponentSpec


class FigmaEnhancedPrompts:
    """
    Enhanced prompt templates that integrate Figma specifications
    """
    
    @staticmethod
    def build_figma_aware_prompt(
        framework: str,
        style_mode: StyleMode,
        figma_spec: ComponentSpec,
        additional_context: Dict[str, Any] = None
    ) -> str:
        """
        Build enhanced prompt that incorporates Figma specifications
        
        Args:
            framework: Target framework (React, Angular)
            style_mode: Styling approach
            figma_spec: Component specification from Figma
            additional_context: Additional context from documentation
            
        Returns:
            Enhanced prompt string
        """
        
        base_rules = FigmaEnhancedPrompts._get_base_rules()
        framework_rules = FigmaEnhancedPrompts._get_framework_rules(framework, style_mode)
        figma_context = FigmaEnhancedPrompts._build_figma_context(figma_spec)
        
        prompt = f"""
{base_rules}

{framework_rules}

## FIGMA SPECIFICATIONS - MUST FOLLOW EXACTLY

{figma_context}

## ADDITIONAL CONTEXT

{additional_context.get('documentation', '') if additional_context else ''}

## GENERATION REQUIREMENTS

CRITICAL REQUIREMENTS:
1. Follow Figma specifications EXACTLY - pixel perfect implementation required
2. Use ONLY design tokens from the Figma specification
3. Implement ALL states mentioned in the Figma spec
4. Match the exact anatomy structure from Figma
5. Use exact measurements, spacing, and typography from Figma
6. Ensure responsive behavior based on Figma constraints
7. Implement accessibility features as per design system standards

QUALITY STANDARDS:
- Production-ready, clean, maintainable code
- Component-scoped styles only
- Semantic HTML structure
- Proper TypeScript types (if applicable)
- Comprehensive state handling
- Error boundaries and validation
- Performance optimized

TOKEN USAGE:
- All colors MUST use CSS variables from Figma tokens
- All spacing MUST match Figma measurements
- All typography MUST use Figma font specifications
- NO hardcoded values allowed

{FigmaEnhancedPrompts._get_output_structure(framework, style_mode)}

Generate the component now:
"""
        
        return prompt
    
    @staticmethod
    def _get_base_rules() -> str:
        """Get base generation rules"""
        return """
You are a senior UI engineer working inside a strict Design System with Figma integration.

STRICT REQUIREMENTS:

• Generate production-ready, pixel-perfect code based on Figma specifications
• Follow Design System rules and Figma measurements EXACTLY
• Use ONLY approved design tokens via CSS variables from Figma
• NEVER hardcode colors, spacing, font sizes, or measurements
• Follow accessibility best practices (WCAG AA compliance)
• Use semantic HTML5 elements
• Ensure responsive behavior matching Figma constraints
• Keep styles component-scoped
• Output must be clean, maintainable, and well-documented
• Do NOT include explanations in the output
• Implement ALL states and variations from Figma
"""
    
    @staticmethod
    def _get_framework_rules(framework: str, style_mode: StyleMode) -> str:
        """Get framework-specific rules"""

        if style_mode == StyleMode.BASE_UI_CSS:
            return FigmaEnhancedPrompts._get_base_ui_rules()
        if framework.lower() == "react":
            return FigmaEnhancedPrompts._get_react_rules(style_mode)
        elif framework.lower() == "angular":
            return FigmaEnhancedPrompts._get_angular_rules(style_mode)
        else:
            return FigmaEnhancedPrompts._get_generic_rules()

    @staticmethod
    def _get_base_ui_rules() -> str:
        """Get Base UI (Synapse) framework rules"""
        return """
BASE UI + SYNAPSE FRAMEWORK REQUIREMENTS:

• Import from `@base-ui-components/react/<component>` (individual sub-paths)
• Use compound component pattern: Root > Parts
  Example: Select.Root > Select.Trigger > Select.Positioner > Select.Popup > Select.Option
• Use `data-*` attribute selectors for state-based styling
• Use `className` callbacks for dynamic class names
• All styling via CSS Modules with Synapse CSS custom properties
• Do NOT import from @mui/material, @radix-ui, @headlessui, or other UI libraries

CSS MODULE + BASE UI SPECIFIC:
• Generate separate CSS Module file
• Use className={styles.className} for static classes
• Use className={(state) => ...} for state-aware classes
• Style states via [data-checked], [data-open], [data-disabled], etc.
• All colors, spacing, radius MUST use Synapse design tokens
• NO hardcoded hex, rgb, or pixel values
"""
    
    @staticmethod
    def _get_react_rules(style_mode: StyleMode) -> str:
        """Get React-specific rules"""
        base_react = """
REACT FRAMEWORK REQUIREMENTS:

• Use functional components with React hooks
• Implement TypeScript interfaces for props
• Use proper event handlers and state management
• Implement controlled components for form elements
• Use React.forwardRef for components needing ref access
• Implement proper key props for lists
• Use React.memo for performance optimization
• Implement proper error boundaries
• Follow React best practices and patterns
"""
        
        if style_mode == StyleMode.CSS_MODULE:
            return base_react + """
CSS MODULES SPECIFIC:
• Generate separate CSS Module file
• Use className={styles.className} binding
• Use modular, descriptive class names
• NO global selectors or element selectors
• Avoid cascading side effects
• Use CSS custom properties for theming
"""
        
        elif style_mode == StyleMode.CSS_IN_JS:
            return base_react + """
CSS-IN-JS (STYLED-COMPONENTS) SPECIFIC:
• Use styled-components library
• Encapsulate all styles in the component file
• Use tagged template literals for styling
• Keep component and styles together
• Use theme provider for design tokens
• Implement proper prop-based styling
"""
        
        return base_react
    
    @staticmethod
    def _get_angular_rules(style_mode: StyleMode) -> str:
        """Get Angular-specific rules"""
        return """
ANGULAR FRAMEWORK REQUIREMENTS:

• Generate Angular component with proper TypeScript
• Use @Component decorator with proper metadata
• Implement proper Input/Output properties
• Use Angular services for business logic
• Implement proper change detection strategies
• Use Angular forms (ReactiveForms preferred)
• Implement proper Angular lifecycle hooks
• Use Angular dependency injection
• Follow Angular style guide and best practices
• Generate separate HTML, TypeScript, and SCSS files
• Use :host selector for root component styles
• Use Angular Material patterns where applicable
• Implement proper Angular testing structure

ANGULAR SCSS SPECIFIC:
• SCSS must be component-scoped using ViewEncapsulation
• Use BEM-like naming for child elements
• Use SCSS variables and mixins for design tokens
• NO global CSS or style bleeding
• Use proper SCSS nesting and structure
"""
    
    @staticmethod
    def _get_generic_rules() -> str:
        """Get generic framework rules"""
        return """
FRAMEWORK REQUIREMENTS:

• Follow the target framework's best practices
• Implement proper component architecture
• Use framework-specific state management
• Implement proper event handling
• Follow framework-specific styling patterns
• Ensure framework-specific optimization
"""
    
    @staticmethod
    def _build_figma_context(figma_spec: ComponentSpec) -> str:
        """Build Figma-specific context for the prompt"""
        
        context = f"""
COMPONENT: {figma_spec.name}
CATEGORY: {figma_spec.category}
FIGMA SOURCE: {figma_spec.figma_url}

## EXACT FIGMA MEASUREMENTS

"""
        
        # Layout information
        if figma_spec.width and figma_spec.height:
            context += f"DIMENSIONS: {figma_spec.width}x{figma_spec.height}px\n"
        
        if figma_spec.padding:
            padding = figma_spec.padding
            context += f"PADDING: Top:{padding.get('top', 0)}px Right:{padding.get('right', 0)}px Bottom:{padding.get('bottom', 0)}px Left:{padding.get('left', 0)}px\n"
        
        if figma_spec.border_radius:
            context += f"BORDER RADIUS: {figma_spec.border_radius}px\n"
        
        context += "\n## EXACT FIGMA TYPOGRAPHY\n"
        
        # Typography information
        if figma_spec.font_family:
            context += f"FONT FAMILY: {figma_spec.font_family}\n"
        
        if figma_spec.font_size:
            context += f"FONT SIZE: {figma_spec.font_size}px\n"
        
        if figma_spec.font_weight:
            context += f"FONT WEIGHT: {figma_spec.font_weight}\n"
        
        if figma_spec.line_height:
            context += f"LINE HEIGHT: {figma_spec.line_height}\n"
        
        context += "\n## EXACT FIGMA COLORS\n"
        
        # Color information
        if figma_spec.background_color:
            context += f"BACKGROUND COLOR: {figma_spec.background_color}\n"
        
        if figma_spec.text_color:
            context += f"TEXT COLOR: {figma_spec.text_color}\n"
        
        if figma_spec.border_color:
            context += f"BORDER COLOR: {figma_spec.border_color}\n"
        
        context += "\n## COMPONENT ANATOMY\n"
        
        # Anatomy information
        if figma_spec.anatomy:
            for part in figma_spec.anatomy:
                context += f"- {part['name']}: {part['type']}\n"
                if 'properties' in part and part['properties']:
                    for prop, value in part['properties'].items():
                        context += f"  - {prop}: {value}\n"
        
        context += "\n## REQUIRED STATES\n"
        
        # States information
        if figma_spec.states:
            for state in figma_spec.states:
                context += f"- {state['name']}: {state['type']}\n"
        
        context += "\n## DESIGN TOKENS\n"
        
        # Design tokens
        if figma_spec.design_tokens:
            for token in figma_spec.design_tokens:
                context += f"- {token['name']}: {token['value']} ({token.get('type', 'unknown')})\n"
        
        context += f"""
## USAGE GUIDELINES

{figma_spec.usage_guidelines or 'Follow design system guidelines for proper implementation.'}

## IMPLEMENTATION NOTES

- Match EXACT measurements from Figma specifications
- Use design tokens for all styling properties
- Implement ALL states listed above
- Follow the anatomy structure exactly
- Ensure pixel-perfect implementation
- Test across different viewport sizes
- Validate accessibility compliance
"""
        
        return context
    
    @staticmethod
    def _get_output_structure(framework: str, style_mode: StyleMode) -> str:
        """Get output structure based on framework and style mode"""

        if style_mode == StyleMode.BASE_UI_CSS:
            return """
OUTPUT STRUCTURE:

=== COMPONENT ===
React TypeScript component using Base UI compound components:
- Imports from @base-ui-components/react
- TypeScript interfaces for props
- Compound component composition (Root > Parts)
- className callbacks for state-aware styling
- Accessibility built-in via Base UI
- Export statement

=== CSS ===
CSS Module with:
- Synapse design token usage (CSS custom properties)
- data-* attribute selectors for state styling
- Component-scoped class names
- Responsive design with Synapse breakpoints
"""

        if framework.lower() == "react":
            if style_mode == StyleMode.CSS_MODULE:
                return """
OUTPUT STRUCTURE:

=== COMPONENT ===
React TypeScript component with:
- Proper imports and interfaces
- Component implementation with hooks
- Event handlers and state management
- Accessibility attributes
- Error handling
- Export statement

=== CSS ===
CSS Module with:
- Component-scoped styles
- Design token usage
- State-specific styles
- Responsive design
- Focus and hover states
- Accessibility styles
"""
            
            elif style_mode == StyleMode.CSS_IN_JS:
                return """
OUTPUT STRUCTURE:

=== COMPONENT ===
Complete React component with:
- TypeScript interfaces
- Styled-components definitions
- Component implementation
- State management
- Event handlers
- Accessibility features
- Export statement
"""
        
        elif framework.lower() == "angular":
            return """
OUTPUT STRUCTURE:

=== COMPONENT_TS ===
Angular TypeScript component with:
- Component decorator and metadata
- Input/Output properties
- Component logic and methods
- Lifecycle hooks
- Event handlers
- Accessibility implementation

=== COMPONENT_HTML ===
Angular template with:
- Semantic HTML structure
- Angular bindings and directives
- Accessibility attributes
- Event bindings
- Structural directives

=== COMPONENT_SCSS ===
Angular SCSS with:
- Component-scoped styles
- Design token usage
- State-specific styling
- Responsive design
- Angular-specific selectors
"""
        
        return """
OUTPUT STRUCTURE:

=== COMPONENT ===
Framework-appropriate component implementation with:
- Proper structure and syntax
- Design token integration
- State management
- Event handling
- Accessibility features
- Error handling
"""
    
    @staticmethod
    def build_state_specific_prompt(
        base_prompt: str,
        state_name: str,
        state_spec: Dict[str, Any]
    ) -> str:
        """
        Build prompt for generating specific state variations
        
        Args:
            base_prompt: Base component prompt
            state_name: Name of the state
            state_spec: State-specific specifications
            
        Returns:
            Enhanced prompt for state generation
        """
        
        state_prompt = f"""
{base_prompt}

## STATE-SPECIFIC REQUIREMENTS

GENERATE STATE: {state_name.upper()}
STATE TYPE: {state_spec.get('type', 'interactive')}

STATE IMPLEMENTATION:
- Apply specific styling for {state_name} state
- Use appropriate CSS classes or conditional rendering
- Ensure smooth transitions between states
- Follow accessibility guidelines for state changes
- Implement proper keyboard navigation
- Add ARIA attributes for state communication

STATE STYLING:
- Use state-specific CSS custom properties
- Implement hover/focus/active states as appropriate
- Ensure visual feedback for user interactions
- Maintain design system consistency
- Use proper color contrast for accessibility

STATE BEHAVIOR:
- Implement proper state transitions
- Handle user interactions correctly
- Ensure predictable behavior
- Add loading states if applicable
- Implement error states if needed

Generate the component with {state_name} state implementation:
"""
        
        return state_prompt
    
    @staticmethod
    def build_responsive_prompt(
        base_prompt: str,
        breakpoints: Dict[str, Dict[str, Any]]
    ) -> str:
        """
        Build prompt for responsive implementation
        
        Args:
            base_prompt: Base component prompt
            breakpoints: Responsive breakpoint specifications
            
        Returns:
            Enhanced prompt for responsive design
        """
        
        responsive_context = "## RESPONSIVE REQUIREMENTS\n"
        
        for breakpoint, specs in breakpoints.items():
            responsive_context += f"""
{breakpoint.upper()} BREAKPOINT:
- Max width: {specs.get('max_width', 'N/A')}
- Adjustments: {specs.get('adjustments', 'No specific adjustments')}
- Layout changes: {specs.get('layout_changes', 'Maintain layout')}
- Typography: {specs.get('typography', 'Maintain typography')}
"""
        
        responsive_prompt = f"""
{base_prompt}

{responsive_context}

RESPONSIVE IMPLEMENTATION:
- Use CSS media queries for responsive design
- Implement mobile-first approach
- Ensure touch-friendly interactions on mobile
- Maintain accessibility across all viewports
- Optimize performance for different screen sizes
- Test across various devices and orientations

RESPONSIVE STYLING:
- Use CSS Grid and Flexbox for layouts
- Implement fluid typography when appropriate
- Use relative units (rem, em, %) for scalability
- Ensure proper spacing and proportions
- Maintain visual hierarchy across viewports

Generate the responsive component:
"""
        
        return responsive_prompt


# Utility functions
def create_figma_enhanced_context(
    figma_spec: ComponentSpec,
    documentation: str = "",
    framework: str = "React"
) -> Dict[str, Any]:
    """
    Create enhanced context combining Figma specs with documentation
    
    Args:
        figma_spec: Component specification from Figma
        documentation: Additional documentation context
        framework: Target framework
        
    Returns:
        Enhanced context dictionary
    """
    
    context = {
        "figma_spec": figma_spec,
        "documentation": documentation,
        "framework": framework,
        "measurements": {
            "width": figma_spec.width,
            "height": figma_spec.height,
            "padding": figma_spec.padding,
            "border_radius": figma_spec.border_radius
        },
        "typography": {
            "font_family": figma_spec.font_family,
            "font_size": figma_spec.font_size,
            "font_weight": figma_spec.font_weight,
            "line_height": figma_spec.line_height
        },
        "colors": {
            "background": figma_spec.background_color,
            "text": figma_spec.text_color,
            "border": figma_spec.border_color
        },
        "tokens": figma_spec.design_tokens or [],
        "states": figma_spec.states or [],
        "anatomy": figma_spec.anatomy or []
    }
    
    return context


def validate_figma_prompt_completeness(prompt: str, figma_spec: ComponentSpec) -> List[str]:
    """
    Validate that the prompt includes all necessary Figma information
    
    Args:
        prompt: Generated prompt
        figma_spec: Component specification
        
    Returns:
        List of missing elements
    """
    
    missing = []
    
    # Check for essential elements
    if figma_spec.width and "width" not in prompt.lower():
        missing.append("Component width")
    
    if figma_spec.height and "height" not in prompt.lower():
        missing.append("Component height")
    
    if figma_spec.font_family and "font" not in prompt.lower():
        missing.append("Font specifications")
    
    if figma_spec.states and "state" not in prompt.lower():
        missing.append("Component states")
    
    if figma_spec.anatomy and "anatomy" not in prompt.lower():
        missing.append("Component anatomy")
    
    if figma_spec.design_tokens and "token" not in prompt.lower():
        missing.append("Design tokens")
    
    return missing

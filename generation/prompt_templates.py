# generation/prompt_templates.py

from generation.style_modes import StyleMode


# ---------------------------------------------------------
# BASE GENERATION RULES (applies to all modes)
# ---------------------------------------------------------

BASE_RULES = """
You are a senior UI engineer working inside a strict Design System.

STRICT REQUIREMENTS:

• Generate production-ready code.
• Follow Design System rules strictly.
• Use ONLY approved design tokens via CSS variables.
• NEVER hardcode colors, spacing, font sizes, or shadows.
• Follow accessibility best practices.
• Use semantic HTML.
• Ensure responsive behavior.
• Keep styles component-scoped.
• Output must be clean and maintainable.
• Do NOT include explanations.
"""

# ---------------------------------------------------------
# BASE UI RULES (Synapse + Base UI React)
# ---------------------------------------------------------

BASE_UI_RULES = """
BASE UI FRAMEWORK REQUIREMENTS (@base-ui-components/react):

• Import from `@base-ui-components/react/<component>` (individual sub-paths)
• Use compound component pattern: Root > Parts (e.g., Select.Root > Select.Trigger > Select.Popup)
• Use `data-*` attribute selectors for state-based styling ([data-checked], [data-open], etc.)
• Use `className` callbacks for dynamic styling: className={(state) => ...}
• Do NOT import from @mui/material, @radix-ui, @headlessui, or other UI libraries
• All styling via CSS Modules with Synapse CSS custom properties
• Implement accessible patterns — Base UI handles ARIA roles and keyboard nav
"""


# ---------------------------------------------------------
# THEME TOKEN RULES
# ---------------------------------------------------------

THEME_RULES = """
THEME REQUIREMENTS:

• All colors MUST come from CSS variables.
• CSS variables must support Light and Dark themes.
• Use semantic token names like:
    var(--color-bg-surface)
    var(--color-text-primary)
    var(--spacing-md)
• Do NOT use raw hex values.
• Do NOT use rgb/rgba values.
• Assume tokens are already defined globally.
"""


# ---------------------------------------------------------
# STYLE MODE RULES
# ---------------------------------------------------------

CSS_MODULE_RULES = """
STYLE MODE: CSS MODULES

• Generate a separate CSS Module file.
• Use className={styles.className} binding.
• Use modular class naming.
• Do NOT use global selectors.
• Do NOT use element selectors directly.
• Avoid cascading side effects.

Output structure:

=== COMPONENT ===
React component code

=== CSS ===
CSS Module styles

=== STORYBOOK ===
Storybook CSF story file
"""


CSS_IN_JS_RULES = """
STYLE MODE: CSS-IN-JS (Styled Components)

• Use styled-components library.
• Encapsulate styles inside component file.
• Do NOT generate external CSS.
• Use tagged template literals.
• Keep component and styles together.
• Use token variables for all styling.

Output structure:

=== COMPONENT ===
Complete React component with styled-components

=== STORYBOOK ===
Storybook CSF story file
"""


ANGULAR_SCSS_RULES = """
STYLE MODE: ANGULAR SCSS

• Generate Angular component structure.
• Separate HTML, TS, and SCSS files.
• SCSS must be component-scoped.
• Use :host selector for root styles.
• Follow Angular style guide.
• Use BEM-like naming for child elements.
• No global CSS.

Output structure:

=== COMPONENT_TS ===
TypeScript component

=== COMPONENT_HTML ===
HTML template

=== COMPONENT_SCSS ===
SCSS styles

=== STORYBOOK ===
Storybook story file
"""

BASE_UI_CSS_RULES = """
STYLE MODE: BASE UI + CSS MODULES

• Use Base UI compound components from @base-ui-components/react
• Generate a separate CSS Module file
• Use className={styles.className} binding for static classes
• Use className callback for state-aware classes: className={(state) => ...}
• Style states via data-* attribute selectors: [data-checked], [data-open], [data-disabled]
• All values must use Synapse design tokens (CSS custom properties)
• Do NOT use global selectors or element selectors
• Do NOT hardcode colors, spacing, or dimensions

Output structure:

=== COMPONENT ===
React component using Base UI compound components + CSS Modules

=== CSS ===
CSS Module with data-attribute selectors and Synapse tokens

=== STORYBOOK ===
Storybook CSF story file
"""


# ---------------------------------------------------------
# DESIGN TOKEN RULES
# ---------------------------------------------------------

DESIGN_TOKEN_RULES = """
DESIGN TOKEN REQUIREMENTS:

• Use ONLY CSS custom properties (variables) for all styling
• NEVER hardcode colors, spacing, font sizes, or shadows
• Use semantic token names that follow the design system
• Example tokens:
    var(--color-background-controls-brand-base)
    var(--color-text-white)
    var(--spacing-md)
    var(--border-radius-sm)
    var(--font-size-md)
• All tokens must support light and dark themes
• Do NOT use raw hex values, rgb/rgba, or fixed measurements
• Assume tokens are globally available
"""

# ---------------------------------------------------------
# COMPONENT STRUCTURE RULES
# ---------------------------------------------------------

COMPONENT_STRUCTURE_RULES = """
COMPONENT STRUCTURE REQUIREMENTS:

• Follow the component anatomy specified in the design system
• Use semantic HTML elements appropriate for the component type
• Implement proper component composition and hierarchy
• Include proper state management (hover, focus, disabled, active)
• Ensure proper accessibility attributes and ARIA labels
• Follow the interaction patterns defined in the design system
• Implement proper keyboard navigation and focus management
• Use the correct z-index and elevation values from design tokens
"""

# ---------------------------------------------------------
# ICON LIBRARY (spec-driven codegen — React reference in repo)
# ---------------------------------------------------------

ICON_COMPONENT_CODEGEN_RULES = """
ICON PRIMITIVE (READ SPECS FIRST — FRAMEWORK-AGNOSTIC CONTRACT):

• **Design specs** (`design-spec.md` + inherited root-spec) define the *logical* API only: `shapeName` (asset slug), optional `color` as `var(--…)`, optional `variant` for monochrome vs fixed multi-color glyphs. They do **not** name Storybook paths or framework imports.
• **Concrete module path** for the icon primitive (e.g. React `Icon`) comes from **design-system tooling config**: for IDS in this repo, `config/design_systems/ids.yaml` → `codegen.react.icon_component_module` when present. If absent, infer from the project’s existing components.
• When emitting **React** and the YAML mapping points to `storybook/src/components/Icon`, use that file’s export and props: `shapeName`, `color`, `className`, `style`, `variant` (`mask` | `img` | `inline`). Use `variant="inline"` when the spec requires a real `<svg>` in the DOM and the slug is in the implementation’s inline registry; otherwise default `mask`.
• Rules: `shapeName` matches `assets/icons/<shapeName>.svg`; `color` from spec token tables; omit `color` when the parent host must drive state via inherited `currentColor`; do not hand-roll mask markup when the project’s icon primitive exists.
• **Segmented Button (`type="text"`):** root shell **34px** tall (`8218:13150`); segment row **28px** (`padding-4` + `line-height-20` typography).
• **Segmented Button (`type="icon"`):** string `items[].icon` slugs MUST render via the library **Icon** primitive (`shapeName` or equivalent) — never `<img>`, local `maskImage`, or per-component asset globs in SegmentedButton. Set `color` on the segment surface from the spec icon state table; glyph **16×14** inside **33px** segment row; icon-variant root **39px** CSS `border-box` (`42113:67622`; Figma layer **37px**). **Disabled** is out of scope. See component spec **Icon primitive and asset delivery (codegen)**.
• For **Angular / Vue / Lit**, emit an equivalent primitive honoring the same logical contract.
"""

# ---------------------------------------------------------
# OUTPUT TEMPLATES
# ---------------------------------------------------------

REACT_CSS_MODULE_OUTPUT = """
=== COMPONENT ===
[React functional component with CSS Modules]

=== CSS ===
[CSS Module stylesheet]

=== STORYBOOK ===
[Storybook CSF stories]
"""

REACT_CSS_IN_JS_OUTPUT = """
=== COMPONENT ===
[React functional component with CSS-in-JS]

=== STORYBOOK ===
[Storybook CSF stories]
"""

ANGULAR_SCSS_OUTPUT = """
=== COMPONENT_TS ===
[Angular TypeScript component]

=== COMPONENT_HTML ===
[Angular HTML template]

=== COMPONENT_SCSS ===
[Angular SCSS stylesheet]

=== STORYBOOK ===
[Storybook stories]
"""

# ---------------------------------------------------------
# FRAMEWORK RULES
# ---------------------------------------------------------

REACT_RULES = """
FRAMEWORK: REACT

• Use functional components.
• Use modern React patterns.
• Keep components reusable.
• Avoid inline styles.
"""


ANGULAR_RULES = """
FRAMEWORK: ANGULAR

• Use Angular component architecture.
• Include @Component decorator.
• Use templateUrl and styleUrls.
• Follow Angular best practices.
"""


# ---------------------------------------------------------
# PROMPT BUILDER
# ---------------------------------------------------------

def build_prompt(framework: str, style_mode: StyleMode) -> str:
    """
    Build the generation prompt dynamically based on framework and styling mode.
    """

    framework_rules = ""
    style_rules = ""

    # Framework selection
    if framework.lower() == "react":
        framework_rules = REACT_RULES
    elif framework.lower() == "angular":
        framework_rules = ANGULAR_RULES

    # Style mode selection
    if style_mode == StyleMode.CSS_MODULE:
        style_rules = CSS_MODULE_RULES
    elif style_mode == StyleMode.CSS_IN_JS:
        style_rules = CSS_IN_JS_RULES
    elif style_mode == StyleMode.ANGULAR_SCSS:
        style_rules = ANGULAR_SCSS_RULES
    elif style_mode == StyleMode.BASE_UI_CSS:
        style_rules = BASE_UI_CSS_RULES
        framework_rules = BASE_UI_RULES  # Override framework rules for Base UI

    prompt = f"""
{BASE_RULES}

{THEME_RULES}

{framework_rules}

{style_rules}

DESIGN KNOWLEDGE CONTEXT WILL BE PROVIDED BELOW.
GENERATE CODE STRICTLY BASED ON IT.
"""

    return prompt


# ---------------------------------------------------------
# CONTEXT INJECTION TEMPLATE
# ---------------------------------------------------------

def inject_context(prompt: str, context: dict) -> str:
    """
    Injects design intelligence context into the base prompt.
    """

    spec_layers = context.get("spec_layers", [])
    theme_layers = context.get("theme_layers", [])
    validation_issues = context.get("validation_issues", [])
    baseline_layer_summary = "\n".join(
        f"- {layer.get('layer')}: {layer.get('path')} (exists={layer.get('exists')})"
        for layer in spec_layers
        if str(layer.get("layer", "")).startswith("ids_")
    )
    program_delta_summary = "\n".join(
        f"- {layer.get('layer')}: {layer.get('path')} (exists={layer.get('exists')})"
        for layer in spec_layers
        if str(layer.get("layer", "")).startswith("program_")
    )
    theme_layer_summary = "\n".join(
        f"- {layer.get('layer')}: {layer.get('path')} (exists={layer.get('exists')})"
        for layer in theme_layers
    )
    validation_summary = "\n".join(f"- {issue}" for issue in validation_issues) or "- none"

    return f"""
{prompt}

================ DESIGN RULES ================
{context.get("rules", "")}

================ COMPONENT ANATOMY ================
{context.get("anatomy", "")}

================ DESIGN TOKENS ================
{context.get("tokens", "")}

================ PRECEDENCE RULES ================
Apply layer precedence strictly:
{context.get("layer_precedence", "program_component_delta > program_root_delta > ids_component > ids_root")}

================ IDS BASELINE ================
{baseline_layer_summary or "- none"}

================ PROGRAM DELTAS ================
{program_delta_summary or "- none"}

================ THEME LAYERS ================
{theme_layer_summary or "- none"}

================ COMPONENT SPECIFICATION (LAYERED) ================
{context.get("spec", "")}

================ THEME CSS (LAYERED) ================
{context.get("theme_css", "")}

{ICON_COMPONENT_CODEGEN_RULES}

================ SPEC VALIDATION ================
{validation_summary}

================ USER REQUEST ================
{context.get("request", "")}

Remember:
• Follow all design rules
• Follow token usage strictly
• Follow component structure
• Generate production-ready output only
"""


# ---------------------------------------------------------
# RAG-ENHANCED PROMPT TEMPLATES
# ---------------------------------------------------------

RAG_ENHANCED_RULES = """
You are an expert UI/UX developer and design system specialist with access to comprehensive design system knowledge.

CONTEXT-AWARE GENERATION:
• Use the retrieved design system knowledge as your primary source of truth
• Apply exact design tokens, CSS variables, and specifications from the knowledge base
• Follow the component anatomy and structure guidelines provided
• Implement the accessibility requirements specified in the design system
• Use the color schemes, typography, and spacing exactly as defined
• Apply the state management patterns (hover, focus, disabled, active) from the guidelines
• Ensure dark theme support using the semantic tokens provided
• Follow responsive design principles from the design system

STRICT REQUIREMENTS:
• Generate production-ready code following the retrieved design specifications
• Use ONLY the design tokens and CSS variables mentioned in the design knowledge
• NEVER hardcode values - always use the semantic CSS variables provided
• Follow the component structure and anatomy specified in the design system
• Implement all accessibility features mentioned in the guidelines
• Use the exact typography hierarchy and spacing defined in the tokens
• Apply the color schemes for both light and dark themes as specified
• Follow the state patterns and interactions defined in the design system
• Use semantic HTML elements as recommended in the guidelines
• Ensure responsive behavior using the patterns from the design system
• Keep styles component-scoped using the methodology specified
• Output must be clean, maintainable, and fully compliant with the design system

DESIGN SYSTEM COMPLIANCE:
• Reference the specific component specifications provided
• Use the exact measurements, padding, and border radius from the tokens
• Apply the focus states and keyboard navigation patterns specified
• Follow the animation and transition guidelines from the design system
• Implement the error states and validation patterns as defined
• Use the correct z-index and elevation values from the design tokens
• Apply the proper icon usage and sizing guidelines
• Follow the content hierarchy and information architecture principles
"""

RAG_REACT_CSS_MODULE = f"""{BASE_RULES}

{RAG_ENHANCED_RULES}

FRAMEWORK: React with CSS Modules
STYLE MODE: CSS Modules

SPECIFIC REQUIREMENTS:
• Create a React functional component with hooks
• Use CSS Modules for styling with proper class naming
• Implement proper event handling and state management
• Use semantic JSX elements
• Include proper TypeScript interfaces (if applicable)
• Follow React best practices for component composition
• Implement proper prop handling and default values

{DESIGN_TOKEN_RULES}

{COMPONENT_STRUCTURE_RULES}

{REACT_CSS_MODULE_OUTPUT}

================ DESIGN SYSTEM KNOWLEDGE ================
{{context.get("rules", "")}}

================ COMPONENT ANATOMY ================
{{context.get("anatomy", "")}}

================ DESIGN TOKENS ================
{{context.get("tokens", "")}}

================ FULL SPECIFICATION ================
{{context.get("spec", "")}}

================ USER REQUEST ================
{{context.get("request", "")}}

Remember:
• Follow all retrieved design system specifications exactly
• Use only the CSS variables and tokens provided in the design knowledge
• Implement the component structure as specified in the anatomy
• Generate production-ready, design-system-compliant code only
"""

RAG_REACT_CSS_IN_JS = f"""{BASE_RULES}

{RAG_ENHANCED_RULES}

FRAMEWORK: React with CSS-in-JS
STYLE MODE: CSS-in-JS (styled-components or emotion)

SPECIFIC REQUIREMENTS:
• Create a React functional component with CSS-in-JS
• Use styled-components or emotion for styling
• Implement proper theme support using the design tokens
• Use semantic JSX elements
• Include proper TypeScript interfaces
• Follow React best practices for component composition
• Implement proper prop handling and default values
• Use the design system theme provider pattern

{DESIGN_TOKEN_RULES}

{COMPONENT_STRUCTURE_RULES}

{REACT_CSS_IN_JS_OUTPUT}

================ DESIGN SYSTEM KNOWLEDGE ================
{{context.get("rules", "")}}

================ COMPONENT ANATOMY ================
{{context.get("anatomy", "")}}

================ DESIGN TOKENS ================
{{context.get("tokens", "")}}

================ FULL SPECIFICATION ================
{{context.get("spec", "")}}

================ USER REQUEST ================
{{context.get("request", "")}}

Remember:
• Follow all retrieved design system specifications exactly
• Use only the design tokens provided in the CSS-in-JS implementation
• Implement the component structure as specified in the anatomy
• Generate production-ready, design-system-compliant code only
"""

RAG_ANGULAR_SCSS = f"""{BASE_RULES}

{RAG_ENHANCED_RULES}

FRAMEWORK: Angular with SCSS
STYLE MODE: Angular SCSS

SPECIFIC REQUIREMENTS:
• Create an Angular component with TypeScript
• Use SCSS with proper component encapsulation
• Implement proper Angular patterns (Input, Output, EventEmitter)
• Use semantic HTML in templates
• Include proper TypeScript interfaces and models
• Follow Angular best practices for component architecture
• Implement proper change detection and lifecycle hooks
• Use Angular reactive forms if applicable

{DESIGN_TOKEN_RULES}

{COMPONENT_STRUCTURE_RULES}

{ANGULAR_SCSS_OUTPUT}

================ DESIGN SYSTEM KNOWLEDGE ================
{{context.get("rules", "")}}

================ COMPONENT ANATOMY ================
{{context.get("anatomy", "")}}

================ DESIGN TOKENS ================
{{context.get("tokens", "")}}

================ FULL SPECIFICATION ================
{{context.get("spec", "")}}

================ USER REQUEST ================
{{context.get("request", "")}}

Remember:
• Follow all retrieved design system specifications exactly
• Use only the CSS variables and tokens provided in the design knowledge
• Implement the component structure as specified in the anatomy
• Generate production-ready, design-system-compliant Angular code only
"""


def build_rag_prompt(framework: str, style_mode: StyleMode) -> str:
    """Build RAG-enhanced prompt based on framework and style mode"""

    if framework.lower() == "react":
        if style_mode == StyleMode.CSS_MODULE:
            return RAG_REACT_CSS_MODULE
        elif style_mode == StyleMode.CSS_IN_JS:
            return RAG_REACT_CSS_IN_JS
        elif style_mode == StyleMode.BASE_UI_CSS:
            # Base UI uses the standard prompt builder with BASE_UI_CSS rules
            return build_prompt(framework, style_mode)

    elif framework.lower() == "angular":
        return RAG_ANGULAR_SCSS

    # Fallback to original prompts
    return build_prompt(framework, style_mode)


def inject_rag_context(base_prompt: str, context: dict) -> str:
    """Inject RAG-retrieved context into prompt"""
    
    # Enhanced context injection for RAG
    enhanced_context = {
        **context,
        "rag_enabled": True,
        "design_knowledge_source": "indexed_design_system"
    }
    
    return base_prompt.format(**enhanced_context)
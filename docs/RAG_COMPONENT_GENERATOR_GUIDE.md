# RAG-Powered Component Generator Guide

## Overview

The RAG-Powered Component Generator is an intelligent system that creates UI components based on natural language queries, using indexed design system knowledge to ensure compliance with your design standards.

## 🚀 Quick Start

### 1. Using the MCP Tool

```python
# Import the MCP tool
from mcp_tools.rag_component_generator_tool import generate_component_from_query

# Generate a component
result = generate_component_from_query(
    query="Create a primary button with hover effects and loading state",
    framework="React",
    style_mode="css-module"
)

print(result["generated_code"]["component"])
print(result["generated_code"]["css"])
```

### 2. Using the Direct API

```python
from generation.rag_component_generator import generate_component_from_query

result = generate_component_from_query(
    query="Build a responsive navigation menu with dropdown submenus",
    framework="React",
    style_mode="css-in-js"
)
```

## 📝 Query Examples

### Buttons
- "Create a primary button with hover effects and loading state"
- "Generate a disabled button with proper accessibility"
- "Build a danger button with confirmation dialog"

### Forms
- "Create a login form with email and password validation"
- "Build a contact form with proper error handling"
- "Generate a multi-step registration form wizard"

### Navigation
- "Create a responsive header navigation with dropdown menus"
- "Build a sidebar navigation with collapsible sections"
- "Generate breadcrumb navigation with proper hierarchy"

### Data Display
- "Create a data table with sorting and pagination"
- "Build a card component for product listings"
- "Generate a list view with search and filtering"

### Modals & Overlays
- "Create a modal dialog with form validation"
- "Build a confirmation dialog with proper accessibility"
- "Generate a tooltip component with positioning"

## 🎨 Framework Support

### React
- **CSS Modules**: Scoped CSS with `.module.css` files
- **CSS-in-JS**: Styled-components or emotion
- **Features**: Hooks, TypeScript, semantic JSX

### Angular
- **SCSS**: Component-scoped stylesheets
- **Features**: TypeScript, reactive forms, component architecture

## 🔧 Style Modes

### CSS Modules (React)
```css
/* Component.module.css */
.button {
  background-color: var(--color-background-controls-brand-base);
  /* Design system tokens */
}
```

### CSS-in-JS (React)
```javascript
const StyledButton = styled.button`
  background-color: var(--color-background-controls-brand-base);
  /* Design system tokens */
`;
```

### Angular SCSS
```scss
// component.scss
.button {
  background-color: var(--color-background-controls-brand-base);
  /* Design system tokens */
}
```

## 🎯 Query Best Practices

### Be Specific
✅ **Good**: "Create a primary button with hover effects, loading state, and proper accessibility"
❌ **Poor**: "Make a button"

### Include Requirements
✅ **Good**: "Build a responsive navigation menu with dropdown submenus and mobile hamburger"
❌ **Poor**: "Navigation menu"

### Specify Framework and Style
✅ **Good**: "Generate a React component with CSS modules for a data table"
❌ **Poor**: "Data table"

### Mention Features
✅ **Good**: "Create a modal with form validation, error handling, and accessibility features"
❌ **Poor**: "Modal"

## 🧠 How RAG Works

### 1. Query Analysis
The system analyzes your natural language query to extract:
- Component type and purpose
- Required features and functionality
- Style and accessibility requirements
- Framework-specific needs

### 2. Knowledge Retrieval
Using the indexed design system:
- Searches for relevant component specifications
- Retrieves design tokens and CSS variables
- Finds layout and spacing guidelines
- Gets accessibility and theming requirements

### 3. Context-Aware Generation
The generator:
- Uses retrieved design knowledge as primary source
- Applies exact design tokens and specifications
- Follows component anatomy and structure guidelines
- Ensures dark theme support and accessibility

### 4. Auto-Repair & Validation
The system:
- Validates generated code against design system rules
- Repairs common issues and inconsistencies
- Ensures proper token usage and semantic HTML
- Validates accessibility implementation

## 📊 Generated Output Structure

```json
{
  "query": "User's natural language query",
  "component_info": {
    "name": "ComponentName",
    "purpose": "Main functionality",
    "features": ["feature1", "feature2"]
  },
  "framework": "React",
  "style_mode": "css-module",
  "design_knowledge": "Retrieved design system information",
  "generated_code": {
    "component": "React component code",
    "css": "CSS module code"
  },
  "metadata": {
    "rag_enabled": true,
    "model": "llama3",
    "embedding_model": "embeddinggemma"
  }
}
```

## 🎨 Design System Integration

### Token Usage
The generator automatically uses design tokens like:
```css
background-color: var(--color-background-controls-brand-base);
color: var(--color-text-white);
padding: var(--spacing-md);
```

### Accessibility
Generated components include:
- Proper ARIA attributes
- Keyboard navigation support
- Focus management
- Screen reader compatibility

### Dark Theme
Components support dark themes through:
- Semantic CSS variables
- Automatic theme adaptation
- Proper color contrast

### Responsive Design
Components include:
- Mobile-first responsive patterns
- Proper breakpoint usage
- Flexible layouts

## 🔍 MCP Tools Available

### generate_component_from_query
Main tool for generating components from natural language queries.

### generate_button
Specialized tool for button components with variants.

### generate_form
Specialized tool for form components with field specifications.

### generate_navigation
Specialized tool for navigation components.

### generate_data_display
Specialized tool for data display components.

### get_component_suggestions
Get suggestions for component types based on query analysis.

## 🧪 Testing and Validation

### Test Script
```bash
python scripts/test_rag_generator.py
```

### Validation Features
- Design system compliance checking
- Token usage validation
- Accessibility testing
- Code quality assurance

## 🚀 Advanced Usage

### Custom Prompts
You can customize the generation prompts by modifying:
- `generation/prompt_templates.py`
- RAG-enhanced templates for context-aware generation

### Batch Generation
Generate multiple components:
```python
queries = [
    "Create a primary button",
    "Build a navigation menu",
    "Generate a data table"
]

for query in queries:
    result = generate_component_from_query(query)
    # Save or process result
```

### Integration with Build Systems
Integrate with your development workflow:
- CI/CD pipeline integration
- Component library generation
- Design system documentation

## 🔧 Troubleshooting

### Common Issues

**Query too vague**: Be more specific about requirements and features

**Missing design knowledge**: Ensure the design system is properly indexed

**Framework mismatch**: Specify the correct framework in your query

**Style mode issues**: Choose the appropriate styling approach

### Debug Mode
Enable debug logging:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## 📚 Examples

### Example 1: Primary Button
```python
result = generate_component_from_query(
    query="Create a primary button with hover effects, loading state, and proper accessibility",
    framework="React",
    style_mode="css-module"
)
```

### Example 2: Data Table
```python
result = generate_component_from_query(
    query="Build a data table with sorting, filtering, and pagination for user management",
    framework="Angular",
    style_mode="angular-scss"
)
```

### Example 3: Navigation Menu
```python
result = generate_component_from_query(
    query="Create a responsive header navigation with dropdown submenus and mobile hamburger menu",
    framework="React",
    style_mode="css-in-js"
)
```

## 🎉 Benefits

- **Design System Compliance**: Automatically follows your design standards
- **Natural Language Interface**: No need to write code from scratch
- **Context-Aware**: Uses your specific design system knowledge
- **Production Ready**: Generates clean, maintainable code
- **Accessible**: Includes proper accessibility features
- **Theme Support**: Built-in dark theme and responsive design
- **Framework Agnostic**: Supports React and Angular
- **Extensible**: Easy to customize and extend

## 🔄 Continuous Improvement

The RAG system learns from your design system and improves over time:
- More indexed content = better context
- Usage patterns = refined prompts
- Feedback loop = enhanced generation quality

For more information, see the [API documentation](../api/) and [design system integration guide](../design-system/).

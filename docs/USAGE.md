# Design Intelligence System - Usage Guide

## Getting Started

### Prerequisites

- Python 3.8+
- Ollama installed with Llama3 model
- Required dependencies (see requirements.txt)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd design-intelligence-system
```

2. **Install dependencies**
```bash
pip install -r requirements.txt
```

3. **Setup Ollama**
```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull Llama3 model
ollama pull llama3
```

4. **Prepare configuration files**
```bash
# Create component registry
cp config/component_registry.example.json component_registry.json

# Create rules configuration
cp config/rules.example.json rules.json

# Create allowed tokens
cp config/allowed_tokens.example.json allowed_tokens.json
```

## Core Usage Patterns

### 1. Component Generation

#### Basic Usage

```python
from generation.component_generator import ComponentGenerator
from generation.style_modes import StyleMode

# Initialize generator
generator = ComponentGenerator(model="llama3")

# Prepare context
context = {
    "rules": "Button must have primary and secondary variants",
    "anatomy": ["button", "spinner", "icon"],
    "tokens": "var(--color-bg-primary), var(--color-text-primary)",
    "spec": "Button component specification",
    "request": "Generate a button with hover and loading states"
}

# Generate React component with CSS Modules
result = generator.generate(
    context=context,
    framework="React",
    style_mode=StyleMode.CSS_MODULE
)

print(result["component"])  # Component code
print(result["css"])        # CSS code
```

#### Framework Options

**React with CSS Modules**
```python
result = generator.generate(
    context=context,
    framework="React",
    style_mode=StyleMode.CSS_MODULE
)
```

**React with CSS-in-JS**
```python
result = generator.generate(
    context=context,
    framework="React",
    style_mode=StyleMode.CSS_IN_JS
)
```

**Angular with SCSS**
```python
result = generator.generate(
    context=context,
    framework="Angular",
    style_mode=StyleMode.ANGULAR_SCSS
)
```

### 2. Component Validation

#### Direct Validation

```python
from validation.validate_design import validate_design

# Validate component code
report = validate_design(
    component="button",
    code="""
    <button class="btn btn--primary">
      <span class="btn__text">Submit</span>
    </button>
    """
)

# Check results
if report["summary"]["critical"] > 0:
    print("Critical violations found!")
    
for violation in report["violations"]:
    print(f"{violation['severity']}: {violation['message']}")
```

#### Validation with Auto-Repair

```python
from generation.auto_repair_engine import AutoRepairEngine

repair_engine = AutoRepairEngine()

# Repair component automatically
result = repair_engine.repair(
    component_name="button",
    generated={
        "component": "<button style='background: red;'>Click</button>"
    }
)

print("Repaired component:", result["final_output"])
print("Validation report:", result["validation"])
```

### 3. Pipeline Usage

#### Complete Generation Pipeline

```python
from generation.generation_pipeline import GenerationPipeline

# Initialize pipeline
pipeline = GenerationPipeline()

# Run complete pipeline
result = pipeline.run(
    component="button",
    request="Generate a primary button with loading state and hover effects"
)

print("Generated component:", result["component"])
print("Generated CSS:", result["css"])
print("Validation:", result["validation"])
```

### 4. API Usage

#### Start API Server

```bash
# Start validation API
python api/design_validator_api.py

# Start generation API
python api/component_generation_api.py
```

#### API Endpoints

**Validate Component**
```bash
curl -X POST "http://localhost:8000/design/validate" \
  -H "Content-Type: application/json" \
  -d '{
    "component": "button",
    "content": "<button class=\"btn\">Submit</button>"
  }'
```

**Generate Component**
```bash
curl -X POST "http://localhost:8001/design/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "component": "button",
    "request": "Generate a primary button with hover effect",
    "framework": "React",
    "style_mode": "css-module"
  }'
```

### 5. MCP Tool Usage

#### Setup MCP Tools

```bash
# Run design validator tool
python mcp_tools/design_validator_tool.py

# Run component generator tool
python mcp_tools/component_generator_tool.py
```

#### Use with AI Assistants

The MCP tools integrate with AI assistants like Cascade to provide:
- Component validation capabilities
- Component generation features
- Design system compliance checking

## Configuration

### Component Registry

```json
{
  "button": {
    "anatomy": ["button", "spinner", "icon"],
    "variants": ["primary", "secondary", "tertiary"],
    "states": ["hover", "active", "disabled", "loading"]
  },
  "modal": {
    "anatomy": ["overlay", "dialog", "header", "content", "actions"],
    "variants": ["default", "large", "small"],
    "states": ["open", "closed"]
  }
}
```

### Design Rules

```json
{
  "rules": [
    {
      "id": "button-001",
      "component": "button",
      "rule": "Button must use semantic color tokens",
      "normalized": "Button must use semantic color tokens",
      "type": "token",
      "severity": "high"
    }
  ]
}
```

### Allowed Tokens

```json
{
  "allowed_tokens": [
    "color-bg-primary",
    "color-bg-secondary",
    "color-text-primary",
    "color-text-secondary",
    "spacing-xs",
    "spacing-sm",
    "spacing-md",
    "spacing-lg",
    "border-radius-sm",
    "border-radius-md",
    "border-radius-lg"
  ]
}
```

## Best Practices

### 1. Component Generation

- **Be specific** in your requests for better results
- **Include context** about usage and requirements
- **Specify framework** and style mode explicitly
- **Review generated code** before production use

### 2. Validation

- **Validate early** in the development process
- **Fix critical violations** immediately
- **Use auto-repair** for common issues
- **Monitor validation reports** for patterns

### 3. Theme Integration

- **Always use CSS variables** for colors and spacing
- **Test both light and dark themes**
- **Follow semantic token naming conventions**
- **Avoid hardcoded values** in components

### 4. Performance

- **Cache generated components** when possible
- **Use batch validation** for multiple components
- **Monitor API response times**
- **Optimize prompt context** for faster generation

## Troubleshooting

### Common Issues

**1. Ollama Connection Failed**
```bash
# Check if Ollama is running
ollama list

# Start Ollama service
ollama serve
```

**2. Model Not Found**
```bash
# Pull required model
ollama pull llama3
```

**3. Configuration Files Missing**
```bash
# Copy example configurations
cp config/*.example.json .
```

**4. Validation Errors**
- Check component registry configuration
- Verify allowed tokens list
- Review design rules syntax

### Debug Mode

```python
# Enable debug logging
import logging
logging.basicConfig(level=logging.DEBUG)

# Use with detailed error reporting
try:
    result = generator.generate(context, "React", StyleMode.CSS_MODULE)
except Exception as e:
    logging.error(f"Generation failed: {e}")
    raise
```

## Integration Examples

### CI/CD Pipeline Integration

```yaml
# GitHub Actions example
- name: Validate Components
  run: |
    python scripts/validate_all_components.py
    
- name: Generate New Components
  run: |
    python scripts/generate_from_spec.py
```

### IDE Integration

```python
# VS Code extension example
from validation.validate_design import validate_design

def validate_current_file():
    file_content = get_editor_content()
    component_name = extract_component_name(file_path)
    
    report = validate_design(component_name, file_content)
    show_validation_results(report)
```

### Design Tool Integration

```python
# Figma plugin integration
def generate_from_figma_selection(selection):
    component_spec = parse_figma_selection(selection)
    
    result = pipeline.run(
        component=component_spec["name"],
        request=component_spec["description"]
    )
    
    insert_code_in_editor(result["component"])
```

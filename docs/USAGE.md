# Design Intelligence System - Usage Guide

## Getting Started

### Prerequisites

- Python 3.8+
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

3. **Prepare configuration files**
```bash
# Create component registry
cp config/component_registry.example.json component_registry.json

# Create rules configuration
cp config/rules.example.json rules.json

# Create allowed tokens
cp config/allowed_tokens.example.json allowed_tokens.json
```

## Core Usage Patterns

### 1. Component Validation

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

### 2. API Usage

#### Start API Server

```bash
# Start validation API
python api/design_validator_api.py
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

### 3. MCP Tool Usage

#### Setup MCP Tools

```bash
# Run design validator tool
python mcp_tools/design_validator_tool.py
```

#### Use with AI Assistants

The MCP tools integrate with AI assistants like Cascade to provide:
- Component validation capabilities
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

### 1. Validation

- **Validate early** in the development process
- **Fix critical violations** immediately
- **Monitor validation reports** for patterns

### 2. Theme Integration

- **Always use CSS variables** for colors and spacing
- **Test both light and dark themes**
- **Follow semantic token naming conventions**
- **Avoid hardcoded values** in components

### 3. Performance

- **Use batch validation** for multiple components
- **Monitor API response times**

## Troubleshooting

### Common Issues

**1. Configuration Files Missing**
```bash
# Copy example configurations
cp config/*.example.json .
```

**2. Validation Errors**
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
    report = validate_design("button", "<button>Click me</button>")
except Exception as e:
    logging.error(f"Validation failed: {e}")
    raise
```

## Integration Examples

### CI/CD Pipeline Integration

```yaml
# GitHub Actions example
- name: Validate Components
  run: |
    python scripts/validate_all_components.py
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

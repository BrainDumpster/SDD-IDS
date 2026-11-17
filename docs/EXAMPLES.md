# Design Intelligence System - Examples

## Validation Examples

### Rule Validation

```python
from validation.validate_design import validate_design

# Validate a button component
report = validate_design(
    component="button",
    code="""
    <button class="btn">
      <span class="btn__text">Click me</span>
    </button>
    """
)

print(report)
```

**Output**:
```json
{
  "summary": {
    "critical": 0,
    "high": 1,
    "medium": 0,
    "low": 0
  },
  "violations": [
    {
      "type": "token_violation",
      "token": "color-bg-primary",
      "message": "Unauthorized token used: color-bg-primary",
      "severity": "high"
    }
  ]
}
```

## API Usage Examples

### Validation API

```bash
curl -X POST "http://localhost:8000/design/validate" \
  -H "Content-Type: application/json" \
  -d '{
    "component": "button",
    "content": "<button class=\"btn\">Submit</button>"
  }'
```

## MCP Tool Examples

### Validation via MCP

```python
from mcp_tools.design_validator_tool import validate_design_tool

# Validate via MCP
report = validate_design_tool(
    component="modal",
    code="<div class='modal'><div class='modal__content'>...</div></div>"
)
```

## Theme Integration Examples

### Dark Mode Support

```css
/* CSS with theme variables */
.card {
  background-color: var(--color-bg-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-default);
}

/* Theme definitions */
:root {
  --color-bg-surface: #ffffff;
  --color-text-primary: #1a1a1a;
  --color-border-default: #e0e0e0;
}

[data-theme="dark"] {
  --color-bg-surface: #1a1a1a;
  --color-text-primary: #ffffff;
  --color-border-default: #333333;
}
```

### Component with Theme Awareness

```typescript
export const ThemedComponent = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Themed Content</h2>
      <p className={styles.text}>
        This component automatically adapts to theme changes
      </p>
    </div>
  );
};
```

```css
.container {
  background-color: var(--color-bg-surface);
  color: var(--color-text-primary);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-md);
}

.title {
  color: var(--color-text-primary);
  font-size: var(--font-size-xl);
}

.text {
  color: var(--color-text-secondary);
  font-size: var(--font-size-md);
}
```

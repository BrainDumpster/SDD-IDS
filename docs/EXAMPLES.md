# Design Intelligence System - Examples

## Component Generation Examples

### React Component with CSS Modules

**Request**: Generate a button component with hover states and loading spinner

```python
from generation.component_generator import ComponentGenerator
from generation.style_modes import StyleMode

generator = ComponentGenerator()
context = {
    "rules": "Button must have primary and secondary variants",
    "anatomy": ["button", "spinner", "icon"],
    "tokens": "var(--color-bg-primary), var(--color-text-primary)",
    "spec": "Button component specification",
    "request": "Generate a button with hover and loading states"
}

result = generator.generate(
    context=context,
    framework="React",
    style_mode=StyleMode.CSS_MODULE
)
```

**Output**:
```typescript
// === COMPONENT ===
import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  variant: 'primary' | 'secondary';
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant,
  loading,
  children,
  onClick
}) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]}`}
      onClick={onClick}
      disabled={loading}
    >
      {loading && <div className={styles.spinner} />}
      {children}
    </button>
  );
};

// === CSS ===
.button {
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  border: none;
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
}

.primary {
  background-color: var(--color-bg-brand-primary);
}

.secondary {
  background-color: var(--color-bg-secondary);
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid var(--color-border-transparent);
  border-top: 2px solid var(--color-text-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

### Angular Component with SCSS

**Request**: Create a card component with header, content, and actions

```python
result = generator.generate(
    context=context,
    framework="Angular",
    style_mode=StyleMode.ANGULAR_SCSS
)
```

**Output**:
```typescript
// === COMPONENT_TS ===
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() title: string;
  @Input() subtitle: string;
  @Input() actions: Array<{ label: string; action: () => void }>;
}
```

```html
<!-- === COMPONENT_HTML ===
<div class="card">
  <div class="card__header">
    <h2 class="card__title">{{ title }}</h2>
    <p class="card__subtitle" *ngIf="subtitle">{{ subtitle }}</p>
  </div>
  <div class="card__content">
    <ng-content></ng-content>
  </div>
  <div class="card__actions" *ngIf="actions?.length">
    <button 
      *ngFor="let action of actions" 
      class="card__action"
      (click)="action.action()"
    >
      {{ action.label }}
    </button>
  </div>
</div>
```

```scss
// === COMPONENT_SCSS ===
:host {
  display: block;
}

.card {
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);

  &__header {
    margin-bottom: var(--spacing-md);
  }

  &__title {
    color: var(--color-text-primary);
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    margin: 0;
  }

  &__subtitle {
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
    margin: var(--spacing-xs) 0 0 0;
  }

  &__content {
    margin-bottom: var(--spacing-lg);
  }

  &__actions {
    display: flex;
    gap: var(--spacing-sm);
    justify-content: flex-end;
  }

  &__action {
    background-color: var(--color-bg-brand-primary);
    color: var(--color-text-on-brand);
    border: none;
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--border-radius-md);
    cursor: pointer;
  }
}
```

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

### Auto-Repair Example

```python
from generation.auto_repair_engine import AutoRepairEngine

repair_engine = AutoRepairEngine()

# Component with violations
violating_code = """
<button style="background: #ff0000; color: white;">
  Submit
</button>
"""

result = repair_engine.repair(
    component_name="button",
    generated={"component": violating_code}
)

print(result["final_output"])
```

**Repaired Output**:
```html
<button class="button" style="background-color: var(--color-bg-brand-primary); color: var(--color-text-on-brand);">
  Submit
</button>
```

## API Usage Examples

### Component Generation API

```bash
curl -X POST "http://localhost:8000/design/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "component": "button",
    "request": "Generate a primary button with hover effect",
    "framework": "React"
  }'
```

**Response**:
```json
{
  "component": "import React from 'react';\nimport styles from './Button.module.css';\n\nexport const Button = () => {\n  return <button className={styles.button}>Click me</button>;\n};",
  "css": ".button { background-color: var(--color-bg-brand-primary); }",
  "validation": {
    "summary": {"critical": 0, "high": 0, "medium": 0, "low": 0},
    "violations": []
  }
}
```

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

### AI Assistant Integration

```python
from mcp_tools.component_generator_tool import generate_component

# Generate component via MCP
result = generate_component(
    component="modal",
    description="A modal dialog with close button and overlay",
    framework="React",
    style_mode="css-module"
)
```

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
/* Generated CSS with theme variables */
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

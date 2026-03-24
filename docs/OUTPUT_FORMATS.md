# Design Intelligence System - Output Formats

## Overview

The Design Intelligence System produces structured outputs for component generation, validation reports, and API responses. This document details the expected formats and structures.

## Component Generation Outputs

### React Component with CSS Modules

**Structure**:
```json
{
  "component": "string",
  "css": "string",
  "framework": "react",
  "style_mode": "css-module"
}
```

**Example Output**:

```json
{
  "component": "import React from 'react';\nimport styles from './Button.module.css';\n\ninterface ButtonProps {\n  variant: 'primary' | 'secondary';\n  children: React.ReactNode;\n  onClick?: () => void;\n}\n\nexport const Button: React.FC<ButtonProps> = ({\n  variant,\n  children,\n  onClick\n}) => {\n  return (\n    <button\n      className={`${styles.button} ${styles[variant]}`}\n      onClick={onClick}\n    >\n      {children}\n    </button>\n  );\n};",
  "css": ".button {\n  background-color: var(--color-bg-primary);\n  color: var(--color-text-primary);\n  border: none;\n  padding: var(--spacing-md) var(--spacing-lg);\n  border-radius: var(--border-radius-md);\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n\n.primary {\n  background-color: var(--color-bg-brand-primary);\n}\n\n.secondary {\n  background-color: var(--color-bg-secondary);\n}\n\n.button:hover {\n  background-color: var(--color-bg-hover);\n}",
  "framework": "react",
  "style_mode": "css-module"
}
```

### React Component with CSS-in-JS

**Structure**:
```json
{
  "component": "string",
  "css": "",
  "framework": "react",
  "style_mode": "css-in-js"
}
```

**Example Output**:

```json
{
  "component": "import React from 'react';\nimport styled from 'styled-components';\n\ninterface ButtonProps {\n  variant: 'primary' | 'secondary';\n  children: React.ReactNode;\n  onClick?: () => void;\n}\n\nconst StyledButton = styled.button<{variant: string}>`\n  background-color: var(--color-bg-primary);\n  color: var(--color-text-primary);\n  border: none;\n  padding: var(--spacing-md) var(--spacing-lg);\n  border-radius: var(--border-radius-md);\n  cursor: pointer;\n  transition: all 0.2s ease;\n\n  ${props => props.variant === 'primary' && `\n    background-color: var(--color-bg-brand-primary);\n  `}\n\n  ${props => props.variant === 'secondary' && `\n    background-color: var(--color-bg-secondary);\n  `}\n\n  &:hover {\n    background-color: var(--color-bg-hover);\n  }\n`;\n\nexport const Button: React.FC<ButtonProps> = ({\n  variant = 'primary',\n  children,\n  onClick\n}) => {\n  return (\n    <StyledButton variant={variant} onClick={onClick}>\n      {children}\n    </StyledButton>\n  );\n};",
  "css": "",
  "framework": "react",
  "style_mode": "css-in-js"
}
```

### Angular Component with SCSS

**Structure**:
```json
{
  "component_ts": "string",
  "component_html": "string",
  "component_scss": "string",
  "framework": "angular",
  "style_mode": "angular-scss"
}
```

**Example Output**:

```json
{
  "component_ts": "import { Component, Input } from '@angular/core';\n\n@Component({\n  selector: 'app-button',\n  templateUrl: './button.component.html',\n  styleUrls: ['./button.component.scss']\n})\nexport class ButtonComponent {\n  @Input() variant: 'primary' | 'secondary' = 'primary';\n  @Input() disabled: boolean = false;\n  \n  @Output() click = new EventEmitter<void>();\n  \n  onClick(): void {\n    if (!this.disabled) {\n      this.click.emit();\n    }\n  }\n}",
  "component_html": "<button \n  class=\"button\"\n  [class.button--primary]=\"variant === 'primary'\"\n  [class.button--secondary]=\"variant === 'secondary'\"\n  [class.button--disabled]=\"disabled\"\n  (click)=\"onClick()\"\n  [disabled]=\"disabled\"\n>\n  <ng-content></ng-content>\n</button>",
  "component_scss": ".button {\n  background-color: var(--color-bg-primary);\n  color: var(--color-text-primary);\n  border: none;\n  padding: var(--spacing-md) var(--spacing-lg);\n  border-radius: var(--border-radius-md);\n  cursor: pointer;\n  transition: all 0.2s ease;\n\n  &--primary {\n    background-color: var(--color-bg-brand-primary);\n    color: var(--color-text-on-brand);\n  }\n\n  &--secondary {\n    background-color: var(--color-bg-secondary);\n  }\n\n  &--disabled {\n    opacity: 0.6;\n    cursor: not-allowed;\n  }\n\n  &:hover:not(.button--disabled) {\n    background-color: var(--color-bg-hover);\n  }\n}",
  "framework": "angular",
  "style_mode": "angular-scss"
}
```

## Validation Report Outputs

### Standard Validation Report

**Structure**:
```json
{
  "summary": {
    "critical": "number",
    "high": "number",
    "medium": "number",
    "low": "number"
  },
  "violations": [
    {
      "type": "string",
      "severity": "string",
      "message": "string",
      "rule_id": "string",
      "component": "string"
    }
  ]
}
```

**Example Output**:

```json
{
  "summary": {
    "critical": 0,
    "high": 2,
    "medium": 1,
    "low": 0
  },
  "violations": [
    {
      "type": "token_violation",
      "severity": "high",
      "message": "Unauthorized token used: color-bg-primary",
      "token": "color-bg-primary",
      "component": "button"
    },
    {
      "type": "token_violation", 
      "severity": "high",
      "message": "Unauthorized token used: color-text-primary",
      "token": "color-text-primary",
      "component": "button"
    },
    {
      "type": "structure_violation",
      "severity": "medium",
      "message": "Missing required element: spinner",
      "element": "spinner",
      "component": "button"
    }
  ]
}
```

### Violation Types

#### Token Violation
```json
{
  "type": "token_violation",
  "severity": "high",
  "message": "Unauthorized token used: token-name",
  "token": "token-name",
  "component": "component-name"
}
```

#### Structure Violation
```json
{
  "type": "structure_violation",
  "severity": "medium",
  "message": "Missing required element: element-name",
  "element": "element-name",
  "component": "component-name"
}
```

#### Rule Violation
```json
{
  "type": "rule_violation",
  "severity": "low",
  "message": "Design rule not followed: rule description",
  "rule_id": "rule-id",
  "rule": "rule description",
  "component": "component-name"
}
```

## API Response Formats

### Success Response

**Validation API Success**:
```json
{
  "summary": {
    "critical": 0,
    "high": 0,
    "medium": 0,
    "low": 0
  },
  "violations": []
}
```

**Generation API Success**:
```json
{
  "component": "generated-component-code",
  "css": "generated-css-code",
  "validation": {
    "summary": {"critical": 0, "high": 0, "medium": 0, "low": 0},
    "violations": []
  }
}
```

### Error Response

**Standard Error Format**:
```json
{
  "error": "error-type",
  "message": "Human-readable error message",
  "detail": "Detailed error information",
  "timestamp": "2023-12-07T10:30:00Z"
}
```

**Validation Errors**:
```json
{
  "error": "validation_error",
  "message": "Invalid request parameters",
  "detail": {
    "field": "component",
    "issue": "Component name is required"
  }
}
```

**Generation Errors**:
```json
{
  "error": "generation_error",
  "message": "Failed to generate component",
  "detail": {
    "model": "llama3",
    "issue": "Model not available"
  }
}
```

## Repair Engine Outputs

### Repair Result

**Structure**:
```json
{
  "final_output": "component-data",
  "validation": "validation-report",
  "repaired": "boolean",
  "warning": "string (optional)"
}
```

**Example Output**:

```json
{
  "final_output": {
    "component": "import React from 'react';\nimport styles from './Button.module.css';\n\nexport const Button = () => {\n  return <button className={styles.button}>Click me</button>;\n};",
    "css": ".button { background-color: var(--color-bg-brand-primary); }",
    "framework": "react",
    "style_mode": "css-module"
  },
  "validation": {
    "summary": {"critical": 0, "high": 0, "medium": 0, "low": 0},
    "violations": []
  },
  "repaired": true
}
```

**Failed Repair**:
```json
{
  "final_output": {
    "component": "original-component-code",
    "css": "original-css-code"
  },
  "validation": {
    "summary": {"critical": 1, "high": 2, "medium": 0, "low": 0},
    "violations": [...]
  },
  "repaired": true,
  "warning": "Max repair attempts reached"
}
```

## Pipeline Outputs

### Complete Pipeline Result

**Structure**:
```json
{
  "component": "generated-component",
  "css": "generated-styles",
  "validation": "validation-report",
  "metadata": {
    "generation_time": "number",
    "validation_time": "number",
    "repair_attempts": "number"
  }
}
```

**Example Output**:

```json
{
  "component": "import React from 'react';\nimport styles from './Button.module.css';\n\nexport const Button = () => {\n  return <button className={styles.button}>Click me</button>;\n};",
  "css": ".button { background-color: var(--color-bg-brand-primary); }",
  "validation": {
    "summary": {"critical": 0, "high": 0, "medium": 0, "low": 0},
    "violations": []
  },
  "metadata": {
    "generation_time": 2.5,
    "validation_time": 0.1,
    "repair_attempts": 0
  }
}
```

## File Output Formats

### Generated Component Files

**React CSS Module Structure**:
```
Button/
├── Button.tsx
└── Button.module.css
```

**Angular Component Structure**:
```
Button/
├── button.component.ts
├── button.component.html
└── button.component.scss
```

### Validation Report Files

**JSON Report**:
```json
{
  "component": "button",
  "timestamp": "2023-12-07T10:30:00Z",
  "summary": {...},
  "violations": [...]
}
```

**HTML Report**:
```html
<!DOCTYPE html>
<html>
<head>
  <title>Validation Report - Button</title>
</head>
<body>
  <h1>Validation Report: Button</h1>
  <div class="summary">
    <h2>Summary</h2>
    <ul>
      <li>Critical: 0</li>
      <li>High: 1</li>
      <li>Medium: 0</li>
      <li>Low: 0</li>
    </ul>
  </div>
  <div class="violations">
    <h2>Violations</h2>
    <!-- Violation details -->
  </div>
</body>
</html>
```

## Theme Integration Outputs

### CSS Variable Definitions

**Light Theme Variables**:
```css
:root {
  --color-bg-primary: #ffffff;
  --color-text-primary: #1a1a1a;
  --color-bg-brand-primary: #0066cc;
  --color-text-on-brand: #ffffff;
  --spacing-md: 16px;
  --border-radius-md: 4px;
}
```

**Dark Theme Variables**:
```css
[data-theme="dark"] {
  --color-bg-primary: #1a1a1a;
  --color-text-primary: #ffffff;
  --color-bg-brand-primary: #0052a3;
  --color-text-on-brand: #ffffff;
  --spacing-md: 16px;
  --border-radius-md: 4px;
}
```

### Component with Theme Support

**Generated Component**:
```typescript
import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  onClick
}) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

**Generated CSS**:
```css
.button {
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-default);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
}

.primary {
  background-color: var(--color-bg-brand-primary);
  color: var(--color-text-on-brand);
  border-color: var(--color-border-brand-primary);
}

.secondary {
  background-color: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  border-color: var(--color-border-secondary);
}

.button:hover {
  background-color: var(--color-bg-hover);
}

.button:focus {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}
```

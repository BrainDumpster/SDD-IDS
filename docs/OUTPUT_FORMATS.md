# Design Intelligence System - Output Formats

## Overview

The Design Intelligence System produces structured outputs for validation reports and API responses. This document details the expected formats and structures.

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

## File Output Formats

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

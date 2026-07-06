# Design Intelligence System - API Reference

## Overview

The Design Intelligence System provides REST APIs for component generation and validation, along with MCP tools for AI assistant integration.

## REST APIs

### Validation API

**Base URL**: `http://localhost:8000`

#### POST /design/validate

Validates a component against design system rules.

**Request Body**:
```json
{
  "component": "string",
  "content": "string"
}
```

**Parameters**:
- `component` (required): Component name (e.g., "button", "modal")
- `content` (required): HTML/CSS/JSX code to validate

**Response**:
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

**Example**:
```bash
curl -X POST "http://localhost:8000/design/validate" \
  -H "Content-Type: application/json" \
  -d '{
    "component": "button",
    "content": "<button class=\"btn\">Submit</button>"
  }'
```

#### Error Responses

**400 Bad Request**:
```json
{
  "error": "Component name is required",
  "detail": "Missing required field: component"
}
```

**500 Internal Server Error**:
```json
{
  "error": "Validation failed",
  "detail": "Unable to process validation request"
}
```

---

### Generation API

**Base URL**: `http://localhost:8001`

#### POST /design/generate

Generates a component based on design system requirements.

**Request Body**:
```json
{
  "component": "string",
  "request": "string",
  "framework": "string"
}
```

**Parameters**:
- `component` (required): Component name to generate
- `request` (required): Natural language description of requirements
- `framework` (optional): "React" or "Angular" (default: "React")

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

**Example**:
```bash
curl -X POST "http://localhost:8001/design/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "component": "button",
    "request": "Generate a primary button with hover effect",
    "framework": "React"
  }'
```

#### Response Structure

**Component Field**: Generated component code
- React: Complete TypeScript/JavaScript component
- Angular: Component class, template, and styles

**CSS Field**: Generated styles
- CSS Modules: `.module.css` content
- CSS-in-JS: Empty (styles embedded in component)
- Angular SCSS: Component-specific styles

**Validation Field**: Validation report for generated code

---

## Python APIs

### Validation Module

#### validate_design(component, code) -> dict

Validates a component implementation against design system rules.

**Parameters**:
- `component` (str): Component name
- `code` (str): HTML/CSS/JSX code

**Returns**: Validation report with summary and violations

**Raises**:
- `ValueError`: If component name or code is empty

**Example**:
```python
from validation.validate_design import validate_design

report = validate_design("button", "<button>Click me</button>")
print(f"Critical issues: {report['summary']['critical']}")
```

---

### Generation Module

#### ComponentGenerator

Main class for component generation.

**Constructor**:
```python
ComponentGenerator(model: str = "llama3")
```

**Methods**:

##### generate(context, framework, style_mode) -> dict

Generates component code based on context and parameters.

**Parameters**:
- `context` (dict): Component context with rules, tokens, anatomy
- `framework` (str): "React" or "Angular"
- `style_mode` (StyleMode): CSS_MODULE, CSS_IN_JS, or ANGULAR_SCSS

**Returns**: Structured output with component code and styles

**Example**:
```python
from generation.component_generator import ComponentGenerator
from generation.style_modes import StyleMode

generator = ComponentGenerator()
result = generator.generate(
    context={"rules": "...", "anatomy": ["button"]},
    framework="React",
    style_mode=StyleMode.CSS_MODULE
)
```

---

#### AutoRepairEngine

Automatically repairs generated components using validator feedback.

**Constructor**:
```python
AutoRepairEngine(model: str = "llama3")
```

**Methods**:

##### repair(component_name, generated, max_attempts) -> dict

Repairs component violations automatically.

**Parameters**:
- `component_name` (str): Component name
- `generated` (dict): Generated component data
- `max_attempts` (int): Maximum repair attempts (default: 2)

**Returns**: Repair result with final output and validation

**Example**:
```python
from generation.auto_repair_engine import AutoRepairEngine

repair_engine = AutoRepairEngine()
result = repair_engine.repair(
    component_name="button",
    generated={"component": "<button>Bad code</button>"}
)
```

---

#### GenerationPipeline

Complete pipeline for component generation and validation.

**Constructor**:
```python
GenerationPipeline()
```

**Methods**:

##### run(component, request) -> dict

Runs the complete generation pipeline.

**Parameters**:
- `component` (str): Component name
- `request` (str): Natural language request

**Returns**: Complete result with component, CSS, and validation

**Example**:
```python
from generation.generation_pipeline import GenerationPipeline

pipeline = GenerationPipeline()
result = pipeline.run("button", "Generate a primary button")
```

---

## Configuration APIs

### Component Registry

Component definitions and anatomy requirements.

**Structure**:
```json
{
  "component_name": {
    "anatomy": ["element1", "element2"],
    "variants": ["variant1", "variant2"],
    "states": ["state1", "state2"]
  }
}
```

### Design Rules

Design system rules and constraints.

**Structure**:
```json
{
  "rules": [
    {
      "id": "rule-id",
      "component": "component_name",
      "rule": "Rule description",
      "normalized": "Normalized rule text",
      "type": "rule_type",
      "severity": "severity_level"
    }
  ]
}
```

### Allowed Tokens

Approved CSS custom properties.

**Structure**:
```json
{
  "allowed_tokens": [
    "color-bg-primary",
    "color-text-primary",
    "spacing-md"
  ]
}
```

---

## Error Handling

### Common Error Codes

| Code | Description | Resolution |
|------|-------------|------------|
| 400 | Bad Request | Check request parameters |
| 404 | Not Found | Verify endpoint URL |
| 422 | Validation Error | Check request format |
| 500 | Internal Error | Check server logs |

### Validation Error Types

| Type | Severity | Description |
|------|----------|-------------|
| token_violation | High | Unauthorized CSS variable used |
| structure_violation | Medium | Missing required element |
| rule_violation | Variable | Design rule not followed |

### Generation Error Types

| Error | Cause | Resolution |
|-------|-------|------------|
| Model not available | Ollama model missing | Pull required model |
| Context too large | Input exceeds limits | Reduce context size |
| Invalid framework | Unsupported framework | Use React or Angular |

---

## Rate Limiting

### API Limits

- Validation API: 100 requests/minute
- Generation API: 50 requests/minute
- MCP Tools: No rate limiting

### Response Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1640995200
```

---

## Authentication

### API Keys (Future)

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  -X POST "http://localhost:8000/design/validate" \
  -d '{"component": "button", "content": "..."}'
```

### Environment Variables

```bash
export DESIGN_API_KEY="your-api-key"
export OLLAMA_BASE_URL="http://localhost:11434"
```

---

## Monitoring

### Health Endpoints

```bash
# Validation API health
GET http://localhost:8000/health

# Generation API health
GET http://localhost:8001/health
```

### Metrics

- Request latency
- Validation success rate
- Generation success rate
- Error rates by type

### Logging

```python
import logging
logging.basicConfig(level=logging.INFO)

# Enable debug mode
logger = logging.getLogger("design_intelligence")
logger.setLevel(logging.DEBUG)
```

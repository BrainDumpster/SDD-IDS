# Design Intelligence System - API Reference

## Overview

The Design Intelligence System provides REST APIs for design validation, along with MCP tools for AI assistant integration.

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

## MCP Tools

### Design Validator Tool

**Server**: `design-validator`

#### validate_design_tool(component, code)

Validates UI code against design system rules.

**Parameters**:
- `component` (string): Component name
- `code` (string): Code content to validate

**Returns**: Validation report dictionary

**Example**:
```python
from mcp_tools.design_validator_tool import validate_design_tool

report = validate_design_tool(
    component="button",
    code="<button class=\"btn\">Submit</button>"
)
```

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

## Rate Limiting

### API Limits

- Validation API: 100 requests/minute
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
```

---

## Monitoring

### Health Endpoints

```bash
# Validation API health
GET http://localhost:8000/health
```

### Metrics

- Request latency
- Validation success rate
- Error rates by type

### Logging

```python
import logging
logging.basicConfig(level=logging.INFO)

# Enable debug mode
logger = logging.getLogger("design_intelligence")
logger.setLevel(logging.DEBUG)
```

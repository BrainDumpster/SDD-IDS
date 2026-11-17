# Design Intelligence System Documentation

## Overview

The Design Intelligence System is a platform for validating and managing UI components within a strict design system. It combines Figma-derived design specs with automated validation to ensure design system compliance.

## Documentation Structure

### 📋 [Architecture](./ARCHITECTURE.md)
Complete system architecture, component interactions, and technology stack.

### 💡 [Examples](./EXAMPLES.md)
Practical examples of validation and API usage.

### 📖 [Usage Guide](./USAGE.md)
Step-by-step instructions for installation, configuration, and common usage patterns.

### 🔧 [API Reference](./API_REFERENCE.md)
Complete API documentation for REST endpoints, MCP tools, and Python interfaces.

### 📤 [Output Formats](./OUTPUT_FORMATS.md)
Detailed specifications for all system outputs and response formats.

## Quick Start

### 1. Installation
```bash
# Clone and install
git clone <repository-url>
cd design-intelligence-system
pip install -r requirements.txt
```

### 2. Validation
```python
from validation.validate_design import validate_design

# Validate component
report = validate_design("button", "<button>Click me</button>")
print(f"Violations: {report['summary']}")
```

## Key Features

- **🌙 Theme Awareness**: Light/Dark theme support via CSS variables
- **📋 Design System Compliance**: Strict rule enforcement
- **🚀 Production Ready**: Scalable API architecture

## System Components

### Validation Engine
- Rule validation (design compliance)
- Token validation (CSS variable usage)
- Structure validation (component anatomy)
- Severity scoring (critical to low)

### API Layer
- REST APIs for validation and Figma spec extraction
- MCP tools for AI assistant integration
- Comprehensive error handling

## Validation Types

| Type | Severity | Description |
|------|----------|-------------|
| Token Violation | High | Unauthorized CSS variable |
| Structure Violation | Medium | Missing required element |
| Rule Violation | Variable | Design rule not followed |

## Getting Help

### Common Issues
- **Configuration**: Check JSON configuration files
- **Validation Failures**: Review component registry and rules

### Support Channels
- Documentation: See detailed guides in this folder
- API Reference: Complete endpoint documentation
- Examples: Practical implementation samples

## Development

### Project Structure
```
design-intelligence-system/
├── generation/          # Spec context compilation and offline generators
├── validation/          # Validation engine
├── api/                # REST API endpoints
├── mcp_tools/          # MCP integration tools
├── docs/               # Documentation (this folder)
└── config/             # Configuration files
```

### Contributing
1. Follow the existing code structure
2. Add comprehensive tests
3. Update documentation
4. Ensure design system compliance

## License

[License information]

---

**Next Steps**:
- Read the [Architecture](./ARCHITECTURE.md) for system understanding
- Check [Examples](./EXAMPLES.md) for implementation patterns
- Follow [Usage Guide](./USAGE.md) for setup instructions
- Reference [API Documentation](./API_REFERENCE.md) for integration

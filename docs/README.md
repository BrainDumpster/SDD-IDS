# SDD-IDS Documentation

## Overview

Spec-Driven Design Intelligence System — extracts component specs from Figma, produces `design-spec.md` files, validates generated code, and supports optional LLM-based component generation from specs.

## Documentation Structure

### 📋 [Architecture](./ARCHITECTURE.md)
Complete system architecture, component interactions, and technology stack.

### 💡 [Examples](./EXAMPLES.md)
Practical examples of component generation, validation, and API usage.

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

# Setup Ollama
ollama pull llama3
```

### 2. Basic Usage
```python
from generation.component_generator import ComponentGenerator
from generation.style_modes import StyleMode

# Generate a React component
generator = ComponentGenerator()
result = generator.generate(
    context={"rules": "...", "anatomy": ["button"]},
    framework="React",
    style_mode=StyleMode.CSS_MODULE
)
```

### 3. Validation
```python
from validation.validate_design import validate_design

# Validate component
report = validate_design("button", "<button>Click me</button>")
print(f"Violations: {report['summary']}")
```

## Key Features

- **🎨 Multi-Framework Support**: React (CSS Modules, CSS-in-JS), Angular (SCSS)
- **🌙 Theme Awareness**: Light/Dark theme support via CSS variables
- **🔧 Automated Repair**: Self-healing component generation
- **📋 Design System Compliance**: Strict rule enforcement
- **🔍 Semantic Search**: Intelligent design rule retrieval
- **🚀 Production Ready**: Scalable API architecture

## System Components

### Generation Pipeline
```
Component Context → Style Mode → Prompt Compiler → LLM → Structured Output
```

### Validation Engine
- Rule validation (design compliance)
- Token validation (CSS variable usage)
- Structure validation (component anatomy)
- Severity scoring (critical to low)

### API Layer
- REST APIs for validation and generation
- MCP tools for AI assistant integration
- Comprehensive error handling

## Supported Frameworks

| Framework | Style Modes | Theme Support |
|-----------|-------------|---------------|
| React | CSS Modules, CSS-in-JS | ✅ |
| Angular | SCSS | ✅ |

## Validation Types

| Type | Severity | Description |
|------|----------|-------------|
| Token Violation | High | Unauthorized CSS variable |
| Structure Violation | Medium | Missing required element |
| Rule Violation | Variable | Design rule not followed |

## Getting Help

### Common Issues
- **Ollama Connection**: Ensure Ollama is running and model is pulled
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
├── generation/          # Component generation pipeline
├── validation/          # Validation engine
├── api/                # REST API endpoints
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

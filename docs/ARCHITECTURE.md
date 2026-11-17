# Design Intelligence System Architecture

## Overview

The Design Intelligence System is a platform for managing design system documentation and validating UI components within a strict design system. It extracts component specs from Figma, compiles spec context, and validates code against design system rules and tokens.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Design Intelligence System                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐                          ┌─────────────┐       │
│  │ Spec / Gen  │                          │  Validation │       │
│  │ Modules     │                          │   Engine    │       │
│  └─────────────┘                          └─────────────┘       │
│           │                                       │             │
│           ▼                                       ▼             │
│  ┌─────────────┐                          ┌─────────────┐       │
│  │    API      │                          │   Report    │       │
│  │   Layer     │                          │  Builder    │       │
│  └─────────────┘                          └─────────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Spec Context and Generation Modules

**Location**: `generation/`

**Purpose**: Compiles spec context for each component and produces offline, spec-driven output.

**Key Modules**:
- `ComponentContextCompiler` (`component_context_compiler.py`): Compiles design rules, tokens, and specifications
- `SpecInheritanceResolver` (`spec_inheritance_resolver.py`): Resolves layered IDS / program spec inheritance
- `StyleMode` (`style_modes.py`): Enum of supported style output modes
- `deterministic_storybook/` and `spec_derived/`: Offline spec-driven generators

### 2. Validation Engine

**Location**: `validation/`

**Purpose**: Validates generated components against design system rules and constraints.

**Validation Types**:
- **Rule Validation**: Checks compliance with design rules
- **Token Validation**: Ensures proper CSS variable usage
- **Structure Validation**: Verifies component anatomy
- **Severity Scoring**: Critical, High, Medium, Low priority levels

**Modules**:
- `RuleValidator`: Rule-based compliance checking
- `TokenValidator`: CSS variable validation
- `StructureValidator`: Component anatomy verification
- `SeverityEngine`: Priority scoring system
- `ReportBuilder`: Structured reporting

### 3. API Layer

**Location**: `api/`

**Endpoints**:
- `POST /design/validate`: Validate components against design rules
- `POST /figma/specs/generate`: Extract a component design spec from Figma (Figma Specs API, port 8001)

### 4. MCP Tools

**Location**: `mcp_tools/`

**Purpose**: Model Context Protocol tools for AI assistant integration.

**Tools**:
- `design_validator_tool`: Component validation

## Data Flow

### Spec Flow
1. **Input**: Figma component URL + node ID
2. **Extraction**: Figma MCP client pulls tokens, states, anatomy, measurements
3. **Spec Output**: `components/<programme>/<slug>/design-spec.md`
4. **Context Compilation**: Spec layers and inheritance compiled for consumers

### Validation Flow
1. **Input**: Component name + code content
2. **Rule Checking**: Design rule compliance
3. **Token Analysis**: CSS variable usage
4. **Structure Verification**: Component anatomy
5. **Severity Scoring**: Priority assignment
6. **Report Generation**: Structured output

## Technology Stack

- **Framework**: FastAPI for APIs
- **Validation**: Custom rule engine
- **MCP**: Model Context Protocol integration

## Key Features

- **Multi-Framework Support**: React (CSS Modules, CSS-in-JS, Base UI), Angular (SCSS)
- **Theme Awareness**: Light/Dark theme support via CSS variables
- **Design System Compliance**: Strict rule enforcement
- **Production Ready**: Scalable API architecture

## Configuration Files

- `component_registry.json`: Component definitions and anatomy
- `rules.json`: Design system rules
- `allowed_tokens.json`: Approved CSS variables

## Integration Points

- **IDE Integration**: MCP tools for AI assistants
- **CI/CD Pipeline**: Validation automation
- **Design Tools**: Figma integration potential
- **Component Libraries**: Direct component publishing

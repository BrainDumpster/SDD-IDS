# SDD-IDS Architecture

## Overview

Spec-Driven Design Intelligence System — extracts component specs from Figma, produces `design-spec.md` files, validates generated code, and supports optional LLM-based component generation from specs.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Design Intelligence System                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │   Component  │    │  Design Spec │    │  Validation │         │
│  │ Generation   │    │   Pipeline   │    │   Engine    │         │
│  │   Pipeline   │    │  (Figma)     │    │             │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
│           │                   │                   │           │
│           ▼                   ▼                   ▼           │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │    API      │    │ Component   │    │   Report    │         │
│  │   Layer     │◄──►│  Registry   │◄──►│  Builder    │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Component Generation Pipeline

**Location**: `generation/`

**Purpose**: Generates production-ready UI components aligned with design system rules.

**Flow**:
```
Component Context
       │
       ▼
Style Mode Selector
       │
       ▼
Prompt Compiler (Mode-aware)
       │
       ▼
LLM Generator
       │
       ▼
Structured Output
  ├── Markup
  ├── Styles (mode-specific)
  └── Theme Tokens
```

**Key Modules**:
- `ComponentContextCompiler`: Compiles design rules, tokens, and specifications
- `ComponentGenerator`: LLM-powered code generation with framework support
- `AutoRepairEngine`: Automated validation and repair loop
- `StyleMode`: Enum for CSS Modules, CSS-in-JS, Angular SCSS

### 2. Design Spec Pipeline

**Location**: `components/`, `tokens/`, design-spec intake skills

**Purpose**: Extract Figma component data into framework-agnostic `design-spec.md` files and theme CSS.

**Components**:
- Figma MCP / REST extraction
- Token sync into programme theme CSS
- Canonical spec files under `components/<programme>/<slug>/`

### 3. Validation Engine

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

### 4. API Layer

**Location**: `api/`

**Endpoints**:
- `POST /design/validate`: Validate components against design rules
- `POST /design/generate`: Generate new components

### 5. External MCP (IDE)

**Figma MCP** runs in your IDE (Cursor Figma plugin) — not as a folder in this repo. Use it for live spec extraction during the design-spec intake wizard.

## Data Flow

### Generation Flow
1. **Input**: Component name + user request
2. **Context Compilation**: Gather design rules, tokens, anatomy
3. **Prompt Building**: Mode-aware prompt construction
4. **LLM Generation**: Framework-specific code generation
5. **Validation**: Automated rule checking
6. **Repair**: Iterative fixing of violations
7. **Output**: Validated component + validation report

### Validation Flow
1. **Input**: Component name + code content
2. **Rule Checking**: Design rule compliance
3. **Token Analysis**: CSS variable usage
4. **Structure Verification**: Component anatomy
5. **Severity Scoring**: Priority assignment
6. **Report Generation**: Structured output

## Technology Stack

- **LLM**: Ollama (Llama3) — optional for generation APIs
- **Framework**: FastAPI for APIs
- **Validation**: Custom rule engine
- **MCP**: Model Context Protocol integration (Figma MCP in IDE)

## Key Features

- **Multi-Framework Support**: React (CSS Modules, CSS-in-JS), Angular (SCSS)
- **Theme Awareness**: Light/Dark theme support via CSS variables
- **Automated Repair**: Self-healing component generation
- **Design System Compliance**: Strict rule enforcement
- **Production Ready**: Scalable API architecture

## Configuration Files

- `component_registry.json`: Component definitions and anatomy
- `rules.json`: Design system rules
- `allowed_tokens.json`: Approved CSS variables
- Design knowledge base: Component specifications and tokens

## Integration Points

- **IDE Integration**: MCP tools for AI assistants
- **CI/CD Pipeline**: Validation automation
- **Design Tools**: Figma integration potential
- **Component Libraries**: Direct component publishing

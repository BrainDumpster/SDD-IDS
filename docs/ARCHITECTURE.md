# Design Intelligence RAG System Architecture

## Overview

The Design Intelligence RAG System is a comprehensive AI-powered platform for generating, validating, and managing UI components within a strict design system. It combines retrieval-augmented generation (RAG) with automated validation and repair mechanisms to ensure design system compliance.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Design Intelligence System                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │   Component  │    │   Design     │    │  Validation │         │
│  │ Generation   │    │ Intelligence │    │   Engine    │         │
│  │   Pipeline   │    │    RAG       │    │             │         │
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

### 2. Design Intelligence RAG

**Location**: `rag/`

**Purpose**: Retrieves relevant design rules and component specifications using semantic search.

**Components**:
- Vector database of design rules
- Semantic search capabilities
- Component specification retrieval
- Design rule matching

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

### 5. MCP Tools

**Location**: `mcp_tools/`

**Purpose**: Model Context Protocol tools for AI assistant integration.

**Tools**:
- `design_validator_tool`: Component validation
- `component_generator_tool`: Component generation

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

- **LLM**: Ollama (Llama3)
- **Framework**: FastAPI for APIs
- **Validation**: Custom rule engine
- **RAG**: Vector-based semantic search
- **MCP**: Model Context Protocol integration

## Key Features

- **Multi-Framework Support**: React (CSS Modules, CSS-in-JS), Angular (SCSS)
- **Theme Awareness**: Light/Dark theme support via CSS variables
- **Automated Repair**: Self-healing component generation
- **Design System Compliance**: Strict rule enforcement
- **Semantic Search**: Intelligent design rule retrieval
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

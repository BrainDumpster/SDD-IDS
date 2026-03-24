# Code Generation Architecture

## Overview

The code generation system follows a structured pipeline to transform component context into mode-aware UI implementations with proper theming support.

## Architecture Flow

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

## Pipeline Components

### 1. Component Context
- Input: Component specifications, design requirements, and constraints
- Contains: Component anatomy, behavior rules, accessibility requirements

### 2. Style Mode Selector
- Determines the appropriate styling mode (light/dark/auto)
- Applies mode-specific configuration and constraints

### 3. Prompt Compiler (Mode-aware)
- Compiles component context and mode information into structured prompts
- Ensures LLM receives mode-aware instructions and constraints

### 4. LLM Generator
- Generates code based on compiled prompts
- Produces mode-aware implementations with proper theming

### 5. Structured Output
- **Markup**: HTML/JSX structure with semantic elements
- **Styles (mode-specific)**: CSS with theme variable usage
- **Theme Tokens**: Proper CSS custom properties for theming

## Key Features

- **Mode Awareness**: Generates code that respects light/dark theme requirements
- **Theme Integration**: Ensures proper usage of CSS custom properties
- **Structured Output**: Separates concerns for maintainability
- **Design System Compliance**: Enforces component anatomy and rules

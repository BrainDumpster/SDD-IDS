# Design System Documentation Agent

A framework-agnostic Cascade skill for creating comprehensive design system documentation. This agent specializes in component documentation, design tokens, and usage guidelines that work across any tech stack.

## Features

- **Component Documentation**: Structured templates for documenting components with anatomy, states, variations, and accessibility
- **Design Tokens**: Comprehensive token documentation with naming conventions and usage patterns
- **Usage Guidelines**: Clear dos and don'ts, best practices, and anti-patterns
- **Framework-Agnostic**: Works with React, Vue, Angular, vanilla CSS, or any other framework
- **Accessibility-First**: Built-in a11y considerations and guidelines
- **Consistent Structure**: Standardized templates for scannable, maintainable documentation

## Installation

### Option 1: Global Installation (Recommended)

Install for use across all projects:

```bash
# Clone the repository
git clone https://github.com/your-org/ids-doc-agent.git

# Copy to global skills directory
mkdir -p ~/.agents/skills
cp -r ids-doc-agent ~/.agents/skills/
```

### Option 2: Project-Specific Installation

Install for a specific project:

```bash
# Clone the repository
git clone https://github.com/your-org/ids-doc-agent.git

# Copy to project skills directory
mkdir -p .agents/skills
cp -r ids-doc-agent .agents/skills/
```

### Option 3: Using the Installation Script

```bash
curl -fsSL https://raw.githubusercontent.com/your-org/ids-doc-agent/main/install.sh | bash
```

## Usage

Once installed, invoke the agent in Cascade by typing:

```
@ids-doc-agent
```

### Example Prompts

- "Help me document a button component"
- "Create documentation for our color tokens"
- "Write usage guidelines for form inputs"
- "What should be included in component documentation?"
- "Help me structure our design system docs"

## What the Agent Can Do

### Component Documentation
- Create structured component pages with consistent anatomy
- Document states, variations, and behaviors
- Provide accessibility guidelines
- Include code examples (framework-agnostic)
- Add dos and don'ts with examples

### Design Tokens
- Document colors, typography, spacing, shadows, etc.
- Explain naming conventions and usage patterns
- Provide token references for designers and developers
- Document token relationships and hierarchies

### Usage Guidelines
- Create clear dos and don'ts
- Document best practices and anti-patterns
- Provide content strategy guidelines
- Include editorial voice and tone guidelines

### Documentation Structure
- Organize documentation for scannability
- Create consistent information architecture
- Establish navigation patterns
- Maintain cross-references

## Documentation Standards

The agent follows these standards:

- **Component Page Structure**: Overview, When to Use, Anatomy, States & Variations, Accessibility, Best Practices, Code Examples, Related Components
- **Writing Style**: Direct, actionable, scannable, consistent, complete
- **Framework-Agnostic**: Focus on concepts rather than specific implementations
- **Accessibility-First**: Built-in a11y requirements and considerations

## Customization

You can customize the agent for your specific design system by editing the `SKILL.md` file:

1. Update the frontmatter metadata (name, description, version)
2. Add your company-specific terminology and patterns
3. Include your design system's specific guidelines
4. Add examples from your actual components

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues or questions, please open an issue on GitHub.

## Roadmap

- [ ] Add more component templates
- [ ] Include Storybook documentation patterns
- [ ] Add Figma integration guidance
- [ ] Create migration guides for updating documentation
- [ ] Add localization support

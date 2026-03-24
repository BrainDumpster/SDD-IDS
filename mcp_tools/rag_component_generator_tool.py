"""
MCP Tool for RAG-Powered Component Generation
Takes natural language queries and generates framework components
"""

from mcp.server.fastmcp import FastMCP
from generation.rag_component_generator import RAGComponentGenerator, generate_component_from_query

mcp = FastMCP("rag-component-generator")

generator = RAGComponentGenerator()


@mcp.tool()
def generate_component_from_query(
    query: str,
    framework: str = "React",
    style_mode: str = "css-module"
) -> dict:
    """
    Generate a UI component from natural language query using RAG design knowledge
    
    Args:
        query: Natural language description of the component you want to create
        framework: Target framework (React, Angular)
        style_mode: Styling approach (css-module, css-in-js, angular-scss)
    
    Examples:
    - "Create a primary button with hover effects and loading state"
    - "Build a responsive navigation menu with dropdown submenus"
    - "Generate a data table with sorting, filtering, and pagination"
    - "Create a modal dialog with form validation"
    - "Build a card component for displaying user profiles"
    
    The system will:
    1. Analyze your query to extract requirements
    2. Retrieve relevant design system knowledge (tokens, layout, accessibility)
    3. Generate production-ready code following design system guidelines
    4. Include proper accessibility, dark theme support, and responsive design
    """
    
    return generator.generate_from_query(query, framework, style_mode)


@mcp.tool()
def generate_button(
    description: str,
    variant: str = "primary",
    framework: str = "React",
    style_mode: str = "css-module"
) -> dict:
    """
    Generate a button component with specific variant and features
    
    Args:
        description: What the button should do or display
        variant: Button style (primary, secondary, danger, success, warning)
        framework: Target framework (React, Angular)
        style_mode: Styling approach (css-module, css-in-js, angular-scss)
    
    Examples:
    - description: "Submit form with loading spinner", variant: "primary"
    - description: "Cancel operation", variant: "secondary"
    - description: "Delete item with confirmation", variant: "danger"
    """
    
    query = f"Create a {variant} button that {description}"
    return generator.generate_from_query(query, framework, style_mode)


@mcp.tool()
def generate_form(
    form_type: str,
    fields: list[str],
    framework: str = "React",
    style_mode: str = "css-module"
) -> dict:
    """
    Generate a form component with specified fields
    
    Args:
        form_type: Type of form (login, contact, registration, survey)
        fields: List of field types (email, password, text, select, checkbox)
        framework: Target framework (React, Angular)
        style_mode: Styling approach (css-module, css-in-js, angular-scss)
    
    Examples:
    - form_type: "login", fields: ["email", "password", "checkbox"]
    - form_type: "contact", fields: ["text", "email", "textarea", "submit"]
    """
    
    query = f"Create a {form_type} form with fields: {', '.join(fields)}"
    return generator.generate_from_query(query, framework, style_mode)


@mcp.tool()
def generate_navigation(
    nav_type: str,
    features: list[str] = None,
    framework: str = "React",
    style_mode: str = "css-module"
) -> dict:
    """
    Generate a navigation component
    
    Args:
        nav_type: Type of navigation (header, sidebar, breadcrumb, tabs, menu)
        features: Additional features (dropdown, responsive, sticky, collapsible)
        framework: Target framework (React, Angular)
        style_mode: Styling approach (css-module, css-in-js, angular-scss)
    
    Examples:
    - nav_type: "header", features: ["dropdown", "responsive"]
    - nav_type: "sidebar", features: ["collapsible", "sticky"]
    - nav_type: "tabs", features: ["responsive"]
    """
    
    features_str = f" with {', '.join(features)}" if features else ""
    query = f"Create a {nav_type} navigation{features_str}"
    return generator.generate_from_query(query, framework, style_mode)


@mcp.tool()
def generate_data_display(
    component_type: str,
    data_type: str,
    features: list[str] = None,
    framework: str = "React",
    style_mode: str = "css-module"
) -> dict:
    """
    Generate a data display component
    
    Args:
        component_type: Type of component (table, card, list, grid, chart)
        data_type: Type of data to display (users, products, posts, analytics)
        features: Additional features (sorting, filtering, pagination, search)
        framework: Target framework (React, Angular)
        style_mode: Styling approach (css-module, css-in-js, angular-scss)
    
    Examples:
    - component_type: "table", data_type: "users", features: ["sorting", "pagination"]
    - component_type: "card", data_type: "products", features: ["grid", "filter"]
    - component_type: "list", data_type: "posts", features: ["search", "pagination"]
    """
    
    features_str = f" with {', '.join(features)}" if features else ""
    query = f"Create a {component_type} for displaying {data_type}{features_str}"
    return generator.generate_from_query(query, framework, style_mode)


@mcp.tool()
def get_component_suggestions(query: str) -> dict:
    """
    Get suggestions for component types based on query analysis
    
    Args:
        query: Natural language description of what you want to build
    
    Returns:
        Suggested component types and approaches
    """
    
    suggestions = {
        "button": ["primary", "secondary", "danger", "success", "warning", "link"],
        "form": ["login", "contact", "registration", "survey", "search"],
        "navigation": ["header", "sidebar", "breadcrumb", "tabs", "menu", "pagination"],
        "data_display": ["table", "card", "list", "grid", "chart", "modal"],
        "feedback": ["alert", "toast", "notification", "badge", "progress"],
        "input": ["text", "select", "checkbox", "radio", "textarea", "date"],
        "layout": ["container", "grid", "flex", "section", "panel"]
    }
    
    # Simple keyword matching for suggestions
    query_lower = query.lower()
    suggested_types = []
    
    for component_type, variants in suggestions.items():
        keywords = {
            "button": ["button", "click", "submit", "action"],
            "form": ["form", "input", "field", "submit", "validation"],
            "navigation": ["nav", "menu", "link", "page", "route"],
            "data_display": ["table", "list", "card", "grid", "display", "show"],
            "feedback": ["alert", "message", "notification", "status", "feedback"],
            "input": ["input", "field", "enter", "type", "form"],
            "layout": ["layout", "container", "section", "grid", "flex"]
        }
        
        if any(keyword in query_lower for keyword in keywords.get(component_type, [])):
            suggested_types.append({
                "type": component_type,
                "variants": variants[:3],  # Top 3 variants
                "description": f"Consider a {component_type} component"
            })
    
    return {
        "query": query,
        "suggestions": suggested_types,
        "usage": "Use generate_component_from_query() with any of these suggestions"
    }


if __name__ == "__main__":
    mcp.run()

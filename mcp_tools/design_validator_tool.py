from mcp.server.fastmcp import FastMCP
from validation.validate_design import validate_design

mcp = FastMCP("design-validator")


@mcp.tool()
def validate_design_tool(component: str, code: str) -> dict:
    """
    Validate UI code against design system rules.
    """
    return validate_design(component, code)


if __name__ == "__main__":
    mcp.run()
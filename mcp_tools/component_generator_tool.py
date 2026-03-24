from mcp.server.fastmcp import FastMCP

from generation.component_generator import ComponentGenerator
from generation.auto_repair_engine import AutoRepairEngine
from generation.style_modes import StyleMode

mcp = FastMCP("design-component-generator")

generator = ComponentGenerator()
repair_engine = AutoRepairEngine()


@mcp.tool()
def generate_component(
    component: str,
    description: str,
    framework: str = "React",
    style_mode: str = "css-module"
) -> dict:
    """
    Generate production-ready UI component aligned with design system.
    """

    context = {
        "rules": "",
        "anatomy": "",
        "tokens": "",
        "spec": "",
        "request": description
    }

    style_enum = StyleMode(style_mode)

    generated = generator.generate(
        context=context,
        framework=framework,
        style_mode=style_enum
    )

    repaired = repair_engine.repair(component, generated)

    return repaired


if __name__ == "__main__":
    mcp.run()
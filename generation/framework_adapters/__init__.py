from generation.framework_adapters.base_adapter import FrameworkAdapter
from generation.framework_adapters.base_ui_adapter import BaseUIAdapter
from generation.framework_adapters.react_css_adapter import ReactCSSAdapter
from generation.framework_adapters.angular_adapter import AngularAdapter


def get_adapter(framework: str, style_mode) -> FrameworkAdapter:
    """Return the appropriate adapter for framework + style mode."""
    from generation.style_modes import StyleMode

    if style_mode == StyleMode.BASE_UI_CSS:
        return BaseUIAdapter()
    if framework.lower() == "angular":
        return AngularAdapter()
    return ReactCSSAdapter(style_mode)

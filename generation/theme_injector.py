class ThemeInjector:

    def __init__(self, config=None):
        """
        Args:
            config: Optional DesignSystemConfig for theme-aware injection.
        """
        self._config = config

    def inject(self, css_code: str) -> str:
        """
        Wrap CSS with theme-ready variables if needed.

        When a DesignSystemConfig is provided and points to a theme CSS file,
        the header references that file instead of embedding empty blocks.
        """
        if self._config and self._config.theme_css_path:
            theme_header = f"""
/* Theme tokens: {self._config.theme_css_path} */

:root {{
  /* {self._config.display_name} Light Theme — loaded from {self._config.theme_css_path} */
}}

[data-theme="dark"] {{
  /* {self._config.display_name} Dark Theme — loaded from {self._config.theme_css_path} */
}}
"""
        else:
            theme_header = """
:root {
  /* Default Theme Variables */
}

[data-theme="dark"] {
  /* Dark Theme Overrides */
}
"""
        return theme_header + "\n" + css_code
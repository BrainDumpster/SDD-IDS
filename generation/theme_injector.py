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
            baseline_path = self._config.resolve(self._config.baseline_theme_css_path)
            program_path = self._config.resolve(
                self._config.program_theme_css_path or self._config.theme_css_path
            )
            baseline_css = baseline_path.read_text() if baseline_path.exists() else ""
            program_css = (
                program_path.read_text()
                if program_path.exists() and program_path != baseline_path
                else ""
            )
            theme_header = f"""
/* Theme tokens baseline: {self._config.baseline_theme_css_path} */
/* Theme tokens program delta: {self._config.program_theme_css_path or self._config.theme_css_path} */

{baseline_css}

{program_css}
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
import re
from typing import Dict, Any
from langchain_community.llms import Ollama

from generation.style_modes import StyleMode
from generation.prompt_templates import build_prompt, inject_context


class ComponentGenerator:
    """
    Production-grade AI Component Generator
    ---------------------------------------
    Supports:
      • React (CSS Modules / CSS-in-JS)
      • Angular (SCSS)
      • Dark/Light theme token usage
      • Structured output parsing
    """

    def __init__(self, model: str = "llama3"):
        self.llm = Ollama(
            model=model,
            temperature=0.1
        )

    # -----------------------------------------------------
    # PUBLIC GENERATION METHOD
    # -----------------------------------------------------

    def generate(
        self,
        context: Dict[str, Any],
        framework: str = "React",
        style_mode: StyleMode = StyleMode.CSS_MODULE
    ) -> Dict[str, str]:
        """
        Generate component code.

        Args:
            context: compiled component context
            framework: React | Angular
            style_mode: CSS_MODULE | CSS_IN_JS | ANGULAR_SCSS

        Returns:
            dict with structured output sections
        """

        # 1️⃣ Build prompt
        base_prompt = build_prompt(framework, style_mode)
        full_prompt = inject_context(base_prompt, context)

        # 2️⃣ Generate with LLM
        raw_output = self.llm.invoke(full_prompt)

        # 3️⃣ Parse structured output
        parsed = self._parse_output(raw_output, framework, style_mode)

        return parsed

    # -----------------------------------------------------
    # OUTPUT PARSER
    # -----------------------------------------------------

    def _parse_output(
        self,
        text: str,
        framework: str,
        style_mode: StyleMode
    ) -> Dict[str, str]:
        """
        Extract structured sections from model output.
        """

        def extract(tag: str):
            pattern = rf"=== {tag} ===(.*?)(?===|\Z)"
            match = re.search(pattern, text, re.DOTALL)
            return match.group(1).strip() if match else ""

        # ---------------- React ----------------
        if framework.lower() == "react":

            if style_mode == StyleMode.CSS_MODULE:
                return {
                    "component": extract("COMPONENT"),
                    "css": extract("CSS"),
                    "framework": "react",
                    "style_mode": "css-module"
                }

            elif style_mode == StyleMode.CSS_IN_JS:
                return {
                    "component": extract("COMPONENT"),
                    "css": "",
                    "framework": "react",
                    "style_mode": "css-in-js"
                }

        # ---------------- Angular ----------------
        elif framework.lower() == "angular":

            return {
                "component_ts": extract("COMPONENT_TS"),
                "component_html": extract("COMPONENT_HTML"),
                "component_scss": extract("COMPONENT_SCSS"),
                "framework": "angular",
                "style_mode": "angular-scss"
            }

        # Fallback
        return {"raw": text}
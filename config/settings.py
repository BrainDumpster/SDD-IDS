import os
from dotenv import load_dotenv

load_dotenv()


class Settings:

    github_host = os.getenv("GITHUB_HOST")
    github_repo = os.getenv("GITHUB_REPO")
    github_token = os.getenv("GITHUB_PERSONAL_ACCESS_TOKEN")
    # Git branch/sha for Contents API (?ref=). Unset → "main" (ids-content tree/main/content). Empty string → omit ref (repo default).
    _gh_ref = os.getenv("GITHUB_REF")
    github_ref = "main" if _gh_ref is None else (_gh_ref.strip() or None)

    ollama_host = os.getenv("OLLAMA_HOST", "http://127.0.0.1:11434")
    ollama_vision_model = os.getenv("OLLAMA_VISION_MODEL", "llava")

    figma_token = os.getenv("FIGMA_TOKEN")
    # Optional default file key only. Multi-component flows use `figmaUrl` per row in
    # `data/component-figma-map.json` and derive file_key + node_id from that URL.
    figma_file_key = os.getenv("FIGMA_FILE_KEY")
    figma_mcp_url = os.getenv("FIGMA_MCP_URL")

    # Text model name on Ollama (host = OLLAMA_HOST above)
    llm_model = os.getenv("LLM_MODEL", "llama3")

    # Active design system: "ids" (default) or "synapse"
    design_system = os.getenv("DESIGN_SYSTEM", "ids")

    _design_system_config = None

    @property
    def design_system_config(self):
        """Lazy-load the active DesignSystemConfig from YAML."""
        if self._design_system_config is None:
            from config.design_system_config import load_design_system
            self._design_system_config = load_design_system(self.design_system)
        return self._design_system_config


settings = Settings()
"""
Abstract base class for framework-specific generation adapters.
"""

from abc import ABC, abstractmethod
from typing import Dict, Any


class FrameworkAdapter(ABC):
    """
    Each adapter knows how to produce import rules, component structure rules,
    and styling rules for a given framework/style-mode combination.
    These strings are injected into the LLM prompt at generation time.
    """

    @abstractmethod
    def get_import_rules(self) -> str:
        """Return prompt section describing import conventions."""

    @abstractmethod
    def get_component_structure(self) -> str:
        """Return prompt section describing component structure patterns."""

    @abstractmethod
    def get_styling_rules(self) -> str:
        """Return prompt section describing styling conventions."""

    @abstractmethod
    def get_output_structure(self) -> str:
        """Return the expected === SECTION === output structure."""

    def get_full_rules(self) -> str:
        """Combine all adapter rules into a single prompt section."""
        return "\n\n".join([
            self.get_import_rules(),
            self.get_component_structure(),
            self.get_styling_rules(),
            self.get_output_structure(),
        ])

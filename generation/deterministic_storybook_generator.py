"""
Compatibility shim.

Prefer imports from:
  generation.deterministic_storybook.*
"""

from generation.deterministic_storybook.ids.button import generate_ids_button_story
from generation.deterministic_storybook.ids.checkbox import generate_ids_checkbox_story
from generation.deterministic_storybook.models import DeterministicStorybookOptions

__all__ = [
    "DeterministicStorybookOptions",
    "generate_ids_button_story",
    "generate_ids_checkbox_story",
]

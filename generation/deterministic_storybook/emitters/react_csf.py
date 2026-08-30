"""React CSF emitters — extend incrementally as generators adopt StoryModel."""

from generation.deterministic_storybook.story_model import StoryModel


def emit_react_csf_placeholder(model: StoryModel) -> None:
    """Reserved for migrating React generators to StoryModel + emit_react_csf."""
    raise NotImplementedError(f"React CSF emitter not yet wired for {model.component_slug}")

"""Call Ollama chat API with image bytes for design-spec extraction."""
from __future__ import annotations

import base64
from typing import Optional

import requests

from config.settings import settings


def describe_design_image(
    image_bytes: bytes,
    *,
    section_context: str,
    component_name: str,
    alt: str,
    host: Optional[str] = None,
    model: Optional[str] = None,
    timeout: int = 300,
) -> str:
    """
    Ask a vision model to extract implementation-oriented bullets for a design image.
    Returns markdown bullet list text (plain lines starting with -).

    Uses `OLLAMA_HOST` and `OLLAMA_VISION_MODEL` from `.env` via `config.settings`
    (e.g. remote Ollama at http://100.65.144.93:11434).
    """
    base = (host or settings.ollama_host or "http://127.0.0.1:11434").rstrip("/")
    model = model or settings.ollama_vision_model or "llava"

    # NOTE: Ollama's vision/image pipeline crashes on SVG inputs in this
    # environment (server returns "model runner has unexpectedly stopped").
    # When we detect SVG XML, switch to text-based extraction:
    # send the SVG markup as plain text to the configured LLM instead of using
    # the "images" field.
    is_svg = image_bytes.lstrip().startswith(b"<svg")

    if is_svg:
        # Use the already-selected model for this call (typically `llava:latest`)
        # but do not send it through the image pipeline.
        text_model = model
        svg_text = image_bytes.decode("utf-8", errors="ignore")
        svg_text = svg_text[:50000]  # keep prompts bounded

        prompt = (
            "You are a design-system engineer. The following input is SVG XML "
            f"from documentation under this heading path: {section_context or '(unknown)'}. "
            f"Component: {component_name}. Image alt text: {alt or '(none)'}.\n\n"
            "Parse the SVG XML and extract ONLY what is visible in the diagram:\n"
            "- Colors (hex or named swatch values) if present (fills/strokes/text).\n"
            "- State names (default/hover/active/disabled/focus/pressed) if present as text labels.\n"
            "- Any visible mapping for Background/Bg, Outline/Border, Text, Icon.\n\n"
            "Output a markdown bullet list (each line starts with '- '). "
            "When possible, emit lines like:\n"
            "- Disabled Bg: ... - #RRGGBB\n"
            "- Disabled Outline: ... - #RRGGBB\n"
            "- Disabled Text/Icon: ... - #RRGGBB\n"
            "- Hover Bg: ... - #RRGGBB\n"
            "- Active Bg: ... - #RRGGBB\n"
            "- Focus Outline: ... - #RRGGBB\n\n"
            "Do not invent values. Use a final bullet '- Notes: ...' for uncertainty.\n\n"
            "SVG XML:\n"
            f"{svg_text}"
        )

        payload = {
            "model": text_model,
            "messages": [{"role": "user", "content": prompt}],
            "stream": False,
        }
    else:
        prompt = f"""You are a design-system engineer. The image appears in documentation under this heading path: {section_context or "(unknown)"}.
Component: {component_name}. Image alt text: {alt or "(none)"}.

Extract ONLY what is visible in the image. Output a markdown bullet list (each line starts with "- ").
Include when visible:
- Spacing / padding / gaps with numbers and units
- Sizes of regions or components
- Typography (font size, weight) if labeled
- Colors (hex or names) if shown
- Anatomy part labels
- State names (hover, focus, etc.) if shown
- Dos or Don'ts if the image is a guideline panel
- Any comparison between variants if shown

If something is not visible, do not invent it. Use a final bullet "- Notes: ..." for uncertainty."""

        b64 = base64.b64encode(image_bytes).decode("ascii")
        payload = {
            "model": model,
            "messages": [
                {
                    "role": "user",
                    "content": prompt,
                    "images": [b64],
                }
            ],
            "stream": False,
        }
    r = requests.post(f"{base}/api/chat", json=payload, timeout=timeout)
    r.raise_for_status()
    data = r.json()
    msg = (data.get("message") or {}).get("content") or ""
    return msg.strip()

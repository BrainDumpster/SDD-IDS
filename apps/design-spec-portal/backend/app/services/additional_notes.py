"""Validate optional user additionalNotes before they enter the agent prompt."""

from __future__ import annotations

import re
import unicodedata

# Keep notes short — design context, not a second prompt takeover.
MAX_ADDITIONAL_NOTES_CHARS = 2000
MAX_ADDITIONAL_NOTES_LINES = 80

# High-confidence secret / credential shapes (reject, do not store).
_SECRET_PATTERNS: list[tuple[str, re.Pattern[str]]] = [
    ("private key block", re.compile(r"-----BEGIN [A-Z0-9 ]*PRIVATE KEY-----")),
    ("Cursor API key", re.compile(r"(?i)\bcursor_[a-z0-9_\-]{8,}\b")),
    ("Figma token", re.compile(r"(?i)\bfigd_[a-z0-9_\-]{8,}\b")),
    ("GitHub PAT", re.compile(r"(?i)\b(ghp|gho|ghu|ghs|ghr)_[a-z0-9]{20,}\b")),
    ("GitHub fine-grained PAT", re.compile(r"(?i)\bgithub_pat_[a-z0-9_]{20,}\b")),
    ("AWS access key", re.compile(r"\bAKIA[0-9A-Z]{16}\b")),
    ("Bearer token literal", re.compile(r"(?i)bearer\s+[a-z0-9_\-\.=]{20,}")),
    ("Authorization header", re.compile(r"(?i)authorization\s*[:=]\s*\S{12,}")),
    ("env secret assignment", re.compile(
        r"(?i)\b(CURSOR_API_KEY|FIGMA_TOKEN|GITHUB_TOKEN|OPENAI_API_KEY|AWS_SECRET_ACCESS_KEY)\s*="
    )),
]

# Prompt-injection / instruction-override attempts.
_INJECTION_PATTERNS: list[tuple[str, re.Pattern[str]]] = [
    (
        "instruction override",
        re.compile(
            r"(?i)\b("
            r"ignore\s+(all\s+)?(previous|prior|above|earlier)\s+(instructions?|prompts?|rules?)"
            r"|disregard\s+(all\s+)?(previous|prior|above|system)"
            r"|forget\s+(all\s+)?(previous|prior|above)\s+(instructions?|prompts?|rules?)"
            r"|override\s+(the\s+)?(system|guardrails?|allowlist|skill)"
            r")\b"
        ),
    ),
    (
        "role / system takeover",
        re.compile(
            r"(?i)\b("
            r"you\s+are\s+now\b"
            r"|new\s+system\s+prompt\b"
            r"|jailbreak\b"
            r"|do\s+anything\s+now\b"
            r"|act\s+as\s+(root|admin|developer\s+mode)\b"
            r")\b"
        ),
    ),
    (
        "fake system / developer block",
        re.compile(r"(?i)(```|\b)(system|developer)\s*:"),
    ),
    (
        "guardrail bypass",
        re.compile(
            r"(?i)\b("
            r"bypass\s+(the\s+)?(guardrails?|allowlist|safety)"
            r"|disable\s+(the\s+)?(guardrails?|allowlist|safety)"
            r"|expand\s+(the\s+)?write[- ]?path"
            r"|ignore\s+(the\s+)?write[- ]?path\s+allowlist"
            r")\b"
        ),
    ),
]

# Dangerous tooling / exfil / repo escape (notes are design context only).
_DANGEROUS_PATTERNS: list[tuple[str, re.Pattern[str]]] = [
    (
        "shell / exfil command",
        re.compile(
            r"(?i)\b("
            r"curl\s+[^\n]{0,80}\|\s*(ba)?sh"
            r"|wget\s+[^\n]{0,80}\|\s*(ba)?sh"
            r"|rm\s+-rf\s+/"
            r"|chmod\s+777\b"
            r"|nc\s+-e\b"
            r"|/etc/passwd\b"
            r"|exfiltrat"
            r")\b"
        ),
    ),
    (
        "repo / remote override",
        re.compile(
            r"(?i)\b("
            r"change\s+(the\s+)?(cloud_)?repo"
            r"|clone\s+https?://"
            r"|git\s+remote\s+set-url"
            r"|push\s+(--force|-f)\b"
            r"|merge\s+to\s+(main|master)\b"
            r")\b"
        ),
    ),
    (
        "unsafe URI scheme",
        re.compile(r"(?i)\b(javascript|data|file|vbscript):"),
    ),
]

_CONTROL_CHARS = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]")


def sanitize_additional_notes(raw: str | None) -> str | None:
    """
    Normalize optional additionalNotes.
    Returns None for empty input; raises ValueError if unsafe / invalid.
    """
    if raw is None:
        return None
    if not isinstance(raw, str):
        raise ValueError("additionalNotes must be a string.")

    text = unicodedata.normalize("NFKC", raw)
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = _CONTROL_CHARS.sub("", text)
    text = text.strip()
    if not text:
        return None

    if len(text) > MAX_ADDITIONAL_NOTES_CHARS:
        raise ValueError(
            f"additionalNotes is too long "
            f"({len(text)} chars; max {MAX_ADDITIONAL_NOTES_CHARS})."
        )

    line_count = text.count("\n") + 1
    if line_count > MAX_ADDITIONAL_NOTES_LINES:
        raise ValueError(
            f"additionalNotes has too many lines "
            f"({line_count}; max {MAX_ADDITIONAL_NOTES_LINES})."
        )

    # Reject invisible / bidirectional override tricks used in prompt injection.
    for ch in text:
        o = ord(ch)
        if o in {0x200B, 0x200C, 0x200D, 0x2060, 0xFEFF} or (
            0x202A <= o <= 0x202E
        ) or (0x2066 <= o <= 0x2069):
            raise ValueError(
                "additionalNotes contains invisible/bidi control characters "
                "that are not allowed."
            )

    for label, pat in _SECRET_PATTERNS:
        if pat.search(text):
            raise ValueError(
                f"additionalNotes looks like it contains a secret ({label}). "
                "Remove credentials/tokens — never paste API keys into this field."
            )

    for label, pat in _INJECTION_PATTERNS:
        if pat.search(text):
            raise ValueError(
                f"additionalNotes rejected ({label}). "
                "Use this field for design/context notes only — "
                "it cannot override skill, guardrails, or write paths."
            )

    for label, pat in _DANGEROUS_PATTERNS:
        if pat.search(text):
            raise ValueError(
                f"additionalNotes rejected ({label}). "
                "Design context only — no shell, repo overrides, or unsafe URIs."
            )

    return text

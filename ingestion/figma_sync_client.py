"""Synchronous Figma REST API client (files/nodes, variables)."""
from __future__ import annotations

import re
from typing import Any, Dict, List

import requests

from config.settings import settings


def extract_file_key_and_node_id(figma_url: str) -> tuple[str, str]:
    """
    Return (file_key, node_id) with node_id using colons as required by the API.

    Used for each component row in `data/component-figma-map.json` (`figmaUrl` field).
    """
    m = re.search(r"/design/([^/]+)/", figma_url)
    file_key = m.group(1) if m else None
    node_id = None
    if "?" in figma_url:
        for param in figma_url.split("?")[1].split("&"):
            if param.startswith("node-id="):
                node_id = param.split("=", 1)[1].replace("-", ":")
                break
    if not file_key or not node_id:
        raise ValueError(f"Could not parse Figma URL: {figma_url}")
    return file_key, node_id


def normalize_node_id(node_id: str) -> str:
    return node_id.replace("-", ":")


class FigmaSyncClient:
    def __init__(self, token: str | None = None, timeout: int = 120):
        self.token = token or settings.figma_token
        self.timeout = timeout
        self.base_url = "https://api.figma.com/v1"
        if not self.token:
            raise RuntimeError("FIGMA_TOKEN is not set")

    def _headers(self) -> dict[str, str]:
        return {"X-Figma-Token": self.token}

    def get_file_nodes(self, file_key: str, node_ids: List[str]) -> Dict[str, Any]:
        ids = ",".join(normalize_node_id(n) for n in node_ids)
        url = f"{self.base_url}/files/{file_key}/nodes"
        r = requests.get(
            url,
            headers=self._headers(),
            params={"ids": ids},
            timeout=self.timeout,
        )
        r.raise_for_status()
        return r.json()

    def get_variables(self, file_key: str) -> Dict[str, Any]:
        url = f"{self.base_url}/files/{file_key}/variables"
        r = requests.get(url, headers=self._headers(), timeout=self.timeout)
        if r.status_code != 200:
            return {}
        return r.json()

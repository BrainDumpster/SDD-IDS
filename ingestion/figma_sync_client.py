"""Synchronous Figma REST API client (files/nodes, variables)."""
from __future__ import annotations

import logging
import os
import re
import time
from typing import Any, Dict, List

import requests

from config.settings import settings

logger = logging.getLogger(__name__)

_TRANSIENT_STATUS = {429, 502, 503, 504}


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


def figma_request(
    method: str,
    url: str,
    *,
    headers: dict | None = None,
    params: dict | None = None,
    timeout: int = 120,
    verify: bool | str = True,
    retries: int = 5,
) -> requests.Response:
    """GET/POST to Figma with retries for connection resets and transient HTTP."""
    if not verify:
        try:
            import urllib3

            urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
        except Exception:  # noqa: BLE001
            pass

    last_exc: Exception | None = None
    for attempt in range(max(1, retries)):
        try:
            response = requests.request(
                method,
                url,
                headers=headers or {},
                params=params,
                timeout=timeout,
                verify=verify,
            )
            if (
                response.status_code in _TRANSIENT_STATUS
                and attempt < retries - 1
            ):
                wait = min(2**attempt, 20)
                logger.warning(
                    "Figma HTTP %s on %s — retry %s/%s in %ss",
                    response.status_code,
                    url,
                    attempt + 1,
                    retries,
                    wait,
                )
                time.sleep(wait)
                continue
            return response
        except (
            requests.exceptions.ConnectionError,
            requests.exceptions.Timeout,
            requests.exceptions.ChunkedEncodingError,
        ) as exc:
            last_exc = exc
            if attempt >= retries - 1:
                break
            wait = min(2**attempt, 20)
            logger.warning(
                "Figma connection error on %s (%s) — retry %s/%s in %ss",
                url,
                exc,
                attempt + 1,
                retries,
                wait,
            )
            time.sleep(wait)
    assert last_exc is not None
    raise last_exc


class FigmaSyncClient:
    def __init__(
        self,
        token: str | None = None,
        timeout: int = 120,
        *,
        verify: bool | str | None = None,
        retries: int = 5,
    ):
        self.token = token or settings.figma_token
        self.timeout = timeout
        self.retries = retries
        self.base_url = "https://api.figma.com/v1"
        if verify is None:
            # Collab / Docker corporate proxy escape hatch
            raw = (os.environ.get("FIGMA_SSL_VERIFY") or "true").strip().lower()
            verify = raw not in {"0", "false", "no", "off"}
        self.verify = verify
        if not self.token:
            raise RuntimeError("FIGMA_TOKEN is not set")

    def _headers(self) -> dict[str, str]:
        return {"X-Figma-Token": self.token}

    def get_file_nodes(self, file_key: str, node_ids: List[str]) -> Dict[str, Any]:
        ids = ",".join(normalize_node_id(n) for n in node_ids)
        url = f"{self.base_url}/files/{file_key}/nodes"
        r = figma_request(
            "GET",
            url,
            headers=self._headers(),
            params={"ids": ids},
            timeout=self.timeout,
            verify=self.verify,
            retries=self.retries,
        )
        r.raise_for_status()
        return r.json()

    def get_variables(self, file_key: str) -> Dict[str, Any]:
        url = f"{self.base_url}/files/{file_key}/variables"
        try:
            r = figma_request(
                "GET",
                url,
                headers=self._headers(),
                timeout=self.timeout,
                verify=self.verify,
                retries=self.retries,
            )
        except (
            requests.exceptions.ConnectionError,
            requests.exceptions.Timeout,
            requests.exceptions.ChunkedEncodingError,
        ):
            return {}
        if r.status_code != 200:
            return {}
        return r.json()

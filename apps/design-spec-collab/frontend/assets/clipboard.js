/**
 * Clipboard helper — navigator.clipboard fails on non-secure origins
 * (http://IP:port). Fall back to textarea + execCommand / select.
 *
 * Also rewrites session / Bridge URLs to the browser's public base so remote
 * deploys do not show PUBLIC_BASE_URL=http://127.0.0.1. Supports path
 * prefixes such as http://IP:8080/proxy/3/#/generate → base …/proxy/3
 * without doubling the prefix.
 */
(function (global) {
  async function copyText(text) {
    const value = String(text || "");
    if (!value) throw new Error("Nothing to copy");

    if (global.navigator?.clipboard?.writeText) {
      try {
        await global.navigator.clipboard.writeText(value);
        return true;
      } catch {
        /* fall through — common on http:// private IPs */
      }
    }

    const ta = document.createElement("textarea");
    ta.value = value;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "0";
    ta.style.left = "0";
    ta.style.width = "1px";
    ta.style.height = "1px";
    ta.style.padding = "0";
    ta.style.border = "none";
    ta.style.outline = "none";
    ta.style.boxShadow = "none";
    ta.style.background = "transparent";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    ta.setSelectionRange(0, value.length);
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    document.body.removeChild(ta);
    if (!ok) {
      throw new Error("Clipboard unavailable — select the URL and copy manually (Ctrl/Cmd+C)");
    }
    return true;
  }

  /**
   * Public Collab base (no trailing slash, no hash).
   *   http://127.0.0.1:8091/#/generate          → http://127.0.0.1:8091
   *   http://10.0.0.1:8080/proxy/3/#/generate → http://10.0.0.1:8080/proxy/3
   */
  function publicBase() {
    const origin = global.location.origin;
    const path = global.location.pathname || "/";
    const proxyMatch = path.match(/^(\/proxy\/[^/]+)/i);
    if (proxyMatch) {
      return `${origin}${proxyMatch[1]}`;
    }
    if (path && path !== "/") {
      let prefix = path;
      if (/\.[a-z0-9]+$/i.test(prefix)) {
        prefix = prefix.replace(/\/[^/]*$/, "") || "";
      }
      prefix = prefix.replace(/\/$/, "");
      if (prefix) return `${origin}${prefix}`;
    }
    return origin;
  }

  /** Collapse accidental /proxy/N/proxy/N… down to a single /proxy/N. */
  function collapseProxyPrefix(pathname) {
    let path = pathname || "/";
    path = path.replace(/(\/proxy\/[^/]+)\1+/gi, "$1");
    return path;
  }

  /**
   * App-relative path: /s/…, /bridge/…, /api/…
   * Strips one or more leading /proxy/N segments so we never double the prefix.
   */
  function appPathFromUrl(u) {
    let path = collapseProxyPrefix(u.pathname || "/");
    const base = publicBase();
    try {
      const basePath = new URL(base).pathname.replace(/\/$/, "");
      if (basePath && path.startsWith(basePath + "/")) {
        path = path.slice(basePath.length) || "/";
      } else if (basePath && path === basePath) {
        path = "/";
      }
    } catch {
      /* ignore */
    }
    path = path.replace(/^(\/proxy\/[^/]+)+/i, "") || "/";
    if (!path.startsWith("/")) path = `/${path}`;
    return path;
  }

  /** Keep API path+query; mount under the browser's public base (once). */
  function publicizeUrl(url) {
    const raw = String(url || "").trim();
    if (!raw || raw.startsWith("(")) return raw;
    try {
      const base = publicBase();
      const u = new URL(raw, base);
      const path = appPathFromUrl(u);
      return `${base}${path}${u.search}`;
    } catch {
      return raw;
    }
  }

  function bridgeCommand(sessionUrl, aiCli) {
    const base = publicBase();
    const session = publicizeUrl(sessionUrl);
    if (!session || session.startsWith("(")) {
      return "(packaging… Bridge command appears when ready)";
    }
    const ai =
      aiCli && aiCli !== "devin" ? ` --ai-cli ${aiCli}` : "";
    return (
      `curl -fsSL "${base}/bridge/collab_bridge.py" -o /tmp/collab_bridge.py ` +
      `&& python3 /tmp/collab_bridge.py run '${session}'${ai}`
    );
  }

  global.copyTextToClipboard = copyText;
  global.collabPublicBase = publicBase;
  global.collabPublicizeUrl = publicizeUrl;
  global.collabBridgeCommand = bridgeCommand;
})(window);

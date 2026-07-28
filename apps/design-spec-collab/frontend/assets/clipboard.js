/**
 * Clipboard helper — navigator.clipboard fails on non-secure origins
 * (http://IP:port). Fall back to textarea + execCommand / select.
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
      // Last resort: select the visible input if any
      throw new Error("Clipboard unavailable — select the URL and copy manually (Ctrl/Cmd+C)");
    }
    return true;
  }

  global.copyTextToClipboard = copyText;
})(window);

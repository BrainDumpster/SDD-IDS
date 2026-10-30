/**
 * Shared Transcript UI — toggle + latest-first for Generate and Review.
 */
(function (global) {
  const STORAGE_KEY = "collabTranscriptOpen";

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function isOpenDefault() {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v === null || v === undefined || v === "") return true; // default open
      return v === "1" || v === "true";
    } catch (_) {
      return true;
    }
  }

  function setOpenStored(open) {
    try {
      localStorage.setItem(STORAGE_KEY, open ? "1" : "0");
    } catch (_) {
      /* ignore */
    }
  }

  /**
   * @param {HTMLElement|null} listEl - <ol class="collab-transcript">
   * @param {Array} events
   */
  function render(listEl, events) {
    if (!listEl) return;
    const rows = Array.isArray(events) ? events.slice() : [];
    rows.reverse(); // latest first
    listEl.innerHTML = rows
      .map((e) => {
        const at = escapeHtml(e.at || "");
        const kind = escapeHtml(e.kind || "");
        const msg = escapeHtml(e.message || "");
        return `<li><span class="ts">${at}</span> <strong>${kind}</strong> — ${msg}</li>`;
      })
      .join("");
  }

  /**
   * Wire a details/summary or button+panel toggle.
   * Expects: toggleBtn[data-transcript-toggle], panel[data-transcript-panel], list inside panel.
   */
  function bindToggle(root) {
    if (!root) return;
    const btn = root.querySelector("[data-transcript-toggle]");
    const panel = root.querySelector("[data-transcript-panel]");
    if (!btn || !panel) return;
    if (btn.dataset.bound === "1") return;
    btn.dataset.bound = "1";

    const apply = (open) => {
      panel.hidden = !open;
      panel.classList.toggle("hidden", !open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.textContent = open ? "Hide transcript" : "Show transcript";
      setOpenStored(open);
    };

    apply(isOpenDefault());
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") !== "true";
      apply(open);
    });
  }

  global.CollabTranscript = { render, bindToggle, isOpenDefault, escapeHtml };
})(typeof window !== "undefined" ? window : globalThis);

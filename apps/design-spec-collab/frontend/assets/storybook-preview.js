/**
 * Spec Accurate Design Storybook iframe preview helper for Collab SPA.
 */
(function (global) {
  function apiFetch(path, opts) {
    if (typeof global.apiFetch === "function" && global.apiFetch !== apiFetch) {
      return global.apiFetch(path, opts);
    }
    const headers = Object.assign({}, (opts && opts.headers) || {});
    const actor = (global.localStorage && localStorage.getItem("portalActor")) || "";
    if (actor) headers["X-Portal-Actor"] = actor;
    return fetch(path, Object.assign({}, opts || {}, { headers }));
  }

  function setEmpty(root, message) {
    if (!root) return;
    root.hidden = false;
    const frame = root.querySelector("[data-sb-iframe]");
    const empty = root.querySelector("[data-sb-empty]");
    const meta = root.querySelector("[data-sb-meta]");
    if (frame) {
      frame.hidden = true;
      frame.removeAttribute("src");
    }
    if (empty) {
      empty.hidden = false;
      empty.textContent = message || "No Spec Accurate Design story for this component.";
    }
    if (meta) meta.textContent = "";
  }

  function setLoading(root) {
    if (!root) return;
    root.hidden = false;
    const empty = root.querySelector("[data-sb-empty]");
    if (empty) {
      empty.hidden = false;
      empty.textContent = "Loading Storybook preview…";
    }
    const frame = root.querySelector("[data-sb-iframe]");
    if (frame) {
      frame.hidden = true;
    }
  }

  async function loadInto(root, { programme, slug, theme, cacheBust, jobId } = {}) {
    if (!root) return null;
    setLoading(root);
    const themeVal = theme || root.dataset.theme || "light";
    let url;
    if (jobId) {
      url = `/api/v1/intake/jobs/${encodeURIComponent(jobId)}/preview/storybook?theme=${encodeURIComponent(themeVal)}`;
    } else if (programme && slug) {
      url = `/api/v1/preview/storybook?programme=${encodeURIComponent(programme)}&slug=${encodeURIComponent(slug)}&theme=${encodeURIComponent(themeVal)}`;
    } else {
      setEmpty(root, "Select a programme and component to preview.");
      return null;
    }
    if (cacheBust) url += `&t=${encodeURIComponent(cacheBust)}`;

    try {
      const res = await apiFetch(url);
      const data = await res.json();
      if (!res.ok) {
        setEmpty(root, data.detail || data.message || res.statusText);
        return data;
      }
      const frame = root.querySelector("[data-sb-iframe]");
      const empty = root.querySelector("[data-sb-empty]");
      const meta = root.querySelector("[data-sb-meta]");
      if (!data.available) {
        setEmpty(root, data.message || "Preview unavailable.");
        if (meta && data.reason) meta.textContent = `Reason: ${data.reason}`;
        return data;
      }
      if (empty) empty.hidden = true;
      if (frame) {
        frame.hidden = false;
        frame.src = data.iframeUrl;
        frame.title = data.title
          ? `${data.title} — Spec Accurate Design`
          : "Spec Accurate Design preview";
      }
      if (meta) {
        const bits = [
          data.title || `${programme}/${slug}`,
          data.storyName || "Story",
          themeVal,
        ];
        if (data.hasSpecAccurateDesign === false && data.storyName) {
          bits.push("fallback story");
        }
        meta.textContent = bits.filter(Boolean).join(" · ");
      }
      return data;
    } catch (err) {
      setEmpty(root, `Preview failed: ${err}`);
      return null;
    }
  }

  function bindThemeToggle(root, onChange) {
    const btn = root && root.querySelector("[data-sb-theme-toggle]");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const next = (root.dataset.theme || "light") === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      btn.textContent = next === "dark" ? "Light theme" : "Dark theme";
      if (typeof onChange === "function") onChange(next);
    });
  }

  global.CollabStorybookPreview = {
    loadInto,
    setEmpty,
    bindThemeToggle,
  };
})(window);

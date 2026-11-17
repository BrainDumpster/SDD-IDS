/**
 * Spec Accurate Design Storybook iframe preview helper for Collab SPA.
 *
 * Modes:
 * - canvas: /storybook/iframe.html (story only) — default for embeds
 * - manager: full Storybook shell so addons like Scratchpad are available
 *
 * Tab switch cache: if the same job/import already loaded successfully,
 * re-show the iframe without kicking another rebuild.
 */
(function (global) {
  const FETCH_TIMEOUT_MS = 45000;
  const REBUILD_POLL_MS = 4000;
  const REBUILD_MAX_POLLS = 45;
  // Bump when preview URL resolution changes so tab-cache cannot keep a bad story id.
  const PREVIEW_CACHE_VER = "v6-force-iframe-reload";

  function apiFetch(path, opts) {
    if (typeof global.apiFetch === "function" && global.apiFetch !== apiFetch) {
      return global.apiFetch(path, opts);
    }
    const headers = Object.assign({}, (opts && opts.headers) || {});
    const actor = (global.localStorage && localStorage.getItem("portalActor")) || "";
    if (actor) headers["X-Portal-Actor"] = actor;
    return fetch(path, Object.assign({}, opts || {}, { headers }));
  }

  function modeOf(root) {
    if (!root) return "canvas";
    if (root.dataset.sbMode === "manager") return "manager";
    if (root.dataset.sbMode === "canvas") return "canvas";
    return "canvas";
  }

  function setMode(root, mode) {
    if (!root) return;
    root.dataset.sbMode = mode === "manager" ? "manager" : "canvas";
    const btn = root.querySelector("[data-sb-scratchpad-toggle]");
    if (btn) {
      const on = modeOf(root) === "manager";
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.textContent = on ? "Canvas only" : "Scratchpad";
      btn.title = on
        ? "Switch to canvas-only preview (no addon panels)"
        : "Open full Storybook with Scratchpad addon panel";
    }
    root.classList.toggle("sb-mode-manager", modeOf(root) === "manager");
  }

  function pickFrameUrl(data, themeVal, mode) {
    if (!data) return null;
    if (mode === "manager" && data.managerUrl) {
      let base = data.managerUrl;
      const sep = base.includes("?") ? "&" : "?";
      if (!base.includes("globals=")) {
        base = `${base}${sep}globals=theme:${encodeURIComponent(themeVal || "light")}`;
      }
      if (!base.includes("addonPanel=")) {
        const s = base.includes("?") ? "&" : "?";
        base =
          `${base}${s}panel=bottom&addonPanel=` +
          encodeURIComponent("sdd-ids/scratchpad/panel");
      }
      return base;
    }
    return data.iframeUrl || data.canvasUrl || null;
  }

  function showOpenButton(root, href) {
    const openBtn = root && root.querySelector("[data-sb-open-manager]");
    if (!openBtn) return;
    openBtn.hidden = false;
    openBtn.href = href || "/storybook/index.html";
  }

  function withCacheBust(url, bust) {
    if (!url || !bust) return url;
    if (String(url).includes(`t=${encodeURIComponent(bust)}`) || String(url).includes(`t=${bust}`)) {
      return url;
    }
    const sep = String(url).includes("?") ? "&" : "?";
    return `${url}${sep}t=${encodeURIComponent(bust)}`;
  }

  function applyFrame(root, data, opts) {
    if (!root || !data || !data.available) return;
    const themeVal = root.dataset.theme || data.theme || "light";
    const mode = modeOf(root);
    const frame = root.querySelector("[data-sb-iframe]");
    const empty = root.querySelector("[data-sb-empty]");
    const meta = root.querySelector("[data-sb-meta]");
    const forceReload = Boolean(opts && opts.forceReload);
    const bust =
      (opts && opts.cacheBust) ||
      data.cacheBust ||
      data.prHeadSha ||
      (data.prStorybook && data.prStorybook.cacheKey) ||
      "";
    let url = pickFrameUrl(data, themeVal, mode);
    if (!url) {
      setEmpty(root, data.message || "Preview URL missing.");
      return;
    }
    // Always stamp a bust token after job/PR refresh so the iframe cannot keep
    // a previous Storybook document (same path, new static assets).
    if (forceReload || bust) {
      url = withCacheBust(url, bust || String(Date.now()));
    }
    if (empty) empty.hidden = true;
    if (frame) {
      const prev = frame.getAttribute("src") || "";
      const sameUrl = prev === url;
      // Tab switch: keep the live iframe. Job/PR completion must remount even
      // when the deep-link looks identical (shared /storybook or same story id).
      if (!forceReload && sameUrl && frame.src) {
        frame.hidden = false;
      } else {
        frame.hidden = false;
        if (forceReload || sameUrl) {
          // Hard remount: browsers often ignore iframe.src = same-url.
          const target = url;
          frame.removeAttribute("src");
          try {
            frame.src = "about:blank";
          } catch (_) {
            /* ignore */
          }
          setTimeout(() => {
            frame.src = target;
          }, 0);
        } else {
          frame.src = url;
        }
      }
      frame.title =
        mode === "manager"
          ? `${data.title || "Story"} — Storybook + Scratchpad`
          : data.title
            ? `${data.title} — Spec Accurate Design`
            : "Spec Accurate Design preview";
    }
    if (meta) {
      const bits = [
        data.title || `${data.programme || ""}/${data.slug || ""}`,
        data.storyName || "Story",
        themeVal,
        mode === "manager" ? "Scratchpad on" : "canvas",
      ];
      if (data.prHeadSha) bits.push(String(data.prHeadSha).slice(0, 12));
      if (data.prStorybook && data.prStorybook.ready) bits.push("PR cache");
      if (data.hasSpecAccurateDesign === false && data.storyName) {
        bits.push("fallback story");
      }
      if (data.message) bits.push(data.message);
      meta.textContent = bits.filter(Boolean).join(" · ");
    }
    showOpenButton(
      root,
      withCacheBust(data.managerUrl || "/storybook/index.html", forceReload ? bust || String(Date.now()) : "")
    );
  }

  function setEmpty(root, message, opts) {
    if (!root) return;
    root.hidden = false;
    // Keep last successful payload for tab-switch reuse unless hard-clearing
    if (!(opts && opts.keepPayload)) root._sbPayload = null;
    const frame = root.querySelector("[data-sb-iframe]");
    const empty = root.querySelector("[data-sb-empty]");
    const meta = root.querySelector("[data-sb-meta]");
    if (frame) {
      frame.hidden = true;
      if (!(opts && opts.keepFrameSrc)) frame.removeAttribute("src");
    }
    if (empty) {
      empty.hidden = false;
      empty.textContent = message || "No Spec Accurate Design story for this component.";
    }
    if (meta) meta.textContent = (opts && opts.meta) || "";
    showOpenButton(root, (opts && opts.openHref) || "/storybook/index.html");
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
    if (frame) frame.hidden = true;
  }

  async function fetchPreviewJson(url, outerSignal) {
    const ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
    const timer = setTimeout(() => {
      try {
        ctrl && ctrl.abort();
      } catch (_) {
        /* ignore */
      }
    }, FETCH_TIMEOUT_MS);
    const onOuterAbort = () => {
      try {
        ctrl && ctrl.abort();
      } catch (_) {
        /* ignore */
      }
    };
    if (outerSignal) {
      if (outerSignal.aborted) onOuterAbort();
      else outerSignal.addEventListener("abort", onOuterAbort, { once: true });
    }
    try {
      const res = await apiFetch(url, ctrl ? { signal: ctrl.signal } : undefined);
      const data = await res.json().catch(() => ({}));
      return { res, data };
    } finally {
      clearTimeout(timer);
      if (outerSignal) {
        try {
          outerSignal.removeEventListener("abort", onOuterAbort);
        } catch (_) {
          /* ignore */
        }
      }
    }
  }

  function abortLoad(root) {
    if (!root) return;
    if (root._sbRebuildTimer) {
      clearTimeout(root._sbRebuildTimer);
      root._sbRebuildTimer = null;
    }
    root._sbRebuildPolls = 0;
    root._sbRebuildRequested = false;
    if (root._sbAbort) {
      try {
        root._sbAbort.abort();
      } catch (_) {
        /* ignore */
      }
      root._sbAbort = null;
    }
    root._sbLoadGen = (root._sbLoadGen || 0) + 1;
  }

  function cacheKeyOf(opts) {
    if (opts.importId) return `${PREVIEW_CACHE_VER}:import:${opts.importId}`;
    if (opts.jobId) return `${PREVIEW_CACHE_VER}:job:${opts.jobId}`;
    if (opts.programme && opts.slug) {
      return `${PREVIEW_CACHE_VER}:cat:${opts.programme}/${opts.slug}`;
    }
    return "";
  }

  async function loadInto(root, opts = {}) {
    if (!root) return null;
    if (!root.dataset.sbMode) setMode(root, "canvas");

    const forceRefresh = Boolean(opts.forceRefresh);
    const loadedKey = cacheKeyOf(opts);

    // Tab switch: reuse successful preview — do not rebuild.
    if (
      !forceRefresh &&
      loadedKey &&
      root._sbLoadedKey === loadedKey &&
      root._sbPayload &&
      root._sbPayload.available
    ) {
      applyFrame(root, root._sbPayload, { forceReload: false });
      return root._sbPayload;
    }

    // Soft refresh of the same target while a rebuild poll is already running:
    // do not abort the in-flight poll (Review used to double-call loadInto and
    // cancel the rebuild watcher right after job completion).
    const sameTarget =
      loadedKey &&
      (root._sbLoadingKey === loadedKey || root._sbLoadedKey === loadedKey);
    const pollActive = Boolean(root._sbRebuildTimer);
    if (forceRefresh && sameTarget && pollActive) {
      return root._sbPayload || null;
    }

    // Cancel any in-flight preview / rebuild poll for this root (PR switch).
    if (root._sbAbort) {
      try {
        root._sbAbort.abort();
      } catch (_) {
        /* ignore */
      }
    }
    if (root._sbRebuildTimer) {
      clearTimeout(root._sbRebuildTimer);
      root._sbRebuildTimer = null;
    }
    root._sbLoadingKey = loadedKey;
    const loadGen = (root._sbLoadGen = (root._sbLoadGen || 0) + 1);
    const abortCtrl =
      typeof AbortController !== "undefined" ? new AbortController() : null;
    root._sbAbort = abortCtrl;

    setLoading(root);
    const themeVal = opts.theme || root.dataset.theme || "light";
    let url;
    if (opts.importId) {
      url = `/api/v1/review/sessions/${encodeURIComponent(opts.importId)}/preview/storybook?theme=${encodeURIComponent(themeVal)}`;
    } else if (opts.jobId) {
      url = `/api/v1/intake/jobs/${encodeURIComponent(opts.jobId)}/preview/storybook?theme=${encodeURIComponent(themeVal)}`;
    } else if (opts.programme && opts.slug) {
      url = `/api/v1/preview/storybook?programme=${encodeURIComponent(opts.programme)}&slug=${encodeURIComponent(opts.slug)}&theme=${encodeURIComponent(themeVal)}`;
    } else {
      setEmpty(root, "Select a programme and component to preview.");
      return null;
    }
    if (opts.cacheBust) url += `&t=${encodeURIComponent(opts.cacheBust)}`;

    try {
      const { res, data } = await fetchPreviewJson(
        url,
        abortCtrl ? abortCtrl.signal : undefined
      );
      if (loadGen !== root._sbLoadGen) return null;
      if (!res.ok) {
        setEmpty(root, data.detail || data.message || res.statusText || `HTTP ${res.status}`, {
          meta: data.reason ? `Reason: ${data.reason}` : "",
        });
        return data;
      }

      const rebuilding =
        data.reason === "static_rebuilding" ||
        data.reason === "pr_storybook_building" ||
        (data.rebuild && data.rebuild.status === "running") ||
        (data.prStorybook && data.prStorybook.status === "running");

      if (!data.available && rebuilding) {
        root._sbRebuildPolls = (root._sbRebuildPolls || 0) + 1;
        if (root._sbRebuildPolls > REBUILD_MAX_POLLS) {
          if (root._sbRebuildTimer) clearTimeout(root._sbRebuildTimer);
          root._sbRebuildTimer = null;
          setEmpty(
            root,
            "Storybook build is taking too long (>3 min). " +
              (data.prStorybook?.message || data.rebuild?.message || data.message || ""),
            {
              meta: `Reason: ${data.reason || "build_timeout"}`,
              openHref: data.managerUrl || "/storybook/index.html",
            }
          );
          root._sbRebuildPolls = 0;
          return data;
        }
        const buildingMsg =
          data.reason === "pr_storybook_building"
            ? data.message ||
              "Building per-PR Storybook preview (usually under a minute). Switching PRs uses a separate cache."
            : data.message ||
              "Rebuilding Storybook preview to include the new story (1–3 min)…";
        setEmpty(root, buildingMsg, {
          meta: `Building… poll ${root._sbRebuildPolls}/${REBUILD_MAX_POLLS}`,
          openHref: data.managerUrl || "/storybook/index.html",
          keepPayload: true,
        });
        if (root._sbRebuildTimer) clearTimeout(root._sbRebuildTimer);
        root._sbRebuildTimer = setTimeout(() => {
          if (loadGen !== root._sbLoadGen) return;
          loadInto(root, Object.assign({}, opts, { forceRefresh: true, cacheBust: String(Date.now()) }));
        }, REBUILD_POLL_MS);
        return data;
      }

      if (root._sbRebuildTimer) {
        clearTimeout(root._sbRebuildTimer);
        root._sbRebuildTimer = null;
      }
      root._sbRebuildPolls = 0;

      if (!data.available) {
        setEmpty(root, data.message || "Preview unavailable.", {
          meta: data.reason ? `Reason: ${data.reason}` : "",
          openHref: data.managerUrl || "/storybook/index.html",
        });
        if (
          data.reason === "static_stale" &&
          data.rebuild &&
          data.rebuild.toolchainAvailable &&
          !root._sbRebuildRequested
        ) {
          root._sbRebuildRequested = true;
          apiFetch("/api/v1/preview/storybook/rebuild", { method: "POST" })
            .then(async (r) => {
              if (loadGen !== root._sbLoadGen) return;
              if (!r.ok) {
                setEmpty(
                  root,
                  `Rebuild API failed (HTTP ${r.status}).`,
                  { meta: `Reason: ${data.reason}`, openHref: "/storybook/index.html" }
                );
                return;
              }
              root._sbRebuildTimer = setTimeout(() => {
                if (loadGen !== root._sbLoadGen) return;
                root._sbRebuildRequested = false;
                loadInto(
                  root,
                  Object.assign({}, opts, { forceRefresh: true, cacheBust: String(Date.now()) })
                );
              }, 3000);
            })
            .catch((err) => {
              if (loadGen !== root._sbLoadGen) return;
              setEmpty(root, `Rebuild request failed: ${err}`, {
                meta: `Reason: ${data.reason}`,
                openHref: "/storybook/index.html",
              });
            })
            .finally(() => {
              root._sbRebuildRequested = false;
            });
        }
        return data;
      }

      root._sbPayload = data;
      root._sbLoadedKey = loadedKey;
      root._sbLoadingKey = null;
      applyFrame(root, data, {
        forceReload: forceRefresh,
        cacheBust: opts.cacheBust || (data.prHeadSha ? String(data.prHeadSha).slice(0, 12) : ""),
      });
      return data;
    } catch (err) {
      if (loadGen !== root._sbLoadGen) return null;
      const aborted = err && (err.name === "AbortError" || /abort/i.test(String(err)));
      // Superseded loads abort on purpose when switching PRs — stay quiet.
      if (aborted && abortCtrl && abortCtrl.signal.aborted && loadGen !== root._sbLoadGen) {
        return null;
      }
      setEmpty(
        root,
        aborted
          ? `Storybook preview timed out (${Math.round(FETCH_TIMEOUT_MS / 1000)}s). Try Open Storybook or wait for the rebuild to finish.`
          : `Preview failed: ${err}`
      );
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

  function bindScratchpadToggle(root) {
    const btn = root && root.querySelector("[data-sb-scratchpad-toggle]");
    if (!btn || btn.dataset.bound === "1") return;
    btn.dataset.bound = "1";
    if (!root.dataset.sbMode) setMode(root, "canvas");
    else setMode(root, modeOf(root));
    btn.addEventListener("click", () => {
      const next = modeOf(root) === "manager" ? "canvas" : "manager";
      setMode(root, next);
      if (root._sbPayload && root._sbPayload.available) {
        applyFrame(root, root._sbPayload, { forceReload: false });
      }
    });
  }

  function bindPreviewChrome(root, onThemeChange) {
    bindThemeToggle(root, (theme) => {
      // Theme change needs a refresh, but still same cache key once loaded
      if (typeof onThemeChange === "function") onThemeChange(theme);
    });
    bindScratchpadToggle(root);
  }

  global.CollabStorybookPreview = {
    loadInto,
    setEmpty,
    setLoading,
    applyFrame,
    abortLoad,
    bindThemeToggle,
    bindScratchpadToggle,
    bindPreviewChrome,
    setMode,
    modeOf,
  };
})(window);

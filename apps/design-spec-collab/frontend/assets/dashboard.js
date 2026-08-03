/**
 * Dashboard home + Update flow + hash routing for design-spec-collab.
 */
(function () {
  const viewHome = document.getElementById("view-home");
  const viewGenerate = document.getElementById("view-generate");
  const viewUpdate = document.getElementById("view-update");
  const catalogueStatus = document.getElementById("catalogue-status");
  const btnUpdate = document.getElementById("btn-update-spec");
  const btnBundle = document.getElementById("btn-download-bundle");
  const selectedMeta = document.getElementById("selected-component-meta");
  const bundleStatus = document.getElementById("bundle-status");
  const homeSbPreview = document.getElementById("home-storybook-preview");
  const homeSbOpen = document.getElementById("home-sb-open-manager");

  let programmes = [];
  let components = [];
  let selectedProgramme = null;
  let selectedComponent = null;
  let programmeDd = null;
  let componentDd = null;

  function refreshHomeStorybookPreview() {
    if (!homeSbPreview || !window.CollabStorybookPreview) return;
    // Split panel stays mounted; show empty state until a component is selected
    homeSbPreview.hidden = false;
    if (!selectedProgramme || !selectedComponent) {
      CollabStorybookPreview.setEmpty(
        homeSbPreview,
        "Select a component to preview its generated Storybook story here."
      );
      if (homeSbOpen) homeSbOpen.hidden = true;
      return;
    }
    homeSbPreview.dataset.theme = homeSbPreview.dataset.theme || "light";
    CollabStorybookPreview.loadInto(homeSbPreview, {
      programme: selectedProgramme.slug,
      slug: selectedComponent.slug,
      theme: homeSbPreview.dataset.theme,
      cacheBust: String(Date.now()),
    }).then((data) => {
      if (homeSbOpen) {
        if (data?.available && data.managerUrl) {
          homeSbOpen.href = data.managerUrl;
          homeSbOpen.hidden = false;
        } else {
          homeSbOpen.hidden = true;
        }
      }
    });
  }

  const HOME_PREVIEW_KEY = "collab.homePreviewVisible";
  const HOME_LEFT_PCT_KEY = "collab.homeLeftPct";
  const homeLayoutSplit = document.getElementById("home-layout-split");
  const toggleHomePreviewBtn = document.getElementById("toggle-home-preview");

  function setHomePreviewVisible(visible) {
    if (!homeLayoutSplit) return;
    homeLayoutSplit.classList.toggle("results-collapsed", !visible);
    if (toggleHomePreviewBtn) {
      toggleHomePreviewBtn.setAttribute("aria-pressed", visible ? "true" : "false");
      toggleHomePreviewBtn.textContent = visible ? "Hide preview" : "Show preview";
    }
    try {
      localStorage.setItem(HOME_PREVIEW_KEY, visible ? "1" : "0");
    } catch (_) {
      /* ignore */
    }
  }

  if (toggleHomePreviewBtn && homeLayoutSplit) {
    let storedVisible = "1";
    try {
      storedVisible = localStorage.getItem(HOME_PREVIEW_KEY) || "1";
    } catch (_) {
      /* ignore */
    }
    setHomePreviewVisible(storedVisible !== "0");
    try {
      const pct = localStorage.getItem(HOME_LEFT_PCT_KEY);
      if (pct) homeLayoutSplit.style.setProperty("--left-pct", pct);
    } catch (_) {
      /* ignore */
    }
    toggleHomePreviewBtn.addEventListener("click", () => {
      const show = homeLayoutSplit.classList.contains("results-collapsed");
      setHomePreviewVisible(show);
      if (show) refreshHomeStorybookPreview();
    });
  }

  const homeDivider = document.getElementById("home-layout-divider");
  if (homeDivider && homeLayoutSplit) {
    let dragging = false;
    const applyPct = (pct) => {
      const clamped = Math.min(70, Math.max(28, pct));
      const value = `${clamped}%`;
      homeLayoutSplit.style.setProperty("--left-pct", value);
      try {
        localStorage.setItem(HOME_LEFT_PCT_KEY, value);
      } catch (_) {
        /* ignore */
      }
    };
    const onMove = (clientX) => {
      const rect = homeLayoutSplit.getBoundingClientRect();
      if (!rect.width) return;
      applyPct(((clientX - rect.left) / rect.width) * 100);
    };
    homeDivider.addEventListener("pointerdown", (e) => {
      dragging = true;
      homeDivider.setPointerCapture?.(e.pointerId);
      e.preventDefault();
    });
    homeDivider.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      onMove(e.clientX);
    });
    homeDivider.addEventListener("pointerup", () => {
      dragging = false;
    });
    homeDivider.addEventListener("keydown", (e) => {
      const cur =
        parseFloat(getComputedStyle(homeLayoutSplit).getPropertyValue("--left-pct")) ||
        40;
      if (e.key === "ArrowLeft") {
        applyPct(cur - 2);
        e.preventDefault();
      } else if (e.key === "ArrowRight") {
        applyPct(cur + 2);
        e.preventDefault();
      }
    });
  }

  if (homeSbPreview && window.CollabStorybookPreview) {
    CollabStorybookPreview.bindThemeToggle(homeSbPreview, () => {
      refreshHomeStorybookPreview();
    });
    refreshHomeStorybookPreview();
  }

  const updSbPreview = document.getElementById("upd-storybook-preview");
  if (updSbPreview && window.CollabStorybookPreview) {
    CollabStorybookPreview.bindThemeToggle(updSbPreview, (theme) => {
      if (!updJobId) return;
      CollabStorybookPreview.loadInto(updSbPreview, {
        jobId: updJobId,
        theme,
        cacheBust: String(Date.now()),
      });
    });
  }

  let updLastPayload = null;
  let updLastPreview = null;
  let updJobId = null;
  let updPollTimer = null;
  let updSessionInFlight = false;
  let updRequestInFlight = false;

  function isUpdJobInFlight(job) {
    if (!job) return false;
    if (["pending", "running"].includes(job.status)) return true;
    return ["packaging", "awaiting_client", "reviewing"].includes(job.collab_status);
  }

  function setUpdSessionUrlActionsEnabled(enabled) {
    const copyBtn = document.getElementById("upd-copy-session");
    const promptBtn = document.getElementById("upd-copy-prompt");
    if (copyBtn) copyBtn.disabled = !enabled;
    if (promptBtn) promptBtn.disabled = !enabled;
  }

  function syncUpdFormActions() {
    const locked = updSessionInFlight || updRequestInFlight;
    const previewBtn = document.getElementById("upd-preview-btn");
    const startBtn = document.getElementById("upd-start-btn");
    const busyHint = document.getElementById("upd-session-busy-hint");
    if (previewBtn) previewBtn.disabled = locked;
    if (busyHint) busyHint.hidden = !updSessionInFlight;
    const confirmed = document.getElementById("upd-confirm-check")?.checked;
    if (startBtn) {
      startBtn.disabled =
        locked ||
        !(
          confirmed &&
          updLastPayload &&
          updLastPreview &&
          updLastPreview.ready_for_agent
        );
    }
  }

  function actorHeaders() {
    const h = {};
    const el = document.getElementById("portal-actor");
    const v = el && el.value.trim();
    if (v) h["X-Portal-Actor"] = v;
    return h;
  }

  async function apiFetch(path, init) {
    const headers = { ...(init && init.headers), ...actorHeaders() };
    return fetch(path, { ...(init || {}), headers });
  }

  function placeAuthForRoute(name) {
    const auth = document.getElementById("auth-actor-section");
    const homeSlot = document.getElementById("home-auth-slot");
    const headerSlot = document.getElementById("header-auth-slot");
    if (!auth) return;
    if (name === "home" && homeSlot) {
      homeSlot.appendChild(auth);
      document.body.classList.add("route-home");
    } else if (headerSlot) {
      headerSlot.appendChild(auth);
      document.body.classList.remove("route-home");
    }
  }

  function showView(name) {
    [viewHome, viewGenerate, viewUpdate].forEach((v) => {
      if (v) v.hidden = true;
    });
    if (name === "home" && viewHome) viewHome.hidden = false;
    if (name === "generate" && viewGenerate) viewGenerate.hidden = false;
    if (name === "update" && viewUpdate) viewUpdate.hidden = false;
    placeAuthForRoute(name);
  }

  function parseRoute() {
    const hash = (location.hash || "#/").replace(/^#/, "") || "/";
    const [path, qs] = hash.split("?");
    const params = new URLSearchParams(qs || "");
    if (path === "/generate") return { name: "generate", params };
    if (path === "/update") return { name: "update", params };
    return { name: "home", params };
  }

  function navigate() {
    const route = parseRoute();
    showView(route.name);
    if (route.name === "home") {
      ensureCatalogue();
    }
    if (route.name === "update") {
      const prog = route.params.get("programme");
      const comp = route.params.get("component");
      initUpdatePage(prog, comp);
    }
  }

  function lines(id) {
    const el = document.getElementById(id);
    if (!el) return [];
    return el.value
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  function validateFigmaUrl(url, label) {
    try {
      const u = new URL(url);
      if (!/^https?:$/i.test(u.protocol)) return `${label}: must be http(s)`;
      const host = (u.hostname || "").toLowerCase();
      if (host !== "figma.com" && host !== "www.figma.com")
        return `${label}: host must be figma.com`;
      if (!/\/(design|file|proto|board|slides)\/[a-zA-Z0-9]+/i.test(u.pathname))
        return `${label}: missing /design/<fileKey>/`;
      if (!u.searchParams.get("node-id") && !u.searchParams.get("node_id"))
        return `${label}: missing node-id`;
      return null;
    } catch {
      return `${label}: invalid URL`;
    }
  }

  function setErrors(listId, msgs) {
    const ul = document.getElementById(listId);
    if (!ul) return;
    ul.innerHTML = "";
    if (!msgs.length) {
      ul.hidden = true;
      return;
    }
    ul.hidden = false;
    msgs.forEach((m) => {
      const li = document.createElement("li");
      li.textContent = m;
      ul.appendChild(li);
    });
  }

  function validateUrlBucket(textareaId, errId, label) {
    const errs = [];
    lines(textareaId).forEach((url, i) => {
      const e = validateFigmaUrl(url, `${label}[${i + 1}]`);
      if (e) errs.push(e);
    });
    setErrors(errId, errs);
    return errs.length === 0;
  }

  async function ensureCatalogue() {
    if (programmes.length) return;
    catalogueStatus.textContent = "Loading programmes…";
    try {
      const res = await apiFetch("/api/v1/update/programmes");
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || res.statusText);
      programmes = data.programmes || [];
      catalogueStatus.textContent = `Source: ${data.source || "?"} · ref ${data.ref || "—"} · ${programmes.length} programme(s)`;
      programmeDd.setItems(
        programmes.map((p) => ({
          value: p.slug,
          label: `${p.displayName} (${p.componentCount})`,
          raw: p,
        }))
      );
    } catch (err) {
      catalogueStatus.textContent = `Catalogue error: ${err}`;
    }
  }

  async function loadComponents(programmeSlug) {
    componentDd.setDisabled(true);
    componentDd.setItems([]);
    selectedComponent = null;
    syncUpdateButton();
    selectedMeta.textContent = "Loading components…";
    try {
      const res = await apiFetch(
        `/api/v1/update/programmes/${encodeURIComponent(programmeSlug)}/components`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || res.statusText);
      components = data.components || [];
      const themeProg = data.dropdownThemeProgramme || "ids";
      const themePath =
        themeProg === "ids"
          ? "components/ids-theme.css"
          : data.themeCssPath || "components/ids-theme.css";
      if (window.IdsDropdown) IdsDropdown.setThemeStylesheet(themePath);

      componentDd.setItems(
        components.map((c) => ({
          value: c.slug,
          label: c.displayName,
          raw: c,
        }))
      );
      componentDd.setDisabled(false);
      selectedMeta.textContent = `${components.length} component(s) — select one to Update.`;
    } catch (err) {
      selectedMeta.textContent = `Failed to load components: ${err}`;
    }
  }

  function syncUpdateButton() {
    const ready = !!(selectedProgramme && selectedComponent);
    btnUpdate.disabled = !ready;
    if (btnBundle) {
      if (ready) {
        const prog = selectedProgramme.slug;
        const slug = selectedComponent.slug;
        btnBundle.href = `/api/v1/update/programmes/${encodeURIComponent(
          prog
        )}/components/${encodeURIComponent(slug)}/bundle.zip`;
        btnBundle.setAttribute(
          "download",
          `${prog}-${slug}-bundle.zip`
        );
        btnBundle.removeAttribute("aria-disabled");
        btnBundle.removeAttribute("tabindex");
      } else {
        btnBundle.href = "#";
        btnBundle.removeAttribute("download");
        btnBundle.setAttribute("aria-disabled", "true");
        btnBundle.setAttribute("tabindex", "-1");
      }
    }
    if (ready) {
      selectedMeta.textContent = `${selectedComponent.displayName} · ${selectedComponent.designSpecPath}${
        selectedComponent.mapEntryFound ? "" : " · ⚠ no map entry"
      }${selectedComponent.hasStorybook ? " · Storybook" : ""}`;
    } else if (selectedMeta) {
      selectedMeta.textContent =
        "Select a programme and component to enable Update or Download bundle.";
    }
    if (bundleStatus) {
      bundleStatus.hidden = true;
      bundleStatus.textContent = "";
      bundleStatus.classList.remove("is-busy", "is-ok", "is-error");
      bundleStatus.innerHTML = "";
    }
    refreshHomeStorybookPreview();
  }

  function initDropdowns() {
    if (!window.IdsDropdown) return;
    IdsDropdown.setThemeStylesheet("components/ids-theme.css");
    programmeDd = IdsDropdown.createDropdown(document.getElementById("dd-programme"), {
      triggerId: "dd-programme-trigger",
      placeholder: "Select programme…",
      onChange(item) {
        selectedProgramme = item ? item.raw : null;
        selectedComponent = null;
        if (item) loadComponents(item.value);
        else {
          componentDd.setItems([]);
          componentDd.setDisabled(true);
          syncUpdateButton();
        }
      },
    });
    componentDd = IdsDropdown.createDropdown(document.getElementById("dd-component"), {
      triggerId: "dd-component-trigger",
      placeholder: "Select component…",
      disabled: true,
      onChange(item) {
        selectedComponent = item ? item.raw : null;
        syncUpdateButton();
      },
    });
  }

  btnUpdate.addEventListener("click", () => {
    if (!selectedProgramme || !selectedComponent) return;
    location.hash = `#/update?programme=${encodeURIComponent(
      selectedProgramme.slug
    )}&component=${encodeURIComponent(selectedComponent.slug)}`;
  });

  function setBundleStatus(message, state) {
    if (!bundleStatus) return;
    bundleStatus.hidden = !message;
    bundleStatus.classList.remove("is-busy", "is-ok", "is-error");
    if (!message) {
      bundleStatus.innerHTML = "";
      return;
    }
    if (state) bundleStatus.classList.add(state);
    if (state === "is-busy") {
      bundleStatus.innerHTML = `<span class="spinner" aria-hidden="true"></span><span>${message}</span>`;
    } else {
      bundleStatus.textContent = message;
    }
  }

  if (btnBundle) {
    btnBundle.addEventListener("click", async (event) => {
      if (!selectedProgramme || !selectedComponent) {
        event.preventDefault();
        return;
      }
      if (btnBundle.getAttribute("aria-disabled") === "true") {
        event.preventDefault();
        return;
      }
      // Prefer fetch so we can surface API errors; fall back to navigation.
      event.preventDefault();
      const url = btnBundle.href;
      const filename =
        btnBundle.getAttribute("download") ||
        `${selectedProgramme.slug}-${selectedComponent.slug}-bundle.zip`;
      btnBundle.setAttribute("aria-disabled", "true");
      setBundleStatus("Building portable bundle (specs, themes, Storybook, nested deps)…", "is-busy");
      try {
        const res = await apiFetch(url);
        if (!res.ok) {
          let detail = res.statusText;
          try {
            const body = await res.json();
            detail = body.detail || detail;
          } catch {
            /* ignore */
          }
          throw new Error(detail || `HTTP ${res.status}`);
        }
        const blob = await res.blob();
        const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = objectUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(objectUrl);
        const nested = res.headers.get("X-Bundle-Nested-Count") || "0";
        const files = res.headers.get("X-Bundle-File-Count") || "?";
        setBundleStatus(
          `Downloaded ${filename} — ${files} files (${nested} nested components).`,
          "is-ok"
        );
      } catch (err) {
        setBundleStatus(`Bundle failed: ${err.message || err}`, "is-error");
      } finally {
        syncUpdateButton();
      }
    });
  }

  /* ——— Update page ——— */

  async function initUpdatePage(programme, component) {
    const form = document.getElementById("update-form");
    if (!programme || !component) {
      document.getElementById("upd-error").textContent =
        "Missing programme or component in URL.";
      document.getElementById("upd-error").classList.remove("hidden");
      return;
    }
    document.getElementById("upd-error").classList.add("hidden");
    document.getElementById("upd-programme-label").textContent = programme;
    document.getElementById("upd-component-label").textContent = component;

    try {
      const res = await apiFetch(
        `/api/v1/update/programmes/${encodeURIComponent(programme)}/components`
      );
      const data = await res.json();
      const match = (data.components || []).find((c) => c.slug === component);
      if (!match) throw new Error("Component not found in catalogue");
      selectedProgramme = { slug: programme, ...(data || {}) };
      selectedComponent = match;
      document.getElementById("upd-programme-label").textContent =
        data.programme || programme;
      document.getElementById("upd-component-label").textContent = match.displayName;
      document.getElementById("upd-mapped-figma").textContent =
        match.figmaUrl || "(none in map)";
      document.getElementById("upd-mapped-node").textContent =
        match.nodeId || "—";
      const sb = document.getElementById("upd-storybook");
      sb.checked = !!match.hasStorybook;
      if (window.IdsDropdown) {
        IdsDropdown.setThemeStylesheet(
          data.themeCssPath || "components/ids-theme.css"
        );
      }
    } catch (err) {
      document.getElementById("upd-error").textContent = String(err);
      document.getElementById("upd-error").classList.remove("hidden");
    }
  }

  function buildUpdatePayload() {
    const route = parseRoute();
    const programme = route.params.get("programme");
    const component = route.params.get("component");
    if (!programme || !component) return null;
    const ok =
      validateUrlBucket("upd-main-urls", "upd-main-urls-errors", "Main") &&
      validateUrlBucket("upd-element-urls", "upd-element-urls-errors", "Elements") &&
      validateUrlBucket("upd-state-urls", "upd-state-urls-errors", "States");
    if (!ok) return null;
    return {
      programme,
      componentSlug: component,
      additionalMainUrls: lines("upd-main-urls"),
      additionalElementUrls: lines("upd-element-urls"),
      additionalStateUrls: lines("upd-state-urls"),
      additionalPrompt: document.getElementById("upd-prompt").value.trim() || null,
      storybookExamples: document.getElementById("upd-storybook").checked,
    };
  }

  function updStartProgress(label) {
    updRequestInFlight = true;
    const p = document.getElementById("upd-progress");
    p.classList.remove("hidden");
    document.getElementById("upd-progress-label").textContent = label || "Working…";
    syncUpdFormActions();
  }

  function updFinishProgress() {
    updRequestInFlight = false;
    document.getElementById("upd-progress").classList.add("hidden");
    syncUpdFormActions();
  }

  document.getElementById("update-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (updSessionInFlight || updRequestInFlight) return;
    const payload = buildUpdatePayload();
    if (!payload) return;
    updStartProgress("Previewing update…");
    try {
      const res = await apiFetch("/api/v1/update/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        updFinishProgress();
        document.getElementById("upd-error").textContent =
          typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail);
        document.getElementById("upd-error").classList.remove("hidden");
        return;
      }
      updFinishProgress();
      updLastPayload = payload;
      updLastPreview = data;
      document.getElementById("upd-error").classList.add("hidden");
      document.getElementById("upd-result").classList.remove("hidden");
      document.getElementById("upd-result-json").textContent = JSON.stringify(
        data,
        null,
        2
      );
      const dl = document.getElementById("upd-confirm-summary");
      dl.innerHTML = "";
      const rows = [
        ["Programme", data.programme],
        ["Component", data.component_display_name],
        ["Path", data.design_spec_path],
        ["Skill", data.skill_route],
        ["Storybook", data.storybook_examples ? "yes" : "no"],
      ];
      rows.forEach(([k, v]) => {
        const dt = document.createElement("dt");
        dt.textContent = k;
        const dd = document.createElement("dd");
        dd.textContent = v;
        dl.appendChild(dt);
        dl.appendChild(dd);
      });
      document.getElementById("upd-confirm").classList.remove("hidden");
      document.getElementById("upd-confirm-check").checked = false;
      syncUpdFormActions();
    } catch (err) {
      updFinishProgress();
      document.getElementById("upd-error").textContent = String(err);
      document.getElementById("upd-error").classList.remove("hidden");
    }
  });

  document.getElementById("upd-confirm-check").addEventListener("change", () => {
    syncUpdFormActions();
  });

  async function pollUpdateJob(jobId) {
    const res = await apiFetch(`/api/v1/intake/jobs/${jobId}`);
    const job = await res.json();
    if (!res.ok) return;
    updSessionInFlight = isUpdJobInFlight(job);
    syncUpdFormActions();
    const url = job.session_url || "";
    const collab = job.collab_status || "";
    const readyForClient =
      Boolean(url) &&
      !String(url).startsWith("(") &&
      (collab === "awaiting_client" || collab === "reviewing" || collab === "done");
    const panel = document.getElementById("upd-session-panel");
    const banner = document.getElementById("upd-session-ready");
    if (url || collab === "packaging" || job.status === "running") {
      panel.classList.remove("hidden");
    }
    if (url && !String(url).startsWith("(")) {
      document.getElementById("upd-session-url").value = url;
    } else if (collab === "packaging" || job.status === "running") {
      document.getElementById("upd-session-url").value =
        "(packaging… session URL appears when ready)";
    }
    setUpdSessionUrlActionsEnabled(readyForClient);
    if (collab === "packaging") {
      banner.textContent =
        "Packaging Figma evidence on the server… Session URL will be ready next.";
      banner.classList.remove("hidden");
      banner.classList.add("is-packing");
    } else if (readyForClient && collab === "awaiting_client") {
      banner.textContent = "Session ready — paste URL into client agent.";
      banner.classList.remove("hidden", "is-packing");
    }
    const ol = document.getElementById("upd-transcript");
    ol.innerHTML = "";
    (job.transcript || []).forEach((ev) => {
      const li = document.createElement("li");
      li.textContent = `${ev.at || ""} ${ev.kind || ""}: ${ev.message || ""}`;
      ol.appendChild(li);
    });
    if (job.status === "finished" || job.collab_status === "done") {
      clearInterval(updPollTimer);
      updPollTimer = null;
      updSessionInFlight = false;
      document.getElementById("upd-job-done").classList.remove("hidden");
      document.getElementById("upd-job-done-message").textContent =
        job.result_summary || "Accepted.";
      if (job.pr_url) {
        const a = document.getElementById("upd-job-done-pr");
        a.href = job.pr_url;
        a.classList.remove("hidden");
      }
      const zip = document.getElementById("upd-job-done-zip");
      zip.href = `/api/v1/intake/jobs/${jobId}/artifacts.zip`;
      zip.classList.remove("hidden");
      document.getElementById("upd-cancel-btn").disabled = true;
      setUpdSessionUrlActionsEnabled(true);
      updFinishProgress();
      const updSb = document.getElementById("upd-storybook-preview");
      if (updSb && window.CollabStorybookPreview) {
        updSb.hidden = false;
        updSb.classList.remove("hidden");
        CollabStorybookPreview.loadInto(updSb, {
          jobId,
          theme: updSb.dataset.theme || "light",
          cacheBust: String(Date.now()),
        });
      }
    } else if (job.status === "error" || job.collab_status === "failed") {
      clearInterval(updPollTimer);
      updPollTimer = null;
      updSessionInFlight = false;
      document.getElementById("upd-error").textContent =
        job.error_message || "Update session failed";
      document.getElementById("upd-error").classList.remove("hidden");
      document.getElementById("upd-cancel-btn").disabled = true;
      setUpdSessionUrlActionsEnabled(false);
      updFinishProgress();
    } else {
      document.getElementById("upd-cancel-btn").disabled = !updSessionInFlight;
    }
  }

  document.getElementById("upd-start-btn").addEventListener("click", async () => {
    if (!updLastPayload || !document.getElementById("upd-confirm-check").checked)
      return;
    if (updSessionInFlight || updRequestInFlight) return;
    updStartProgress("Creating update session + packaging Figma…");
    try {
      const res = await apiFetch("/api/v1/update/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ update: updLastPayload, confirmed: true }),
      });
      const data = await res.json();
      if (!res.ok) {
        updFinishProgress();
        document.getElementById("upd-error").textContent =
          typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail);
        document.getElementById("upd-error").classList.remove("hidden");
        return;
      }
      updJobId = data.job_id;
      updSessionInFlight = true;
      syncUpdFormActions();
      document.getElementById("upd-cancel-btn").disabled = false;
      document.getElementById("upd-session-panel").classList.remove("hidden");
      setUpdSessionUrlActionsEnabled(false);
      if (data.session_url && !String(data.session_url).startsWith("(")) {
        document.getElementById("upd-session-url").value = data.session_url;
      } else {
        document.getElementById("upd-session-url").value =
          "(packaging… session URL appears when ready)";
      }
      if (updPollTimer) clearInterval(updPollTimer);
      updPollTimer = setInterval(() => pollUpdateJob(updJobId), 2000);
      pollUpdateJob(updJobId);
    } catch (err) {
      updSessionInFlight = false;
      updFinishProgress();
      document.getElementById("upd-error").textContent = String(err);
      document.getElementById("upd-error").classList.remove("hidden");
    }
  });

  document.getElementById("upd-copy-session").addEventListener("click", async () => {
    const btn = document.getElementById("upd-copy-session");
    if (btn.disabled) return;
    const input = document.getElementById("upd-session-url");
    const v = input.value;
    if (!v || String(v).startsWith("(")) return;
    try {
      await copyTextToClipboard(v);
      btn.textContent = "Copied";
      setTimeout(() => {
        btn.textContent = "Copy URL";
      }, 1500);
    } catch (err) {
      input.focus();
      input.select();
      document.getElementById("upd-error").textContent = String(err.message || err);
      document.getElementById("upd-error").classList.remove("hidden");
    }
  });

  document.getElementById("upd-copy-prompt")?.addEventListener("click", async () => {
    const promptBtn = document.getElementById("upd-copy-prompt");
    if (promptBtn?.disabled || !updJobId) return;
    const btn = document.getElementById("upd-copy-prompt");
    try {
      const res = await apiFetch(`/api/v1/intake/jobs/${updJobId}/client-prompt.md`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        document.getElementById("upd-error").textContent =
          typeof data.detail === "string" ? data.detail : "Could not load client prompt";
        document.getElementById("upd-error").classList.remove("hidden");
        return;
      }
      const text = await res.text();
      await copyTextToClipboard(text);
      if (btn) {
        btn.textContent = "Copied";
        setTimeout(() => {
          btn.textContent = "Copy client prompt";
        }, 1500);
      }
    } catch (err) {
      document.getElementById("upd-error").textContent = String(err.message || err);
      document.getElementById("upd-error").classList.remove("hidden");
    }
  });

  document.getElementById("upd-cancel-btn").addEventListener("click", async () => {
    if (!updJobId) return;
    await apiFetch(`/api/v1/intake/jobs/${updJobId}/cancel`, { method: "POST" });
    if (updPollTimer) clearInterval(updPollTimer);
    updPollTimer = null;
    updSessionInFlight = false;
    document.getElementById("upd-cancel-btn").disabled = true;
    setUpdSessionUrlActionsEnabled(false);
    updFinishProgress();
  });

  // boot
  initDropdowns();
  window.addEventListener("hashchange", navigate);
  if (!location.hash || location.hash === "#") location.hash = "#/";
  navigate();
})();

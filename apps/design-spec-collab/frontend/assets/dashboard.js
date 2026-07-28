/**
 * Dashboard home + Update flow + hash routing for design-spec-collab.
 */
(function () {
  const viewHome = document.getElementById("view-home");
  const viewGenerate = document.getElementById("view-generate");
  const viewUpdate = document.getElementById("view-update");
  const catalogueStatus = document.getElementById("catalogue-status");
  const btnUpdate = document.getElementById("btn-update-spec");
  const selectedMeta = document.getElementById("selected-component-meta");

  let programmes = [];
  let components = [];
  let selectedProgramme = null;
  let selectedComponent = null;
  let programmeDd = null;
  let componentDd = null;

  let updLastPayload = null;
  let updLastPreview = null;
  let updJobId = null;
  let updPollTimer = null;

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

  function showView(name) {
    [viewHome, viewGenerate, viewUpdate].forEach((v) => {
      if (v) v.hidden = true;
    });
    if (name === "home" && viewHome) viewHome.hidden = false;
    if (name === "generate" && viewGenerate) viewGenerate.hidden = false;
    if (name === "update" && viewUpdate) viewUpdate.hidden = false;
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
    btnUpdate.disabled = !(selectedProgramme && selectedComponent);
    if (selectedProgramme && selectedComponent) {
      selectedMeta.textContent = `${selectedComponent.displayName} · ${selectedComponent.designSpecPath}${
        selectedComponent.mapEntryFound ? "" : " · ⚠ no map entry"
      }`;
    }
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
    const p = document.getElementById("upd-progress");
    p.classList.remove("hidden");
    document.getElementById("upd-progress-label").textContent = label || "Working…";
  }

  function updFinishProgress() {
    document.getElementById("upd-progress").classList.add("hidden");
  }

  document.getElementById("update-form").addEventListener("submit", async (e) => {
    e.preventDefault();
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
      document.getElementById("upd-start-btn").disabled = true;
    } catch (err) {
      updFinishProgress();
      document.getElementById("upd-error").textContent = String(err);
      document.getElementById("upd-error").classList.remove("hidden");
    }
  });

  document.getElementById("upd-confirm-check").addEventListener("change", (e) => {
    document.getElementById("upd-start-btn").disabled = !(
      e.target.checked &&
      updLastPayload &&
      updLastPreview &&
      updLastPreview.ready_for_agent
    );
  });

  async function pollUpdateJob(jobId) {
    const res = await apiFetch(`/api/v1/intake/jobs/${jobId}`);
    const job = await res.json();
    if (!res.ok) return;
    const url = job.session_url || "";
    if (url) {
      document.getElementById("upd-session-panel").classList.remove("hidden");
      document.getElementById("upd-session-url").value = url;
      const banner = document.getElementById("upd-session-ready");
      if (job.collab_status === "awaiting_client") {
        banner.textContent = "Session ready — paste URL into client agent.";
        banner.classList.remove("hidden");
      }
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
      updFinishProgress();
    } else if (job.status === "error" || job.collab_status === "failed") {
      clearInterval(updPollTimer);
      updPollTimer = null;
      document.getElementById("upd-error").textContent =
        job.error_message || "Update session failed";
      document.getElementById("upd-error").classList.remove("hidden");
      document.getElementById("upd-cancel-btn").disabled = true;
      updFinishProgress();
    }
  }

  document.getElementById("upd-start-btn").addEventListener("click", async () => {
    if (!updLastPayload || !document.getElementById("upd-confirm-check").checked)
      return;
    updStartProgress("Creating update session + packaging Figma…");
    document.getElementById("upd-start-btn").disabled = true;
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
        document.getElementById("upd-start-btn").disabled = false;
        return;
      }
      updJobId = data.job_id;
      document.getElementById("upd-cancel-btn").disabled = false;
      document.getElementById("upd-session-panel").classList.remove("hidden");
      if (data.session_url) {
        document.getElementById("upd-session-url").value = data.session_url;
      }
      if (updPollTimer) clearInterval(updPollTimer);
      updPollTimer = setInterval(() => pollUpdateJob(updJobId), 2000);
      pollUpdateJob(updJobId);
    } catch (err) {
      updFinishProgress();
      document.getElementById("upd-error").textContent = String(err);
      document.getElementById("upd-error").classList.remove("hidden");
      document.getElementById("upd-start-btn").disabled = false;
    }
  });

  document.getElementById("upd-copy-session").addEventListener("click", async () => {
    const input = document.getElementById("upd-session-url");
    const v = input.value;
    if (!v) return;
    try {
      await copyTextToClipboard(v);
      const btn = document.getElementById("upd-copy-session");
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
    if (!updJobId) return;
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
    document.getElementById("upd-cancel-btn").disabled = true;
  });

  // boot
  initDropdowns();
  window.addEventListener("hashchange", navigate);
  if (!location.hash || location.hash === "#") location.hash = "#/";
  navigate();
})();

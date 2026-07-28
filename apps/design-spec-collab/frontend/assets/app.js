const form = document.getElementById("intake-form");
const programmeEl = document.getElementById("programme");
const programmeNewEl = document.getElementById("programme-new");
const programmeExistingWrap = document.getElementById("programme-existing-wrap");
const programmeNewWrap = document.getElementById("programme-new-wrap");
const inheritsBlock = document.getElementById("inherits-block");
const anatomyWrap = document.getElementById("anatomy-wrap");
const themeFoundationBlock = document.getElementById("theme-foundation-block");
const themeReuseWrap = document.getElementById("theme-reuse-wrap");
const themeReuseProgrammeEl = document.getElementById("theme-reuse-programme");
const variablesLibraryWrap = document.getElementById("variables-library-wrap");
const result = document.getElementById("result");
const resultJson = document.getElementById("result-json");
const confirmSection = document.getElementById("confirm");
const confirmSummary = document.getElementById("confirm-summary");
const confirmCheck = document.getElementById("confirm-check");
const confirmBlocked = document.getElementById("confirm-blocked");
const createJobBtn = document.getElementById("create-job");
const jobPanel = document.getElementById("job-panel");
const jobMeta = document.getElementById("job-meta");
const jobJson = document.getElementById("job-json");
const jobDoneEl = document.getElementById("job-done");
const jobDoneTitleEl = document.getElementById("job-done-title");
const jobDoneMessageEl = document.getElementById("job-done-message");
const jobDoneDetailsEl = document.getElementById("job-done-details");
const jobDonePrEl = document.getElementById("job-done-pr");
const jobDoneZipEl = document.getElementById("job-done-zip");
const jobDoneSummaryEl = document.getElementById("job-done-summary");
const errorEl = document.getElementById("error");
const submitBtn = document.getElementById("submit-btn");
const progress = document.getElementById("progress");
const progressLabel = document.getElementById("progress-label");
const progressBar = document.getElementById("progress-bar");

const FIGMA_HOSTS = new Set(["figma.com", "www.figma.com"]);
const FILE_KEY_RE = /\/(?:design|file|proto|board|slides)\/([a-zA-Z0-9]+)/i;
const PROGRAMME_SLUG_RE = /^[a-z][a-z0-9-]{0,62}$/;
const MAX_ADDITIONAL_NOTES = 2000;

/** Client-side prechecks (server re-validates). */
const NOTES_SECRET_RE =
  /\b(cursor_|figd_|ghp_|gho_|github_pat_|AKIA)[a-zA-Z0-9_\-]{8,}\b|-----BEGIN [A-Z0-9 ]*PRIVATE KEY-----|(CURSOR_API_KEY|FIGMA_TOKEN|GITHUB_TOKEN)\s*=/i;
const NOTES_INJECTION_RE =
  /\b(ignore\s+(all\s+)?(previous|prior|above)\s+(instructions?|prompts?|rules?)|disregard\s+(all\s+)?(previous|prior|system)|you\s+are\s+now\b|jailbreak\b|bypass\s+(the\s+)?(guardrails?|allowlist)|ignore\s+(the\s+)?write[- ]?path\s+allowlist)\b/i;
const NOTES_DANGER_RE =
  /\b(curl\s+\S+\|\s*(ba)?sh|rm\s+-rf\s+\/|git\s+remote\s+set-url|javascript:|data:)\b/i;

const agentConfigEl = document.getElementById("agent-config");
const authBannerEl = document.getElementById("auth-banner");
const portalActorEl = document.getElementById("portal-actor");
const authActorSection = document.getElementById("auth-actor-section");
const authActorSummaryHint = document.getElementById("auth-actor-summary-hint");
const AUTH_SECTION_KEY = "collab.authSectionOpen";
const cancelJobBtn = document.getElementById("cancel-job");
const resetClaimBtn = document.getElementById("reset-claim");
const branchPanel = document.getElementById("branch-panel");
const branchNameEl = document.getElementById("branch-name");
const prLinkEl = document.getElementById("pr-link");
const checkoutHintEl = document.getElementById("checkout-hint");
const copyCheckoutBtn = document.getElementById("copy-checkout");
const downloadZipEl = document.getElementById("download-zip");
const sessionPanel = document.getElementById("session-panel");
const sessionUrlEl = document.getElementById("session-url");
const sessionReadyBanner = document.getElementById("session-ready-banner");
const copySessionUrlBtn = document.getElementById("copy-session-url");
const copyClientPromptBtn = document.getElementById("copy-client-prompt");
const downloadEvidenceEl = document.getElementById("download-evidence");
const openSessionEl = document.getElementById("open-session");
const collabTranscriptEl = document.getElementById("collab-transcript");
const resultsPlaceholder = document.getElementById("results-placeholder");
const specPreviewPanel = document.getElementById("spec-preview-panel");
const specPreviewMeta = document.getElementById("spec-preview-meta");
const specTabPreview = document.getElementById("spec-tab-preview");
const specTabSource = document.getElementById("spec-tab-source");
const specPreviewRendered = document.getElementById("spec-preview-rendered");
const specPreviewSource = document.getElementById("spec-preview-source");
const copySpecBtn = document.getElementById("copy-spec");
const openSpecRawEl = document.getElementById("open-spec-raw");
const layoutSplit = document.getElementById("layout-split");
const layoutDivider = document.getElementById("layout-divider");
const toggleResultsBtn = document.getElementById("toggle-results");

const LAYOUT_LEFT_KEY = "collab.layoutLeftPct";
const LAYOUT_RESULTS_KEY = "collab.resultsVisible";
const LEFT_PCT_MIN = 28;
const LEFT_PCT_MAX = 72;

/** @type {string|null} */
let currentJobId = null;
/** @type {string|null} */
let lastSpecContent = null;

/** Scroll/highlight once when session becomes ready for the client. */
let sessionReadyAnnouncedForJob = null;

/** @type {ReturnType<typeof setInterval>|null} */
let pollTimer = null;
/** @type {EventSource|null} */
let jobEventSource = null;

function apiHeaders(extra = {}) {
  const headers = { ...extra };
  const actor = String(portalActorEl?.value || "").trim();
  if (actor) headers["X-Portal-Actor"] = actor;
  return headers;
}

async function apiFetch(url, options = {}) {
  const opts = { ...options };
  opts.headers = apiHeaders(opts.headers || {});
  return fetch(url, opts);
}

async function loadAgentConfig() {
  try {
    const res = await fetch("/health");
    const h = await res.json();
    agentConfigEl.textContent =
      `Collab · figma=${h.figmaMode || "?"} · mcp=${h.figmaMcpConfigured ? "ready" : "missing"} · review=${h.serverReviewMode || "rules"} · ` +
      `PR=${h.autoCreatePr ? (h.githubPublishDryRun ? "dry-run" : h.github?.configured ? "github" : "needs GITHUB_TOKEN") : "off"} · ` +
      `base=${h.publicBaseUrl || "?"}`;
    const auth = h.auth || {};
    authBannerEl.textContent =
      `Auth: ${auth.authMode || "disabled"} (placeholder — SSO TBD). ` +
      (auth.authMode === "placeholder"
        ? "Set Actor below (sent as X-Portal-Actor)."
        : auth.authMode === "enforced"
          ? "AUTH_MODE=enforced returns 501 until SSO is wired."
          : "Open access until stakeholders pick SSO.");
    if (authActorSummaryHint) {
      const mode = auth.authMode || "disabled";
      authActorSummaryHint.textContent =
        mode === "placeholder"
          ? "placeholder · set actor"
          : mode === "enforced"
            ? "enforced · SSO TBD"
            : `${mode} · optional`;
    }
  } catch {
    agentConfigEl.textContent = "";
  }
}

function stopPolling() {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
  if (jobEventSource) {
    jobEventSource.close();
    jobEventSource = null;
  }
}

function clampLeftPct(pct) {
  return Math.min(LEFT_PCT_MAX, Math.max(LEFT_PCT_MIN, Math.round(pct)));
}

function applyLeftPct(pct) {
  if (!layoutSplit) return;
  const value = clampLeftPct(pct);
  layoutSplit.style.setProperty("--left-pct", `${value}%`);
  layoutDivider?.setAttribute("aria-valuenow", String(value));
  try {
    localStorage.setItem(LAYOUT_LEFT_KEY, String(value));
  } catch {
    /* ignore */
  }
}

function isResultsVisible() {
  return !layoutSplit?.classList.contains("results-collapsed");
}

function setResultsVisible(visible) {
  if (!layoutSplit || !toggleResultsBtn) return;
  layoutSplit.classList.toggle("results-collapsed", !visible);
  toggleResultsBtn.setAttribute("aria-pressed", visible ? "true" : "false");
  toggleResultsBtn.textContent = visible ? "Hide results" : "Show results";
  toggleResultsBtn.classList.remove("has-new-results");
  toggleResultsBtn.title = "Show or hide the results panel";
  if (layoutDivider) {
    layoutDivider.tabIndex = visible ? 0 : -1;
  }
  try {
    localStorage.setItem(LAYOUT_RESULTS_KEY, visible ? "1" : "0");
  } catch {
    /* ignore */
  }
}

function initAuthActorSection() {
  if (!authActorSection) return;
  try {
    const saved = localStorage.getItem(AUTH_SECTION_KEY);
    if (saved === "1") authActorSection.open = true;
    else if (saved === "0") authActorSection.open = false;
  } catch {
    /* ignore */
  }
  authActorSection.addEventListener("toggle", () => {
    try {
      localStorage.setItem(AUTH_SECTION_KEY, authActorSection.open ? "1" : "0");
    } catch {
      /* ignore */
    }
  });
}

function initLayoutControls() {
  let leftPct = 60;
  let resultsVisible = true;
  try {
    const savedPct = Number(localStorage.getItem(LAYOUT_LEFT_KEY));
    if (Number.isFinite(savedPct)) leftPct = savedPct;
    const savedVisible = localStorage.getItem(LAYOUT_RESULTS_KEY);
    if (savedVisible === "0") resultsVisible = false;
  } catch {
    /* ignore */
  }
  applyLeftPct(leftPct);
  setResultsVisible(resultsVisible);

  toggleResultsBtn?.addEventListener("click", () => {
    setResultsVisible(!isResultsVisible());
  });

  if (!layoutDivider || !layoutSplit) return;

  let dragging = false;

  const onPointerMove = (event) => {
    if (!dragging) return;
    const rect = layoutSplit.getBoundingClientRect();
    if (rect.width <= 0) return;
    const pct = ((event.clientX - rect.left) / rect.width) * 100;
    applyLeftPct(pct);
  };

  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    document.body.classList.remove("is-resizing");
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", endDrag);
    window.removeEventListener("pointercancel", endDrag);
  };

  layoutDivider.addEventListener("pointerdown", (event) => {
    if (!isResultsVisible() || window.matchMedia("(max-width: 960px)").matches) {
      return;
    }
    event.preventDefault();
    dragging = true;
    document.body.classList.add("is-resizing");
    layoutDivider.setPointerCapture?.(event.pointerId);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
  });

  layoutDivider.addEventListener("keydown", (event) => {
    if (!isResultsVisible()) return;
    const step = event.shiftKey ? 5 : 2;
    const current = Number(layoutDivider.getAttribute("aria-valuenow") || 50);
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      applyLeftPct(current - step);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      applyLeftPct(current + step);
    } else if (event.key === "Home") {
      event.preventDefault();
      applyLeftPct(LEFT_PCT_MIN);
    } else if (event.key === "End") {
      event.preventDefault();
      applyLeftPct(LEFT_PCT_MAX);
    }
  });
}

function updateResultsPlaceholder() {
  if (!resultsPlaceholder) return;
  const anyVisible =
    !result.classList.contains("hidden") ||
    !sessionPanel?.classList.contains("hidden") ||
    !jobPanel.classList.contains("hidden") ||
    !jobDoneEl.classList.contains("hidden") ||
    !specPreviewPanel?.classList.contains("hidden") ||
    !errorEl.classList.contains("hidden");
  resultsPlaceholder.classList.toggle("hidden", anyVisible);
  if (anyVisible && !isResultsVisible() && toggleResultsBtn) {
    toggleResultsBtn.classList.add("has-new-results");
    toggleResultsBtn.title = "Results updated — click to show the results panel";
  }
}

function renderMarkdownPreview(content) {
  if (typeof marked !== "undefined" && marked.parse) {
    return marked.parse(content, { gfm: true, breaks: false });
  }
  return content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function setSpecTab(mode) {
  const preview = mode === "preview";
  specTabPreview?.classList.toggle("active", preview);
  specTabSource?.classList.toggle("active", !preview);
  specTabPreview?.setAttribute("aria-selected", preview ? "true" : "false");
  specTabSource?.setAttribute("aria-selected", preview ? "false" : "true");
  specPreviewRendered?.classList.toggle("hidden", !preview);
  specPreviewSource?.classList.toggle("hidden", preview);
}

function renderSpecPreview(job) {
  if (!specPreviewPanel) return;
  const spec = job.design_spec;
  if (!spec?.content) {
    specPreviewPanel.classList.add("hidden");
    lastSpecContent = null;
    updateResultsPlaceholder();
    return;
  }

  lastSpecContent = spec.content;
  specPreviewPanel.classList.remove("hidden");
  const path = spec.path || spec.name || "design-spec.md";
  const turn = spec.turn != null ? ` · turn ${spec.turn}` : "";
  const chars = spec.charCount != null ? ` · ${spec.charCount.toLocaleString()} chars` : "";
  specPreviewMeta.textContent = `${path}${turn}${chars}`;

  specPreviewSource.textContent = spec.content;
  specPreviewRendered.innerHTML = renderMarkdownPreview(spec.content);
  setSpecTab("preview");

  if (job.job_id && openSpecRawEl) {
    openSpecRawEl.href = `/api/v1/intake/jobs/${job.job_id}/design-spec.md`;
  }
  updateResultsPlaceholder();
}

function hideJobDone() {
  jobDoneEl.classList.add("hidden");
  jobDoneEl.classList.remove("is-error", "is-cancelled");
  jobDonePrEl.classList.add("hidden");
  jobDoneZipEl.classList.add("hidden");
  jobDoneSummaryEl.classList.add("hidden");
  jobDoneSummaryEl.textContent = "";
  jobDoneDetailsEl.innerHTML = "";
  updateResultsPlaceholder();
}

/**
 * Clear session/job/spec/completion results before a new Start session.
 * Does not hide the routing preview JSON from Preview task.
 * Do not call on job completion — PR / zip must stay visible.
 */
function resetResultsPanelForNewSession() {
  stopPolling();
  currentJobId = null;
  lastSpecContent = null;
  sessionReadyAnnouncedForJob = null;

  clearError();
  hideJobDone();

  sessionPanel?.classList.add("hidden");
  if (sessionUrlEl) sessionUrlEl.value = "";
  sessionReadyBanner?.classList.add("hidden");
  if (sessionReadyBanner) sessionReadyBanner.textContent = "";
  if (collabTranscriptEl) collabTranscriptEl.innerHTML = "";
  if (openSessionEl) {
    openSessionEl.href = "#";
  }

  specPreviewPanel?.classList.add("hidden");
  if (specPreviewMeta) specPreviewMeta.textContent = "";
  if (specPreviewRendered) specPreviewRendered.innerHTML = "";
  if (specPreviewSource) specPreviewSource.textContent = "";
  if (openSpecRawEl) openSpecRawEl.href = "#";
  setSpecTab("preview");

  jobPanel.classList.add("hidden");
  if (jobMeta) jobMeta.textContent = "";
  if (jobJson) jobJson.textContent = "";
  branchPanel?.classList.add("hidden");
  downloadZipEl?.classList.add("hidden");
  if (prLinkEl) prLinkEl.textContent = "";
  if (branchNameEl) branchNameEl.textContent = "";
  if (checkoutHintEl) checkoutHintEl.textContent = "";
  if (cancelJobBtn) cancelJobBtn.disabled = true;
  if (resetClaimBtn) resetClaimBtn.disabled = true;

  updateResultsPlaceholder();
}

function renderSessionPanel(job) {
  if (!sessionPanel) return;
  const url = job.session_url || "";
  const collab = job.collab_status || "";
  const jobId = job.job_id || currentJobId || "";
  const readyForClient =
    Boolean(url) &&
    !url.startsWith("(") &&
    (collab === "awaiting_client" || collab === "reviewing" || collab === "done");

  if (url || collab === "packaging" || job.status === "running") {
    sessionPanel.classList.remove("hidden");
  } else {
    sessionPanel.classList.add("hidden");
  }

  if (url && !url.startsWith("(")) {
    sessionUrlEl.value = url;
    openSessionEl.href = url;
    if (downloadEvidenceEl && jobId) {
      downloadEvidenceEl.classList.remove("hidden");
      downloadEvidenceEl.dataset.jobId = jobId;
    }
  } else if (collab === "packaging" || job.status === "running") {
    sessionUrlEl.value = "(packaging… session URL appears when ready)";
    openSessionEl.removeAttribute("href");
    if (downloadEvidenceEl) {
      downloadEvidenceEl.classList.add("hidden");
      delete downloadEvidenceEl.dataset.jobId;
    }
  }

  if (sessionReadyBanner) {
    if (collab === "packaging") {
      sessionReadyBanner.classList.remove("hidden");
      sessionReadyBanner.classList.add("is-packing");
      sessionReadyBanner.textContent =
        "Packaging Figma evidence on the server… Session URL will be ready next.";
    } else if (readyForClient && collab === "awaiting_client") {
      sessionReadyBanner.classList.remove("hidden", "is-packing");
      sessionReadyBanner.textContent =
        "Session URL is ready — copy it and paste into the client agent (Devin). No further handoffs needed.";
      if (jobId && sessionReadyAnnouncedForJob !== jobId) {
        sessionReadyAnnouncedForJob = jobId;
        sessionPanel.scrollIntoView({ behavior: "smooth", block: "start" });
        sessionUrlEl.focus?.();
      }
    } else if (readyForClient && collab === "reviewing") {
      sessionReadyBanner.classList.remove("hidden", "is-packing");
      sessionReadyBanner.textContent =
        "Client result received — server is reviewing (rules only, no server LLM).";
    } else if (collab === "done") {
      sessionReadyBanner.classList.remove("hidden", "is-packing");
      sessionReadyBanner.textContent =
        "Session finished. Use the completion card for PR / zip download.";
    } else {
      sessionReadyBanner.classList.add("hidden");
      sessionReadyBanner.textContent = "";
    }
  }

  const events = Array.isArray(job.transcript) ? job.transcript : [];
  collabTranscriptEl.innerHTML = events
    .map((e) => {
      const at = e.at || "";
      const kind = e.kind || "";
      const msg = e.message || "";
      return `<li><span class="ts">${at}</span> <strong>${kind}</strong> — ${msg}</li>`;
    })
    .join("");
  updateResultsPlaceholder();
}

function renderJobDone(job) {
  const status = job.status;
  if (!["finished", "error", "cancelled"].includes(status)) {
    hideJobDone();
    return;
  }

  jobDoneEl.classList.remove("hidden", "is-error", "is-cancelled");
  const slug = job.preview?.slug || lastPreview?.slug || "component";
  const programme =
    job.preview?.programme || lastPreview?.programme || job.request?.programme || "";
  const jobId = job.job_id || currentJobId || "";

  if (status === "finished") {
    jobDoneTitleEl.textContent = "Collab complete";
    jobDoneMessageEl.textContent =
      "Server accepted the client result, published artifacts (PR when GitHub is configured), and prepared a download zip.";
  } else if (status === "error") {
    jobDoneEl.classList.add("is-error");
    jobDoneTitleEl.textContent = "Collab failed";
    jobDoneMessageEl.textContent =
      job.error_message || "The collab session stopped with an error.";
  } else {
    jobDoneEl.classList.add("is-cancelled");
    jobDoneTitleEl.textContent = "Collab cancelled";
    jobDoneMessageEl.textContent =
      job.error_message || "The session was cancelled before completion.";
  }

  const details = [];
  if (jobId) details.push(`Job ID: <code>${jobId}</code>`);
  if (job.session_id) details.push(`Session: <code>${job.session_id}</code>`);
  if (programme || slug) {
    details.push(
      `Component: <code>${programme ? programme + "/" : ""}${slug}</code>`
    );
  }
  if (job.turn != null) details.push(`Turn: <code>${job.turn}</code>`);
  if (job.branch) details.push(`Branch: <code>${job.branch}</code>`);
  if (job.publish_dry_run) details.push("Publish: <code>dry-run</code>");
  if (job.publish_error) details.push(`Publish error: <code>${job.publish_error}</code>`);
  jobDoneDetailsEl.innerHTML = details.map((d) => `<li>${d}</li>`).join("");

  if (job.pr_url && !String(job.pr_url).includes("dry_run=1")) {
    jobDonePrEl.classList.remove("hidden");
    jobDonePrEl.href = job.pr_url;
  } else if (job.pr_url && job.publish_dry_run) {
    jobDonePrEl.classList.remove("hidden");
    jobDonePrEl.href = job.pr_url;
    jobDonePrEl.textContent = "Dry-run PR placeholder";
  } else {
    jobDonePrEl.classList.add("hidden");
    jobDonePrEl.removeAttribute("href");
    jobDonePrEl.textContent = "Open pull request";
  }

  if (status === "finished" && jobId) {
    jobDoneZipEl.classList.remove("hidden");
    jobDoneZipEl.href = `/api/v1/intake/jobs/${jobId}/artifacts.zip`;
    jobDoneZipEl.setAttribute(
      "download",
      `design-spec-collab-${slug}-${String(jobId).slice(0, 8)}.zip`
    );
  } else {
    jobDoneZipEl.classList.add("hidden");
    jobDoneZipEl.removeAttribute("href");
  }

  const summary = (job.result_summary || "").trim();
  if (summary) {
    jobDoneSummaryEl.classList.remove("hidden");
    jobDoneSummaryEl.textContent =
      summary.length > 4000 ? summary.slice(0, 4000) + "\n…[truncated]" : summary;
  } else {
    jobDoneSummaryEl.classList.add("hidden");
    jobDoneSummaryEl.textContent = "";
  }

  jobDoneEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
  updateResultsPlaceholder();
  if (job.design_spec?.content && specPreviewPanel) {
    specPreviewPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

function renderJobRecord(job) {
  currentJobId = job.job_id || null;
  const bits = [
    `status=${job.status}`,
    job.collab_status ? `collab=${job.collab_status}` : null,
    job.session_id ? `session=${String(job.session_id).slice(0, 10)}…` : null,
    job.turn != null ? `turn=${job.turn}` : null,
    job.branch ? `branch=${job.branch}` : null,
    job.claim_bound ? "claim=bound" : "claim=open",
  ].filter(Boolean);
  jobMeta.textContent = bits.join(" · ");
  cancelJobBtn.disabled = !(
    currentJobId &&
    (job.status === "running" ||
      job.status === "pending" ||
      ["packaging", "awaiting_client", "reviewing"].includes(job.collab_status))
  );
  if (resetClaimBtn) {
    resetClaimBtn.disabled = !(currentJobId && job.claim_bound);
  }

  if (job.branch || job.pr_url || job.status === "finished") {
    branchPanel.classList.remove("hidden");
    branchNameEl.textContent = job.branch || "(no branch yet)";
    if (job.pr_url) {
      const label = job.publish_dry_run ? "Dry-run PR" : "PR";
      prLinkEl.innerHTML = `${label}: <a href="${job.pr_url}" target="_blank" rel="noopener">${job.pr_url}</a>`;
    } else if (job.publish_error) {
      prLinkEl.textContent = `Publish error: ${job.publish_error}`;
    } else if (job.status === "finished") {
      prLinkEl.textContent =
        "No PR — set GITHUB_TOKEN + GITHUB_REPO_URL and AUTO_CREATE_PR=true (or use dry-run).";
    } else {
      prLinkEl.textContent = "";
    }
    checkoutHintEl.textContent = job.ide_checkout_hint || "";
    if (job.status === "finished" && currentJobId) {
      downloadZipEl.classList.remove("hidden");
      downloadZipEl.href = `/api/v1/intake/jobs/${currentJobId}/artifacts.zip`;
      downloadZipEl.setAttribute(
        "download",
        `design-spec-collab-${job.preview?.slug || "component"}-${String(currentJobId).slice(0, 8)}.zip`
      );
    } else {
      downloadZipEl.classList.add("hidden");
    }
  } else {
    branchPanel.classList.add("hidden");
    downloadZipEl.classList.add("hidden");
  }

  renderSessionPanel(job);
  renderSpecPreview(job);

  if (["finished", "error", "cancelled"].includes(job.status)) {
    renderJobDone(job);
  } else {
    hideJobDone();
  }

  jobJson.textContent = JSON.stringify(
    {
      job_id: job.job_id,
      status: job.status,
      collab_status: job.collab_status,
      session_id: job.session_id,
      session_url: job.session_url,
      turn: job.turn,
      branch: job.branch,
      pr_url: job.pr_url,
      publish_dry_run: job.publish_dry_run,
      publish_error: job.publish_error,
      published_files: job.published_files,
      revise_count: job.revise_count,
      claim_bound: job.claim_bound,
      actor: job.actor,
      error_message: job.error_message,
      result_summary: job.result_summary,
      skill: job.prompt_package?.skill_route,
    },
    null,
    2
  );
  jobPanel.classList.remove("hidden");
  updateResultsPlaceholder();
}

function pollJob(jobId) {
  stopPolling();
  // Operator SSE for live transcript; poll remains source of truth for job record.
  try {
    jobEventSource = new EventSource(`/api/v1/intake/jobs/${jobId}/events`);
    const refresh = async () => {
      try {
        const res = await apiFetch(`/api/v1/intake/jobs/${jobId}`);
        if (!res.ok) return;
        renderJobRecord(await res.json());
      } catch {
        /* ignore */
      }
    };
    jobEventSource.onmessage = refresh;
    for (const kind of [
      "packaged",
      "client_result",
      "revise",
      "accepted",
      "error",
      "closed",
    ]) {
      jobEventSource.addEventListener(kind, refresh);
    }
    jobEventSource.onerror = () => {
      /* poll continues */
    };
  } catch {
    /* EventSource unavailable */
  }
  pollTimer = setInterval(async () => {
    try {
      const res = await apiFetch(`/api/v1/intake/jobs/${jobId}`);
      if (!res.ok) return;
      const job = await res.json();
      renderJobRecord(job);
      if (["finished", "error", "cancelled"].includes(job.status)) {
        stopPolling();
        // Keep results (PR / zip / spec / job-done) visible after completion.
        finishProgress(job.status === "finished", {
          clearIntakeForm: job.status === "finished",
        });
        if (job.status === "error") {
          showError(job.error_message || "Agent job failed");
          // Keep form filled so the user can fix/retry; require re-confirm.
          confirmCheck.checked = false;
          syncCreateJobEnabled();
        }
        if (job.status === "cancelled") {
          showError(job.error_message || "Agent cancelled");
          confirmCheck.checked = false;
          syncCreateJobEnabled();
        }
      }
    } catch {
      /* keep polling */
    }
  }, 2000);
}

/** @type {object|null} */
let lastPayload = null;
/** @type {object|null} */
let lastPreview = null;

function lines(text) {
  return String(text || "")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function showError(msg) {
  errorEl.textContent = msg;
  errorEl.classList.remove("hidden");
  updateResultsPlaceholder();
}

function clearError() {
  errorEl.classList.add("hidden");
  errorEl.textContent = "";
  updateResultsPlaceholder();
}

function setFieldErrors(listEl, messages) {
  listEl.innerHTML = "";
  if (!messages.length) {
    listEl.hidden = true;
    return;
  }
  listEl.hidden = false;
  for (const msg of messages) {
    const li = document.createElement("li");
    li.textContent = msg;
    listEl.appendChild(li);
  }
}

function validateFigmaUrl(url, bucket) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return `${bucket}: not a valid URL — ${url}`;
  }
  const host = (parsed.hostname || "").toLowerCase();
  if (!["http:", "https:"].includes(parsed.protocol) || !FIGMA_HOSTS.has(host)) {
    return `${bucket}: must be an https://www.figma.com/… link — ${url}`;
  }
  if (!FILE_KEY_RE.test(parsed.pathname)) {
    return `${bucket}: missing /design/<fileKey>/ (or file/proto) path — ${url}`;
  }
  const nodeId = parsed.searchParams.get("node-id") || parsed.searchParams.get("node_id");
  if (!nodeId || !String(nodeId).trim()) {
    return `${bucket}: missing node-id — re-paste the link with node-id=… — ${url}`;
  }
  return null;
}

function validateUrlBucket(textareaId, errorsId, bucket, { required }) {
  const urls = lines(document.getElementById(textareaId).value);
  const errors = [];
  if (required && urls.length === 0) {
    errors.push(`${bucket}: add at least one Figma URL with node-id.`);
  }
  for (const url of urls) {
    const err = validateFigmaUrl(url, bucket);
    if (err) errors.push(err);
  }
  setFieldErrors(document.getElementById(errorsId), errors);
  document.getElementById(textareaId).classList.toggle("invalid", errors.length > 0);
  return errors;
}

function validateAllFigmaUrls() {
  return [
    ...validateUrlBucket("main-urls", "main-urls-errors", "Main", { required: true }),
    ...validateUrlBucket("element-urls", "element-urls-errors", "Elements", { required: false }),
    ...validateUrlBucket("state-urls", "state-urls-errors", "States", { required: false }),
  ];
}

function programmeMode() {
  const checked = form.querySelector('input[name="programmeMode"]:checked');
  return checked ? checked.value : "existing";
}

function resolveProgrammeSlug() {
  if (programmeMode() === "new") {
    return String(programmeNewEl.value || "").trim().toLowerCase();
  }
  return String(programmeEl.value || "").trim().toLowerCase();
}

function syncProgrammeModeUi() {
  const isNew = programmeMode() === "new";
  programmeExistingWrap.classList.toggle("hidden", isNew);
  programmeNewWrap.classList.toggle("hidden", !isNew);
  programmeEl.required = !isNew;
  programmeNewEl.required = isNew;
  syncInheritsUi();
  syncThemeFoundationUi();
}

function syncThemeFoundationUi() {
  const slug = resolveProgrammeSlug();
  const show = Boolean(slug) && slug !== "ids";
  themeFoundationBlock.classList.toggle("hidden", !show);
  if (!show) return;
  const mode =
    form.querySelector('input[name="themeFoundation"]:checked')?.value || "reuse";
  themeReuseWrap.classList.toggle("hidden", mode !== "reuse");
  variablesLibraryWrap.classList.toggle("hidden", mode !== "generateFromFigma");
}

function syncInheritsUi() {
  const slug = resolveProgrammeSlug();
  const isIds = slug === "ids";
  inheritsBlock.classList.toggle("hidden", isIds);
  const unknown = !isIds && form.inheritsIds.value === "unknown";
  anatomyWrap.classList.toggle("hidden", !unknown);
}

let progressTimer = null;

function startProgress(label) {
  progress.classList.remove("hidden");
  progress.setAttribute("aria-busy", "true");
  progressLabel.textContent = label;
  progressBar.style.width = "8%";
  submitBtn.disabled = true;
  createJobBtn.disabled = true;
  let pct = 8;
  clearInterval(progressTimer);
  progressTimer = setInterval(() => {
    pct = Math.min(pct + Math.random() * 12, 90);
    progressBar.style.width = `${pct}%`;
  }, 280);
}

function finishProgress(ok, { clearIntakeForm = false } = {}) {
  clearInterval(progressTimer);
  progressBar.style.width = "100%";
  progressLabel.textContent = ok ? "Done" : "Stopped";
  progress.setAttribute("aria-busy", "false");
  setTimeout(() => {
    progress.classList.add("hidden");
    progressBar.style.width = "0%";
    submitBtn.disabled = false;
    if (clearIntakeForm) {
      resetIntakeFormForNextJob();
    } else {
      syncCreateJobEnabled();
    }
  }, ok ? 350 : 150);
}

/**
 * After a successful job: clear left-side intake so Start session cannot re-fire
 * the same payload. Never clears the results panel (PR / download stay visible).
 */
function resetIntakeFormForNextJob() {
  form.reset();
  const existing = form.querySelector('input[name="programmeMode"][value="existing"]');
  if (existing) existing.checked = true;
  const inheritsNo = form.querySelector('input[name="inheritsIds"][value="no"]');
  if (inheritsNo) inheritsNo.checked = true;
  const themeReuse = form.querySelector(
    'input[name="themeFoundation"][value="reuse"]'
  );
  if (themeReuse) themeReuse.checked = true;
  if (form.storybookExamples) form.storybookExamples.checked = false;
  confirmCheck.checked = false;
  lastPayload = null;
  lastPreview = null;
  confirmSection.classList.add("hidden");
  [
    "main-urls-errors",
    "element-urls-errors",
    "state-urls-errors",
    "additional-notes-errors",
    "variables-library-errors",
  ].forEach((id) => {
    const el = document.getElementById(id);
    if (el) setFieldErrors(el, []);
  });
  ["main-urls", "element-urls", "state-urls", "additional-notes", "variables-library-url"].forEach(
    (id) => {
      document.getElementById(id)?.classList.remove("invalid");
    }
  );
  syncProgrammeModeUi();
  createJobBtn.disabled = true;
}

function syncCreateJobEnabled() {
  const ready = Boolean(lastPreview?.ready_for_agent);
  const confirmed = confirmCheck.checked;
  createJobBtn.disabled = !(ready && confirmed && lastPayload);
  confirmBlocked.hidden = ready;
  if (!ready && lastPreview) {
    const why =
      (lastPreview.notes || []).find((n) => /inheritsIds=unknown|ready/i.test(n)) ||
      (lastPreview.notes || [])[0] ||
      "Resolve inheritsIds (yes/no) — or if unknown, answer “Same Figma anatomy as IDS?” — then Preview again.";
    confirmBlocked.textContent = `Not ready for agent: ${why}`;
  } else if (!ready) {
    confirmBlocked.textContent =
      "Resolve inheritsIds / ready_for_agent before creating a job.";
  }
}

function renderConfirm(preview) {
  const rows = [
    ["Programme", `${preview.programme_display_name} (${preview.programme})`],
    ["New programme?", preview.programme_is_new ? "yes" : "no"],
    ["Component", preview.component_display_name],
    ["Slug", preview.slug],
    ["Skill", preview.skill_route],
    ["Spec pattern", preview.spec_pattern],
    ["design-spec path", preview.design_spec_path],
    ["Figma map", preview.figma_map_path],
    ["Theme CSS", preview.theme_css_path || "—"],
    ["Root spec", preview.root_spec_path || "—"],
    [
      "Theme foundation",
      preview.theme_foundation
        ? preview.theme_foundation === "reuse"
          ? `reuse (${preview.theme_reuse_programme || "ids"})`
          : "generate from Figma variables"
        : "existing programme yaml",
    ],
    ["Primary node", `${preview.primary_file_key} / ${preview.primary_node_id}`],
    ["Storybook", preview.storybook_examples ? "yes" : "no"],
    [
      "Additional notes",
      lastPayload?.additionalNotes
        ? String(lastPayload.additionalNotes).slice(0, 200) +
          (String(lastPayload.additionalNotes).length > 200 ? "…" : "")
        : "—",
    ],
    ["Ready for agent", preview.ready_for_agent ? "yes" : "no"],
  ];
  confirmSummary.innerHTML = "";
  for (const [k, v] of rows) {
    const dt = document.createElement("dt");
    dt.textContent = k;
    const dd = document.createElement("dd");
    dd.textContent = v;
    if (k === "Ready for agent" && !preview.ready_for_agent) {
      dd.classList.add("warn");
    }
    confirmSummary.appendChild(dt);
    confirmSummary.appendChild(dd);
  }
  if (preview.notes?.length) {
    const dt = document.createElement("dt");
    dt.textContent = "Notes";
    const dd = document.createElement("dd");
    dd.textContent = preview.notes.join(" · ");
    confirmSummary.appendChild(dt);
    confirmSummary.appendChild(dd);
  }
  if (!preview.ready_for_agent) {
    const dt = document.createElement("dt");
    dt.textContent = "Action needed";
    const dd = document.createElement("dd");
    dd.classList.add("warn");
    dd.textContent =
      "Choose Inherits IDS = yes or no (recommended). If you keep unknown, set “Same Figma anatomy as an IDS component?” to yes/no, then click Preview task again.";
    confirmSummary.appendChild(dt);
    confirmSummary.appendChild(dd);
  }
  confirmSection.classList.remove("hidden");
  confirmCheck.checked = false;
  syncCreateJobEnabled();
  requestAnimationFrame(() => {
    confirmSection.scrollIntoView({ behavior: "smooth", block: "end" });
  });
}

function validateAdditionalNotes() {
  const el = document.getElementById("additional-notes");
  const listEl = document.getElementById("additional-notes-errors");
  const raw = String(el.value || "");
  const errors = [];
  if (raw.length > MAX_ADDITIONAL_NOTES) {
    errors.push(`Additional details too long (${raw.length}; max ${MAX_ADDITIONAL_NOTES}).`);
  }
  if (NOTES_SECRET_RE.test(raw)) {
    errors.push("Remove secrets/tokens — do not paste API keys into additional details.");
  }
  if (NOTES_INJECTION_RE.test(raw)) {
    errors.push(
      "This field is design context only — it cannot override skill, guardrails, or write paths."
    );
  }
  if (NOTES_DANGER_RE.test(raw)) {
    errors.push("Remove shell commands, repo overrides, or unsafe URIs.");
  }
  setFieldErrors(listEl, errors);
  el.classList.toggle("invalid", errors.length > 0);
  return errors;
}

function validateVariablesLibraryUrl() {
  const el = document.getElementById("variables-library-url");
  const listEl = document.getElementById("variables-library-errors");
  const slug = resolveProgrammeSlug();
  const mode =
    form.querySelector('input[name="themeFoundation"]:checked')?.value || "reuse";
  if (!slug || slug === "ids" || mode !== "generateFromFigma") {
    setFieldErrors(listEl, []);
    el.classList.remove("invalid");
    return [];
  }
  const url = String(el.value || "").trim();
  const errors = [];
  if (!url) {
    errors.push("Paste a Figma variables library URL (file key required).");
  } else {
    try {
      const parsed = new URL(url);
      const host = (parsed.hostname || "").toLowerCase();
      if (!["http:", "https:"].includes(parsed.protocol) || !FIGMA_HOSTS.has(host)) {
        errors.push("Must be an https://www.figma.com/… link.");
      } else if (!FILE_KEY_RE.test(parsed.pathname)) {
        errors.push("Missing /design/<fileKey>/ (or file/proto) path.");
      }
    } catch {
      errors.push("Not a valid URL.");
    }
  }
  setFieldErrors(listEl, errors);
  el.classList.toggle("invalid", errors.length > 0);
  return errors;
}

function buildPayload() {
  const programme = resolveProgrammeSlug();
  if (!programme) {
    showError(
      programmeMode() === "new"
        ? "Enter a new programme name."
        : "Select an existing programme."
    );
    return null;
  }
  if (programmeMode() === "new" && !PROGRAMME_SLUG_RE.test(programme)) {
    showError(
      "Programme name must be lowercase letters/digits/hyphens and start with a letter (e.g. my-programme)."
    );
    programmeNewEl.focus();
    return null;
  }

  const urlErrors = validateAllFigmaUrls();
  const notesErrors = validateAdditionalNotes();
  const varsErrors = validateVariablesLibraryUrl();
  if (urlErrors.length || notesErrors.length || varsErrors.length) {
    showError(
      "Fix form errors before submitting:\n" +
        [...urlErrors, ...notesErrors, ...varsErrors].join("\n")
    );
    return null;
  }

  const name = String(form.componentDisplayName.value || "").trim();
  if (!name) {
    showError("Component display name is required.");
    return null;
  }

  const notesRaw = String(form.additionalNotes?.value || "").trim();

  const payload = {
    programme,
    componentDisplayName: name,
    category: String(form.category.value || "").trim() || null,
    mainUrls: lines(form.mainUrls.value),
    elementUrls: lines(form.elementUrls.value),
    stateUrls: lines(form.stateUrls.value),
    storybookExamples: form.storybookExamples.checked,
  };
  if (notesRaw) {
    payload.additionalNotes = notesRaw;
  }

  if (programme !== "ids") {
    const mode =
      form.querySelector('input[name="themeFoundation"]:checked')?.value || "reuse";
    payload.themeFoundation = mode;
    if (mode === "reuse") {
      payload.themeReuseProgramme =
        String(themeReuseProgrammeEl.value || "ids").trim().toLowerCase() || "ids";
    } else {
      payload.variablesLibraryUrl = String(
        form.variablesLibraryUrl?.value || ""
      ).trim();
    }
  }

  if (programme !== "ids") {
    payload.inheritsIds = form.inheritsIds.value;
    const anatomy = form.sameAnatomyAsIds.value;
    if (payload.inheritsIds === "unknown") {
      if (!anatomy) {
        showError(
          "Inherits IDS is “unknown” — choose Same Figma anatomy as IDS? (yes/no), or set Inherits IDS to yes/no instead."
        );
        anatomyWrap.classList.remove("hidden");
        form.sameAnatomyAsIds.focus();
        return null;
      }
      payload.sameAnatomyAsIds = anatomy === "true";
    }
  }
  return payload;
}

async function loadProgrammes() {
  startProgress("Loading programmes…");
  try {
    const res = await apiFetch("/api/v1/programmes");
    const data = await res.json();
    if (!res.ok) {
      finishProgress(false);
      showError(typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail));
      return;
    }
    programmeEl.innerHTML = "";
    themeReuseProgrammeEl.innerHTML = "";
    for (const p of data.programmes || []) {
      const opt = document.createElement("option");
      opt.value = p.slug;
      opt.textContent = `${p.displayName} (${p.slug})`;
      programmeEl.appendChild(opt);

      const reuseOpt = document.createElement("option");
      reuseOpt.value = p.slug;
      reuseOpt.textContent = `${p.displayName} (${p.slug})`;
      if (p.slug === "ids") reuseOpt.selected = true;
      themeReuseProgrammeEl.appendChild(reuseOpt);
    }
    if (![...programmeEl.options].some((o) => o.value === "ids")) {
      const opt = document.createElement("option");
      opt.value = "ids";
      opt.textContent = "IDS (ids)";
      programmeEl.prepend(opt);
      const reuseOpt = document.createElement("option");
      reuseOpt.value = "ids";
      reuseOpt.textContent = "IDS (ids)";
      reuseOpt.selected = true;
      themeReuseProgrammeEl.prepend(reuseOpt);
    }
    syncProgrammeModeUi();
    finishProgress(true);
  } catch (err) {
    finishProgress(false);
    showError(`Failed to load programmes: ${err}`);
  }
}

form.addEventListener("change", (e) => {
  if (
    e.target.name === "programmeMode" ||
    e.target.name === "programmeExisting" ||
    e.target.name === "inheritsIds" ||
    e.target.name === "themeFoundation" ||
    e.target.id === "programme-new"
  ) {
    syncProgrammeModeUi();
    lastPreview = null;
    lastPayload = null;
    confirmSection.classList.add("hidden");
    createJobBtn.disabled = true;
  }
});

programmeEl.addEventListener("change", () => {
  syncThemeFoundationUi();
});

form.addEventListener("input", (e) => {
  if (e.target.id === "programme-new") syncInheritsUi();
  if (["main-urls", "element-urls", "state-urls"].includes(e.target.id)) {
    const map = {
      "main-urls": "main-urls-errors",
      "element-urls": "element-urls-errors",
      "state-urls": "state-urls-errors",
    };
    setFieldErrors(document.getElementById(map[e.target.id]), []);
    e.target.classList.remove("invalid");
    clearError();
  }
  if (e.target.id === "additional-notes") {
    setFieldErrors(document.getElementById("additional-notes-errors"), []);
    e.target.classList.remove("invalid");
    clearError();
  }
});

["main-urls", "element-urls", "state-urls"].forEach((id) => {
  document.getElementById(id).addEventListener("blur", () => {
    if (id === "main-urls") validateUrlBucket(id, "main-urls-errors", "Main", { required: false });
    if (id === "element-urls")
      validateUrlBucket(id, "element-urls-errors", "Elements", { required: false });
    if (id === "state-urls")
      validateUrlBucket(id, "state-urls-errors", "States", { required: false });
  });
});

document.getElementById("additional-notes").addEventListener("blur", () => {
  validateAdditionalNotes();
});

document.getElementById("variables-library-url").addEventListener("blur", () => {
  validateVariablesLibraryUrl();
});

confirmCheck.addEventListener("change", () => {
  syncCreateJobEnabled();
  if (confirmCheck.checked) {
    requestAnimationFrame(() => {
      createJobBtn.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = buildPayload();
  if (!payload) return;

  startProgress("Previewing task…");
  try {
    const res = await apiFetch("/api/v1/intake/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      finishProgress(false);
      const detail = data.detail;
      showError(typeof detail === "string" ? detail : JSON.stringify(detail, null, 2));
      return;
    }
    finishProgress(true);
    lastPayload = payload;
    lastPreview = data;
    resultJson.textContent = JSON.stringify(data, null, 2);
    result.classList.remove("hidden");
    renderConfirm(data);
    updateResultsPlaceholder();
  } catch (err) {
    finishProgress(false);
    showError(String(err));
  }
});

createJobBtn.addEventListener("click", async () => {
  if (!lastPayload || !lastPreview) {
    showError("Preview task first.");
    return;
  }
  if (!confirmCheck.checked) {
    showError("Check the confirm box before creating a job.");
    return;
  }
  if (!lastPreview.ready_for_agent) {
    showError("Intake is not ready for an agent job (inheritsIds unresolved).");
    return;
  }

  // Only Start session clears prior results; keep routing preview JSON.
  resetResultsPanelForNewSession();

  startProgress("Creating collab session + packaging Figma…");
  createJobBtn.disabled = true;
  try {
    const res = await apiFetch("/api/v1/intake/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ intake: lastPayload, confirmed: true }),
    });
    const data = await res.json();
    if (!res.ok) {
      finishProgress(false);
      const detail = data.detail;
      showError(typeof detail === "string" ? detail : JSON.stringify(detail, null, 2));
      createJobBtn.disabled = false;
      return;
    }
    renderJobRecord(data);
    if (data.status === "running" || data.agent_started || data.session_url) {
      progressLabel.textContent = "Collab session running… paste session URL into client";
      pollJob(data.job_id);
      return;
    }
    if (data.status === "finished") {
      finishProgress(true, { clearIntakeForm: true });
    } else {
      finishProgress(false);
      if (data.status === "error") {
        showError(data.message || "Job failed to start");
        confirmCheck.checked = false;
      }
    }
  } catch (err) {
    finishProgress(false);
    showError(String(err));
  } finally {
    syncCreateJobEnabled();
  }
});

cancelJobBtn.addEventListener("click", async () => {
  if (!currentJobId) return;
  clearError();
  cancelJobBtn.disabled = true;
  try {
    const res = await apiFetch(`/api/v1/intake/jobs/${currentJobId}/cancel`, {
      method: "POST",
    });
    const job = await res.json();
    if (!res.ok) {
      showError(typeof job.detail === "string" ? job.detail : JSON.stringify(job.detail));
      cancelJobBtn.disabled = false;
      return;
    }
    renderJobRecord(job);
    if (job.status === "cancelled") {
      stopPolling();
      finishProgress(false);
      showError(job.error_message || "Agent cancelled");
    }
  } catch (err) {
    showError(String(err));
    cancelJobBtn.disabled = false;
  }
});

copyCheckoutBtn.addEventListener("click", async () => {
  const text = checkoutHintEl.textContent || "";
  if (!text) return;
  try {
    await copyTextToClipboard(text);
    copyCheckoutBtn.textContent = "Copied";
    setTimeout(() => {
      copyCheckoutBtn.textContent = "Copy checkout commands";
    }, 1500);
  } catch (err) {
    showError(String(err.message || err));
  }
});

copySessionUrlBtn?.addEventListener("click", async () => {
  const text = sessionUrlEl?.value || "";
  if (!text || text.startsWith("(")) return;
  try {
    await copyTextToClipboard(text);
    copySessionUrlBtn.textContent = "Copied";
    setTimeout(() => {
      copySessionUrlBtn.textContent = "Copy session URL";
    }, 1500);
    clearError();
  } catch (err) {
    // Select the input so user can Ctrl/Cmd+C
    sessionUrlEl?.focus();
    sessionUrlEl?.select();
    showError(String(err.message || err));
  }
});

copyClientPromptBtn?.addEventListener("click", async () => {
  if (!currentJobId) return;
  try {
    const res = await apiFetch(`/api/v1/intake/jobs/${currentJobId}/client-prompt.md`);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      showError(
        typeof data.detail === "string" ? data.detail : "Could not load client prompt"
      );
      return;
    }
    const text = await res.text();
    await copyTextToClipboard(text);
    copyClientPromptBtn.textContent = "Copied";
    setTimeout(() => {
      copyClientPromptBtn.textContent = "Copy client prompt";
    }, 1500);
    clearError();
  } catch (err) {
    showError(String(err.message || err));
  }
});

downloadEvidenceEl?.addEventListener("click", async () => {
  const jobId = downloadEvidenceEl.dataset.jobId || currentJobId;
  if (!jobId) return;
  try {
    const res = await apiFetch(`/api/v1/intake/jobs/${jobId}/figma-evidence`);
    const data = await res.json();
    if (!res.ok) {
      showError(typeof data.detail === "string" ? data.detail : "Evidence not ready");
      return;
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `figma-evidence-${String(jobId).slice(0, 8)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    clearError();
  } catch (err) {
    showError(String(err.message || err));
  }
});

specTabPreview?.addEventListener("click", () => setSpecTab("preview"));
specTabSource?.addEventListener("click", () => setSpecTab("source"));

copySpecBtn?.addEventListener("click", async () => {
  if (!lastSpecContent) return;
  try {
    await copyTextToClipboard(lastSpecContent);
    copySpecBtn.textContent = "Copied";
    setTimeout(() => {
      copySpecBtn.textContent = "Copy markdown";
    }, 1500);
  } catch (err) {
    showError(String(err.message || err));
  }
});

resetClaimBtn?.addEventListener("click", async () => {
  if (!currentJobId) return;
  try {
    const res = await apiFetch(`/api/v1/intake/jobs/${currentJobId}/reset-claim`, {
      method: "POST",
    });
    const data = await res.json();
    if (!res.ok) {
      showError(typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail));
      return;
    }
    const jobRes = await apiFetch(`/api/v1/intake/jobs/${currentJobId}`);
    if (jobRes.ok) renderJobRecord(await jobRes.json());
  } catch (err) {
    showError(String(err));
  }
});

loadProgrammes();
loadAgentConfig();
initAuthActorSection();
initLayoutControls();

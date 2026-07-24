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
const cancelJobBtn = document.getElementById("cancel-job");
const branchPanel = document.getElementById("branch-panel");
const branchNameEl = document.getElementById("branch-name");
const prLinkEl = document.getElementById("pr-link");
const checkoutHintEl = document.getElementById("checkout-hint");
const copyCheckoutBtn = document.getElementById("copy-checkout");
const downloadZipEl = document.getElementById("download-zip");

/** @type {string|null} */
let currentJobId = null;

/** @type {ReturnType<typeof setInterval>|null} */
let pollTimer = null;

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
    if (h.cloudAgentDryRun) {
      agentConfigEl.textContent =
        "Agent mode: DRY-RUN (no Cursor Cloud call). Set CLOUD_AGENT_DRY_RUN=false + keys for real runs.";
    } else if (h.cloudAgentConfigured) {
      agentConfigEl.textContent = `Agent mode: Cursor Cloud ready · model=${h.cursorModel}`;
    } else {
      agentConfigEl.textContent =
        "Agent not configured — missing: " +
        (h.cloudAgentMissing || []).join(", ") +
        ". Jobs will error on start until env is set (or enable CLOUD_AGENT_DRY_RUN).";
    }
    const auth = h.auth || {};
    authBannerEl.textContent =
      `Auth: ${auth.authMode || "disabled"} (placeholder — SSO TBD). ` +
      (auth.authMode === "placeholder"
        ? "Set Actor below (sent as X-Portal-Actor)."
        : auth.authMode === "enforced"
          ? "AUTH_MODE=enforced returns 501 until SSO is wired."
          : "Open access until stakeholders pick SSO.");
    if (h.repoLock?.lockedRepoUrl) {
      agentConfigEl.textContent += ` · repo lock: ${h.repoLock.lockedRepoUrl}`;
    }
    if (h.cloudAutoCreatePr) {
      agentConfigEl.textContent += " · autoCreatePR=on";
    }
    if (h.github?.configured) {
      agentConfigEl.textContent += ` · GitHub zip ready (${h.github.repo || "?"})`;
    } else if (h.phase === "4") {
      agentConfigEl.textContent +=
        " · zip: dry-run uses local/placeholder; set GITHUB_TOKEN for PR branch files";
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
}

function hideJobDone() {
  jobDoneEl.classList.add("hidden");
  jobDoneEl.classList.remove("is-error", "is-cancelled");
  jobDonePrEl.classList.add("hidden");
  jobDoneZipEl.classList.add("hidden");
  jobDoneSummaryEl.classList.add("hidden");
  jobDoneSummaryEl.textContent = "";
  jobDoneDetailsEl.innerHTML = "";
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
    jobDoneTitleEl.textContent = "Job complete";
    jobDoneMessageEl.textContent =
      "The design-spec intake agent finished successfully. Review the PR, download artifacts, or check out the branch in Cursor IDE.";
  } else if (status === "error") {
    jobDoneEl.classList.add("is-error");
    jobDoneTitleEl.textContent = "Job failed";
    jobDoneMessageEl.textContent =
      job.error_message || "The agent stopped with an error. Fix the issue and run again.";
  } else {
    jobDoneEl.classList.add("is-cancelled");
    jobDoneTitleEl.textContent = "Job cancelled";
    jobDoneMessageEl.textContent =
      job.error_message || "The agent run was cancelled before completion.";
  }

  const details = [];
  if (jobId) details.push(`Job ID: <code>${jobId}</code>`);
  if (programme || slug) {
    details.push(
      `Component: <code>${programme ? programme + "/" : ""}${slug}</code>`
    );
  }
  if (job.branch) details.push(`Branch: <code>${job.branch}</code>`);
  if (job.agent_id) details.push(`Agent: <code>${job.agent_id}</code>`);
  if (job.run_id) details.push(`Run: <code>${job.run_id}</code>`);
  jobDoneDetailsEl.innerHTML = details.map((d) => `<li>${d}</li>`).join("");

  if (job.pr_url) {
    jobDonePrEl.classList.remove("hidden");
    jobDonePrEl.href = job.pr_url;
  } else {
    jobDonePrEl.classList.add("hidden");
    jobDonePrEl.removeAttribute("href");
  }

  if (status === "finished" && jobId) {
    jobDoneZipEl.classList.remove("hidden");
    jobDoneZipEl.href = `/api/v1/intake/jobs/${jobId}/artifacts.zip`;
    jobDoneZipEl.setAttribute(
      "download",
      `design-spec-${slug}-${String(jobId).slice(0, 8)}.zip`
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

  // Bring completion into view after long runs
  jobDoneEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function renderJobRecord(job) {
  currentJobId = job.job_id || null;
  const bits = [
    `status=${job.status}`,
    job.branch ? `branch=${job.branch}` : null,
    job.agent_id ? `agentId=${job.agent_id}` : null,
    job.run_id ? `runId=${job.run_id}` : null,
    job.locked_repo_url ? `repo=${job.locked_repo_url}` : null,
    job.session_path ? `session=${job.session_path}` : null,
  ].filter(Boolean);
  jobMeta.textContent = bits.join(" · ");
  cancelJobBtn.disabled = !(
    currentJobId && (job.status === "running" || job.status === "pending")
  );

  if (job.branch || job.status === "finished") {
    branchPanel.classList.remove("hidden");
    branchNameEl.textContent = job.branch || "(no branch yet)";
    if (job.pr_url) {
      prLinkEl.innerHTML = `PR: <a href="${job.pr_url}" target="_blank" rel="noopener">${job.pr_url}</a>`;
    } else if (job.status === "finished") {
      prLinkEl.textContent =
        "No PR URL — enable CLOUD_AUTO_CREATE_PR and/or GITHUB_TOKEN for GitHub PR fallback.";
    } else {
      prLinkEl.textContent = "";
    }
    checkoutHintEl.textContent =
      job.ide_checkout_hint ||
      (job.branch
        ? `git fetch origin && git checkout ${job.branch}\n# Open this branch in Cursor IDE to fine-tune.`
        : "");
    if (job.status === "finished" && currentJobId) {
      downloadZipEl.classList.remove("hidden");
      downloadZipEl.href = `/api/v1/intake/jobs/${currentJobId}/artifacts.zip`;
      downloadZipEl.setAttribute(
        "download",
        `design-spec-${job.preview?.slug || "component"}-${String(currentJobId).slice(0, 8)}.zip`
      );
    } else {
      downloadZipEl.classList.add("hidden");
      downloadZipEl.removeAttribute("href");
    }
  } else {
    branchPanel.classList.add("hidden");
    downloadZipEl.classList.add("hidden");
  }

  if (["finished", "error", "cancelled"].includes(job.status)) {
    renderJobDone(job);
  } else {
    hideJobDone();
  }

  jobJson.textContent = JSON.stringify(
    {
      job_id: job.job_id,
      status: job.status,
      actor: job.actor,
      branch: job.branch,
      pr_url: job.pr_url,
      ide_checkout_hint: job.ide_checkout_hint,
      agent_id: job.agent_id,
      run_id: job.run_id,
      cancel_requested: job.cancel_requested,
      locked_repo_url: job.locked_repo_url,
      error_message: job.error_message,
      result_summary: job.result_summary,
      skill: job.prompt_package?.skill_route,
      guardrails: job.prompt_package?.guardrails,
    },
    null,
    2
  );
  jobPanel.classList.remove("hidden");
}

function pollJob(jobId) {
  stopPolling();
  pollTimer = setInterval(async () => {
    try {
      const res = await apiFetch(`/api/v1/intake/jobs/${jobId}`);
      if (!res.ok) return;
      const job = await res.json();
      renderJobRecord(job);
      if (["finished", "error", "cancelled"].includes(job.status)) {
        stopPolling();
        finishProgress(job.status === "finished", {
          clearIntake: job.status === "finished",
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
}

function clearError() {
  errorEl.classList.add("hidden");
  errorEl.textContent = "";
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

function finishProgress(ok, { clearIntake = false } = {}) {
  clearInterval(progressTimer);
  progressBar.style.width = "100%";
  progressLabel.textContent = ok ? "Done" : "Stopped";
  progress.setAttribute("aria-busy", "false");
  setTimeout(() => {
    progress.classList.add("hidden");
    progressBar.style.width = "0%";
    submitBtn.disabled = false;
    if (clearIntake) {
      resetIntakeForNextJob();
    } else {
      syncCreateJobEnabled();
    }
  }, ok ? 350 : 150);
}

/** After a successful job: clear intake so Create Job cannot re-fire the same payload. */
function resetIntakeForNextJob() {
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
  result.classList.add("hidden");
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
      "Choose Inherits IDS = yes or no (recommended). If you keep unknown, set “Same Figma anatomy as an IDS component?” to yes/no, then click Preview routing again.";
    confirmSummary.appendChild(dt);
    confirmSummary.appendChild(dd);
  }
  confirmSection.classList.remove("hidden");
  confirmCheck.checked = false;
  syncCreateJobEnabled();
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

confirmCheck.addEventListener("change", syncCreateJobEnabled);

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearError();
  hideJobDone();
  jobPanel.classList.add("hidden");

  const payload = buildPayload();
  if (!payload) return;

  startProgress("Previewing routing…");
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
  } catch (err) {
    finishProgress(false);
    showError(String(err));
  }
});

createJobBtn.addEventListener("click", async () => {
  clearError();
  hideJobDone();
  if (!lastPayload || !lastPreview) {
    showError("Preview routing first.");
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

  startProgress("Creating job + starting agent…");
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
      return;
    }
    renderJobRecord({
      job_id: data.job_id,
      status: data.status,
      agent_id: null,
      run_id: null,
      session_path: data.session_path,
      error_message: data.status === "error" ? data.message : null,
      result_summary: null,
      prompt_package: data.prompt_package,
    });
    if (data.status === "running" || data.agent_started) {
      progressLabel.textContent = "Agent running…";
      pollJob(data.job_id);
      return;
    }
    // Finished immediately (e.g. dry-run with no background delay edge) or errored without run
    if (data.status === "finished") {
      finishProgress(true, { clearIntake: true });
    } else {
      finishProgress(false);
      if (data.status === "error") {
        showError(data.message || "Job failed to start agent");
        confirmCheck.checked = false;
      }
    }
  } catch (err) {
    finishProgress(false);
    showError(String(err));
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
    await navigator.clipboard.writeText(text);
    copyCheckoutBtn.textContent = "Copied";
    setTimeout(() => {
      copyCheckoutBtn.textContent = "Copy checkout commands";
    }, 1500);
  } catch {
    showError("Could not copy — select the checkout commands manually.");
  }
});

loadProgrammes();
loadAgentConfig();

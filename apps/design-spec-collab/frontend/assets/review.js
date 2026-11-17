/**
 * Review Workspace — pick Collab-generated GitHub PRs and preview Spec + Storybook.
 */
(function () {
  const viewReview = document.getElementById("view-review");
  if (!viewReview) return;

  const prListEl = document.getElementById("review-pr-list");
  const prStatusEl = document.getElementById("review-pr-status");
  const stateEl = document.getElementById("review-pr-state");
  const slugFilterEl = document.getElementById("review-slug-filter");
  const refreshBtn = document.getElementById("review-refresh-prs");
  const emptyEl = document.getElementById("review-empty");
  const activeEl = document.getElementById("review-active");
  const importBtn = document.getElementById("review-import-btn");
  const importStatusEl = document.getElementById("review-import-status");
  const openGhEl = document.getElementById("review-open-github");
  const selectedTitle = document.getElementById("review-selected-title");
  const selectedMeta = document.getElementById("review-selected-meta");
  const selectedEyebrow = document.getElementById("review-selected-eyebrow");
  const specPanel = document.getElementById("review-spec-panel");
  const tabSpec = document.getElementById("review-tab-spec");
  const tabSource = document.getElementById("review-tab-source");
  const tabSb = document.getElementById("review-tab-storybook");
  const specRendered = document.getElementById("review-spec-rendered");
  const specSource = document.getElementById("review-spec-source");
  const specMeta = document.getElementById("review-spec-meta");
  const sbPreview = document.getElementById("review-storybook-preview");
  const copyBtn = document.getElementById("review-copy-spec");
  const openRaw = document.getElementById("review-open-raw");
  const revisePanel = document.getElementById("review-revise-panel");
  const feedbackEl = document.getElementById("review-feedback");
  const reviseStorybookEl = document.getElementById("review-revise-storybook");
  const reviseBtn = document.getElementById("review-revise-btn");
  const reviseStatusEl = document.getElementById("review-revise-status");
  const reviseJobEl = document.getElementById("review-revise-job");
  const reviseJobMeta = document.getElementById("review-revise-job-meta");
  const bridgeCmdEl = document.getElementById("review-bridge-cmd");
  const copyBridgeBtn = document.getElementById("review-copy-bridge");
  const openSessionEl = document.getElementById("review-open-session");
  const downloadZipEl = document.getElementById("review-download-zip");
  const sessionReadyBanner = document.getElementById("review-session-ready-banner");
  const bridgeStatusEl = document.getElementById("review-bridge-status");
  const transcriptEl = document.getElementById("review-collab-transcript");
  const reviseDoneEl = document.getElementById("review-revise-done");
  const reviseDoneTitle = document.getElementById("review-revise-done-title");
  const reviseDoneMessage = document.getElementById("review-revise-done-message");
  const reviseDoneDetails = document.getElementById("review-revise-done-details");
  const reviseDonePr = document.getElementById("review-revise-done-pr");
  const reviseDoneZip = document.getElementById("review-revise-done-zip");
  const reimportBtn = document.getElementById("review-reimport-btn");

  let pullRequests = [];
  let selected = null;
  let currentImportId = null;
  let lastSpecContent = "";
  let preferredTab = "spec";
  let loadSeq = 0;
  let importGen = 0;
  let importAbort = null;
  let reviseJobId = null;
  let revisePollTimer = null;
  let reviseEventSource = null;
  let reviseReadyAnnounced = null;

  function apiFetch(path, init) {
    if (typeof window.apiFetch === "function") return window.apiFetch(path, init);
    const headers = Object.assign({}, (init && init.headers) || {});
    const actor = (localStorage.getItem("portalActor") || "").trim();
    if (actor) headers["X-Portal-Actor"] = actor;
    return fetch(path, Object.assign({}, init || {}, { headers }));
  }

  function renderMarkdown(content) {
    if (typeof marked !== "undefined" && marked.parse) {
      return marked.parse(content, { gfm: true, breaks: false });
    }
    return content
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function setTab(mode) {
    preferredTab = mode;
    const isSpec = mode === "spec";
    const isSource = mode === "source";
    const isSb = mode === "storybook";
    tabSpec?.classList.toggle("active", isSpec);
    tabSource?.classList.toggle("active", isSource);
    tabSb?.classList.toggle("active", isSb);
    specRendered?.classList.toggle("hidden", !isSpec);
    specSource?.classList.toggle("hidden", !isSource);
    if (sbPreview) {
      sbPreview.classList.toggle("hidden", !isSb);
      sbPreview.hidden = !isSb;
    }
  }

  function formatWhen(iso) {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      return d.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  }

  function renderPrList() {
    if (!prListEl) return;
    prListEl.innerHTML = "";
    if (!pullRequests.length) {
      const empty = document.createElement("p");
      empty.className = "hint review-pr-empty";
      empty.textContent =
        "No Collab pull requests matched. Generate a spec with publish enabled, or switch State.";
      prListEl.appendChild(empty);
      return;
    }
    pullRequests.forEach((pr) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "review-pr-item";
      btn.setAttribute("role", "option");
      const selectedOn =
        selected && Number(selected.number) === Number(pr.number);
      btn.classList.toggle("is-selected", selectedOn);
      btn.setAttribute("aria-selected", selectedOn ? "true" : "false");

      const badge = pr.state === "open" ? "Open" : "Closed";
      const slug = pr.slug || pr.componentDisplayName || "component";
      const prog = pr.programme ? `${pr.programme}/` : "";
      btn.innerHTML = `
        <span class="review-pr-item-top">
          <span class="review-pr-num">#${pr.number}</span>
          <span class="review-pr-badge review-pr-badge-${pr.state}">${badge}</span>
        </span>
        <span class="review-pr-item-title">${escapeHtml(pr.title || "Untitled")}</span>
        <span class="review-pr-item-meta">
          <span>${escapeHtml(prog + slug)}</span>
          <span>${escapeHtml(formatWhen(pr.updatedAt))}</span>
        </span>
      `;
      btn.addEventListener("click", () => selectPr(pr));
      prListEl.appendChild(btn);
    });
  }

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function clearStorybookPreview() {
    if (!sbPreview || !window.CollabStorybookPreview) return;
    if (typeof CollabStorybookPreview.abortLoad === "function") {
      CollabStorybookPreview.abortLoad(sbPreview);
    }
    sbPreview._sbLoadedKey = null;
    sbPreview._sbPayload = null;
    sbPreview._sbRebuildPolls = 0;
    if (sbPreview._sbRebuildTimer) {
      clearTimeout(sbPreview._sbRebuildTimer);
      sbPreview._sbRebuildTimer = null;
    }
    CollabStorybookPreview.setEmpty(
      sbPreview,
      "Select Load for review to import this PR, then open the Storybook tab."
    );
  }

  function selectPr(pr) {
    selected = pr;
    currentImportId = null;
    lastSpecContent = "";
    // Cancel any in-flight import / preview from the previous PR selection.
    importGen += 1;
    if (importAbort) {
      try {
        importAbort.abort();
      } catch (_) {
        /* ignore */
      }
      importAbort = null;
    }
    renderPrList();
    if (emptyEl) {
      emptyEl.hidden = true;
      emptyEl.classList.add("hidden");
    }
    if (activeEl) {
      activeEl.hidden = false;
      activeEl.classList.remove("hidden");
    }
    if (specPanel) {
      specPanel.hidden = true;
      specPanel.classList.add("hidden");
    }
    clearStorybookPreview();
    stopRevisePoll();
    reviseJobId = null;
    reviseReadyAnnounced = null;
    hideReviseDone();
    if (transcriptEl) transcriptEl.innerHTML = "";
    if (sessionReadyBanner) {
      sessionReadyBanner.classList.add("hidden");
      sessionReadyBanner.textContent = "";
    }
    if (bridgeStatusEl) {
      bridgeStatusEl.hidden = true;
      bridgeStatusEl.textContent = "";
    }
    if (downloadZipEl) {
      downloadZipEl.hidden = true;
      downloadZipEl.classList.add("hidden");
    }
    if (revisePanel) {
      revisePanel.hidden = true;
      revisePanel.classList.add("hidden");
    }
    if (reviseJobEl) {
      reviseJobEl.hidden = true;
      reviseJobEl.classList.add("hidden");
    }
    if (feedbackEl) feedbackEl.value = "";
    if (reviseStatusEl) reviseStatusEl.textContent = "";
    if (bridgeCmdEl) bridgeCmdEl.value = "";
    if (importStatusEl) {
      importStatusEl.textContent =
        "PR selected — importing design-spec and stories…";
    }
    if (selectedEyebrow) {
      selectedEyebrow.textContent = pr.draft ? "Draft pull request" : "Pull request";
    }
    if (selectedTitle) selectedTitle.textContent = pr.title || `PR #${pr.number}`;
    const bits = [
      `#${pr.number}`,
      pr.headBranch,
      pr.programme && pr.slug ? `${pr.programme}/${pr.slug}` : pr.slug,
      formatWhen(pr.updatedAt),
    ].filter(Boolean);
    if (selectedMeta) selectedMeta.textContent = bits.join(" · ");
    if (openGhEl) {
      openGhEl.href = pr.htmlUrl || "#";
      openGhEl.setAttribute("aria-disabled", pr.htmlUrl ? "false" : "true");
    }
    if (importBtn) importBtn.disabled = false;
    // Auto-import so switching PRs always loads that branch (no silent no-op).
    importSelected();
  }

  async function loadPullRequests() {
    const seq = ++loadSeq;
    if (prStatusEl) prStatusEl.textContent = "Loading Collab pull requests…";
    const state = stateEl?.value || "open";
    const slug = (slugFilterEl?.value || "").trim();
    let url = `/api/v1/review/pull-requests?state=${encodeURIComponent(state)}&limit=40`;
    if (slug) url += `&slug=${encodeURIComponent(slug)}`;
    try {
      const res = await apiFetch(url);
      const data = await res.json();
      if (seq !== loadSeq) return;
      if (!res.ok) {
        pullRequests = [];
        if (prStatusEl) {
          prStatusEl.textContent =
            typeof data.detail === "string" ? data.detail : "Could not load pull requests";
        }
        renderPrList();
        return;
      }
      if (!data.available) {
        pullRequests = [];
        if (prStatusEl) {
          prStatusEl.textContent =
            data.message || "GitHub is not configured for this Collab instance.";
        }
        renderPrList();
        return;
      }
      pullRequests = Array.isArray(data.pullRequests) ? data.pullRequests : [];
      if (prStatusEl) {
        const repo = data.repo ? ` · ${data.repo}` : "";
        prStatusEl.textContent = `${pullRequests.length} Collab PR${
          pullRequests.length === 1 ? "" : "s"
        }${repo}`;
      }
      renderPrList();
    } catch (err) {
      if (seq !== loadSeq) return;
      pullRequests = [];
      if (prStatusEl) prStatusEl.textContent = `Failed: ${err}`;
      renderPrList();
    }
  }

  async function importSelected() {
    if (!selected?.number) return;
    const gen = importGen;
    if (importBtn) importBtn.disabled = true;
    if (importStatusEl) {
      importStatusEl.textContent =
        "Importing design-spec and Storybook files from the PR head…";
    }
    if (importAbort) {
      try {
        importAbort.abort();
      } catch (_) {
        /* ignore */
      }
    }
    const ctrl =
      typeof AbortController !== "undefined" ? new AbortController() : null;
    importAbort = ctrl;
    const timer = setTimeout(() => {
      try {
        ctrl && ctrl.abort();
      } catch (_) {
        /* ignore */
      }
    }, 60000);
    try {
      const res = await apiFetch(
        `/api/v1/review/pull-requests/${encodeURIComponent(selected.number)}/import`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "{}",
          signal: ctrl ? ctrl.signal : undefined,
        }
      );
      if (gen !== importGen) return;
      const data = await res.json().catch(() => ({}));
      if (gen !== importGen) return;
      if (!res.ok) {
        if (importStatusEl) {
          importStatusEl.textContent =
            typeof data.detail === "string"
              ? data.detail
              : `Import failed (HTTP ${res.status})`;
        }
        if (importBtn) importBtn.disabled = false;
        return;
      }
      currentImportId = data.importId;
      const nFiles = (data.importedFiles || []).length;
      const rebuildMsg =
        data.prPreview?.status === "running" ||
        data.prPreview?.status === "pending" ||
        data.rebuild?.status === "running" ||
        data.rebuild?.status === "pending"
          ? " Per-PR Storybook preview building (usually under a minute)."
          : "";
      if (importStatusEl) {
        importStatusEl.textContent = `Imported ${nFiles} file${
          nFiles === 1 ? "" : "s"
        }.${rebuildMsg}`;
      }
      if (sbPreview) {
        sbPreview._sbLoadedKey = null;
        sbPreview._sbPayload = null;
      }
      await loadReviewContent(data.importId, gen);
      if (gen !== importGen) return;
      if (importBtn) importBtn.disabled = false;
    } catch (err) {
      if (gen !== importGen) return;
      const aborted =
        err && (err.name === "AbortError" || /abort/i.test(String(err)));
      if (importStatusEl) {
        importStatusEl.textContent = aborted
          ? "Import timed out (60s). If Collab was rebuilding Storybook, wait and retry — or restart the container."
          : `Import failed: ${err}`;
      }
      if (importBtn) importBtn.disabled = false;
    } finally {
      clearTimeout(timer);
      if (importAbort === ctrl) importAbort = null;
    }
  }

  async function loadReviewContent(importId, gen) {
    if (!specPanel) return;
    const myGen = gen != null ? gen : importGen;
    try {
      const res = await apiFetch(
        `/api/v1/review/sessions/${encodeURIComponent(importId)}/design-spec`
      );
      if (myGen !== importGen) return;
      const data = await res.json();
      if (myGen !== importGen) return;
      if (!res.ok) {
        if (importStatusEl) {
          importStatusEl.textContent =
            (importStatusEl.textContent || "") +
            " · Spec: " +
            (typeof data.detail === "string" ? data.detail : "not found");
        }
        // Still try Storybook
      } else {
        const spec = data.design_spec || {};
        lastSpecContent = spec.content || "";
        if (specRendered) specRendered.innerHTML = renderMarkdown(lastSpecContent);
        if (specSource) specSource.textContent = lastSpecContent;
        if (specMeta) {
          const bits = [
            spec.path,
            data.programme && data.slug ? `${data.programme}/${data.slug}` : null,
            spec.charCount != null ? `${spec.charCount.toLocaleString()} chars` : null,
          ].filter(Boolean);
          specMeta.textContent = bits.join(" · ");
        }
        if (openRaw) {
          openRaw.href = `/api/v1/review/sessions/${encodeURIComponent(importId)}/design-spec.md`;
        }
      }
      specPanel.hidden = false;
      specPanel.classList.remove("hidden");
      setTab(preferredTab === "source" ? "source" : "spec");
      if (window.CollabStorybookPreview && sbPreview) {
        CollabStorybookPreview.loadInto(sbPreview, {
          importId,
          theme: sbPreview.dataset.theme || "light",
          forceRefresh: true,
          cacheBust: String(Date.now()),
        });
      }
      // Prefer Storybook tab after import so UX reviewers land on the visual
      setTab("storybook");
      if (revisePanel) {
        revisePanel.hidden = false;
        revisePanel.classList.remove("hidden");
      }
      if (reviseStatusEl && !reviseJobId) {
        reviseStatusEl.textContent =
          "Enter feedback below, then Revise on this PR (same Bridge flow as Generate).";
      }
    } catch (err) {
      if (myGen !== importGen) return;
      if (importStatusEl) {
        importStatusEl.textContent = `Could not load review content: ${err}`;
      }
    }
  }

  function hideReviseDone() {
    if (!reviseDoneEl) return;
    reviseDoneEl.hidden = true;
    reviseDoneEl.classList.add("hidden");
    reviseDoneEl.classList.remove("is-error", "is-cancelled");
  }

  function showReviseDone(job) {
    if (!reviseDoneEl) return;
    const status = job.collab_status || job.status || "";
    const finished =
      status === "done" ||
      job.status === "finished" ||
      status === "failed" ||
      job.status === "error" ||
      status === "cancelled" ||
      job.status === "cancelled";
    if (!finished) {
      hideReviseDone();
      return;
    }
    reviseDoneEl.hidden = false;
    reviseDoneEl.classList.remove("hidden", "is-error", "is-cancelled");
    const jobId = job.job_id || reviseJobId || "";
    const prUrl = job.pr_url || "";
    const branch = job.branch || "";
    const zipHref = jobId
      ? `/api/v1/intake/jobs/${encodeURIComponent(jobId)}/artifacts.zip`
      : "";

    if (status === "failed" || job.status === "error") {
      reviseDoneEl.classList.add("is-error");
      if (reviseDoneTitle) reviseDoneTitle.textContent = "Revise failed";
      if (reviseDoneMessage) {
        reviseDoneMessage.textContent =
          job.error_message || job.result_summary || "The revise job failed.";
      }
    } else if (status === "cancelled" || job.status === "cancelled") {
      reviseDoneEl.classList.add("is-cancelled");
      if (reviseDoneTitle) reviseDoneTitle.textContent = "Revise cancelled";
      if (reviseDoneMessage) {
        reviseDoneMessage.textContent = "The revise session was cancelled.";
      }
    } else {
      if (reviseDoneTitle) reviseDoneTitle.textContent = "Revise complete";
      if (reviseDoneMessage) {
        reviseDoneMessage.textContent = prUrl
          ? "PR updated on this branch. Storybook preview is refreshing for this component."
          : "Server accepted the client result. Refresh the PR preview to see Spec / Storybook updates.";
      }
    }

    if (reviseDoneDetails) {
      const bits = [];
      if (jobId) bits.push(`<li>Job <code>${escapeHtml(jobId)}</code></li>`);
      if (branch) bits.push(`<li>Branch <code>${escapeHtml(branch)}</code></li>`);
      if (job.turn != null) bits.push(`<li>Turn ${escapeHtml(job.turn)}</li>`);
      if (Array.isArray(job.published_files) && job.published_files.length) {
        bits.push(
          `<li>Published ${job.published_files.length} file(s)</li>`
        );
      }
      reviseDoneDetails.innerHTML = bits.join("");
    }

    if (reviseDonePr) {
      if (prUrl) {
        reviseDonePr.href = prUrl;
        reviseDonePr.hidden = false;
        reviseDonePr.classList.remove("hidden");
      } else {
        reviseDonePr.hidden = true;
        reviseDonePr.classList.add("hidden");
      }
    }
    if (reviseDoneZip) {
      if (zipHref) {
        reviseDoneZip.href = zipHref;
        reviseDoneZip.hidden = false;
        reviseDoneZip.classList.remove("hidden");
      } else {
        reviseDoneZip.hidden = true;
        reviseDoneZip.classList.add("hidden");
      }
    }
    if (downloadZipEl && zipHref) {
      downloadZipEl.href = zipHref;
      downloadZipEl.hidden = false;
      downloadZipEl.classList.remove("hidden");
    }
    reviseDoneEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function renderTranscript(job) {
    if (!transcriptEl) return;
    const events = Array.isArray(job.transcript) ? job.transcript : [];
    if (window.CollabTranscript) {
      CollabTranscript.render(transcriptEl, events);
    } else {
      transcriptEl.innerHTML = events
        .slice()
        .reverse()
        .map((e) => {
          const at = escapeHtml(e.at || "");
          const kind = escapeHtml(e.kind || "");
          const msg = escapeHtml(e.message || "");
          return `<li><span class="ts">${at}</span> <strong>${kind}</strong> — ${msg}</li>`;
        })
        .join("");
    }
  }

  let announcedPrUrl = null;
  let storybookRefreshedKey = null;

  function maybeAutoRefreshReviewStorybook(job) {
    if (!job) return;
    const status = job.collab_status || job.status || "";
    const done = status === "done" || job.status === "finished";
    if (!done) return;
    const key = `${job.job_id || reviseJobId}:${job.pr_url || ""}:${job.turn || ""}`;
    if (storybookRefreshedKey === key) return;
    storybookRefreshedKey = key;
    if (sessionReadyBanner) {
      sessionReadyBanner.classList.remove("hidden", "is-packing");
      sessionReadyBanner.textContent =
        job.pr_url && !String(job.pr_url).includes("dry_run=1")
          ? `PR updated — refreshing Storybook preview…`
          : "Refreshing Storybook preview for this PR…";
    }
    // Re-import PR head so accepted_workspace + filtered build pick up new commits.
    // importSelected already force-refreshes Storybook — do not call loadInto again
    // here (that aborted the in-flight rebuild poll).
    const loadExisting = () => {
      setTab("storybook");
      if (currentImportId && window.CollabStorybookPreview && sbPreview) {
        CollabStorybookPreview.loadInto(sbPreview, {
          importId: currentImportId,
          theme: sbPreview.dataset.theme || "light",
          forceRefresh: true,
          cacheBust: String(Date.now()),
        });
      }
    };
    if (selected?.number) {
      Promise.resolve(importSelected())
        .then(() => {
          setTab("storybook");
          // GitHub head SHA can lag briefly after publish — retry once if still building.
          setTimeout(() => {
            if (storybookRefreshedKey !== key) return;
            const ready =
              sbPreview &&
              sbPreview._sbPayload &&
              sbPreview._sbPayload.available &&
              !sbPreview._sbRebuildTimer;
            if (ready) return;
            importSelected().catch(() => loadExisting());
          }, 10000);
        })
        .catch(() => loadExisting());
    } else {
      loadExisting();
    }
  }

  function renderSessionBanner(job) {
    if (!sessionReadyBanner) return;
    const collab = job.collab_status || "";
    const jobId = job.job_id || reviseJobId || "";
    if (collab === "packaging") {
      sessionReadyBanner.classList.remove("hidden");
      sessionReadyBanner.classList.add("is-packing");
      sessionReadyBanner.textContent =
        job.packaging_progress ||
        job.result_summary ||
        "Packaging Figma evidence… Bridge command will be ready next.";
    } else if (collab === "awaiting_client") {
      sessionReadyBanner.classList.remove("hidden", "is-packing");
      sessionReadyBanner.textContent =
        "Ready — run Copy Bridge command (same as Generate). Keep the terminal open until accept.";
      if (reviseJobId && reviseReadyAnnounced !== reviseJobId) {
        reviseReadyAnnounced = reviseJobId;
        reviseJobEl?.scrollIntoView({ behavior: "smooth", block: "start" });
        bridgeCmdEl?.focus?.();
      }
    } else if (collab === "reviewing") {
      sessionReadyBanner.classList.remove("hidden", "is-packing");
      sessionReadyBanner.textContent =
        "Client result received — server is reviewing (rules only).";
    } else if (collab === "done") {
      sessionReadyBanner.classList.remove("hidden", "is-packing");
      const pr =
        job.pr_url && !String(job.pr_url).includes("dry_run=1") ? job.pr_url : "";
      if (pr && announcedPrUrl !== `${jobId}:${pr}`) {
        announcedPrUrl = `${jobId}:${pr}`;
        sessionReadyBanner.textContent = `PR updated — ${pr}`;
      } else if (pr) {
        sessionReadyBanner.textContent = `PR updated — ${pr}. Refresh preview or open the PR.`;
      } else {
        sessionReadyBanner.textContent =
          "Session finished — see completion card below for PR / zip.";
      }
    } else {
      sessionReadyBanner.classList.add("hidden");
      sessionReadyBanner.textContent = "";
    }
  }

  function renderBridgeStatus(job) {
    if (!bridgeStatusEl) return;
    const collab = job.collab_status || "";
    const hb = job.bridge_last_heartbeat_at;
    const label = job.bridge_label || "";
    const progress = (job.bridge_progress || "").trim();
    if (hb) {
      bridgeStatusEl.hidden = false;
      bridgeStatusEl.textContent = progress
        ? `Bridge: ${progress}${label ? ` · ${label}` : ""} — ${hb}`
        : `Bridge connected${label ? ` (${label})` : ""} — last heartbeat ${hb}`;
    } else if (collab === "awaiting_client") {
      bridgeStatusEl.hidden = false;
      bridgeStatusEl.textContent =
        "Waiting for Bridge… run the command in a terminal on your machine.";
    } else {
      bridgeStatusEl.hidden = true;
      bridgeStatusEl.textContent = "";
    }
  }

  function stopRevisePoll() {
    if (revisePollTimer) {
      clearInterval(revisePollTimer);
      revisePollTimer = null;
    }
    if (reviseEventSource) {
      try {
        reviseEventSource.close();
      } catch (_) {
        /* ignore */
      }
      reviseEventSource = null;
    }
  }

  function startReviseLiveEvents(jobId) {
    if (reviseEventSource) {
      try {
        reviseEventSource.close();
      } catch (_) {
        /* ignore */
      }
      reviseEventSource = null;
    }
    try {
      reviseEventSource = new EventSource(
        `/api/v1/intake/jobs/${encodeURIComponent(jobId)}/events`
      );
      const refresh = () => {
        pollReviseJob(jobId);
      };
      reviseEventSource.onmessage = refresh;
      for (const kind of [
        "packaging",
        "packaged",
        "client_result",
        "revise",
        "accepted",
        "error",
        "closed",
      ]) {
        reviseEventSource.addEventListener(kind, refresh);
      }
      reviseEventSource.onerror = () => {
        /* interval poll remains source of truth */
      };
    } catch (_) {
      /* EventSource unavailable — poll only */
    }
  }

  async function pollReviseJob(jobId) {
    try {
      const res = await apiFetch(`/api/v1/intake/jobs/${encodeURIComponent(jobId)}`);
      const job = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (reviseStatusEl) {
          reviseStatusEl.textContent =
            typeof job.detail === "string" ? job.detail : `Job poll failed (${res.status})`;
        }
        return;
      }
      const status = job.collab_status || job.status || "";
      const cmd = job.bridge_command || "";
      if (reviseJobEl) {
        reviseJobEl.hidden = false;
        reviseJobEl.classList.remove("hidden");
      }
      if (reviseJobMeta) {
        const bits = [
          `Job ${job.job_id || jobId}`,
          status,
          job.turn != null ? `turn ${job.turn}` : null,
          job.pr_url ? "PR linked" : null,
          job.branch ? `branch ${job.branch}` : null,
        ].filter(Boolean);
        reviseJobMeta.textContent = bits.join(" · ");
      }
      if (bridgeCmdEl && cmd && !String(cmd).startsWith("(")) {
        bridgeCmdEl.value =
          typeof window.collabBridgeCommand === "function" && job.session_url
            ? window.collabBridgeCommand(
                typeof window.collabPublicizeUrl === "function"
                  ? window.collabPublicizeUrl(job.session_url)
                  : job.session_url
              )
            : cmd;
      } else if (bridgeCmdEl && status === "packaging") {
        bridgeCmdEl.value = "(packaging… Bridge command appears when ready)";
      }
      if (openSessionEl && job.session_url) {
        openSessionEl.href = job.session_url;
        openSessionEl.hidden = false;
      }

      renderSessionBanner(job);
      renderBridgeStatus(job);
      renderTranscript(job);
      showReviseDone(job);
      maybeAutoRefreshReviewStorybook(job);

      if (window.CollabIdleSession) {
        CollabIdleSession.syncFromJob(job, {
          onEnd: async () => {
            const id = job.job_id || reviseJobId;
            if (!id) return;
            await apiFetch(`/api/v1/intake/jobs/${encodeURIComponent(id)}/close-idle`, {
              method: "POST",
            });
            stopRevisePoll();
            reviseJobId = null;
          },
        });
      }

      if (reviseStatusEl) {
        if (status === "packaging") {
          reviseStatusEl.textContent =
            job.packaging_progress ||
            job.result_summary ||
            "Packaging Figma evidence…";
        } else if (status === "awaiting_client") {
          reviseStatusEl.textContent =
            "Awaiting Bridge/client — copy the Bridge command below.";
        } else if (status === "reviewing") {
          reviseStatusEl.textContent = "Server reviewing client artifacts…";
        } else if (status === "done" || job.status === "finished") {
          reviseStatusEl.textContent = job.pr_url
            ? `Complete — PR updated (${job.pr_url})`
            : "Complete — refresh PR preview to see updates.";
          stopRevisePoll();
          if (reviseBtn) reviseBtn.disabled = false;
        } else if (status === "failed" || job.status === "error") {
          reviseStatusEl.textContent =
            job.error_message || job.result_summary || "Revise job failed";
          stopRevisePoll();
          if (reviseBtn) reviseBtn.disabled = false;
        } else if (status === "cancelled" || job.status === "cancelled") {
          reviseStatusEl.textContent = "Revise cancelled";
          stopRevisePoll();
          if (reviseBtn) reviseBtn.disabled = false;
        } else {
          reviseStatusEl.textContent =
            job.bridge_progress ||
            job.packaging_progress ||
            job.result_summary ||
            `Status: ${status}`;
        }
      }
    } catch (err) {
      if (reviseStatusEl) reviseStatusEl.textContent = `Poll failed: ${err}`;
    }
  }

  async function startRevise() {
    if (!currentImportId) {
      if (reviseStatusEl) {
        reviseStatusEl.textContent = "Import a PR first, then enter feedback.";
      }
      return;
    }
    const feedback = (feedbackEl?.value || "").trim();
    if (!feedback) {
      if (reviseStatusEl) reviseStatusEl.textContent = "Enter reviewer feedback first.";
      feedbackEl?.focus();
      return;
    }
    if (reviseBtn) reviseBtn.disabled = true;
    stopRevisePoll();
    hideReviseDone();
    reviseReadyAnnounced = null;
    if (transcriptEl) transcriptEl.innerHTML = "";
    if (sessionReadyBanner) {
      sessionReadyBanner.classList.add("hidden");
      sessionReadyBanner.textContent = "";
    }
    if (reviseStatusEl) {
      reviseStatusEl.textContent = "Starting revise job (packaging Figma like Generate)…";
    }
    try {
      const res = await apiFetch(
        `/api/v1/review/sessions/${encodeURIComponent(currentImportId)}/revise`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            feedback,
            storybookExamples: !!(reviseStorybookEl && reviseStorybookEl.checked),
            confirmed: true,
          }),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (reviseStatusEl) {
          reviseStatusEl.textContent =
            typeof data.detail === "string"
              ? data.detail
              : data.detail?.message || `Revise failed (HTTP ${res.status})`;
        }
        if (reviseBtn) reviseBtn.disabled = false;
        return;
      }
      reviseJobId = data.job_id;
      if (reviseStatusEl) {
        reviseStatusEl.textContent =
          data.message ||
          `Revise job ${reviseJobId} started for PR #${data.prNumber} on ${data.headBranch}.`;
      }
      if (bridgeCmdEl) {
        bridgeCmdEl.value =
          data.bridge_command || "(packaging… Bridge command appears when ready)";
      }
      if (reviseJobEl) {
        reviseJobEl.hidden = false;
        reviseJobEl.classList.remove("hidden");
      }
      if (openSessionEl && data.session_url) {
        openSessionEl.href = data.session_url;
      }
      await pollReviseJob(reviseJobId);
      startReviseLiveEvents(reviseJobId);
      revisePollTimer = setInterval(() => pollReviseJob(reviseJobId), 2500);
    } catch (err) {
      if (reviseStatusEl) reviseStatusEl.textContent = `Revise failed: ${err}`;
      if (reviseBtn) reviseBtn.disabled = false;
    }
  }

  function initReviewPage() {
    if (emptyEl) {
      emptyEl.hidden = false;
      emptyEl.classList.remove("hidden");
    }
    if (activeEl) {
      activeEl.hidden = true;
      activeEl.classList.add("hidden");
    }
    if (revisePanel) {
      revisePanel.hidden = true;
      revisePanel.classList.add("hidden");
    }
    stopRevisePoll();
    reviseJobId = null;
    selected = null;
    currentImportId = null;
    loadPullRequests();
  }

  refreshBtn?.addEventListener("click", () => loadPullRequests());
  stateEl?.addEventListener("change", () => loadPullRequests());
  let slugTimer = null;
  slugFilterEl?.addEventListener("input", () => {
    clearTimeout(slugTimer);
    slugTimer = setTimeout(() => loadPullRequests(), 350);
  });
  importBtn?.addEventListener("click", () => importSelected());
  reviseBtn?.addEventListener("click", () => startRevise());
  reimportBtn?.addEventListener("click", () => {
    if (selected?.number) importSelected();
  });
  copyBridgeBtn?.addEventListener("click", async () => {
    const text = bridgeCmdEl?.value || "";
    if (!text || text.startsWith("(")) return;
    try {
      if (typeof window.copyTextToClipboard === "function") {
        await window.copyTextToClipboard(text);
      } else {
        await navigator.clipboard.writeText(text);
      }
      copyBridgeBtn.textContent = "Copied";
      setTimeout(() => {
        copyBridgeBtn.textContent = "Copy Bridge command";
      }, 1400);
    } catch (_) {
      /* ignore */
    }
  });
  tabSpec?.addEventListener("click", () => setTab("spec"));
  tabSource?.addEventListener("click", () => setTab("source"));
  tabSb?.addEventListener("click", () => {
    setTab("storybook");
    // Reuse cached preview — do not rebuild when switching back to this tab.
    if (currentImportId && window.CollabStorybookPreview && sbPreview) {
      CollabStorybookPreview.loadInto(sbPreview, {
        importId: currentImportId,
        theme: sbPreview.dataset.theme || "light",
      });
    }
  });
  copyBtn?.addEventListener("click", async () => {
    if (!lastSpecContent) return;
    try {
      if (typeof window.copyTextToClipboard === "function") {
        await window.copyTextToClipboard(lastSpecContent);
      } else {
        await navigator.clipboard.writeText(lastSpecContent);
      }
      copyBtn.textContent = "Copied";
      setTimeout(() => {
        copyBtn.textContent = "Copy markdown";
      }, 1400);
    } catch (_) {
      /* ignore */
    }
  });

  if (sbPreview && window.CollabStorybookPreview) {
    CollabStorybookPreview.bindPreviewChrome(sbPreview, () => {
      if (currentImportId) {
        CollabStorybookPreview.loadInto(sbPreview, {
          importId: currentImportId,
          theme: sbPreview.dataset.theme || "light",
          forceRefresh: true,
          cacheBust: String(Date.now()),
        });
      }
    });
  }

  window.CollabReviewWorkspace = {
    init: initReviewPage,
    view: viewReview,
  };

  if (window.CollabTranscript) {
    CollabTranscript.bindToggle(document.getElementById("review-transcript-block"));
  }
})();

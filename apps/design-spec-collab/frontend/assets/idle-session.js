/**
 * Operator-browser idle timeout after a job reaches a terminal state (B2).
 * Does not cancel in-flight jobs. End closes the finished session on the server
 * and navigates to Dashboard — Bridge OS process is not killed.
 */
(function (global) {
  let idleMs = 10 * 60 * 1000;
  let timer = null;
  let armed = false;
  let dialogEl = null;
  let onEnd = null;
  let activityBound = false;

  function apiFetch(path, init) {
    if (typeof global.apiFetch === "function") return global.apiFetch(path, init);
    return fetch(path, init || {});
  }

  async function loadConfig() {
    try {
      const res = await apiFetch("/health");
      const data = await res.json().catch(() => ({}));
      const mins = Number(data.operatorIdleMinutes);
      if (Number.isFinite(mins) && mins >= 1) {
        idleMs = Math.round(mins * 60 * 1000);
      }
    } catch (_) {
      /* keep default 10m */
    }
  }

  function ensureDialog() {
    if (dialogEl) return dialogEl;
    const el = document.createElement("div");
    el.id = "collab-idle-dialog";
    el.className = "collab-idle-dialog hidden";
    el.hidden = true;
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("aria-labelledby", "collab-idle-title");
    el.innerHTML = `
      <div class="collab-idle-dialog-backdrop"></div>
      <div class="collab-idle-dialog-card card">
        <h2 id="collab-idle-title">Continue this session?</h2>
        <p class="hint">
          No activity in the Collab UI for a while after this job finished.
          Continue keeps watching this finished session for follow-ups.
          End closes it on the server and returns to the Dashboard
          (stop the Bridge terminal yourself if it is still running).
        </p>
        <div class="actions">
          <button type="button" class="button primary" data-idle-continue>Continue</button>
          <button type="button" class="button secondary" data-idle-end>End session</button>
        </div>
      </div>`;
    document.body.appendChild(el);
    el.querySelector("[data-idle-continue]")?.addEventListener("click", () => {
      hideDialog();
      resetTimer();
    });
    el.querySelector("[data-idle-end]")?.addEventListener("click", async () => {
      hideDialog();
      disarm();
      if (typeof onEnd === "function") {
        try {
          await onEnd();
        } catch (_) {
          /* caller handles */
        }
      }
      global.location.hash = "#/";
    });
    dialogEl = el;
    return el;
  }

  function showDialog() {
    const el = ensureDialog();
    el.hidden = false;
    el.classList.remove("hidden");
  }

  function hideDialog() {
    if (!dialogEl) return;
    dialogEl.hidden = true;
    dialogEl.classList.add("hidden");
  }

  function clearTimer() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  function resetTimer() {
    clearTimer();
    if (!armed) return;
    timer = setTimeout(() => {
      showDialog();
    }, idleMs);
  }

  function onActivity() {
    if (!armed) return;
    if (dialogEl && !dialogEl.hidden) return; // wait for Continue/End
    resetTimer();
  }

  function bindActivity() {
    if (activityBound) return;
    activityBound = true;
    const opts = { capture: true, passive: true };
    ["mousemove", "mousedown", "keydown", "scroll", "touchstart", "click"].forEach(
      (ev) => global.addEventListener(ev, onActivity, opts)
    );
  }

  /**
   * Arm idle watch only for terminal jobs (finished / done / error / cancelled).
   * @param {{ onEnd: () => Promise<void>|void }} opts
   */
  function arm(opts) {
    onEnd = opts && opts.onEnd;
    armed = true;
    bindActivity();
    hideDialog();
    resetTimer();
  }

  function disarm() {
    armed = false;
    clearTimer();
    hideDialog();
  }

  /**
   * Call from job pollers when status changes.
   * @param {{ status?: string, collab_status?: string, operator_closed?: boolean }} job
   * @param {{ onEnd: () => Promise<void>|void }} opts
   */
  function syncFromJob(job, opts) {
    if (!job) {
      disarm();
      return;
    }
    if (job.operator_closed) {
      disarm();
      return;
    }
    const status = job.status || "";
    const collab = job.collab_status || "";
    const terminal =
      ["finished", "error", "cancelled"].includes(status) ||
      ["done", "failed", "cancelled"].includes(collab);
    const inFlight = ["packaging", "awaiting_client", "reviewing"].includes(collab) ||
      status === "running";
    if (inFlight) {
      disarm();
      return;
    }
    if (terminal) {
      if (!armed) arm(opts || {});
      else if (opts && opts.onEnd) onEnd = opts.onEnd;
    } else {
      disarm();
    }
  }

  loadConfig();

  global.CollabIdleSession = {
    syncFromJob,
    arm,
    disarm,
    resetTimer,
    loadConfig,
  };
})(typeof window !== "undefined" ? window : globalThis);

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { addons, types, useStorybookState } from "@storybook/manager-api";

const ADDON_ID = "sdd-ids/scratchpad";
const PANEL_ID = `${ADDON_ID}/panel`;
const STORAGE_KEY = "storybook-scratchpad-notes";

type NotesMap = Record<string, { note: string; updatedAt: string }>;

function readNotes(): NotesMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as NotesMap) : {};
  } catch {
    return {};
  }
}

function writeNotes(notes: NotesMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function ScratchpadPanel() {
  const { storyId } = useStorybookState();
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("");
  const notesCount = useMemo(() => Object.keys(readNotes()).length, [note, storyId]);

  useEffect(() => {
    if (!storyId) {
      setNote("");
      return;
    }
    const all = readNotes();
    setNote(all[storyId]?.note || "");
    setStatus("");
  }, [storyId]);

  const persist = useCallback(
    (value: string) => {
      if (!storyId) return;
      const all = readNotes();
      if (!value.trim()) {
        delete all[storyId];
      } else {
        all[storyId] = { note: value, updatedAt: new Date().toISOString() };
      }
      writeNotes(all);
    },
    [storyId],
  );

  useEffect(() => {
    if (!storyId) return;
    const t = window.setTimeout(() => persist(note), 400);
    return () => window.clearTimeout(t);
  }, [note, persist, storyId]);

  const copyAll = async () => {
    const all = readNotes();
    const entries = Object.entries(all);
    const md =
      entries.length === 0
        ? "No notes to copy."
        : [
            "## Storybook Feedback",
            "",
            ...entries.flatMap(([id, data]) => [`### ${id}`, data.note, ""]),
          ].join("\n");
    try {
      await navigator.clipboard.writeText(md);
      setStatus("Copied all notes");
    } catch {
      setStatus("Copy failed — select text manually");
    }
  };

  if (!storyId) {
    return (
      <div style={{ padding: 12, fontSize: 13, opacity: 0.8 }}>
        Select a story to add Scratchpad notes.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, height: "100%", padding: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
        <strong style={{ fontSize: 13 }}>Scratchpad</strong>
        <code style={{ fontSize: 11, opacity: 0.7 }}>{storyId}</code>
      </div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add feedback for this story… (auto-saves)"
        style={{
          flex: 1,
          minHeight: 120,
          resize: "vertical",
          fontFamily: "inherit",
          fontSize: 13,
          padding: 8,
          borderRadius: 6,
          border: "1px solid rgba(127,127,127,0.4)",
          background: "transparent",
          color: "inherit",
        }}
      />
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ fontSize: 12, opacity: 0.75 }}>
          {notesCount} note{notesCount === 1 ? "" : "s"} saved
          {status ? ` · ${status}` : ""}
        </span>
        <span style={{ flex: 1 }} />
        <button type="button" onClick={() => setNote("")}>
          Clear
        </button>
        <button
          type="button"
          onClick={() => {
            writeNotes({});
            setNote("");
            setStatus("Cleared all");
          }}
        >
          Clear all
        </button>
        <button type="button" onClick={copyAll}>
          Copy all
        </button>
      </div>
    </div>
  );
}

addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: "Scratchpad",
    // Show for story canvas (not only when package match() allows it)
    match: ({ viewMode }) => !viewMode || viewMode === "story",
    render: ({ active }) => (active ? <ScratchpadPanel /> : null),
  });
});

// Collab static build sets STORYBOOK_BASE_PATH=/storybook/ — only then select
// Scratchpad by default. Local `storybook dev` (:6006) keeps Controls as default.
const isCollabEmbed =
  typeof process !== "undefined" &&
  Boolean(String(process.env.STORYBOOK_BASE_PATH || "").trim());

function preferScratchpadInCollab() {
  if (!isCollabEmbed) return;
  try {
    // Storybook persists last selected addon; rewrite so Scratchpad wins on load.
    const key = "storybook-layout";
    const raw = localStorage.getItem(key);
    const layout = raw ? JSON.parse(raw) : {};
    if (layout && typeof layout === "object") {
      layout.selectedPanel = PANEL_ID;
      layout.showPanel = true;
      layout.panelPosition = "bottom";
      localStorage.setItem(key, JSON.stringify(layout));
    }
  } catch {
    /* ignore */
  }
  addons.setConfig({
    selectedPanel: PANEL_ID,
    showPanel: true,
    panelPosition: "bottom",
  });
}

preferScratchpadInCollab();

addons.setConfig({
  showPanel: true,
  panelPosition: "bottom",
  enableShortcuts: true,
  ...(isCollabEmbed ? { selectedPanel: PANEL_ID } : {}),
});

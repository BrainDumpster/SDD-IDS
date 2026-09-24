import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  IdsAlert,
  IdsAppShell,
  IdsAppShellBodyContentSlot,
  IdsAppShellBodyRow,
  IdsAppShellBodyViewport,
  IdsAppShellFooterSlot,
  IdsAppShellHeaderActions,
  IdsAppShellMainColumn,
  IdsAppShellMainMenuSlot,
  IdsAppShellMastheadSlot,
  IdsAppShellPageDescription,
  IdsAppShellPageHeader,
  IdsAppShellPageTitle,
  IdsButton,
  IdsButtonLabel,
  IdsDatagrid,
  IdsDropdownSingleSelect,
  IdsFooter,
  IdsHelper,
  IdsHelperText,
  IdsIcon,
  IdsLink,
  IdsMainMenuLeft,
  IdsMasthead,
  IdsMastheadActionsRow,
  IdsMastheadAvatar,
  IdsMastheadAvatarSlot,
  IdsMastheadBrandSlot,
  IdsMastheadIconsSlot,
  IdsMastheadProductName,
  IdsModal,
  IdsTextBox,
  IdsToastViewport,
  Tooltip,
  TooltipBody,
  TooltipPanel,
  TooltipTrigger,
} from "@ids";

function isColorValue(value) {
  return /^(#|rgba?\(|hsla?\()/i.test(String(value ?? "").trim());
}

function Swatch({ value }) {
  if (!isColorValue(value)) return value;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <span
        title={value}
        style={{
          width: 16,
          height: 16,
          border: "1px solid var(--color-border-gray-neutral-base)",
          background: value,
          display: "inline-block",
        }}
      />
      <span>{value}</span>
    </span>
  );
}

async function api(path, options) {
  const response = await fetch(path, {
    headers: { "content-type": "application/json" },
    ...options,
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = body.errors?.map((error) => error.message).join(" ") || body.status || response.statusText;
    const error = new Error(message);
    error.body = body;
    throw error;
  }
  return body;
}

export function App() {
  const [themes, setThemes] = useState([]);
  const [groups, setGroups] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [theme, setTheme] = useState("light");
  const [group, setGroup] = useState("");
  const [query, setQuery] = useState("");
  const [alert, setAlert] = useState("");
  const [toasts, setToasts] = useState([]);
  const [modal, setModal] = useState(null);
  const [draft, setDraft] = useState({ group: "Sizes", name: "", alias: "", value: "" });
  const [helper, setHelper] = useState("Use a length such as 48px, a hex color such as #0672cb, or var(--existing-name).");
  const [reports, setReports] = useState([]);

  const notify = (message, type = "success") => {
    setToasts((items) => [...items, { id: `${Date.now()}`, type, message, closable: true, duration: 4000 }]);
  };

  const load = useCallback(async () => {
    const params = new URLSearchParams({ theme });
    if (group) params.set("group", group);
    if (query) params.set("q", query);
    const data = await api(`/design/tokens?${params}`);
    setThemes(data.themes);
    setGroups(data.groups);
    setTokens(data.tokens);
  }, [theme, group, query]);

  useEffect(() => {
    load().catch((error) => setAlert(error.message));
  }, [load]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const handle = setTimeout(() => {
      api(`/design/tokens/guidance?group=${encodeURIComponent(draft.group)}`)
        .then((data) => setHelper(data.helper))
        .catch(() => {});
    }, 150);
    return () => clearTimeout(handle);
  }, [draft.group]);

  const rows = useMemo(
    () =>
      tokens.map((token) => ({
        id: token.name,
        values: {
          group: token.group,
          name: token.name,
          alias: token.alias || "",
          value: token.inherited ? `${token.value} · Light` : token.value,
        },
      })),
    [tokens],
  );

  const displayRows = rows.map((row) => ({
    ...row,
    values: {
      ...row.values,
      value: <Swatch value={String(row.values.value).replace(/ · Light$/, "")} />,
    },
  }));

  async function saveToken() {
    const values = { [theme]: draft.value };
    if (theme !== "light") values.light = draft.light || draft.value;
    try {
      if (modal === "create") {
        const result = await api("/design/tokens", {
          method: "POST",
          body: JSON.stringify({
            group: draft.group,
            name: draft.name,
            alias: draft.alias,
            values: theme === "light" ? { light: draft.value } : { light: draft.light, [theme]: draft.value },
          }),
        });
        if (result.status === "available") {
          setAlert(`${draft.name} is already available.`);
          return;
        }
        notify(`Created ${draft.name}`);
      } else {
        await api(`/design/tokens/${encodeURIComponent(modal.name)}`, {
          method: "PATCH",
          body: JSON.stringify({
            group: draft.group,
            alias: draft.alias,
            values,
          }),
        });
        notify(`Updated ${modal.name}`);
      }
      setModal(null);
      setAlert("");
      await load();
    } catch (error) {
      setAlert(error.message);
    }
  }

  async function removeToken() {
    try {
      await api(`/design/tokens/${encodeURIComponent(modal.name)}`, { method: "DELETE" });
      notify(`Deleted ${modal.name}`);
      setModal(null);
      await load();
    } catch (error) {
      setAlert(error.body?.status === "in-use" ? `In use by ${error.body.fileCount} file(s).` : error.message);
    }
  }

  async function addTheme() {
    try {
      await api("/design/themes", {
        method: "POST",
        body: JSON.stringify({ id: draft.themeId, label: draft.themeLabel }),
      });
      notify(`Added theme ${draft.themeId}`);
      setModal(null);
      await load();
    } catch (error) {
      setAlert(error.message);
    }
  }

  async function rebuild() {
    try {
      const result = await api("/design/tokens/themes/rebuild", { method: "POST", body: "{}" });
      setReports(result.reports ?? []);
      notify("Rebuilt components/ids-theme.css");
    } catch (error) {
      setAlert(error.message);
    }
  }

  async function saveOverride() {
    try {
      await api(`/design/programmes/${draft.programme}/overrides/${encodeURIComponent(draft.name)}`, {
        method: "PUT",
        body: JSON.stringify({ values: { [theme]: draft.value } }),
      });
      notify(`Patched ${draft.name} in ${draft.programme}`);
      setModal(null);
    } catch (error) {
      setAlert(error.message);
    }
  }

  const menuItems = [
    { id: "all", name: "All tokens" },
    ...groups.map((item) => ({ id: item.group, name: `${item.group} (${item.count})` })),
    { id: "programmes", name: "Programme check" },
  ];

  return (
    <>
      <IdsAppShell
        mastheadProductName="IDS Design Tokens"
        menuItems={menuItems}
        defaultMenuSelectedItemId="all"
        onMenuSelected={(detail) => {
          const id = detail?.id ?? detail?.item?.id;
          if (id === "all") setGroup("");
          else if (id === "programmes") setGroup("__programmes");
          else setGroup(id);
        }}
        showFooterDateTime={false}
        footerHostname="DTM"
      >
        <IdsAppShellMastheadSlot>
          <IdsMasthead>
            <IdsMastheadBrandSlot>
              <IdsMastheadProductName>IDS Design Tokens</IdsMastheadProductName>
            </IdsMastheadBrandSlot>
            <IdsMastheadActionsRow>
              <IdsMastheadIconsSlot>
                <IdsAppShellHeaderActions className="dtm-masthead-actions">
                  <IdsDropdownSingleSelect
                    aria-label="Theme"
                    label="Theme"
                    size="small"
                    options={themes.map((item) => ({ id: item.id, label: item.label }))}
                    value={theme}
                    onChange={setTheme}
                  />
                  <IdsLink type="dark-bg" label="Add theme" onClick={() => { setDraft({ themeId: "", themeLabel: "" }); setModal("theme"); }} />
                  <IdsLink type="dark-bg" label="Create" onClick={() => { setDraft({ group: groups[0]?.group ?? "Sizes", name: "", alias: "", value: "" }); setModal("create"); setAlert(""); }} />
                  <IdsLink type="dark-bg" label="Rebuild CSS" onClick={rebuild} />
                </IdsAppShellHeaderActions>
              </IdsMastheadIconsSlot>
              <IdsMastheadAvatarSlot>
                <IdsMastheadAvatar initials="DT" aria-label="Design tokens" />
              </IdsMastheadAvatarSlot>
            </IdsMastheadActionsRow>
          </IdsMasthead>
        </IdsAppShellMastheadSlot>
        <IdsAppShellBodyRow>
          <IdsAppShellMainMenuSlot>
            <IdsMainMenuLeft
              items={menuItems}
              defaultSelectedItemId={group || "all"}
              onNavigate={(target) => {
                const id = target?.id;
                if (!id || id === "all") setGroup("");
                else if (id === "programmes") setGroup("__programmes");
                else setGroup(groups.find((item) => item.group === id || `${item.group} (${item.count})` === target?.name)?.group ?? id);
              }}
            />
          </IdsAppShellMainMenuSlot>
          <IdsAppShellMainColumn>
            <IdsAppShellPageHeader>
              <IdsAppShellPageTitle>Design tokens</IdsAppShellPageTitle>
              <IdsAppShellPageDescription>
                Common token names stay the same across programmes. The selected theme shows that theme’s value, or the light value when the theme has none.
              </IdsAppShellPageDescription>
            </IdsAppShellPageHeader>
            <IdsAppShellBodyViewport>
              <IdsAppShellBodyContentSlot>
                {alert ? <IdsAlert display="inline" severity="critical" message={alert} dismissible onDismiss={() => setAlert("")} /> : null}
                {group === "__programmes" ? (
                  <ProgrammeReport reports={reports} onLoad={async () => setReports((await api("/design/programmes/validate")).reports)} />
                ) : (
                  <div className="dtm-token-list">
                    <div className="dtm-token-filter">
                      <IdsIcon shape="search-16" size={16} color="var(--color-icon-brand-base)" />
                      <input
                        type="search"
                        aria-label="Search tokens"
                        placeholder="Search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                      />
                      {query ? (
                        <button type="button" aria-label="Clear search" onClick={() => setQuery("")}>
                          <IdsIcon shape="ctrl-close-16" size={16} color="var(--color-icon-gray-neutral-accessible)" />
                        </button>
                      ) : null}
                    </div>
                    <IdsDatagrid
                      columns={[
                        { key: "group", title: "Group", sortable: true },
                        { key: "name", title: "Name", sortable: true, filterable: true },
                        { key: "alias", title: "Alias", sortable: true },
                        { key: "value", title: "Value" },
                      ]}
                      rows={displayRows}
                      pageSize={25}
                      onRowClick={(rowKey) => {
                        const token = tokens.find((item) => item.name === rowKey);
                        if (!token) return;
                        setDraft({
                          group: token.group,
                          name: token.name,
                          alias: token.alias ?? "",
                          value: token.inherited ? "" : token.value,
                          light: token.values.light,
                          programme: "dap",
                        });
                        setModal(token);
                        setAlert("");
                      }}
                    />
                  </div>
                )}
              </IdsAppShellBodyContentSlot>
            </IdsAppShellBodyViewport>
            <IdsAppShellFooterSlot>
              <IdsFooter hostname="DTM" showCurrentDateAndTime={false} showTimeZone={false} />
            </IdsAppShellFooterSlot>
          </IdsAppShellMainColumn>
        </IdsAppShellBodyRow>
      </IdsAppShell>

      <IdsModal
        open={modal === "create" || (modal && modal.name)}
        title={modal === "create" ? "Create token" : modal?.name}
        description={modal === "create" ? "A new common name is available to every programme." : "The name stays fixed. Clearing a non-light value falls back to light."}
        primaryActionLabel={modal === "create" ? "Create" : "Save"}
        tertiaryActionLabel="Cancel"
        onOpenChange={(open) => { if (!open) setModal(null); }}
        onPrimaryAction={saveToken}
        onTertiaryAction={() => setModal(null)}
        onClose={() => setModal(null)}
      >
        <TokenFields draft={draft} setDraft={setDraft} groups={groups} helper={helper} lockedName={modal !== "create"} />
        {modal && modal.name ? (
          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            <IdsButton type="button" variant="destructive" size="small" onClick={() => setModal({ ...modal, confirmDelete: true })}>
              <IdsButtonLabel>Delete</IdsButtonLabel>
            </IdsButton>
            <IdsButton type="button" variant="secondary" size="small" onClick={() => setModal({ ...modal, override: true })}>
              <IdsButtonLabel>Add to programme</IdsButtonLabel>
            </IdsButton>
          </div>
        ) : null}
      </IdsModal>

      <IdsModal
        open={Boolean(modal?.confirmDelete)}
        scenario="dialog"
        type="critical"
        title="Delete token"
        description={modal?.name ? `Delete ${modal.name} only if no design spec or programme theme uses it.` : ""}
        primaryActionLabel="Delete"
        tertiaryActionLabel="Cancel"
        onPrimaryAction={removeToken}
        onTertiaryAction={() => setModal(modal?.name ? tokens.find((token) => token.name === modal.name) ?? null : null)}
        onClose={() => setModal(null)}
      />

      <IdsModal
        open={modal === "theme"}
        title="Add theme"
        description="Light stays the default. Tokens without a value for this theme use light."
        primaryActionLabel="Add theme"
        tertiaryActionLabel="Cancel"
        onPrimaryAction={addTheme}
        onTertiaryAction={() => setModal(null)}
        onClose={() => setModal(null)}
      >
        <IdsTextBox label="Id" value={draft.themeId ?? ""} onValueChange={(themeId) => setDraft({ ...draft, themeId })} />
        <IdsTextBox label="Label" value={draft.themeLabel ?? ""} onValueChange={(themeLabel) => setDraft({ ...draft, themeLabel })} />
      </IdsModal>

      <IdsModal
        open={Boolean(modal?.override)}
        title="Add to programme"
        description="Patches this one name inside the programme file. The rest of the file is left as it is."
        primaryActionLabel="Patch"
        tertiaryActionLabel="Cancel"
        onPrimaryAction={saveOverride}
        onTertiaryAction={() => setModal(modal?.name ? { ...modal, override: false } : null)}
        onClose={() => setModal(null)}
      >
        <IdsDropdownSingleSelect
          label="Programme"
          options={[
            { id: "synapse", label: "Synapse" },
            { id: "dap", label: "DAP" },
            { id: "powerflex", label: "PowerFlex" },
          ]}
          value={draft.programme ?? "dap"}
          onChange={(programme) => setDraft({ ...draft, programme })}
        />
        <IdsTextBox label="Value" value={draft.value ?? ""} onValueChange={(value) => setDraft({ ...draft, value })} />
      </IdsModal>

      <IdsToastViewport items={toasts} onItemsChange={setToasts} />
    </>
  );
}

function TokenFields({ draft, setDraft, groups, helper, lockedName }) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <IdsDropdownSingleSelect
        label="Group"
        options={(groups.length ? groups : [{ group: "Sizes" }]).map((item) => ({ id: item.group, label: item.group }))}
        value={draft.group}
        onChange={(next) => setDraft({ ...draft, group: next })}
      />
      <IdsTextBox label="Name" value={draft.name} disabled={lockedName} onValueChange={(name) => setDraft({ ...draft, name })} />
      <IdsTextBox label="Alias" placeholder="Optional" value={draft.alias ?? ""} onValueChange={(alias) => setDraft({ ...draft, alias })} />
      <Tooltip>
        <TooltipTrigger>
          <IdsTextBox label="Value" value={draft.value ?? ""} onValueChange={(value) => setDraft({ ...draft, value })} />
        </TooltipTrigger>
        <TooltipPanel>
          <TooltipBody>{helper}</TooltipBody>
        </TooltipPanel>
      </Tooltip>
      <IdsHelper>
        <IdsHelperText>{helper}</IdsHelperText>
      </IdsHelper>
    </div>
  );
}

function ProgrammeReport({ reports, onLoad }) {
  useEffect(() => {
    onLoad().catch(() => {});
  }, [onLoad]);
  return (
    <div>
      {reports.map((report) => (
        <p key={`${report.programme}-${report.file}`}>
          {report.programme} · {report.file} · in sync {report.counts["in-sync"]} · override {report.counts.override} · local {report.counts["programme-local"]} · missing {report.counts.missing}
        </p>
      ))}
    </div>
  );
}

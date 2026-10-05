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
  IdsDatagridDetailPanel,
  IdsDetailPanel,
  IdsDetailPanelBody,
  IdsDetailPanelCollapsedRail,
  IdsDetailPanelContent,
  IdsDetailPanelHeader,
  IdsDetailPanelTitle,
  IdsDetailPanelToggleButton,
  IdsDropdownSingleSelect,
  IdsError,
  IdsErrorText,
  IdsFooter,
  IdsHelper,
  IdsHelperText,
  IdsIcon,
  IdsLink,
  IdsMainMenuLeft,
  IdsMasthead,
  IdsMastheadActionsRow,
  IdsMastheadAvatarSlot,
  IdsMastheadBrandSlot,
  IdsMastheadIconsSlot,
  IdsMastheadProductName,
  IdsModal,
  IdsTag,
  IdsTextBox,
  IdsToastViewport,
  Tooltip,
  TooltipBody,
  TooltipPanel,
  TooltipTrigger,
} from "@ids";
import { api, apiUrl } from "./api.js";
import { AccountMenu, Denied, RolesPanel, UsersPanel } from "./access-panel.jsx";

function groupNameProblem(value) {
  const group = String(value ?? "").trim();
  if (!group) return "Group is required.";
  if (!/^[A-Za-z0-9 /]+$/.test(group) || !/[A-Za-z0-9]/.test(group)) {
    return "Group name can use letters, numbers, spaces, and / only.";
  }
  return "";
}

const PROGRAMME_LABELS = { ids: "IDS", synapse: "Synapse", dap: "DAP", powerflex: "PowerFlex" };

function ProgrammeTags({ programmes }) {
  if (!programmes?.length) return "None";
  return (
    <span style={{ display: "inline-flex", flexWrap: "wrap", gap: 8 }}>
      {programmes.map((id) => (
        <IdsTag key={id} type="read-only" size="small" label={PROGRAMME_LABELS[id] ?? id} />
      ))}
    </span>
  );
}

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
  const [selectedName, setSelectedName] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [draft, setDraft] = useState({ group: "Sizes", name: "", alias: "", value: "" });
  const [helper, setHelper] = useState("Use a length such as 48px, a hex color such as #0672cb, or var(--existing-name).");
  const [reports, setReports] = useState([]);
  const [replacement, setReplacement] = useState("");
  const [replacementError, setReplacementError] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupModal, setGroupModal] = useState(null);
  const [groupSource, setGroupSource] = useState("");
  const [groupDraft, setGroupDraft] = useState("");
  const [groupFieldError, setGroupFieldError] = useState("");
  const [me, setMe] = useState(null);
  const [surface, setSurface] = useState("tokens");
  const can = useCallback((flag) => Boolean(me?.permissions?.[flag]), [me]);

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
    let cancel = false;
    api("/me")
      .then((body) => { if (!cancel) setMe(body); })
      .catch((error) => { if (!cancel) setMe({ allowed: false, email: null, message: error.message }); });
    return () => { cancel = true; };
  }, []);

  useEffect(() => {
    if (!me?.allowed) return;
    load().catch((error) => setAlert(error.message));
  }, [load, me?.allowed]);

  useEffect(() => {
    if ((surface === "users" || surface === "roles") && me && !me.permissions?.manage_users) setSurface("tokens");
  }, [surface, me]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!me?.allowed) return undefined;
    const handle = setTimeout(() => {
      api(`/design/tokens/guidance?group=${encodeURIComponent(draft.group)}`)
        .then((data) => setHelper(data.helper))
        .catch(() => {});
    }, 150);
    return () => clearTimeout(handle);
  }, [draft.group, me?.allowed]);

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

  const selectedToken = tokens.find((token) => token.name === selectedName) ?? null;

  function openToken(token) {
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
  }

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
    const next = replacement.trim();
    try {
      const result = await api(`/design/tokens/${encodeURIComponent(modal.name)}`, {
        method: "DELETE",
        body: JSON.stringify(next ? { replacement: next } : {}),
      });
      notify(next ? `Deleted ${modal.name} and replaced it with ${next}` : `Deleted ${modal.name}`);
      if (result.replaced?.length) notify(`Updated ${result.replaced.length} file(s).`);
      if (selectedName === modal.name) setSelectedName(null);
      setReplacement("");
      setReplacementError("");
      setModal(null);
      await load();
    } catch (error) {
      const message = error.body?.status === "in-use"
        ? `In use by ${error.body.fileCount} file(s). Enter a replacement token or remove those uses.`
        : error.message;
      setReplacementError(message);
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
    { id: "all", name: "All tokens", iconName: "tag" },
    { id: "groups", name: "Groups", iconName: "templates-stack" },
    { id: "programmes", name: "Programme check", iconName: "policy-enable" },
    ...(can("manage_users")
      ? [
          { id: "roles", name: "Role", iconName: "user-base-star" },
          { id: "users", name: "Manage users", iconName: "user-settings" },
        ]
      : []),
  ];
  const tokenCount = groups.reduce((sum, item) => sum + item.count, 0);
  const groupFilterOptions = [
    { id: "all", label: `All tokens (${tokenCount})` },
    ...groups.map((item) => ({ id: item.group, label: `${item.group} (${item.count})` })),
  ];

  function selectMenu(itemId) {
    if (itemId === "users") {
      setSurface("users");
      return;
    }
    if (itemId === "roles") {
      setSurface("roles");
      return;
    }
    setSurface("tokens");
    if (!itemId || itemId === "all") setGroup("");
    else if (itemId === "groups") setGroup("__groups");
    else if (itemId === "programmes") setGroup("__programmes");
  }

  function openGroupModal(mode) {
    setGroupFieldError("");
    setGroupSource(mode === "edit" ? selectedGroup ?? "" : "");
    setGroupDraft(mode === "edit" ? selectedGroup ?? "" : "");
    setGroupModal(mode);
  }

  async function submitGroup() {
    const next = groupDraft.trim();
    const problem = groupNameProblem(next);
    if (problem) {
      setGroupFieldError(problem);
      return;
    }
    const duplicate = groups.some((item) => item.group === next) && next !== groupSource;
    if (duplicate) {
      setGroupFieldError("Group already exists.");
      return;
    }
    try {
      if (groupModal === "edit") {
        await api("/design/groups", {
          method: "PATCH",
          body: JSON.stringify({ from: groupSource, to: next }),
        });
        setSelectedGroup(groupDraft.trim());
        notify(`Updated group ${groupDraft.trim()}`);
      } else {
        await api("/design/groups", {
          method: "POST",
          body: JSON.stringify({ name: groupDraft.trim() }),
        });
        setSelectedGroup(null);
        notify(`Created group ${groupDraft.trim()}`);
      }
      setGroupModal(null);
      await load();
    } catch (error) {
      setGroupFieldError(error.message);
    }
  }

  async function removeGroup() {
    try {
      await api("/design/groups", { method: "DELETE", body: JSON.stringify({ name: selectedGroup }) });
      notify(`Deleted group ${selectedGroup}`);
      setSelectedGroup(null);
      await load();
    } catch (error) {
      notify(error.message, "critical");
    }
  }

  if (!me) return null;
  if (!me.allowed) return <Denied email={me.email} message={me.message} />;

  const menuSelectedId = surface === "users"
    ? "users"
    : surface === "roles"
      ? "roles"
      : group === "__groups"
        ? "groups"
        : group === "__programmes"
          ? "programmes"
          : "all";
  const pageTitle = surface === "users" ? "Manage users" : surface === "roles" ? "Role" : group === "__groups" ? "Groups" : "Design tokens";
  const pageDescription = surface === "users"
    ? "People who can open DTM. The email must match Dell SSO."
    : surface === "roles"
      ? "Each role sets add, edit, view, and delete for groups and for tokens."
      : group === "__groups"
      ? "Create a group here before tokens can use it. Delete is available only when the group has no tokens."
      : "Common token names stay the same across programmes. The selected theme shows that theme’s value, or the light value when the theme has none.";

  return (
    <>
      <IdsAppShell
        mastheadProductName="IDS Design Tokens"
        menuItems={menuItems}
        defaultMenuSelectedItemId="all"
        onMenuSelected={(detail) => selectMenu(detail?.itemId)}
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
                  {can("tokens_create") ? <IdsLink type="dark-bg" label="Create" onClick={() => { setDraft({ group: groups[0]?.group ?? "Sizes", name: "", alias: "", value: "" }); setModal("create"); setAlert(""); }} /> : null}
                  <IdsLink type="dark-bg" label="Export JSON" href={apiUrl("/design/tokens/export")} />
                  <IdsLink type="dark-bg" label="Rebuild CSS" onClick={rebuild} />
                </IdsAppShellHeaderActions>
              </IdsMastheadIconsSlot>
              <IdsMastheadAvatarSlot>
                <AccountMenu me={me} />
              </IdsMastheadAvatarSlot>
            </IdsMastheadActionsRow>
          </IdsMasthead>
        </IdsAppShellMastheadSlot>
        <IdsAppShellBodyRow>
          <IdsAppShellMainMenuSlot>
            <IdsMainMenuLeft
              items={menuItems}
              defaultSelectedItemId={menuSelectedId}
              onNavigate={(target) => selectMenu(target?.itemId)}
            />
          </IdsAppShellMainMenuSlot>
          <IdsAppShellMainColumn>
            <IdsAppShellPageHeader>
              <IdsAppShellPageTitle>{pageTitle}</IdsAppShellPageTitle>
              <IdsAppShellPageDescription>
                {pageDescription}
              </IdsAppShellPageDescription>
            </IdsAppShellPageHeader>
            <IdsAppShellBodyViewport>
              <IdsAppShellBodyContentSlot>
                {alert ? <IdsAlert display="inline" severity="critical" message={alert} dismissible onDismiss={() => setAlert("")} /> : null}
                {surface === "users" ? (
                  <UsersPanel me={me} onMe={setMe} />
                ) : surface === "roles" ? (
                  <RolesPanel onMe={setMe} />
                ) : group === "__programmes" ? (
                  <ProgrammeReport reports={reports} onLoad={async () => setReports((await api("/design/programmes/validate")).reports)} />
                ) : group === "__groups" ? (
                  <div className="dtm-group-list">
                    {can("groups_create") || can("groups_update") || can("groups_delete") ? (
                      <div className="dtm-group-toolbar">
                        {can("groups_create") ? (
                          <IdsButton type="button" size="small" onClick={() => openGroupModal("add")}>
                            <IdsButtonLabel>Add</IdsButtonLabel>
                          </IdsButton>
                        ) : null}
                        {can("groups_update") ? (
                          <IdsButton type="button" variant="secondary" size="small" disabled={!selectedGroup} onClick={() => openGroupModal("edit")}>
                            <IdsButtonLabel>Edit</IdsButtonLabel>
                          </IdsButton>
                        ) : null}
                        {can("groups_delete") ? (
                          <IdsButton type="button" variant="destructive" size="small" disabled={!selectedGroup} onClick={removeGroup}>
                            <IdsButtonLabel>Delete</IdsButtonLabel>
                          </IdsButton>
                        ) : null}
                      </div>
                    ) : null}
                    <IdsDatagrid
                      rowSelection
                      selectionMode="single"
                      columnResizeEnabled
                      showSettingsColumn={false}
                      pageSize={50}
                      columns={[
                        { key: "name", title: "Group", sortable: true },
                        { key: "count", title: "Tokens", sortable: true },
                      ]}
                      rows={groups.map((item) => ({
                        id: item.group,
                        values: { name: item.group, count: String(item.count) },
                      }))}
                      onRowSelectionChange={setSelectedGroup}
                    />
                  </div>
                ) : (
                  <div className="dtm-token-list">
                    <div className="dtm-token-toolbar">
                      {can("tokens_create") || can("tokens_update") || can("tokens_delete") ? (
                        <div className="dtm-token-actions">
                          {can("tokens_create") ? (
                            <IdsButton type="button" size="small" onClick={() => { setDraft({ group: groups[0]?.group ?? "Sizes", name: "", alias: "", value: "" }); setModal("create"); setAlert(""); }}>
                              <IdsButtonLabel>Add</IdsButtonLabel>
                            </IdsButton>
                          ) : null}
                          {can("tokens_update") ? (
                            <IdsButton type="button" variant="secondary" size="small" disabled={!selectedToken} onClick={() => openToken(selectedToken)}>
                              <IdsButtonLabel>Edit</IdsButtonLabel>
                            </IdsButton>
                          ) : null}
                          {can("tokens_delete") ? (
                            <IdsButton type="button" variant="destructive" size="small" disabled={!selectedToken} onClick={() => { setReplacement(""); setReplacementError(""); setModal({ name: selectedToken.name, confirmDelete: true }); }}>
                              <IdsButtonLabel>Delete</IdsButtonLabel>
                            </IdsButton>
                          ) : null}
                        </div>
                      ) : null}
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
                      <IdsDropdownSingleSelect
                        className="dtm-group-filter"
                        label="Group"
                        searchable
                        menuWidth="content"
                        options={groupFilterOptions}
                        value={group || "all"}
                        onChange={(next) => setGroup(!next || next === "all" ? "" : next)}
                      />
                    </div>
                    <IdsDatagrid
                      rowSelection
                      selectionMode="single"
                      columnResizeEnabled
                      columns={[
                        { key: "group", title: "Group", sortable: true },
                        { key: "name", title: "Name", sortable: true, filterable: true },
                        { key: "alias", title: "Alias", sortable: true },
                        { key: "value", title: "Value" },
                      ]}
                      rows={displayRows}
                      pageSize={25}
                      onRowSelectionChange={(rowId) => { setSelectedName(rowId); setDetailOpen(Boolean(rowId)); }}
                    >
                      <IdsDatagridDetailPanel>
                        <IdsDetailPanel
                          attachMode="datagrid"
                          isExpanded={detailOpen && Boolean(selectedToken)}
                          onExpandedChange={setDetailOpen}
                        >
                          <IdsDetailPanelContent>
                            <IdsDetailPanelHeader>
                              <IdsDetailPanelTitle>{selectedToken?.name ?? "Programmes"}</IdsDetailPanelTitle>
                              <IdsDetailPanelToggleButton />
                            </IdsDetailPanelHeader>
                            <IdsDetailPanelBody>
                              {selectedToken ? (
                                <ProgrammeTags programmes={selectedToken.programmes} />
                              ) : (
                                "Select a token to see which programmes use it."
                              )}
                            </IdsDetailPanelBody>
                          </IdsDetailPanelContent>
                          <IdsDetailPanelCollapsedRail>
                            <IdsDetailPanelToggleButton />
                          </IdsDetailPanelCollapsedRail>
                        </IdsDetailPanel>
                      </IdsDatagridDetailPanel>
                    </IdsDatagrid>
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
        open={modal === "create" || Boolean(modal?.name && !modal.confirmDelete)}
        size="small"
        title={modal === "create" ? "Create token" : modal?.name}
        description={modal === "create" ? "A new common name is available to every programme." : "The name stays fixed. Clearing a non-light value falls back to light."}
        primaryActionLabel={modal === "create" ? "Create" : "Save"}
        tertiaryActionLabel="Cancel"
        onOpenChange={(open) => { if (!open) setModal(null); }}
        onPrimaryAction={saveToken}
        onTertiaryAction={() => setModal(null)}
        onClose={() => setModal(null)}
      >
        <div className="dtm-form">
        <TokenFields
          key={modal === "create" ? "create" : modal?.name ?? "token"}
          draft={draft}
          setDraft={setDraft}
          groups={groups}
          helper={helper}
          lockedName={modal !== "create"}
        />
        {modal && modal.name ? (
          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            {can("tokens_delete") ? (
              <IdsButton type="button" variant="destructive" size="small" onClick={() => { setReplacement(""); setReplacementError(""); setModal({ ...modal, confirmDelete: true, fromEdit: true }); }}>
                <IdsButtonLabel>Delete</IdsButtonLabel>
              </IdsButton>
            ) : null}
            <IdsButton type="button" variant="secondary" size="small" onClick={() => setModal({ ...modal, override: true })}>
              <IdsButtonLabel>Add to programme</IdsButtonLabel>
            </IdsButton>
          </div>
        ) : null}
        </div>
      </IdsModal>

      <IdsModal
        open={Boolean(modal?.confirmDelete)}
        scenario="dialog"
        type="critical"
        title="Delete token"
        description={modal?.name ? `Delete ${modal.name} from the catalog and components/ids-theme.css.` : ""}
        primaryActionLabel="Delete"
        tertiaryActionLabel="Cancel"
        onPrimaryAction={removeToken}
        onTertiaryAction={() => setModal(modal?.fromEdit && modal?.name ? tokens.find((token) => token.name === modal.name) ?? null : null)}
        onClose={() => setModal(null)}
      >
        <div className="dtm-form">
        <IdsTextBox
          label="Replacement token"
          showIcon={false}
          placeholder="Optional, for example --color-icon-gray-neutral-accessible"
          value={replacement}
          invalid={Boolean(replacementError)}
          onValueChange={(value) => { setReplacement(value); setReplacementError(""); }}
        >
          {replacementError ? (
            <IdsError>
              <IdsErrorText>{replacementError}</IdsErrorText>
            </IdsError>
          ) : (
            <IdsHelper>
              <IdsHelperText>Leave empty when nothing uses this name. A replacement rewrites var() uses. A fallback is set to that token’s light value.</IdsHelperText>
            </IdsHelper>
          )}
        </IdsTextBox>
        </div>
      </IdsModal>

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
        <div className="dtm-form">
          <IdsTextBox label="Id" value={draft.themeId ?? ""} onValueChange={(themeId) => setDraft({ ...draft, themeId })} />
          <IdsTextBox label="Label" value={draft.themeLabel ?? ""} onValueChange={(themeLabel) => setDraft({ ...draft, themeLabel })} />
        </div>
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
        <div className="dtm-form">
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
        </div>
      </IdsModal>

      <IdsModal
        open={groupModal === "add" || groupModal === "edit"}
        size="small"
        title={groupModal === "edit" ? "Edit group" : "Add group"}
        description="Letters, numbers, spaces, and /."
        primaryActionLabel={groupModal === "edit" ? "Update" : "Create"}
        tertiaryActionLabel="Cancel"
        onOpenChange={(open) => { if (!open) setGroupModal(null); }}
        onPrimaryAction={submitGroup}
        onTertiaryAction={() => setGroupModal(null)}
        onClose={() => setGroupModal(null)}
      >
        <div className="dtm-form">
        <IdsTextBox
          label="Group name"
          showIcon={false}
          placeholder="Color / Background"
          value={groupDraft}
          invalid={Boolean(groupFieldError)}
          onValueChange={(value) => {
            setGroupDraft(value);
            setGroupFieldError("");
          }}
        >
          {groupFieldError ? (
            <IdsError>
              <IdsErrorText>{groupFieldError}</IdsErrorText>
            </IdsError>
          ) : null}
        </IdsTextBox>
        </div>
      </IdsModal>

      <IdsToastViewport items={toasts} onItemsChange={setToasts} />
    </>
  );
}

function TokenFields({ draft, setDraft, groups, helper, lockedName }) {
  const options = (groups.length ? groups : [{ group: "Sizes" }]).map((item) => ({ id: item.group, label: item.group }));

  return (
    <>
      <IdsDropdownSingleSelect
        label="Group"
        options={options}
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
    </>
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

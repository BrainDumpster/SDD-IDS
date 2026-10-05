import React, { useEffect, useState } from "react";
import {
  IdsAppShell,
  IdsAppShellBodyContentSlot,
  IdsAppShellBodyRow,
  IdsAppShellBodyViewport,
  IdsAppShellFooterSlot,
  IdsAppShellMainColumn,
  IdsAppShellMastheadSlot,
  IdsAppShellPageDescription,
  IdsAppShellPageHeader,
  IdsAppShellPageTitle,
  IdsButton,
  IdsButtonLabel,
  IdsCheckbox,
  IdsCheckboxLabel,
  IdsDatagrid,
  IdsDropdownButton,
  IdsDropdownSingleSelect,
  IdsDropdownTrigger,
  IdsError,
  IdsErrorText,
  IdsFooter,
  IdsMasthead,
  IdsMastheadActionsRow,
  IdsMastheadAvatar,
  IdsMastheadAvatarSlot,
  IdsMastheadBrandSlot,
  IdsMastheadProductName,
  IdsModal,
  IdsTextBox,
} from "@ids";
import { api } from "./api.js";

const FLAG_COLUMNS = [
  ["groups_create", "Group add"],
  ["groups_read", "Group view"],
  ["groups_update", "Group edit"],
  ["groups_delete", "Group delete"],
  ["tokens_create", "Token add"],
  ["tokens_read", "Token view"],
  ["tokens_update", "Token edit"],
  ["tokens_delete", "Token delete"],
  ["manage_users", "Manage users"],
];

export function initialsFromEmail(email) {
  const local = String(email ?? "").split("@")[0];
  const parts = local.split(/[._-]+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return local.slice(0, 2).toUpperCase() || "DT";
}

export function AccountMenu({ me }) {
  return (
    <IdsDropdownButton
      className="dtm-account"
      items={[
        { id: "email", label: me.email, disabled: true },
        { id: "role", label: me.role.name, disabled: true },
      ]}
    >
      <IdsDropdownTrigger ariaLabel={me.email}>
        <IdsMastheadAvatar initials={initialsFromEmail(me.email)} aria-label={me.email} />
      </IdsDropdownTrigger>
    </IdsDropdownButton>
  );
}

export function Denied({ email, message }) {
  const detail = email
    ? `${email} is not on the DTM list. A super admin adds people by the email Dell SSO sends.`
    : message || "Dell SSO did not provide an email.";
  return (
    <IdsAppShell mastheadProductName="IDS Design Tokens" showFooterDateTime={false} footerHostname="DTM">
      <IdsAppShellMastheadSlot>
        <IdsMasthead>
          <IdsMastheadBrandSlot>
            <IdsMastheadProductName>IDS Design Tokens</IdsMastheadProductName>
          </IdsMastheadBrandSlot>
          <IdsMastheadActionsRow>
            <IdsMastheadAvatarSlot>
              <IdsMastheadAvatar initials={email ? initialsFromEmail(email) : "DT"} aria-label={email || "No email"} />
            </IdsMastheadAvatarSlot>
          </IdsMastheadActionsRow>
        </IdsMasthead>
      </IdsAppShellMastheadSlot>
      <IdsAppShellBodyRow>
        <IdsAppShellMainColumn>
          <IdsAppShellPageHeader>
            <IdsAppShellPageTitle>No access</IdsAppShellPageTitle>
            <IdsAppShellPageDescription>{detail}</IdsAppShellPageDescription>
          </IdsAppShellPageHeader>
          <IdsAppShellBodyViewport>
            <IdsAppShellBodyContentSlot />
          </IdsAppShellBodyViewport>
          <IdsAppShellFooterSlot>
            <IdsFooter hostname="DTM" showCurrentDateAndTime={false} showTimeZone={false} />
          </IdsAppShellFooterSlot>
        </IdsAppShellMainColumn>
      </IdsAppShellBodyRow>
    </IdsAppShell>
  );
}

export function UsersPanel({ me, onMe }) {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [modal, setModal] = useState(null);
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState("viewer");
  const [fieldError, setFieldError] = useState("");

  async function reload() {
    const [userBody, roleBody] = await Promise.all([api("/admin/users"), api("/admin/roles")]);
    setUsers(userBody.users);
    setRoles(roleBody.roles);
    return userBody.users;
  }

  useEffect(() => {
    reload().catch((loadError) => setFieldError(loadError.message));
  }, []);

  const selected = users.find((user) => user.email === selectedEmail) ?? null;
  const roleOptions = roles.map((role) => ({ id: role.id, label: role.name }));

  function openAdd() {
    setFieldError("");
    setEmail("");
    setRoleId("viewer");
    setModal("add");
  }

  function openEdit() {
    if (!selected) return;
    setFieldError("");
    setEmail(selected.email);
    setRoleId(selected.roleId);
    setModal("edit");
  }

  async function saveUser() {
    setFieldError("");
    try {
      if (modal === "add") {
        await api("/admin/users", { method: "POST", body: JSON.stringify({ email, roleId }) });
        setSelectedEmail(null);
      } else if (selected) {
        await api(`/admin/users/${encodeURIComponent(selected.email)}`, {
          method: "PATCH",
          body: JSON.stringify({ roleId }),
        });
        if (selected.email === me.email) onMe(await api("/me"));
      }
      setModal(null);
      await reload();
    } catch (saveError) {
      setFieldError(saveError.message);
    }
  }

  async function removeUser() {
    if (!selected) return;
    setFieldError("");
    try {
      await api(`/admin/users/${encodeURIComponent(selected.email)}`, { method: "DELETE" });
      if (selected.email === me.email) onMe(await api("/me"));
      setSelectedEmail(null);
      setModal(null);
      await reload();
    } catch (removeError) {
      setFieldError(removeError.message);
    }
  }

  return (
    <div className="dtm-group-list">
      <div className="dtm-group-toolbar">
        <IdsButton type="button" size="small" onClick={openAdd}>
          <IdsButtonLabel>Add</IdsButtonLabel>
        </IdsButton>
        <IdsButton type="button" variant="secondary" size="small" disabled={!selected} onClick={openEdit}>
          <IdsButtonLabel>Edit</IdsButtonLabel>
        </IdsButton>
        <IdsButton type="button" variant="destructive" size="small" disabled={!selected || selected.seeded} onClick={() => { setFieldError(""); setModal("delete"); }}>
          <IdsButtonLabel>Delete</IdsButtonLabel>
        </IdsButton>
      </div>
      <IdsDatagrid
        rowSelection
        selectionMode="single"
        columnResizeEnabled
        showSettingsColumn={false}
        pageSize={50}
        columns={[
          { key: "email", title: "Email", sortable: true, defaultWidth: 360 },
          { key: "role", title: "Role", sortable: true, defaultWidth: 180 },
        ]}
        rows={users.map((user) => ({
          id: user.email,
          values: { email: user.email, role: user.roleName },
        }))}
        onRowSelectionChange={setSelectedEmail}
      />
      <IdsModal
        open={modal === "add" || modal === "edit"}
        size="x-small"
        title={modal === "edit" ? "Edit user" : "Add user"}
        description="The email must match the address Dell SSO sends."
        primaryActionLabel={modal === "edit" ? "Update" : "Add"}
        tertiaryActionLabel="Cancel"
        onOpenChange={(open) => { if (!open) setModal(null); }}
        onPrimaryAction={saveUser}
        onTertiaryAction={() => setModal(null)}
        onClose={() => setModal(null)}
      >
        <div className="dtm-form">
          <IdsTextBox
            label="Email"
            showIcon={false}
            placeholder="name@dell.com"
            value={email}
            disabled={modal === "edit"}
            invalid={Boolean(fieldError)}
            onValueChange={(value) => { setEmail(value); setFieldError(""); }}
          >
            {fieldError ? (
              <IdsError>
                <IdsErrorText>{fieldError}</IdsErrorText>
              </IdsError>
            ) : null}
          </IdsTextBox>
          <IdsDropdownSingleSelect label="Role" options={roleOptions} value={roleId} onChange={setRoleId} />
        </div>
      </IdsModal>
      <IdsModal
        open={modal === "delete"}
        size="x-small"
        scenario="dialog"
        type="critical"
        title="Delete user"
        description={selected ? `Remove ${selected.email} from DTM.` : ""}
        primaryActionLabel="Delete"
        tertiaryActionLabel="Cancel"
        onPrimaryAction={removeUser}
        onTertiaryAction={() => setModal(null)}
        onClose={() => setModal(null)}
      >
        {fieldError ? (
          <IdsError>
            <IdsErrorText>{fieldError}</IdsErrorText>
          </IdsError>
        ) : null}
      </IdsModal>
    </div>
  );
}

export function RolesPanel({ onMe }) {
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState("");

  async function reload() {
    setRoles((await api("/admin/roles")).roles);
  }

  useEffect(() => {
    reload().catch((loadError) => setError(loadError.message));
  }, []);

  async function changeFlag(role, key, checked) {
    setError("");
    try {
      await api(`/admin/roles/${encodeURIComponent(role.id)}`, {
        method: "PATCH",
        body: JSON.stringify({ [key]: checked }),
      });
      await reload();
      onMe(await api("/me"));
    } catch (flagError) {
      setError(flagError.message);
    }
  }

  return (
    <div className="dtm-users">
      {error ? (
        <IdsError>
          <IdsErrorText>{error}</IdsErrorText>
        </IdsError>
      ) : null}
      <table className="dtm-role-matrix">
        <caption>Role rights</caption>
        <thead>
          <tr>
            <th scope="col">Role</th>
            {FLAG_COLUMNS.map(([key, label]) => (
              <th key={key} scope="col">{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id}>
              <th scope="row">{role.name}</th>
              {FLAG_COLUMNS.map(([key, label]) => (
                <td key={key}>
                  <IdsCheckbox
                    checked={Boolean(role[key])}
                    aria-label={`${role.name} ${label}`}
                    onChange={(checked) => changeFlag(role, key, checked)}
                  >
                    <IdsCheckboxLabel>
                      <span className="dtm-sr">{`${role.name} ${label}`}</span>
                    </IdsCheckboxLabel>
                  </IdsCheckbox>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

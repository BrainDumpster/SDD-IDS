/**
 * Storybook: a realistic product page built from IDS React components
 * (`lib/react/ids/*`) — an application **Settings** screen.
 *
 * Every component here has a job on the page: the shell frames it, the anchor
 * menu jumps between sections, the tabs split the preference groups, each row
 * pairs a label with the control that actually edits that preference.
 *
 * Component sources — these are taken from their own feature branches, not master:
 *   app-launcher     → usr/charles/IDS/App-Launcher-Fixes (already merged into master)
 *   checkbox         → usr/charles/IDS/Checkbox-and-Radio-Button-fixes
 *   radio-button     → usr/charles/IDS/Checkbox-and-Radio-Button-fixes
 *   form-label       → usr/charles/IDS/Checkbox-and-Radio-Button-fixes
 *   main-menu-left   → usr/charles/IDS/Main-Menu-Left-fixes
 *   anchor-menu      → usr/charles/IDS/Anchor-Menu-fixes
 *
 * Theme: components/ids-theme.css — works in light and dark via the Theme toolbar.
 * Layout: ./ids-settings-page.css, IDS design tokens only.
 */
import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/ids-theme.css";
import "./ids-settings-page.css";

import { IdsIcon } from "@ids/react/icon";
import { IdsAppShell, IdsAppShellPagePanel, type AppShellPage } from "@ids/react/app-shell";
import { IdsAppLauncher } from "@ids/react/app-launcher";
import { IdsMastheadAvatar } from "@ids/react/masthead";
import type { MainMenuLeftPrimaryItem } from "@ids/react/main-menu-left";
import { IdsAnchorMenu, type IdsAnchorMenuItem } from "@ids/react/anchor-menu";
import { IdsAlert } from "@ids/react/alert";
import { IdsButton, IdsButtonLabel } from "@ids/react/button";
import { IdsTabs } from "@ids/react/tab";
import { IdsTextBox } from "@ids/react/text-box";
import { IdsToggleSwitch } from "@ids/react/toggle-switch";
import { IdsDropdownSingleSelect } from "@ids/react/dropdown-single-select";
import { IdsDropdownMultiSelect } from "@ids/react/dropdown-multiselect";
import { IdsRadioGroup, IdsRadioButton, IdsRadioLabel } from "@ids/react/radio-button";
import { IdsCheckbox, IdsCheckboxGroup, IdsCheckboxLabel } from "@ids/react/checkbox";
import { IdsAccordion } from "@ids/react/accordion";
import { IdsLink } from "@ids/react/link";
import { IdsTag } from "@ids/react/tag";
import { IdsDatagrid, type IdsDatagridColumnDef, type IdsDatagridRowDef } from "@ids/react/datagrid";
import { IdsModal } from "@ids/react/modal";
import { Tooltip, TooltipTrigger, TooltipPanel, TooltipHeader, TooltipBody } from "@ids/react/tooltip";

/* -------------------------------------------------------------------------- */
/* Row scaffolding (styles live in ./ids-settings-page.css)                    */
/* -------------------------------------------------------------------------- */

function SettingRow({
  label,
  description,
  info,
  control,
  fieldControl,
  stacked,
}: {
  label: string;
  description?: React.ReactNode;
  /** Short explainer shown in a Tooltip next to the label. */
  info?: string;
  control: React.ReactNode;
  /** Gives the control a predictable field width (selects, pickers). */
  fieldControl?: boolean;
  /** Puts the control on its own line (slider, radio rows). */
  stacked?: boolean;
}) {
  return (
    <div className={stacked ? "settings-row settings-row--stacked" : "settings-row"}>
      <div className="settings-row__label-group">
        <div className="settings-row__label-line">
          <p className="settings-label">{label}</p>
          {info ? (
            <Tooltip side="top" hugContent>
              <TooltipTrigger>
                <IdsIcon
                  shape="info-circ"
                  size={16}
                  color="var(--color-icon-gray-neutral-base)"
                  aria-label={`About ${label}`}
                />
              </TooltipTrigger>
              <TooltipPanel>
                <TooltipHeader>{label}</TooltipHeader>
                <TooltipBody>{info}</TooltipBody>
              </TooltipPanel>
            </Tooltip>
          ) : null}
        </div>
        {description ? <p className="settings-description">{description}</p> : null}
      </div>
      <div
        className={
          fieldControl
            ? "settings-row__control settings-row__control--field"
            : "settings-row__control"
        }
      >
        {control}
      </div>
    </div>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <h3 id={id} className="settings-group-title">
        {title}
      </h3>
      <div className="settings-group">{children}</div>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Preference state                                                            */
/* -------------------------------------------------------------------------- */

interface Preferences {
  focusOutline: boolean;
  pageZoom: string;
  pageColors: string;
  announcements: string[];
  focusIndicator: string;
  reduceMotion: boolean;
  underlineLinks: boolean;
  accessibilityContact: string;
  accommodationNotes: string;
}

const INITIAL_PREFERENCES: Preferences = {
  focusOutline: false,
  pageZoom: "100",
  pageColors: "system",
  announcements: ["errors", "jobs"],
  focusIndicator: "outline",
  reduceMotion: false,
  underlineLinks: true,
  accessibilityContact: "",
  accommodationNotes: "",
};

const ZOOM_OPTIONS = [
  { id: "75", label: "75%" },
  { id: "100", label: "100%" },
  { id: "125", label: "125%" },
  { id: "150", label: "150%" },
];

const PAGE_COLOR_OPTIONS = [
  { id: "system", label: "System" },
  { id: "off", label: "Off" },
  { id: "dusk", label: "Dusk" },
  { id: "desert", label: "Desert" },
  { id: "night-sky", label: "Night Sky" },
  { id: "aquatic", label: "Aquatic" },
];

const ANNOUNCEMENT_OPTIONS = [
  { id: "errors", label: "Errors and failures" },
  { id: "jobs", label: "Job status changes" },
  { id: "capacity", label: "Capacity thresholds" },
  { id: "logins", label: "Sign-in activity" },
];

const EXCLUDED_SITE_COLUMNS: IdsDatagridColumnDef[] = [
  { key: "site", title: "Site", minWidth: 220, sortable: true },
  { key: "added", title: "Added", minWidth: 140, sortable: true },
  { key: "by", title: "Added by", minWidth: 160 },
];

const EXCLUDED_SITE_ROWS: IdsDatagridRowDef[] = [
  { id: "1", values: { site: "console.internal.example", added: "2026-08-14", by: "c.dao" } },
  { id: "2", values: { site: "reports.example.com", added: "2026-07-02", by: "IT policy" } },
  { id: "3", values: { site: "status.example.com", added: "2026-05-27", by: "IT policy" } },
];

/** Section anchors per tab — drives the "On this page" rail. */
const TAB_SECTIONS: Record<string, IdsAnchorMenuItem[]> = {
  accessibility: [
    { label: "Visibility", href: "#visibility" },
    { label: "Usability", href: "#usability" },
    { label: "Support", href: "#support" },
    { label: "Advanced", href: "#advanced" },
  ],
};

type SetPref = <K extends keyof Preferences>(key: K, value: Preferences[K]) => void;

/* -------------------------------------------------------------------------- */
/* Tab panels                                                                  */
/* -------------------------------------------------------------------------- */

function AccessibilityPanel({
  prefs,
  set,
  onManageSites,
  excludedSiteCount,
}: {
  prefs: Preferences;
  set: SetPref;
  onManageSites: () => void;
  excludedSiteCount: number;
}) {
  return (
    <>
      <Section id="visibility" title="Visibility">
        <SettingRow
          label="Show a high visibility outline on the focused object"
          description="Draws a thicker focus ring so the active control is easier to track."
          control={
            <IdsToggleSwitch
              checked={prefs.focusOutline}
              onCheckedChange={(v) => set("focusOutline", v)}
              aria-label="Show a high visibility outline on the focused object"
            />
          }
        />
        <SettingRow
          fieldControl
          label="Page zoom"
          description={
            <>
              Default zoom level for all sites. To see zoom levels for certain sites, go to{" "}
              <IdsLink type="inline" label="Zoom levels" href="#zoom-levels" />
            </>
          }
          control={
            <IdsDropdownSingleSelect
              options={ZOOM_OPTIONS}
              value={prefs.pageZoom}
              onChange={(v) => set("pageZoom", v)}
              menuWidth="trigger"
              fullWidth
            />
          }
        />
        <SettingRow
          fieldControl
          label="Page colors"
          info="Page color themes override site palettes with a high-contrast set that is easier to read."
          description="Make sites easier to read by modifying the colors you see on pages."
          control={
            <IdsDropdownSingleSelect
              options={PAGE_COLOR_OPTIONS}
              value={prefs.pageColors}
              onChange={(v) => set("pageColors", v)}
              menuWidth="trigger"
              fullWidth
            />
          }
        />
        <SettingRow
          label="Specify sites"
          description="List of sites that are excluded from page colors."
          control={
            <>
              <IdsTag type="read-only" label={`${excludedSiteCount} sites`} />
              <IdsButton variant="secondary" size="small" onClick={onManageSites}>
                <IdsButtonLabel>Manage sites</IdsButtonLabel>
              </IdsButton>
            </>
          }
        />
      </Section>

      <Section id="usability" title="Usability">
        <SettingRow
          fieldControl
          label="Screen reader announcements"
          description="Choose which events are announced while you work."
          control={
            <IdsDropdownMultiSelect
              options={ANNOUNCEMENT_OPTIONS}
              value={prefs.announcements}
              onChange={(v) => set("announcements", v)}
              showSelectedBadge
              showSelectAllClearAll
              menuWidth="content"
              fullWidth
            />
          }
        />
      </Section>

      <Section id="support" title="Support">
        <SettingRow
          fieldControl
          label="Accessibility contact"
          description="Who your administrator reaches out to about accommodation requests."
          control={
            <IdsTextBox
              label="Accessibility contact"
              showLabel={false}
              ariaLabel="Accessibility contact"
              placeholder="name@example.com"
              value={prefs.accessibilityContact}
              onValueChange={(v) => set("accessibilityContact", v)}
              showIcon={false}
              size="small"
            />
          }
        />
        <SettingRow
          stacked
          fieldControl
          label="Accommodation notes"
          description="Describe any accommodations you need. Shared with your administrator only."
          control={
            <IdsTextBox
              label="Accommodation notes"
              showLabel={false}
              ariaLabel="Accommodation notes"
              componentType="text-area"
              rows={4}
              placeholder="For example: I use a screen magnifier at 200% and prefer keyboard-only navigation."
              value={prefs.accommodationNotes}
              onValueChange={(v) => set("accommodationNotes", v)}
              showIcon={false}
              size="small"
            />
          }
        />
      </Section>

      <h3 id="advanced" className="settings-group-title">
        Advanced
      </h3>
      <IdsAccordion
        items={[
          {
            value: "advanced-a11y",
            title: "Advanced accessibility options",
            content: (
              <div className="settings-stack settings-stack--lg">
                <IdsRadioGroup
                  name="focus-indicator"
                  label="Focus indicator style"
                  labelPosition="top"
                  value={prefs.focusIndicator}
                  onChange={(v) => set("focusIndicator", v)}
                >
                  <IdsRadioButton value="outline">
                    <IdsRadioLabel>Outline ring (default)</IdsRadioLabel>
                  </IdsRadioButton>
                  <IdsRadioButton value="underline">
                    <IdsRadioLabel>Underline</IdsRadioLabel>
                  </IdsRadioButton>
                  <IdsRadioButton value="block">
                    <IdsRadioLabel>Solid block</IdsRadioLabel>
                  </IdsRadioButton>
                </IdsRadioGroup>

                <IdsCheckboxGroup
                  name="reading-comfort"
                  label="Reading comfort"
                  labelPosition="top"
                >
                  <IdsCheckbox
                    value="reduce-motion"
                    checked={prefs.reduceMotion}
                    onChange={(v: boolean) => set("reduceMotion", v)}
                  >
                    <IdsCheckboxLabel>Reduce motion and transitions</IdsCheckboxLabel>
                  </IdsCheckbox>
                  <IdsCheckbox
                    value="underline-links"
                    checked={prefs.underlineLinks}
                    onChange={(v: boolean) => set("underlineLinks", v)}
                  >
                    <IdsCheckboxLabel>Always underline links in body text</IdsCheckboxLabel>
                  </IdsCheckbox>
                </IdsCheckboxGroup>
              </div>
            ),
          },
        ]}
      />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Settings page                                                               */
/* -------------------------------------------------------------------------- */

function SettingsPage({ showAnchorMenu = true }: { showAnchorMenu?: boolean }) {
  const [prefs, setPrefs] = useState<Preferences>(INITIAL_PREFERENCES);
  const [activeTab, setActiveTab] = useState("accessibility");
  const [query, setQuery] = useState("");
  const [sitesOpen, setSitesOpen] = useState(false);

  const set: SetPref = (key, value) => setPrefs((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="settings-page">
      <IdsAlert
        display="inline"
        severity="informational"
        density="detailed"
        title="Some settings are managed by your organization"
        message="Page colors follow the IT policy assigned to your account."
        linkLabel="View policy"
        linkHref="#policy"
      />

      <div className="settings-search">
        <IdsTextBox
          label="Search settings"
          showLabel={false}
          ariaLabel="Search settings"
          placeholder="Search settings"
          value={query}
          onValueChange={setQuery}
          showIcon
          iconName="search-16"
          size="small"
        />
      </div>

      <div className="settings-shell">
        <div className="settings-main">
          <IdsTabs
            activeItemId={activeTab}
            onActiveItemChange={setActiveTab}
            surface="transparent"
            items={[
              {
                id: "accessibility",
                label: "Accessibility",
                content: (
                  <AccessibilityPanel
                    prefs={prefs}
                    set={set}
                    onManageSites={() => setSitesOpen(true)}
                    excludedSiteCount={EXCLUDED_SITE_ROWS.length}
                  />
                ),
              },
            ]}
          />
        </div>

        {showAnchorMenu ? (
          <aside className="settings-aside">
            <IdsAnchorMenu title="On this page" items={TAB_SECTIONS[activeTab] ?? []} />
          </aside>
        ) : null}
      </div>

      {/* “Specify sites” drill-in. */}
      <IdsModal
        open={sitesOpen}
        onOpenChange={setSitesOpen}
        scenario="single-page"
        size="medium"
        title="Sites excluded from page colors"
        description="These sites keep their own palette regardless of the page colors setting."
        primaryActionLabel="Done"
        tertiaryActionLabel="Cancel"
        onPrimaryAction={() => setSitesOpen(false)}
        onTertiaryAction={() => setSitesOpen(false)}
      >
        <IdsDatagrid
          columns={EXCLUDED_SITE_COLUMNS}
          rows={EXCLUDED_SITE_ROWS}
          rowSelection
          selectionMode="multiple"
          headerColorAndBorder
        />
      </IdsModal>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* App shell around the page                                                   */
/* -------------------------------------------------------------------------- */

const MENU_ITEMS: MainMenuLeftPrimaryItem[] = [
  { id: "dashboard", name: "Dashboard", iconName: "home" },
  { id: "protection", name: "Protection", iconName: "shield-encrypt-alt" },
  { id: "alerts", name: "Alerts and Events", iconName: "alert-bell" },
  { id: "reports", name: "Reports", iconName: "productivity-alt" },
  {
    id: "administration",
    name: "Administration",
    iconName: "user-settings",
    children: [
      { id: "admin-users", name: "Users" },
      { id: "admin-settings", name: "Settings" },
    ],
  },
];

const APP_LAUNCHER = (
  <IdsAppLauncher
    triggerVariant="masthead"
    products={[
      { id: "protection", name: "Data Protection", iconSlug: "shield-encrypt-alt" },
      { id: "storage", name: "Storage Manager", iconSlug: "storage-array" },
      { id: "ops", name: "Ops Center", iconSlug: "dashboard" },
      { id: "analytics", name: "Analytics", iconSlug: "productivity-alt" },
    ]}
    options={[
      { id: "support", label: "Support portal" },
      { id: "docs", label: "Documentation" },
    ]}
  />
);

function placeholderPage(id: string, title: string, description: string, body: string): AppShellPage {
  return {
    id,
    title,
    description,
    content: (
      <IdsAppShellPagePanel title={title}>
        <p className="settings-description">{body}</p>
      </IdsAppShellPagePanel>
    ),
  };
}

const PAGES: AppShellPage[] = [
  placeholderPage(
    "dashboard",
    "Dashboard",
    "Health, capacity, and recent activity across every managed system.",
    "Open Administration → Settings in the left menu to reach the page this story is about.",
  ),
  placeholderPage(
    "protection",
    "Protection",
    "Policies, schedules, and protected workloads.",
    "Protection content placeholder.",
  ),
  placeholderPage(
    "alerts",
    "Alerts and Events",
    "Everything the system has raised in the selected time range.",
    "Alerts content placeholder.",
  ),
  placeholderPage(
    "reports",
    "Reports",
    "Saved and scheduled reports.",
    "Reports content placeholder.",
  ),
  {
    id: "administration",
    title: "Settings",
    description:
      "Preferences apply to your account on this system. Settings marked as managed are set by your organization.",
    // App Shell scrolls its own body viewport, so the window-based anchor-menu
    // scroll-spy belongs to the standalone story instead.
    content: <SettingsPage showAnchorMenu={false} />,
  },
];

/* -------------------------------------------------------------------------- */
/* Meta + stories                                                              */
/* -------------------------------------------------------------------------- */

const meta: Meta = {
  title: "Playground/Settings Page",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A realistic application page assembled from IDS components. App Shell + Masthead + " +
          "App Launcher + Main Menu Left frame the screen, Tabs split the preference groups, the " +
          "Anchor Menu jumps between sections, and each row pairs a label with the control that edits " +
          "it.\n\n" +
          "App Launcher, Checkbox, Radio Button, Main Menu Left and Anchor Menu come from their " +
          "own feature branches rather than master.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

/**
 * The page on its own — the window scrolls, so the Anchor Menu's scroll-spy and
 * smooth scrolling work as they do in a real page.
 */
export const SettingsPageStory: Story = {
  name: "Settings page",
  render: () => (
    <div className="settings-canvas">
      <div className="settings-canvas__inner">
        <h1 className="settings-title">Settings</h1>
        <p className="settings-subtitle">
          Preferences apply to your account on this system. Settings marked as managed are set by
          your organization.
        </p>
        <SettingsPage />
      </div>
    </div>
  ),
};

/** The same page inside the product chrome: Masthead, App Launcher, Main Menu Left, Footer. */
export const InAppShell: Story = {
  render: () => (
    <div style={{ height: "100vh" }}>
      <IdsAppShell
        pages={PAGES}
        defaultPageId="administration"
        menuItems={MENU_ITEMS}
        defaultMenuSelectedItemId="administration"
        defaultMenuExpanded
        breakpointPreset="fluid"
        mastheadProductName="Data Protection Console"
        mastheadProductIconSlug="shield-cloud"
        appLauncherSlot={APP_LAUNCHER}
        avatarSlot={<IdsMastheadAvatar initials="CD" aria-label="Account menu" />}
        footer={{
          hostname: "dpc-prod-01",
          swid: "ELMCR00222GBPB",
          currentDateTime: "Wed, 2026-09-23 09:41 AM",
          timeZoneLabel: "Eastern Time (US & Canada)",
        }}
      />
    </div>
  ),
};

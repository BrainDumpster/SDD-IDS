/**
 * Storybook: a realistic product page built from IDS React components
 * (`lib/react/ids/*`) — an application **Settings** screen.
 *
 * Every component here has a job on the page: the shell frames it, the anchor
 * menu jumps between sections, the tabs split the preference groups, each row
 * pairs a label with the control that actually edits that preference, and the
 * action bar saves or discards the pending edits.
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
import React, { useMemo, useState } from "react";
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
import { IdsButton, IdsButtonLabel, IdsButtonLeadingIcon } from "@ids/react/button";
import { IdsTabs } from "@ids/react/tab";
import { IdsTextBox } from "@ids/react/text-box";
import { IdsToggleSwitch } from "@ids/react/toggle-switch";
import { IdsDropdownSingleSelect } from "@ids/react/dropdown-single-select";
import { IdsDropdownMultiSelect } from "@ids/react/dropdown-multiselect";
import { IdsSegmentedButton, IdsSegmentedText } from "@ids/react/segmented-button";
import { IdsSlider, type IdsSliderValue } from "@ids/react/slider";
import { IdsRadioGroup, IdsRadioButton, IdsRadioLabel } from "@ids/react/radio-button";
import { IdsCheckbox, IdsCheckboxGroup, IdsCheckboxLabel } from "@ids/react/checkbox";
import { IdsAccordion } from "@ids/react/accordion";
import { IdsLink } from "@ids/react/link";
import { IdsTag } from "@ids/react/tag";
import { IdsDatePicker } from "@ids/react/date-picker";
import { IdsTimePicker } from "@ids/react/time-picker";
import { IdsDatagrid, type IdsDatagridColumnDef, type IdsDatagridRowDef } from "@ids/react/datagrid";
import { IdsModal } from "@ids/react/modal";
import { IdsToastViewport, type IdsToastQueueItem } from "@ids/react/toast";
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
  highContrastOnly: boolean;
  textSize: IdsSliderValue;
  customScrollbars: boolean;
  imageDescriptions: boolean;
  askBeforeClosing: boolean;
  captionStyle: string;
  announcements: string[];
  focusIndicator: string;
  reduceMotion: boolean;
  underlineLinks: boolean;
  theme: string;
  density: string;
  accent: string;
  emailAlerts: boolean;
  severities: string[];
  quietFrom: string | null;
  quietTo: string | null;
  pauseUntil: Date | null;
}

const INITIAL_PREFERENCES: Preferences = {
  focusOutline: false,
  pageZoom: "100",
  pageColors: "system",
  highContrastOnly: false,
  textSize: 100,
  customScrollbars: false,
  imageDescriptions: true,
  askBeforeClosing: true,
  captionStyle: "default",
  announcements: ["errors", "jobs"],
  focusIndicator: "outline",
  reduceMotion: false,
  underlineLinks: true,
  theme: "system",
  density: "comfortable",
  accent: "brand",
  emailAlerts: true,
  severities: ["critical", "major"],
  quietFrom: "10:00 PM",
  quietTo: "07:00 AM",
  pauseUntil: null,
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

const CAPTION_OPTIONS = [
  { id: "default", label: "System default" },
  { id: "large", label: "Large text, high contrast" },
  { id: "custom", label: "Custom" },
];

const ANNOUNCEMENT_OPTIONS = [
  { id: "errors", label: "Errors and failures" },
  { id: "jobs", label: "Job status changes" },
  { id: "capacity", label: "Capacity thresholds" },
  { id: "logins", label: "Sign-in activity" },
];

const SEVERITY_OPTIONS = [
  { id: "critical", label: "Critical" },
  { id: "major", label: "Major warning" },
  { id: "minor", label: "Minor warning" },
  { id: "info", label: "Informational" },
];

const ACCENT_OPTIONS = [
  { id: "brand", label: "Brand blue" },
  { id: "teal", label: "Teal" },
  { id: "berry", label: "Berry" },
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
    { label: "Advanced", href: "#advanced" },
  ],
  appearance: [
    { label: "Theme", href: "#theme" },
    { label: "Layout", href: "#layout" },
  ],
  notifications: [
    { label: "Delivery", href: "#delivery" },
    { label: "Quiet hours", href: "#quiet-hours" },
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
          label="Only apply page colors when high contrast themes are on"
          control={
            <IdsToggleSwitch
              checked={prefs.highContrastOnly}
              onCheckedChange={(v) => set("highContrastOnly", v)}
              disabled={prefs.pageColors === "off"}
              aria-label="Only apply page colors when high contrast themes are on"
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
        <SettingRow
          stacked
          label="Text size"
          description="Scales body text across the product. 100% matches the system default."
          control={
            <IdsSlider
              min={75}
              max={175}
              step={25}
              value={prefs.textSize}
              onValueChange={(v) => set("textSize", v)}
              showStepper
              stepperFrequency={25}
              showValueLabel
              minLabel="75%"
              maxLabel="175%"
            />
          }
        />
        <SettingRow
          label="Turn off custom scrollbars"
          description="Only default scrollbars will be available across all sites."
          control={
            <IdsToggleSwitch
              checked={prefs.customScrollbars}
              onCheckedChange={(v) => set("customScrollbars", v)}
              aria-label="Turn off custom scrollbars"
            />
          }
        />
      </Section>

      <Section id="usability" title="Usability">
        <SettingRow
          label="Get image descriptions for screen readers"
          description="Unlabeled images are described automatically before they are announced."
          control={
            <IdsToggleSwitch
              checked={prefs.imageDescriptions}
              onCheckedChange={(v) => set("imageDescriptions", v)}
              aria-label="Get image descriptions for screen readers"
            />
          }
        />
        <SettingRow
          label="Ask before closing a window with multiple tabs"
          control={
            <IdsToggleSwitch
              checked={prefs.askBeforeClosing}
              onCheckedChange={(v) => set("askBeforeClosing", v)}
              aria-label="Ask before closing a window with multiple tabs"
            />
          }
        />
        <SettingRow
          fieldControl
          label="Caption style"
          description="Applies to in-product video walkthroughs and recorded sessions."
          control={
            <IdsDropdownSingleSelect
              options={CAPTION_OPTIONS}
              value={prefs.captionStyle}
              onChange={(v) => set("captionStyle", v)}
              menuWidth="content"
              fullWidth
            />
          }
        />
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

function AppearancePanel({ prefs, set }: { prefs: Preferences; set: SetPref }) {
  return (
    <>
      <Section id="theme" title="Theme">
        <SettingRow
          stacked
          label="Color theme"
          description="System follows your operating system setting."
          control={
            <IdsRadioGroup
              name="color-theme"
              orientation="horizontal"
              ariaLabel="Color theme"
              value={prefs.theme}
              onChange={(v) => set("theme", v)}
            >
              <IdsRadioButton value="system">
                <IdsRadioLabel>System</IdsRadioLabel>
              </IdsRadioButton>
              <IdsRadioButton value="light">
                <IdsRadioLabel>Light</IdsRadioLabel>
              </IdsRadioButton>
              <IdsRadioButton value="dark">
                <IdsRadioLabel>Dark</IdsRadioLabel>
              </IdsRadioButton>
            </IdsRadioGroup>
          }
        />
        <SettingRow
          fieldControl
          label="Accent color"
          description="Used for primary actions, selection, and charts."
          control={
            <IdsDropdownSingleSelect
              options={ACCENT_OPTIONS}
              value={prefs.accent}
              onChange={(v) => set("accent", v)}
              menuWidth="trigger"
              fullWidth
            />
          }
        />
      </Section>

      <Section id="layout" title="Layout">
        <SettingRow
          label="Row density"
          description="Controls padding in tables and list views."
          control={
            <IdsSegmentedButton
              type="text"
              value={prefs.density}
              onSelected={(v) => set("density", v)}
              ariaLabel="Row density"
            >
              <IdsSegmentedText value="comfortable" label="Comfortable" />
              <IdsSegmentedText value="compact" label="Compact" />
            </IdsSegmentedButton>
          }
        />
      </Section>
    </>
  );
}

function NotificationsPanel({ prefs, set }: { prefs: Preferences; set: SetPref }) {
  return (
    <>
      <Section id="delivery" title="Delivery">
        <SettingRow
          label="Email alerts"
          description="Send a message to c.dao@example.com when an alert is raised."
          control={
            <IdsToggleSwitch
              checked={prefs.emailAlerts}
              onCheckedChange={(v) => set("emailAlerts", v)}
              aria-label="Email alerts"
            />
          }
        />
        <SettingRow
          fieldControl
          label="Alert severities"
          description="Only the selected severities are delivered by email."
          control={
            <IdsDropdownMultiSelect
              options={SEVERITY_OPTIONS}
              value={prefs.severities}
              onChange={(v) => set("severities", v)}
              disabled={!prefs.emailAlerts}
              showSelectedBadge
              menuWidth="content"
              fullWidth
            />
          }
        />
      </Section>

      <Section id="quiet-hours" title="Quiet hours">
        <SettingRow
          label="Do not disturb"
          description="Non-critical alerts are held and delivered in the next digest."
          control={
            <div className="settings-inline">
              <IdsTimePicker
                label="From"
                value={prefs.quietFrom}
                onChange={(v) => set("quietFrom", v)}
                size="small"
              />
              <IdsTimePicker
                label="To"
                value={prefs.quietTo}
                onChange={(v) => set("quietTo", v)}
                size="small"
              />
            </div>
          }
        />
        <SettingRow
          fieldControl
          label="Pause all notifications until"
          description="Leave empty to keep notifications running."
          control={
            <IdsDatePicker
              value={prefs.pauseUntil}
              onChange={(v) => set("pauseUntil", v)}
              size="small"
              placeholder="MM-DD-YYYY"
              minDate={new Date(2026, 8, 23)}
            />
          }
        />
      </Section>
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
  const [discardOpen, setDiscardOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toasts, setToasts] = useState<IdsToastQueueItem[]>([]);

  const set: SetPref = (key, value) => setPrefs((prev) => ({ ...prev, [key]: value }));

  const changedCount = useMemo(
    () =>
      (Object.keys(INITIAL_PREFERENCES) as Array<keyof Preferences>).filter(
        (key) => JSON.stringify(prefs[key]) !== JSON.stringify(INITIAL_PREFERENCES[key]),
      ).length,
    [prefs],
  );

  const handleSave = () => {
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      setToasts((prev) => [
        ...prev,
        {
          id: `saved-${Date.now()}`,
          type: "success",
          message: `${changedCount} setting${changedCount === 1 ? "" : "s"} saved.`,
          closable: true,
          duration: 6000,
        },
      ]);
    }, 900);
  };

  return (
    <div className="settings-page">
      <IdsAlert
        display="inline"
        severity="informational"
        density="detailed"
        title="Some settings are managed by your organization"
        message="Page colors and caption defaults follow the IT policy assigned to your account."
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
              {
                id: "appearance",
                label: "Appearance",
                content: <AppearancePanel prefs={prefs} set={set} />,
              },
              {
                id: "notifications",
                label: "Notifications",
                badgeCount: prefs.severities.length,
                content: <NotificationsPanel prefs={prefs} set={set} />,
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

      {/* Action bar — reflects the pending-change state above it. */}
      <div className="settings-actions">
        <div className="settings-actions__status">
          {changedCount > 0 ? (
            <IdsTag
              type="read-only"
              tone="minor"
              label={`${changedCount} unsaved change${changedCount === 1 ? "" : "s"}`}
            />
          ) : (
            <span className="settings-description">All changes saved</span>
          )}
        </div>
        <IdsButton
          variant="tertiary"
          disabled={changedCount === 0 || saving}
          onClick={() => setDiscardOpen(true)}
        >
          <IdsButtonLabel>Discard</IdsButtonLabel>
        </IdsButton>
        <IdsButton
          variant="primary"
          loading={saving}
          disabled={changedCount === 0}
          onClick={handleSave}
        >
          <IdsButtonLeadingIcon>
            <IdsIcon shape="save-disk" size={16} />
          </IdsButtonLeadingIcon>
          <IdsButtonLabel>{saving ? "Saving…" : "Save changes"}</IdsButtonLabel>
        </IdsButton>
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

      {/* Confirm before throwing away edits. */}
      <IdsModal
        open={discardOpen}
        onOpenChange={setDiscardOpen}
        scenario="dialog"
        type="warning"
        size="small"
        title="Discard unsaved changes?"
        description={`${changedCount} setting${changedCount === 1 ? "" : "s"} will return to the last saved value.`}
        primaryActionLabel="Discard"
        tertiaryActionLabel="Keep editing"
        onPrimaryAction={() => {
          setPrefs(INITIAL_PREFERENCES);
          setDiscardOpen(false);
        }}
        onTertiaryAction={() => setDiscardOpen(false)}
      />

      <IdsToastViewport
        position="bottom-right"
        maxVisible={3}
        items={toasts}
        onItemsChange={setToasts}
      />
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
          "Anchor Menu jumps between sections, each row pairs a label with the control that edits " +
          "it, and the sticky action bar saves or discards pending edits (Modal confirm → Toast).\n\n" +
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

# IDS Tab — Angular reference port

Framework-specific notes for **Storybook / verification only**. The codegen contract is `components/ids/tab/design-spec.md` + `component-contracts/ids/tab.contract.ts`.

## Selectors

| Spec slot | Angular selector |
|-----------|------------------|
| `TabRoot` | `ids-tab` |
| `TabItem` | `ids-tab-item` (`itemId` input maps to spec `id`) |
| `TabPanel` | `ids-tab-panel` |

Import `IDS_TAB_IMPORTS` from `ids-tab.imports.ts`.

## Storybook

- **Title:** `Spec Generated/IDS/Tab`
- **Port:** `6007`
- **Stories:** `ids-tab.stories.js`
- **Docs copy:** `ids-tab.developer-usage.js`
- **Theme:** loaded globally via `storybook-angular/.storybook/preview.js` (`components/ids-theme.css`)

| Story | Purpose |
|-------|---------|
| Spec Accurate Design | Secondary · elevated · three tabs · `overview` active |
| PrimaryVariant | Primary indicator (top) |
| TransparentOnGray | `surface="transparent"` on gray host |
| OverflowResponsive | `TAB_OVERFLOW_DEMO_WIDTH` host · secondary |
| PrimaryOverflowResponsive | `TAB_OVERFLOW_DEMO_WIDTH` host · primary |
| AddTabDynamic | Dynamic append via `addTab` |
| AddLabelSecondary / AddLabelPrimary | Custom `addTabLabel` |
| StateMatrix | Static `simulatedState` matrix |

## Implementation notes (drift-sensitive)

- Overflow slot count: use `computeTabOverflowVisibleCount` from `tab.contract.ts` (do not hardcode `84` locally).
- Overflow menu items: use `computeTabOverflowMenuItems` (active hidden tab excluded).
- Tab row shell: `overflow: visible` so the More menu is not clipped.
- Visible slot measurement: `ResizeObserver` on list-wrap after view init.
- Add-tab: parent appends `ids-tab-item` children; root emits `addTab` only.

## React parity

React demo wrapper: `storybook/src/components/Tabs.tsx` + `IdsTabs.stories.tsx` (legacy `items[]` API). Overflow math must use the same contract helpers.

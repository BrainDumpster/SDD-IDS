#!/usr/bin/env python3
"""
Generate lib/react/ids component catalog Excel:
  Component | Hierarchy | Input (Properties) | Output (Events/Callbacks)

Usage:
  python scripts/generate_lib_ids_component_catalog_xlsx.py
  python scripts/generate_lib_ids_component_catalog_xlsx.py -o docs/my-catalog.xlsx
"""

from __future__ import annotations

import argparse
import re
from pathlib import Path

try:
    from openpyxl import Workbook
    from openpyxl.styles import Alignment, Font, PatternFill
    from openpyxl.utils import get_column_letter
except ImportError as exc:  # pragma: no cover
    raise SystemExit(
        "openpyxl is required. Install: uv pip install openpyxl (in project venv)"
    ) from exc

REPO_ROOT = Path(__file__).resolve().parents[1]
LIB_IDS = REPO_ROOT / "lib" / "react" / "ids"

# Root component catalog: display name, hierarchy (pseudo-HTML), props source
CATALOG: list[dict[str, str]] = [
    {
        "component": "Accordion",
        "hierarchy": """<IdsAccordion>
    <IdsAccordionItem>
        <IdsAccordionHeader>
            <IdsAccordionTrigger />
            <IdsAccordionChevron />
        </IdsAccordionHeader>
        <IdsAccordionBody>
            <IdsAccordionContent />
        </IdsAccordionBody>
    </IdsAccordionItem>
</IdsAccordion>""",
        "file": "accordion/IdsAccordion.tsx",
        "interface": "IdsAccordionProps",
    },
    {
        "component": "Alert",
        "hierarchy": """<IdsAlert>
    <IdsAlertIcon />
    <IdsAlertContent>
        <IdsAlertTitle />
        <IdsAlertMessage />
        <IdsAlertLink />
    </IdsAlertContent>
    <IdsAlertClose />
    <IdsAlertCarousel />
</IdsAlert>""",
        "file": "alert/IdsAlert.tsx",
        "interface": "IdsAlertBaseProps",
        "notes": "IdsAlertProps = union on display: global | inline (see IdsAlert.tsx).",
    },
    {
        "component": "Alert Group",
        "hierarchy": """<IdsAlertGroup>
    <IdsAlert />
</IdsAlertGroup>""",
        "file": "alert/IdsAlertGroup.tsx",
        "interface": "IdsAlertGroupProps",
    },
    {
        "component": "Anchor Menu",
        "hierarchy": """<IdsAnchorMenu>
    <IdsAnchorMenuHeader />
    <IdsAnchorMenuItem />
    <IdsAnchorActiveIndicator />
</IdsAnchorMenu>""",
        "file": "anchor-menu/IdsAnchorMenu.tsx",
        "interface": "IdsAnchorMenuProps",
    },
    {
        "component": "App Launcher",
        "hierarchy": """<IdsAppLauncher>
    <IdsAppLauncherTrigger />
    <IdsAppLauncherSurface>
        <IdsAppLauncherProductRegion>
            <IdsAppLauncherProductRowGroup>
                <IdsAppLauncherRowDivider />
                <IdsAppLauncherProductRow>
                    <IdsAppLauncherColumnDivider />
                    <IdsAppLauncherProductTile>
                        <IdsAppLauncherLabelCluster>
                            <IdsAppLauncherProductIcon />
                            <IdsAppLauncherProductLabel />
                        </IdsAppLauncherLabelCluster>
                        <IdsAppLauncherTileDividerRail />
                    </IdsAppLauncherProductTile>
                </IdsAppLauncherProductRow>
            </IdsAppLauncherProductRowGroup>
        </IdsAppLauncherProductRegion>
        <IdsAppLauncherOptionsRegion>
            <IdsAppLauncherOptionRow />
            <IdsAppLauncherFooterAction />
        </IdsAppLauncherOptionsRegion>
    </IdsAppLauncherSurface>
</IdsAppLauncher>""",
        "file": "app-launcher/IdsAppLauncher.tsx",
        "interface": "IdsAppLauncherProps",
    },
    {
        "component": "App Shell",
        "hierarchy": """<IdsAppShell>
    <IdsAppShellMastheadSlot>
        <IdsMasthead />
    </IdsAppShellMastheadSlot>
    <IdsAppShellBodyRow>
        <IdsAppShellMainMenuSlot>
            <IdsMainMenuLeft />
        </IdsAppShellMainMenuSlot>
        <IdsAppShellMainColumn>
            <IdsAppShellPageHeader>
                <IdsAppShellPageTitle />
                <IdsAppShellPageDescription />
            </IdsAppShellPageHeader>
            <IdsAppShellBodyViewport>
                <IdsAppShellBodyContentSlot />
            </IdsAppShellBodyViewport>
            <IdsAppShellFooterSlot>
                <IdsFooter />
            </IdsAppShellFooterSlot>
        </IdsAppShellMainColumn>
    </IdsAppShellBodyRow>
</IdsAppShell>""",
        "file": "app-shell/IdsAppShell.tsx",
        "interface": "IdsAppShellProps",
    },
    {
        "component": "Badge",
        "hierarchy": """<IdsBadge>
    <IdsBadgeContainer>
        <IdsBadgeContent />
    </IdsBadgeContainer>
</IdsBadge>""",
        "file": "badge/IdsBadge.tsx",
        "interface": "IdsBadgeProps",
    },
    {
        "component": "Button",
        "hierarchy": """<IdsButton>
    <IdsButtonLeadingIcon />
    <IdsButtonLabel />
</IdsButton>""",
        "file": "button/IdsButton.tsx",
        "interface": "IdsButtonProps",
    },
    {
        "component": "Card",
        "hierarchy": """<IdsCard>
    <IdsCardHeader>
        <IdsCardTitleCluster>
            <IdsCardTitle />
            <IdsCardTitleDivider />
            <IdsCardSecondaryTitle />
        </IdsCardTitleCluster>
        <IdsCardHeaderMeta />
        <IdsCardAdditionalFilter />
        <IdsCardFilter />
    </IdsCardHeader>
    <IdsCardBody>
        <IdsCardTextContent />
        <IdsCardKeyValueContent />
    </IdsCardBody>
    <IdsCardFooter>
        <IdsCardAction />
    </IdsCardFooter>
</IdsCard>""",
        "file": "card/IdsCard.tsx",
        "interface": "IdsCardProps",
    },
    {
        "component": "Checkbox",
        "hierarchy": """<IdsCheckbox>
    <IdsCheckboxControl />
    <IdsCheckboxLabel />
    <IdsHelper />
    <IdsError />
</IdsCheckbox>""",
        "file": "checkbox/IdsCheckbox.tsx",
        "interface": "IdsCheckboxProps",
    },
    {
        "component": "Dashboard",
        "hierarchy": """<IdsDashboard>
    <IdsDashboardGrid>
        <IdsDashboardItem>
            <IdsCard />
        </IdsDashboardItem>
    </IdsDashboardGrid>
</IdsDashboard>""",
        "file": "dashboard/IdsDashboard.tsx",
        "interface": "IdsDashboardProps",
    },
    {
        "component": "Date Picker",
        "hierarchy": """<IdsDatePicker>
    <IdsDatePickerTrigger />
    <IdsDatePickerCalendar />
</IdsDatePicker>""",
        "file": "date-picker/IdsDatePicker.tsx",
        "interface": "IdsDatePickerProps",
    },
    {
        "component": "Datagrid",
        "hierarchy": """<IdsDatagrid>
    <IdsDatagridColumn>
        <IdsDatagridColumnTitle />
        <IdsDatagridFilter />
    </IdsDatagridColumn>
    <IdsDatagridBody>
        <IdsDatagridRow>
            <IdsDatagridCell />
        </IdsDatagridRow>
    </IdsDatagridBody>
    <IdsDatagridFooter />
    <IdsDatagridDetailPanel />
</IdsDatagrid>""",
        "file": "datagrid/IdsDatagrid.tsx",
        "interface": "IdsDatagridProps",
    },
    {
        "component": "Detail Panel",
        "hierarchy": """<IdsDetailPanel>
    <IdsDetailPanelContent>
        <IdsDetailPanelHeader>
            <IdsDetailPanelTitle />
        </IdsDetailPanelHeader>
        <IdsDetailPanelBody />
        <IdsDetailPanelFooter />
    </IdsDetailPanelContent>
    <IdsDetailPanelCollapsedRail>
        <IdsDetailPanelToggleButton />
    </IdsDetailPanelCollapsedRail>
</IdsDetailPanel>""",
        "file": "detail-panel/IdsDetailPanel.tsx",
        "interface": "IdsDetailPanelProps",
    },
    {
        "component": "Dropdown Button",
        "hierarchy": """<IdsDropdownButton>
    <IdsDropdownTrigger />
    <IdsDropdownMenu>
        <IdsDropdownMenuItem />
    </IdsDropdownMenu>
</IdsDropdownButton>""",
        "file": "dropdown-button/IdsDropdownButton.tsx",
        "interface": "IdsDropdownButtonProps",
    },
    {
        "component": "Dropdown Combo Box",
        "hierarchy": """<IdsDropdownComboBox>
    <IdsDropdownComboBoxField />
    <IdsComboboxOptions>
        <IdsComboboxOption />
    </IdsComboboxOptions>
    <IdsHelper />
    <IdsError />
</IdsDropdownComboBox>""",
        "file": "dropdown-combo-box/IdsDropdownComboBox.tsx",
        "interface": "IdsDropdownComboBoxProps",
    },
    {
        "component": "Dropdown Multi Select",
        "hierarchy": """<IdsDropdownMultiSelect>
    <IdsDropdownMultiSelectField />
    <IdsDropdownMultiSelectOptions>
        <IdsDropdownMultiSelectOption />
    </IdsDropdownMultiSelectOptions>
    <IdsHelper />
    <IdsError />
</IdsDropdownMultiSelect>""",
        "file": "dropdown-multiselect/IdsDropdownMultiSelect.tsx",
        "interface": "IdsDropdownMultiSelectProps",
    },
    {
        "component": "Dropdown Single Select",
        "hierarchy": """<IdsDropdownSingleSelect>
    <IdsDropdownSingleSelectField />
    <IdsDropdownSingleSelectOptions>
        <IdsDropdownSingleSelectOption />
    </IdsDropdownSingleSelectOptions>
    <IdsHelper />
    <IdsError />
</IdsDropdownSingleSelect>""",
        "file": "dropdown-single-select/IdsDropdownSingleSelect.tsx",
        "interface": "IdsDropdownSingleSelectProps",
    },
    {
        "component": "Dual List Box",
        "hierarchy": """<IdsDualListBox>
    <IdsDualListBoxListsParent>
        <IdsDualListBoxAvailablePane>
            <IdsDualListBoxAvailablePaneHeader />
            <IdsDualListBoxAvailableMetrics />
            <IdsDualListBoxAvailableListGroup>
                <IdsDualListBoxListItem>
                    <IdsDualListBoxDragHandle />
                    <IdsDualListBoxItemContent />
                    <IdsDualListBoxSelectionCheck />
                </IdsDualListBoxListItem>
            </IdsDualListBoxAvailableListGroup>
        </IdsDualListBoxAvailablePane>
        <IdsDualListBoxTransferButtonGroup>
            <IdsDualListBoxMoveAllRight />
            <IdsDualListBoxMoveSelectedRight />
            <IdsDualListBoxMoveSelectedLeft />
            <IdsDualListBoxMoveAllLeft />
        </IdsDualListBoxTransferButtonGroup>
        <IdsDualListBoxSelectedPane>
            <IdsDualListBoxSelectedPaneHeader />
            <IdsDualListBoxSelectedMetrics />
            <IdsDualListBoxSelectedListGroup>
                <IdsDualListBoxListItem />
            </IdsDualListBoxSelectedListGroup>
        </IdsDualListBoxSelectedPane>
    </IdsDualListBoxListsParent>
</IdsDualListBox>""",
        "file": "dual-list-box/IdsDualListBox.tsx",
        "interface": "IdsDualListBoxProps",
    },
    {
        "component": "Error",
        "hierarchy": """<IdsError>
    <IdsErrorIcon />
    <IdsErrorText />
</IdsError>""",
        "file": "error/IdsError.tsx",
        "interface": "IdsErrorProps",
    },
    {
        "component": "Footer",
        "hierarchy": """<IdsFooter>
    <IdsFooterLeftRegion>
        <IdsFooterHostName />
        <IdsFooterSwidGroup />
    </IdsFooterLeftRegion>
    <IdsFooterTimeGroup />
    <IdsFooterTimeZoneGroup />
</IdsFooter>""",
        "file": "footer/IdsFooter.tsx",
        "interface": "IdsFooterProps",
    },
    {
        "component": "Get Started",
        "hierarchy": """<IdsGetStarted>
    <IdsGetStartedHeroHeader>
        <IdsGetStartedHeroBackground />
        <IdsGetStartedHeroShadowBand />
        <IdsGetStartedHeroHoneycomb />
        <IdsGetStartedMastheadSlot />
        <IdsGetStartedHeroTitle />
        <IdsGetStartedHeroSubtitle />
    </IdsGetStartedHeroHeader>
    <IdsGetStartedContainer>
        <IdsGetStartedCardTrack>
            <IdsGetStartedCardAnchor>
                <IdsGetStartedCardIconBadge />
                <IdsGetStartedCard>
                    <IdsGetStartedCardTitleBand />
                    <IdsGetStartedCardContentPanel>
                        <IdsGetStartedCardDescription />
                        <IdsGetStartedCardNote />
                        <IdsGetStartedCardConfigureButton />
                    </IdsGetStartedCardContentPanel>
                </IdsGetStartedCard>
            </IdsGetStartedCardAnchor>
        </IdsGetStartedCardTrack>
        <IdsGetStartedSkipButton />
    </IdsGetStartedContainer>
    <IdsGetStartedOverflowEdge>
        <IdsGetStartedOverflowGradient />
        <IdsGetStartedOverflowArrow>
            <IdsGetStartedOverflowNavButton />
        </IdsGetStartedOverflowArrow>
    </IdsGetStartedOverflowEdge>
</IdsGetStarted>""",
        "file": "get-started/IdsGetStarted.tsx",
        "interface": "IdsGetStartedProps",
    },
    {
        "component": "Helper",
        "hierarchy": """<IdsHelper>
    <IdsIcon />
    <IdsHelperText />
</IdsHelper>""",
        "file": "helper/IdsHelper.tsx",
        "interface": "IdsHelperProps",
    },
    {
        "component": "Icon",
        "hierarchy": """<IdsIcon />""",
        "file": "icon/IdsIcon.tsx",
        "interface": "IdsIconProps",
    },
    {
        "component": "Link",
        "hierarchy": """<IdsLink>
    <IdsLinkLabel />
    <IdsLinkExternalIcon />
</IdsLink>""",
        "file": "link/IdsLink.tsx",
        "interface": "SharedProps",
        "notes": "IdsLinkProps = SharedProps & native anchor/button HTML attributes (omitted duplicates).",
    },
    {
        "component": "Main Menu Left",
        "hierarchy": """<IdsMainMenuLeft>
    <IdsMainMenuLogo />
    <IdsMainMenuList>
        <IdsMainMenuPrimaryItem>
            <IdsMainMenuPrimaryIcon />
            <IdsMainMenuPrimaryLabel />
            <IdsMainMenuPrimaryChevron />
            <IdsMainMenuSecondaryList>
                <IdsMainMenuSecondaryItem />
            </IdsMainMenuSecondaryList>
        </IdsMainMenuPrimaryItem>
    </IdsMainMenuList>
    <IdsMainMenuExpandCollapse />
</IdsMainMenuLeft>""",
        "file": "main-menu-left/IdsMainMenuLeft.tsx",
        "interface": "IdsMainMenuLeftProps",
    },
    {
        "component": "Masthead",
        "hierarchy": """<IdsMasthead>
    <IdsMastheadBrandSlot>
        <IdsMastheadLogo />
        <IdsMastheadProductName />
    </IdsMastheadBrandSlot>
    <IdsMastheadActionsRow>
        <IdsMastheadIconsSlot />
        <IdsMastheadAppLauncherSlot />
        <IdsMastheadAvatarSlot />
    </IdsMastheadActionsRow>
</IdsMasthead>""",
        "file": "masthead/IdsMasthead.tsx",
        "interface": "IdsMastheadProps",
    },
    {
        "component": "Modal",
        "hierarchy": """<IdsModal>
    <IdsModalOverlay />
    <IdsModalSurface>
        <IdsModalHeader>
            <IdsModalSeverityIcon />
            <IdsModalTitle />
            <IdsModalClose />
        </IdsModalHeader>
        <IdsModalDescription />
        <IdsModalTabs />
        <IdsModalContent />
        <IdsModalFooter />
    </IdsModalSurface>
</IdsModal>""",
        "file": "modal/IdsModal.tsx",
        "interface": "IdsModalProps",
    },
    {
        "component": "Pagination",
        "hierarchy": """<IdsPagination>
    <IdsPaginationResultsPerPageGroup />
    <IdsPaginationPageNavigationGroup>
        <IdsPaginationFirstPageButton />
        <IdsPaginationPrevPageButton />
        <IdsPaginationPageInput />
        <IdsPaginationPageCountText />
        <IdsPaginationNextPageButton />
        <IdsPaginationLastPageButton />
    </IdsPaginationPageNavigationGroup>
</IdsPagination>""",
        "file": "pagination/IdsPagination.tsx",
        "interface": "IdsPaginationProps",
    },
    {
        "component": "Progress Bar",
        "hierarchy": """<IdsProgressBar>
    <IdsProgressBarTrack>
        <IdsProgressBarTrackBg />
        <IdsProgressBarIndicator />
    </IdsProgressBarTrack>
    <IdsProgressBarLabeledBlock />
</IdsProgressBar>""",
        "file": "progress-bar/IdsProgressBar.tsx",
        "interface": "IdsProgressBarProps",
    },
    {
        "component": "Radio Button",
        "hierarchy": """<IdsRadioGroup>
    <IdsRadioButton>
        <IdsRadioControl />
        <IdsRadioLabel />
        <IdsHelper />
        <IdsError />
    </IdsRadioButton>
</IdsRadioGroup>""",
        "file": "radio-button/IdsRadioButton.tsx",
        "interface": "IdsRadioGroupProps",
    },
    {
        "component": "Segmented Button",
        "hierarchy": """<IdsSegmentedButton>
    <IdsSegmentedText />
    <IdsSegmentedIcon />
</IdsSegmentedButton>""",
        "file": "segmented-button/IdsSegmentedButton.tsx",
        "interface": "IdsSegmentedButtonProps",
    },
    {
        "component": "Slider",
        "hierarchy": """<IdsSlider>
    <IdsSliderRow>
        <IdsSliderMinLabel />
        <IdsSliderTrack>
            <IdsSliderThumbMin />
            <IdsSliderThumbMax />
        </IdsSliderTrack>
        <IdsSliderMaxLabel />
    </IdsSliderRow>
</IdsSlider>""",
        "file": "slider/IdsSlider.tsx",
        "interface": "IdsSliderProps",
    },
    {
        "component": "Spinner",
        "hierarchy": """<IdsSpinner>
    <IdsSpinnerBackdrop />
    <IdsSpinnerVisual />
    <IdsSpinnerLabel />
</IdsSpinner>""",
        "file": "spinner/IdsSpinner.tsx",
        "interface": "IdsSpinnerProps",
    },
    {
        "component": "Status Bar",
        "hierarchy": """<IdsStatusBar>
    <IdsStatusBarTotalItem>
        <IdsStatusBarItemDivider />
        <IdsStatusBarItemValue />
        <IdsStatusBarItemMeta />
    </IdsStatusBarTotalItem>
    <IdsStatusBarContentViewport>
        <IdsStatusBarItem>
            <IdsStatusBarItemIconSlot>
                <IdsStatusBarInventoryMainIcon />
                <IdsStatusBarInventoryStatusBadge />
            </IdsStatusBarItemIconSlot>
            <IdsStatusBarItemValue />
            <IdsStatusBarItemMeta />
            <IdsStatusBarItemDivider />
        </IdsStatusBarItem>
        <IdsStatusBarOverflowLayer>
            <IdsStatusBarOverflowLeft />
            <IdsStatusBarOverflowRight />
        </IdsStatusBarOverflowLayer>
    </IdsStatusBarContentViewport>
</IdsStatusBar>""",
        "file": "status-bar/IdsStatusBar.tsx",
        "interface": "IdsStatusBarProps",
    },
    {
        "component": "Tab",
        "hierarchy": """<IdsTabs>
    <IdsTabsList>
        <IdsTab>
            <IdsTabButton />
        </IdsTab>
        <IdsTabsOverflowTrigger />
        <IdsTabsAdd />
    </IdsTabsList>
    <IdsTabContent />
</IdsTabs>""",
        "file": "tab/IdsTabs.tsx",
        "interface": "IdsTabsProps",
    },
    {
        "component": "Tag",
        "hierarchy": """<IdsTag>
    <IdsTagPrefixIcon />
    <IdsTagLabel />
    <IdsTagBadge />
    <IdsTagMenuCaret />
    <IdsTagEditableField />
    <IdsTagClose />
</IdsTag>""",
        "file": "tag/IdsTag.tsx",
        "interface": "IdsTagProps",
    },
    {
        "component": "Text Box",
        "hierarchy": """<IdsTextBox>
    <IdsTextBoxControl />
    <IdsTextBoxSuffixIcon />
    <IdsHelper />
    <IdsError />
</IdsTextBox>""",
        "file": "text-box/IdsTextBox.tsx",
        "interface": "IdsTextBoxProps",
    },
    {
        "component": "Time Picker",
        "hierarchy": """<IdsTimePicker>
    <IdsTimePickerTrigger />
    <IdsTimePickerPopup />
</IdsTimePicker>""",
        "file": "time-picker/IdsTimePicker.tsx",
        "interface": "IdsTimePickerProps",
    },
    {
        "component": "Toast Viewport",
        "hierarchy": """<IdsToastViewport>
    <IdsToastItem>
        <IdsToastIconContainer />
        <IdsToastMessage />
        <IdsToastViewDetailsAction />
        <IdsToastCloseAction />
    </IdsToastItem>
</IdsToastViewport>""",
        "file": "toast/IdsToastViewport.tsx",
        "interface": "IdsToastViewportProps",
    },
    {
        "component": "Toast Item",
        "hierarchy": """<IdsToastItem>
    <IdsToastIconContainer />
    <IdsToastMessage />
    <IdsToastViewDetailsAction />
    <IdsToastCloseAction />
</IdsToastItem>""",
        "file": "toast/IdsToastItem.tsx",
        "interface": "IdsToastItemProps",
    },
    {
        "component": "Toggle Switch",
        "hierarchy": """<IdsToggleSwitch>
    <IdsToggleSwitchInput />
    <IdsToggleSwitchTrack />
    <IdsToggleSwitchThumb />
    <IdsToggleSwitchLabel />
    <IdsToggleSwitchAssistiveText />
</IdsToggleSwitch>""",
        "file": "toggle-switch/IdsToggleSwitch.tsx",
        "interface": "IdsToggleSwitchProps",
    },
    {
        "component": "Tooltip",
        "hierarchy": """<IdsTooltip>
    <IdsTooltipTrigger />
    <IdsTooltipPanel>
        <IdsTooltipHeader>
            <IdsTooltipTitle />
        </IdsTooltipHeader>
        <IdsTooltipBody />
        <IdsTooltipClose />
        <IdsTooltipArrow />
    </IdsTooltipPanel>
</IdsTooltip>""",
        "file": "tooltip/IdsTooltip.tsx",
        "interface": "TooltipProps",
    },
    {
        "component": "Tree",
        "hierarchy": """<IdsTree>
    <IdsTreeItem>
        <IdsTreeExpandChevron />
        <IdsTreeNodeIcon />
        <IdsTreeItemLabel />
        <IdsTreeCountBadge />
    </IdsTreeItem>
</IdsTree>""",
        "file": "tree/IdsTree.tsx",
        "interface": "IdsTreeProps",
    },
    {
        "component": "Whats New",
        "hierarchy": """<IdsWhatsNew>
    <IdsWhatsNewHeader>
        <IdsWhatsNewTitle />
        <IdsWhatsNewCloseButton />
    </IdsWhatsNewHeader>
    <IdsWhatsNewSummary />
    <IdsWhatsNewBody>
        <IdsWhatsNewVersionFilterRow>
            <IdsWhatsNewVersion />
            <IdsWhatsNewFilter />
        </IdsWhatsNewVersionFilterRow>
        <IdsWhatsNewSectionsScroll>
            <IdsWhatsNewSection>
                <IdsWhatsNewThumbnail />
                <IdsWhatsNewSectionHeader>
                    <IdsWhatsNewBookmarkButton />
                    <IdsWhatsNewSectionTitle />
                </IdsWhatsNewSectionHeader>
                <IdsWhatsNewDescription>
                    <IdsWhatsNewLink />
                </IdsWhatsNewDescription>
                <IdsWhatsNewShowMore />
                <IdsWhatsNewImages>
                    <IdsWhatsNewImage />
                </IdsWhatsNewImages>
            </IdsWhatsNewSection>
        </IdsWhatsNewSectionsScroll>
    </IdsWhatsNewBody>
    <IdsWhatsNewFooter />
</IdsWhatsNew>""",
        "file": "whats-new/IdsWhatsNew.tsx",
        "interface": "IdsWhatsNewProps",
    },
    {
        "component": "Wizard",
        "hierarchy": """<IdsWizard>
    <IdsWizardHeader>
        <IdsWizardHeaderTitle />
        <IdsWizardCloseAction />
    </IdsWizardHeader>
    <IdsWizardBody>
        <IdsWizardStepsPane>
            <IdsWizardStepItem>
                <IdsWizardStepLabel />
                <IdsWizardStepStatusIndicator />
                <IdsWizardSubstepList>
                    <IdsWizardSubstepItem />
                </IdsWizardSubstepList>
            </IdsWizardStepItem>
        </IdsWizardStepsPane>
        <IdsWizardContentPane>
            <IdsWizardPageTitle />
            <IdsWizardPageContent />
            <IdsWizardFooter>
                <IdsWizardProgressLabel />
                <IdsWizardFooterActions>
                    <IdsWizardCancelButton />
                    <IdsWizardPreviousButton />
                    <IdsWizardPrimaryButton />
                </IdsWizardFooterActions>
            </IdsWizardFooter>
        </IdsWizardContentPane>
    </IdsWizardBody>
</IdsWizard>""",
        "file": "wizard/IdsWizard.tsx",
        "interface": "IdsWizardProps",
    },
]

# Standard DOM/HTML passthrough props — listed separately, not duplicated as outputs
HTML_PASSTHROUGH = {
    "onClick",
    "onChange",
    "onBlur",
    "onFocus",
    "onKeyDown",
    "onKeyUp",
    "onMouseDown",
    "onMouseUp",
    "onMouseEnter",
    "onMouseLeave",
    "onSubmit",
    "onInput",
}


def extract_interface_body(content: str, interface_name: str) -> str | None:
    marker = f"export interface {interface_name}"
    start = content.find(marker)
    if start < 0:
        return None
    brace = content.find("{", start)
    if brace < 0:
        return None
    depth = 0
    for idx in range(brace, len(content)):
        ch = content[idx]
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                return content[brace + 1 : idx]
    return None


def parse_props(body: str) -> list[tuple[str, str]]:
    """Return (name, type) pairs from interface body."""
    props: list[tuple[str, str]] = []
    if not body:
        return props

    # Strip block comments
    body = re.sub(r"/\*[\s\S]*?\*/", "", body)
    lines: list[str] = []
    for raw in body.splitlines():
        line = raw.strip()
        if not line or line.startswith("//"):
            continue
        lines.append(line)

    buf = ""
    for line in lines:
        buf += " " + line
        if ";" in line or line.endswith("}"):
            chunk = buf.strip()
            buf = ""
            if not chunk or chunk.startswith("extends "):
                continue
            m = re.match(r"^(\w+)(\?)?:\s*(.+?);?\s*$", chunk)
            if m:
                name, _opt, typ = m.group(1), m.group(2), m.group(3).rstrip(";")
                typ = re.sub(r"\s+", " ", typ).strip()
                props.append((name, typ))
    return props


def split_input_output(props: list[tuple[str, str]]) -> tuple[list[str], list[str]]:
    inputs: list[str] = []
    outputs: list[str] = []
    for name, typ in props:
        entry = f"{name}: {typ}"
        if name.startswith("on") and name not in HTML_PASSTHROUGH:
            outputs.append(entry)
        elif name.startswith("on") and name in HTML_PASSTHROUGH:
            outputs.append(f"{entry}  (DOM passthrough)")
        else:
            inputs.append(entry)
    return inputs, outputs


def extract_type_object_body(content: str, type_name: str) -> str | None:
    """Extract body from `export type Name = { ... }` or `type Name = { ... }`."""
    for prefix in (f"export type {type_name}", f"type {type_name}"):
        start = content.find(prefix)
        if start < 0:
            continue
        brace = content.find("{", start)
        if brace < 0:
            continue
        depth = 0
        for idx in range(brace, len(content)):
            ch = content[idx]
            if ch == "{":
                depth += 1
            elif ch == "}":
                depth -= 1
                if depth == 0:
                    return content[brace + 1 : idx]
    return None


def load_props(
    relative_file: str,
    interface_name: str,
    *,
    extra_types: list[str] | None = None,
    notes: str | None = None,
) -> tuple[list[str], list[str]]:
    path = LIB_IDS / relative_file
    if not path.is_file():
        return [], [f"(missing file: {relative_file})"]
    content = path.read_text(encoding="utf-8")

    props: list[tuple[str, str]] = []
    seen: set[str] = set()

    for name in [interface_name, *(extra_types or [])]:
        body = extract_interface_body(content, name)
        if body is None:
            body = extract_type_object_body(content, name)
        if body is None:
            continue
        for prop_name, typ in parse_props(body):
            if prop_name not in seen:
                seen.add(prop_name)
                props.append((prop_name, typ))

    if not props:
        return [], [f"(interface/type {interface_name} not found)"]

    inputs, outputs = split_input_output(props)
    if notes:
        inputs = [notes, *inputs]
    return inputs, outputs


def format_prop_list(items: list[str]) -> str:
    return "\n".join(items) if items else "—"


def build_workbook(rows: list[tuple[str, str, str, str]]) -> Workbook:
    wb = Workbook()
    ws = wb.active
    ws.title = "IDS Lib Components"

    headers = ["Component", "Hierarchy", "Input (Properties)", "Output (Events/Callbacks)"]
    header_fill = PatternFill("solid", fgColor="1F4E79")
    header_font = Font(bold=True, color="FFFFFF", size=11)

    for col, title in enumerate(headers, start=1):
        cell = ws.cell(row=1, column=col, value=title)
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)

    wrap = Alignment(vertical="top", wrap_text=True)
    mono = Font(name="Consolas", size=10)

    for row_idx, (component, hierarchy, inputs, outputs) in enumerate(rows, start=2):
        ws.cell(row=row_idx, column=1, value=component).alignment = wrap
        h_cell = ws.cell(row=row_idx, column=2, value=hierarchy)
        h_cell.alignment = wrap
        h_cell.font = mono
        ws.cell(row=row_idx, column=3, value=inputs).alignment = wrap
        ws.cell(row=row_idx, column=4, value=outputs).alignment = wrap

    ws.freeze_panes = "A2"
    ws.auto_filter.ref = f"A1:D{ws.max_row}"

    widths = [22, 56, 48, 40]
    for idx, width in enumerate(widths, start=1):
        ws.column_dimensions[get_column_letter(idx)].width = width

    for row in range(2, ws.max_row + 1):
        hierarchy_lines = str(ws.cell(row=row, column=2).value or "").count("\n") + 1
        input_lines = str(ws.cell(row=row, column=3).value or "").count("\n") + 1
        output_lines = str(ws.cell(row=row, column=4).value or "").count("\n") + 1
        ws.row_dimensions[row].height = min(400, max(60, max(hierarchy_lines, input_lines, output_lines) * 14))

    meta = wb.create_sheet("_meta")
    meta["A1"] = "Source"
    meta["B1"] = str(LIB_IDS)
    meta["A2"] = "Generated by"
    meta["B2"] = "scripts/generate_lib_ids_component_catalog_xlsx.py"
    meta.sheet_state = "hidden"

    return wb


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate IDS lib component catalog Excel")
    parser.add_argument(
        "-o",
        "--output",
        default=str(REPO_ROOT / "docs" / "lib-ids-component-catalog.xlsx"),
        help="Output .xlsx path",
    )
    args = parser.parse_args()
    out_path = Path(args.output)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    rows: list[tuple[str, str, str, str]] = []
    for entry in CATALOG:
        inputs, outputs = load_props(
            entry["file"],
            entry["interface"],
            extra_types=entry.get("extra_types"),
            notes=entry.get("notes"),
        )
        rows.append(
            (
                entry["component"],
                entry["hierarchy"],
                format_prop_list(inputs),
                format_prop_list(outputs),
            )
        )

    wb = build_workbook(rows)
    wb.save(out_path)
    print(f"Wrote {len(rows)} components → {out_path}")


if __name__ == "__main__":
    main()

import { useState, type ComponentProps } from "react";
import { IdsDataGrid, type IdsDataGridTreeNode, type IdsDataGridView } from "./IdsDataGrid";
import {
  IdsDataGridDefaultStoryHost,
  type IdsDataGridDefaultStoryHostProps,
} from "./IdsDataGridDefaultStoryHost";
import { SegmentedButton } from "./SegmentedButton";

export type IdsDataGridViewModeStoryHostProps = Omit<
  ComponentProps<typeof IdsDataGrid>,
  "viewMode"
> &
  Pick<IdsDataGridDefaultStoryHostProps, "numericUnitOptions"> & {
    /** Tree hierarchy used when view mode is `treeview`. */
    treeNodes: IdsDataGridTreeNode[];
    defaultViewMode?: IdsDataGridView;
  };

/**
 * Storybook host: IDS Segmented Button toggles table vs treeview on one datagrid instance.
 */
export function IdsDataGridViewModeStoryHost({
  treeNodes,
  defaultViewMode = "table",
  numericUnitOptions,
  ...gridProps
}: IdsDataGridViewModeStoryHostProps) {
  const [viewMode, setViewMode] = useState<IdsDataGridView>(defaultViewMode);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, height: "100%", minHeight: 0 }}>
      <div style={{ display: "flex", justifyContent: "flex-end", flexShrink: 0 }}>
        <SegmentedButton
          type="text"
          ariaLabel="Datagrid view mode"
          value={viewMode}
          onChange={(next) => setViewMode(next as IdsDataGridView)}
          items={[
            { value: "table", label: "Table" },
            { value: "treeview", label: "Treeview" },
          ]}
        />
      </div>
      <div style={{ flex: 1, minHeight: 0, minWidth: 0, display: "flex", flexDirection: "column" }}>
        {viewMode === "table" ? (
          <IdsDataGridDefaultStoryHost
            {...gridProps}
            viewMode="table"
            numericUnitOptions={numericUnitOptions}
          />
        ) : (
          <IdsDataGrid {...gridProps} viewMode="treeview" treeNodes={treeNodes} />
        )}
      </div>
    </div>
  );
}

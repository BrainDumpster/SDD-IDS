export type IdsDataGridNumericOperator =
  | "all"
  | "equals"
  | "not-equals"
  | "greater-than"
  | "greater-than-equal"
  | "less-than"
  | "less-than-equal"
  | "between";

export interface IdsDataGridNumericFilterState {
  operator: IdsDataGridNumericOperator;
  value?: string;
  valueEnd?: string;
  unit?: string;
  unitEnd?: string;
}

export const IDS_DATAGRID_NUMERIC_OPERATOR_LABELS: Record<IdsDataGridNumericOperator, string> = {
  all: "All",
  equals: "Equals",
  "not-equals": "Does not equal",
  "greater-than": "Greater than",
  "greater-than-equal": "Greater than equal to",
  "less-than": "Less than",
  "less-than-equal": "Less than equal to",
  between: "Between",
};

export function defaultIdsDataGridNumericFilterState(): IdsDataGridNumericFilterState {
  return {
    operator: "all",
    value: "",
    valueEnd: "",
    unit: undefined,
    unitEnd: undefined,
  };
}

export function isIdsDataGridNumericFilterActive(
  state: IdsDataGridNumericFilterState,
): boolean {
  if (state.operator === "all") return false;
  if (state.operator === "between") {
    return Boolean(state.value?.trim()) || Boolean(state.valueEnd?.trim());
  }
  return Boolean(state.value?.trim());
}

function parseNumericInput(raw: string | undefined): number | null {
  const trimmed = raw?.trim() ?? "";
  if (!trimmed) return null;
  const n = Number(trimmed.replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
}

function parseCellNumber(cell: unknown): number | null {
  if (typeof cell === "number" && Number.isFinite(cell)) return cell;
  const n = parseNumericInput(String(cell ?? ""));
  return n;
}

/** Applies numeric filter to a single cell value (column filter model). */
export function matchesIdsDataGridNumericFilter(
  cellValue: unknown,
  state: IdsDataGridNumericFilterState,
): boolean {
  if (!isIdsDataGridNumericFilterActive(state)) return true;

  const cell = parseCellNumber(cellValue);
  if (cell === null) return false;

  const primary = parseNumericInput(state.value);
  const secondary = parseNumericInput(state.valueEnd);

  switch (state.operator) {
    case "equals":
      return primary !== null && cell === primary;
    case "not-equals":
      return primary !== null && cell !== primary;
    case "greater-than":
      return primary !== null && cell > primary;
    case "greater-than-equal":
      return primary !== null && cell >= primary;
    case "less-than":
      return primary !== null && cell < primary;
    case "less-than-equal":
      return primary !== null && cell <= primary;
    case "between": {
      const hasStart = primary !== null;
      const hasEnd = secondary !== null;
      if (!hasStart && !hasEnd) return true;
      if (hasStart && hasEnd) {
        const lo = Math.min(primary, secondary);
        const hi = Math.max(primary, secondary);
        return cell >= lo && cell <= hi;
      }
      if (hasStart) return cell >= primary!;
      return cell <= secondary!;
    }
    default:
      return true;
  }
}

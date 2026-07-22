import type { GridStack } from 'gridstack';

/**
 * Widget data structure for DynamicDashboard
 */
export interface DynamicDashboardWidget {
  /** Unique identifier for the widget */
  id: string;
  /** Display name of the widget */
  name: string;
  /** Horizontal position in the grid (0-indexed, 0-11 for 12-column grid) */
  x: number;
  /** Vertical position in the grid (0-indexed) */
  y: number;
  /** Width in columns (1-6) */
  w: number;
  /** Height in rows (default 1) */
  h?: number;
  /** Minimum width in columns (default 1) */
  minW?: number;
  /** Maximum width in columns (default 6) */
  maxW?: number;
  /** Minimum height in rows (default 1) */
  minH?: number;
  /** Maximum height in rows (default 12) */
  maxH?: number;
  /** Whether the widget can be moved (default false - editing disabled for now) */
  noMove?: boolean;
  /** Whether the widget can be resized (default false - editing disabled for now) */
  noResize?: boolean;
  /** Whether the widget can be dragged (default false - editing disabled for now) */
  locked?: boolean;
  /** Menu options for the tile title bar overflow menu */
  menuOptions?: TileMenuOption[];
  /** Footer buttons for the tile */
  footerButtons?: TileFooterButton[];
}

/**
 * Menu option for tile title bar overflow menu
 */
export interface TileMenuOption {
  /** Unique identifier for the menu option */
  id: string;
  /** Display label for the menu option */
  label: string;
  /** Callback when menu option is clicked */
  onClick: () => void;
}

/**
 * Footer button for tile footer
 */
export interface TileFooterButton {
  /** Unique identifier for the button */
  id: string;
  /** Display label for the button */
  label: string;
  /** Callback when button is clicked */
  onClick: () => void;
  /** Button variant (default 'secondary') */
  variant?: 'primary' | 'secondary' | 'tertiary';
}

/**
 * GridStack options passed through to GridStack
 */
export interface DynamicDashboardOptions {
  /** Number of columns in the grid (default 12) */
  column?: number;
  /** Responsive column configuration for different breakpoints */
  responsiveColumns?: {
    /** Column count for mobile screens (< 768px) */
    mobile?: number;
    /** Column count for tablet screens (768px - 1024px) */
    tablet?: number;
    /** Column count for desktop screens (> 1024px) */
    desktop?: number;
  };
  /** Row height in pixels (default 'auto') */
  rowHeight?: number | 'auto';
  /** Gap between widgets in pixels (default 10) */
  margin?: number | string;
  /** Whether widgets can be moved (default false) */
  float?: boolean;
  /** Whether to animate changes (default false) */
  animate?: boolean;
  /** Whether to allow widgets to overlap (default false) */
  disableOneColumnMode?: boolean;
  /** Whether to disable dragging (default true - editing disabled for now) */
  disableDrag?: boolean;
  /** Whether to disable resizing (default true - editing disabled for now) */
  disableResize?: boolean;
  /** RTL layout (default false) */
  rtl?: boolean;
  /** Minimum row count (default 0) */
  minRow?: number;
  /** Maximum row count (default 0 = unlimited) */
  maxRow?: number;
}

/**
 * Event handlers for DynamicDashboard
 */
export interface DynamicDashboardHandlers {
  /** Fired when a widget is added */
  onAdd?: (widget: DynamicDashboardWidget, grid: GridStack) => void;
  /** Fired when a widget is removed */
  onRemove?: (widget: DynamicDashboardWidget, grid: GridStack) => void;
  /** Fired when a widget is moved */
  onChange?: (widgets: DynamicDashboardWidget[], grid: GridStack) => void;
  /** Fired when a widget is resized */
  onResize?: (widget: DynamicDashboardWidget, grid: GridStack) => void;
  /** Fired when dragging starts */
  onDragStart?: (event: Event, widget: DynamicDashboardWidget) => void;
  /** Fired when dragging ends */
  onDragStop?: (event: Event, widget: DynamicDashboardWidget) => void;
  /** Fired when resizing starts */
  onResizeStart?: (event: Event, widget: DynamicDashboardWidget) => void;
  /** Fired when resizing ends */
  onResizeStop?: (event: Event, widget: DynamicDashboardWidget) => void;
  /** Fired when the selected widget changes (clicking a tile selects it; only one at a time) */
  onSelectionChange?: (widgetId: string | null) => void;
}

/**
 * Props for DynamicDashboard component
 */
export interface DynamicDashboardProps {
  /** Array of widgets to display */
  widgets: DynamicDashboardWidget[];
  /** GridStack options */
  options?: DynamicDashboardOptions;
  /** Event handlers */
  handlers?: DynamicDashboardHandlers;
  /** CSS class name */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

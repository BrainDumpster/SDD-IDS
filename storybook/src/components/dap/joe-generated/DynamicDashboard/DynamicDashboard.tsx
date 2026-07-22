import React, { useEffect, useRef, useState } from 'react';
import { GridStack } from 'gridstack';
import 'gridstack/dist/gridstack.min.css';
import './DynamicDashboard.css';
import { DynamicDashboardProps, DynamicDashboardWidget } from './types';
import { Tile } from './Tile';

/**
 * DynamicDashboard component - Container-style component for draggable/resizable widgets
 * Uses GridStack internally for 12-column grid layout
 */
/** Convert DynamicDashboardWidget[] into the shape expected by GridStack.load() */
const toGridWidgets = (widgets: DynamicDashboardWidget[]) =>
  widgets.map(widget => ({
    id: widget.id,
    x: widget.x,
    y: widget.y,
    w: widget.w,
    h: widget.h || 1,
    minW: widget.minW || 1,
    maxW: widget.maxW || 6,
    minH: widget.minH || 1,
    maxH: widget.maxH || 12,
    noMove: widget.noMove !== undefined ? widget.noMove : true,
    noResize: widget.noResize !== undefined ? widget.noResize : true,
    locked: widget.locked !== undefined ? widget.locked : true,
  }));

export const DynamicDashboard: React.FC<DynamicDashboardProps> = ({
  widgets,
  options = {},
  handlers = {},
  className,
  style,
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const gridStackRef = useRef<GridStack | null>(null);
  const columnCountRef = useRef<number>(options.column || 12);
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);

  const handleTileSelect = (widgetId: string) => {
    setSelectedWidgetId((prev) => {
      const next = prev === widgetId ? prev : widgetId;
      if (next !== prev) handlersRef.current.onSelectionChange?.(next);
      return next;
    });
  };

  // Keep latest widgets/handlers/options available to closures registered once at init,
  // so the grid does not need to be destroyed/recreated on every render.
  const widgetsRef = useRef<DynamicDashboardWidget[]>(widgets);
  const handlersRef = useRef<typeof handlers>(handlers);
  const optionsRef = useRef<typeof options>(options);
  widgetsRef.current = widgets;
  handlersRef.current = handlers;
  optionsRef.current = options;

  // Determine column count based on screen size
  const getColumnCountForScreenSize = () => {
    const opts = optionsRef.current;
    if (opts.responsiveColumns) {
      const width = window.innerWidth;
      if (width < 768) {
        return opts.responsiveColumns.mobile || opts.column || 12;
      } else if (width < 1024) {
        return opts.responsiveColumns.tablet || opts.column || 12;
      } else {
        return opts.responsiveColumns.desktop || opts.column || 12;
      }
    }
    return opts.column || 12;
  };

  // Initialize GridStack once on mount
  useEffect(() => {
    if (!gridRef.current) return;

    const initialColumnCount = getColumnCountForScreenSize();
    columnCountRef.current = initialColumnCount;

    const gridStack = GridStack.init({
      column: initialColumnCount,
      cellHeight: optionsRef.current.rowHeight || 'auto',
      margin: optionsRef.current.margin || 16,
      float: optionsRef.current.float || false,
      animate: optionsRef.current.animate || false,
      disableDrag: optionsRef.current.disableDrag !== undefined ? optionsRef.current.disableDrag : true,
      disableResize: optionsRef.current.disableResize !== undefined ? optionsRef.current.disableResize : true,
      // Restrict the drag handle to the tile's title bar only (default is the
      // whole .grid-stack-item-content, which would let dragging start from
      // anywhere on the tile, including the body/footer).
      handle: '.tile-header',
      rtl: optionsRef.current.rtl || false,
      minRow: optionsRef.current.minRow || 0,
      maxRow: optionsRef.current.maxRow || 0,
    }, gridRef.current);

    gridStackRef.current = gridStack;

    gridStack.load(toGridWidgets(widgetsRef.current));

    // Setup event handlers - always read the latest handler/widget refs at call time
    gridStack.on('added', (event, items) => {
      const onAddHandler = handlersRef.current.onAdd;
      if (!onAddHandler) return;
      items.forEach(item => {
        const widget = widgetsRef.current.find(w => w.id === item.id);
        if (widget) onAddHandler(widget, gridStack);
      });
    });

    gridStack.on('removed', (event, items) => {
      const onRemoveHandler = handlersRef.current.onRemove;
      if (!onRemoveHandler) return;
      items.forEach(item => {
        const widget = widgetsRef.current.find(w => w.id === item.id);
        if (widget) onRemoveHandler(widget, gridStack);
      });
    });

    gridStack.on('change', (event, items) => {
      const onChangeHandler = handlersRef.current.onChange;
      if (!onChangeHandler) return;
      const updatedWidgets: DynamicDashboardWidget[] = [];
      items.forEach(item => {
        const widget = widgetsRef.current.find(w => w.id === item.id);
        if (widget) {
          updatedWidgets.push({
            ...widget,
            x: item.x || 0,
            y: item.y || 0,
            w: item.w || 1,
            h: item.h || 1,
          });
        }
      });
      onChangeHandler(updatedWidgets, gridStack);
    });

    gridStack.on('dragstart', (event, item) => {
      const onDragStartHandler = handlersRef.current.onDragStart;
      if (!onDragStartHandler) return;
      const widget = widgetsRef.current.find(w => w.id === item.id);
      if (widget) onDragStartHandler(event, widget);
    });

    gridStack.on('dragstop', (event, item) => {
      const onDragStopHandler = handlersRef.current.onDragStop;
      if (!onDragStopHandler) return;
      const widget = widgetsRef.current.find(w => w.id === item.id);
      if (widget) onDragStopHandler(event, widget);
    });

    gridStack.on('resizestart', (event, item) => {
      const onResizeStartHandler = handlersRef.current.onResizeStart;
      if (!onResizeStartHandler) return;
      const widget = widgetsRef.current.find(w => w.id === item.id);
      if (widget) onResizeStartHandler(event, widget);
    });

    gridStack.on('resizestop', (event, item) => {
      const widget = widgetsRef.current.find(w => w.id === item.id);
      if (!widget) return;
      handlersRef.current.onResize?.(widget, gridStack);
      handlersRef.current.onResizeStop?.(event, widget);
    });

    return () => {
      // Pass `false` to avoid GridStack removing the container element from
      // the DOM on cleanup. React (especially StrictMode, which mounts,
      // cleans up, and remounts effects once in dev) owns this element's
      // lifecycle; removing it here would leave a detached node with
      // clientWidth 0 for the next GridStack.init() call.
      gridStack.destroy(false);
      gridStackRef.current = null;
    };
  }, []); // Initialize once on mount only

  // Update widgets when they change
  useEffect(() => {
    if (gridStackRef.current) {
      gridStackRef.current.load(toGridWidgets(widgets));
    }
  }, [widgets]);

  // Sync dynamic option changes without a full re-init
  useEffect(() => {
    if (!gridStackRef.current) return;
    gridStackRef.current.margin(options.margin ?? 16);
  }, [options.margin]);

  useEffect(() => {
    if (!gridStackRef.current) return;
    const disableDrag = options.disableDrag !== undefined ? options.disableDrag : true;
    gridStackRef.current.enableMove(!disableDrag);
  }, [options.disableDrag]);

  useEffect(() => {
    if (!gridStackRef.current) return;
    const disableResize = options.disableResize !== undefined ? options.disableResize : true;
    gridStackRef.current.enableResize(!disableResize);
  }, [options.disableResize]);

  // Handle column count changes, both from window resize and from prop changes
  useEffect(() => {
    const updateColumnCount = () => {
      const newColumnCount = getColumnCountForScreenSize();
      if (newColumnCount !== columnCountRef.current && gridStackRef.current) {
        columnCountRef.current = newColumnCount;
        gridStackRef.current.column(newColumnCount);
        gridStackRef.current.compact();
      }
    };

    updateColumnCount();
    window.addEventListener('resize', updateColumnCount);
    return () => window.removeEventListener('resize', updateColumnCount);
  }, [options.column, options.responsiveColumns]);

  // GridStack tiles are position:absolute against `.grid-stack`, so padding
  // placed directly on `.grid-stack` has no visual effect (their containing
  // block is the padding box). To get a real outer gutter, the padding has
  // to live on this normal-flow wrapper *outside* `.grid-stack`. IMPORTANT:
  // every tile (including the outermost ones) is ALSO inset from its own
  // cell by the `margin` option (see .grid-stack-item-content in
  // DynamicDashboard.css) - that inset stacks on top of this wrapper's
  // padding for the outermost tiles. So this wrapper's padding must be
  // (desired outer gap - margin option) to land on the correct total, e.g.
  // for a 16px outer gutter with margin: 8, padding here should be 8px
  // (8 wrapper + 8 tile-margin = 16 total).
  return (
    <div className={`grid-stack-outer ${className || ''}`} style={style}>
      <div
        ref={gridRef}
        className="grid-stack"
        style={{
          width: '100%',
          minHeight: '400px',
        }}
      >
        {widgets.map((widget) => (
          <Tile
            key={widget.id}
            id={widget.id}
            name={widget.name}
            menuOptions={widget.menuOptions}
            footerButtons={widget.footerButtons}
            selected={selectedWidgetId === widget.id}
            onSelect={() => handleTileSelect(widget.id)}
            style={{
              gridColumn: `span ${widget.w}`,
            }}
          >
            {/* Widget content - widgets are responsible for their own data */}
            <div style={{ padding: '16px' }}>
              <p style={{ color: '#4d4d4d', fontSize: '14px' }}>
                Widget data loaded by: {widget.name}
              </p>
            </div>
          </Tile>
        ))}
      </div>
    </div>
  );
};

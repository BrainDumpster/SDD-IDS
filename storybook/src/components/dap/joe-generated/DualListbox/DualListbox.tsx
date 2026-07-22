import React, { useState } from "react";
import "./DualListbox.css";

export interface DualListBoxItem {
  id: string;
  name: string;
  description?: string;
}

export interface DualListBoxProps {
  availableItems: DualListBoxItem[];
  selectedItems: DualListBoxItem[];
  availableTitle?: string;
  selectedTitle?: string;
  availablePlaceholder?: string;
  selectedPlaceholder?: string;
  showMetrics?: boolean;
  onItemsChange?: (detail: { available: DualListBoxItem[]; selected: DualListBoxItem[] }) => void;
  ariaLabel?: string;
}

const DualListBox: React.FC<DualListBoxProps> = ({
  availableItems,
  selectedItems,
  availableTitle = "Available",
  selectedTitle = "Selected",
  availablePlaceholder = "Select items on the right to move",
  selectedPlaceholder = "Select items on the left to move",
  showMetrics = true,
  onItemsChange,
  ariaLabel = "Dual list box",
}) => {
  const [availableSelection, setAvailableSelection] = useState<Set<string>>(new Set());
  const [selectedSelection, setSelectedSelection] = useState<Set<string>>(new Set());

  const handleMoveSelectedRight = () => {
    const itemsToMove = availableItems.filter((item) => availableSelection.has(item.id));
    const newAvailable = availableItems.filter((item) => !availableSelection.has(item.id));
    const newSelected = [...selectedItems, ...itemsToMove];
    setAvailableSelection(new Set());
    onItemsChange?.({ available: newAvailable, selected: newSelected });
  };

  const handleMoveAllRight = () => {
    const newAvailable: DualListBoxItem[] = [];
    const newSelected = [...selectedItems, ...availableItems];
    setAvailableSelection(new Set());
    onItemsChange?.({ available: newAvailable, selected: newSelected });
  };

  const handleMoveSelectedLeft = () => {
    const itemsToMove = selectedItems.filter((item) => selectedSelection.has(item.id));
    const newSelected = selectedItems.filter((item) => !selectedSelection.has(item.id));
    const newAvailable = [...availableItems, ...itemsToMove];
    setSelectedSelection(new Set());
    onItemsChange?.({ available: newAvailable, selected: newSelected });
  };

  const handleMoveAllLeft = () => {
    const newSelected: DualListBoxItem[] = [];
    const newAvailable = [...availableItems, ...selectedItems];
    setSelectedSelection(new Set());
    onItemsChange?.({ available: newAvailable, selected: newSelected });
  };

  const toggleAvailableSelection = (id: string) => {
    setAvailableSelection((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleSelectedSelection = (id: string) => {
    setSelectedSelection((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const renderChevron = (direction: "left" | "right", double = false) => (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      {double ? (
        <>
          <path
            d={direction === "right" ? "M5 3L9 7L5 11" : "M7 3L3 7L7 11"}
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={direction === "right" ? "M9 3L13 7L9 11" : "M11 3L7 7L11 11"}
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <path
          d={direction === "right" ? "M5 3L9 7L5 11" : "M7 3L3 7L7 11"}
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );

  const renderDragHandle = () => (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 6H13M3 10H13" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );

  const renderCheck = () => (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 8L6 11L13 4" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <div className="dual-listbox" role="group" aria-label={ariaLabel}>
      <div className="dual-listbox__lists-parent">
        {/* Available Pane */}
        <div className="dual-listbox__pane">
          <div className="dual-listbox__pane-header">
            <span className="dual-listbox__pane-title">{availableTitle}</span>
            {showMetrics && (
              <span className="dual-listbox__metrics">Total: {availableItems.length}</span>
            )}
          </div>
          <div className="dual-listbox__list-group">
            {availableItems.length === 0 ? (
              <div className="dual-listbox__empty">{availablePlaceholder}</div>
            ) : (
              availableItems.map((item) => (
                <div
                  key={item.id}
                  className={`dual-listbox__item ${availableSelection.has(item.id) ? "dual-listbox__item--selected" : ""}`}
                  onClick={() => toggleAvailableSelection(item.id)}
                  role="option"
                  aria-selected={availableSelection.has(item.id)}
                >
                  <span className="dual-listbox__drag-handle">{renderDragHandle()}</span>
                  <div className="dual-listbox__item-content">
                    <span className="dual-listbox__item-name">{item.name}</span>
                    {item.description && (
                      <span className="dual-listbox__item-description">{item.description}</span>
                    )}
                  </div>
                  {availableSelection.has(item.id) && (
                    <span className="dual-listbox__check">{renderCheck()}</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Transfer Buttons */}
        <div className="dual-listbox__transfer-buttons">
          <button
            type="button"
            className="dual-listbox__transfer-button"
            onClick={handleMoveAllRight}
            disabled={availableItems.length === 0}
            aria-label="Move all to selected"
            title="Move all to selected"
          >
            {renderChevron("right", true)}
          </button>
          <button
            type="button"
            className="dual-listbox__transfer-button"
            onClick={handleMoveSelectedRight}
            disabled={availableSelection.size === 0}
            aria-label="Move selected to selected"
            title="Move selected to selected"
          >
            {renderChevron("right")}
          </button>
          <button
            type="button"
            className="dual-listbox__transfer-button"
            onClick={handleMoveSelectedLeft}
            disabled={selectedSelection.size === 0}
            aria-label="Move selected to available"
            title="Move selected to available"
          >
            {renderChevron("left")}
          </button>
          <button
            type="button"
            className="dual-listbox__transfer-button"
            onClick={handleMoveAllLeft}
            disabled={selectedItems.length === 0}
            aria-label="Move all to available"
            title="Move all to available"
          >
            {renderChevron("left", true)}
          </button>
        </div>

        {/* Selected Pane */}
        <div className="dual-listbox__pane">
          <div className="dual-listbox__pane-header">
            <span className="dual-listbox__pane-title">{selectedTitle}</span>
            {showMetrics && (
              <span className="dual-listbox__metrics">Total: {selectedItems.length}</span>
            )}
          </div>
          <div className="dual-listbox__list-group">
            {selectedItems.length === 0 ? (
              <div className="dual-listbox__empty">{selectedPlaceholder}</div>
            ) : (
              selectedItems.map((item) => (
                <div
                  key={item.id}
                  className={`dual-listbox__item ${selectedSelection.has(item.id) ? "dual-listbox__item--selected" : ""}`}
                  onClick={() => toggleSelectedSelection(item.id)}
                  role="option"
                  aria-selected={selectedSelection.has(item.id)}
                >
                  <span className="dual-listbox__drag-handle">{renderDragHandle()}</span>
                  <div className="dual-listbox__item-content">
                    <span className="dual-listbox__item-name">{item.name}</span>
                    {item.description && (
                      <span className="dual-listbox__item-description">{item.description}</span>
                    )}
                  </div>
                  {selectedSelection.has(item.id) && (
                    <span className="dual-listbox__check">{renderCheck()}</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DualListBox;

import React, { useState, useCallback } from "react";
import "./Tree.css";

export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  iconShape?: string;
  badgeCount?: number;
  showIcon?: boolean;
  showBadge?: boolean;
}

export interface TreeItemClickDetail {
  id: string;
  label: string;
  depth: number;
  parentId?: string;
  hasChildren: boolean;
  selected: boolean;
  path: string[];
}

export interface TreeProps {
  items?: TreeNode[];
  selectedId?: string;
  defaultSelectedId?: string;
  defaultExpandedIds?: string[];
  showIcon?: boolean;
  showBadge?: boolean;
  onTreeItemClick?: (detail: TreeItemClickDetail) => void;
  onExpandChange?: (id: string, expanded: boolean) => void;
}

const Tree: React.FC<TreeProps> = ({
  items,
  selectedId: controlledSelectedId,
  defaultSelectedId,
  defaultExpandedIds = [],
  showIcon = true,
  showBadge = true,
  onTreeItemClick,
  onExpandChange,
}) => {
  const [internalSelectedId, setInternalSelectedId] = useState(defaultSelectedId);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(defaultExpandedIds));
  const isControlled = controlledSelectedId !== undefined;
  const selectedId = isControlled ? controlledSelectedId : internalSelectedId;

  const handleNodeClick = useCallback((node: TreeNode, depth: number, parentId?: string, path: string[] = []) => {
    if (!isControlled) {
      setInternalSelectedId(node.id);
    }

    const detail: TreeItemClickDetail = {
      id: node.id,
      label: node.label,
      depth,
      parentId,
      hasChildren: !!node.children && node.children.length > 0,
      selected: true,
      path,
    };

    onTreeItemClick?.(detail);
  }, [isControlled, onTreeItemClick]);

  const handleExpandToggle = useCallback((nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
        onExpandChange?.(nodeId, false);
      } else {
        newSet.add(nodeId);
        onExpandChange?.(nodeId, true);
      }
      return newSet;
    });
  }, [onExpandChange]);

  const getIndentation = (depth: number): number => {
    const indentations = [16, 36, 56, 76, 96, 116, 136];
    return indentations[Math.min(depth, indentations.length - 1)] || 16;
  };

  const renderNode = (node: TreeNode, depth: number = 0, parentId?: string, path?: string[]): React.ReactNode => {
    const isExpanded = expandedIds.has(node.id);
    const isSelected = selectedId === node.id;
    const hasChildren = node.children && node.children.length > 0;
    const currentPath = [...(path || []), node.id];
    const shouldShowIcon = node.showIcon !== undefined ? node.showIcon : showIcon;
    const shouldShowBadge = node.showBadge !== undefined ? node.showBadge : showBadge;
    const nodeBadgeCount = node.badgeCount;

    return (
      <div key={node.id} className="tree">
        <div
          className={`tree__row ${isSelected ? "tree__row--selected" : ""}`}
          style={{ paddingLeft: `${getIndentation(depth)}px` }}
          role="treeitem"
          aria-expanded={hasChildren ? isExpanded : undefined}
          aria-selected={isSelected}
          aria-level={depth + 1}
          onClick={() => handleNodeClick(node, depth, parentId, currentPath)}
        >
          <button
            type="button"
            className={`tree__chevron ${!hasChildren ? "tree__chevron--hidden" : ""}`}
            onClick={(e) => handleExpandToggle(node.id, e)}
            aria-label={isExpanded ? "Collapse" : "Expand"}
            aria-hidden={!hasChildren}
            tabIndex={!hasChildren ? -1 : undefined}
          >
            <svg width={12} height={12} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 4L6 8L9 4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {shouldShowIcon && (
            <div className="tree__icon">
              <svg width={12} height={12} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 3L6 1L10 3V9C10 9.53043 9.78929 10.0391 9.41421 10.4142C9.03914 10.7893 8.53043 11 8 11H4C3.46957 11 2.96086 10.7893 2.58579 10.4142C2.21071 10.0391 2 9.53043 2 9V3Z" stroke="currentColor" strokeWidth={1} />
              </svg>
            </div>
          )}
          <div className="tree__label-cluster">
            <span className="tree__label" title={node.label}>{node.label}</span>
            {shouldShowBadge && nodeBadgeCount !== undefined && nodeBadgeCount > 0 && (
              <span className="tree__badge">{nodeBadgeCount}</span>
            )}
          </div>
        </div>
        {hasChildren && isExpanded && node.children && (
          <div role="group">
            {node.children.map((child) => renderNode(child, depth + 1, node.id, currentPath))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="tree" role="tree" tabIndex={0}>
      {items && items.map((node) => renderNode(node))}
    </div>
  );
};

export default Tree;

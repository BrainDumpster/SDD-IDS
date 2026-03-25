import { Collapsible } from "@base-ui-components/react/collapsible";
import type { ReactNode } from "react";
import styles from "./Tree.module.css";

export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  icon?: ReactNode;
}

interface TreeProps {
  items: TreeNode[];
}

export function Tree({ items }: TreeProps) {
  return (
    <ul className={styles.root} role="tree">
      {items.map((item) => (
        <TreeItem key={item.id} node={item} level={0} />
      ))}
    </ul>
  );
}

function TreeItem({ node, level }: { node: TreeNode; level: number }) {
  const hasChildren = node.children && node.children.length > 0;

  if (!hasChildren) {
    return (
      <li
        className={styles.leaf}
        role="treeitem"
        style={{ paddingLeft: `calc(${level} * var(--spacing-space-20))` }}
      >
        {node.icon && <span className={styles.icon}>{node.icon}</span>}
        <span className={styles.label}>{node.label}</span>
      </li>
    );
  }

  return (
    <li role="treeitem" aria-expanded="false" className={styles.branch}>
      <Collapsible.Root>
        <Collapsible.Trigger
          className={(state) =>
            [
              styles.trigger,
              state.open ? styles.open : "",
            ]
              .filter(Boolean)
              .join(" ")
          }
          style={{ paddingLeft: `calc(${level} * var(--spacing-space-20))` }}
        >
          <ChevronIcon className={styles.chevron} />
          {node.icon && <span className={styles.icon}>{node.icon}</span>}
          <span className={styles.label}>{node.label}</span>
        </Collapsible.Trigger>
        <Collapsible.Panel>
          <ul className={styles.group} role="group">
            {node.children!.map((child) => (
              <TreeItem key={child.id} node={child} level={level + 1} />
            ))}
          </ul>
        </Collapsible.Panel>
      </Collapsible.Root>
    </li>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
    >
      <path
        d="M5 3L9 7L5 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

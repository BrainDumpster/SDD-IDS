import { Collapsible } from "@base-ui-components/react/collapsible";
import type { ComponentProps, ReactNode } from "react";
import styles from "./LeftNav.module.css";

interface NavItem {
  label: string;
  href: string;
  icon?: ReactNode;
  active?: boolean;
}

interface NavGroup {
  title: string;
  items: NavItem[];
  collapsible?: boolean;
}

interface LeftNavProps extends ComponentProps<"aside"> {
  groups: NavGroup[];
  collapsed?: boolean;
}

export function LeftNav({
  groups,
  collapsed = false,
  className,
  ...rest
}: LeftNavProps) {
  return (
    <aside
      className={[
        styles.nav,
        collapsed ? styles.collapsed : styles.expanded,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      <nav aria-label="Side navigation">
        {groups.map((group, gi) => (
          <NavGroupSection
            key={gi}
            group={group}
            collapsed={collapsed}
          />
        ))}
      </nav>
    </aside>
  );
}

function NavGroupSection({
  group,
  collapsed,
}: {
  group: NavGroup;
  collapsed: boolean;
}) {
  if (group.collapsible && !collapsed) {
    return (
      <Collapsible.Root defaultOpen className={styles.group}>
        <Collapsible.Trigger
          className={(state) =>
            [
              styles.groupTrigger,
              state.open ? styles.groupOpen : "",
            ]
              .filter(Boolean)
              .join(" ")
          }
        >
          <span className={styles.groupTitle}>{group.title}</span>
          <ChevronIcon className={styles.groupIcon} />
        </Collapsible.Trigger>
        <Collapsible.Panel className={styles.groupPanel}>
          <ul className={styles.itemList}>
            {group.items.map((item, i) => (
              <NavItemRow key={i} item={item} collapsed={collapsed} />
            ))}
          </ul>
        </Collapsible.Panel>
      </Collapsible.Root>
    );
  }

  return (
    <div className={styles.group}>
      {!collapsed && (
        <span className={styles.groupLabel}>{group.title}</span>
      )}
      <ul className={styles.itemList}>
        {group.items.map((item, i) => (
          <NavItemRow key={i} item={item} collapsed={collapsed} />
        ))}
      </ul>
    </div>
  );
}

function NavItemRow({
  item,
  collapsed,
}: {
  item: NavItem;
  collapsed: boolean;
}) {
  return (
    <li>
      <a
        href={item.href}
        className={[styles.link, item.active ? styles.linkActive : ""]
          .filter(Boolean)
          .join(" ")}
        aria-current={item.active ? "page" : undefined}
        title={collapsed ? item.label : undefined}
      >
        {item.icon && <span className={styles.icon}>{item.icon}</span>}
        {!collapsed && <span className={styles.label}>{item.label}</span>}
      </a>
    </li>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M4 6L8 10L12 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

import { Popover } from "@base-ui-components/react/popover";
import type { ReactNode } from "react";
import styles from "./AppLauncher.module.css";

interface AppItem {
  name: string;
  icon?: ReactNode;
  href?: string;
}

interface AppLauncherProps {
  apps: AppItem[];
}

export function AppLauncher({ apps }: AppLauncherProps) {
  return (
    <Popover.Root>
      <Popover.Trigger className={styles.trigger}>
        <GridIcon />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={8}>
          <Popover.Popup className={styles.popup}>
            <div className={styles.grid}>
              {apps.map((app, index) => {
                const content = (
                  <>
                    <span className={styles.appIcon}>
                      {app.icon || <DefaultAppIcon />}
                    </span>
                    <span className={styles.appName}>{app.name}</span>
                  </>
                );

                return app.href ? (
                  <a
                    key={index}
                    href={app.href}
                    className={styles.appTile}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {content}
                  </a>
                ) : (
                  <button
                    key={index}
                    type="button"
                    className={styles.appTile}
                  >
                    {content}
                  </button>
                );
              })}
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

function GridIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="3" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="12" y="3" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="3" y="12" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="12" y="12" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function DefaultAppIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

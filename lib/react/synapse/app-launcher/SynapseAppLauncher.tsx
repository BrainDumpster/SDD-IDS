/**
 * Synapse App Launcher — locks programme chrome already in IDS CSS.
 *
 * Strategy: wrapper.
 * IDS implementation: `lib/react/ids/app-launcher` (`programme="synapse"`).
 * Overlay CSS stays in IDS until those rules move here; do not add more
 * `[data-programme="synapse"]` branches to other IDS components.
 */
import type { IdsAppLauncherProps } from "../../ids/app-launcher";
import { IdsAppLauncher } from "../../ids/app-launcher";

export type SynapseAppLauncherProps = Omit<IdsAppLauncherProps, "programme">;

export function SynapseAppLauncher(props: SynapseAppLauncherProps) {
  return <IdsAppLauncher {...props} programme="synapse" />;
}

export default SynapseAppLauncher;

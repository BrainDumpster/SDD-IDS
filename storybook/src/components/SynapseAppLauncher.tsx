import { AppLauncher, type AppLauncherProps } from "./AppLauncher";

/** Synapse programme chrome for App Launcher (`13231:123761` / `13231:109521`). */
export function SynapseAppLauncher(props: Omit<AppLauncherProps, "programme">) {
  return <AppLauncher {...props} programme="synapse" />;
}

import { IdsWizard, type IdsWizardProps } from "./IdsWizard";

export type SynapseWizardProps = Omit<IdsWizardProps, "programme">;

/** Synapse programme wizard — modal shell uses `--modal-control-radius`; footer uses Synapse `Button`. */
export function SynapseWizard(props: SynapseWizardProps) {
  return <IdsWizard {...props} programme="synapse" />;
}

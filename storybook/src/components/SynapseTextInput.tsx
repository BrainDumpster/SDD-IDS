import { IdsTextBox, type IdsTextBoxProps } from "./IdsTextBox";

/** Synapse programme chrome for Text Input (`47833:47770`). */
export function SynapseTextInput(props: Omit<IdsTextBoxProps, "programme">) {
  return <IdsTextBox {...props} programme="synapse" />;
}

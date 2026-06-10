import { Tag, type TagProps } from "./Tag";

/** Synapse programme chrome for Tag (`38910:57385`). */
export function SynapseTag(props: Omit<TagProps, "programme">) {
  return <Tag {...props} programme="synapse" />;
}

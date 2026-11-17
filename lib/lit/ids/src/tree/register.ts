import { registerElementSafely } from "../internal/registration.js";
import { IdsTreeItem, IdsTreeItemLabel } from "./tree-item.element.js";
import { IdsTree } from "./tree.element.js";
import "../icon/register.js";
import "../badge/register.js";

// Register items before root so Mode A synthesized composition upgrades cleanly.
registerElementSafely("ids-tree-item-label", IdsTreeItemLabel);
registerElementSafely("ids-tree-item", IdsTreeItem);
registerElementSafely("ids-tree", IdsTree);

export { IdsTree, IdsTreeItem, IdsTreeItemLabel };

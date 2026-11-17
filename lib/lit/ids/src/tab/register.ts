import { registerElementSafely } from "../internal/registration.js";
import { IdsTabs } from "./tabs.element.js";
import { IdsTab } from "./tab-item.element.js";
import { IdsTabButton } from "./tab-button.element.js";
import { IdsTabContent } from "./tab-content.element.js";
import "../badge/register.js";
import "../icon/register.js";

registerElementSafely("ids-tabs", IdsTabs);
registerElementSafely("ids-tab", IdsTab);
registerElementSafely("ids-tab-button", IdsTabButton);
registerElementSafely("ids-tab-content", IdsTabContent);

export { IdsTabs, IdsTab, IdsTabButton, IdsTabContent };

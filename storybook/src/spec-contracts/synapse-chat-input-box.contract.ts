/**
 * Synapse Chat Input Box — standalone spec contract.
 * Full contract: `components/synapse/chatinputbox/design-spec.md`
 */
export const SYNAPSE_CHAT_INPUT_BOX_DESIGN_SPEC_PATH =
  "components/synapse/chatinputbox/design-spec.md" as const;

export const SYNAPSE_CHAT_INPUT_BOX_SPEC_PATTERN = "standalone" as const;

export const SYNAPSE_CHAT_INPUT_BOX_FIGMA_FILE_KEY = "Td1bnsvRj1PCGs9RVJkIvJ" as const;

/** Main component set — `Chat Input Box`. */
export const SYNAPSE_CHAT_INPUT_BOX_MAIN_SET_NODE_ID = "48467:26816" as const;

/** Element / state matrix — `Chat Input_Element`. */
export const SYNAPSE_CHAT_INPUT_BOX_ELEMENT_SET_NODE_ID = "47834:48782" as const;

/** @deprecated Import from `synapse-suggested-prompt.contract.ts`. */
export { SYNAPSE_SUGGESTED_PROMPT_MAIN_SET_NODE_ID as SYNAPSE_CHAT_INPUT_BOX_SUGGESTED_PROMPT_SET_NODE_ID } from "./synapse-suggested-prompt.contract";

/** Figma `Options=default` — primary spec-accurate story. */
export const SYNAPSE_CHAT_INPUT_BOX_SPEC_ACCURATE_NODE_ID = "48467:26815" as const;

export const SYNAPSE_CHAT_INPUT_BOX_LAYOUT_NODES = {
  default: "48467:26815",
  withSuggestedPromptsV: "48088:44936",
  withSuggestedPromptsH: "50545:27713",
  withButtons: "48467:26658",
  overflow: "48614:110588",
  customView: "51895:90016",
  newChatWithSuggestions: "52141:31963",
} as const;

export const SYNAPSE_CHAT_INPUT_BOX_ELEMENT_STATE_NODES = {
  default: "47817:3433",
  hover: "48268:69518",
  focus: "50808:333075",
  selected: "48268:69544",
  stop: "48548:60369",
  maxQuestionsReached: "50881:252013",
  customView: "51903:92680",
} as const;

/** @deprecated Import from `synapse-suggested-prompt.contract.ts`. */
export { SYNAPSE_SUGGESTED_PROMPT_VARIANT_NODES as SYNAPSE_CHAT_INPUT_BOX_SUGGESTED_PROMPT_NODES } from "./synapse-suggested-prompt.contract";

/** Figma placeholder copy (`Chat Input_Element` default). */
export const SYNAPSE_CHAT_INPUT_BOX_PLACEHOLDER = "Ask me anything" as const;

/** Figma sample footer copy (`showFooter=true`). */
export const SYNAPSE_CHAT_INPUT_BOX_SAMPLE_QUESTIONS_REMAINING = 19 as const;
export const SYNAPSE_CHAT_INPUT_BOX_SAMPLE_QUESTIONS_RESET = "10m" as const;
export const SYNAPSE_CHAT_INPUT_BOX_SAMPLE_CHARACTER_CURRENT = 0 as const;
export const SYNAPSE_CHAT_INPUT_BOX_SAMPLE_CHARACTER_MAX = 1000 as const;

/** Figma `State=Max Questions Reached` (`50881:252013`). */
export const SYNAPSE_CHAT_INPUT_BOX_LIMIT_ICON_SHAPE = "status-warn-tri-solid" as const;

/** User-defined Body 2 message; icon is fixed (`status-warn-tri-solid`). */
export const SYNAPSE_CHAT_INPUT_BOX_LIMIT_MESSAGE =
  "You've reached your 24-hour limit of 300 questions. You can ask more questions in: " as const;

/** Figma sample countdown label (`10m 32s`). */
export const SYNAPSE_CHAT_INPUT_BOX_LIMIT_COUNTDOWN = "10m 32s" as const;

/** Figma sample countdown source (`10m 32s` → 632 seconds). */
export const SYNAPSE_CHAT_INPUT_BOX_LIMIT_REMAINING_SECONDS = 632 as const;

/** Format seconds as Figma Header 5 countdown (`Xm Ys`, `Xm`, or `Ys`). */
export function formatSynapseChatInputLimitRemainingTime(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  if (safeSeconds <= 0) return "0s";
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  if (minutes > 0 && seconds > 0) return `${minutes}m ${seconds}s`;
  if (minutes > 0) return `${minutes}m`;
  return `${seconds}s`;
}

/** Max-questions limit input contract (Figma `50881:252013`). */
export interface SynapseChatInputBoxQuestionLimitInput {
  /** User-defined Body 2 copy. */
  message: string;
  /** Seconds until quota resets; formatted in UI unless `limitCountdown` override is set. */
  remainingSeconds: number;
}

/** Figma `Options=with Suggested Prompts V` sample prompts (`48088:44936`). */
export const SYNAPSE_CHAT_INPUT_BOX_SUGGESTED_PROMPTS_V = [
  "Summarize the health of my environment",
  "Show me what needs my attention right now",
  "Highlight the top risks across compute and storage",
] as const;

/** Figma `Options=New Chat with Suggestions` (`52141:31963`). */
export const SYNAPSE_CHAT_INPUT_BOX_TRY_ASKING_LABEL = "Try asking" as const;

export const SYNAPSE_CHAT_INPUT_BOX_NEW_CHAT_PROMPTS = [
  "How do I add memory to PowerEdge?",
  "How can I learn about ransomware incidents on PowerMax?",
  "Summarize the health of my environment",
] as const;

/** @deprecated Import from `synapse-suggested-prompt.contract.ts`. */
export { SYNAPSE_SUGGESTED_PROMPT_SAMPLE_LABEL as SYNAPSE_CHAT_INPUT_BOX_SAMPLE_PROMPT_LABEL } from "./synapse-suggested-prompt.contract";

/** Figma `State=Custom View` new-chat action label. */
export const SYNAPSE_CHAT_INPUT_BOX_NEW_CHAT_LABEL = "New Chat" as const;

export const SYNAPSE_CHAT_INPUT_BOX_SHELL_RADIUS_ALIAS = "--chat-input-shell-radius" as const;
export const SYNAPSE_CHAT_INPUT_BOX_BUTTON_RADIUS_ALIAS = "--chat-input-button-radius" as const;
export const SYNAPSE_CHAT_INPUT_BOX_PROMPT_RADIUS_ALIAS = "--chat-input-prompt-radius" as const;
export const SYNAPSE_CHAT_INPUT_BOX_FOCUS_RING_OFFSET_ALIAS =
  "--chat-input-focus-ring-offset" as const;
export const SYNAPSE_CHAT_INPUT_BOX_FOCUS_RING_RADIUS_ALIAS =
  "--chat-input-focus-ring-radius" as const;
export const SYNAPSE_CHAT_INPUT_BOX_SHELL_MIN_HEIGHT_ALIAS =
  "--chat-input-shell-min-height" as const;
export const SYNAPSE_CHAT_INPUT_BOX_SHELL_MAX_HEIGHT_ALIAS =
  "--chat-input-shell-max-height" as const;

/** Content shell vertical bounds (composing textarea states). */
export const SYNAPSE_CHAT_INPUT_BOX_SHELL_MIN_HEIGHT_PX = 92 as const;
export const SYNAPSE_CHAT_INPUT_BOX_SHELL_MAX_HEIGHT_PX = 320 as const;

/** At max height, Body 1 (`16px` / `24px` line-height) shows roughly this many lines. */
export const SYNAPSE_CHAT_INPUT_BOX_VISIBLE_TEXT_LINES_MIN = 10 as const;
export const SYNAPSE_CHAT_INPUT_BOX_VISIBLE_TEXT_LINES_MAX = 12 as const;

/** Figma `Options=Overflow` (`48614:110588`) sample copy. */
export const SYNAPSE_CHAT_INPUT_BOX_OVERFLOW_SAMPLE_TEXT =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui official." as const;

export const SYNAPSE_CHAT_INPUT_BOX_OVERFLOW_SAMPLE_CHARACTER_CURRENT = 501 as const;

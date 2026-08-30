import "../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";
import { ChatInputBox } from "./ChatInputBox";
import { SuggestedPrompt } from "./SuggestedPrompt";
import {
  SYNAPSE_CHAT_INPUT_BOX_DESIGN_SPEC_PATH,
  SYNAPSE_CHAT_INPUT_BOX_ELEMENT_STATE_NODES,
  SYNAPSE_CHAT_INPUT_BOX_FOCUS_RING_OFFSET_ALIAS,
  SYNAPSE_CHAT_INPUT_BOX_FOCUS_RING_RADIUS_ALIAS,
  SYNAPSE_CHAT_INPUT_BOX_LAYOUT_NODES,
  SYNAPSE_CHAT_INPUT_BOX_LIMIT_COUNTDOWN,
  SYNAPSE_CHAT_INPUT_BOX_LIMIT_ICON_SHAPE,
  SYNAPSE_CHAT_INPUT_BOX_LIMIT_MESSAGE,
  SYNAPSE_CHAT_INPUT_BOX_LIMIT_REMAINING_SECONDS,
  SYNAPSE_CHAT_INPUT_BOX_NEW_CHAT_LABEL,
  SYNAPSE_CHAT_INPUT_BOX_NEW_CHAT_PROMPTS,
  SYNAPSE_CHAT_INPUT_BOX_OVERFLOW_SAMPLE_CHARACTER_CURRENT,
  SYNAPSE_CHAT_INPUT_BOX_OVERFLOW_SAMPLE_TEXT,
  SYNAPSE_CHAT_INPUT_BOX_PLACEHOLDER,
  SYNAPSE_CHAT_INPUT_BOX_SHELL_MAX_HEIGHT_PX,
  SYNAPSE_CHAT_INPUT_BOX_SHELL_MIN_HEIGHT_PX,
  SYNAPSE_CHAT_INPUT_BOX_VISIBLE_TEXT_LINES_MAX,
  SYNAPSE_CHAT_INPUT_BOX_VISIBLE_TEXT_LINES_MIN,
  SYNAPSE_CHAT_INPUT_BOX_TRY_ASKING_LABEL,
  SYNAPSE_CHAT_INPUT_BOX_SAMPLE_CHARACTER_CURRENT,
  SYNAPSE_CHAT_INPUT_BOX_SAMPLE_CHARACTER_MAX,
  SYNAPSE_CHAT_INPUT_BOX_SAMPLE_QUESTIONS_REMAINING,
  SYNAPSE_CHAT_INPUT_BOX_SAMPLE_QUESTIONS_RESET,
  SYNAPSE_CHAT_INPUT_BOX_SPEC_ACCURATE_NODE_ID,
  SYNAPSE_CHAT_INPUT_BOX_SUGGESTED_PROMPTS_V,
} from "../spec-contracts/synapse-chat-input-box.contract";
import {
  SYNAPSE_SUGGESTED_PROMPT_DESIGN_SPEC_PATH,
  SYNAPSE_SUGGESTED_PROMPT_SAMPLE_LABEL,
  SYNAPSE_SUGGESTED_PROMPT_VARIANT_NODES,
} from "../spec-contracts/synapse-suggested-prompt.contract";

const SHELL_HEIGHT_DOC = [
  `Composing shell: min **${SYNAPSE_CHAT_INPUT_BOX_SHELL_MIN_HEIGHT_PX}px**,`,
  `max **${SYNAPSE_CHAT_INPUT_BOX_SHELL_MAX_HEIGHT_PX}px**`,
  `(~${SYNAPSE_CHAT_INPUT_BOX_VISIBLE_TEXT_LINES_MIN}–${SYNAPSE_CHAT_INPUT_BOX_VISIBLE_TEXT_LINES_MAX} visible Body 1 lines; scroll beyond).`,
].join(" ");

const FOCUS_RING_DOC = [
  "Focus outer ring (`State=Focus` only): `1px` `var(--color-border-brand-base)` at",
  `\`${SYNAPSE_CHAT_INPUT_BOX_FOCUS_RING_OFFSET_ALIAS}\` (4px gap),`,
  `radius \`${SYNAPSE_CHAT_INPUT_BOX_FOCUS_RING_RADIUS_ALIAS}\`.`,
  "Shown for keyboard focus on an empty field — not on default, hover, or selected.",
].join(" ");

const specAccurateArgs = {
  layout: "default" as const,
  placeholder: SYNAPSE_CHAT_INPUT_BOX_PLACEHOLDER,
  showFooter: false,
};

const storyDecoratorPadding = 28;

const meta: Meta<typeof ChatInputBox> = {
  title: "Components/Synapse/Chat and Layout/Chat Input",
  component: ChatInputBox,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          `Spec-driven Synapse Chat Input Box. Source: \`${SYNAPSE_CHAT_INPUT_BOX_DESIGN_SPEC_PATH}\`.`,
          `Primary story: **default** layout (Figma \`${SYNAPSE_CHAT_INPUT_BOX_SPEC_ACCURATE_NODE_ID}\`).`,
          SHELL_HEIGHT_DOC,
          FOCUS_RING_DOC,
          "Theme: `components/synapse-theme.css`.",
        ].join(" "),
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: 370,
          padding: storyDecoratorPadding,
          background: "var(--color-background-surface-primary)",
          boxSizing: "border-box",
        }}
      >
        <Story />
      </div>
    ),
  ],
  args: specAccurateArgs,
};

export default meta;
type Story = StoryObj<typeof ChatInputBox>;

/** Figma `48467:26815` — `Options=default`. Type a prompt, send → stop button (`48548:60369`). */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: {
    ...specAccurateArgs,
    onSend: (message: string) => console.log("Sent:", message),
    onStop: () => console.log("Stopped"),
  },
  parameters: {
    docs: {
      description: {
        story: [
          `Figma \`${SYNAPSE_CHAT_INPUT_BOX_SPEC_ACCURATE_NODE_ID}\`.`,
          "Type a prompt and click send — action switches to **stop** (`48548:60369`).",
          "Click stop to return to send. Click inside for **selected** chrome; Tab for **focus** ring.",
          SHELL_HEIGHT_DOC,
        ].join(" "),
      },
    },
  },
};

/** Figma `48548:60369` — send → stop transition after submit. */
export const SendToStop: Story = {
  name: "Send To Stop",
  args: {
    layout: "default",
    placeholder: SYNAPSE_CHAT_INPUT_BOX_PLACEHOLDER,
    defaultValue: "Summarize the health of my environment",
    onSend: (message: string) => console.log("Sent:", message),
    onStop: () => console.log("Stopped"),
  },
  parameters: {
    docs: {
      description: {
        story: [
          `Figma \`${SYNAPSE_CHAT_INPUT_BOX_ELEMENT_STATE_NODES.stop}\`.`,
          "Click send to enter streaming — button becomes stop (brand outline + square icon).",
          "Click stop to reset.",
        ].join(" "),
      },
    },
  },
};

/** Figma `50808:333075` — `State=Focus` (neutral border + 4px outer ring only). */
export const FocusOuterRing: Story = {
  name: "Focus Outer Ring",
  args: {
    layout: "default",
    placeholder: SYNAPSE_CHAT_INPUT_BOX_PLACEHOLDER,
    visualState: "focus",
  },
  parameters: {
    docs: {
      description: {
        story: [
          `Figma \`${SYNAPSE_CHAT_INPUT_BOX_ELEMENT_STATE_NODES.focus}\`.`,
          "Static `visualState=\"focus\"` — the only state that renders the outer ring.",
          FOCUS_RING_DOC,
        ].join(" "),
      },
    },
  },
};

/** Runtime keyboard focus on empty field — Tab into the textarea to activate. */
export const KeyboardFocusEmpty: Story = {
  name: "Keyboard Focus Empty",
  args: {
    layout: "default",
    placeholder: SYNAPSE_CHAT_INPUT_BOX_PLACEHOLDER,
    autoFocus: true,
  },
  parameters: {
    docs: {
      description: {
        story: [
          "Programmatic focus (keyboard modality) on an empty field → `focus` state with 4px ring.",
          "Clicking instead activates **selected** (brand border) without the ring.",
          FOCUS_RING_DOC,
        ].join(" "),
      },
    },
  },
};

/** Figma `48268:69544` — `State=Selected` (brand border, no outer ring). */
export const SelectedStatic: Story = {
  name: "Selected Static",
  args: {
    layout: "default",
    placeholder: SYNAPSE_CHAT_INPUT_BOX_PLACEHOLDER,
    visualState: "selected",
  },
  parameters: {
    docs: {
      description: {
        story: `Figma \`${SYNAPSE_CHAT_INPUT_BOX_ELEMENT_STATE_NODES.selected}\`. Brand border and send chrome — **no** outer focus ring.`,
      },
    },
  },
};

/** Figma `47834:48782` — `Chat Input_Element` state matrix. */
export const ElementStateMatrix: Story = {
  name: "Element State Matrix",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {(
        [
          ["default", "default", "Default — neutral border, no ring"],
          ["hover", "hover", "Hover — strong border, no ring"],
          ["focus", "focus", "Focus — neutral border + 4px outer ring"],
          ["selected", "selected", "Selected — brand border, no ring"],
          ["stop", "stop", "Stop — streaming action"],
          ["maxQuestionsReached", "maxQuestionsReached", "Max questions — limit message"],
          ["customView", "customView", "Custom view — New Chat row"],
        ] as const
      ).map(([state, key, caption]) => (
        <div
          key={key}
          style={{
            padding: storyDecoratorPadding,
            margin: `0 -${storyDecoratorPadding}px`,
          }}
        >
          <p
            style={{
              margin: "0 0 8px",
              fontSize: 12,
              color: "var(--color-text-gray-neutral)",
            }}
          >
            {caption} — {SYNAPSE_CHAT_INPUT_BOX_ELEMENT_STATE_NODES[state]}
          </p>
          <ChatInputBox
            layout="default"
            sessionMode={state === "customView" ? "activeChat" : undefined}
            visualState={state === "customView" ? undefined : state}
            placeholder={SYNAPSE_CHAT_INPUT_BOX_PLACEHOLDER}
            questionLimit={
              state === "maxQuestionsReached"
                ? {
                    message: SYNAPSE_CHAT_INPUT_BOX_LIMIT_MESSAGE,
                    remainingSeconds: SYNAPSE_CHAT_INPUT_BOX_LIMIT_REMAINING_SECONDS,
                  }
                : undefined
            }
            limitReached={state === "maxQuestionsReached"}
            isStreaming={state === "stop"}
          />
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `Figma element set \`47834:48782\`. Only the **focus** row includes the 4px outer ring.`,
      },
    },
  },
};

/** Figma `52141:31963` — `Options=New Chat with Suggestions`. */
export const NewChatWithSuggestions: Story = {
  name: "New Chat With Suggestions",
  args: {
    layout: "newChatWithSuggestions",
    sessionMode: "newChat",
    placeholder: SYNAPSE_CHAT_INPUT_BOX_PLACEHOLDER,
    suggestedPrompts: [...SYNAPSE_CHAT_INPUT_BOX_NEW_CHAT_PROMPTS],
    tryAskingLabel: SYNAPSE_CHAT_INPUT_BOX_TRY_ASKING_LABEL,
    onSuggestedPromptClick: (prompt: string) => console.log(prompt),
  },
  parameters: {
    docs: {
      description: {
        story: `Figma \`${SYNAPSE_CHAT_INPUT_BOX_LAYOUT_NODES.newChatWithSuggestions}\`. Default input + "Try asking" + wrapped prompt chips.`,
      },
    },
  },
};

/** Active chat → Custom View row (`51903:92680`); click New Chat → new chat layout. */
export const NewChatFlow: Story = {
  name: "New Chat Flow",
  render: function NewChatFlowStory() {
    return (
      <ChatInputBox
        placeholder={SYNAPSE_CHAT_INPUT_BOX_PLACEHOLDER}
        onSend={(message) => console.log("Sent:", message)}
        onStop={() => console.log("Stopped")}
        onNewChat={() => console.log("New chat")}
        onSuggestedPromptClick={(prompt) => console.log("Prompt:", prompt)}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: [
          "1. Type and send → **Custom View** row (`51903:92680`) with + New Chat.",
          "2. Click **New Chat** → **New Chat with Suggestions** (`52141:31963`).",
          "3. Pick a prompt chip to return to composing.",
        ].join(" "),
      },
    },
  },
};

/** Figma `51903:92680` — `State=Custom View` (active chat). */
export const ActiveChatCustomView: Story = {
  name: "Active Chat Custom View",
  args: {
    sessionMode: "activeChat",
    placeholder: SYNAPSE_CHAT_INPUT_BOX_PLACEHOLDER,
    onNewChat: () => console.log(SYNAPSE_CHAT_INPUT_BOX_NEW_CHAT_LABEL),
  },
  parameters: {
    docs: {
      description: {
        story: `Figma \`${SYNAPSE_CHAT_INPUT_BOX_ELEMENT_STATE_NODES.customView}\` — horizontal row with placeholder + New Chat action.`,
      },
    },
  },
};

/** Figma `48614:110588` — `Options=Overflow` (max shell height, scrolled text). */
export const Overflow: Story = {
  name: "Overflow",
  args: {
    layout: "overflow",
    placeholder: SYNAPSE_CHAT_INPUT_BOX_PLACEHOLDER,
    defaultValue: SYNAPSE_CHAT_INPUT_BOX_OVERFLOW_SAMPLE_TEXT,
    visualState: "selected",
    characterCount: {
      current: SYNAPSE_CHAT_INPUT_BOX_OVERFLOW_SAMPLE_CHARACTER_CURRENT,
      max: SYNAPSE_CHAT_INPUT_BOX_SAMPLE_CHARACTER_MAX,
    },
  },
  parameters: {
    docs: {
      description: {
        story: [
          `Figma \`${SYNAPSE_CHAT_INPUT_BOX_LAYOUT_NODES.overflow}\`.`,
          SHELL_HEIGHT_DOC,
          "Long text scrolls inside the shell; character count renders below the shell (`501/1000`).",
        ].join(" "),
      },
    },
  },
};

/** Figma `48088:44936` — `Options=with Suggested Prompts V`. */
export const WithSuggestedPromptsVertical: Story = {
  name: "With Suggested Prompts V",
  args: {
    layout: "withSuggestedPromptsV",
    placeholder: SYNAPSE_CHAT_INPUT_BOX_PLACEHOLDER,
    suggestedPrompts: [...SYNAPSE_CHAT_INPUT_BOX_SUGGESTED_PROMPTS_V],
    onSuggestedPromptClick: (prompt: string) => console.log(prompt),
  },
  parameters: {
    docs: {
      description: {
        story: `Figma node \`${SYNAPSE_CHAT_INPUT_BOX_LAYOUT_NODES.withSuggestedPromptsV}\`.`,
      },
    },
  },
};

/**
 * Back-compat alias — story id `spec-generated-synapse-chat-input-box--suggested-prompt-chip`.
 * Canonical implementation: **Components/Synapse/Chat and Layout/Suggested Prompt**.
 */
export const SuggestedPromptChip: Story = {
  name: "Suggested Prompt",
  render: () => <SuggestedPrompt label={SYNAPSE_SUGGESTED_PROMPT_SAMPLE_LABEL} />,
  parameters: {
    docs: {
      description: {
        story: [
          `Compatibility alias for legacy deep links. Canonical spec: \`${SYNAPSE_SUGGESTED_PROMPT_DESIGN_SPEC_PATH}\`.`,
          `Figma \`${SYNAPSE_SUGGESTED_PROMPT_VARIANT_NODES.aiGradientFalse}\` (AI Gradient=false).`,
        ].join(" "),
      },
    },
  },
};

/** Figma `50881:252013` — `State=Max Questions Reached`. */
export const MaxQuestionsReached: Story = {
  name: "Max Questions Reached",
  args: {
    limitReached: true,
    questionLimit: {
      message: SYNAPSE_CHAT_INPUT_BOX_LIMIT_MESSAGE,
      remainingSeconds: SYNAPSE_CHAT_INPUT_BOX_LIMIT_REMAINING_SECONDS,
    },
  },
  parameters: {
    docs: {
      description: {
        story: [
          `Figma \`${SYNAPSE_CHAT_INPUT_BOX_ELEMENT_STATE_NODES.maxQuestionsReached}\`.`,
          `Fixed icon: \`${SYNAPSE_CHAT_INPUT_BOX_LIMIT_ICON_SHAPE}\`.`,
          `User-defined message + countdown from \`remainingSeconds\` (sample: ${SYNAPSE_CHAT_INPUT_BOX_LIMIT_REMAINING_SECONDS}s → \`${SYNAPSE_CHAT_INPUT_BOX_LIMIT_COUNTDOWN}\`).`,
        ].join(" "),
      },
    },
  },
};

/** Controlled countdown — parent owns `remainingSeconds` and ticks each second. */
export const MaxQuestionsReachedDynamicCountdown: Story = {
  name: "Max Questions Reached (Dynamic)",
  render: function MaxQuestionsDynamicStory() {
    const [remainingSeconds, setRemainingSeconds] = useState(15);

    useEffect(() => {
      const timerId = window.setInterval(() => {
        setRemainingSeconds((current) => Math.max(0, current - 1));
      }, 1000);
      return () => window.clearInterval(timerId);
    }, []);

    return (
      <ChatInputBox
        limitReached
        questionLimit={{
          message: SYNAPSE_CHAT_INPUT_BOX_LIMIT_MESSAGE,
          remainingSeconds,
        }}
        onLimitExpired={() => console.log("limit expired")}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Parent-controlled `questionLimit.remainingSeconds` — message is user-defined; icon is fixed; countdown updates dynamically.",
      },
    },
  },
};

/** Figma `51903:92680` — `State=Custom View` with footer. */
export const CustomViewWithFooter: Story = {
  name: "Custom View With Footer",
  args: {
    sessionMode: "activeChat",
    placeholder: SYNAPSE_CHAT_INPUT_BOX_PLACEHOLDER,
    showFooter: true,
    questionsRemaining: SYNAPSE_CHAT_INPUT_BOX_SAMPLE_QUESTIONS_REMAINING,
    questionsResetLabel: SYNAPSE_CHAT_INPUT_BOX_SAMPLE_QUESTIONS_RESET,
    characterCount: {
      current: SYNAPSE_CHAT_INPUT_BOX_SAMPLE_CHARACTER_CURRENT,
      max: SYNAPSE_CHAT_INPUT_BOX_SAMPLE_CHARACTER_MAX,
    },
    onNewChat: () => console.log(SYNAPSE_CHAT_INPUT_BOX_NEW_CHAT_LABEL),
  },
};

/** Runtime selected with content — brand border, no outer ring (Figma `48268:69544`). */
export const SelectedWithValue: Story = {
  name: "Selected With Value",
  args: {
    defaultValue: "Summarize the health of my environment",
    placeholder: SYNAPSE_CHAT_INPUT_BOX_PLACEHOLDER,
  },
  parameters: {
    docs: {
      description: {
        story: `Figma \`${SYNAPSE_CHAT_INPUT_BOX_ELEMENT_STATE_NODES.selected}\` with content. No outer focus ring.`,
      },
    },
  },
};

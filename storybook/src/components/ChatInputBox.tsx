import {
  useCallback,
  useEffect,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";

import {
  SYNAPSE_CHAT_INPUT_BOX_LIMIT_ICON_SHAPE,
  SYNAPSE_CHAT_INPUT_BOX_LIMIT_MESSAGE,
  SYNAPSE_CHAT_INPUT_BOX_LIMIT_REMAINING_SECONDS,
  SYNAPSE_CHAT_INPUT_BOX_NEW_CHAT_PROMPTS,
  SYNAPSE_CHAT_INPUT_BOX_TRY_ASKING_LABEL,
  formatSynapseChatInputLimitRemainingTime,
  type SynapseChatInputBoxQuestionLimitInput,
} from "../spec-contracts/synapse-chat-input-box.contract";
import { Icon } from "./Icon";
import { SuggestedPrompt, SuggestedPromptList } from "./SuggestedPrompt";
import styles from "./ChatInputBox.module.css";

export type ChatInputLayoutOption =
  | "default"
  | "withSuggestedPromptsV"
  | "withSuggestedPromptsH"
  | "withButtons"
  | "overflow"
  | "customView"
  | "newChatWithSuggestions";

export type ChatInputElementState =
  | "default"
  | "hover"
  | "focus"
  | "selected"
  | "stop"
  | "maxQuestionsReached"
  | "customView";

export type ChatInputSessionMode = "composing" | "activeChat" | "newChat";

/** @deprecated Prefer `SynapseChatInputBoxQuestionLimitInput` via `questionLimit`. */
export type QuestionLimitInput = SynapseChatInputBoxQuestionLimitInput;

export interface ChatInputBoxProps {
  /** Root layout variant (`Chat Input Box` component set). */
  layout?: ChatInputLayoutOption;
  /**
   * Session chrome: `activeChat` → Custom View row (`51903:92680`);
   * `newChat` → input + Try asking + wrapped prompts (`52141:31963`).
   */
  sessionMode?: ChatInputSessionMode;
  /** Demo/testing: force element chrome without interaction. */
  visualState?: ChatInputElementState;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onSend?: (message: string) => void;
  onStop?: () => void;
  onNewChat?: () => void;
  onSuggestedPromptClick?: (prompt: string) => void;
  suggestedPrompts?: readonly string[];
  tryAskingLabel?: string;
  showFooter?: boolean;
  questionsRemaining?: number;
  /** Footer reset interval label, e.g. `10m`. */
  questionsResetLabel?: string;
  characterCount?: { current: number; max: number };
  /** When `limitReached`, structured limit input (message + dynamic countdown source). */
  questionLimit?: SynapseChatInputBoxQuestionLimitInput;
  /** User-defined max-questions message (Body 2). Icon is fixed: `status-warn-tri-solid`. */
  limitMessage?: string;
  /**
   * Dynamic countdown source in seconds; formatted as `Xm Ys` in UI.
   * Controlled when provided; pair with `onLimitRemainingSecondsChange` for ticking.
   */
  limitRemainingSeconds?: number;
  /** Uncontrolled countdown initial seconds when `limitRemainingSeconds` is omitted. */
  defaultLimitRemainingSeconds?: number;
  /** Optional pre-formatted countdown label; skips auto-format/tick when set. */
  limitCountdown?: string;
  /** Emits each second while the internal countdown ticks (uncontrolled mode only). */
  onLimitRemainingSecondsChange?: (remainingSeconds: number) => void;
  /** Emits when countdown reaches zero. */
  onLimitExpired?: () => void;
  isStreaming?: boolean;
  limitReached?: boolean;
  disabled?: boolean;
  /** Focus the textarea on mount (Storybook / runtime). */
  autoFocus?: boolean;
}

function resolveElementState(
  props: {
    visualState?: ChatInputElementState;
    limitReached?: boolean;
    isStreaming?: boolean;
    sessionMode: ChatInputSessionMode;
  },
  value: string,
  isHovered: boolean,
  isFocused: boolean,
  pointerActivated: boolean,
): ChatInputElementState {
  if (props.visualState) return props.visualState;
  if (props.limitReached) return "maxQuestionsReached";
  if (props.isStreaming) return "stop";
  if (props.sessionMode === "activeChat") return "customView";
  const hasValue = value.trim().length > 0;
  if (hasValue || (isFocused && pointerActivated)) return "selected";
  if (isFocused && !pointerActivated) return "focus";
  if (isHovered) return "hover";
  return "default";
}

function resolveInitialSession(layout: ChatInputLayoutOption): ChatInputSessionMode {
  if (layout === "newChatWithSuggestions") return "newChat";
  return "composing";
}

export function ChatInputBox({
  layout = "default",
  sessionMode: sessionModeProp,
  visualState,
  placeholder = "Ask me anything",
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onSend,
  onStop,
  onNewChat,
  onSuggestedPromptClick,
  suggestedPrompts = [],
  tryAskingLabel = SYNAPSE_CHAT_INPUT_BOX_TRY_ASKING_LABEL,
  showFooter = false,
  questionsRemaining = 19,
  questionsResetLabel = "10m",
  characterCount = { current: 0, max: 1000 },
  questionLimit,
  limitMessage = SYNAPSE_CHAT_INPUT_BOX_LIMIT_MESSAGE,
  limitRemainingSeconds: limitRemainingSecondsProp,
  defaultLimitRemainingSeconds = SYNAPSE_CHAT_INPUT_BOX_LIMIT_REMAINING_SECONDS,
  limitCountdown,
  onLimitRemainingSecondsChange,
  onLimitExpired,
  isStreaming: isStreamingProp,
  limitReached = false,
  disabled = false,
  autoFocus = false,
}: ChatInputBoxProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const [internalStreaming, setInternalStreaming] = useState(false);
  const [internalSession, setInternalSession] = useState<ChatInputSessionMode>(() =>
    resolveInitialSession(layout),
  );
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [pointerActivated, setPointerActivated] = useState(false);
  const [internalLimitRemainingSeconds, setInternalLimitRemainingSeconds] = useState(
    () =>
      questionLimit?.remainingSeconds ??
      limitRemainingSecondsProp ??
      defaultLimitRemainingSeconds,
  );

  const resolvedLimitMessage = questionLimit?.message ?? limitMessage;
  const limitSecondsControlled =
    questionLimit?.remainingSeconds !== undefined || limitRemainingSecondsProp !== undefined;
  const resolvedLimitRemainingSeconds = limitSecondsControlled
    ? (questionLimit?.remainingSeconds ?? limitRemainingSecondsProp ?? 0)
    : internalLimitRemainingSeconds;
  const resolvedLimitCountdown =
    limitCountdown ?? formatSynapseChatInputLimitRemainingTime(resolvedLimitRemainingSeconds);

  const isStreamingControlled = isStreamingProp !== undefined;
  const isStreaming = isStreamingProp ?? internalStreaming;
  const sessionControlled = sessionModeProp !== undefined;
  const sessionMode = sessionModeProp ?? internalSession;

  const value = valueProp ?? uncontrolledValue;
  const elementState = resolveElementState(
    { visualState, limitReached, isStreaming, sessionMode },
    value,
    isHovered,
    isFocused,
    pointerActivated,
  );
  const canSend = value.trim().length > 0;

  const promptsAboveInput =
    (layout === "withSuggestedPromptsV" || layout === "withSuggestedPromptsH") &&
    sessionMode !== "activeChat";
  const showNewChatSection = sessionMode === "newChat";
  const newChatPrompts =
    suggestedPrompts.length > 0 ? suggestedPrompts : SYNAPSE_CHAT_INPUT_BOX_NEW_CHAT_PROMPTS;
  const promptsToRender = showNewChatSection ? newChatPrompts : suggestedPrompts;

  const setValue = useCallback(
    (next: string) => {
      if (valueProp === undefined) setUncontrolledValue(next);
      onValueChange?.(next);
    },
    [onValueChange, valueProp],
  );

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled || limitReached || isStreaming) return;
    onSend?.(trimmed);
    if (valueProp === undefined) setUncontrolledValue("");
    if (!isStreamingControlled) setInternalStreaming(true);
    if (!sessionControlled) setInternalSession("activeChat");
  }, [
    disabled,
    isStreaming,
    isStreamingControlled,
    limitReached,
    onSend,
    sessionControlled,
    value,
    valueProp,
  ]);

  const handleStop = useCallback(() => {
    onStop?.();
    if (!isStreamingControlled) setInternalStreaming(false);
  }, [isStreamingControlled, onStop]);

  const handleNewChat = useCallback(() => {
    onNewChat?.();
    if (valueProp === undefined) setUncontrolledValue("");
    if (!isStreamingControlled) setInternalStreaming(false);
    if (!sessionControlled) setInternalSession("newChat");
  }, [isStreamingControlled, onNewChat, sessionControlled, valueProp]);

  const handleSuggestedPromptClick = useCallback(
    (prompt: string) => {
      setValue(prompt);
      onSuggestedPromptClick?.(prompt);
      if (!sessionControlled) setInternalSession("composing");
    },
    [onSuggestedPromptClick, sessionControlled, setValue],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        if (isStreaming) {
          handleStop();
        } else {
          handleSend();
        }
      }
    },
    [handleSend, handleStop, isStreaming],
  );

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      setValue(event.target.value);
    },
    [setValue],
  );

  useEffect(() => {
    if (!limitReached || limitCountdown !== undefined || limitSecondsControlled) return;

    const timerId = window.setInterval(() => {
      setInternalLimitRemainingSeconds((current) => {
        if (current <= 0) return 0;
        const next = current - 1;
        onLimitRemainingSecondsChange?.(next);
        if (next === 0) onLimitExpired?.();
        return next;
      });
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [
    limitCountdown,
    limitReached,
    limitSecondsControlled,
    onLimitExpired,
    onLimitRemainingSecondsChange,
  ]);

  useEffect(() => {
    if (limitSecondsControlled || !limitReached) return;
    setInternalLimitRemainingSeconds(
      questionLimit?.remainingSeconds ?? defaultLimitRemainingSeconds,
    );
  }, [
    defaultLimitRemainingSeconds,
    limitReached,
    limitSecondsControlled,
    questionLimit?.remainingSeconds,
  ]);

  const isComposingShell =
    elementState !== "maxQuestionsReached" && elementState !== "customView";

  const contentClass = [
    styles.content,
    isComposingShell ? styles.contentComposing : "",
    elementState === "hover" ? styles.contentHover : "",
    elementState === "selected" ? styles.contentSelected : "",
    elementState === "customView" ? styles.contentCustomView : "",
    elementState === "maxQuestionsReached" ? styles.contentLimit : "",
  ]
    .filter(Boolean)
    .join(" ");

  const renderPromptChips = (layout: "vertical" | "wrap") =>
    promptsToRender.length > 0 ? (
      <SuggestedPromptList layout={layout}>
        {promptsToRender.map((prompt) => (
          <SuggestedPrompt
            key={prompt}
            label={prompt}
            onClick={() => handleSuggestedPromptClick(prompt)}
          />
        ))}
      </SuggestedPromptList>
    ) : null;

  const renderInputElement = () => (
    <div
      className={[
        styles.element,
        isComposingShell ? styles.elementComposing : "",
        elementState === "maxQuestionsReached" ? styles.elementLimit : "",
        elementState === "customView" ? styles.elementCustomView : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={contentClass}
        data-element-state={elementState}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {elementState === "maxQuestionsReached" ? (
          <>
            <div className={styles.limitIconWrap} aria-hidden="true">
              <Icon
                shapeName={SYNAPSE_CHAT_INPUT_BOX_LIMIT_ICON_SHAPE}
                variant="img"
                style={{ width: 16, height: 16 }}
              />
            </div>
            <div className={styles.limitContent}>
              <p className={styles.limitMessage}>{resolvedLimitMessage}</p>
              <p className={styles.limitCountdown} aria-live="polite" role="timer">
                {resolvedLimitCountdown}
              </p>
            </div>
          </>
        ) : elementState === "customView" ? (
          <>
            <p className={styles.placeholderReadonly}>{placeholder}</p>
            <div className={[styles.actions, styles.actionsInline].join(" ")}>
              <button
                type="button"
                className={styles.newChatButton}
                onClick={handleNewChat}
                aria-label="New Chat"
              >
                <Icon shapeName="shape-plus" color="var(--color-text-brand-strong)" />
                <span className={styles.newChatLabel}>New Chat</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <textarea
              className={[
                styles.textarea,
                elementState === "selected" ? styles.textareaSelected : "",
              ]
                .filter(Boolean)
                .join(" ")}
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onMouseDown={() => setPointerActivated(true)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                setIsFocused(false);
                setPointerActivated(false);
              }}
              placeholder={placeholder}
              disabled={disabled || limitReached}
              autoFocus={autoFocus}
              rows={1}
              aria-label={placeholder}
            />
            <div className={styles.actions}>
              {elementState === "stop" || isStreaming ? (
                <button
                  type="button"
                  className={styles.stopButton}
                  onClick={handleStop}
                  aria-label="Stop response"
                >
                  <span className={styles.stopIconWrap}>
                    <Icon
                      shapeName="shape-square-solid"
                      color="var(--color-icon-brand-base)"
                      style={{ width: 12, height: 12 }}
                    />
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  className={[
                    styles.sendButton,
                    elementState === "selected" ? styles.sendButtonSelected : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={handleSend}
                  disabled={disabled || limitReached || !canSend}
                  aria-label="Send message"
                >
                  <Icon
                    shapeName="arrow-right"
                    color={
                      elementState === "selected"
                        ? "var(--color-icon-gray-white)"
                        : "var(--color-icon-gray-disabled)"
                    }
                  />
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {layout === "overflow" ? (
        <p className={styles.shellCharacterCount}>
          {characterCount.current}/{characterCount.max}
        </p>
      ) : null}

      {showFooter ? (
        <footer className={styles.footer}>
          <div className={styles.footerMeta}>
            <Icon shapeName="info-circ-solid" color="var(--color-icon-gray-disabled)" />
            <p className={styles.footerText}>
              <span className={styles.footerCount}>{questionsRemaining}</span>
              {` questions remaining (resets in ${questionsResetLabel})`}
            </p>
          </div>
          <p className={styles.characterCount}>
            {characterCount.current}/{characterCount.max}
          </p>
        </footer>
      ) : null}
    </div>
  );

  return (
    <div
      className={[
        styles.root,
        promptsAboveInput ? styles.rootWithPromptsV : "",
        showNewChatSection ? styles.rootNewChat : "",
        disabled ? styles.disabled : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {promptsAboveInput ? renderPromptChips("vertical") : null}
      {renderInputElement()}
      {showNewChatSection ? (
        <>
          <p className={styles.tryAskingLabel}>{tryAskingLabel}</p>
          {renderPromptChips("wrap")}
        </>
      ) : null}
    </div>
  );
}

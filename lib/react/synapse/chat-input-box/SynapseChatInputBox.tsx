/**
 * Synapse Chat Input Box — standalone (no IDS counterpart).
 * Source: components/synapse/chatinputbox/design-spec.md
 * Theme: components/synapse-theme.css
 */
import React, {
  useCallback,
  useEffect,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { SynapseIcon } from "../icon";
import { cx } from "../../shared/utils/cx";
import {
  SynapseSuggestedPrompt,
  SynapseSuggestedPromptList,
} from "../suggested-prompt";
import styles from "./SynapseChatInputBox.module.css";

export type SynapseChatInputLayout =
  | "default"
  | "withSuggestedPromptsV"
  | "withSuggestedPromptsH"
  | "withButtons"
  | "overflow"
  | "customView"
  | "newChatWithSuggestions";

export type SynapseChatInputElementState =
  | "default"
  | "hover"
  | "focus"
  | "selected"
  | "stop"
  | "maxQuestionsReached"
  | "customView";

export type SynapseChatInputSessionMode = "composing" | "activeChat" | "newChat";

export interface SynapseChatInputBoxQuestionLimitInput {
  message: string;
  remainingSeconds: number;
}

export interface SynapseChatInputBoxProps {
  layout?: SynapseChatInputLayout;
  sessionMode?: SynapseChatInputSessionMode;
  visualState?: SynapseChatInputElementState;
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
  questionsResetLabel?: string;
  characterCount?: { current: number; max: number };
  questionLimit?: SynapseChatInputBoxQuestionLimitInput;
  limitMessage?: string;
  limitRemainingSeconds?: number;
  defaultLimitRemainingSeconds?: number;
  limitCountdown?: string;
  onLimitRemainingSecondsChange?: (remainingSeconds: number) => void;
  onLimitExpired?: () => void;
  isStreaming?: boolean;
  limitReached?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
}

const PLACEHOLDER = "Ask me anything";
const TRY_ASKING = "Try asking";
const LIMIT_MESSAGE =
  "You've reached your 24-hour limit of 300 questions. You can ask more questions in: ";
const LIMIT_SECONDS = 632;
const LIMIT_ICON = "status-warn-tri-solid";
const NEW_CHAT_PROMPTS = [
  "How do I add memory to PowerEdge?",
  "How can I learn about ransomware incidents on PowerMax?",
  "Summarize the health of my environment",
] as const;

export function formatSynapseChatInputLimitRemainingTime(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  if (safeSeconds <= 0) return "0s";
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  if (minutes > 0 && seconds > 0) return `${minutes}m ${seconds}s`;
  if (minutes > 0) return `${minutes}m`;
  return `${seconds}s`;
}

function resolveElementState(
  props: {
    visualState?: SynapseChatInputElementState;
    limitReached?: boolean;
    isStreaming?: boolean;
    sessionMode: SynapseChatInputSessionMode;
  },
  value: string,
  isHovered: boolean,
  isFocused: boolean,
  pointerActivated: boolean,
): SynapseChatInputElementState {
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

function resolveInitialSession(layout: SynapseChatInputLayout): SynapseChatInputSessionMode {
  if (layout === "newChatWithSuggestions") return "newChat";
  return "composing";
}

export function SynapseChatInputBox({
  layout = "default",
  sessionMode: sessionModeProp,
  visualState,
  placeholder = PLACEHOLDER,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onSend,
  onStop,
  onNewChat,
  onSuggestedPromptClick,
  suggestedPrompts = [],
  tryAskingLabel = TRY_ASKING,
  showFooter = false,
  questionsRemaining = 19,
  questionsResetLabel = "10m",
  characterCount = { current: 0, max: 1000 },
  questionLimit,
  limitMessage = LIMIT_MESSAGE,
  limitRemainingSeconds: limitRemainingSecondsProp,
  defaultLimitRemainingSeconds = LIMIT_SECONDS,
  limitCountdown,
  onLimitRemainingSecondsChange,
  onLimitExpired,
  isStreaming: isStreamingProp,
  limitReached = false,
  disabled = false,
  autoFocus = false,
  className,
}: SynapseChatInputBoxProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const [internalStreaming, setInternalStreaming] = useState(false);
  const [internalSession, setInternalSession] = useState<SynapseChatInputSessionMode>(() =>
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
    suggestedPrompts.length > 0 ? suggestedPrompts : NEW_CHAT_PROMPTS;
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

  const renderPromptChips = (listLayout: "vertical" | "wrap") =>
    promptsToRender.length > 0 ? (
      <SynapseSuggestedPromptList layout={listLayout}>
        {promptsToRender.map((prompt) => (
          <SynapseSuggestedPrompt
            key={prompt}
            label={prompt}
            onClick={() => handleSuggestedPromptClick(prompt)}
          />
        ))}
      </SynapseSuggestedPromptList>
    ) : null;

  return (
    <div
      className={cx(
        styles.SynapseChatInputBox,
        promptsAboveInput && styles.SynapseChatInputBoxWithPromptsV,
        showNewChatSection && styles.SynapseChatInputBoxNewChat,
        disabled && styles.SynapseChatInputBoxDisabled,
        className,
      )}
      data-ids="SynapseChatInputBox"
    >
      {promptsAboveInput ? renderPromptChips("vertical") : null}
      <div
        className={cx(
          styles.SynapseChatInputBoxElement,
          isComposingShell && styles.SynapseChatInputBoxElementComposing,
          elementState === "maxQuestionsReached" && styles.SynapseChatInputBoxElementLimit,
          elementState === "customView" && styles.SynapseChatInputBoxElementCustomView,
        )}
        data-ids="SynapseChatInputBoxElement"
      >
        <div
          className={cx(
            styles.SynapseChatInputBoxContent,
            isComposingShell && styles.SynapseChatInputBoxContentComposing,
            elementState === "hover" && styles.SynapseChatInputBoxContentHover,
            elementState === "selected" && styles.SynapseChatInputBoxContentSelected,
            elementState === "customView" && styles.SynapseChatInputBoxContentCustomView,
            elementState === "maxQuestionsReached" && styles.SynapseChatInputBoxContentLimit,
          )}
          data-ids="SynapseChatInputBoxContent"
          data-element-state={elementState}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {elementState === "maxQuestionsReached" ? (
            <>
              <div
                className={styles.SynapseChatInputBoxLimitIconWrap}
                data-ids="SynapseChatInputBoxLimitIconWrap"
                aria-hidden="true"
              >
                <SynapseIcon shape={LIMIT_ICON} variant="img" size={16} />
              </div>
              <div
                className={styles.SynapseChatInputBoxLimitContent}
                data-ids="SynapseChatInputBoxLimitContent"
              >
                <p className={styles.SynapseChatInputBoxLimitMessage}>{resolvedLimitMessage}</p>
                <p
                  className={styles.SynapseChatInputBoxLimitCountdown}
                  aria-live="polite"
                  role="timer"
                >
                  {resolvedLimitCountdown}
                </p>
              </div>
            </>
          ) : elementState === "customView" ? (
            <>
              <p className={styles.SynapseChatInputBoxPlaceholderReadonly}>{placeholder}</p>
              <div
                className={cx(
                  styles.SynapseChatInputBoxActions,
                  styles.SynapseChatInputBoxActionsInline,
                )}
              >
                <button
                  type="button"
                  className={styles.SynapseChatInputBoxNewChatButton}
                  onClick={handleNewChat}
                  aria-label="New Chat"
                >
                  <SynapseIcon shape="shape-plus" color="var(--color-text-brand-strong)" />
                  <span className={styles.SynapseChatInputBoxNewChatLabel}>New Chat</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <textarea
                className={cx(
                  styles.SynapseChatInputBoxTextarea,
                  elementState === "selected" && styles.SynapseChatInputBoxTextareaSelected,
                )}
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
              <div className={styles.SynapseChatInputBoxActions}>
                {elementState === "stop" || isStreaming ? (
                  <button
                    type="button"
                    className={styles.SynapseChatInputBoxStopButton}
                    onClick={handleStop}
                    aria-label="Stop response"
                  >
                    <span className={styles.SynapseChatInputBoxStopIconWrap}>
                      <SynapseIcon
                        shape="shape-square-solid"
                        size={12}
                        color="var(--color-icon-brand-base)"
                      />
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className={cx(
                      styles.SynapseChatInputBoxSendButton,
                      elementState === "selected" &&
                        styles.SynapseChatInputBoxSendButtonSelected,
                    )}
                    onClick={handleSend}
                    disabled={disabled || limitReached || !canSend}
                    aria-label="Send message"
                  >
                    <SynapseIcon
                      shape="arrow-right"
                      color={
                        elementState === "selected"
                          ? "var(--color-icon-white)"
                          : "var(--color-icon-disabled)"
                      }
                    />
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {layout === "overflow" ? (
          <p className={styles.SynapseChatInputBoxShellCharacterCount}>
            {characterCount.current}/{characterCount.max}
          </p>
        ) : null}

        {showFooter ? (
          <footer className={styles.SynapseChatInputBoxFooter}>
            <div className={styles.SynapseChatInputBoxFooterMeta}>
              <SynapseIcon shape="info-circ-solid" color="var(--color-icon-disabled)" />
              <p className={styles.SynapseChatInputBoxFooterText}>
                <span className={styles.SynapseChatInputBoxFooterCount}>{questionsRemaining}</span>
                {` questions remaining (resets in ${questionsResetLabel})`}
              </p>
            </div>
            <p className={styles.SynapseChatInputBoxCharacterCount}>
              {characterCount.current}/{characterCount.max}
            </p>
          </footer>
        ) : null}
      </div>
      {showNewChatSection ? (
        <>
          <p className={styles.SynapseChatInputBoxTryAskingLabel}>{tryAskingLabel}</p>
          {renderPromptChips("wrap")}
        </>
      ) : null}
    </div>
  );
}

SynapseChatInputBox.displayName = "SynapseChatInputBox";

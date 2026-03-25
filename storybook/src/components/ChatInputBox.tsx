import { useState, useCallback, type KeyboardEvent } from "react";
import styles from "./ChatInputBox.module.css";

interface ChatInputBoxProps {
  onSend?: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function ChatInputBox({
  onSend,
  placeholder = "Type a message...",
  disabled = false,
}: ChatInputBoxProps) {
  const [value, setValue] = useState("");

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (trimmed && onSend) {
      onSend(trimmed);
      setValue("");
    }
  }, [value, onSend]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  return (
    <div className={[styles.root, disabled ? styles.disabled : ""].filter(Boolean).join(" ")}>
      <textarea
        className={styles.textarea}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        aria-label={placeholder}
      />
      <button
        type="button"
        className={styles.send}
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        aria-label="Send message"
      >
        <SendIcon />
      </button>
    </div>
  );
}

function SendIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M3 10L17 3L10 17L9 11L3 10Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

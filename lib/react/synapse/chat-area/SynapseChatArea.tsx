/**
 * Synapse Chat Area — standalone (no IDS counterpart).
 * Source: components/synapse/chatarea/design-spec.md
 * Theme: components/synapse-theme.css
 */
import React, { useEffect, useRef } from "react";
import { cx } from "../../shared/utils/cx";
import styles from "./SynapseChatArea.module.css";

export type SynapseChatAreaSender = "user" | "system";

export interface SynapseChatAreaMessage {
  id: string;
  content: string;
  sender: SynapseChatAreaSender;
  timestamp?: string;
}

export interface SynapseChatAreaProps {
  messages: SynapseChatAreaMessage[];
  className?: string;
}

export function SynapseChatArea({ messages, className }: SynapseChatAreaProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className={cx(styles.SynapseChatArea, className)}
      data-ids="SynapseChatArea"
      role="log"
      aria-label="Chat messages"
    >
      <div
        className={styles.SynapseChatAreaMessages}
        data-ids="SynapseChatAreaMessages"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cx(
              styles.SynapseChatAreaBubble,
              msg.sender === "user"
                ? styles.SynapseChatAreaUser
                : styles.SynapseChatAreaSystem,
            )}
            data-ids="SynapseChatAreaBubble"
            data-sender={msg.sender}
          >
            <p
              className={styles.SynapseChatAreaContent}
              data-ids="SynapseChatAreaContent"
            >
              {msg.content}
            </p>
            {msg.timestamp ? (
              <time
                className={styles.SynapseChatAreaTimestamp}
                data-ids="SynapseChatAreaTimestamp"
              >
                {msg.timestamp}
              </time>
            ) : null}
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
}

SynapseChatArea.displayName = "SynapseChatArea";

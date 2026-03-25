import { useRef, useEffect } from "react";
import styles from "./ChatArea.module.css";

interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "system";
  timestamp?: string;
}

interface ChatAreaProps {
  messages: ChatMessage[];
}

export function ChatArea({ messages }: ChatAreaProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={styles.root} role="log" aria-label="Chat messages">
      <div className={styles.messages}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={[
              styles.bubble,
              msg.sender === "user" ? styles.user : styles.system,
            ].join(" ")}
          >
            <p className={styles.content}>{msg.content}</p>
            {msg.timestamp && (
              <time className={styles.timestamp}>{msg.timestamp}</time>
            )}
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
}

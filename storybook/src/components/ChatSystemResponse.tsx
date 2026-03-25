import styles from "./ChatSystemResponse.module.css";

interface ChatSystemResponseProps {
  content: string;
  timestamp?: string;
}

export function ChatSystemResponse({ content, timestamp }: ChatSystemResponseProps) {
  return (
    <div className={styles.root}>
      <div className={styles.avatar}>
        <BotIcon />
      </div>
      <div className={styles.bubble}>
        <p className={styles.content}>{content}</p>
        {timestamp && (
          <time className={styles.timestamp}>{timestamp}</time>
        )}
      </div>
    </div>
  );
}

function BotIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="3" y="5" width="10" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="6" cy="9" r="1" fill="currentColor" />
      <circle cx="10" cy="9" r="1" fill="currentColor" />
      <path d="M8 2V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

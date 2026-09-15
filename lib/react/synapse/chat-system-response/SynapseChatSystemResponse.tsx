/**
 * Synapse Chat System Response — standalone (no IDS counterpart).
 * Source: components/synapse/chatsystemresponse/design-spec.md
 * Theme: components/synapse-theme.css
 */
import React from "react";
import { IdsIcon } from "../../ids/icon";
import { cx } from "../../shared/utils/cx";
import styles from "./SynapseChatSystemResponse.module.css";

export interface SynapseChatSystemResponseProps {
  content: string;
  timestamp?: string;
  className?: string;
}

export function SynapseChatSystemResponse({
  content,
  timestamp,
  className,
}: SynapseChatSystemResponseProps) {
  return (
    <div
      className={cx(styles.SynapseChatSystemResponse, className)}
      data-ids="SynapseChatSystemResponse"
    >
      <div
        className={styles.SynapseChatSystemResponseAvatar}
        data-ids="SynapseChatSystemResponseAvatar"
        aria-hidden="true"
      >
        <IdsIcon shape="info-circ-solid" size={16} color="var(--color-text-neutral)" />
      </div>
      <div
        className={styles.SynapseChatSystemResponseBubble}
        data-ids="SynapseChatSystemResponseBubble"
      >
        <p
          className={styles.SynapseChatSystemResponseContent}
          data-ids="SynapseChatSystemResponseContent"
        >
          {content}
        </p>
        {timestamp ? (
          <time
            className={styles.SynapseChatSystemResponseTimestamp}
            data-ids="SynapseChatSystemResponseTimestamp"
          >
            {timestamp}
          </time>
        ) : null}
      </div>
    </div>
  );
}

SynapseChatSystemResponse.displayName = "SynapseChatSystemResponse";

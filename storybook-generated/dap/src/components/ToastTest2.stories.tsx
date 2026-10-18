import React from "react";
import type { Meta, StoryObj } from '@storybook/react';
import "../../../../components/dap-theme.css";

const meta: Meta = {
  title: 'Spec Generated/DAP/Toast (test2)',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

// Base toast component implementation following the design spec
function ToastTest2({ 
  message, 
  actionLabel, 
  actionHref, 
  onActionClick, 
  onClose, 
  autoDismiss = true,
  icon = 'info'
}: {
  message: string;
  actionLabel?: string;
  actionHref?: string;
  onActionClick?: () => void;
  onClose?: () => void;
  autoDismiss?: boolean;
  icon?: string;
}) {
  const handleActionClick = (e: React.MouseEvent) => {
    if (onActionClick) {
      e.preventDefault();
      onActionClick();
    }
  };

  return (
    <div 
      role="alert" 
      style={{
        backgroundColor: 'var(--color-background-gray-stronger)',
        border: 'var(--border-width-border-1) solid var(--color-border-white)',
        borderRadius: 'var(--corner-radius-radius-8)',
        padding: '14px var(--padding-padding-24)',
        display: 'flex',
        gap: 'var(--spacing-space-32)',
        alignItems: 'center',
        width: 'fit-content',
        fontFamily: 'Roboto, sans-serif',
      }}
    >
      {/* Content section */}
      <div style={{ display: 'flex', gap: 'var(--spacing-space-8)', alignItems: 'center' }}>
        {/* Icon wrapper */}
        <div style={{ 
          display: 'flex', 
          paddingTop: '2px', 
          paddingBottom: '2px',
          alignItems: 'center'
        }}>
          {/* Info icon - 16x16px */}
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="none"
            style={{ color: 'var(--color-icon-alerting-info)' }}
          >
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="8" cy="5" r="1" fill="currentColor"/>
            <path d="M8 7.5V11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        
        {/* Message text */}
        <p style={{
          margin: 0,
          fontSize: 'var(--font-size-body-2)',
          lineHeight: 'var(--font-line-height-line-height-20)',
          fontWeight: 400,
          color: 'var(--color-text-white)',
        }}>
          {message}
        </p>
      </div>

      {/* Action container */}
      <div style={{ display: 'flex', gap: 'var(--spacing-space-24)', alignItems: 'center' }}>
        {/* Action link (optional) */}
        {actionLabel && (
          <a 
            href={actionHref || '#'}
            onClick={handleActionClick}
            style={{
              fontSize: 'var(--font-size-body-2)',
              lineHeight: 'var(--font-line-height-line-height-20)',
              fontWeight: 400,
              color: 'var(--color-text-white)',
              textDecoration: 'none',
              display: 'flex',
              gap: 'var(--spacing-space-8)',
              alignItems: 'center',
              cursor: 'pointer',
            }}
          >
            {actionLabel}
            {/* External link icon - 16x16px */}
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 16 16" 
              fill="none"
              style={{ color: 'var(--color-icon-white)' }}
            >
              <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        )}
        
        {/* Close button */}
        <button 
          onClick={onClose}
          aria-label="Close"
          style={{
            background: 'transparent',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Close icon - 12x12px */}
          <svg 
            width="12" 
            height="12" 
            viewBox="0 0 12 12" 
            fill="none"
            style={{ color: 'var(--color-icon-white)' }}
          >
            <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// Story: Default toast with action link
export const Default: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', justifyContent: 'center' }}>
      <ToastTest2 
        message="This is a temporary and brief notification following a user action."
        actionLabel="View Details"
        actionHref="#"
        onClose={() => console.log('Toast closed')}
      />
    </div>
  ),
};

// Story: Toast without action link
export const NoAction: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', justifyContent: 'center' }}>
      <ToastTest2 
        message="This is a temporary and brief notification following a user action."
        onClose={() => console.log('Toast closed')}
      />
    </div>
  ),
};

// Story: Persistent toast (no auto-dismiss)
export const Persistent: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', justifyContent: 'center' }}>
      <ToastTest2 
        message="This notification will remain visible until manually dismissed."
        actionLabel="View Details"
        actionHref="#"
        autoDismiss={false}
        onClose={() => console.log('Toast closed')}
      />
    </div>
  ),
};

// Story: Auto-dismiss toast (default behavior)
export const AutoDismiss: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', justifyContent: 'center' }}>
      <ToastTest2 
        message="This notification will automatically dismiss after 5 seconds."
        autoDismiss={true}
        onClose={() => console.log('Toast closed')}
      />
    </div>
  ),
};

// Story: Short message
export const ShortMessage: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', justifyContent: 'center' }}>
      <ToastTest2 
        message="Action completed successfully."
        actionLabel="Undo"
        actionHref="#"
        onClose={() => console.log('Toast closed')}
      />
    </div>
  ),
};

// Story: Long message
export const LongMessage: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', justifyContent: 'center' }}>
      <ToastTest2 
        message="This is a longer notification message that provides more detailed information about the event that occurred and may require user attention or action."
        actionLabel="Learn More"
        actionHref="#"
        onClose={() => console.log('Toast closed')}
      />
    </div>
  ),
};

import React from "react";
import type { Meta, StoryObj } from '@storybook/react';
import '../../../../components/dap-theme.css';

const meta: Meta = {
  title: 'Spec Generated/DAP/Toast (test)',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const Toast = ({ message, showLink, linkText, linkHref }: { message: string; showLink?: boolean; linkText?: string; linkHref?: string }) => (
  <div
    style={{
      backgroundColor: 'var(--color-background-gray-stronger)',
      border: '1px solid var(--color-border-white)',
      borderRadius: 'var(--corner-radius-radius-8)',
      padding: '14px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-space-32)',
      width: '617px',
      height: '48px',
      boxSizing: 'border-box',
    }}
    role="alert"
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-space-8)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          paddingTop: 'var(--padding-padding-2)',
          paddingBottom: 'var(--padding-padding-2)',
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          style={{
            fill: 'var(--color-icon-alerting-info)',
          }}
        >
          <circle cx="8" cy="8" r="7" stroke="var(--color-icon-alerting-info)" strokeWidth="1.5" />
          <circle cx="8" cy="5" r="1" fill="var(--color-icon-alerting-info)" />
          <path d="M8 8V11" stroke="var(--color-icon-alerting-info)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <p
        style={{
          fontFamily: 'Roboto, sans-serif',
          fontSize: 'var(--font-size-body-2)',
          lineHeight: 'var(--font-line-height-line-height-20)',
          fontWeight: 400,
          color: 'var(--color-text-white)',
          margin: 0,
        }}
      >
        {message}
      </p>
    </div>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-space-24)',
      }}
    >
      {showLink && linkText && linkHref && (
        <a
          href={linkHref}
          style={{
            fontFamily: 'Roboto, sans-serif',
            fontSize: 'var(--font-size-body-2)',
            lineHeight: 'var(--font-line-height-line-height-20)',
            fontWeight: 400,
            color: 'var(--color-text-white)',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-space-8)',
          }}
        >
          {linkText}
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            style={{
              fill: 'var(--color-icon-white)',
            }}
          >
            <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="var(--color-icon-white)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 4H13V7" stroke="var(--color-icon-white)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      )}
      <button
        aria-label="Close"
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          style={{
            fill: 'var(--color-icon-white)',
          }}
        >
          <path d="M1 1L11 11M1 11L11 1" stroke="var(--color-icon-white)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  </div>
);

export const Default: Story = {
  args: {
    message: 'This is a temporary and brief notification following a user action.',
    showLink: false,
  },
};

export const WithLink: Story = {
  args: {
    message: 'This is a temporary and brief notification following a user action.',
    showLink: true,
    linkText: 'View Details',
    linkHref: '#',
  },
};

export const WithoutLink: Story = {
  args: {
    message: 'This is a temporary and brief notification following a user action.',
    showLink: false,
  },
};

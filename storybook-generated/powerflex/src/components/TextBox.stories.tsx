import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import '../../../../components/ids-theme.css';

interface TextBoxProps {
  size?: 'sm' | 'md' | 'lg';
  state?: 'default' | 'hover' | 'active' | 'disabled' | 'error';
  contentState?: 'empty' | 'example' | 'filled';
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  errorMessage?: string;
}

const TextBox: React.FC<TextBoxProps> = ({
  size = 'md',
  state = 'default',
  contentState = 'empty',
  value = '',
  placeholder = '',
  disabled = false,
  errorMessage = 'Error message',
}) => {
  const isError = state === 'error';
  const inputValue = contentState === 'filled' ? (value || 'Filled value') : '';
  const placeholderText = contentState === 'example' ? (placeholder || 'Placeholder') : placeholder;

  return (
    <div className={`text-box text-box--${size} text-box--${state}`} data-design-system="powerflex">
      <div className="text-box__input-row">
        <input
          type="text"
          className="text-box__input"
          value={inputValue}
          placeholder={placeholderText}
          disabled={disabled || state === 'disabled'}
          aria-invalid={isError}
          aria-label="Text box"
        />
      </div>
      {isError && errorMessage && (
        <div className="text-box__error-message">
          <span className="text-box__icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <circle cx="8" cy="8" r="7.5" />
              <text x="8" y="12" textAnchor="middle" fontSize="10" fill="#ffffff">!</text>
            </svg>
          </span>
          <span className="text-box__error-text">{errorMessage}</span>
        </div>
      )}
    </div>
  );
};

const meta: Meta<typeof TextBox> = {
  title: 'Spec Generated/Powerflex/TextBox',
  component: TextBox,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    state: { control: 'select', options: ['default', 'hover', 'active', 'disabled', 'error'] },
    contentState: { control: 'select', options: ['empty', 'example', 'filled'] },
    value: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    errorMessage: { control: 'text' },
  },
  args: {
    size: 'md',
    state: 'default',
    contentState: 'empty',
    value: '',
    placeholder: '',
    disabled: false,
    errorMessage: 'Error message',
  },
};
export default meta;

type Story = StoryObj<typeof TextBox>;

export const Default: Story = {
  args: { state: 'default', contentState: 'example', placeholder: 'Placeholder text' },
};

export const Filled: Story = {
  args: { state: 'default', contentState: 'filled', value: 'Jane Doe' },
};

export const Hover: Story = {
  args: { state: 'hover', contentState: 'filled', value: 'Hover state' },
};

export const Active: Story = {
  args: { state: 'active', contentState: 'filled', value: 'Active state' },
};

export const Disabled: Story = {
  args: { state: 'disabled', contentState: 'filled', value: 'Disabled' },
};

export const Error: Story = {
  args: { state: 'error', contentState: 'filled', value: 'Invalid', errorMessage: 'Required field' },
};

export const Small: Story = {
  args: { size: 'sm', contentState: 'example', placeholder: 'Small' },
};

export const Large: Story = {
  args: { size: 'lg', contentState: 'example', placeholder: 'Large' },
};

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import '../../../../components/powerflex-theme.css';

interface ToggleProps {
  checked?: boolean;
  disabled?: boolean;
  label?: string;
  forceFocus?: boolean;
  theme?: 'light' | 'dark';
}

const Toggle: React.FC<ToggleProps> = ({
  checked = false,
  disabled = false,
  label = 'Toggle label',
  forceFocus = false,
  theme = 'light',
}) => {
  const trackBg = disabled
    ? 'var(--toggle-track-background-disabled)'
    : checked
      ? 'var(--toggle-track-background-checked)'
      : 'var(--toggle-track-background-unchecked)';

  const thumbBg = disabled
    ? 'var(--toggle-thumb-background-disabled)'
    : 'var(--toggle-thumb-background)';

  const labelColor = disabled
    ? 'var(--toggle-text-disabled)'
    : 'var(--toggle-text)';

  const ringOpacity = forceFocus && !disabled ? 1 : 0;

  const thumbTranslate = checked
    ? 'calc(var(--toggle-track-width) - var(--toggle-thumb-size) - 2 * var(--toggle-switch-inset))'
    : '0px';

  return (
    <label
      data-design-system="powerflex"
      data-theme={theme}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        width: '313px',
        height: '24px',
        fontFamily: 'inherit',
        color: labelColor,
      }}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        style={{
          position: 'relative',
          width: 'var(--toggle-track-width)',
          height: 'var(--toggle-track-height)',
          flex: '0 0 auto',
          appearance: 'none',
          border: 'none',
          padding: 0,
          background: 'transparent',
          cursor: disabled ? 'default' : 'pointer',
          outline: 'none',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 'var(--toggle-track-width)',
            height: 'var(--toggle-track-height)',
            borderRadius: 'var(--toggle-track-radius)',
            background: trackBg,
          }}
        />
        <span
          style={{
            position: 'absolute',
            top: 'var(--toggle-switch-inset)',
            left: 'var(--toggle-switch-inset)',
            width: 'var(--toggle-thumb-size)',
            height: 'var(--toggle-thumb-size)',
            borderRadius: 'var(--toggle-thumb-radius)',
            background: thumbBg,
            transform: `translateX(${thumbTranslate})`,
            transition:
              'transform var(--toggle-transition-duration) var(--toggle-transition-easing)',
          }}
        />
        <span
          style={{
            position: 'absolute',
            top: 'calc(-1 * var(--toggle-focus-ring-offset))',
            left: 'calc(-1 * var(--toggle-focus-ring-offset))',
            width: 'var(--toggle-focus-ring-width)',
            height: 'var(--toggle-focus-ring-height)',
            borderRadius: 'var(--toggle-focus-ring-radius)',
            border: 'var(--toggle-focus-ring-border)',
            opacity: ringOpacity,
            pointerEvents: 'none',
          }}
        />
      </button>
      <span>{label}</span>
    </label>
  );
};

const meta: Meta<typeof Toggle> = {
  title: 'Spec Generated/PowerFlex/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    forceFocus: { control: 'boolean' },
    theme: { control: 'select', options: ['light', 'dark'] },
  },
  args: {
    checked: true,
    disabled: false,
    forceFocus: false,
    theme: 'light',
  },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const DefaultOn: Story = { args: { checked: true } };
export const DefaultOff: Story = { args: { checked: false } };

export const HoverOn: Story = {
  args: { checked: true },
  parameters: { pseudo: { hover: true } },
};

export const HoverOff: Story = {
  args: { checked: false },
  parameters: { pseudo: { hover: true } },
};

export const FocusOn: Story = { args: { checked: true, forceFocus: true } };
export const FocusOff: Story = { args: { checked: false, forceFocus: true } };

export const DisabledOn: Story = { args: { checked: true, disabled: true } };
export const DisabledOff: Story = { args: { checked: false, disabled: true } };

export const DarkDefaultOn: Story = { args: { checked: true, theme: 'dark' } };
export const DarkDefaultOff: Story = { args: { checked: false, theme: 'dark' } };

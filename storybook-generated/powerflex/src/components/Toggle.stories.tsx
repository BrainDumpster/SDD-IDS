import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import "components/powerflex-theme.css";

interface ToggleProps {
  checked?: boolean;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const sizeMap = {
  sm: { track: { w: 32, h: 16 }, thumb: 12 },
  md: { track: { w: 44, h: 24 }, thumb: 20 },
  lg: { track: { w: 52, h: 28 }, thumb: 24 },
};

const Toggle: React.FC<ToggleProps> = ({ checked = false, size = 'md', disabled = false }) => {
  const { track, thumb } = sizeMap[size];
  return (
    <label
      data-design-system="powerflex"
      style={{ display: 'inline-flex', alignItems: 'center', gap: 8, opacity: disabled ? 0.6 : 1 }}
    >
      <input type="checkbox" defaultChecked={checked} disabled={disabled} style={{ display: 'none' }} />
      <span
        style={{
          width: track.w,
          height: track.h,
          borderRadius: 'var(--toggle-track-radius)',
          background: checked ? 'var(--color-action-primary-default)' : 'var(--color-action-secondary-default)',
          padding: 'var(--toggle-track-padding)',
          position: 'relative',
          display: 'inline-block',
          boxSizing: 'border-box',
        }}
      >
        <span
          style={{
            width: thumb,
            height: thumb,
            borderRadius: 'var(--toggle-thumb-radius)',
            background: 'var(--toggle-thumb-color)',
            position: 'absolute',
            left: checked ? `calc(100% - ${thumb + 2}px)` : 2,
            top: 2,
            transition: 'left 150ms ease-in-out',
          }}
        />
      </span>
      {checked ? 'On' : 'Off'}
    </label>
  );
};

const meta: Meta<typeof Toggle> = {
  title: 'Spec Generated/Powerflex/Toggle',
  component: Toggle,
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const DefaultOff: Story = { args: {} };
export const CheckedOn: Story = { args: { checked: true } };
export const Large: Story = { args: { size: 'lg', checked: true } };
export const Small: Story = { args: { size: 'sm' } };
export const Disabled: Story = { args: { disabled: true } };

import type { Meta, StoryObj } from '@storybook/react';
import { useEffect } from 'react';
import '../../../../components/powerflex-theme.css';

interface ToggleProps {
  checked?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: { track: { w: 32, h: 16 }, thumb: { w: 12, h: 12 }, ring: { w: 38, h: 22 } },
  md: { track: { w: 44, h: 24 }, thumb: { w: 20, h: 20 }, ring: { w: 50, h: 30 } },
  lg: { track: { w: 52, h: 28 }, thumb: { w: 24, h: 24 }, ring: { w: 58, h: 34 } },
};

function Toggle({ checked = false, disabled = false, size = 'md' }: ToggleProps) {
  const dims = sizeMap[size];
  const thumbOffset = checked ? dims.track.w - dims.thumb.w - 4 : 2;

  useEffect(() => {
    document.body.setAttribute('data-design-system', 'powerflex');
  }, []);

  return (
    <div
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled || undefined}
      aria-label="Example toggle"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: dims.ring.w,
        height: dims.ring.h,
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: dims.track.w,
          height: dims.track.h,
          borderRadius: 'var(--toggle-control-radius, 9999px)',
          background: disabled
            ? 'var(--color-background-gray-lighter, #f4f4f4)'
            : checked
              ? 'var(--color-background-controls-brand-base, #0076ce)'
              : 'var(--color-background-gray-light, #eeeeee)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 2,
            left: thumbOffset,
            width: dims.thumb.w,
            height: dims.thumb.h,
            borderRadius: 'var(--toggle-control-radius, 9999px)',
            background: 'var(--color-background-white, #ffffff)',
            transition: 'left 150ms ease-out',
          }}
        />
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: -3,
            left: -3,
            width: dims.ring.w,
            height: dims.ring.h,
            border: '1px solid var(--color-border-brand-base, #0076ce)',
            borderRadius: 'var(--toggle-control-radius, 9999px)',
            pointerEvents: 'none',
            opacity: 1,
          }}
        />
      </div>
    </div>
  );
}

const meta: Meta<typeof Toggle> = {
  title: 'Spec Generated/Powerflex/toggle',
  component: Toggle,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  args: {
    checked: false,
    disabled: false,
    size: 'md',
  },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <Toggle size="sm" checked />
      <Toggle size="md" checked />
      <Toggle size="lg" checked />
    </div>
  ),
};

export const AllStates: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, auto)',
        gap: 16,
        alignItems: 'center',
      }}
    >
      <Toggle checked={false} />
      <Toggle checked={false} disabled />
      <Toggle checked />
      <Toggle checked disabled />
    </div>
  ),
};

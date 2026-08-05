import type { Meta, StoryObj } from '@storybook/react';
import 'components/powerflex-theme.css';

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

  return (
    <div
      data-design-system="powerflex"
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
          borderRadius: 'var(--toggle-control-radius)',
          background: disabled
            ? 'var(--color-background-gray-lighter)'
            : checked
              ? 'var(--color-background-controls-brand-base)'
              : 'var(--color-background-gray-light)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 2,
            left: thumbOffset,
            width: dims.thumb.w,
            height: dims.thumb.h,
            borderRadius: 'var(--toggle-control-radius)',
            background: 'var(--color-background-white)',
            transition: 'left 150ms ease-out',
          }}
        />
      </div>
    </div>
  );
}

const meta: Meta<typeof Toggle> = {
  title: 'Spec Generated/Powerflex/Toggle',
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

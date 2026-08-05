import type { Meta, StoryObj } from '@storybook/react';
import 'components/powerflex-theme.css';

export interface ToggleProps {
  checked?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const sizeStyles: Record<string, React.CSSProperties> = {
  sm: { width: 32, height: 16, padding: 2 },
  md: { width: 44, height: 24, padding: 2 },
  lg: { width: 52, height: 28, padding: 2 },
};

function Toggle({ checked = false, disabled = false, size = 'md', label }: ToggleProps) {
  const s = sizeStyles[size];
  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <span
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled}
        style={{
          position: 'relative',
          width: s.width,
          height: s.height,
          borderRadius: 'var(--toggle-control-radius, 999999px)',
          backgroundColor: checked ? '#0672cb' : '#eaeaea',
          transition: 'background-color 150ms ease',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: s.padding,
            left: checked ? s.width - s.height + s.padding : s.padding,
            width: s.height - s.padding * 2,
            height: s.height - s.padding * 2,
            borderRadius: 'var(--toggle-thumb-radius, 999999px)',
            backgroundColor: '#ffffff',
            transition: 'left 200ms ease',
          }}
        />
      </span>
      {label && <span>{label}</span>}
    </label>
  );
}

const meta = {
  title: 'Spec Generated/Powerflex/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    label: { control: 'text' },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultOff: Story = {
  args: { checked: false, size: 'md', label: 'Toggle' },
};

export const DefaultOn: Story = {
  args: { checked: true, size: 'md', label: 'Toggle' },
};

export const DisabledOn: Story = {
  args: { checked: true, disabled: true, size: 'md', label: 'Disabled on' },
};

export const DisabledOff: Story = {
  args: { checked: false, disabled: true, size: 'md', label: 'Disabled off' },
};

export const Small: Story = {
  args: { checked: true, size: 'sm', label: 'Small' },
};

export const Large: Story = {
  args: { checked: true, size: 'lg', label: 'Large' },
};

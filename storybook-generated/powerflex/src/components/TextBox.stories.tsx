import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import 'components/powerflex-theme.css';

type TextBoxProps = {
  state?: 'default' | 'hover' | 'active' | 'disabled' | 'error';
  content?: 'filled' | 'empty' | 'example';
  size?: 'sm' | 'md' | 'lg';
  value?: string;
  placeholder?: string;
};

const TextBox = ({
  state = 'default',
  content = 'filled',
  size = 'md',
  value = 'PowerFlex value',
  placeholder = 'Placeholder',
}: TextBoxProps) => {
  return (
    <div
      data-design-system="powerflex"
      style={{
        width: '476px',
      }}
    >
      <input
        aria-invalid={state === 'error'}
        disabled={state === 'disabled'}
        placeholder={content === 'example' ? placeholder : undefined}
        defaultValue={content === 'empty' ? '' : value}
        style={{
          width: '100%',
          height: size === 'sm' ? '24px' : size === 'md' ? '32px' : '40px',
          paddingLeft: '8px',
          paddingRight: '8px',
        }}
      />
    </div>
  );
};

const meta: Meta<typeof TextBox> = {
  title: 'Spec Generated/Powerflex/Text Box',
  component: TextBox,
  tags: ['autodocs'],
  argTypes: {
    state: { control: 'select' },
    content: { control: 'select' },
    size: { control: 'select' },
  },
};

export default meta;
type Story = StoryObj<typeof TextBox>;

export const Default: Story = {
  args: { state: 'default', content: 'filled', size: 'md' },
};

export const Hover: Story = {
  args: { state: 'hover', content: 'filled', size: 'md' },
};

export const Active: Story = {
  args: { state: 'active', content: 'filled', size: 'md' },
};

export const Disabled: Story = {
  args: { state: 'disabled', content: 'filled', size: 'md' },
};

export const Error: Story = {
  args: { state: 'error', content: 'filled', size: 'md' },
};

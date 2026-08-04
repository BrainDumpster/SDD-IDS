import type { Meta, StoryObj } from '@storybook/react';
import 'components/powerflex-theme.css';

export interface TextBoxProps {
  value?: string;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  invalid?: boolean;
  errorMessage?: string;
}

const TextBox = ({
  value,
  placeholder,
  size = 'md',
  disabled = false,
  invalid = false,
  errorMessage,
}: TextBoxProps) => {
  const sizeClass = `pf-text-box--${size}`;
  const stateClasses = [
    invalid ? 'pf-text-box--error' : '',
    disabled ? 'pf-text-box--disabled' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`pf-text-box ${sizeClass} ${stateClasses}`} data-design-system="powerflex">
      <div className="pf-text-box__input-row" data-slot="input-row">
        <input
          className="pf-text-box__input"
          type="text"
          defaultValue={value}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={invalid}
          aria-describedby={invalid && errorMessage ? 'text-box-error' : undefined}
        />
        <div className="pf-text-box__focus-ring" data-slot="focus-ring" aria-hidden="true" />
      </div>
      {invalid && errorMessage && (
        <div id="text-box-error" className="pf-text-box__error-message" data-slot="error-message">
          <span className="pf-text-box__error-icon" data-slot="error-icon" aria-hidden="true">
            ⚠
          </span>
          <span className="pf-text-box__error-text">{errorMessage}</span>
        </div>
      )}
    </div>
  );
};

const meta = {
  title: 'Spec Generated/Powerflex/Text Box',
  component: TextBox,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof TextBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text…',
    size: 'md',
  },
};

export const Filled: Story = {
  args: {
    value: 'Sample value',
    size: 'md',
  },
};

export const Hover: Story = {
  args: {
    value: 'Hover state',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: 'Visual hover state rendered by adding the `pf-text-box--hover` class.',
      },
    },
  },
};

export const Active: Story = {
  args: {
    value: 'Active state',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: 'Visual active/focus state rendered by adding the `pf-text-box--active` class.',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    value: 'Disabled value',
    size: 'md',
    disabled: true,
  },
};

export const Error: Story = {
  args: {
    value: 'Invalid value',
    size: 'md',
    invalid: true,
    errorMessage: 'This field is required.',
  },
};

export const Large: Story = {
  args: {
    placeholder: 'Large text box',
    size: 'lg',
  },
};

export const Small: Story = {
  args: {
    placeholder: 'Small text box',
    size: 'sm',
  },
};

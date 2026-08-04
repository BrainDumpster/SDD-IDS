import type { Meta, StoryObj } from '@storybook/react';
import 'components/powerflex-theme.css';

interface TextBoxProps {
  size?: 'sm' | 'md' | 'lg';
  state?: 'default' | 'hover' | 'active' | 'disabled' | 'error';
  content?: 'filled' | 'example' | 'empty';
  value?: string;
  placeholder?: string;
}

const TextBox = ({
  size = 'md',
  state = 'default',
  content = 'filled',
  value = '',
  placeholder = '',
}: TextBoxProps) => {
  const isDisabled = state === 'disabled';
  const isError = state === 'error';
  const inputValue = content === 'example' ? placeholder : value;
  const inputPlaceholder = content === 'example' ? undefined : placeholder;
  return (
    <div data-design-system="powerflex" data-theme="light">
      <div className={`text-box text-box--${size} text-box--${state}`}>
        <input
          type="text"
          className="text-box__input"
          defaultValue={inputValue}
          placeholder={inputPlaceholder}
          disabled={isDisabled}
          aria-invalid={isError}
        />
        {isError && <span className="text-box__error">Error message</span>}
      </div>
    </div>
  );
};

const meta: Meta<typeof TextBox> = {
  title: 'Spec Generated/Powerflex/Text Box',
  component: TextBox,
  args: {
    size: 'md',
    state: 'default',
    content: 'filled',
    value: 'Value',
    placeholder: 'Placeholder',
  },
};

export default meta;
type Story = StoryObj<typeof TextBox>;

export const Playground: Story = {};

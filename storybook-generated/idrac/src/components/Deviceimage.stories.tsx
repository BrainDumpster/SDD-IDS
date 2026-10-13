import React from "react";
import type { Meta, StoryObj } from '@storybook/react';
import '../../../../components/idrac-theme.css';

// Add inline styles using semantic tokens for Storybook preview
const storybookStyles = `
  .device-image-container {
    background-color: var(--color-background-component);
    border: 1px solid var(--color-border-neutral);
    border-radius: var(--corner-radius-radius-2);
    padding: var(--padding-padding-16);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-space-8);
  }
  
  .device-image-container:hover {
    background-color: var(--color-background-brand-lighter);
    border-color: var(--color-border-brand-base);
  }
  
  .device-image-container:focus {
    outline: 2px solid var(--color-border-brand-base);
    outline-offset: var(--button-focus-ring-offset);
  }
  
  .device-image-container.is-disabled {
    background-color: var(--color-background-gray-lighter);
    border-color: var(--color-border-disabled);
    opacity: 0.6;
  }
  
  .image-wrapper {
    position: relative;
    border-radius: var(--corner-radius-radius-2);
    overflow: hidden;
  }
  
  .device-image {
    width: 100%;
    height: auto;
    border-radius: var(--corner-radius-radius-2);
    object-fit: contain;
  }
  
  .overlay {
    position: absolute;
    inset: 0;
    background-color: var(--color-background-overlay);
    border-radius: var(--corner-radius-radius-4);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .status-indicator {
    width: 16px;
    height: 16px;
    background-color: var(--color-icon-brand-base);
    border-radius: 50%;
    position: absolute;
    top: var(--padding-padding-8);
    right: var(--padding-padding-8);
  }
  
  .label {
    font-size: var(--font-size-body-2);
    line-height: var(--font-line-height-line-height-20);
    color: var(--color-text-neutral);
    font-weight: 400;
    text-align: center;
  }
  
  .device-image-container--small {
    max-width: 200px;
  }
  
  .device-image-container--medium {
    max-width: 400px;
  }
  
  .device-image-container--large {
    max-width: 600px;
  }
`;

interface DeviceImageProps {
  src: string;
  alt: string;
  label?: string;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  showStatus?: boolean;
  interactive?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: () => void;
}

const DeviceImage = ({
  src,
  alt,
  label,
  size = 'medium',
  showLabel = true,
  showStatus = true,
  interactive = true,
  disabled = false,
  onClick,
  onLoad,
  onError
}: DeviceImageProps) => {
  const sizeClass = size === 'small' ? 'device-image-container--small' : 
                    size === 'large' ? 'device-image-container--large' : 
                    'device-image-container--medium';
  
  const labelClass = showLabel ? 'has-label' : '';
  const statusClass = showStatus ? 'has-status' : '';
  const interactiveClass = interactive ? 'is-interactive' : '';
  const disabledClass = disabled ? 'is-disabled' : '';

  return (
    <div 
      className={`device-image-container ${sizeClass} ${labelClass} ${statusClass} ${interactiveClass} ${disabledClass}`}
      data-size={size}
      data-interactive={interactive}
      data-disabled={disabled}
      onClick={!disabled && interactive ? onClick : undefined}
      tabIndex={interactive && !disabled ? 0 : -1}
      role="img"
      aria-label={label || alt}
    >
      <div className="image-wrapper">
        <img 
          className="device-image" 
          src={src} 
          alt={alt}
          onLoad={onLoad}
          onError={onError}
        />
        <div className="overlay" hidden></div>
      </div>
      <div className="status-indicator" hidden={!showStatus}></div>
      {showLabel && label && (
        <div className="label">{label}</div>
      )}
    </div>
  );
};

const meta: Meta<typeof DeviceImage> = {
  title: 'Spec Generated/Idrac/DeviceImage',
  component: DeviceImage,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <>
        <style>{storybookStyles}</style>
        <div data-design-system="idrac">
          <Story />
        </div>
      </>
    )
  ],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Component size variant'
    },
    showLabel: {
      control: 'boolean',
      description: 'Display label'
    },
    showStatus: {
      control: 'boolean',
      description: 'Show status indicator'
    },
    interactive: {
      control: 'boolean',
      description: 'Enable interactions'
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state'
    },
    src: {
      control: 'text',
      description: 'Image source URL'
    },
    alt: {
      control: 'text',
      description: 'Alt text for accessibility'
    },
    label: {
      control: 'text',
      description: 'Optional label text'
    }
  },
  parameters: {
    docs: {
      description: {
        component: 'DeviceImage component for iDRAC programme. All styles use semantic CSS variables (var(--...)) from the design spec to ensure theme consistency.'
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof DeviceImage>;

export const Default: Story = {
  args: {
    src: 'https://via.placeholder.com/400x300/0672cb/ffffff?text=Device+Image',
    alt: 'Server device image',
    label: 'Dell PowerEdge R750',
    size: 'medium',
    showLabel: true,
    showStatus: true,
    interactive: true,
    disabled: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Default DeviceImage component using semantic tokens from design spec. Colors resolve to var(--color-background-brand-base) and var(--color-text-white) in the theme.'
      }
    }
  }
};

export const Small: Story = {
  args: {
    ...Default.args,
    size: 'small',
    label: 'Dell PowerEdge R750 (Small)'
  },
  parameters: {
    docs: {
      description: {
        story: 'Small size variant using semantic tokens. Layout uses var(--corner-radius-radius-2) and var(--padding-padding-16).'
      }
    }
  }
};

export const Large: Story = {
  args: {
    ...Default.args,
    size: 'large',
    label: 'Dell PowerEdge R750 (Large)'
  },
  parameters: {
    docs: {
      description: {
        story: 'Large size variant using semantic tokens. Maintains same token usage as other sizes.'
      }
    }
  }
};

export const WithoutLabel: Story = {
  args: {
    ...Default.args,
    showLabel: false
  },
  parameters: {
    docs: {
      description: {
        story: 'DeviceImage without label. Only image and status indicator shown.'
      }
    }
  }
};

export const WithoutStatus: Story = {
  args: {
    ...Default.args,
    showStatus: false
  },
  parameters: {
    docs: {
      description: {
        story: 'DeviceImage without status indicator. Status indicator uses var(--color-icon-brand-base).'
      }
    }
  }
};

export const NonInteractive: Story = {
  args: {
    ...Default.args,
    interactive: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Non-interactive variant. Hover and focus states using var(--color-background-brand-lighter) and var(--color-border-brand-base) are not applied.'
      }
    }
  }
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled state using var(--color-background-gray-lighter), var(--color-border-disabled), and var(--color-text-disabled).'
      }
    }
  }
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--spacing-space-16)', flexWrap: 'wrap', padding: 'var(--padding-padding-16)' }}>
      <DeviceImage
        src="https://via.placeholder.com/200x150/0672cb/ffffff?text=Small"
        alt="Small device"
        label="Small"
        size="small"
        showLabel={true}
        showStatus={true}
        interactive={true}
      />
      <DeviceImage
        src="https://via.placeholder.com/400x300/0672cb/ffffff?text=Medium"
        alt="Medium device"
        label="Medium"
        size="medium"
        showLabel={true}
        showStatus={true}
        interactive={true}
      />
      <DeviceImage
        src="https://via.placeholder.com/600x450/0672cb/ffffff?text=Large"
        alt="Large device"
        label="Large"
        size="large"
        showLabel={true}
        showStatus={true}
        interactive={true}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All size variants displayed together. All use semantic tokens from the design spec.'
      }
    }
  }
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--spacing-space-16)', flexWrap: 'wrap', padding: 'var(--padding-padding-16)' }}>
      <DeviceImage
        src="https://via.placeholder.com/400x300/0672cb/ffffff?text=Default"
        alt="Default state"
        label="Default"
        size="medium"
        showLabel={true}
        showStatus={true}
        interactive={true}
        disabled={false}
      />
      <DeviceImage
        src="https://via.placeholder.com/400x300/0672cb/ffffff?text=Hover"
        alt="Hover state"
        label="Hover"
        size="medium"
        showLabel={true}
        showStatus={true}
        interactive={true}
        disabled={false}
      />
      <DeviceImage
        src="https://via.placeholder.com/400x300/0672cb/ffffff?text=Active"
        alt="Active state"
        label="Active"
        size="medium"
        showLabel={true}
        showStatus={true}
        interactive={true}
        disabled={false}
      />
      <DeviceImage
        src="https://via.placeholder.com/400x300/0672cb/ffffff?text=Disabled"
        alt="Disabled state"
        label="Disabled"
        size="medium"
        showLabel={true}
        showStatus={true}
        interactive={true}
        disabled={true}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Interactive states demonstrating semantic token usage: Default (var(--color-background-component)), Hover (var(--color-background-brand-lighter)), Active (var(--color-background-brand-strong)), Disabled (var(--color-background-gray-lighter)).'
      }
    }
  }
};
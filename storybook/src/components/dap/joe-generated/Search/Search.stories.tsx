import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import "../tokens.css";
import Search from "./Search";
import type { SearchProps } from "./Search";

/**
 * Joe-Generated Search — uses only:
 * - storybook/src/components/dap/joe-generated/Search/Search.tsx
 * - storybook/src/components/dap/joe-generated/Search/Search.css (imported by Search.tsx)
 * - storybook/src/components/dap/joe-generated/tokens.css
 * Spec MDX: components/DAP/joe-generated/Search/search.mdx
 */

function ControlledSearch(props: SearchProps) {
  const [value, setValue] = useState(props.value ?? "");
  return (
    <Search
      {...props}
      value={value}
      onChange={(next) => {
        setValue(next);
        props.onChange?.(next);
      }}
    />
  );
}

const meta: Meta<typeof Search> = {
  title: "Spec Generated/DAP/Joe-Generated/Search",
  component: Search,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Joe-generated DAP Search. Implementation: `storybook/src/components/dap/joe-generated/Search/Search.tsx` + `Search.css`. Tokens: `storybook/src/components/dap/joe-generated/tokens.css`. Spec MDX: `components/DAP/joe-generated/Search/search.mdx`.",
      },
    },
  },
  argTypes: {
    variant: { control: "select", options: ["default", "compact", "expanded"] },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
    onChange: { action: "onChange" },
    onSearch: { action: "onSearch" },
  },
  args: {
    placeholder: "Search...",
    variant: "default",
    disabled: false,
  },
  render: (args) => <ControlledSearch {...args} />,
  decorators: [
    (Story) => (
      <div style={{ width: "100%", maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Search>;

export const Default: Story = {
  args: {
    placeholder: "Search...",
    variant: "default",
  },
};

export const Compact: Story = {
  args: {
    variant: "compact",
    placeholder: "Search...",
  },
};

export const Expanded: Story = {
  args: {
    variant: "expanded",
    placeholder: "Search across this page...",
  },
  decorators: [
    (Story) => (
      <div style={{ width: "100%", maxWidth: 640 }}>
        <Story />
      </div>
    ),
  ],
};

export const WithValue: Story = {
  args: {
    value: "poweredge",
    placeholder: "Search...",
    variant: "default",
  },
};

export const Disabled: Story = {
  args: {
    value: "Cannot edit",
    disabled: true,
    variant: "default",
  },
};

export const CustomPlaceholder: Story = {
  args: {
    placeholder: "Find products, docs, or support...",
    variant: "default",
  },
};

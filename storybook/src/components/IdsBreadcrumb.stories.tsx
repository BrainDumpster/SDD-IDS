import "../../../components/ids-theme.css";

import {

  BREADCRUMB_DOCS_DESCRIPTION,

  BREADCRUMB_SOURCE_CODE,

} from "./ids-breadcrumb.developer-usage";

import type { Meta, StoryObj } from "@storybook/react";

import { IdsBreadcrumb } from "./IdsBreadcrumb";
import { IdsButton } from "./IdsButton";



const meta: Meta<typeof IdsBreadcrumb> = {

  tags: ["autodocs"],

  parameters: {

    docs: {

      canvas: { sourceState: "open" },

      description: {

        component: BREADCRUMB_DOCS_DESCRIPTION,

      },

      source: {

        type: "code",

        language: "tsx",

        code: BREADCRUMB_SOURCE_CODE,

      },

    },

  },

  title: "Components/IDS/Breadcrumb",

  component: IdsBreadcrumb,

  args: {

    items: [

      { label: "Breadcrumb 1", href: "#" },

      { label: "Breadcrumb 2", href: "#" },

      { label: "Breadcrumb 3", href: "#" },

      { label: "Breadcrumb 4", href: "#" },

    ],

    currentPage: "Current Page",

    truncate: false,

    maxVisibleItems: 3,


  },

  argTypes: {

    items: {

      control: "object",

      description: "Array of breadcrumb items with label and href",

    },

    currentPage: {

      control: "text",

      description: "Current page text (displayed below breadcrumb trail)",

    },

    truncate: { control: "boolean", description: "Whether to truncate with '...'" },

    maxVisibleItems: { control: "number", description: "Max items before truncation" },


  },

};



export default meta;

type Story = StoryObj<typeof IdsBreadcrumb>;



export const Default: Story = {

  args: {

    items: [

      { label: "Breadcrumb 1", href: "#" },

      { label: "Breadcrumb 2", href: "#" },

      { label: "Breadcrumb 3", href: "#" },

      { label: "Breadcrumb 4", href: "#" },

    ],

    currentPage: "Current Page",

  },

  render: (args) => (

    <div

      style={{

        position: "relative",

        resize: "both",

        overflow: "auto",

        maxWidth: "100%",

        minWidth: 200,

        padding: 16,

        border: "1px dashed var(--color-border-gray-neutral-base, #757575)",

        borderRadius: 4,

      }}

    >

      <IdsButton

        style={{

          position: "absolute",

          top: 8,

          right: 8,

        }}

      >

        Action

      </IdsButton>

      <IdsBreadcrumb {...args} />

    </div>

  ),

};



export const Truncation: Story = {
  args: {
    items: [
      { label: "This is an extremely long breadcrumb label that should be truncated", href: "#" },
      { label: "Another very long label for testing overflow behavior with long text", href: "#" },
      { label: "Short", href: "#" },
      { label: "Current", href: "#" },
    ],
    currentPage: "Current Page",
  },
  render: (args) => (
    <div
      style={{
        position: "relative",
        resize: "both",
        overflow: "auto",
        maxWidth: "100%",
        minWidth: 200,
        padding: 16,
        border: "1px dashed var(--color-border-gray-neutral-base, #757575)",
        borderRadius: 4,
      }}
    >
      <IdsButton
        style={{
          position: "absolute",
          top: 8,
          right: 8,
        }}
      >
        Action
      </IdsButton>
      <IdsBreadcrumb {...args} />
    </div>
  ),
};



export const MixedLengths: Story = {
  args: {
    items: [
      { label: "This breadcrumb is exactly seventy characters in the total length now!", href: "#" },
      { label: "Thirty character breadcrumb!!!", href: "#" },
      { label: "Fifteen chars!!", href: "#" },
    ],
    currentPage: "Current Page",
  },
  render: (args) => (
    <div
      style={{
        position: "relative",
        resize: "both",
        overflow: "auto",
        maxWidth: "100%",
        minWidth: 200,
        padding: 16,
        border: "1px dashed var(--color-border-gray-neutral-base, #757575)",
        borderRadius: 4,
      }}
    >
      <IdsButton
        style={{
          position: "absolute",
          top: 8,
          right: 8,
        }}
      >
        Action
      </IdsButton>
      <IdsBreadcrumb {...args} />
    </div>
  ),
};



export const OneItem: Story = {

  args: {

    items: [

      { label: "Breadcrumb 1", href: "#" },

    ],

    currentPage: "Current Page",

    truncate: false,

  },

};



export const TwoItems: Story = {

  args: {

    items: [

      { label: "Breadcrumb 1", href: "#" },

      { label: "Breadcrumb 2", href: "#" },

    ],

    currentPage: "Current Page",

    truncate: false,

  },

};



export const ThreeItems: Story = {

  args: {

    items: [

      { label: "Breadcrumb 1", href: "#" },

      { label: "Breadcrumb 2", href: "#" },

      { label: "Breadcrumb 3", href: "#" },

    ],

    currentPage: "Current Page",

    truncate: false,

  },

};



export const FourItems: Story = {

  args: {

    items: [

      { label: "Breadcrumb 1", href: "#" },

      { label: "Breadcrumb 2", href: "#" },

      { label: "Breadcrumb 3", href: "#" },

      { label: "Breadcrumb 4", href: "#" },

    ],

    currentPage: "Current Page",

    truncate: false,

  },

};



export const VariantsMatrix: Story = {

  render: () => (

    <div style={{ display: "grid", gap: 32 }}>

      <div>

        <h3>1 Item</h3>

        <IdsBreadcrumb

          items={[

            { label: "Breadcrumb 1", href: "#" },

          ]}

          currentPage="Current Page"

          truncate={false}

        />

      </div>

      <div>

        <h3>2 Items</h3>

        <IdsBreadcrumb

          items={[

            { label: "Breadcrumb 1", href: "#" },

            { label: "Breadcrumb 2", href: "#" },

          ]}

          currentPage="Current Page"

          truncate={false}

        />

      </div>

      <div>

        <h3>3 Items</h3>

        <IdsBreadcrumb

          items={[

            { label: "Breadcrumb 1", href: "#" },

            { label: "Breadcrumb 2", href: "#" },

            { label: "Breadcrumb 3", href: "#" },

          ]}

          currentPage="Current Page"

          truncate={false}

        />

      </div>

      <div>

        <h3>4 Items</h3>

        <IdsBreadcrumb

          items={[

            { label: "Breadcrumb 1", href: "#" },

            { label: "Breadcrumb 2", href: "#" },

            { label: "Breadcrumb 3", href: "#" },

            { label: "Breadcrumb 4", href: "#" },

          ]}

          currentPage="Current Page"

          truncate={false}

        />

      </div>

    </div>

  ),

};


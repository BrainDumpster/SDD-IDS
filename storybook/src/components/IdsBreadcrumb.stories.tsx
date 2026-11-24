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

      { label: "Breadcrumb 1", href: "?id=components-ids-breadcrumb--one-item&viewMode=story" },

      { label: "Breadcrumb 2", href: "?id=components-ids-breadcrumb--two-items&viewMode=story" },

      { label: "Breadcrumb 3", href: "?id=components-ids-breadcrumb--three-items&viewMode=story" },

      { label: "Breadcrumb 4", href: "?id=components-ids-breadcrumb--four-items&viewMode=story" },

    ],

    currentPage: "Current Page",

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

    maxVisibleItems: { control: "number", description: "Max items before truncation" },


  },

};



export default meta;

type Story = StoryObj<typeof IdsBreadcrumb>;



export const Default: Story = {

  args: {

    items: [

      { label: "Breadcrumb 1", href: "?id=components-ids-breadcrumb--one-item&viewMode=story" },

      { label: "Breadcrumb 2", href: "?id=components-ids-breadcrumb--two-items&viewMode=story" },

      { label: "Breadcrumb 3", href: "?id=components-ids-breadcrumb--three-items&viewMode=story" },

      { label: "Breadcrumb 4", href: "?id=components-ids-breadcrumb--four-items&viewMode=story" },

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
      { label: "This is an extremely long breadcrumb label that should be truncated", href: "?id=components-ids-breadcrumb--one-item&viewMode=story" },
      { label: "Another very long label for testing overflow behavior with long text", href: "?id=components-ids-breadcrumb--two-items&viewMode=story" },
      { label: "Short", href: "?id=components-ids-breadcrumb--three-items&viewMode=story" },
      { label: "Current", href: "?id=components-ids-breadcrumb--four-items&viewMode=story" },
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
      { label: "This breadcrumb is exactly seventy characters in the total length now!", href: "?id=components-ids-breadcrumb--one-item&viewMode=story" },
      { label: "Thirty character breadcrumb!!!", href: "?id=components-ids-breadcrumb--two-items&viewMode=story" },
      { label: "Fifteen chars!!", href: "?id=components-ids-breadcrumb--three-items&viewMode=story" },
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

      { label: "Breadcrumb 1", href: "?id=components-ids-breadcrumb--one-item&viewMode=story" },

    ],

    currentPage: "Current Page",

  },

};



export const TwoItems: Story = {

  args: {

    items: [

      { label: "Breadcrumb 1", href: "?id=components-ids-breadcrumb--one-item&viewMode=story" },

      { label: "Breadcrumb 2", href: "?id=components-ids-breadcrumb--two-items&viewMode=story" },

    ],

    currentPage: "Current Page",

  },

};



export const ThreeItems: Story = {

  args: {

    items: [

      { label: "Breadcrumb 1", href: "?id=components-ids-breadcrumb--one-item&viewMode=story" },

      { label: "Breadcrumb 2", href: "?id=components-ids-breadcrumb--two-items&viewMode=story" },

      { label: "Breadcrumb 3", href: "?id=components-ids-breadcrumb--three-items&viewMode=story" },

    ],

    currentPage: "Current Page",

  },

};



export const FourItems: Story = {

  args: {

    items: [

      { label: "Breadcrumb 1", href: "?id=components-ids-breadcrumb--one-item&viewMode=story" },

      { label: "Breadcrumb 2", href: "?id=components-ids-breadcrumb--two-items&viewMode=story" },

      { label: "Breadcrumb 3", href: "?id=components-ids-breadcrumb--three-items&viewMode=story" },

      { label: "Breadcrumb 4", href: "?id=components-ids-breadcrumb--four-items&viewMode=story" },

    ],

    currentPage: "Current Page",

  },

};



export const VariantsMatrix: Story = {

  render: () => (

    <div style={{ display: "grid", gap: 32 }}>

      <div>

        <h3>1 Item</h3>

        <IdsBreadcrumb

          items={[

            { label: "Breadcrumb 1", href: "?id=components-ids-breadcrumb--one-item&viewMode=story" },

          ]}

          currentPage="Current Page"

        />

      </div>

      <div>

        <h3>2 Items</h3>

        <IdsBreadcrumb

          items={[

            { label: "Breadcrumb 1", href: "?id=components-ids-breadcrumb--one-item&viewMode=story" },

            { label: "Breadcrumb 2", href: "?id=components-ids-breadcrumb--two-items&viewMode=story" },

          ]}

          currentPage="Current Page"

        />

      </div>

      <div>

        <h3>3 Items</h3>

        <IdsBreadcrumb

          items={[

            { label: "Breadcrumb 1", href: "?id=components-ids-breadcrumb--one-item&viewMode=story" },

            { label: "Breadcrumb 2", href: "?id=components-ids-breadcrumb--two-items&viewMode=story" },

            { label: "Breadcrumb 3", href: "?id=components-ids-breadcrumb--three-items&viewMode=story" },

          ]}

          currentPage="Current Page"

        />

      </div>

      <div>

        <h3>4 Items</h3>

        <IdsBreadcrumb

          items={[

            { label: "Breadcrumb 1", href: "?id=components-ids-breadcrumb--one-item&viewMode=story" },

            { label: "Breadcrumb 2", href: "?id=components-ids-breadcrumb--two-items&viewMode=story" },

            { label: "Breadcrumb 3", href: "?id=components-ids-breadcrumb--three-items&viewMode=story" },

            { label: "Breadcrumb 4", href: "?id=components-ids-breadcrumb--four-items&viewMode=story" },

          ]}

          currentPage="Current Page"

        />

      </div>

    </div>

  ),

};


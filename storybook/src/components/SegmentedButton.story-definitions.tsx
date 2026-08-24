import "../../../components/ids-theme.css";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import type { SegmentedButtonChangeMeta } from "./SegmentedButton";
import {
  SegmentedButtons,
  SegmentedIcon,
  SegmentedText,
} from "./SegmentedButtonComposition";

export const SEGMENTED_BUTTON_DOCS_DESCRIPTION = [
  "IDS Segmented Button — composition API (`SegmentedButtons`, `SegmentedText`, `SegmentedIcon`).",
  "Spec: `components/ids/segmented-button/design-spec.md`",
  "Contract: `component-contracts/ids/segmented-button.contract.ts`",
].join(" ");

export const SEGMENTED_BUTTON_SPEC_ACCURATE_SOURCE = `<SegmentedButtons type="text" selected={selected} onSelectedChange={setSelected} ariaLabel="Segmented options">
  <SegmentedText value="option1" label="Option 1" />
  <SegmentedText value="option2" label="Option 2" />
</SegmentedButtons>`;

export const SEGMENTED_BUTTON_ICON_MODES_SOURCE = `<SegmentedButtons type="icon" selected={selected} onSelectedChange={setSelected} ariaLabel="Content view">
  <SegmentedIcon value="list" shape="view-hamburger" ariaLabel="List view" title="List view" />
  <SegmentedIcon value="tree" shape="nav-tree" ariaLabel="Tree view" title="Tree view" />
  <SegmentedIcon value="grid" shape="view-sort-grid-solid" ariaLabel="Grid view" title="Grid view" />
</SegmentedButtons>`;

export const segmentedButtonMeta: Meta<typeof SegmentedButtons> = {
  title: "Components/IDS/Segmented Button",
  component: SegmentedButtons,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      canvas: { sourceState: "open" },
      description: { component: SEGMENTED_BUTTON_DOCS_DESCRIPTION },
    },
  },
};

type Story = StoryObj<typeof SegmentedButtons>;

export const specAccurateDesignStory: Story = {
  name: "Spec Accurate Design",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        story:
          "Spec Accurate Design: text type · 2 options · option1 selected (Figma 42113:67642, width 260px).",
      },
      source: {
        type: "code",
        language: "tsx",
        code: SEGMENTED_BUTTON_SPEC_ACCURATE_SOURCE,
      },
    },
  },
  render: () => {
    const [selected, setSelected] = useState("option1");
    return (
      <div style={{ width: 260 }}>
        <SegmentedButtons
          type="text"
          ariaLabel="Segmented options"
          selected={selected}
          onSelectedChange={setSelected}
        >
          <SegmentedText value="option1" label="Option 1" />
          <SegmentedText value="option2" label="Option 2" />
        </SegmentedButtons>
      </div>
    );
  },
};

export const iconModesStory: Story = {
  name: "Icon Modes",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        story:
          "Icon type · 3 options (list / tree / grid). Figma `8218:13495` — 37px shell, segments vertically centered.",
      },
      source: {
        type: "code",
        language: "tsx",
        code: SEGMENTED_BUTTON_ICON_MODES_SOURCE,
      },
    },
  },
  render: () => {
    const [selected, setSelected] = useState("tree");
    return (
      <SegmentedButtons
        type="icon"
        ariaLabel="Content view"
        selected={selected}
        onSelectedChange={setSelected}
      >
        <SegmentedIcon
          value="list"
          shape="view-hamburger"
          ariaLabel="List view"
          title="List view"
        />
        <SegmentedIcon
          value="tree"
          shape="nav-tree"
          ariaLabel="Tree view"
          title="Tree view"
        />
        <SegmentedIcon
          value="grid"
          shape="view-sort-grid-solid"
          ariaLabel="Grid view"
          title="Grid view"
        />
      </SegmentedButtons>
    );
  },
};

export const textThreeOptionsStory: Story = {
  tags: ["!autodocs"],
  render: () => {
    const [selected, setSelected] = useState("weekly");
    return (
      <SegmentedButtons
        type="text"
        ariaLabel="Billing cycle"
        selected={selected}
        onSelectedChange={setSelected}
      >
        <SegmentedText value="daily" label="Daily" />
        <SegmentedText value="weekly" label="Weekly" />
        <SegmentedText value="monthly" label="Monthly" />
      </SegmentedButtons>
    );
  },
};

export const disabledStatesStory: Story = {
  tags: ["!autodocs"],
  render: () => {
    const [selected, setSelected] = useState("a");
    return (
      <div style={{ display: "grid", gap: 16 }}>
        <SegmentedButtons
          type="text"
          ariaLabel="Disabled segment"
          selected={selected}
          onSelectedChange={setSelected}
        >
          <SegmentedText value="a" label="Available" />
          <SegmentedText value="b" label="Locked" disabled />
          <SegmentedText value="c" label="Available" />
        </SegmentedButtons>
        <SegmentedButtons type="text" ariaLabel="Root disabled" selected="x" disabled>
          <SegmentedText value="x" label="One" />
          <SegmentedText value="y" label="Two" />
        </SegmentedButtons>
      </div>
    );
  },
};

export const onChangePayloadStory: Story = {
  tags: ["!autodocs"],
  render: () => {
    const [selected, setSelected] = useState("a");
    const [lastMeta, setLastMeta] = useState<SegmentedButtonChangeMeta | null>(
      null,
    );
    return (
      <div style={{ display: "grid", gap: 12 }}>
        <SegmentedButtons
          type="text"
          ariaLabel="Payload demo"
          selected={selected}
          onChange={(value, meta) => {
            setSelected(value);
            setLastMeta(meta);
          }}
        >
          <SegmentedText value="a" label="Alpha" />
          <SegmentedText value="b" label="Beta" />
        </SegmentedButtons>
        <pre
          style={{
            margin: 0,
            padding: 12,
            background: "var(--color-background-gray-neutral-lighter)",
            borderRadius: 4,
            fontSize: 12,
          }}
        >
          selected: {JSON.stringify(selected)}
          {"\n"}
          meta: {lastMeta ? JSON.stringify(lastMeta) : "—"}
        </pre>
      </div>
    );
  },
};

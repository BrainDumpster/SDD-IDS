import type { Meta, StoryObj } from "@storybook/react";
import "../../../components/ids-theme.css";
import { IdsWhatsNew } from "./IdsWhatsNew";
import {
  IDS_WHATS_NEW_DESIGN_SPEC_PATH,
  IDS_WHATS_NEW_FIGMA_NODES,
  type IdsWhatsNewItem,
} from "../spec-contracts/ids-whats-new.contract";

const SAMPLE_DESCRIPTION =
  "In the description, describe new features or changes made to an existing feature. Keep this part brief and to the point. An example of description can be something like this - VMware Photon virtual machines created by the vSphere Cluster Service (vCLS) are now automatically excluded from PowerProtect Data Manager protection. This change follows VMware guidance to manage these virtual machines solely by vCLS.";

const baseItems: IdsWhatsNewItem[] = [
  {
    id: "update-1",
    sectionHeader: "Section Header",
    sectionHeaderIcon: "star",
    description: SAMPLE_DESCRIPTION,
    readMoreLabel: "Show More",
  },
  {
    id: "update-2",
    sectionHeader: "Section Header",
    sectionHeaderIcon: "star",
    description: SAMPLE_DESCRIPTION,
    readMoreLabel: "Show More",
  },
  {
    id: "update-3",
    sectionHeader: "Section Header",
    sectionHeaderIcon: "star",
    description: SAMPLE_DESCRIPTION,
    readMoreLabel: "Show More",
  },
];

const bookmarkedItems: IdsWhatsNewItem[] = baseItems.map((item) => ({
  ...item,
  sectionHeaderIcon: "star-solid",
}));

const previewItems: IdsWhatsNewItem[] = Array.from({ length: 5 }, (_, index) => ({
  id: `preview-${index}`,
  description: "Label",
  readMoreLabel: "Show More",
}));

const paginationItems: IdsWhatsNewItem[] = Array.from({ length: 9 }, (_, index) => ({
  id: `page-item-${index}`,
  sectionHeader: `Section Header ${index + 1}`,
  sectionHeaderIcon: "star",
  description: SAMPLE_DESCRIPTION,
  readMoreLabel: "Show More",
}));

const meta: Meta<typeof IdsWhatsNew> = {
  title: "Spec Generated/IDS/What's New",
  component: IdsWhatsNew,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `IDS What's New aligned to \`${IDS_WHATS_NEW_DESIGN_SPEC_PATH}\` with Figma node \`${IDS_WHATS_NEW_FIGMA_NODES.main}\` (newest \`${IDS_WHATS_NEW_FIGMA_NODES.newest}\`, bookmarked \`${IDS_WHATS_NEW_FIGMA_NODES.bookmarked}\`, preview multiple \`${IDS_WHATS_NEW_FIGMA_NODES.previewMultiple}\`, preview single \`${IDS_WHATS_NEW_FIGMA_NODES.previewSingle}\`).`,
      },
    },
  },
  argTypes: {
    view: {
      control: "select",
      options: ["newest", "bookmarked", "preview-single", "preview-multiple"],
    },
    layout: {
      control: "select",
      options: ["modal", "inline", "compact"],
    },
    version: { control: "text" },
    filterValue: { control: "text" },
    showFilter: { control: "boolean" },
    showSearch: { control: "boolean" },
    showPagination: { control: "boolean" },
    pageCount: { control: "number" },
    page: { control: "number" },
    autoDismiss: { control: "boolean" },
    autoDismissDelay: { control: "number" },
    hideDontShowToggle: { control: "boolean" },
  },
  args: {
    view: "newest",
    layout: "modal",
    version: "1.11.11.1",
    filterValue: "Newest",
    showFilter: true,
    showSearch: false,
    showPagination: false,
    pageCount: 1,
    page: 1,
    autoDismiss: false,
    autoDismissDelay: 5000,
    hideDontShowToggle: false,
    items: baseItems,
  },
};

export default meta;
type Story = StoryObj<typeof IdsWhatsNew>;

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) => <IdsWhatsNew {...args} />,
};

export const Bookmarked: Story = {
  args: {
    view: "bookmarked",
    filterValue: "Bookmarked",
    items: bookmarkedItems,
  },
};

export const PreviewSingle: Story = {
  args: {
    view: "preview-single",
    items: previewItems.slice(0, 1),
    showFilter: false,
  },
};

export const PreviewMultiple: Story = {
  args: {
    view: "preview-multiple",
    items: previewItems,
    showFilter: false,
  },
};

export const Compact: Story = {
  args: {
    layout: "compact",
    items: baseItems,
  },
};

export const Inline: Story = {
  args: {
    layout: "inline",
    items: baseItems,
  },
};

export const WithFiltering: Story = {
  args: {
    showFilter: true,
    filterValue: "Newest",
    items: baseItems,
  },
};

export const WithSearch: Story = {
  args: {
    showSearch: true,
    items: baseItems,
  },
};

export const WithPagination: Story = {
  args: {
    showPagination: true,
    pageCount: 3,
    page: 1,
    items: paginationItems,
  },
};

export const AutoDismiss: Story = {
  args: {
    autoDismiss: true,
    autoDismissDelay: 5000,
    items: baseItems,
  },
};

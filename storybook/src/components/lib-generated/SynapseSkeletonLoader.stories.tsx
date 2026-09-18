/**
 * Storybook: Synapse Skeleton Loader from `lib/react/synapse/skeleton-loader`
 * (Synapse-native / standalone — React + CSS Modules).
 *
 * Theme: components/synapse-theme.css
 * Spec: components/synapse/skeletonloader/design-spec.md
 */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/synapse-theme.css";
import { SPEC_ACCURATE_DESIGN_STORY } from "@component-contracts/common/story-meta";
import {
  SYNAPSE_SKELETON_LOADER_DESIGN_SPEC_PATH,
} from "../../spec-contracts/synapse-skeleton-loader.contract";
import {
  SYNAPSE_SKELETON_LOADER_DOCS_DESCRIPTION,
  SYNAPSE_SKELETON_LOADER_SOURCE_CODE,
} from "./synapse-skeleton-loader.developer-usage";
import {
  SynapseSkeletonLoader, type SynapseSkeletonLoaderProps,
} from "@synapse/react/skeleton-loader";

const meta: Meta<SynapseSkeletonLoaderProps> = {
  tags: ["autodocs"],
  title: "Components/Synapse/Skeleton Loader",
  component: SynapseSkeletonLoader,
  parameters: {
    layout: "centered",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: [
          SYNAPSE_SKELETON_LOADER_DOCS_DESCRIPTION,
          `Source: \`${SYNAPSE_SKELETON_LOADER_DESIGN_SPEC_PATH}\`.`,
          "Theme: `components/synapse-theme.css`. Import from `@synapse/react/skeleton-loader`.",
        ].join("\n\n"),
      },
      source: {
        type: "code",
        language: "tsx",
        code: SYNAPSE_SKELETON_LOADER_SOURCE_CODE,
      },
    },
  },
};

export default meta;
type Story = StoryObj<SynapseSkeletonLoaderProps>;

export const SpecAccurateDesign: Story = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  render: () => (
    <div style={{ width: 360, display: "grid", gap: 16 }}>
      <SynapseSkeletonLoader variant="heading" />
      <SynapseSkeletonLoader variant="text" lines={3} />
      <SynapseSkeletonLoader variant="card" />
    </div>
  ),
};

export const Variants: Story = {
  name: "Variants",
  render: () => (
    <div style={{ display: "grid", gap: 16, width: 360 }}>
      <SynapseSkeletonLoader variant="avatar" />
      <SynapseSkeletonLoader variant="button" />
      <SynapseSkeletonLoader variant="list" rows={3} />
      <SynapseSkeletonLoader variant="table" rows={3} columns={4} />
    </div>
  ),
};


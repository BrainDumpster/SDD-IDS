import type { Meta, StoryObj } from "@storybook/react";
import { EmptyState } from "./EmptyState";

const meta: Meta<typeof EmptyState> = {
  title: "Synapse/EmptyState",
  component: EmptyState,
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

function ChartIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <rect x="8" y="28" width="8" height="12" rx="1" stroke="currentColor" strokeWidth="2" />
      <rect x="20" y="20" width="8" height="20" rx="1" stroke="currentColor" strokeWidth="2" />
      <rect x="32" y="8" width="8" height="32" rx="1" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <circle cx="22" cy="22" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M30 30L38 38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export const NoData: Story = {
  args: {
    icon: <ChartIcon />,
    title: "No data yet",
    description: "Once data starts coming in, it will appear here. Check back later or adjust your filters.",
  },
};

export const NoResults: Story = {
  args: {
    icon: <SearchIcon />,
    title: "No results found",
    description: "Try adjusting your search or filter criteria to find what you're looking for.",
    action: { label: "Clear Filters", onClick: () => alert("Filters cleared") },
  },
};

/**
 * Storybook: design-spec–generated What's New from `lib/react/synapse/whats-new`
 * (IDS-fork reexport façade — React + CSS Modules).
 *
 * Anatomy (deterministic child order — root is WhatsNew / SynapseWhatsNew, not WhatsNewRoot):
 *   SynapseWhatsNew
 *     SynapseWhatsNewHeader → SynapseWhatsNewTitle + SynapseWhatsNewCloseButton
 *     SynapseWhatsNewSummary
 *     SynapseWhatsNewBody
 *       SynapseWhatsNewVersionFilterRow → SynapseWhatsNewVersion? + SynapseWhatsNewFilter
 *       SynapseWhatsNewSectionsScroll → SynapseWhatsNewSection[]
 *         SynapseWhatsNewThumbnail
 *         SynapseWhatsNewSectionHeader → SynapseWhatsNewBookmarkButton + SynapseWhatsNewSectionTitle
 *         SynapseWhatsNewDescription → SynapseWhatsNewLink?
 *         SynapseWhatsNewImages → SynapseWhatsNewImage[]
 *     SynapseWhatsNewFooter
 *
 * Theme: components/synapse-theme.css
 * Spec: components/ids/whats-new/design-spec.md
 */
import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/synapse-theme.css";
import {
  SYNAPSE_WHATS_NEW_DOCS_DESCRIPTION,
  SYNAPSE_WHATS_NEW_SOURCE_CODE,
} from "./synapse-whats-new.developer-usage";
import {
  SynapseWhatsNewCompound as SynapseWhatsNew,
  type SynapseWhatsNewFilterKind,
  type SynapseWhatsNewProps,
  type SynapseWhatsNewSectionInput,
} from "@synapse/react/whats-new";

const DESIGN_SPEC_PATH = "components/ids/whats-new/design-spec.md";

const SAMPLE_DESCRIPTION =
  "In the description, describe new features or changes made to an existing feature. Keep this part brief and to the point. An example of description can be something like this - VMware Photon virtual machines created by the vSphere Cluster Service (vCLS) are now automatically excluded from PowerProtect Data Manager protection. This change follows VMware";

const DESCRIPTION_SUFFIX = " these virtual machines solely by vCLS.";

const demoSections: SynapseWhatsNewSectionInput[] = [
  {
    id: "section-1",
    title: "Section Header",
    description: SAMPLE_DESCRIPTION,
    linkText: "guidance to manage",
    linkHref: "#",
    isBookmarked: false,
    images: [
      { id: "section-1-img-1", label: "1. Label", alt: "Image 1" },
      { id: "section-1-img-2", label: "2. Label", alt: "Image 2" },
      { id: "section-1-img-3", label: "3. Label", alt: "Image 3" },
      { id: "section-1-img-4", label: "4. Label", alt: "Image 4" },
      { id: "section-1-img-5", label: "5. Label", alt: "Image 5" },
    ],
  },
  {
    id: "section-2",
    title: "Section Header",
    description: SAMPLE_DESCRIPTION,
    linkText: "guidance to manage",
    linkHref: "#",
    isBookmarked: false,
    images: [{ id: "section-2-img-1", label: "1. Label", alt: "Image 1" }],
  },
  {
    id: "section-3",
    title: "Section Header",
    description: SAMPLE_DESCRIPTION,
    linkText: "guidance to manage",
    linkHref: "#",
    isBookmarked: true,
    images: [
      { id: "section-3-img-1", label: "1. Label", alt: "Image 1" },
      { id: "section-3-img-2", label: "2. Label", alt: "Image 2" },
      { id: "section-3-img-3", label: "3. Label", alt: "Image 3" },
    ],
  },
];

function CompoundSections({
  sections,
  forceBookmarked,
}: {
  sections: SynapseWhatsNewSectionInput[];
  forceBookmarked?: boolean;
}) {
  return (
    <>
      {sections.map((section) => {
        const extraCount = Math.max(0, (section.images?.length ?? 0) - 1);
        return (
          <SynapseWhatsNew.Section
            key={section.id}
            id={section.id}
            isBookmarked={forceBookmarked ?? section.isBookmarked}
          >
            <SynapseWhatsNew.Thumbnail extraCount={extraCount > 0 ? extraCount : undefined} />
            <SynapseWhatsNew.SectionHeader>
              <SynapseWhatsNew.BookmarkButton />
              <SynapseWhatsNew.SectionTitle>{section.title}</SynapseWhatsNew.SectionTitle>
            </SynapseWhatsNew.SectionHeader>
            <SynapseWhatsNew.Description>
              {SAMPLE_DESCRIPTION}{" "}
              <SynapseWhatsNew.Link href={section.linkHref ?? "#"}>
                {section.linkText ?? "guidance to manage"}
              </SynapseWhatsNew.Link>
              {DESCRIPTION_SUFFIX}
            </SynapseWhatsNew.Description>
            <SynapseWhatsNew.Images>
              {section.images?.map((image) => (
                <SynapseWhatsNew.Image
                  key={image.id}
                  id={image.id}
                  src={image.src}
                  alt={image.alt}
                  label={image.label}
                />
              ))}
            </SynapseWhatsNew.Images>
          </SynapseWhatsNew.Section>
        );
      })}
    </>
  );
}

const meta: Meta<SynapseWhatsNewProps> = {
  tags: ["autodocs"],
  title: "Components/Synapse/Whats New",
  component: SynapseWhatsNew,
  parameters: {
    layout: "fullscreen",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: SYNAPSE_WHATS_NEW_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: SYNAPSE_WHATS_NEW_SOURCE_CODE,
      },
    },
  },
};

export default meta;
type Story = StoryObj<SynapseWhatsNewProps>;

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: function SpecAccurateDesignRender() {
    const [dontShowAgain, setDontShowAgain] = useState(false);
    const [filter, setFilter] = useState<SynapseWhatsNewFilterKind>("newest");

    return (
      <SynapseWhatsNew
        open
        versionNumber="1.11.11.1"
        filter={filter}
        onFilterChange={setFilter}
        dontShowAgain={dontShowAgain}
        onDontShowAgainChange={setDontShowAgain}
      >
        <SynapseWhatsNew.Header>
          <SynapseWhatsNew.Title>What's New</SynapseWhatsNew.Title>
          <SynapseWhatsNew.CloseButton />
        </SynapseWhatsNew.Header>
        <SynapseWhatsNew.Summary>
          The following updates (features, bug fixes) have recently been made.
        </SynapseWhatsNew.Summary>
        <SynapseWhatsNew.Body>
          <SynapseWhatsNew.VersionFilterRow>
            <SynapseWhatsNew.Version />
            <SynapseWhatsNew.Filter />
          </SynapseWhatsNew.VersionFilterRow>
          <SynapseWhatsNew.SectionsScroll>
            <CompoundSections sections={demoSections} />
          </SynapseWhatsNew.SectionsScroll>
        </SynapseWhatsNew.Body>
        <SynapseWhatsNew.Footer />
      </SynapseWhatsNew>
    );
  },
};

export const NestedHierarchy: Story = {
  name: "Nested Hierarchy",
  render: function NestedHierarchyRender() {
    return (
      <SynapseWhatsNew open versionNumber="1.11.11.1">
        <SynapseWhatsNew.Header>
          <SynapseWhatsNew.Title>What's New</SynapseWhatsNew.Title>
          <SynapseWhatsNew.CloseButton />
        </SynapseWhatsNew.Header>
        <SynapseWhatsNew.Summary>
          The following updates (features, bug fixes) have recently been made.
        </SynapseWhatsNew.Summary>
        <SynapseWhatsNew.Body>
          <SynapseWhatsNew.VersionFilterRow>
            <SynapseWhatsNew.Version />
            <SynapseWhatsNew.Filter />
          </SynapseWhatsNew.VersionFilterRow>
          <SynapseWhatsNew.SectionsScroll>
            <CompoundSections sections={demoSections.slice(0, 2)} />
          </SynapseWhatsNew.SectionsScroll>
        </SynapseWhatsNew.Body>
        <SynapseWhatsNew.Footer />
      </SynapseWhatsNew>
    );
  },
};

export const BookmarkedSections: Story = {
  name: "Bookmarked Sections",
  render: function BookmarkedRender() {
    return (
      <SynapseWhatsNew
        open
        description="The following updates (features, bug fixes) were bookmarked and may be from recent or previous releases/versions."
        filter="bookmarked"
      >
        <SynapseWhatsNew.Body>
          <SynapseWhatsNew.SectionsScroll>
            <CompoundSections sections={demoSections} forceBookmarked />
          </SynapseWhatsNew.SectionsScroll>
        </SynapseWhatsNew.Body>
      </SynapseWhatsNew>
    );
  },
};

export const ConvenienceDataSections: Story = {
  name: "Convenience Data Sections",
  render: function ConvenienceDataSectionsRender() {
    const [dontShowAgain, setDontShowAgain] = useState(false);
    return (
      <SynapseWhatsNew
        open
        versionNumber="1.11.11.1"
        sections={demoSections}
        dontShowAgain={dontShowAgain}
        onDontShowAgainChange={setDontShowAgain}
      />
    );
  },
};

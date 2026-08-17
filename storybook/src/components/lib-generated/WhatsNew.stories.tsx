/**
 * Storybook: design-spec–generated What's New from `lib/react/ids/whats-new`
 * (React + CSS Modules, no @base-ui-components).
 *
 * Anatomy (deterministic child order — root is WhatsNew / IdsWhatsNew, not WhatsNewRoot):
 *   IdsWhatsNew
 *     IdsWhatsNewHeader → IdsWhatsNewTitle + IdsWhatsNewCloseButton
 *     IdsWhatsNewSummary
 *     IdsWhatsNewBody
 *       IdsWhatsNewVersionFilterRow → IdsWhatsNewVersion? + IdsWhatsNewFilter
 *       IdsWhatsNewSectionsScroll → IdsWhatsNewSection[]
 *         IdsWhatsNewThumbnail
 *         IdsWhatsNewSectionHeader → IdsWhatsNewBookmarkButton + IdsWhatsNewSectionTitle
 *         IdsWhatsNewDescription → IdsWhatsNewLink?
 *         IdsWhatsNewImages → IdsWhatsNewImage[]
 *     IdsWhatsNewFooter
 *
 * Theme: components/ids-theme.css
 * Spec: components/ids/whats-new/design-spec.md
 */
import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/ids-theme.css";
import {
  WhatsNew,
  type WhatsNewFilter,
  type IdsWhatsNewProps,
  type IdsWhatsNewSectionInput,
} from "../../../../lib/react/ids/whats-new";

const DESIGN_SPEC_PATH = "components/ids/whats-new/design-spec.md";

const SAMPLE_DESCRIPTION =
  "In the description, describe new features or changes made to an existing feature. Keep this part brief and to the point. An example of description can be something like this - VMware Photon virtual machines created by the vSphere Cluster Service (vCLS) are now automatically excluded from PowerProtect Data Manager protection. This change follows VMware";

const DESCRIPTION_SUFFIX = " these virtual machines solely by vCLS.";

const demoSections: IdsWhatsNewSectionInput[] = [
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
  sections: IdsWhatsNewSectionInput[];
  forceBookmarked?: boolean;
}) {
  return (
    <>
      {sections.map((section) => {
        const extraCount = Math.max(0, (section.images?.length ?? 0) - 1);
        return (
          <WhatsNew.Section
            key={section.id}
            id={section.id}
            isBookmarked={forceBookmarked ?? section.isBookmarked}
          >
            <WhatsNew.Thumbnail extraCount={extraCount > 0 ? extraCount : undefined} />
            <WhatsNew.SectionHeader>
              <WhatsNew.BookmarkButton />
              <WhatsNew.SectionTitle>{section.title}</WhatsNew.SectionTitle>
            </WhatsNew.SectionHeader>
            <WhatsNew.Description>
              {SAMPLE_DESCRIPTION}{" "}
              <WhatsNew.Link href={section.linkHref ?? "#"}>
                {section.linkText ?? "guidance to manage"}
              </WhatsNew.Link>
              {DESCRIPTION_SUFFIX}
            </WhatsNew.Description>
            <WhatsNew.Images>
              {section.images?.map((image) => (
                <WhatsNew.Image
                  key={image.id}
                  id={image.id}
                  src={image.src}
                  alt={image.alt}
                  label={image.label}
                />
              ))}
            </WhatsNew.Images>
          </WhatsNew.Section>
        );
      })}
    </>
  );
}

const meta: Meta<IdsWhatsNewProps> = {
  title: "Lib Generated/IDS/Whats New",
  component: WhatsNew,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          `React IDS What's New from \`${DESIGN_SPEC_PATH}\`. ` +
          "Root is `WhatsNew` (`IdsWhatsNew`) — not `WhatsNewRoot`. " +
          "Deterministic anatomy: Header → Title + CloseButton → Summary → Body → " +
          "VersionFilterRow → SectionsScroll → Section (Thumbnail, SectionHeader, " +
          "Description, Images) → Footer. Theme: `components/ids-theme.css`. " +
          "No `@base-ui-components`.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<IdsWhatsNewProps>;

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: function SpecAccurateDesignRender() {
    const [dontShowAgain, setDontShowAgain] = useState(false);
    const [filter, setFilter] = useState<WhatsNewFilter>("newest");

    return (
      <WhatsNew
        open
        versionNumber="1.11.11.1"
        filter={filter}
        onFilterChange={setFilter}
        dontShowAgain={dontShowAgain}
        onDontShowAgainChange={setDontShowAgain}
      >
        <WhatsNew.Header>
          <WhatsNew.Title>What's New</WhatsNew.Title>
          <WhatsNew.CloseButton />
        </WhatsNew.Header>
        <WhatsNew.Summary>
          The following updates (features, bug fixes) have recently been made.
        </WhatsNew.Summary>
        <WhatsNew.Body>
          <WhatsNew.VersionFilterRow>
            <WhatsNew.Version />
            <WhatsNew.Filter />
          </WhatsNew.VersionFilterRow>
          <WhatsNew.SectionsScroll>
            <CompoundSections sections={demoSections} />
          </WhatsNew.SectionsScroll>
        </WhatsNew.Body>
        <WhatsNew.Footer />
      </WhatsNew>
    );
  },
};

export const NestedHierarchy: Story = {
  name: "Nested Hierarchy",
  render: function NestedHierarchyRender() {
    return (
      <WhatsNew open versionNumber="1.11.11.1">
        <WhatsNew.Header>
          <WhatsNew.Title>What's New</WhatsNew.Title>
          <WhatsNew.CloseButton />
        </WhatsNew.Header>
        <WhatsNew.Summary>
          The following updates (features, bug fixes) have recently been made.
        </WhatsNew.Summary>
        <WhatsNew.Body>
          <WhatsNew.VersionFilterRow>
            <WhatsNew.Version />
            <WhatsNew.Filter />
          </WhatsNew.VersionFilterRow>
          <WhatsNew.SectionsScroll>
            <CompoundSections sections={demoSections.slice(0, 2)} />
          </WhatsNew.SectionsScroll>
        </WhatsNew.Body>
        <WhatsNew.Footer />
      </WhatsNew>
    );
  },
};

export const BookmarkedSections: Story = {
  name: "Bookmarked Sections",
  render: function BookmarkedRender() {
    return (
      <WhatsNew
        open
        description="The following updates (features, bug fixes) were bookmarked and may be from recent or previous releases/versions."
        filter="bookmarked"
      >
        <WhatsNew.Body>
          <WhatsNew.SectionsScroll>
            <CompoundSections sections={demoSections} forceBookmarked />
          </WhatsNew.SectionsScroll>
        </WhatsNew.Body>
      </WhatsNew>
    );
  },
};

export const ConvenienceDataSections: Story = {
  name: "Convenience Data Sections",
  render: function ConvenienceDataSectionsRender() {
    const [dontShowAgain, setDontShowAgain] = useState(false);
    return (
      <WhatsNew
        open
        versionNumber="1.11.11.1"
        sections={demoSections}
        dontShowAgain={dontShowAgain}
        onDontShowAgainChange={setDontShowAgain}
      />
    );
  },
};

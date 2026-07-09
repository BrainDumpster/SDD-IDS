import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import "../../../components/ids-theme.css";
import {
  WHATS_NEW_DESCRIPTION_BOOKMARKED,
  WHATS_NEW_DESCRIPTION_NEWEST,
  WHATS_NEW_DESCRIPTION_SUFFIX,
  WHATS_NEW_SAMPLE_SECTION_DESCRIPTION,
  WHATS_NEW_SPEC_ACCURATE_DEFAULTS,
  WHATS_NEW_SPEC_DEMO_SECTIONS,
} from "../spec-contracts/ids-whats-new.contract";
import { IdsWhatsNew } from "./IdsWhatsNew";

const meta: Meta<typeof IdsWhatsNew> = {
  title: "Spec Generated/IDS/Whats New",
  component: IdsWhatsNew,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "IDS What's New — canonical **compound child API** (`IdsWhatsNew.Section`, `.Thumbnail`, `.Description`, `.Images`, …). Optional `sections[]` prop is convenience-only for CMS-driven demos.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof IdsWhatsNew>;

function SpecDemoSectionsComposition() {
  return (
    <>
      {WHATS_NEW_SPEC_DEMO_SECTIONS.map((section) => {
        const extraCount = Math.max(0, (section.images?.length ?? 0) - 1);
        return (
          <IdsWhatsNew.Section
            key={section.id}
            id={section.id}
            isBookmarked={section.isBookmarked}
          >
            <IdsWhatsNew.Thumbnail extraCount={extraCount > 0 ? extraCount : undefined} />
            <IdsWhatsNew.SectionHeader>
              <IdsWhatsNew.BookmarkButton />
              <IdsWhatsNew.SectionTitle>{section.title}</IdsWhatsNew.SectionTitle>
            </IdsWhatsNew.SectionHeader>
            <IdsWhatsNew.Description>
              {WHATS_NEW_SAMPLE_SECTION_DESCRIPTION}{" "}
              <IdsWhatsNew.Link href={section.linkHref ?? "#"}>
                {section.linkText ?? "guidance to manage"}
              </IdsWhatsNew.Link>
              {WHATS_NEW_DESCRIPTION_SUFFIX}
            </IdsWhatsNew.Description>
            <IdsWhatsNew.Images>
              {section.images?.map((image) => (
                <IdsWhatsNew.Image
                  key={image.id}
                  id={image.id}
                  src={image.src}
                  alt={image.alt}
                  label={image.label}
                />
              ))}
            </IdsWhatsNew.Images>
          </IdsWhatsNew.Section>
        );
      })}
    </>
  );
}

/** Figma list — Newest (`27437:44094`). Canonical compound API. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: function SpecAccurateDesignRender() {
    const [dontShowAgain, setDontShowAgain] = useState(false);
    const [filter, setFilter] = useState<"newest" | "bookmarked">("newest");

    return (
      <IdsWhatsNew
        open
        title={WHATS_NEW_SPEC_ACCURATE_DEFAULTS.title}
        description={WHATS_NEW_DESCRIPTION_NEWEST}
        versionNumber={WHATS_NEW_SPEC_ACCURATE_DEFAULTS.versionNumber}
        filter={filter}
        onFilterChange={setFilter}
        dontShowAgain={dontShowAgain}
        onDontShowAgainChange={setDontShowAgain}
      >
        <IdsWhatsNew.Body>
          <IdsWhatsNew.SectionsScroll>
            <SpecDemoSectionsComposition />
          </IdsWhatsNew.SectionsScroll>
        </IdsWhatsNew.Body>
      </IdsWhatsNew>
    );
  },
};

export const BookmarkedSections: Story = {
  name: "Bookmarked Sections",
  render: function BookmarkedRender() {
    const [dontShowAgain, setDontShowAgain] = useState(false);

    return (
      <IdsWhatsNew
        open
        description={WHATS_NEW_DESCRIPTION_BOOKMARKED}
        filter="bookmarked"
        dontShowAgain={dontShowAgain}
        onDontShowAgainChange={setDontShowAgain}
      >
        <IdsWhatsNew.Body>
          <IdsWhatsNew.SectionsScroll>
            {WHATS_NEW_SPEC_DEMO_SECTIONS.map((section) => {
              const extraCount = Math.max(0, (section.images?.length ?? 0) - 1);
              return (
                <IdsWhatsNew.Section key={section.id} id={section.id} isBookmarked>
                  <IdsWhatsNew.Thumbnail extraCount={extraCount > 0 ? extraCount : undefined} />
                  <IdsWhatsNew.SectionHeader>
                    <IdsWhatsNew.BookmarkButton />
                    <IdsWhatsNew.SectionTitle>{section.title}</IdsWhatsNew.SectionTitle>
                  </IdsWhatsNew.SectionHeader>
                  <IdsWhatsNew.Description>
                    {WHATS_NEW_SAMPLE_SECTION_DESCRIPTION}{" "}
                    <IdsWhatsNew.Link href={section.linkHref ?? "#"}>
                      {section.linkText ?? "guidance to manage"}
                    </IdsWhatsNew.Link>
                    {WHATS_NEW_DESCRIPTION_SUFFIX}
                  </IdsWhatsNew.Description>
                  <IdsWhatsNew.Images>
                    {section.images?.map((image) => (
                      <IdsWhatsNew.Image
                        key={image.id}
                        id={image.id}
                        src={image.src}
                        alt={image.alt}
                        label={image.label}
                      />
                    ))}
                  </IdsWhatsNew.Images>
                </IdsWhatsNew.Section>
              );
            })}
          </IdsWhatsNew.SectionsScroll>
        </IdsWhatsNew.Body>
      </IdsWhatsNew>
    );
  },
};

/** Figma Preview Multiple (`27437:44134`) — click first section thumbnail. */
export const CarouselPreviewMultiple: Story = {
  name: "Carousel Preview Multiple",
  render: function CarouselPreviewMultipleRender() {
    const [dontShowAgain, setDontShowAgain] = useState(false);
    const section = WHATS_NEW_SPEC_DEMO_SECTIONS[0]!;
    const extraCount = Math.max(0, (section.images?.length ?? 0) - 1);

    return (
      <IdsWhatsNew
        open
        title={WHATS_NEW_SPEC_ACCURATE_DEFAULTS.title}
        description={WHATS_NEW_DESCRIPTION_NEWEST}
        versionNumber={WHATS_NEW_SPEC_ACCURATE_DEFAULTS.versionNumber}
        dontShowAgain={dontShowAgain}
        onDontShowAgainChange={setDontShowAgain}
      >
        <IdsWhatsNew.Body>
          <IdsWhatsNew.SectionsScroll>
            <IdsWhatsNew.Section id={section.id} isBookmarked={section.isBookmarked}>
              <IdsWhatsNew.Thumbnail extraCount={extraCount > 0 ? extraCount : undefined} />
              <IdsWhatsNew.SectionHeader>
                <IdsWhatsNew.BookmarkButton />
                <IdsWhatsNew.SectionTitle>{section.title}</IdsWhatsNew.SectionTitle>
              </IdsWhatsNew.SectionHeader>
              <IdsWhatsNew.Description>
                {WHATS_NEW_SAMPLE_SECTION_DESCRIPTION}{" "}
                <IdsWhatsNew.Link href={section.linkHref ?? "#"}>
                  {section.linkText ?? "guidance to manage"}
                </IdsWhatsNew.Link>
                {WHATS_NEW_DESCRIPTION_SUFFIX}
              </IdsWhatsNew.Description>
              <IdsWhatsNew.Images>
                {section.images?.map((image) => (
                  <IdsWhatsNew.Image
                    key={image.id}
                    id={image.id}
                    src={image.src}
                    alt={image.alt}
                    label={image.label}
                  />
                ))}
              </IdsWhatsNew.Images>
            </IdsWhatsNew.Section>
          </IdsWhatsNew.SectionsScroll>
        </IdsWhatsNew.Body>
      </IdsWhatsNew>
    );
  },
};

/** Convenience `sections[]` API — not the canonical codegen target. */
export const ConvenienceDataSections: Story = {
  name: "Convenience Data Sections",
  render: function ConvenienceDataSectionsRender() {
    const [dontShowAgain, setDontShowAgain] = useState(false);

    return (
      <IdsWhatsNew
        open
        description={WHATS_NEW_DESCRIPTION_NEWEST}
        sections={WHATS_NEW_SPEC_DEMO_SECTIONS}
        dontShowAgain={dontShowAgain}
        onDontShowAgainChange={setDontShowAgain}
      />
    );
  },
};

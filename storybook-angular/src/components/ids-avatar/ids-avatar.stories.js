/* IDS Avatar stories */
import { applicationConfig, moduleMetadata } from "@storybook/angular";
import { provideZoneChangeDetection } from "@angular/core";
import { SPEC_ACCURATE_DESIGN_STORY } from "../../../compiled/component-contracts/common/story-meta.js";
import {
  AVATAR_DEFAULT_ICON_SLUG,
  AVATAR_SPEC_ACCURATE_DEFAULTS,
} from "../../../compiled/component-contracts/ids/avatar.contract.js";
import { IdsAvatarComponent } from "../../../compiled/lib/angular/ids/avatar/ids-avatar.component.js";
import { IDS_AVATAR_IMPORTS } from "../../../compiled/lib/angular/ids/avatar/index.js";

/** @type {import("@storybook/angular").Meta<IdsAvatarComponent>} */
const meta = {
  title: "Spec Generated/IDS/Avatar",
  component: IdsAvatarComponent,
  tags: ["autodocs"],
  decorators: [
    applicationConfig({
      providers: [provideZoneChangeDetection()],
    }),
    moduleMetadata({
      imports: [...IDS_AVATAR_IMPORTS],
    }),
  ],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
IDS Avatar — circular chip with **centered** initials or icon.

\`\`\`html
<ids-avatar [icon]="'user-single'"></ids-avatar>
<ids-avatar [initials]="'JD'"></ids-avatar>
\`\`\`

Priority: \`imageSrc\` → \`icon\` → \`initials\`.
Chip: 32×32 · icon glyph: 16×16 · tokens from masthead User Settings chip.
        `.trim(),
      },
    },
  },
  argTypes: {
    initials: { control: "text" },
    icon: { control: "text" },
    imageSrc: { control: "text" },
    imageAlt: { control: "text" },
    size: { control: "number" },
    iconSize: { control: "number" },
  },
};

export default meta;

/** Brand surface so the white-ring chip is visible (masthead context). */
const brandSurface = `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: var(--color-background-masthead-base);
  border-radius: 8px;
`;

/** @type {import("@storybook/angular").StoryObj<IdsAvatarComponent>} */
export const SpecAccurateDesign = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  render: (args) => ({
    props: args,
    template: `
      <div style="${brandSurface}">
        <ids-avatar [initials]="initials"></ids-avatar>
      </div>
    `,
  }),
  args: {
    initials: AVATAR_SPEC_ACCURATE_DEFAULTS.initials,
  },
};

/** @type {import("@storybook/angular").StoryObj<IdsAvatarComponent>} */
export const Initials = {
  render: () => ({
    template: `
      <div style="${brandSurface}; gap: 16px;">
        <ids-avatar [initials]="'JD'"></ids-avatar>
        <ids-avatar [initials]="'DT'"></ids-avatar>
        <ids-avatar [initials]="'A'"></ids-avatar>
      </div>
    `,
  }),
};

/** @type {import("@storybook/angular").StoryObj<IdsAvatarComponent>} */
export const Icon = {
  render: () => ({
    template: `
      <div style="${brandSurface}">
        <ids-avatar [icon]="'${AVATAR_DEFAULT_ICON_SLUG}'"></ids-avatar>
      </div>
    `,
  }),
};

/** @type {import("@storybook/angular").StoryObj<IdsAvatarComponent>} */
export const SideBySide = {
  name: "Initials and Icon",
  render: () => ({
    template: `
      <div style="${brandSurface}; gap: 24px;">
        <ids-avatar [initials]="'JD'"></ids-avatar>
        <ids-avatar [icon]="'${AVATAR_DEFAULT_ICON_SLUG}'"></ids-avatar>
      </div>
    `,
  }),
};

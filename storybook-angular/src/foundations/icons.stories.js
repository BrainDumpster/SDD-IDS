import { CommonModule } from "@angular/common";
import { moduleMetadata } from "@storybook/angular";
import { tokens } from "./foundations-render.js";

const ALL_ICONS = tokens.icons || [];

/** @type {import("@storybook/angular").Meta} */
const meta = {
  title: "Foundations/Icons",
  decorators: [
    moduleMetadata({
      imports: [CommonModule],
    }),
  ],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    filter: { control: "text", name: "Filter" },
    limit: {
      control: { type: "number", min: 24, max: 500, step: 24 },
      name: "Max shown",
    },
  },
  args: {
    filter: "",
    limit: 120,
  },
};

export default meta;

/** @type {import("@storybook/angular").StoryObj} */
export const Gallery = {
  name: "Gallery",
  render: (args) => {
    const q = String(args.filter || "")
      .trim()
      .toLowerCase();
    const matched = q
      ? ALL_ICONS.filter((slug) => slug.includes(q))
      : ALL_ICONS;
    const limit = Math.max(1, Number(args.limit) || 120);
    const icons = matched.slice(0, limit);

    return {
      props: {
        icons,
        matchedCount: matched.length,
        totalCount: ALL_ICONS.length,
        shownCount: icons.length,
        filterLabel: q || "(none)",
      },
      template: `
        <div class="ids-foundations">
          <h1 class="ids-foundations__title">Icons</h1>
          <p class="ids-foundations__lede">
            IDS icon assets from <code>assets/icons</code>. Use the slug with
            <code>ids-icon</code> (<code>shapeName</code>) or
            <code>/assets/icons/&lt;slug&gt;.svg</code>.
            Filter and limit via the Controls panel.
          </p>
          <div class="ids-foundations__toolbar">
            <span class="ids-foundations__count">
              Filter: <code>{{ filterLabel }}</code>
              · Showing {{ shownCount }} of {{ matchedCount }} match{{ matchedCount === 1 ? '' : 'es' }}
              ({{ totalCount }} total)
            </span>
          </div>
          <div class="ids-foundations__icon-grid">
            <div class="ids-foundations__icon-tile" *ngFor="let icon of icons">
              <img
                class="ids-foundations__icon-glyph"
                [src]="'/assets/icons/' + icon + '.svg'"
                width="24"
                height="24"
                [alt]="icon"
                [title]="icon"
              />
              <span class="ids-foundations__icon-label">{{ icon }}</span>
            </div>
          </div>
        </div>
      `,
    };
  },
};

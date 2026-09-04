import { Component, provideZoneChangeDetection } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";

/**
 * Placeholder entry for the Angular `application` builder.
 * Storybook owns preview bootstrap; this file satisfies CLI/browserTarget wiring only.
 */
@Component({ selector: "ids-storybook-placeholder", template: "" })
class StorybookAngularPlaceholder {}

void bootstrapApplication(StorybookAngularPlaceholder, {
  providers: [provideZoneChangeDetection({ eventCoalescing: true })],
}).catch(() => {
  /* Storybook dev replaces the runtime; ignore bootstrap failures here. */
});

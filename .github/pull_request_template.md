# Design Handoff PR

- **Handoff package**: `handoffs/<package-name>/`
- **Design system**: <!-- e.g. Synapse, IDS -->
- **Type**: update existing | new component (new components need the designated design reviewer's approval)

## Affected components
- 

## Storybook updates
<!-- Stories added/updated, states covered. -->
- 

## Checks
- [ ] Uses design tokens (no hardcoded values a token covers)
- [ ] Component API unchanged, or changes documented above
- [ ] Stories cover the handoff's states (incl. dark theme if affected)
- [ ] Lint / typecheck / tests pass
- [ ] New component only: design reviewer approval requested

## After merge
Re-run `/design-sync` on the corresponding Claude design-system project to propagate the change.

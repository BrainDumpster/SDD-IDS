# Design Handoff PR

- **Handoff issue**: Closes #
- **Handoff package**: `handoffs/<package-name>/` (committed first on this branch)
- **Programme**: <!-- key or label from data/design-pipeline-registry.json, e.g. Synapse, IDS, DAP -->
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
- [ ] Design spec updated (if the programme has a `specRoot` and anatomy/states/tokens changed)
- [ ] Storybook build passes
- [ ] New component only: design reviewer approval requested

## After merge
Run `/design-pipeline resync <programme>` to rebuild the bundle, then `/design-sync` to push it
to the Claude design project. `/design-sync` is operator-run — it cannot be automated.

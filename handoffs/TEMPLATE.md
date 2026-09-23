# Design Handoff

<!-- This is the shape `/design-pipeline apply` writes into handoffs/<package-name>/HANDOFF.md
     from a design-handoff issue. Designers do not fill this in by hand — they use
     .github/ISSUE_TEMPLATE/design-handoff.yml in the browser. Kept here as the contract
     between the two, and for operators applying a package manually. -->

- **Handoff issue**: <!-- #<n> -->
- **Package name**: <!-- kebab-case, becomes branch handoff/<name> -->
- **Design system**: <!-- e.g. Synapse, IDS — the programme this change belongs to -->
- **Source root**: <!-- where its components live, e.g. src/components/ -->
- **Author**: 
- **Date**: 
- **Type**: update existing component | new component
- **Affected components**: <!-- exact component names as exported in code -->

## Intent
<!-- 1-3 sentences: what changed and why. -->

## What changed
<!-- Bullet the concrete changes: markup, styles, states, props. Paste extracted markup/CSS below or attach files in this folder. -->

## States / variants affected
<!-- Which variants, severities, sizes, themes (light/dark) the change touches — drives Storybook updates. -->

## Attachments in this folder
<!-- List files: extracted HTML/CSS, screenshots, the Claude handoff export. -->

## Notes for the developer
<!-- Anything ambiguous, plus what NOT to touch. -->

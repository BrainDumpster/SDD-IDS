# design-sync — Synapse

The real Synapse sync config lives at the **repo root**, not here:

- config:  `.design-sync/config.synapse.json`   (project 37675bab-666a-4259-85ce-6f0facfde4c3)
- notes:   `.design-sync/NOTES.synapse.md`
- ref sb:  `.design-sync/sb-reference-synapse/`
- out:     `ds-bundle-synapse/`

Reason: the converter resolves `.design-sync/` relative to **cwd**, and every path in the
config is repo-root relative, so all design-sync commands must run from the repo root.
The repo-root `.design-sync/config.json` is the separate **IDS** sync (project 3e6c53e3…).
Component names never collide (`Ids*` vs `Synapse*`), so both share `.design-sync/previews/`,
`.design-sync/.cache/` and `.design-sync/learnings/` safely.

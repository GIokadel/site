# Hunter Progress

## Last Run
- Date: 2026-03-28
- Agent: Hunter

## Fixed
- Updated `package.json` so `pnpm run lint` runs `eslint .` instead of printing CLI help.
- Reworded the starter message in `src/app/page.tsx` so it no longer assumes a Claude-style `/clone-website` slash command.
- Clarified `README.md` entries for generated files like `src/components/icons.tsx` and `scripts/download-assets.mjs`.

## Verified
- `pnpm run build`
- `pnpm run lint`

## Remaining
- No build or lint errors after the current fix batch.
- `node_modules` had to be installed locally before verification because the workspace started without dependencies.

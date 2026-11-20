<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Verification

- Run `npm run lint`, `npx tsc --noEmit`, and `npm run build`.
- Run `node --test tests/persistence.test.cjs` for mocked Neon concurrency, setup, Cloudinary receipt validation, and upload authorization tests. These tests do not contact external services or modify production data.
- Neon initialization is an explicit authenticated action in the admin dashboard. It creates application tables and inserts initial content without overwriting existing rows. Builds do not initialize the database.

## Publication authorization

Profile copy is approved. The prepared workflow deploys verified pushes to `main` and supports manual runs. An authorized push to `main` therefore initiates deployment. Do not stage changes, commit or rewrite history, create a GitHub repository, add a remote, push, run a deployment, or add the launch tag unless the existing session explicitly authorizes the relevant action.

## Project conventions

- Read `docs/architecture.md` before changing scope, `docs/design-system.md` before visual changes, `docs/content-guide.md` before content changes and `docs/deployment.md` before publication-related work.
- Preserve approved copy and the current single-Home information architecture unless the owner requests a change. The homepage order is Hero, Education, Projects, Competitions & Awards, Technical Skills. Keep the compact hero; there is no separate About page, Currently section, greeting or favicon.
- The public display name is Weishuo Zhao. Personal facts and links are owner-supplied; project summaries use the owner's latest wording after repository review. Typed data files are the maintained content source, with editing rules in `docs/content-guide.md`. Preserve the owner's current `approved` copy status; use `draft` for content that requires a new review. Public contact details follow the owner's explicit contact message.
- Contacts form a horizontal row of icon links labeled Email, GitHub and 知乎, with consistent spacing and natural wrapping on small screens. Do not display email addresses or account handles in this row. Section labels are 14px and content entry titles are 24px, defined centrally in typography.css. Project titles contain only their names; use the owner's latest supplied descriptions without implementation bullets or technology rows. Awards omit the organizer and use compact spacing; the footer shows only October, 2026.
- Show the name as the large Hero title and in the footer copyright. The header contains only Home and the theme control, aligned to the right; do not repeat the name at the top left.
- Keep personal content in typed `src/data/profile.ts`, `projects.ts`, `awards.ts` and `skills.ts`, independent of presentation components.
- Do not invent personal details, dates, achievements, projects, contact links, a CV or a portrait. Omit unconfigured optional UI and projects without approval.
- Use Astro components, strict TypeScript, Tailwind's Vite plugin and shared CSS tokens. Avoid unnecessary dependencies, client frameworks and unused content infrastructure.
- The owner-supplied avatar is `src/assets/avatar.jpg`. Keep its configurable source path in `profile.ts`, resolve the asset in Astro, and use responsive `Picture` handling with meaningful alt text and reserved square dimensions. Display it in a circle through CSS, beside the text on desktop and after the introduction on mobile.
- Preserve accessible landmarks, heading order, focus styles, 44px controls, system theme behavior and reduced-motion support.
- Run `pnpm format:check`, `pnpm check` and `pnpm build` after changes. Use `pnpm test:browser` when changing navigation, themes, responsive layout or accessibility; inspect screenshots when appearance changes.
- Summarize meaningful architecture or design decisions, update the relevant documentation and report what was verified.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

Use the configured scripts: `pnpm dev`, `pnpm dev:stop`, `pnpm dev:status`, `pnpm dev:logs`. `pnpm dev` also binds `0.0.0.0` for Windows/WSL previews. Use Node 24 from `.nvmrc` and pnpm from the `packageManager` field.

Manage a background server in the same execution environment in which it was started. A sandbox may not recognize the PID of a server started outside it; a status query there can incorrectly remove Astro's management record. Use the permitted server environment for status/logs/stop commands.

Browser tests build on the existing `dist/` and manage a temporary production preview on port 4322. The Playwright preview uses `--ignore-lock` to prevent Astro's agent detection from detaching the test-managed process. Development servers must still use background mode. `pnpm test:hmr` requires the background development server on port 4321 and briefly changes/restores one CSS color token.

## Publishing

`src/data/site.ts` records the real root URL and intended `Scott-Chao/Scott-Chao.github.io` repository. The workflow runs on pushes to `main` and through `workflow_dispatch`, with both paths restricted to `main`. Draft pages have `noindex` and `pnpm check:launch` refuses them; approved Home copy is indexable. Copy approval alone does not authorize remote operations. Add `v1.0-birthday` only after an authorized, successful production deployment.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

# Architecture and scope

## Product direction

This is Weishuo Zhao's personal homepage, combining a personal introduction with an emerging research identity in artificial intelligence. It should remain easy to maintain and grow into a research portfolio and technical writing site as real content becomes available.

English is the primary language. Fonts support occasional Chinese text, including the existing Zhihu contact label. There is no bilingual routing or translation system in v1.

## Current scope

Home is the only content page, with a separate 404 fallback. The homepage order is Hero, Education, Projects, Competitions & Awards, Technical Skills. The header contains Home and the theme control. There is no separate About page, Currently section, greeting eyebrow or favicon.

Keep Home concise. Unconfigured optional contacts, images and downloads are omitted, and Projects disappears when there are no approved entries. Do not add empty navigation destinations or placeholder achievements.

V1 excludes blog infrastructure, CMS, databases, user accounts, comments, analytics, newsletters, project filters and elaborate animation. Future research and writing sections need real content and an explicit scope decision before implementation.

## Technical decisions

- Astro renders static HTML for GitHub Pages. There is no server runtime or backend service.
- TypeScript uses strict mode. Personal content lives in typed data files rather than presentation components.
- Tailwind uses its Vite plugin. Shared CSS tokens and typography rules provide the design foundation.
- Ordinary Astro components handle presentation. Add a client framework only when a concrete interaction warrants it; avoid unused dependencies or content infrastructure.
- Small browser scripts provide theme selection, persistence and synchronization. Core content and links work without JavaScript.
- Local fonts and responsive Astro images avoid external font requests and reserve image space. The owner supplies the avatar; do not generate or invent a portrait.
- No secrets belong in source code or generated browser assets.
- Node 24 is selected by `.nvmrc`; `package.json` pins pnpm. Keep `pnpm-lock.yaml` and `pnpm-workspace.yaml` as reproducible dependency and build-script configuration.

## Responsibilities

| Location                           | Responsibility                                                        |
| ---------------------------------- | --------------------------------------------------------------------- |
| `src/data/profile.ts`              | Identity, introduction, education, contacts, avatar and copy approval |
| `src/data/projects.ts`             | Approved project names, descriptions and links                        |
| `src/data/awards.ts` / `skills.ts` | Competition results and skill groups                                  |
| `src/data/site.ts`                 | Production URL, intended repository and establishment month           |
| `src/components/home/`             | Homepage section presentation                                         |
| `src/components/layout/` / `ui/`   | Navigation, footer and shared controls                                |
| `src/layouts/BaseLayout.astro`     | Landmarks, metadata, fonts/styles and initial theme                   |
| `src/styles/`                      | Tokens, typography and shared layout rules                            |
| `scripts/` / `tests/`              | Local verification and publication checks                             |
| `.github/workflows/deploy.yml`     | GitHub Pages publication on main-branch pushes or manual runs         |

Pages have a meaningful title and description, canonical URL and Open Graph metadata. Draft copy retains `noindex`; the 404 page is always excluded from indexing and the sitemap. Do not invent a social preview image or restore the removed favicon without an owner request.

## Extension points

Typed data is sufficient for the current site. When projects or writing need full articles or larger collections, migrate the relevant content into Astro Content Collections and add populated routes. Avoid creating an unused MDX pipeline in advance.

Future diagrams, code and media may use the wider page measure while ordinary paragraphs retain a readable text measure. Preserve accessible landmarks, heading order, keyboard focus, theme behavior and reduced-motion support as the site grows.

## Maintenance documents

- [Design system](./design-system.md): visual decisions and responsive behavior.
- [Content guide](./content-guide.md): authoring rules and current public information.
- [Deployment guide](./deployment.md): root hosting, workflow gates and authorized publication.
- [README](../README.md): environment setup, commands and project overview.
- [Agent instructions](../AGENTS.md): authorization rules and contribution conventions.

Keep these documents aligned with implementation and the owner's latest decisions. Current profile copy is approved. Copy approval does not itself authorize Git or remote operations; an authorized push to `main` triggers deployment after the workflow checks pass.

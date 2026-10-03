# Weishuo Zhao's personal website

A static personal homepage built with Astro, strict TypeScript and Tailwind CSS. The site uses English content, supports occasional Chinese text, and combines editorial typography with a compact responsive layout and light/dark themes.

**Current status: ready for publication.** Profile copy is `approved`. After GitHub Pages setup, pushes to `main` automatically verify and deploy the site; manual deployment remains available. Git and remote operations still require owner authorization.

## Homepage

Home is the only content page, with a separate 404 fallback. Its sections are:

1. Hero: name, introduction, circular avatar and horizontal Email, GitHub and Zhihu links.
2. Education: Yuanpei College, Peking University.
3. Projects: Forge Bedrock and Game of the Amazons.
4. Competitions & Awards.
5. Technical Skills.

The header contains Home and the theme control. Section labels use 14px type, entry titles use 24px, and wrapped labels align their text independently of the section numbers. There is no separate About page, Currently section, greeting or favicon. The footer shows `Established October, 2026`.

## Maintenance documentation

| Document                                         | Purpose                                                            |
| ------------------------------------------------ | ------------------------------------------------------------------ |
| [Architecture and scope](./docs/architecture.md) | Product direction, technical decisions and future extension points |
| [Design system](./docs/design-system.md)         | Tokens, typography, layout and interaction rules                   |
| [Content guide](./docs/content-guide.md)         | Personal data, authoring conventions and copy approval             |
| [Deployment guide](./docs/deployment.md)         | GitHub Pages configuration and future authorized publication       |
| [Agent instructions](./AGENTS.md)                | Authorization rules and contribution conventions                   |

These documents describe the current implementation and should be updated when the owner approves a change.

## Development in WSL2

Use Node.js 24 from `.nvmrc` and pnpm 11.20.0 from the `packageManager` field in `package.json`.

```sh
cd ~/projects/personal-website
nvm install
nvm use
pnpm install --frozen-lockfile
pnpm dev
```

If pnpm is not installed, run `npm install --global pnpm@11.20.0` first.

`pnpm dev` runs `astro dev --background --host 0.0.0.0` and returns control to the terminal. Open **http://localhost:4321/** in a Windows browser. Astro updates the page when components, styles or data change.

If Windows localhost forwarding is unavailable, use the WSL Network URL printed by Astro.

```sh
pnpm dev:status
pnpm dev:logs
pnpm dev:stop
```

Manage the background server in the same execution environment where it was started. Use Astro's background controls to avoid starting duplicate servers. To change ports, stop the current server and run `pnpm dev --port 4323`.

## Commands

| Command                                                | Purpose                                                                       |
| ------------------------------------------------------ | ----------------------------------------------------------------------------- |
| `pnpm dev`                                             | Start the background development server on port 4321                          |
| `pnpm dev:status`                                      | Show development server status                                                |
| `pnpm dev:logs`                                        | Read background development logs                                              |
| `pnpm dev:stop`                                        | Stop the development server                                                   |
| `pnpm check`                                           | Check Astro and TypeScript                                                    |
| `pnpm format`                                          | Format source and maintenance documents                                       |
| `pnpm format:check`                                    | Check formatting                                                              |
| `pnpm build`                                           | Generate the static site in `dist/`                                           |
| `pnpm preview --background --host 0.0.0.0 --port 4322` | Start a background production preview                                         |
| `pnpm astro preview stop`                              | Stop the background production preview                                        |
| `pnpm test:browser`                                    | Verify the existing build with a temporary preview on port 4322               |
| `pnpm test:hmr`                                        | Verify CSS updates on the running development server, then restore the source |
| `pnpm check:launch`                                    | Check built copy approval, canonical URL and intended repository              |

## Verification

Install Chromium before the first browser run:

```sh
pnpm exec playwright install chromium
pnpm format:check
pnpm check
pnpm build
pnpm test:browser
```

On Ubuntu, use `pnpm exec playwright install --with-deps chromium` if browser system dependencies are missing.

Browser tests use the existing `dist/` and manage a temporary production preview on port 4322. Stop any manual preview on that port before running them; the development server can remain on port 4321. The test preview uses `--ignore-lock` so Astro does not detach the process from Playwright.

The suite covers desktop, mobile and tablet layouts, 280px and 320px narrow screens, both themes, avatar loading, contact destinations, section order, the first viewport, keyboard navigation, theme persistence and synchronization, disabled JavaScript, unavailable storage, internal assets, the sitemap and 404. Desktop/mobile combinations also run automated WCAG scans and save full-page screenshots in `test-results/`. Failed tests retain a Playwright trace.

`pnpm test:hmr` requires the background development server on port 4321 and briefly changes and restores a CSS color token. `pnpm check:launch` verifies publication readiness after a build; it passes with the current approved copy and rejects future drafts without preventing local development.

## Project structure

```text
src/
  assets/avatar.jpg  Owner-supplied avatar
  components/
    layout/          Header and Footer
    ui/              ThemeToggle, ProfileLinks and Icon
    home/            Homepage sections
  data/
    profile.ts       Identity, education, contacts, avatar and copy approval
    projects.ts      Project descriptions and links
    awards.ts        Competitions and results
    skills.ts        Skill groups
    site.ts          Production URL, intended repository and establishment month
  layouts/
    BaseLayout.astro Shared layout, metadata and theme initialization
  pages/
    index.astro
    404.astro
  styles/
    tokens.css       Colors, fonts, widths and spacing
    typography.css   Local fonts and shared type rules
    global.css       Tailwind entry and shared layout
docs/                Architecture, design, content and deployment guides
scripts/             HMR and launch readiness checks
tests/               Browser verification
.github/workflows/
  deploy.yml         Automatic main-branch and manual publication workflow
```

## Editing content and design

Edit personal information in `src/data/profile.ts`; projects, competitions and skills belong in their corresponding typed data files. Components provide presentation, with optional values omitted when unconfigured. A downloadable CV is not configured.

The avatar source is `src/assets/avatar.jpg`. Its path, alt text and crop position are configured in the profile; Astro generates responsive image variants and reserves a square frame. CSS creates the circle. The avatar appears beside the introduction on desktop and after it on mobile.

Design tokens, shared typography and layout rules live in `src/styles/`. Newsreader and Inter fonts are bundled locally with system and Chinese fallbacks. Theme selection follows the operating system until overridden, persists locally and is applied before styles load. Core content and navigation work without JavaScript.

Read the [content guide](./docs/content-guide.md) and [design system](./docs/design-system.md) before making changes. The [architecture guide](./docs/architecture.md) records scope limits and the path to future populated research or writing sections.

## GitHub Pages

The prepared configuration targets `Scott-Chao/Scott-Chao.github.io` at **https://scott-chao.github.io/**. This is a user homepage at the root path, so Astro does not configure a repository subpath.

Every push to `main` starts formatting, type, build, publication and browser checks, then deploys the static site if all checks pass. The workflow also supports manual runs on `main` without additional inputs. Draft copy still blocks deployment. See the [deployment guide](./docs/deployment.md) for initial Pages setup and publication steps. The workflow has not been run against GitHub.

## Generated files

`.gitignore` excludes build output, Astro state, dependencies, the local pnpm store, browser reports, test results, coverage, logs and local environment files. `.prettierignore` skips generated directories as well. Source images, data, tests, documentation, workflow files and the dependency lockfile remain eligible for version control.

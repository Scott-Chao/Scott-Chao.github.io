# GitHub Pages deployment

## Target and hosting model

| Setting        | Value                             |
| -------------- | --------------------------------- |
| Repository     | `Scott-Chao/Scott-Chao.github.io` |
| Production URL | `https://scott-chao.github.io/`   |
| Source branch  | `main`                            |
| Astro output   | `static`                          |
| Public root    | `/`                               |
| Build artifact | `dist/`                           |
| Pages source   | GitHub Actions                    |

The URL and repository are recorded in `src/data/site.ts`. `astro.config.mjs` reads the URL and leaves `base` unset, using Astro's default `/`. The special username repository serves the homepage at the root, so it does not need a repository path such as `/Scott-Chao.github.io/`. See the [Astro GitHub Pages guide](https://docs.astro.build/en/guides/deploy/github/).

The build produces `dist/index.html` and `dist/404.html`. Internal assets use root paths such as `/_astro/`; canonical and Open Graph URLs use the production origin. The sitemap includes Home and omits 404. No custom domain is configured.

## Automatic and manual workflow

`.github/workflows/deploy.yml` runs automatically on every push to `main` and also supports `workflow_dispatch` for manual deployment or retries. Both paths restrict the build to `main`; other branches and tag pushes do not deploy. There is no extra publication input. This follows GitHub's [branch-filtered push trigger](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#push).

The build job:

1. Checks out source and selects Node from `.nvmrc`.
2. Installs the pnpm version declared in `package.json`, with a lockfile-based package-store cache.
3. Installs locked dependencies with strict peer checks.
4. Checks formatting and Astro/TypeScript, then builds the static site.
5. Runs `pnpm check:launch` against the built homepage.
6. Installs Chromium and runs the browser suite against a temporary production preview.
7. Configures Pages and uploads only `dist/` as the Pages artifact.

The deployment job depends on a successful build, uses the `github-pages` environment and exposes the deployed URL. It has `pages: write` and `id-token: write` permissions; source access remains `contents: read`. These dependencies, permissions and environment match [GitHub's custom workflow requirements](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

The configured action versions have been checked against their published definitions: `actions/checkout@v7`, `actions/setup-node@v7`, `pnpm/action-setup@v6`, `actions/configure-pages@v6`, `actions/upload-pages-artifact@v5` and `actions/deploy-pages@v5`. The pnpm action reads `packageManager` and supports the configured cache input; see its [installation and cache documentation](https://github.com/pnpm/action-setup).

## Local readiness checks

```sh
pnpm format:check
pnpm check
pnpm build
pnpm test:browser
pnpm check:launch
```

`pnpm check:launch` reads `dist/index.html`. It rejects `noindex` draft copy, an unexpected canonical URL or, when `GITHUB_REPOSITORY` is set by Actions, a repository other than the configured user homepage repository. Repository comparison is case-insensitive. Run it after rebuilding to avoid checking stale output.

The owner has approved the current profile copy, and `copyStatus` is `approved`. Launch readiness should pass after a fresh build. Future drafts still block publication, while normal builds and local previews remain available. Copy approval alone does not authorize remote operations; an authorized push to `main` triggers deployment after verification.

## Publication after explicit authorization

Repository creation, remote configuration, pushes, manual workflow dispatch and Pages settings changes require owner authorization. Automatic deployment is part of an authorized push to `main` with the current workflow.

Once the owner authorizes the relevant actions:

1. Complete content and design approval, and set `profile.copyStatus` to `approved`.
2. Run the local readiness checks above.
3. Create or connect the intended repository, using only authorized commit and remote operations. Set its default branch to `main`.
4. In repository Settings → Pages, select **GitHub Actions** as the publishing source. Confirm the `github-pages` environment permits deployment from `main`.
5. Push the reviewed source to `main`; this starts deployment automatically. If source was pushed before Pages setup, finish setup and open **Actions → Publish reviewed website to GitHub Pages → Run workflow**, select `main` and run it without additional inputs.
6. Verify the production homepage, root assets, contact links, theme behavior, sitemap and 404 page.
7. Add `v1.0-birthday` only after an authorized, successful first deployment.

Local inspection verifies the configuration and generated artifact. Repository settings, environment protection and the full hosted Actions run must be checked during an authorized publication; they have not been exercised locally.

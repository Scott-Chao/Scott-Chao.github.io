# Content guide

## Current publication state

The display name is Weishuo Zhao. The owner has supplied the personal facts, project identities, two competition results and three skill groups. Typed files in `src/data/` are the maintained content source. Home is organized as Hero, Education, Projects, Competitions & Awards, Technical Skills. The hero introduces undergraduate AI studies; `biography` is empty. There is no Currently section, separate About page, greeting eyebrow or favicon.

The current education entry is `Yuanpei College, Peking University`, with the confirmed program, `2025 – Present` dates and Beijing location in `profile.ts`. Keep the owner's public email `wszhao25@stu.pku.edu.cn` and the supplied GitHub and Zhihu links. The two projects and overall profile copy are approved for publication; `copyStatus` is `approved`. A downloadable CV is not configured. Missing optional values do not produce placeholder links, frames or sections.

## Edit personal information

Use `src/data/profile.ts` as the single source of truth. Components should contain layout labels, not copies of personal facts.

| Field                               | Use                                                               |
| ----------------------------------- | ----------------------------------------------------------------- |
| `displayName`                       | Home heading, metadata and footer; not repeated in the header     |
| `intro`                             | Short Home introduction and default metadata description          |
| `biography`                         | Supplementary Home paragraphs; avoid repeating the introduction   |
| `education.institution` / `program` | Shared education entry                                            |
| `education.dateRange`               | Optional confirmed dates; never infer an entry/graduation year    |
| `education.location`                | Optional location confirmed by the owner                          |
| `education.details`                 | Optional confirmed detail shown in the Home education section     |
| `githubUrl`                         | Verified HTTPS profile URL                                        |
| `zhihuUrl`                          | Verified HTTPS Zhihu profile URL                                  |
| `email`                             | Public email; set `undefined` to omit Email links                 |
| `cvUrl`                             | Verified HTTPS URL or root-relative PDF path                      |
| `portrait`                          | Optional approved local image, alternative text and crop position |
| `copyStatus`                        | `draft` during review; `approved` after explicit owner approval   |

Use `undefined` for an omitted optional value. Never use guessed details, `example.com`, fake email addresses or a synthetic portrait. Mixed Chinese/English text works through the configured system fallbacks; v1 has no translation routing.

Draft content includes `noindex, follow` metadata. Approved Home copy omits that directive after rebuilding; 404 always remains excluded from indexing. `pnpm check:launch` examines the built homepage and refuses drafts through the workflow. Copy approval does not itself authorize remote operations. Once Pages is configured, an authorized push to `main` automatically checks and deploys the site.

## Update the avatar

The owner's original `头像.jpg` has been renamed and moved to `src/assets/avatar.jpg`. It is a smiling cloud illustration, so its alt text identifies it as an avatar. To replace it, put an approved image in `src/assets/` and update the configured source path:

```ts
portrait: {
  src: '/src/assets/avatar.jpg',
  alt: "Weishuo Zhao's avatar, a smiling cloud with pink cheeks",
  position: 'center',      // For example, '50% 35%' moves the focal point upward.
},
```

The profile stores a typed source path; the hero resolves the image with Astro's `import.meta.glob` and `Picture`. This keeps image loading in the presentation layer and profile data readable by scripts and tests. Astro creates AVIF/WebP variants and responsive widths, and reserves a square frame to avoid layout shifts. The circular display is applied with CSS. Supported configured input formats include JPEG, PNG, WebP, AVIF and GIF. Inspect the crop at both desktop and mobile widths. Use `portrait: undefined` to omit the avatar.

The current public contacts are `wszhao25@stu.pku.edu.cn`, `https://github.com/Scott-Chao` and `https://www.zhihu.com/people/scott-76-76-58`. The hero displays only the short labels Email, GitHub and 知乎 with the existing icons in a horizontal row that wraps as needed. Email opens a valid `mailto:` link and profile links use the exact supplied URLs. Do not display the underlying addresses or account handles in the contact row.

## Add genuine projects

Edit the typed array in `src/data/projects.ts`. Each project needs `id`, `approved`, `title` and `description`. Optional fields are `date`, `repositoryUrl` and `demoUrl`. Write one brief paragraph for general homepage readers, concentrating on the purpose and what the project does. Implementation bullets and technology rows have been removed. Keep `id` unique and use a short URL-safe value, because it also labels the project heading.

The current entries are Forge Bedrock and Game of the Amazons, both dated 2026, with owner-supplied repository URLs. Their titles contain only the project names and the descriptions use the owner's latest wording, including the GPT language model and MCTS agent. That wording supersedes the earlier general summaries from repository review. Add only real work and verified links. Keep descriptions concrete and avoid unverified outcomes. Set `approved: true` only when the title, description and links are approved for display. Entries with `approved: false` remain hidden. An empty approved list omits Projects entirely.

The earlier repository review covers [Forge Bedrock's README](https://github.com/Scott-Chao/Forge-Bedrock/blob/main/README.md), [architecture](https://github.com/Scott-Chao/Forge-Bedrock/blob/main/ARCHITECTURE.md), [automatic differentiation code](https://github.com/Scott-Chao/Forge-Bedrock/blob/main/core/autograd/value.py) and [diffusion implementation](https://github.com/Scott-Chao/Forge-Bedrock/blob/main/core/gen/diffusion.py). These references record its broader scope; the current homepage uses the owner's subsequent wording, with GPT as an example.

[Game of the Amazons](https://github.com/Scott-Chao/Game-of-the-Amazons#readme) provides a graphical game, local two-player and AI modes, and resumable saved games, corroborated by its [controller](https://github.com/Scott-Chao/Game-of-the-Amazons/blob/main/game_of_the_amazons/game_controller.cpp) and [model](https://github.com/Scott-Chao/Game-of-the-Amazons/blob/main/game_of_the_amazons/game_model.cpp). Descriptions summarize implemented functionality; this review did not compile the repositories or establish performance claims.

## Update competitions and skills

Edit competition records in `src/data/awards.ts`: `id`, `title`, `organizer`, `date`, `result` and optional `repositoryUrl`. The current records are the 2026 Jiang Zehan Cup Mathematical Modeling Competition and Jiukun Cup Programming Contest, both Peking University Third Prizes. The organizer is retained as source data and omitted from the visible competition entries. Only the modeling competition has a supplied repository link. Do not infer rankings, team roles, participant counts or results from a repository name.

Edit technical skills in `src/data/skills.ts`. Each group has a `category` and an `items` list. The current categories are Programming (Python, C/C++), ML Frameworks & Libraries (PyTorch, NumPy) and Tools (Git, Linux, Jupyter, LaTeX). Use plain categories and lists rather than unsupported proficiency ratings. An empty awards or skills list hides its section.

The footer's visible establishment label and machine-readable month are in `src/data/site.ts`: `October, 2026` and `2026-10`. Do not restore the specific day in the displayed footer.

## Future sections

Add Research, Projects or Writing navigation only when it has populated destinations. When entries need full articles or larger collections, move the data into Astro Content Collections and add the relevant page templates. Existing typed data provides a small starting model; there is no unused blog, CMS or MDX pipeline in v1.

For a new section, add real content, update the navigation if warranted, review design consistency and document any new authoring conventions. Keep Home concise and preserve the single-page structure until the owner requests additional pages.

## Review before publication

Review the Home wording, public contact details, avatar crop and alt text, education dates and every visible link. Confirm that omitted data is intentional. After owner approval, set `copyStatus: 'approved'`, format, check and rebuild, then run `pnpm check:launch`. Follow the [deployment guide](./deployment.md) only after explicit authorization to publish. Tag `v1.0-birthday` only after the first successful production deployment.

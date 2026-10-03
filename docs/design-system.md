# Design system

## Principles

Swiss minimalism supplies the grid and hierarchy; editorial type adds warmth. Content, whitespace and fine rules carry the page. Use the same restrained visual language as genuine projects and writing are added. Avoid decorative backgrounds, gradients, skill bars, elaborate animation and card-heavy layouts.

Home is the single content page, with a separate 404 fallback. Its order is Hero, Education, Projects, Competitions & Awards, Technical Skills. Content is owner-supplied; the display name is Weishuo Zhao. There is no separate About page or Currently section. Sections without real content disappear. The hero supports an optional circular avatar and remains a complete layout if the image is omitted. Keep personal facts and approved copy in data files. Product scope and technical boundaries are recorded in the [architecture guide](./architecture.md).

## Color tokens

Defined in `src/styles/tokens.css`.

| Purpose                       | Light     | Dark      |
| ----------------------------- | --------- | --------- |
| Background                    | `#FAF9F6` | `#181A1B` |
| Foreground                    | `#252525` | `#E8E6E3` |
| Accent and links              | `#486A83` | `#91B5D0` |
| Secondary text                | `#686864` | `#A0A29F` |
| Separators                    | `#DEDDD7` | `#36393A` |
| Control hover / image surface | `#F0EFEA` | `#242729` |

Foreground, secondary text and link colors meet WCAG AA on their corresponding backgrounds. Separators are decorative; focus outlines use the accent color. Color changes must be checked in both themes. Tailwind's `page`, `ink`, `link` and `secondary` colors map to these CSS tokens.

## Typography

Newsreader Variable is used for display headings. Inter Variable is used for body copy and navigation. The two Latin WOFF2 files are bundled locally through Fontsource, with `font-display: swap`; visitors make no requests to an external font provider. System sans-serif and serif fallbacks include Chinese fonts.

| Element                    | Desktop                               | Small screens |
| -------------------------- | ------------------------------------- | ------------- |
| Home name                  | Up to 72px; regular; 1.12 line height | 40px minimum  |
| Home introduction          | Up to 18px; 1.65 line height          | 16px minimum  |
| Institution heading        | 24px; 1.35 line height                | 24px          |
| Project title              | 24px; 1.35 line height                | 24px          |
| Competition title          | 24px; 1.35 line height                | 24px          |
| Supplementary biography    | 16px; 1.65 line height                | 16px          |
| General body text          | 16px; 1.7 line height                 | 16px          |
| Project details / skills   | 15px; 1.7 line height                 | 15px          |
| Navigation / contact links | 14px                                  | 14px          |
| Section labels             | 14px; 0.07em letter spacing           | 14px          |
| Footer                     | 12px                                  | 12px          |

Use one `h1` per page, section `h2` headings and entry `h3` headings. The section-label and entry-title scales are defined once in `typography.css`; education, projects and competitions share the same 24px entry title. Uppercase letter spacing is reserved for short editorial labels. Ordinary paragraphs should remain within the content measure. Avoid long all-caps text.

## Layout and spacing

- Page maximum width: **1024px**; content maximum width: **704px**.
- Horizontal gutter: `clamp(24px, 5vw, 48px)`.
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64 and 96px.
- Header height: 80px, reduced to 72px below 640px. Only Home and the theme control appear, aligned to the right; omit the repeated name at the top left.
- Hero padding: 48px vertically, reduced to 32px below 768px. Remove the greeting eyebrow and use a 16px gap below the name. Keep the introduction compact so education and the start of projects are visible in a typical desktop first viewport.
- Section grid: 176px label column, 32px gap and a flexible content column. Each section begins with a thin rule and has 32px vertical padding.
- Within section labels, the number and title are separate columns with a 12px gap. Align their first baselines and keep wrapped title lines aligned with the title's first line.
- Below 640px, sections become one column with a 16px gap and 32px vertical padding.
- An optional circular avatar sits beside the hero at 768px and above, vertically centered with a 48px gap. Its 192 × 192px frame becomes 128 × 128px below that breakpoint, following the introduction and contact links with a 24px gap. A square aspect ratio reserves space; `border-radius: 50%` and clipping create the circle. Use a centered crop by default and preserve the supplied image colors.
- Future wide media may use the page measure while paragraphs retain the content measure.

## Components and interaction

`BaseLayout` owns metadata, the skip link and shared header/footer. `Header` displays Home and a compact theme control; the current page has an underline and `aria-current`. The hero shows the large full name, a short introduction and a horizontal contact row; its supplementary biography is currently empty. There is no “Hello, I'm” greeting or favicon. `ProfileLinks` uses a semantic list of mail, GitHub and chat icons with the short labels Email, GitHub and 知乎. Links retain 44px targets, 8px between each icon and label, and 32px between links. The flex row wraps naturally with an 8px row gap when space is insufficient. Addresses and account handles are not displayed. The actual email destination remains a valid `mailto:` address. Education follows the hero and displays the degree program, confirmed dates and location. Home components read typed data without defining personal copy.

Projects use simple separated entries with one short, repository-grounded paragraph, year and descriptive repository/demo links. Keep implementation details in the linked repositories; omit technical bullet lists and technology rows on Home. Competitions show the name, year, result and optional project link, without a separate organizer line. Consecutive competition entries use 12px of margin and 12px of padding around their divider. Skills use a semantic definition list with Programming, ML Frameworks & Libraries and Tools, with a 208px desktop category column; there are no proficiency bars or scores. The footer uses the same full name as the hero and shows `Established October, 2026` with month precision in the `time` element.

The theme follows the OS until the visitor explicitly chooses a theme. The choice persists under `scott-theme` in local storage and synchronizes between tabs. A small script in the document head applies the theme before styling; the accessible button is initialized by a separate small script. Its stable accessible name is “Dark theme”; `aria-pressed` indicates whether dark mode is enabled and the tooltip describes the next action, following the [W3C button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/). Without JavaScript, content and navigation work, the theme follows the OS through CSS, and the inactive control is hidden.

Controls use a minimum 44px height and visible accent focus outlines. Hover styles are subtle. There is no entrance animation. Reduced-motion preferences disable animation and transitions. Check 320px, 390px, tablet and desktop widths when changing layout.

## Verification and design changes

Run formatting, Astro checks and the static build after visual changes. `pnpm test:browser` checks the homepage in light/dark mode, desktop/mobile/tablet layouts, avatar loading and circular framing, contact destinations, the homepage section order, the compact first viewport, favicon removal, keyboard focus, theme behavior, the 404 fallback and automated WCAG rules. Screenshots wait for image decoding and are written to `test-results/`. Inspect them alongside the automatic results; automated scans are not a substitute for reading and navigating the page.

Update this document whenever a substantial visual decision changes. Preserve the approved information architecture and copy unless the owner requests changes.

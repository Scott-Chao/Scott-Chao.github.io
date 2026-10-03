import { readFile } from 'node:fs/promises';
import { site } from '../src/data/site.ts';

const errors = [];
const repository = process.env.GITHUB_REPOSITORY;

if (repository && repository.toLowerCase() !== site.repository.toLowerCase()) {
  errors.push(`Root hosting requires the repository ${site.repository}.`);
}

for (const [file, route] of [['index.html', '/']]) {
  try {
    const html = await readFile(
      new URL(`../dist/${file}`, import.meta.url),
      'utf8',
    );
    const robots = html.match(/<meta\b[^>]*name="robots"[^>]*>/i)?.[0] ?? '';
    if (/noindex/i.test(robots)) {
      errors.push(
        `${route} contains draft copy. Review src/data/profile.ts and approve copyStatus before launch.`,
      );
    }
    if (
      !html.includes(`rel="canonical" href="${new URL(route, site.url).href}"`)
    ) {
      errors.push(
        `${route} does not have the expected production canonical URL.`,
      );
    }
  } catch {
    errors.push(
      `Cannot read dist/${file}. Run pnpm build before checking launch readiness.`,
    );
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Launch checks passed for ${site.url}`);
}

import type { ExternalUrl } from './profile';

export interface Award {
  id: string;
  title: string;
  organizer: string;
  date: string;
  result: string;
  repositoryUrl?: ExternalUrl;
}

// Competition results and the repository link come from the owner's CV.
export const awards: readonly Award[] = [
  {
    id: 'jiang-zehan-cup',
    title: 'Jiang Zehan Cup Mathematical Modeling Competition',
    organizer: 'Peking University',
    date: '2026',
    result: 'Third Prize',
    repositoryUrl:
      'https://github.com/Scott-Chao/JiangZehanCup-2026-Traffic-Network-Robustness',
  },
  {
    id: 'jiukun-cup',
    title: 'Jiukun Cup Programming Contest',
    organizer: 'Peking University',
    date: '2026',
    result: 'Third Prize',
  },
];

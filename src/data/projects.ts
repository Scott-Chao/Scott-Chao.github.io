import type { ExternalUrl } from './profile';

export interface Project {
  id: string;
  approved: boolean;
  title: string;
  description: string;
  date?: string;
  repositoryUrl?: ExternalUrl;
  demoUrl?: ExternalUrl;
}

// The owner supplied the current names and descriptions after repository review.
export const projects: readonly Project[] = [
  {
    id: 'forge-bedrock',
    approved: true,
    title: 'Forge Bedrock',
    description:
      'A hands-on exploration of machine learning fundamentals through implementing core algorithms and model components from scratch, including a GPT-style language model.',
    date: '2026',
    repositoryUrl: 'https://github.com/Scott-Chao/Forge-Bedrock',
  },
  {
    id: 'game-of-the-amazons',
    approved: true,
    title: 'Game of the Amazons',
    description:
      'A C++ implementation of the Amazons strategy game, featuring an MCTS-based AI agent with heuristic evaluation and optimized search.',
    date: '2026',
    repositoryUrl: 'https://github.com/Scott-Chao/Game-of-the-Amazons',
  },
];

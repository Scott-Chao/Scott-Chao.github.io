export interface SkillGroup {
  category: string;
  items: readonly string[];
}

// Keep skills factual; do not add proficiency scores or infer additional tools.
export const skills: readonly SkillGroup[] = [
  { category: 'Programming', items: ['Python', 'C/C++'] },
  { category: 'ML Frameworks & Libraries', items: ['PyTorch', 'NumPy'] },
  { category: 'Tools', items: ['Git', 'Linux', 'Jupyter', 'LaTeX'] },
];

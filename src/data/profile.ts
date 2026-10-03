export type ExternalUrl = `https://${string}`;

export interface Profile {
  displayName: string;
  /** Keep draft until the owner approves all public copy for launch. */
  copyStatus: 'draft' | 'approved';
  intro: string;
  biography: readonly string[];
  education: {
    institution: string;
    program: string;
    dateRange?: string;
    location?: string;
    details?: string;
  };
  githubUrl?: ExternalUrl;
  zhihuUrl?: ExternalUrl;
  email?: string;
  cvUrl?: ExternalUrl | `/${string}`;
  portrait?: {
    /** Project path to an approved local image; resolved by Astro in the hero. */
    src: `/src/assets/${string}`;
    alt: string;
    position?: string;
  };
}

// Owner-approved copy. Avatar and public contacts are owner-supplied.
// Missing optional details are intentionally undefined, never placeholder URLs.
export const profile: Profile = {
  displayName: 'Weishuo Zhao',
  copyStatus: 'approved',
  intro:
    'Undergraduate student in the Tong Class at Peking University, studying artificial intelligence.',
  biography: [],
  education: {
    institution: 'Yuanpei College, Peking University',
    program:
      'B.S. student, General Artificial Intelligence Experimental Class (Tong Class)',
    dateRange: '2025 – Present',
    location: 'Beijing, China',
    details: undefined,
  },
  githubUrl: 'https://github.com/Scott-Chao',
  zhihuUrl: 'https://www.zhihu.com/people/scott-76-76-58',
  email: 'wszhao25@stu.pku.edu.cn',
  cvUrl: undefined,
  portrait: {
    src: '/src/assets/avatar.jpg',
    alt: "Weishuo Zhao's avatar, a smiling cloud with pink cheeks",
    position: 'center',
  },
};

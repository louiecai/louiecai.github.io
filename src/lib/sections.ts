export const SECTION_IDS = [
  'about',
  'experience',
  'projects',
  'skills',
  'activities',
  'education',
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export const SECTION_LABELS: Record<SectionId, string> = {
  about: 'About',
  experience: 'Experience',
  projects: 'Projects',
  skills: 'Skills',
  activities: 'Activities',
  education: 'Education',
};

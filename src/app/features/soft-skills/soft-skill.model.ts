import { CurationItem } from '../../models/curation-item.model';

/**
 * Soft Skill item model
 * Extends the base CurationItem with soft skill-specific properties
 */
export interface SoftSkill extends CurationItem {
  category?: string;
  importance?: number;
}

/**
 * Soft Skill categories
 */
export enum SoftSkillCategory {
  COMMUNICATION = 'Communication',
  LEADERSHIP = 'Leadership',
  TEAMWORK = 'Teamwork',
  PROBLEM_SOLVING = 'Problem Solving',
  ADAPTABILITY = 'Adaptability',
  TIME_MANAGEMENT = 'Time Management',
  OTHER = 'Other'
}

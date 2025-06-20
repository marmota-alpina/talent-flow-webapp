import { CurationItem } from '../../models/curation-item.model';

/**
 * Experience Level item model
 * Extends the base CurationItem with experience level-specific properties
 */
export interface ExperienceLevel extends CurationItem {
  level: number;
  yearsRange?: string;
  color?: string;
}

/**
 * Common experience level colors
 */
export enum ExperienceLevelColor {
  ENTRY = '#4CAF50',      // Green
  JUNIOR = '#8BC34A',     // Light Green
  INTERMEDIATE = '#2196F3', // Blue
  SENIOR = '#FFC107',     // Amber
  EXPERT = '#F44336'      // Red
}

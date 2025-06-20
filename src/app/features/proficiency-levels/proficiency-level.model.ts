import { CurationItem } from '../../models/curation-item.model';

/**
 * Proficiency Level item model
 * Extends the base CurationItem with proficiency level-specific properties
 */
export interface ProficiencyLevel extends CurationItem {
  level: number;
  color?: string;
}

/**
 * Common proficiency level colors
 */
export enum ProficiencyLevelColor {
  BEGINNER = '#4CAF50',  // Green
  INTERMEDIATE = '#2196F3',  // Blue
  ADVANCED = '#FFC107',  // Amber
  EXPERT = '#F44336'  // Red
}

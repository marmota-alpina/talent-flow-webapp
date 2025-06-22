import { CurationItem } from '../../models/curation-item.model';

/**
 * Technology item model
 * Extends the base CurationItem with technology-specific properties
 */
export interface Technology extends CurationItem {
  category?: string;
  icon?: string;
  popularity?: number;
}

/**
 * Technology categories
 */
export enum TechnologyCategory {
  FRONTEND = 'Frontend',
  BACKEND = 'Backend',
  DATABASE = 'Database',
  DEVOPS = 'DevOps',
  MOBILE = 'Mobile',
  CLOUD = 'Cloud',
  AI = 'AI',
  DESIGN = 'Design',
  OTHER = 'Other'
}

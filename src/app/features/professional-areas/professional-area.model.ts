import { CurationItem } from '../../models/curation-item.model';

/**
 * Professional Area item model
 * Extends the base CurationItem with professional area-specific properties
 */
export interface ProfessionalArea extends CurationItem {
  code?: string;
  parentArea?: string;
  popularity?: number;
}

/**
 * Common professional area codes
 */
export enum ProfessionalAreaCode {
  IT = 'IT',
  ENGINEERING = 'ENG',
  FINANCE = 'FIN',
  MARKETING = 'MKT',
  SALES = 'SLS',
  HR = 'HR',
  LEGAL = 'LGL',
  HEALTHCARE = 'HLT',
  EDUCATION = 'EDU',
  OTHER = 'OTH'
}

/**
 * Base interface for all curation items
 * This interface defines the common properties that all curation items should have
 */
export interface CurationItem {
  id?: string;
  name: string;
  description?: string;
  status: CurationItemStatus;
  createdAt?: Date
  updatedAt?: Date
}

/**
 * Status options for curation items
 */
export enum CurationItemStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived'
}

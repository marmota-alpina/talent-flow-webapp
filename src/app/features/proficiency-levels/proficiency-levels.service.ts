import { Injectable } from '@angular/core';
import { BaseCurationService } from '../../core/services/base-curation.service';
import { ProficiencyLevel } from './proficiency-level.model';

/**
 * Service for managing proficiency levels
 * Extends the BaseCurationService with the ProficiencyLevel type
 */
@Injectable({
  providedIn: 'root'
})
export class ProficiencyLevelsService extends BaseCurationService<ProficiencyLevel> {
  protected override readonly collectionName: string = 'proficiencyLevels';

  // Additional proficiency level-specific methods can be added here
}

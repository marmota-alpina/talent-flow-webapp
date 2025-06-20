import { Injectable } from '@angular/core';
import { BaseCurationService } from '../../core/services/base-curation.service';
import { ExperienceLevel } from './experience-level.model';

/**
 * Service for managing experience levels
 * Extends the BaseCurationService with the ExperienceLevel type
 */
@Injectable({
  providedIn: 'root'
})
export class ExperienceLevelsService extends BaseCurationService<ExperienceLevel> {
  protected override readonly collectionName: string = 'experienceLevels';

  // Additional experience level-specific methods can be added here
}

import { Injectable } from '@angular/core';
import { BaseCurationService } from '../../core/services/base-curation.service';
import { SoftSkill } from './soft-skill.model';

/**
 * Service for managing soft skills
 * Extends the BaseCurationService with the SoftSkill type
 */
@Injectable({
  providedIn: 'root'
})
export class SoftSkillsService extends BaseCurationService<SoftSkill> {
  protected override readonly collectionName: string = 'softSkills';

  // Additional soft skill-specific methods can be added here
}

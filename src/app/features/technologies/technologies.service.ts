import { Injectable } from '@angular/core';
import { BaseCurationService } from '../../core/services/base-curation.service';
import { Technology } from './technology.model';

/**
 * Service for managing technologies
 * Extends the BaseCurationService with the Technology type
 */
@Injectable({
  providedIn: 'root'
})
export class TechnologiesService extends BaseCurationService<Technology> {
  protected override readonly collectionName: string = 'technologies';

  // Additional technology-specific methods can be added here
}

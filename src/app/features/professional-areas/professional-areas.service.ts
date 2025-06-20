import { Injectable } from '@angular/core';
import { BaseCurationService } from '../../core/services/base-curation.service';
import { ProfessionalArea } from './professional-area.model';

/**
 * Service for managing professional areas
 * Extends the BaseCurationService with the ProfessionalArea type
 */
@Injectable({
  providedIn: 'root'
})
export class ProfessionalAreasService extends BaseCurationService<ProfessionalArea> {
  protected override readonly collectionName: string = 'professionalAreas';

  // Additional professional area-specific methods can be added here
}

import { Injectable } from '@angular/core';
import { BaseCurationService } from '../../core/services/base-curation.service';
import { Language } from './language.model';

/**
 * Service for managing languages
 * Extends the BaseCurationService with the Language type
 */
@Injectable({
  providedIn: 'root'
})
export class LanguagesService extends BaseCurationService<Language> {
  protected override readonly collectionName: string = 'languages';

  // Additional language-specific methods can be added here
}

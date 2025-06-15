import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
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
  /**
   * Constructor
   * @param firestore Firestore instance
   */
  constructor(firestore: Firestore) {
    // Pass the collection name to the base class
    super(firestore, 'technologies');
  }

  // Additional technology-specific methods can be added here
}

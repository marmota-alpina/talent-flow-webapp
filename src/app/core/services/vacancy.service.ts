import { Injectable } from '@angular/core';
import { BaseCurationService } from './base-curation.service';
import { Vacancy } from '../../models/vacancy.model';
import { Observable, from, map } from 'rxjs';
import { collection, collectionData, doc, getDoc, query, where, orderBy } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class VacancyService extends BaseCurationService<Vacancy> {
  protected readonly collectionName = 'vacancies';

  /**
   * Get all active vacancies
   * @returns Observable of active vacancies
   */
  getActiveVacancies(): Observable<Vacancy[]> {
    const collectionRef = collection(this.firestore, this.collectionName);
    const vacanciesQuery = query(
      collectionRef,
      where('status', '==', 'active'),
      orderBy('title')
    );
    return collectionData(vacanciesQuery, { idField: 'id' }) as Observable<Vacancy[]>;
  }

  /**
   * Get all archived vacancies
   * @returns Observable of archived vacancies
   */
  getArchivedVacancies(): Observable<Vacancy[]> {
    const collectionRef = collection(this.firestore, this.collectionName);
    const vacanciesQuery = query(
      collectionRef,
      where('status', '==', 'archived'),
      orderBy('title')
    );
    return collectionData(vacanciesQuery, { idField: 'id' }) as Observable<Vacancy[]>;
  }
}

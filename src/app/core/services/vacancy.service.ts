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
}

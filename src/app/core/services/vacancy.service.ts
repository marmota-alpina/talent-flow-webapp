import { Injectable } from '@angular/core';
import { BaseCurationService } from './base-curation.service';
import { Vacancy } from '../../models/vacancy.model';

@Injectable({
  providedIn: 'root'
})
export class VacancyService extends BaseCurationService<Vacancy> {
  protected readonly collectionName = 'vacancies';
}

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VacancyService } from '../../../core/services/vacancy.service';
import { Vacancy } from '../../../models/vacancy.model';
import { Observable } from 'rxjs';
import { CurationItemStatus } from '../../../models/curation-item.model';

@Component({
  selector: 'app-vacancy-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './vacancy-list.component.html',
  styleUrls: ['./vacancy-list.component.scss']
})
export class VacancyListComponent implements OnInit {
  activeVacancies$!: Observable<Vacancy[]>;
  archivedVacancies$!: Observable<Vacancy[]>;
  activeCount = 0;
  archivedCount = 0;
  showArchived = false;

  private vacancyService = inject(VacancyService);

  ngOnInit(): void {
    this.loadVacancies();
    this.loadCounts();
  }

  loadVacancies(): void {
    this.activeVacancies$ = this.vacancyService.getAll(CurationItemStatus.ACTIVE);
    this.archivedVacancies$ = this.vacancyService.getAll(CurationItemStatus.ARCHIVED);
  }

  loadCounts(): void {
    this.vacancyService.count(CurationItemStatus.ACTIVE).subscribe(count => {
      this.activeCount = count;
    });
    this.vacancyService.count(CurationItemStatus.ARCHIVED).subscribe(count => {
      this.archivedCount = count;
    });
  }

  archiveVacancy(id: string): void {
    this.vacancyService.archive(id).subscribe({
       next: () => {
        this.loadVacancies();
        this.loadCounts();
      },
      error: (err) => {
        console.error('Error archiving vacancy', err);
      }
    });
  }

  unarchiveVacancy(id: string): void {
    this.vacancyService.unarchive(id).subscribe({
      next: () => {
        this.loadVacancies();
        this.loadCounts();
      },
      error: (err) => {
        console.error('Error unarchiving vacancy', err);
      }
    });
  }
}

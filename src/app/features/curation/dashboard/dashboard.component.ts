import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { TechnologiesService } from '../../technologies/technologies.service';
import { SoftSkillsService } from '../../soft-skills/soft-skills.service';
import { LanguagesService } from '../../languages/languages.service';
import { ProficiencyLevelsService } from '../../proficiency-levels/proficiency-levels.service';
import { ExperienceLevelsService } from '../../experience-levels/experience-levels.service';
import { ProfessionalAreasService } from '../../professional-areas/professional-areas.service';
import { CurationItemStatus } from '../../../models/curation-item.model';
import {CurationSeedService} from '../../../core/services/curation-seed-service';

/**
 * Dashboard component for the curation area
 * Displays summary statistics for the different curation entities
 */
@Component({
  selector: 'app-curation-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  // Subject for handling unsubscription
  private destroy$ = new Subject<void>();

  // Loading state as signal
  loading = signal<boolean>(false);

  // Error state as signal
  error = signal<string | null>(null);

  // Statistics for the dashboard as signal
  statistics = signal<{name: string, count: number, icon: string, color: string, path: string}[]>([
    { name: 'Tecnologias', count: 0, icon: 'fa-cogs', color: 'blue', path: '/curation/technologies' },
    { name: 'Habilidades Comportamentais', count: 0, icon: 'fa-heart', color: 'teal', path: '/curation/soft-skills' },
    { name: 'Idiomas', count: 0, icon: 'fa-language', color: 'indigo', path: '/curation/languages' },
    { name: 'Níveis de Proficiência', count: 0, icon: 'fa-layer-group', color: 'amber', path: '/curation/proficiency-levels' },
    { name: 'Níveis de Experiência', count: 0, icon: 'fa-briefcase', color: 'green', path: '/curation/experience-levels' },
    { name: 'Áreas Profissionais', count: 0, icon: 'fa-sitemap', color: 'purple', path: '/curation/professional-areas' }
  ]);

  canSeed = signal<boolean>(false);
  isSeeding = signal<boolean>(false);
  isClearing = signal<boolean>(false);

  // Services injected using inject() function
  private technologiesService = inject(TechnologiesService);
  private softSkillsService = inject(SoftSkillsService);
  private languagesService = inject(LanguagesService);
  private proficiencyLevelsService = inject(ProficiencyLevelsService);
  private experienceLevelsService = inject(ExperienceLevelsService);
  private professionalAreasService = inject(ProfessionalAreasService);
  private seedService = inject(CurationSeedService);

  ngOnInit(): void {
    this.loadStatistics();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load statistics from all services using the more efficient count method
   */
  loadStatistics(): void {
    this.loading.set(true);
    this.error.set(null);

    // Create an array of observables for each service's count method
    const requests = [
      this.technologiesService.count(CurationItemStatus.ACTIVE),
      this.softSkillsService.count(CurationItemStatus.ACTIVE),
      this.languagesService.count(CurationItemStatus.ACTIVE),
      this.proficiencyLevelsService.count(CurationItemStatus.ACTIVE),
      this.experienceLevelsService.count(CurationItemStatus.ACTIVE),
      this.professionalAreasService.count(CurationItemStatus.ACTIVE)
    ];

    // Use forkJoin to wait for all requests to complete
    forkJoin(requests)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ([technologiesCount, softSkillsCount, languagesCount, proficiencyLevelsCount, experienceLevelsCount, professionalAreasCount]) => {
          // Update statistics with actual counts
          const currentStats = this.statistics();
          this.statistics.set([
            { ...currentStats[0], count: technologiesCount },
            { ...currentStats[1], count: softSkillsCount },
            { ...currentStats[2], count: languagesCount },
            { ...currentStats[3], count: proficiencyLevelsCount },
            { ...currentStats[4], count: experienceLevelsCount },
            { ...currentStats[5], count: professionalAreasCount }
          ]);
          this.loading.set(false);
          this.canSeed.set(this.statistics().reduce((acc, stat) => acc + stat.count, 0) === 0);
        },
        error: (err) => {
          console.error('Error loading statistics', err);
          this.error.set('Failed to load statistics. Please try again.');
          this.loading.set(false);
        }
      });
  }

  seedData() {
    this.loading.set(true);
    this.seedService.seedAll().subscribe(
      {
        next: () => {
          this.loading.set(false);
          this.loadStatistics();
        },
        error: (err) => {
          console.error('Error seeding data', err);
          this.error.set('Failed to seed data. Please try again.');
          this.loading.set(false);
        }
      }
    );
  }

  clearData() {
    this.loading.set(true);
    this.seedService.clearAll().subscribe(
      {
        next: () => {
          this.loading.set(false);
          this.loadStatistics();
        },
        error: (err) => {
          console.error('Error clearing data', err);
          this.error.set('Failed to clear data. Please try again.');
          this.loading.set(false);
        }
      }
    );
  }
}

import { Routes } from '@angular/router';
import { CurationLayoutComponent } from './curation-layout/curation-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TechnologiesComponent } from '../technologies/technologies.component';
import { SoftSkillsComponent } from '../soft-skills/soft-skills.component';
import { LanguagesComponent } from '../languages/languages.component';
import { ProficiencyLevelsComponent } from '../proficiency-levels/proficiency-levels.component';
import { roleGuard } from '../../core/services/auth.guard';
import { ExperienceLevelsComponent } from '../experience-levels/experience-levels.component';
import { ProfessionalAreasComponent } from '../professional-areas/professional-areas.component';

/**
 * Routes for the curation feature
 */
export const curationRoutes: Routes = [
  {
    path: '',
    component: CurationLayoutComponent,
    canActivate: [roleGuard(['admin'])],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'technologies',
        component: TechnologiesComponent
      },
      {
        path: 'soft-skills',
        component: SoftSkillsComponent
      },
      {
        path: 'languages',
        component: LanguagesComponent
      },
      {
        path: 'proficiency-levels',
        component: ProficiencyLevelsComponent
      },
      {
        path: 'experience-levels',
        component: ExperienceLevelsComponent
      },
      {
        path: 'professional-areas',
        component: ProfessionalAreasComponent
      },
      {
        path: 'vacancy-management',
        loadChildren: () => import('../vacancy-management/vacancy.routes').then(m => m.vacancyRoutes)
      },
      // Other curation routes will be added here
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

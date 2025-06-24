import { Routes } from '@angular/router';

export const vacancyRoutes: Routes = [
  {
    path: '', // Rota para /vacancy-management
    loadComponent: () => import('./vacancy-list/vacancy-list.component').then(c => c.VacancyListComponent),
    data: { breadcrumb: 'Gerenciamento de Vagas' }
  },
  {
    path: 'new', // Rota para /vacancy-management/new
    loadComponent: () => import('./vacancy-form/vacancy-form.component').then(c => c.VacancyFormComponent),
    data: { breadcrumb: 'Nova Vaga' }
  },
  {
    path: 'edit/:id', // Rota para /vacancy-management/edit/:id
    loadComponent: () => import('./vacancy-form/vacancy-form.component').then(c => c.VacancyFormComponent),
    data: { breadcrumb: 'Editar Vaga' }
  },
  {
    path: ':id/candidates', // Rota para /vacancy-management/:id/candidates
    loadComponent: () => import('./candidate-list/candidate-list.component').then(c => c.CandidateListComponent),
    data: { breadcrumb: 'Candidatos da Vaga' }
  }
];

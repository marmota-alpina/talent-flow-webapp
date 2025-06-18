import { Routes } from '@angular/router';

/**
 * Routes for the candidate management feature module
 * This is a placeholder implementation to fix build errors
 */
export const candidateManagementRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./candidate-list/candidate-list.component').then(c => c.CandidateListComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./candidate-detail/candidate-detail.component').then(c => c.CandidateDetailComponent)
  }
];

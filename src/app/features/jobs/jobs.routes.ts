import { Routes } from '@angular/router';

/**
 * Routes for the jobs feature module
 * This is a placeholder implementation to fix build errors
 */
export const jobsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./job-list/job-list.component').then(c => c.JobListComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./job-detail/job-detail.component').then(c => c.JobDetailComponent)
  }
];

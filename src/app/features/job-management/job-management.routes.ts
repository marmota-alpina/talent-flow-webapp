import { Routes } from '@angular/router';

/**
 * Routes for the job management feature module
 * This is a placeholder implementation to fix build errors
 */
export const jobManagementRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./job-management-list/job-management-list.component').then(c => c.JobManagementListComponent)
  },
  {
    path: 'criar',
    loadComponent: () => import('./job-management-create/job-management-create.component').then(c => c.JobManagementCreateComponent)
  },
  {
    path: 'editar/:id',
    loadComponent: () => import('./job-management-edit/job-management-edit.component').then(c => c.JobManagementEditComponent)
  }
];

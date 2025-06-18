import { Routes } from '@angular/router';

/**
 * Routes for the resume feature module
 * This is a placeholder implementation to fix build errors
 */
export const resumeRoutes: Routes = [
  {
    path: '',
    redirectTo: 'view',
    pathMatch: 'full'
  },
  {
    path: 'view',
    loadComponent: () => import('./resume-view/resume-view.component').then(c => c.ResumeViewComponent)
  },
  {
    path: 'editar',
    loadComponent: () => import('./resume-edit/resume-edit.component').then(c => c.ResumeEditComponent)
  }
];

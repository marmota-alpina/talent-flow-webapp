import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/services/auth.guard';
import { MainLayoutComponent } from './core/components/main-layout/main-layout.component';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';

export const routes: Routes = [
  // Public routes
  { path: 'login', component: LoginComponent },

  // Protected routes with MainLayoutComponent
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },

      // Candidate routes
      {
        path: 'meu-curriculo',
        loadChildren: () => import('./features/resume/resume.routes').then(m => m.resumeRoutes),
        canActivate: [roleGuard(['candidate'])]
      },
      {
        path: 'vagas',
        loadChildren: () => import('./features/jobs/jobs.routes').then(m => m.jobsRoutes),
        canActivate: [roleGuard(['candidate'])]
      },

      // Recruiter/Admin routes
      {
        path: 'gerenciar-vagas',
        loadChildren: () => import('./features/job-management/job-management.routes').then(m => m.jobManagementRoutes),
        canActivate: [roleGuard(['recruiter', 'admin'])]
      },
      {
        path: 'candidatos',
        loadChildren: () => import('./features/candidate-management/candidate-management.routes').then(m => m.candidateManagementRoutes),
        canActivate: [roleGuard(['recruiter', 'admin'])]
      },

      // Default redirect to dashboard
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // Fallback route
  { path: '**', redirectTo: 'dashboard' }
];

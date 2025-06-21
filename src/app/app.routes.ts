import { Routes } from '@angular/router';
import { MainLayoutComponent } from './core/components/main-layout/main-layout.component';
import { authGuard, roleGuard } from './core/services/auth.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';

export const routes: Routes = [
  // Rota pública
  {
    path: 'login',
    component: LoginComponent
  },

  // Rotas protegidas que usam o MainLayoutComponent
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },

      // Rotas do Candidato
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

      // Rotas do Recrutador/Admin
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

      // Rota de Curadoria (apenas Admin)
      {
        path: 'curation',
        loadChildren: () => import('./features/curation/curation.routes').then(m => m.curationRoutes),
        canActivate: [roleGuard(['admin'])]
      },

      // Redirecionamento padrão para o dashboard
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // Rota de fallback para qualquer outra URL
  { path: '**', redirectTo: 'dashboard' }
];

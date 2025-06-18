import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * Component for displaying a list of jobs
 * This is a placeholder implementation to fix build errors
 */
@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-white shadow rounded-lg p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-4">Vagas Disponíveis</h1>
      <p class="text-gray-600 mb-6">
        Esta é uma página de listagem de vagas que será implementada em futuras sprints.
      </p>

      <div class="space-y-4">
        <div class="border border-gray-200 rounded-md p-4 hover:bg-gray-50">
          <h2 class="text-lg font-medium text-gray-900">Desenvolvedor Frontend</h2>
          <p class="text-gray-600">Empresa Exemplo</p>
          <a
            routerLink="/vagas/1"
            class="mt-2 inline-flex items-center text-sm font-medium text-primary hover:text-blue-700"
          >
            Ver detalhes
          </a>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class JobListComponent {}

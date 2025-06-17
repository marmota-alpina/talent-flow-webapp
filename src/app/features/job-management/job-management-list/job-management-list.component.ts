import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * Component for listing jobs for management
 * This is a placeholder implementation to fix build errors
 */
@Component({
  selector: 'app-job-management-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-white shadow rounded-lg p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Gerenciar Vagas</h1>
        <a
          routerLink="/gerenciar-vagas/criar"
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Criar Nova Vaga
        </a>
      </div>

      <p class="text-gray-600 mb-6">
        Esta é uma página de gerenciamento de vagas que será implementada em futuras sprints.
      </p>

      <div class="space-y-4">
        <div class="border border-gray-200 rounded-md p-4 hover:bg-gray-50">
          <div class="flex justify-between items-start">
            <div>
              <h2 class="text-lg font-medium text-gray-900">Desenvolvedor Frontend</h2>
              <p class="text-gray-600">Publicada em: 01/06/2023</p>
            </div>
            <div class="flex space-x-2">
              <a
                routerLink="/gerenciar-vagas/editar/1"
                class="text-sm text-primary hover:text-blue-700"
              >
                Editar
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class JobManagementListComponent {}

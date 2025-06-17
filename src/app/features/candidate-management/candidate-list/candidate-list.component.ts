import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * Component for listing candidates for management
 * This is a placeholder implementation to fix build errors
 */
@Component({
  selector: 'app-candidate-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-white shadow rounded-lg p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-4">Gerenciar Candidatos</h1>
      <p class="text-gray-600 mb-6">
        Esta é uma página de gerenciamento de candidatos que será implementada em futuras sprints.
      </p>

      <div class="space-y-4">
        <div class="border border-gray-200 rounded-md p-4 hover:bg-gray-50">
          <div class="flex justify-between items-start">
            <div>
              <h2 class="text-lg font-medium text-gray-900">João Silva</h2>
              <p class="text-gray-600">Desenvolvedor Frontend</p>
            </div>
            <div>
              <a
                routerLink="/candidatos/1"
                class="text-sm text-primary hover:text-blue-700"
              >
                Ver perfil
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class CandidateListComponent {}

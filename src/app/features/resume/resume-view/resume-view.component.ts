import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

/**
 * Component for viewing a resume
 * This is a placeholder implementation to fix build errors
 */
@Component({
  selector: 'app-resume-view',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-white shadow rounded-lg p-6">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold text-gray-900">Visualizar Currículo</h1>
        <a routerLink="/meu-curriculo/editar" class="bg-primary text-white font-semibold px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors">
          <i class="fas fa-edit mr-2"></i>Editar Currículo
        </a>
      </div>
      <p class="text-gray-600">
        Esta é uma página de visualização de currículo que será implementada em futuras sprints.
      </p>
    </div>
  `,
  styles: []
})
export class ResumeViewComponent {}

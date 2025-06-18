import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Component for viewing a resume
 * This is a placeholder implementation to fix build errors
 */
@Component({
  selector: 'app-resume-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white shadow rounded-lg p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-4">Visualizar Currículo</h1>
      <p class="text-gray-600">
        Esta é uma página de visualização de currículo que será implementada em futuras sprints.
      </p>
    </div>
  `,
  styles: []
})
export class ResumeViewComponent {}

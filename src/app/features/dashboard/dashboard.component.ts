import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Simple dashboard component as a placeholder
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white shadow rounded-lg p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-4">Dashboard</h1>
      <p class="text-gray-600">
        Bem-vindo ao Talent Flow! Esta é uma página de dashboard simples que será expandida em futuras sprints.
      </p>
    </div>
  `,
  styles: []
})
export class DashboardComponent {}

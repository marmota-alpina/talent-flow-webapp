import {Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';

/**
 * Component for displaying job details
 * This is a placeholder implementation to fix build errors
 */
@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-white shadow rounded-lg p-6">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 mb-1">Desenvolvedor Frontend</h1>
          <p class="text-gray-600 mb-4">Empresa Exemplo</p>
        </div>
        <a
          routerLink="/vagas"
          class="text-sm text-primary hover:text-blue-700"
        >
          Voltar para lista
        </a>
      </div>

      <div class="mt-6">
        <h2 class="text-lg font-medium text-gray-900 mb-2">Descrição da Vaga</h2>
        <p class="text-gray-600">
          Esta é uma página de detalhes de vaga que será implementada em futuras sprints.
        </p>
      </div>

      <div class="mt-6">
        <button
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Candidatar-se
        </button>
      </div>
    </div>
  `,
  styles: []
})
export class JobDetailComponent {
  private route = inject(ActivatedRoute);
  jobId: string | null = null;

  constructor() {
    this.route.paramMap.subscribe(params => {
      this.jobId = params.get('id');
    });
  }
}

import { Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';

/**
 * Component for displaying candidate details
 * This is a placeholder implementation to fix build errors
 */
@Component({
  selector: 'app-candidate-detail',
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-white shadow rounded-lg p-6">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 mb-1">João Silva</h1>
          <p class="text-gray-600 mb-4">Desenvolvedor Frontend</p>
        </div>
        <a
          routerLink="/candidatos"
          class="text-sm text-primary hover:text-blue-700"
        >
          Voltar para lista
        </a>
      </div>

      <p class="text-gray-600 mb-6">
        Esta é uma página de detalhes de candidato que será implementada em futuras sprints.
        ID do candidato: {{ candidateId }}
      </p>

      <div class="mt-6">
        <h2 class="text-lg font-medium text-gray-900 mb-2">Resumo</h2>
        <p class="text-gray-600">
          Desenvolvedor com experiência em Angular, React e Vue.js.
        </p>
      </div>

      <div class="mt-6">
        <h2 class="text-lg font-medium text-gray-900 mb-2">Contato</h2>
        <p class="text-gray-600">
          Email: joao.silva&#64;exemplo.com<br>
          Telefone: (11) 98765-4321
        </p>
      </div>
    </div>
  `,
  styles: []
})
export class CandidateDetailComponent implements OnInit{
  private route = inject(ActivatedRoute);
  candidateId: string | null = null;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.candidateId = params.get('id');
    });
  }
}

import {Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Component for editing an existing job
 * This is a placeholder implementation to fix build errors
 */
@Component({
  selector: 'app-job-management-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="bg-white shadow rounded-lg p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Editar Vaga</h1>
        <a
          routerLink="/gerenciar-vagas"
          class="text-sm text-primary hover:text-blue-700"
        >
          Voltar para lista
        </a>
      </div>

      <p class="text-gray-600 mb-6">
        Esta é uma página de edição de vagas que será implementada em futuras sprints.
        ID da vaga: {{ jobId }}
      </p>

      <form [formGroup]="jobForm" class="space-y-4">
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700">Título da Vaga</label>
          <input
            type="text"
            id="title"
            formControlName="title"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
          >
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-700">Descrição</label>
          <textarea
            id="description"
            formControlName="description"
            rows="4"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
          ></textarea>
        </div>

        <div>
          <button
            type="submit"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  `,
  styles: []
})
export class JobManagementEditComponent {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  jobId: string | null = null;
  jobForm: FormGroup;

  constructor() {
    this.route.paramMap.subscribe(params => {
      this.jobId = params.get('id');
    });

    this.jobForm = this.fb.group({
      title: ['Desenvolvedor Frontend', Validators.required],
      description: ['Esta é uma vaga de exemplo.', Validators.required]
    });
  }
}

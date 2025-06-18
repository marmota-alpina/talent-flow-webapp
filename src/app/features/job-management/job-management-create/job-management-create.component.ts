import {Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Component for creating a new job
 * This is a placeholder implementation to fix build errors
 */
@Component({
  selector: 'app-job-management-create',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="bg-white shadow rounded-lg p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Criar Nova Vaga</h1>
        <a
          routerLink="/gerenciar-vagas"
          class="text-sm text-primary hover:text-blue-700"
        >
          Voltar para lista
        </a>
      </div>

      <p class="text-gray-600 mb-6">
        Esta é uma página de criação de vagas que será implementada em futuras sprints.
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
            Criar Vaga
          </button>
        </div>
      </form>
    </div>
  `,
  styles: []
})
export class JobManagementCreateComponent {
  private fb: FormBuilder = inject(FormBuilder);
  jobForm: FormGroup;

  constructor() {
    this.jobForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
  }
}

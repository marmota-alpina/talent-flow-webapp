import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Component for editing a resume
 * This is a placeholder implementation to fix build errors
 */
@Component({
  selector: 'app-resume-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="bg-white shadow rounded-lg p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-4">Editar Currículo</h1>
      <p class="text-gray-600 mb-6">
        Esta é uma página de edição de currículo que será implementada em futuras sprints.
      </p>

      <form [formGroup]="resumeForm" class="space-y-4">
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700">Título Profissional</label>
          <input
            type="text"
            id="title"
            formControlName="title"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
          >
        </div>

        <div>
          <button
            type="submit"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  `,
  styles: []
})
export class ResumeEditComponent {
  resumeForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.resumeForm = this.fb.group({
      title: ['', Validators.required]
    });
  }
}

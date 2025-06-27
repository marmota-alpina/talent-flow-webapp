import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resume-stepper',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mb-10 p-4 bg-white rounded-lg shadow-sm">
      <div class="flex items-center">
        <!-- Step items with connectors in between -->
        <ng-container *ngFor="let step of steps; let i = index; let last = last">
          <!-- Step item -->
          <div class="step-item text-center flex-1" [class.active]="i === currentStep">
            <div class="relative mb-2">
              <div
                class="step-circle w-10 h-10 mx-auto rounded-full text-lg flex items-center justify-center transition-all duration-300"
                [class.bg-white]="i > currentStep"
                [class.border-2]="i > currentStep"
                [class.border-gray-200]="i > currentStep"
                [class.bg-primary]="i === currentStep"
                [class.border-primary]="i === currentStep"
                [class.text-white]="i === currentStep"
                [class.bg-success]="i < currentStep"
                [class.border-success]="i < currentStep"
                [class.text-success]="i < currentStep"
              >
                <ng-container *ngIf="i < currentStep; else numberTemplate">
                  <i class="fas fa-check text-white"></i>
                </ng-container>
                <ng-template #numberTemplate>
                  {{ i + 1 }}
                </ng-template>
              </div>
            </div>
            <div
              class="step-label text-xs font-semibold transition-all duration-300"
              [class.text-gray-500]="i !== currentStep && i >= currentStep"
              [class.text-primary]="i === currentStep"
              [class.font-bold]="i === currentStep"
              [class.text-success]="i < currentStep"
            >
              {{ step }}
            </div>
          </div>

          <!-- Connector (not for the last item) -->
          <div
            *ngIf="!last"
            class="step-connector flex-1 border-t-2 transition-all duration-300 mx-2"
            [class.border-gray-200]="i >= currentStep"
            [class.border-primary]="i < currentStep"
          ></div>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    .step-item.active .step-circle {
      background-color: #2563EB;
      color: white;
      border-color: #2563EB;
    }
    .step-item.active .step-label {
      color: #2563EB;
      font-weight: 600;
    }
    .step-connector.active {
      border-color: #2563EB;
    }
  `]
})
export class ResumeStepperComponent {
  @Input() currentStep = 0;
  @Input() steps: string[] = ['Pessoal', 'Perfil', 'Experiência'];
}

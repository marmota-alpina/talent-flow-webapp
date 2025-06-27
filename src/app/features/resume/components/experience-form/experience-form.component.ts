import { Component, EventEmitter, Input, Output, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';
import { TechnologiesService } from '../../../technologies/technologies.service';
import { Technology } from '../../../technologies/technology.model';
import { SoftSkillsService } from '../../../soft-skills/soft-skills.service';
import { SoftSkill } from '../../../soft-skills/soft-skill.model';
import { Observable, of, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-experience-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="flex items-start gap-4">
      <div class="flex-grow p-4 border-2 rounded-lg bg-white">
        <div [formGroup]="experienceForm" class="space-y-4">
          <!-- Basic Experience Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label for="role-{{formId}}" class="block text-sm font-medium text-gray-700 mb-1">Cargo Ocupado</label>
              <input
                type="text"
                id="role-{{formId}}"
                formControlName="role"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
            </div>
            <div>
              <label for="companyName-{{formId}}" class="block text-sm font-medium text-gray-700 mb-1">Nome da Empresa</label>
              <input
                type="text"
                id="companyName-{{formId}}"
                formControlName="companyName"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
            </div>
            <div>
              <label for="experienceType-{{formId}}" class="block text-sm font-medium text-gray-700 mb-1">Tipo de Contratação</label>
              <select
                id="experienceType-{{formId}}"
                formControlName="experienceType"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="CLT">CLT</option>
                <option value="PJ">PJ</option>
                <option value="Freelance">Freelance</option>
                <option value="Temporario">Contrato Temporário</option>
                <option value="Servidor">Servidor Público</option>
              </select>
            </div>
            <div class="flex items-center gap-2">
              <input
                type="checkbox"
                id="isCurrent-{{formId}}"
                formControlName="isCurrent"
                class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              >
              <label for="isCurrent-{{formId}}" class="text-sm font-medium text-gray-700">Trabalho Atual</label>
            </div>
            <div>
              <label for="startDate-{{formId}}" class="block text-sm font-medium text-gray-700 mb-1">Data de Início</label>
              <input
                type="date"
                id="startDate-{{formId}}"
                formControlName="startDate"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
            </div>
            <div>
              <label for="endDate-{{formId}}" class="block text-sm font-medium text-gray-700 mb-1">Data de Término</label>
              <input
                type="date"
                id="endDate-{{formId}}"
                formControlName="endDate"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                [disabled]="experienceForm.get('isCurrent')?.value"
              >
            </div>
          </div>

          <!-- Activities Section -->
          <div class="border-t pt-4">
            <div class="flex justify-between items-center mb-3">
              <h4 class="font-semibold text-gray-700">Atividades Realizadas</h4>
              <button
                type="button"
                class="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-md hover:bg-blue-600"
                (click)="addActivity()"
              >
                <i class="fas fa-plus"></i>
              </button>
            </div>

            <div class="space-y-3" formArrayName="activitiesPerformed">
              @for (activityControl of activitiesArray.controls; track $index; let i = $index) {
                <div
                  [formGroupName]="i"
                  class="p-3 border rounded-md bg-gray-50"
                >
                <div class="space-y-3">
                  <div>
                    <label [for]="'activity-' + formId + '-' + i" class="block text-sm font-medium text-gray-700 mb-1">Atividade ou Projeto</label>
                    <textarea
                      [id]="'activity-' + formId + '-' + i"
                      formControlName="activity"
                      class="w-full text-sm px-3 py-1 border border-gray-300 rounded-md"
                      rows="2"
                    ></textarea>
                  </div>
                  <div>
                    <label [for]="'problemSolved-' + formId + '-' + i" class="block text-sm font-medium text-gray-700 mb-1">Problema Resolvido e Resultados</label>
                    <textarea
                      [id]="'problemSolved-' + formId + '-' + i"
                      formControlName="problemSolved"
                      class="w-full text-sm px-3 py-1 border border-gray-300 rounded-md"
                      rows="3"
                    ></textarea>
                  </div>
                  <div>
                    <label [for]="'technologies-' + formId + '-' + i" class="block text-sm font-medium text-gray-700 mb-1">Tecnologias Utilizadas</label>
                    <div class="relative">
                      <div class="w-full flex flex-wrap items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white">
                        @for (tech of activityControl.get('technologies')?.value || []; track $index; let techIndex = $index) {
                          <div class="tag bg-primary/10 text-primary text-sm font-semibold px-2.5 py-1 rounded-md flex items-center gap-2 whitespace-nowrap">
                            <span>{{ tech }}</span>
                            <button
                              type="button"
                              class="text-primary/70 hover:text-primary font-bold"
                              (click)="removeTechnologyFromActivity(i, techIndex)"
                            >
                              &times;
                            </button>
                          </div>
                        }

                        <input
                          [id]="'technologies-' + formId + '-' + i"
                          [formControl]="technologyInput"
                          type="text"
                          placeholder="Adicionar tecnologia..."
                          class="flex-grow bg-transparent border-none outline-none text-sm technology-input"
                          (focus)="onTechnologyInputFocus(i)"
                          (blur)="hideTechnologySuggestions()"
                          (keydown)="onTechnologyKeydown($event, i)"
                        >
                      </div>

                      @if (showTechnologySuggestions) {
                        <div class="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-y-auto technology-suggestions"
                             (mousedown)="$event.preventDefault()"> <!-- Prevent blur when clicking on suggestions -->
                          @for (tech of filteredTechnologies; track tech.name; let techIndex = $index) {
                            <div
                              class="px-4 py-2 hover:bg-gray-100 cursor-pointer technology-suggestion-item"
                              [class.bg-gray-100]="techIndex === selectedTechnologyIndex"
                              [class.selected]="techIndex === selectedTechnologyIndex"
                              (click)="selectTechnology(tech, i)"
                              (mouseenter)="selectedTechnologyIndex = techIndex"
                              (keydown.enter)="selectTechnology(tech, i)"
                              tabindex="0"
                            >
                              {{ tech.name }}
                            </div>
                          }
                        </div>
                      }
                    </div>
                  </div>
                  <div>
                    <label [for]="'appliedSoftSkills-' + formId + '-' + i" class="block text-sm font-medium text-gray-700 mb-1">Soft Skills Aplicadas</label>
                    <div class="relative">
                      <div class="w-full flex flex-wrap items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white">
                        @for (skill of activityControl.get('appliedSoftSkills')?.value || []; track $index; let skillIndex = $index) {
                          <div class="tag bg-primary/10 text-primary text-sm font-semibold px-2.5 py-1 rounded-md flex items-center gap-2 whitespace-nowrap">
                            <span>{{ skill }}</span>
                            <button
                              type="button"
                              class="text-primary/70 hover:text-primary font-bold"
                              (click)="removeSoftSkillFromActivity(i, skillIndex)"
                            >
                              &times;
                            </button>
                          </div>
                        }

                        <input
                          [id]="'appliedSoftSkills-' + formId + '-' + i"
                          [formControl]="softSkillInput"
                          type="text"
                          placeholder="Adicionar soft skill..."
                          class="flex-grow bg-transparent border-none outline-none text-sm softskill-input"
                          (focus)="onSoftSkillInputFocus(i)"
                          (blur)="hideSoftSkillSuggestions()"
                          (keydown)="onSoftSkillKeydown($event, i)"
                        >
                      </div>

                      @if (showSoftSkillSuggestions) {
                        <div class="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-y-auto softskill-suggestions"
                             (mousedown)="$event.preventDefault()"> <!-- Prevent blur when clicking on suggestions -->
                          @for (skill of filteredSoftSkills; track skill.name; let skillIndex = $index) {
                            <div
                              class="px-4 py-2 hover:bg-gray-100 cursor-pointer softskill-suggestion-item"
                              [class.bg-gray-100]="skillIndex === selectedSoftSkillIndex"
                              [class.selected]="skillIndex === selectedSoftSkillIndex"
                              (click)="selectSoftSkill(skill, i)"
                              (mouseenter)="selectedSoftSkillIndex = skillIndex"
                              (keydown.enter)="selectSoftSkill(skill, i)"
                              tabindex="0"
                            >
                              {{ skill.name }}
                            </div>
                          }
                        </div>
                      }
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  class="text-gray-400 hover:text-error transition-colors duration-200 w-full text-center p-1 mt-2 text-xs font-semibold"
                  (click)="removeActivity(i)"
                >
                  <i class="fas fa-trash-can mr-1"></i>Remover Atividade
                </button>
              </div>
              }
            </div>
          </div>
        </div>
      </div>
      <button
        type="button"
        title="Excluir Experiência"
        class="text-gray-400 hover:text-error transition-colors duration-200 flex-shrink-0 mt-4"
        (click)="remove.emit()"
      >
        <i class="fas fa-trash-can fa-lg"></i>
      </button>
    </div>
  `,
  styles: []
})
export class ExperienceFormComponent implements OnInit, OnDestroy {
  @Input() experienceForm!: FormGroup;
  @Input() formId: string = Math.random().toString(36).substring(2, 9);
  @Output() remove = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private technologiesService = inject(TechnologiesService);
  private softSkillsService = inject(SoftSkillsService);
  private subscriptions: Subscription[] = [];

  // Technology suggestion properties
  technologies: Technology[] = [];
  filteredTechnologies: Technology[] = [];
  showTechnologySuggestions = false;
  selectedTechnologyIndex = -1;
  isUsingKeyboardNavigation = false; // Track if user is using keyboard navigation
  technologyInput = new FormControl('');

  // Soft Skills suggestion properties
  softSkills: SoftSkill[] = [];
  filteredSoftSkills: SoftSkill[] = [];
  showSoftSkillSuggestions = false;
  selectedSoftSkillIndex = -1;
  isUsingSoftSkillKeyboardNavigation = false;
  softSkillInput = new FormControl('');

  ngOnInit(): void {
    // Load technologies and soft skills
    this.loadTechnologies();
    this.loadSoftSkills();

    // Set up technology input autocomplete
    const techInputSub = this.technologyInput.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => this.filterTechnologies(value || ''))
    ).subscribe(technologies => {
      this.filteredTechnologies = technologies;
      this.showTechnologySuggestions = technologies.length > 0;
      this.selectedTechnologyIndex = -1; // Reset selection when input changes
    });

    // Set up soft skills input autocomplete
    const softSkillInputSub = this.softSkillInput.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => this.filterSoftSkills(value || ''))
    ).subscribe(softSkills => {
      this.filteredSoftSkills = softSkills;
      this.showSoftSkillSuggestions = softSkills.length > 0;
      this.selectedSoftSkillIndex = -1; // Reset selection when input changes
    });

    this.subscriptions.push(techInputSub, softSkillInputSub);
  }

  ngOnDestroy(): void {
    // Clean up subscriptions to prevent memory leaks
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadTechnologies(): void {
    this.technologiesService.getAll().subscribe(technologies => {
      this.technologies = technologies;
    });
  }

  loadSoftSkills(): void {
    this.softSkillsService.getAll().subscribe(softSkills => {
      this.softSkills = softSkills;
    });
  }

  // Filter technologies based on input value
  filterTechnologies(value: string): Observable<Technology[]> {
    const filterValue = value.toLowerCase();

    // If using keyboard navigation and we have at least 1 character, or if we have 2+ characters
    // show filtered results
    if (filterValue.length === 0) {
      return of([]);
    }

    // If using keyboard navigation or we have 2+ characters, show filtered results
    if (this.isUsingKeyboardNavigation || filterValue.length >= 2) {
      return of(this.technologies.filter(tech =>
        tech.name.toLowerCase().includes(filterValue)
      ));
    }

    // Otherwise, don't show results yet (wait for 2+ characters)
    return of([]);
  }

  // Filter soft skills based on input value
  filterSoftSkills(value: string): Observable<SoftSkill[]> {
    const filterValue = value.toLowerCase();

    // If no input, return empty array
    if (filterValue.length === 0) {
      return of([]);
    }

    // If using keyboard navigation or we have 2+ characters, show filtered results
    if (this.isUsingSoftSkillKeyboardNavigation || filterValue.length >= 2) {
      return of(this.softSkills.filter(skill =>
        skill.name.toLowerCase().includes(filterValue)
      ));
    }

    // Otherwise, don't show results yet (wait for 2+ characters)
    return of([]);
  }

  // Handle focus on technology input
  onTechnologyInputFocus(activityIndex: number): void {
    const value = this.technologyInput.value || '';

    // Show suggestions if:
    // 1. Using keyboard navigation and there's any input value, or
    // 2. There's input value with at least 2 characters
    if ((this.isUsingKeyboardNavigation && value) || (value && value.length >= 2)) {
      this.filterTechnologies(value).subscribe(technologies => {
        this.filteredTechnologies = technologies;
        this.showTechnologySuggestions = technologies.length > 0;
        this.selectedTechnologyIndex = -1; // Reset selection on focus

        // Ensure input maintains focus
        setTimeout(() => {
          const inputElement = document.querySelector('.technology-input') as HTMLElement;
          if (inputElement) {
            inputElement.focus();
          }
        }, 0);
      });
    }
  }

  // Handle focus on soft skill input
  onSoftSkillInputFocus(activityIndex: number): void {
    const value = this.softSkillInput.value || '';

    // Show suggestions if:
    // 1. Using keyboard navigation and there's any input value, or
    // 2. There's input value with at least 2 characters
    if ((this.isUsingSoftSkillKeyboardNavigation && value) || (value && value.length >= 2)) {
      this.filterSoftSkills(value).subscribe(softSkills => {
        this.filteredSoftSkills = softSkills;
        this.showSoftSkillSuggestions = softSkills.length > 0;
        this.selectedSoftSkillIndex = -1; // Reset selection on focus

        // Ensure input maintains focus
        setTimeout(() => {
          const inputElement = document.querySelector('.softskill-input') as HTMLElement;
          if (inputElement) {
            inputElement.focus();
          }
        }, 0);
      });
    }
  }

  // Select a technology from the suggestions
  selectTechnology(technology: Technology, activityIndex: number): void {
    const activityGroup = this.activitiesArray.at(activityIndex) as FormGroup;
    const technologiesControl = activityGroup.get('technologies');

    if (technologiesControl) {
      const currentTechnologies = [...(technologiesControl.value || [])];
      if (!currentTechnologies.includes(technology.name)) {
        currentTechnologies.push(technology.name);
        technologiesControl.setValue(currentTechnologies);
      }
    }

    this.technologyInput.setValue('');
    this.showTechnologySuggestions = false;
    this.selectedTechnologyIndex = -1;
  }

  // Select a soft skill from the suggestions
  selectSoftSkill(softSkill: SoftSkill, activityIndex: number): void {
    const activityGroup = this.activitiesArray.at(activityIndex) as FormGroup;
    const softSkillsControl = activityGroup.get('appliedSoftSkills');

    if (softSkillsControl) {
      const currentSoftSkills = [...(softSkillsControl.value || [])];
      if (!currentSoftSkills.includes(softSkill.name)) {
        currentSoftSkills.push(softSkill.name);
        softSkillsControl.setValue(currentSoftSkills);
      }
    }

    this.softSkillInput.setValue('');
    this.showSoftSkillSuggestions = false;
    this.selectedSoftSkillIndex = -1;
  }

  // Hide technology suggestions
  hideTechnologySuggestions(): void {
    // Don't hide if user is using keyboard navigation
    if (this.isUsingKeyboardNavigation) {
      return;
    }

    // Store a reference to the current input value
    const currentValue = this.technologyInput.value;

    // Use a longer timeout to give users more time to make a selection
    setTimeout(() => {
      // Only hide suggestions if:
      // 1. User is not using keyboard navigation, AND
      // 2. The input value hasn't changed (user isn't typing)
      if (!this.isUsingKeyboardNavigation && this.technologyInput.value === currentValue) {
        this.showTechnologySuggestions = false;
      }
    }, 2000); // Increased timeout from 1000ms to 2000ms
  }

  // Hide soft skill suggestions
  hideSoftSkillSuggestions(): void {
    // Don't hide if user is using keyboard navigation
    if (this.isUsingSoftSkillKeyboardNavigation) {
      return;
    }

    // Store a reference to the current input value
    const currentValue = this.softSkillInput.value;

    // Use a longer timeout to give users more time to make a selection
    setTimeout(() => {
      // Only hide suggestions if:
      // 1. User is not using keyboard navigation, AND
      // 2. The input value hasn't changed (user isn't typing)
      if (!this.isUsingSoftSkillKeyboardNavigation && this.softSkillInput.value === currentValue) {
        this.showSoftSkillSuggestions = false;
      }
    }, 2000);
  }

  // Handle keyboard navigation in the suggestions dropdown
  onTechnologyKeydown(event: KeyboardEvent, activityIndex: number): void {
    // Set keyboard navigation flag for navigation keys
    if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End'].includes(event.key)) {
      this.isUsingKeyboardNavigation = true;

      // Reset the flag after a longer delay to allow for continuous navigation
      setTimeout(() => {
        this.isUsingKeyboardNavigation = false;
      }, 5000); // Increased from 2000ms to 5000ms
    }

    // If suggestions are not visible but we have input and arrow keys are pressed, show suggestions
    if (!this.showTechnologySuggestions && this.technologyInput.value) {
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp'].includes(event.key)) {
        // Force show suggestions when using keyboard navigation
        this.onTechnologyInputFocus(activityIndex);

        // If we still don't have suggestions visible after focus, try to show them directly
        if (!this.showTechnologySuggestions && this.technologyInput.value) {
          const value = this.technologyInput.value;
          this.filterTechnologies(value).subscribe(technologies => {
            this.filteredTechnologies = technologies;
            this.showTechnologySuggestions = technologies.length > 0;
            this.selectedTechnologyIndex = 0; // Select the first item
          });
        }

        event.preventDefault();
        return;
      }
    }

    // Only handle keyboard navigation when suggestions are visible
    if (!this.showTechnologySuggestions || this.filteredTechnologies.length === 0) {
      // If suggestions are not visible but Enter is pressed, try to add the current input value
      if (event.key === 'Enter' && this.technologyInput.value) {
        event.preventDefault();
        this.tryAddExactMatchOrInput(activityIndex);
        return;
      }
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.selectedTechnologyIndex = Math.min(this.selectedTechnologyIndex + 1, this.filteredTechnologies.length - 1);
        this.ensureSelectedItemVisible();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.selectedTechnologyIndex = Math.max(this.selectedTechnologyIndex - 1, -1);
        this.ensureSelectedItemVisible();
        break;
      case 'PageDown':
        event.preventDefault();
        // Move down by 5 items or to the end of the list
        this.selectedTechnologyIndex = Math.min(this.selectedTechnologyIndex + 5, this.filteredTechnologies.length - 1);
        this.ensureSelectedItemVisible();
        break;
      case 'PageUp':
        event.preventDefault();
        // Move up by 5 items or to the beginning of the list
        this.selectedTechnologyIndex = Math.max(this.selectedTechnologyIndex - 5, 0);
        this.ensureSelectedItemVisible();
        break;
      case 'Home':
        event.preventDefault();
        // Move to the first item
        this.selectedTechnologyIndex = 0;
        this.ensureSelectedItemVisible();
        break;
      case 'End':
        event.preventDefault();
        // Move to the last item
        this.selectedTechnologyIndex = this.filteredTechnologies.length - 1;
        this.ensureSelectedItemVisible();
        break;
      case 'Enter':
        event.preventDefault();
        if (this.selectedTechnologyIndex >= 0) {
          this.selectTechnology(this.filteredTechnologies[this.selectedTechnologyIndex], activityIndex);
        } else {
          // If no suggestion is selected, try to find an exact match
          this.tryAddExactMatchOrInput(activityIndex);
        }
        break;
      case 'Escape':
        event.preventDefault();
        this.showTechnologySuggestions = false;
        this.selectedTechnologyIndex = -1;
        break;
    }
  }

  // Handle keyboard navigation in the soft skills suggestions dropdown
  onSoftSkillKeydown(event: KeyboardEvent, activityIndex: number): void {
    // Set keyboard navigation flag for navigation keys
    if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End'].includes(event.key)) {
      this.isUsingSoftSkillKeyboardNavigation = true;

      // Reset the flag after a longer delay to allow for continuous navigation
      setTimeout(() => {
        this.isUsingSoftSkillKeyboardNavigation = false;
      }, 5000);
    }

    // If suggestions are not visible but we have input and arrow keys are pressed, show suggestions
    if (!this.showSoftSkillSuggestions && this.softSkillInput.value) {
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp'].includes(event.key)) {
        // Force show suggestions when using keyboard navigation
        this.onSoftSkillInputFocus(activityIndex);

        // If we still don't have suggestions visible after focus, try to show them directly
        if (!this.showSoftSkillSuggestions && this.softSkillInput.value) {
          const value = this.softSkillInput.value;
          this.filterSoftSkills(value).subscribe(softSkills => {
            this.filteredSoftSkills = softSkills;
            this.showSoftSkillSuggestions = softSkills.length > 0;
            this.selectedSoftSkillIndex = 0; // Select the first item
          });
        }

        event.preventDefault();
        return;
      }
    }

    // Only handle keyboard navigation when suggestions are visible
    if (!this.showSoftSkillSuggestions || this.filteredSoftSkills.length === 0) {
      // If suggestions are not visible but Enter is pressed, try to add the current input value
      if (event.key === 'Enter' && this.softSkillInput.value) {
        event.preventDefault();
        this.tryAddExactMatchOrInputSoftSkill(activityIndex);
        return;
      }
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.selectedSoftSkillIndex = Math.min(this.selectedSoftSkillIndex + 1, this.filteredSoftSkills.length - 1);
        this.ensureSelectedSoftSkillItemVisible();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.selectedSoftSkillIndex = Math.max(this.selectedSoftSkillIndex - 1, -1);
        this.ensureSelectedSoftSkillItemVisible();
        break;
      case 'PageDown':
        event.preventDefault();
        // Move down by 5 items or to the end of the list
        this.selectedSoftSkillIndex = Math.min(this.selectedSoftSkillIndex + 5, this.filteredSoftSkills.length - 1);
        this.ensureSelectedSoftSkillItemVisible();
        break;
      case 'PageUp':
        event.preventDefault();
        // Move up by 5 items or to the beginning of the list
        this.selectedSoftSkillIndex = Math.max(this.selectedSoftSkillIndex - 5, 0);
        this.ensureSelectedSoftSkillItemVisible();
        break;
      case 'Home':
        event.preventDefault();
        // Move to the first item
        this.selectedSoftSkillIndex = 0;
        this.ensureSelectedSoftSkillItemVisible();
        break;
      case 'End':
        event.preventDefault();
        // Move to the last item
        this.selectedSoftSkillIndex = this.filteredSoftSkills.length - 1;
        this.ensureSelectedSoftSkillItemVisible();
        break;
      case 'Enter':
        event.preventDefault();
        if (this.selectedSoftSkillIndex >= 0) {
          this.selectSoftSkill(this.filteredSoftSkills[this.selectedSoftSkillIndex], activityIndex);
        } else {
          // If no suggestion is selected, try to find an exact match
          this.tryAddExactMatchOrInputSoftSkill(activityIndex);
        }
        break;
      case 'Escape':
        event.preventDefault();
        this.showSoftSkillSuggestions = false;
        this.selectedSoftSkillIndex = -1;
        break;
    }
  }

  get activitiesArray(): FormArray {
    return this.experienceForm.get('activitiesPerformed') as FormArray;
  }

  addActivity(): void {
    this.activitiesArray.push(
      this.fb.group({
        activity: [''],
        problemSolved: [''],
        technologies: [[]],
        appliedSoftSkills: [[]]
      })
    );
  }

  removeActivity(index: number): void {
    this.activitiesArray.removeAt(index);
  }

  // Remove a technology from an activity
  removeTechnologyFromActivity(activityIndex: number, techIndex: number): void {
    const activityGroup = this.activitiesArray.at(activityIndex) as FormGroup;
    const technologiesControl = activityGroup.get('technologies');

    if (technologiesControl) {
      const currentTechnologies = [...(technologiesControl.value || [])];
      currentTechnologies.splice(techIndex, 1);
      technologiesControl.setValue(currentTechnologies);
    }
  }

  // Remove a soft skill from an activity
  removeSoftSkillFromActivity(activityIndex: number, skillIndex: number): void {
    const activityGroup = this.activitiesArray.at(activityIndex) as FormGroup;
    const softSkillsControl = activityGroup.get('appliedSoftSkills');

    if (softSkillsControl) {
      const currentSoftSkills = [...(softSkillsControl.value || [])];
      currentSoftSkills.splice(skillIndex, 1);
      softSkillsControl.setValue(currentSoftSkills);
    }
  }

  /**
   * Try to add a technology that exactly matches the input
   * Only allows adding technologies that exist in the database
   */
  tryAddExactMatchOrInput(activityIndex: number): void {
    const value = this.technologyInput.value?.trim() || '';
    if (!value) return;

    // Check if there's an exact match in the filtered technologies
    const exactMatch = this.filteredTechnologies.find(
      tech => tech.name.toLowerCase() === value.toLowerCase()
    );

    if (exactMatch) {
      this.selectTechnology(exactMatch, activityIndex);
    } else {
      // If no exact match, check against all technologies in the database
      const matchInAllTechnologies = this.technologies.find(
        tech => tech.name.toLowerCase() === value.toLowerCase()
      );

      if (matchInAllTechnologies) {
        this.selectTechnology(matchInAllTechnologies, activityIndex);
      } else {
        // If the technology doesn't exist in the database, show feedback
        console.warn('Technology not found in database:', value);
        // Clear the input but don't add the technology
        this.technologyInput.setValue('');
        // Highlight the input field to indicate an error
        this.showInvalidTechnologyFeedback();
      }
    }
  }

  /**
   * Try to add a soft skill that exactly matches the input
   * Only allows adding soft skills that exist in the database
   */
  tryAddExactMatchOrInputSoftSkill(activityIndex: number): void {
    const value = this.softSkillInput.value?.trim() || '';
    if (!value) return;

    // Check if there's an exact match in the filtered soft skills
    const exactMatch = this.filteredSoftSkills.find(
      skill => skill.name.toLowerCase() === value.toLowerCase()
    );

    if (exactMatch) {
      this.selectSoftSkill(exactMatch, activityIndex);
    } else {
      // If no exact match, check against all soft skills in the database
      const matchInAllSoftSkills = this.softSkills.find(
        skill => skill.name.toLowerCase() === value.toLowerCase()
      );

      if (matchInAllSoftSkills) {
        this.selectSoftSkill(matchInAllSoftSkills, activityIndex);
      } else {
        // If the soft skill doesn't exist in the database, show feedback
        console.warn('Soft skill not found in database:', value);
        // Clear the input but don't add the soft skill
        this.softSkillInput.setValue('');
        // Highlight the input field to indicate an error
        this.showInvalidSoftSkillFeedback();
      }
    }
  }

  /**
   * Show visual feedback when an invalid technology is entered
   */
  private showInvalidTechnologyFeedback(): void {
    const inputElement = document.querySelector('.technology-input') as HTMLElement;
    if (inputElement) {
      // Add a CSS class for visual feedback
      inputElement.classList.add('invalid-input');

      // Remove the class after a short delay
      setTimeout(() => {
        inputElement.classList.remove('invalid-input');
      }, 1500);
    }
  }

  /**
   * Show visual feedback when an invalid soft skill is entered
   */
  private showInvalidSoftSkillFeedback(): void {
    const inputElement = document.querySelector('.softskill-input') as HTMLElement;
    if (inputElement) {
      // Add a CSS class for visual feedback
      inputElement.classList.add('invalid-input');

      // Remove the class after a short delay
      setTimeout(() => {
        inputElement.classList.remove('invalid-input');
      }, 1500);
    }
  }

  /**
   * Ensure the selected item is visible in the suggestions dropdown
   * This scrolls the container if necessary
   */
  private ensureSelectedItemVisible(): void {
    setTimeout(() => {
      if (this.selectedTechnologyIndex < 0) return;

      const container = document.querySelector('.technology-suggestions');
      const selectedItem = document.querySelector('.technology-suggestion-item.selected');

      if (container && selectedItem) {
        const containerRect = container.getBoundingClientRect();
        const selectedRect = selectedItem.getBoundingClientRect();

        // Check if the selected item is outside the visible area
        if (selectedRect.bottom > containerRect.bottom) {
          // Item is below the visible area, scroll down
          container.scrollTop += (selectedRect.bottom - containerRect.bottom);
        } else if (selectedRect.top < containerRect.top) {
          // Item is above the visible area, scroll up
          container.scrollTop -= (containerRect.top - selectedRect.top);
        }
      }
    }, 0);
  }

  /**
   * Ensure the selected soft skill item is visible in the suggestions dropdown
   * This scrolls the container if necessary
   */
  private ensureSelectedSoftSkillItemVisible(): void {
    setTimeout(() => {
      if (this.selectedSoftSkillIndex < 0) return;

      const container = document.querySelector('.softskill-suggestions');
      const selectedItem = document.querySelector('.softskill-suggestion-item.selected');

      if (container && selectedItem) {
        const containerRect = container.getBoundingClientRect();
        const selectedRect = selectedItem.getBoundingClientRect();

        // Check if the selected item is outside the visible area
        if (selectedRect.bottom > containerRect.bottom) {
          // Item is below the visible area, scroll down
          container.scrollTop += (selectedRect.bottom - containerRect.bottom);
        } else if (selectedRect.top < containerRect.top) {
          // Item is above the visible area, scroll up
          container.scrollTop -= (containerRect.top - selectedRect.top);
        }
      }
    }, 0);
  }
}

import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { firstValueFrom, map, Observable, of, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

// Models
import { Vacancy, VacancyRequirement } from '../../../models/vacancy.model';
import { SoftSkill } from '../../soft-skills/soft-skill.model';

// Services
import { VacancyService } from '../../../core/services/vacancy.service';

// Serviços de Curadoria específicos, conforme a arquitetura do projeto
import { ExperienceLevelsService } from '../../experience-levels/experience-levels.service';
import { ProfessionalAreasService } from '../../professional-areas/professional-areas.service';
import { TechnologiesService } from '../../technologies/technologies.service';
import { LanguagesService } from '../../languages/languages.service';
import { SoftSkillsService } from '../../soft-skills/soft-skills.service';

@Component({
  selector: 'app-vacancy-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './vacancy-form.component.html',
  styleUrls: ['./vacancy-form.component.scss'],
})
export class VacancyFormComponent implements OnInit {
  // --- Injeção de Dependências ---
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private vacancyService = inject(VacancyService);

  // Injeção dos serviços de curadoria específicos
  private experienceLevelsService = inject(ExperienceLevelsService);
  private professionalAreasService = inject(ProfessionalAreasService);
  private technologiesService = inject(TechnologiesService);
  private languagesService = inject(LanguagesService);
  private softSkillsService = inject(SoftSkillsService);

  // --- Estado do Componente ---
  vacancyForm!: FormGroup;
  isEditMode = false;
  loading = false;
  private vacancyId: string | null = null;

  skillInput = new FormControl('');
  filteredSkills: SoftSkill[] = [];
  showSkillSuggestions = false;
  selectedSkillIndex = -1;

  // --- Dados para Dropdowns ---
  levels: string[] = [];
  areas: string[] = [];
  technologies: string[] = [];
  techLevels: string[] = ['Básico', 'Intermediário', 'Avançado'];
  languages: string[] = [];
  langLevels: string[] = ['Básico', 'Intermediário', 'Avançado', 'Fluente', 'Nativo'];

  constructor() {
    this.initForm();
  }

  async ngOnInit(): Promise<void> {
    await this.loadCurationData();

    // Set up skill input autocomplete
    this.skillInput.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => this.filterSkills(value || ''))
    ).subscribe(skills => {
      this.filteredSkills = skills;
      this.showSkillSuggestions = skills.length > 0;
    });

    this.vacancyId = this.route.snapshot.paramMap.get('id');
    if (this.vacancyId) {
      this.isEditMode = true;
      this.loading = true;

      try {
        const vacancy = await firstValueFrom(this.vacancyService.getById(this.vacancyId));
        if (vacancy) {
          this.patchForm(vacancy);
        } else {
          console.error('Vaga não encontrada.');
          this.router.navigate(['/vacancy-management']);
        }
      } catch (error) {
        console.error("Erro ao carregar vaga:", error);
        console.error('Não foi possível carregar os dados da vaga.');
      } finally {
        this.loading = false;
      }
    }
  }

  /**
   * Filter skills based on input value
   * @param value The input value to filter by
   * @returns Observable of filtered skills
   */
  filterSkills(value: string): Observable<SoftSkill[]> {
    const filterValue = value.toLowerCase();

    if (!filterValue) {
      return of([]);
    }

    return this.softSkillsService.getAll().pipe(
      map(skills => skills.filter(skill =>
        skill.name.toLowerCase().includes(filterValue)
      ))
    );
  }

  /**
   * Handle focus on skill input
   */
  onSkillInputFocus(): void {
    const value = this.skillInput.value || '';
    if (value) {
      this.filterSkills(value).subscribe(skills => {
        this.filteredSkills = skills;
        this.showSkillSuggestions = skills.length > 0;
        this.selectedSkillIndex = -1; // Reset selection on focus
      });
    }
  }

  /**
   * Select a skill from the suggestions
   * @param skill The skill to select
   */
  selectSkill(skill: SoftSkill): void {
    this.addSkill(skill.name);
    this.skillInput.setValue('');
    this.showSkillSuggestions = false;
    this.selectedSkillIndex = -1;
  }

  /**
   * Handle keyboard navigation in the suggestions dropdown
   * @param event The keyboard event
   */
  onSkillKeydown(event: KeyboardEvent): void {
    // Only handle keyboard navigation when suggestions are visible
    if (!this.showSkillSuggestions || this.filteredSkills.length === 0) {
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.selectedSkillIndex = Math.min(this.selectedSkillIndex + 1, this.filteredSkills.length - 1);
        this.ensureSelectedItemVisible();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.selectedSkillIndex = Math.max(this.selectedSkillIndex - 1, -1);
        this.ensureSelectedItemVisible();
        break;
      case 'PageDown':
        event.preventDefault();
        // Move down by 5 items or to the end of the list
        this.selectedSkillIndex = Math.min(this.selectedSkillIndex + 5, this.filteredSkills.length - 1);
        this.ensureSelectedItemVisible();
        break;
      case 'PageUp':
        event.preventDefault();
        // Move up by 5 items or to the beginning of the list
        this.selectedSkillIndex = Math.max(this.selectedSkillIndex - 5, 0);
        this.ensureSelectedItemVisible();
        break;
      case 'Home':
        event.preventDefault();
        // Move to the first item
        this.selectedSkillIndex = 0;
        this.ensureSelectedItemVisible();
        break;
      case 'End':
        event.preventDefault();
        // Move to the last item
        this.selectedSkillIndex = this.filteredSkills.length - 1;
        this.ensureSelectedItemVisible();
        break;
      case 'Enter':
        event.preventDefault();
        if (this.selectedSkillIndex >= 0) {
          this.selectSkill(this.filteredSkills[this.selectedSkillIndex]);
        } else {
          // If no suggestion is selected, try to find an exact match
          this.tryAddExactMatchOrInput();
        }
        break;
      case 'Escape':
        event.preventDefault();
        this.showSkillSuggestions = false;
        this.selectedSkillIndex = -1;
        break;
    }
  }

  /**
   * Try to add a skill that exactly matches the input
   * Only allows adding skills that exist in the database
   */
  tryAddExactMatchOrInput(): void {
    const value = this.skillInput.value?.trim() || '';
    if (!value) return;

    // Check if there's an exact match in the filtered skills
    const exactMatch = this.filteredSkills.find(
      skill => skill.name.toLowerCase() === value.toLowerCase()
    );

    if (exactMatch) {
      this.selectSkill(exactMatch);
    } else {
      // If no exact match, check against all skills in the database
      this.softSkillsService.getAll().pipe(
        map(skills => skills.find(skill => skill.name.toLowerCase() === value.toLowerCase()))
      ).subscribe(skill => {
        if (skill) {
          this.selectSkill(skill);
        } else {
          // If the skill doesn't exist in the database, show feedback
          console.warn('Skill not found in database:', value);
          // Clear the input but don't add the skill
          this.skillInput.setValue('');
          // Highlight the input field to indicate an error
          this.showInvalidSkillFeedback();
        }
      });
    }
  }

  /**
   * Show visual feedback when an invalid skill is entered
   */
  private showInvalidSkillFeedback(): void {
    const inputElement = document.querySelector('.tag-input') as HTMLElement;
    if (inputElement) {
      // Add a CSS class for visual feedback
      inputElement.classList.add('invalid-input');

      // Show a tooltip with an error message
      const container = document.querySelector('.tag-input-container') as HTMLElement;
      if (container) {
        const tooltip = document.createElement('div');
        tooltip.className = 'skill-error-tooltip';
        tooltip.textContent = 'Habilidade não encontrada. Por favor, selecione uma da lista.';
        container.appendChild(tooltip);

        // Remove the tooltip after a delay
        setTimeout(() => {
          container.removeChild(tooltip);
        }, 3000);
      }

      // Remove the class after a short delay
      setTimeout(() => {
        inputElement.classList.remove('invalid-input');
      }, 1500);
    }
  }

  /**
   * Hide skill suggestions
   */
  hideSkillSuggestions(): void {
    // Use setTimeout to allow click events to complete first
    setTimeout(() => {
      this.showSkillSuggestions = false;
      this.selectedSkillIndex = -1;
    }, 150); // Increased timeout to ensure click events are processed
  }

  /**
   * Ensure the selected item is visible in the suggestions dropdown
   * This scrolls the container if necessary
   */
  private ensureSelectedItemVisible(): void {
    setTimeout(() => {
      if (this.selectedSkillIndex < 0) return;

      const container = document.querySelector('.skill-suggestions');
      const selectedItem = document.querySelector('.skill-suggestion-item.selected');

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

  // --- Getters para Acesso Fácil aos FormArrays no Template ---
  get requirementsGroup(): FormGroup {
    return this.vacancyForm.get('requirements') as FormGroup;
  }
  get technologiesArray(): FormArray {
    return this.requirementsGroup.get('technologies') as FormArray;
  }
  get languagesArray(): FormArray {
    return this.requirementsGroup.get('languages') as FormArray;
  }
  get skillsArray(): FormArray {
    return this.requirementsGroup.get('skills') as FormArray;
  }

  // --- Inicialização e Manipulação do Formulário ---
  private initForm(): void {
    this.vacancyForm = this.fb.group({
      title: ['', Validators.required],
      imageUrl: [''],
      description: ['', Validators.required],
      level: ['', Validators.required],
      area: ['', Validators.required],
      requirements: this.fb.group({
        technologies: this.fb.array([]),
        languages: this.fb.array([]),
        skills: this.fb.array([]),
      }),
    });
  }

  private patchForm(vacancy: Vacancy): void {
    this.vacancyForm.patchValue({
      title: vacancy.title,
      imageUrl: vacancy.imageUrl,
      description: vacancy.description,
      level: vacancy.level,
      area: vacancy.area,
    });

    this.technologiesArray.clear();
    vacancy.requirements.technologies.forEach(tech => this.addTechnology(tech));

    this.languagesArray.clear();
    vacancy.requirements.languages.forEach(lang => this.addLanguage(lang));

    this.skillsArray.clear();
    vacancy.requirements.skills.forEach(skill => this.addSkill(skill, false));
  }

  /**
   * Carrega os dados das coleções de curadoria para preencher os dropdowns do formulário.
   * Utiliza os serviços específicos que herdam de BaseCurationService.
   */
  private async loadCurationData(): Promise<void> {
    try {
      const results = await Promise.all([
        firstValueFrom(this.experienceLevelsService.getAll().pipe(map(items => items.map(i => i.name)))),
        firstValueFrom(this.professionalAreasService.getAll().pipe(map(items => items.map(i => i.name)))),
        firstValueFrom(this.technologiesService.getAll().pipe(map(items => items.map(i => i.name)))),
        firstValueFrom(this.languagesService.getAll().pipe(map(items => items.map(i => i.name)))),
      ]);

      this.levels = results[0];
      this.areas = results[1];
      this.technologies = results[2];
      this.languages = results[3];

    } catch (error) {
      console.error("Erro ao carregar dados da curadoria:", error);
      console.error("Não foi possível carregar as opções do formulário.");
    }
  }

  // --- Métodos para Manipular FormArrays ---

  // Tecnologias
  createTechnologyGroup(tech?: VacancyRequirement): FormGroup {
    return this.fb.group({
      item: [tech?.item || '', Validators.required],
      level: [tech?.level || '', Validators.required],
    });
  }
  addTechnology(tech?: VacancyRequirement): void {
    this.technologiesArray.push(this.createTechnologyGroup(tech));
  }
  removeTechnology(index: number): void {
    this.technologiesArray.removeAt(index);
  }

  // Idiomas
  createLanguageGroup(lang?: VacancyRequirement): FormGroup {
    return this.fb.group({
      item: [lang?.item || '', Validators.required],
      level: [lang?.level || '', Validators.required],
    });
  }
  addLanguage(lang?: VacancyRequirement): void {
    this.languagesArray.push(this.createLanguageGroup(lang));
  }
  removeLanguage(index: number): void {
    this.languagesArray.removeAt(index);
  }

  // Habilidades (Skills)
  addSkill(skillValue: string, clearInput = true): void {
    const value = skillValue.trim();
    if (value && !this.skillsArray.value.includes(value)) {
      this.skillsArray.push(this.fb.control(value, Validators.required));
    }
    if (clearInput) {
      this.skillInput.reset();
    }
  }

  onSkillEnter(event: Event): void {
    event.preventDefault();
    this.tryAddExactMatchOrInput();
  }

  removeSkill(index: number): void {
    this.skillsArray.removeAt(index);
  }

  // --- Ação de Submissão ---
  async onSubmit(): Promise<void> {
    if (this.vacancyForm.invalid) {
      console.warn('Por favor, preencha todos os campos obrigatórios.');
      this.vacancyForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formValue = this.vacancyForm.value as Vacancy;

    try {
      if (this.isEditMode && this.vacancyId) {
        await this.vacancyService.update(this.vacancyId, formValue);
        console.log('Vaga atualizada com sucesso!');
      } else {
        await this.vacancyService.create(formValue);
        console.log('Vaga criada com sucesso!');
      }
      this.router.navigate(['/vacancy-management']);
    } catch (error) {
      console.error('Erro ao salvar vaga:', error);
      console.error('Ocorreu um erro ao salvar a vaga. Tente novamente.');
    } finally {
      this.loading = false;
    }
  }
}

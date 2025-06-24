import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { VacancyService } from '../../../core/services/vacancy.service';
import { Vacancy, VacancyRequirement } from '../../../models/vacancy.model';
import { Observable, Subscription, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { serverTimestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-vacancy-form',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './vacancy-form.component.html',
  styleUrls: ['./vacancy-form.component.scss']
})
export class VacancyFormComponent implements OnInit, OnDestroy {
  vacancyForm!: FormGroup;
  isEditMode = false;
  vacancyId: string | null = null;
  loading = false;
  subscription = new Subscription();

  // Mock data for dropdowns - in a real app, these would come from services
  areas = ['Desenvolvimento de Software', 'Design de Produto (UX/UI)', 'DevOps / SRE', 'Dados', 'Gestão de Projetos'];
  levels = ['Júnior', 'Pleno', 'Sênior'];
  technologies = ['Angular', 'React', 'Vue.js', 'Node.js', 'Java', 'Python', 'C#', '.NET', 'PHP', 'Ruby', 'Go', 'Rust', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'SASS', 'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Firebase'];
  techLevels = ['Básico', 'Intermediário', 'Avançado'];
  languages = ['Inglês', 'Espanhol', 'Português', 'Francês', 'Alemão', 'Italiano', 'Mandarim', 'Japonês', 'Coreano'];
  langLevels = ['Básico', 'Intermediário', 'Avançado', 'Fluente', 'Nativo'];

  private fb = inject(FormBuilder);
  private vacancyService = inject(VacancyService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit(): void {
    this.initForm();

    this.subscription.add(
      this.route.paramMap.pipe(
        switchMap(params => {
          const id = params.get('id');
          this.vacancyId = id;
          this.isEditMode = !!id;

          if (this.isEditMode && id) {
            return this.vacancyService.getById(id);
          }
          return of(null);
        }),
        tap(vacancy => {
          if (vacancy) {
            this.populateForm(vacancy);
          }
        })
      ).subscribe()
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  initForm(): void {
    this.vacancyForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      imageUrl: [''],
      area: ['', [Validators.required]],
      level: ['', [Validators.required]],
      requirements: this.fb.group({
        technologies: this.fb.array([]),
        languages: this.fb.array([]),
        skills: this.fb.array([])
      })
    });

    // Add initial empty rows
    this.addTechnology();
    this.addLanguage();
    this.addSkill('');
  }

  populateForm(vacancy: Vacancy): void {
    this.vacancyForm.patchValue({
      title: vacancy.title,
      description: vacancy.description,
      imageUrl: vacancy.imageUrl,
      area: vacancy.area,
      level: vacancy.level
    });

    // Clear default arrays
    this.technologiesArray.clear();
    this.languagesArray.clear();
    this.skillsArray.clear();

    // Add technologies
    if (vacancy.requirements?.technologies?.length) {
      vacancy.requirements.technologies.forEach(tech => {
        this.addTechnology(tech.item, tech.level);
      });
    } else {
      this.addTechnology();
    }

    // Add languages
    if (vacancy.requirements?.languages?.length) {
      vacancy.requirements.languages.forEach(lang => {
        this.addLanguage(lang.item, lang.level);
      });
    } else {
      this.addLanguage();
    }

    // Add skills
    if (vacancy.requirements?.skills?.length) {
      vacancy.requirements.skills.forEach(skill => {
        this.addSkill(skill);
      });
    } else {
      this.addSkill('');
    }
  }

  get technologiesArray(): FormArray {
    return this.vacancyForm.get('requirements')?.get('technologies') as FormArray;
  }

  get languagesArray(): FormArray {
    return this.vacancyForm.get('requirements')?.get('languages') as FormArray;
  }

  get skillsArray(): FormArray {
    return this.vacancyForm.get('requirements')?.get('skills') as FormArray;
  }

  addTechnology(item = '', level = ''): void {
    this.technologiesArray.push(
      this.fb.group({
        item: [item],
        level: [level]
      })
    );
  }

  removeTechnology(index: number): void {
    this.technologiesArray.removeAt(index);
  }

  addLanguage(item = '', level = ''): void {
    this.languagesArray.push(
      this.fb.group({
        item: [item],
        level: [level]
      })
    );
  }

  removeLanguage(index: number): void {
    this.languagesArray.removeAt(index);
  }

  addSkill(skill: string): void {
    this.skillsArray.push(this.fb.control(skill));
  }

  removeSkill(index: number): void {
    this.skillsArray.removeAt(index);
  }

  onSubmit(): void {
    if (this.vacancyForm.invalid) {
      return;
    }

    this.loading = true;
    const formValue = this.vacancyForm.value;

    // Filter out empty requirements
    const technologies = formValue.requirements.technologies
      .filter((tech: VacancyRequirement) => tech.item && tech.level);

    const languages = formValue.requirements.languages
      .filter((lang: VacancyRequirement) => lang.item && lang.level);

    const skills = formValue.requirements.skills
      .filter((skill: string) => skill.trim() !== '');

    const vacancy = {
      ...formValue,
      // Set name to the same value as title to satisfy CurationItem interface
      name: formValue.title,
      requirements: {
        technologies,
        languages,
        skills
      }
    };

    let action$: Observable<void>;

    if (this.isEditMode && this.vacancyId) {
      action$ = this.vacancyService.update(this.vacancyId, {
        ...vacancy,
        updatedAt: serverTimestamp()
      });
    } else {
      action$ = this.vacancyService.create({
        ...vacancy,
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }

    this.subscription.add(
      action$.subscribe({
        next: () => {
          this.router.navigate(['/vacancy-management']);
        },
        error: (error) => {
          console.error('Error saving vacancy:', error);
          this.loading = false;
        }
      })
    );
  }
}

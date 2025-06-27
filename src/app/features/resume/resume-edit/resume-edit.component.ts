import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { ResumeService } from '../../../core/services/resume.service';
import { AuthService } from '../../../core/services/auth.service';
import { Resume, ExperienceType } from '../../../models/resume.model';
import { ResumeStepperComponent } from '../components/resume-stepper/resume-stepper.component';
import { ExperienceFormComponent } from '../components/experience-form/experience-form.component';
import { LanguagesService } from '../../languages/languages.service';
import { Language as LanguageModel } from '../../languages/language.model';

// Interfaces for form data
interface AcademicFormation {
  level: string;
  courseName: string;
  institution: string;
  startDate: Date | string;
  endDate: Date | string | null;
}

interface Language {
  language: string;
  proficiency: string;
}

interface Activity {
  activity: string;
  problemSolved: string;
  technologies: string[];
  appliedSoftSkills: string[];
}

interface ProfessionalExperience {
  experienceType: ExperienceType;
  companyName: string;
  role: string;
  startDate: Date | string;
  endDate: Date | string | null;
  isCurrent: boolean;
  activitiesPerformed: Activity[];
}

@Component({
  selector: 'app-resume-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ResumeStepperComponent,
    ExperienceFormComponent
  ],
  templateUrl: './resume-edit.component.html',
  styleUrls: []
})
export class ResumeEditComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private resumeService = inject(ResumeService);
  private authService = inject(AuthService);
  private languagesService = inject(LanguagesService);
  private router = inject(Router);

  resumeForm!: FormGroup;
  currentStep = 0;
  steps = ['Pessoal', 'Perfil', 'Experiência'];
  loading = false;
  showSaveIndicator = false;
  languages: LanguageModel[] = [];
  private autoSaveTimeout: NodeJS.Timeout | undefined;
  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.initForm();
    this.loadLanguages();
  }

  loadLanguages(): void {
    const languagesSub = this.languagesService.getAll().subscribe(languages => {
      this.languages = languages;
      // Load resume data after languages are loaded
      this.loadResumeData();
    });
    this.subscriptions.push(languagesSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout);
    }
  }

  initForm(): void {
    this.resumeForm = this.fb.group({
      userId: [''],
      status: ['draft'],
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      linkedinUrl: [''],
      mainArea: ['', Validators.required],
      experienceLevel: ['', Validators.required],
      summary: ['', Validators.required],
      academicFormations: this.fb.array([]),
      languages: this.fb.array([]),
      professionalExperiences: this.fb.array([])
    });
  }

  loadResumeData(): void {
    // Get the current user from the signal
    const user = this.authService.currentUser();
    if (user) {
      this.resumeForm.patchValue({ userId: user.uid });

      const resumeSub = this.resumeService.getResumeById(user.uid).subscribe(resume => {
        if (resume) {
          this.patchFormWithResumeData(resume);
        } else {
          // Initialize with empty arrays
          this.addFormation();
          this.addLanguage();
          this.addExperience();
        }
      });

      this.subscriptions.push(resumeSub);
    } else {
      // Set up a subscription to listen for changes in the user state
      const userStateSub = this.authService.userState$.subscribe(() => {
        const updatedUser = this.authService.currentUser();
        if (updatedUser) {
          this.resumeForm.patchValue({ userId: updatedUser.uid });

          const resumeSub = this.resumeService.getResumeById(updatedUser.uid).subscribe(resume => {
            if (resume) {
              this.patchFormWithResumeData(resume);
            } else {
              // Initialize with empty arrays
              this.addFormation();
              this.addLanguage();
              this.addExperience();
            }
          });

          this.subscriptions.push(resumeSub);
        }
      });

      this.subscriptions.push(userStateSub);
    }
  }

  patchFormWithResumeData(resume: Resume): void {
    // Clear existing form arrays
    this.academicFormationsArray.clear();
    this.languagesArray.clear();
    this.professionalExperiencesArray.clear();

    // Patch basic fields
    this.resumeForm.patchValue({
      userId: resume.userId,
      status: resume.status,
      fullName: resume.fullName,
      email: resume.email,
      phone: resume.phone,
      linkedinUrl: resume.linkedinUrl,
      mainArea: resume.mainArea,
      experienceLevel: resume.experienceLevel,
      summary: resume.summary
    });

    // Patch academic formations
    if (resume.academicFormations && resume.academicFormations.length > 0) {
      resume.academicFormations.forEach(formation => {
        // Format dates for HTML date input (YYYY-MM-DD)
        const formattedFormation = {
          ...formation,
          startDate: formation.startDate ? this.formatDateForInput(formation.startDate) : '',
          endDate: formation.endDate ? this.formatDateForInput(formation.endDate) : ''
        };
        this.academicFormationsArray.push(this.createFormationGroup(formattedFormation));
      });
    } else {
      this.addFormation();
    }

    // Patch languages
    if (resume.languages && resume.languages.length > 0) {
      resume.languages.forEach(language => {
        this.languagesArray.push(this.createLanguageGroup(language));
      });
    } else {
      this.addLanguage();
    }

    // Patch professional experiences
    if (resume.professionalExperiences && resume.professionalExperiences.length > 0) {
      resume.professionalExperiences.forEach(experience => {
        // Format dates for HTML date input (YYYY-MM-DD)
        const formattedExperience = {
          ...experience,
          startDate: experience.startDate ? this.formatDateForInput(experience.startDate) : '',
          endDate: experience.endDate ? this.formatDateForInput(experience.endDate) : ''
        };

        const expGroup = this.createExperienceGroup(formattedExperience);

        // Clear the activities array
        const activitiesArray = expGroup.get('activitiesPerformed') as FormArray;
        activitiesArray.clear();

        // Add each activity
        if (experience.activitiesPerformed && experience.activitiesPerformed.length > 0) {
          experience.activitiesPerformed.forEach(activity => {
            activitiesArray.push(this.createActivityGroup(activity));
          });
        } else {
          activitiesArray.push(this.createActivityGroup());
        }

        this.professionalExperiencesArray.push(expGroup);
      });
    } else {
      this.addExperience();
    }
  }

  // Form array getters
  get academicFormationsArray(): FormArray {
    return this.resumeForm.get('academicFormations') as FormArray;
  }

  get languagesArray(): FormArray {
    return this.resumeForm.get('languages') as FormArray;
  }

  get professionalExperiencesArray(): FormArray {
    return this.resumeForm.get('professionalExperiences') as FormArray;
  }

  // Helper method to get professional experiences as FormGroup array for the template
  get professionalExperiencesFormGroups(): FormGroup[] {
    return this.professionalExperiencesArray.controls as FormGroup[];
  }

  // Form group creators
  createFormationGroup(formation?: AcademicFormation): FormGroup {
    return this.fb.group({
      level: [formation?.level || ''],
      courseName: [formation?.courseName || ''],
      institution: [formation?.institution || ''],
      startDate: [formation?.startDate || ''],
      endDate: [formation?.endDate || '']
    });
  }

  createLanguageGroup(language?: Language): FormGroup {
    // Fix for language field not being populated correctly
    // The language property from the Resume model needs to match the name property
    // of the Language objects from the LanguagesService
    return this.fb.group({
      language: [language?.language || ''],
      proficiency: [language?.proficiency || '']
    });
  }

  createExperienceGroup(experience?: ProfessionalExperience): FormGroup {
    return this.fb.group({
      experienceType: [experience?.experienceType || 'CLT'],
      companyName: [experience?.companyName || ''],
      role: [experience?.role || ''],
      startDate: [experience?.startDate || ''],
      endDate: [experience?.endDate || ''],
      isCurrent: [experience?.isCurrent || false],
      activitiesPerformed: this.fb.array([])
    });
  }

  createActivityGroup(activity?: Activity): FormGroup {
    return this.fb.group({
      activity: [activity?.activity || ''],
      problemSolved: [activity?.problemSolved || ''],
      technologies: [activity?.technologies || []],
      appliedSoftSkills: [activity?.appliedSoftSkills || []]
    });
  }

  // Dynamic form methods
  addFormation(): void {
    this.academicFormationsArray.push(this.createFormationGroup());
    this.triggerAutoSave();
  }

  removeFormation(index: number): void {
    this.academicFormationsArray.removeAt(index);
    this.triggerAutoSave();
  }

  addLanguage(): void {
    this.languagesArray.push(this.createLanguageGroup());
    this.triggerAutoSave();
  }

  removeLanguage(index: number): void {
    this.languagesArray.removeAt(index);
    this.triggerAutoSave();
  }

  addExperience(): void {
    const expGroup = this.createExperienceGroup();
    const activitiesArray = expGroup.get('activitiesPerformed') as FormArray;
    activitiesArray.push(this.createActivityGroup());
    this.professionalExperiencesArray.push(expGroup);
    this.triggerAutoSave();
  }

  removeExperience(index: number): void {
    this.professionalExperiencesArray.removeAt(index);
    this.triggerAutoSave();
  }

  // Step navigation
  nextStep(): void {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      window.scrollTo(0, 0);
    }
  }

  prevStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
      window.scrollTo(0, 0);
    }
  }

  // Step validation
  isStep1Invalid(): boolean {
    const controls = ['fullName', 'email'];
    return controls.some(controlName => this.resumeForm.get(controlName)?.invalid);
  }

  isStep2Invalid(): boolean {
    const controls = ['mainArea', 'experienceLevel', 'summary'];
    return controls.some(controlName => this.resumeForm.get(controlName)?.invalid);
  }

  // Auto-save functionality
  triggerAutoSave(): void {
    this.showSaveIndicator = false;

    if (this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout);
    }

    this.autoSaveTimeout = setTimeout(() => {
      if (this.resumeForm.valid) {
        this.saveResume(true);
      }
    }, 2000);
  }

  // Form submission
  onSubmit(): void {
    if (this.resumeForm.invalid) {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.resumeForm);
      return;
    }

    this.saveResume(false);
  }

  saveResume(isAutoSave: boolean): void {
    if (!isAutoSave) {
      this.loading = true;
    }

    const formValue = this.resumeForm.value;

    // Set status to published if it's a manual save
    if (!isAutoSave) {
      formValue.status = 'published';
    }

    // Convert date strings to Date objects
    if (formValue.academicFormations) {
      formValue.academicFormations.forEach((formation: AcademicFormation) => {
        if (formation.startDate) formation.startDate = new Date(formation.startDate as string);
        if (formation.endDate) formation.endDate = new Date(formation.endDate as string);
      });
    }

    if (formValue.professionalExperiences) {
      formValue.professionalExperiences.forEach((experience: ProfessionalExperience) => {
        if (experience.startDate) experience.startDate = new Date(experience.startDate as string);
        if (experience.endDate && !experience.isCurrent) experience.endDate = new Date(experience.endDate as string);
        if (experience.isCurrent) experience.endDate = null;
      });
    }

    this.resumeService.saveResume(formValue).subscribe({
      next: () => {
        if (isAutoSave) {
          this.showSaveIndicator = true;
          setTimeout(() => {
            this.showSaveIndicator = false;
          }, 2000);
        } else {
          this.loading = false;
          this.router.navigate(['/resume']);
        }
      },
      error: (error) => {
        console.error('Error saving resume:', error);
        this.loading = false;
      }
    });
  }

  // Helper method to mark all controls in a form group as touched
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach(ctrl => {
          if (ctrl instanceof FormGroup) {
            this.markFormGroupTouched(ctrl);
          }
        });
      }
    });
  }

  // Helper method to format Date objects to YYYY-MM-DD string format for HTML date inputs
  private formatDateForInput(date: Date | { toDate: () => Date } | { seconds: number, nanoseconds: number } | string | null | undefined): string {
    if (!date) return '';

    try {
      // Convert to JavaScript Date if it's a Firestore Timestamp or string
      let jsDate;
      if (date instanceof Date) {
        jsDate = date;
      } else if (typeof date === 'object' && 'toDate' in date && typeof date.toDate === 'function') {
        // Handle Firestore Timestamp
        jsDate = date.toDate();
      } else if (typeof date === 'object' && 'seconds' in date && 'nanoseconds' in date) {
        // Handle Firestore Timestamp in a different format
        jsDate = new Date(date.seconds * 1000 + date.nanoseconds / 1000000);
      } else if (typeof date === 'string') {
        // Handle string format
        jsDate = new Date(date);
      } else {
        // Handle other formats
        jsDate = new Date(date as unknown as string | number | Date);
      }

      // Check if the date is valid
      if (isNaN(jsDate.getTime())) {
        console.error('Invalid date:', date);
        return '';
      }

      // Format as YYYY-MM-DD
      return jsDate.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  }
}

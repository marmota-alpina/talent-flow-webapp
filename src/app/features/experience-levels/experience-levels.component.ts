import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseCurationComponent } from '../../core/components/base-curation.component';
import { BaseCurationService } from '../../core/services/base-curation.service';
import { ExperienceLevel, ExperienceLevelColor } from './experience-level.model';
import { CurationItemStatus } from '../../models/curation-item.model';
import { ExperienceLevelsService } from './experience-levels.service';

/**
 * Component for managing experience levels
 * Extends the BaseCurationComponent with the ExperienceLevel type
 */
@Component({
  selector: 'app-experience-levels',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    ExperienceLevelsService,
    { provide: BaseCurationService, useExisting: ExperienceLevelsService }
  ],
  templateUrl: './experience-levels.component.html',
  styleUrl: './experience-levels.component.scss'
})
export class ExperienceLevelsComponent extends BaseCurationComponent<ExperienceLevel> {
  // Make enums available to the template
  protected readonly CurationItemStatus = CurationItemStatus;
  protected readonly ExperienceLevelColor = ExperienceLevelColor;

  // Form model for creating/editing experience levels
  protected formModel: Partial<ExperienceLevel> = {
    name: '',
    description: '',
    level: 1,
    yearsRange: '',
    color: ExperienceLevelColor.ENTRY
  };

  constructor() {
    super();
  }

  /**
   * Reset the form model
   */
  protected resetForm(): void {
    this.formModel = {
      name: '',
      description: '',
      level: 1,
      yearsRange: '',
      color: ExperienceLevelColor.ENTRY
    };
  }

  /**
   * Open the modal to create a new experience level
   */
  override openCreateModal(): void {
    this.resetForm();
    super.openCreateModal();
  }

  /**
   * Open the modal to edit an existing experience level
   * @param level The experience level to edit
   */
  override openEditModal(level: ExperienceLevel): void {
    this.formModel = { ...level };
    super.openEditModal(level);
  }

  /**
   * Save the current experience level (create or update)
   */
  protected onSave(): void {
    super.saveItem(this.formModel);
  }

  /**
   * Get the color style for an experience level
   * @param level The experience level
   * @returns The color style object
   */
  protected getColorStyle(level: ExperienceLevel): Record<string, string> {
    return level.color ? { 'background-color': level.color } : {};
  }
}

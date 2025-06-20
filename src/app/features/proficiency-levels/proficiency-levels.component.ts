import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseCurationComponent } from '../../core/components/base-curation.component';
import { BaseCurationService } from '../../core/services/base-curation.service';
import { ProficiencyLevel, ProficiencyLevelColor } from './proficiency-level.model';
import { CurationItemStatus } from '../../models/curation-item.model';
import { ProficiencyLevelsService } from './proficiency-levels.service';

/**
 * Component for managing proficiency levels
 * Extends the BaseCurationComponent with the ProficiencyLevel type
 */
@Component({
  selector: 'app-proficiency-levels',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    ProficiencyLevelsService,
    { provide: BaseCurationService, useExisting: ProficiencyLevelsService }
  ],
  templateUrl: './proficiency-levels.component.html',
  styleUrl: './proficiency-levels.component.scss'
})
export class ProficiencyLevelsComponent extends BaseCurationComponent<ProficiencyLevel> {
  // Make enums available to the template
  protected readonly CurationItemStatus = CurationItemStatus;
  protected readonly ProficiencyLevelColor = ProficiencyLevelColor;

  // Form model for creating/editing proficiency levels
  protected formModel: Partial<ProficiencyLevel> = {
    name: '',
    description: '',
    level: 1,
    color: ProficiencyLevelColor.BEGINNER
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
      color: ProficiencyLevelColor.BEGINNER
    };
  }

  /**
   * Open the modal to create a new proficiency level
   */
  override openCreateModal(): void {
    this.resetForm();
    super.openCreateModal();
  }

  /**
   * Open the modal to edit an existing proficiency level
   * @param level The proficiency level to edit
   */
  override openEditModal(level: ProficiencyLevel): void {
    this.formModel = { ...level };
    super.openEditModal(level);
  }

  /**
   * Save the current proficiency level (create or update)
   */
  protected onSave(): void {
    super.saveItem(this.formModel);
  }

  /**
   * Get the color style for a proficiency level
   * @param level The proficiency level
   * @returns The color style object
   */
  protected getColorStyle(level: ProficiencyLevel): Record<string, string> {
    return level.color ? { 'background-color': level.color } : {};
  }
}

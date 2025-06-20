import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseCurationComponent } from '../../core/components/base-curation.component';
import { BaseCurationService } from '../../core/services/base-curation.service';
import { SoftSkill, SoftSkillCategory } from './soft-skill.model';
import { CurationItemStatus } from '../../models/curation-item.model';
import { SoftSkillsService } from './soft-skills.service';

/**
 * Component for managing soft skills
 * Extends the BaseCurationComponent with the SoftSkill type
 */
@Component({
  selector: 'app-soft-skills',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    SoftSkillsService,
    { provide: BaseCurationService, useExisting: SoftSkillsService }
  ],
  templateUrl: './soft-skills.component.html',
  styleUrl: './soft-skills.component.scss'
})
export class SoftSkillsComponent extends BaseCurationComponent<SoftSkill> {
  // Make enums available to the template
  protected readonly CurationItemStatus = CurationItemStatus;
  protected readonly SoftSkillCategory = SoftSkillCategory;

  // Form model for creating/editing soft skills
  protected formModel: Partial<SoftSkill> = {
    name: '',
    description: '',
    category: SoftSkillCategory.OTHER,
    importance: 0
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
      category: SoftSkillCategory.OTHER,
      importance: 0
    };
  }

  /**
   * Open the modal to create a new soft skill
   */
  override openCreateModal(): void {
    this.resetForm();
    super.openCreateModal();
  }

  /**
   * Open the modal to edit an existing soft skill
   * @param softSkill The soft skill to edit
   */
  override openEditModal(softSkill: SoftSkill): void {
    this.formModel = { ...softSkill };
    super.openEditModal(softSkill);
  }

  /**
   * Save the current soft skill (create or update)
   */
  protected onSave(): void {
    super.saveItem(this.formModel);
  }

  /**
   * Get the category label for a soft skill
   * @param softSkill The soft skill
   * @returns The category label
   */
  protected getCategoryLabel(softSkill: SoftSkill): string {
    return softSkill.category || 'Uncategorized';
  }
}

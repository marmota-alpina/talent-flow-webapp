import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseCurationComponent } from '../../core/components/base-curation.component';
import { TechnologiesService } from './technologies.service';
import { Technology, TechnologyCategory } from './technology.model';
import { CurationItemStatus } from '../../models/curation-item.model';

/**
 * Component for managing technologies
 * Extends the BaseCurationComponent with the Technology type
 */
@Component({
  selector: 'app-technologies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './technologies.component.html',
  styleUrl: './technologies.component.scss'
})
export class TechnologiesComponent extends BaseCurationComponent<Technology> {
  // Make enums available to the template
  protected readonly CurationItemStatus = CurationItemStatus;
  protected readonly TechnologyCategory = TechnologyCategory;

  // Form model for creating/editing technologies
  protected formModel: Partial<Technology> = {
    name: '',
    description: '',
    category: TechnologyCategory.OTHER,
    icon: '',
    popularity: 0
  };

  /**
   * Constructor
   * @param technologiesService The service to use for CRUD operations
   */
  constructor(technologiesService: TechnologiesService) {
    super(technologiesService);
  }

  /**
   * Reset the form model
   */
  protected resetForm(): void {
    this.formModel = {
      name: '',
      description: '',
      category: TechnologyCategory.OTHER,
      icon: '',
      popularity: 0
    };
  }

  /**
   * Open the modal to create a new technology
   */
  override openCreateModal(): void {
    this.resetForm();
    super.openCreateModal();
  }

  /**
   * Open the modal to edit an existing technology
   * @param technology The technology to edit
   */
  override openEditModal(technology: Technology): void {
    this.formModel = { ...technology };
    super.openEditModal(technology);
  }

  /**
   * Save the current technology (create or update)
   */
  protected onSave(): void {
    super.saveItem(this.formModel);
  }

  /**
   * Get the category label for a technology
   * @param technology The technology
   * @returns The category label
   */
  protected getCategoryLabel(technology: Technology): string {
    return technology.category || 'Uncategorized';
  }
}

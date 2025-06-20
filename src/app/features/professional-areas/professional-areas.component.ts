import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseCurationComponent } from '../../core/components/base-curation.component';
import { BaseCurationService } from '../../core/services/base-curation.service';
import { ProfessionalArea, ProfessionalAreaCode } from './professional-area.model';
import { CurationItemStatus } from '../../models/curation-item.model';
import { ProfessionalAreasService } from './professional-areas.service';

/**
 * Component for managing professional areas
 * Extends the BaseCurationComponent with the ProfessionalArea type
 */
@Component({
  selector: 'app-professional-areas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    ProfessionalAreasService,
    { provide: BaseCurationService, useExisting: ProfessionalAreasService }
  ],
  templateUrl: './professional-areas.component.html',
  styleUrl: './professional-areas.component.scss'
})
export class ProfessionalAreasComponent extends BaseCurationComponent<ProfessionalArea> {
  // Make enums available to the template
  protected readonly CurationItemStatus = CurationItemStatus;
  protected readonly ProfessionalAreaCode = ProfessionalAreaCode;

  // Form model for creating/editing professional areas
  protected formModel: Partial<ProfessionalArea> = {
    name: '',
    description: '',
    code: '',
    parentArea: '',
    popularity: 0
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
      code: '',
      parentArea: '',
      popularity: 0
    };
  }

  /**
   * Open the modal to create a new professional area
   */
  override openCreateModal(): void {
    this.resetForm();
    super.openCreateModal();
  }

  /**
   * Open the modal to edit an existing professional area
   * @param area The professional area to edit
   */
  override openEditModal(area: ProfessionalArea): void {
    this.formModel = { ...area };
    super.openEditModal(area);
  }

  /**
   * Save the current professional area (create or update)
   */
  protected onSave(): void {
    super.saveItem(this.formModel);
  }

  /**
   * Get the code display for a professional area
   * @param area The professional area
   * @returns The code display
   */
  protected getCodeDisplay(area: ProfessionalArea): string {
    return area.code ? `[${area.code}]` : '';
  }
}

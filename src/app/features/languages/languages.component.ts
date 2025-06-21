import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseCurationComponent } from '../../core/components/base-curation.component';
import { BaseCurationService } from '../../core/services/base-curation.service';
import { Language, CommonLanguageCodes } from './language.model';
import { CurationItemStatus } from '../../models/curation-item.model';
import { LanguagesService } from './languages.service';

/**
 * Component for managing languages
 * Extends the BaseCurationComponent with the Language type
 */
@Component({
  selector: 'app-languages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    LanguagesService,
    { provide: BaseCurationService, useExisting: LanguagesService }
  ],
  templateUrl: './languages.component.html',
  styleUrl: './languages.component.scss'
})
export class LanguagesComponent extends BaseCurationComponent<Language> {
  // Make enums available to the template
  protected readonly CurationItemStatus = CurationItemStatus;
  protected readonly CommonLanguageCodes = CommonLanguageCodes;

  // Form model for creating/editing languages
  protected formModel: Partial<Language> = {
    name: '',
    description: '',
    code: '',
    nativeName: '',
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
      nativeName: '',
      popularity: 0
    };
  }

  /**
   * Open the modal to create a new language
   */
  override openCreateModal(): void {
    this.resetForm();
    super.openCreateModal();
  }

  /**
   * Open the modal to edit an existing language
   * @param language The language to edit
   */
  override openEditModal(language: Language): void {
    this.formModel = { ...language };
    super.openEditModal(language);
  }

  /**
   * Save the current language (create or update)
   */
  protected onSave(): void {
    super.saveItem(this.formModel);
  }

  /**
   * Get the language code display
   * @param language The language
   * @returns The language code display
   */
  protected getLanguageCodeDisplay(language: Language): string {
    return language.code ? `[${language.code}]` : '';
  }
}

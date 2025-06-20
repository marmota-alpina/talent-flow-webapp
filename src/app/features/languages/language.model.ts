import { CurationItem } from '../../models/curation-item.model';

/**
 * Language item model
 * Extends the base CurationItem with language-specific properties
 */
export interface Language extends CurationItem {
  code?: string;
  nativeName?: string;
  popularity?: number;
}

/**
 * Common language codes
 */
export enum CommonLanguageCodes {
  EN = 'en',
  ES = 'es',
  PT = 'pt',
  FR = 'fr',
  DE = 'de',
  IT = 'it',
  ZH = 'zh',
  JA = 'ja',
  RU = 'ru',
  AR = 'ar'
}

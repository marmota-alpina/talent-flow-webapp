import { CurationItem } from './curation-item.model';

export interface VacancyRequirement {
  item: string;
  level: string;
}

export interface Vacancy extends CurationItem {
  title: string;
  imageUrl: string;
  area: string;
  level: string;
  requirements: {
    technologies: VacancyRequirement[];
    languages: VacancyRequirement[];
    skills: string[];
  };
}


export interface CandidateApplication {
  id: string;
  name: string;
  position: string;
  photoUrl: string;
  matchPercentage: number;
  technologies: { name: string; match: boolean }[];
  status: ApplicationStatus;
  createdAt?: Date
  updatedAt?: Date
}

export enum ApplicationStatus {
  NEW = 'new',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

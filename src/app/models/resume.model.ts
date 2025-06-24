// Armazenado na coleção 'resumes/{userId}'
export type ExperienceType = 'CLT' | 'PJ' | 'Freelance';

export interface Resume {
  userId: string;
  status: 'published' | 'draft';
  fullName: string;
  email: string;
  phone: string;
  linkedinUrl?: string;
  mainArea: string; // Ex: 'Desenvolvimento de Software'
  experienceLevel: string; // Ex: 'Sênior'
  summary: string; // O resumo "Sobre mim"

  academicFormations: {
    level: string;
    courseName: string;
    institution: string;
    startDate: Date; // "YYYY-MM"
    endDate: Date | null;
  }[];

  languages: {
    language: string;
    proficiency: string;
  }[];

  professionalExperiences: {
    experienceType: ExperienceType;
    companyName: string;
    role: string;
    startDate: Date; // "YYYY-MM-DD"
    endDate: Date | null;
    isCurrent: boolean;
    activitiesPerformed: {
      activity: string;
      problemSolved: string;
      technologies: string[]; // Simplificado para um array de strings
      appliedSoftSkills: string[];
    }[];
  }[];

  createdAt: Date;
  updatedAt: Date;
}

// Armazenado na coleção 'resumeSnapshots/{snapshotId}'

// A interface ResumeSnapshot seria idêntica à interface Resume, mas com um campo a mais:
export interface ResumeSnapshot extends Resume {
  originalCandidateId: string;
  hash: string; // Um hash único gerado para cada snapshot. Isso facilita a comparação e detecção de duplicatas.
  aiClassification: {
    status: 'pending' | 'completed' | 'failed';
    classifiedLevel?: string;
    processedAt?: Date;
    tags?: string[];
    summary?: string; // Um resumo gerado pela IA
  };
}

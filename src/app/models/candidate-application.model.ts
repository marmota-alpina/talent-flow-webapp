export interface CandidateApplication {
  id: string; // ID da inscrição
  vacancyId: string;
  candidateId: string;
  status: ApplicationStatus;

  // Dados de perfil desnormalizados para exibição rápida no card
  profileData: {
    name: string;
    position: string; // Cargo atual
    photoUrl: string;
  };

  matchPercentage: number;

  // Referência para o currículo estruturado completo
  resumeSnapshotId: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export enum ApplicationStatus {
  NEW = 'new',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

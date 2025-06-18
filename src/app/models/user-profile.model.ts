import { Timestamp } from '@angular/fire/firestore';

/**
 * Model representing a user profile in the application.
 * Based on ADR-011 (User Management Strategy) and ADR-012 (Google Profile Photo).
 */
export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: 'candidate' | 'recruiter' | 'admin';
  /**
   * Use o tipo Timestamp do Firestore para consistência com o banco de dados.
   */
  createdAt: Timestamp;
  /**
   * Use o tipo Timestamp do Firestore para consistência com o banco de dados.
   */
  updatedAt: Timestamp;
}

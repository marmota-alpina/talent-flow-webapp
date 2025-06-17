/**
 * Model representing a user profile in the application.
 * Based on ADR-011 (User Management Strategy) and ADR-012 (Google Profile Photo).
 */
export interface UserProfile {
  /**
   * Unique identifier matching the Firebase Authentication UID
   */
  uid: string;

  /**
   * User's display name, typically from Google authentication
   */
  displayName: string;

  /**
   * User's email address
   */
  email: string;

  /**
   * URL to the user's profile photo, typically from Google authentication
   * Optional as per ADR-012
   */
  photoURL?: string;

  /**
   * User's role in the system, determining permissions
   * Default is 'candidate' as per ADR-011
   */
  role: 'candidate' | 'recruiter' | 'admin';

  /**
   * Timestamp when the user profile was created
   */
  createdAt: Date;

  /**
   * Timestamp when the user profile was last updated
   */
  updatedAt: Date;
}

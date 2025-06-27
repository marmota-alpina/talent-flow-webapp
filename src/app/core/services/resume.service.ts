import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  getDoc
} from '@angular/fire/firestore';
import { Observable, from, map, switchMap, of } from 'rxjs';
import { Resume } from '../../models/resume.model';
import { AuthService } from './auth.service';

/**
 * Service for managing resume data
 * Handles CRUD operations for the Resume model
 */
@Injectable({
  providedIn: 'root'
})
export class ResumeService {
  private firestore: Firestore = inject(Firestore);
  private authService = inject(AuthService);
  private readonly collectionName = 'resumes';

  /**
   * Get the current user's resume
   * @returns Observable of the user's resume or null if not found
   */
  getCurrentUserResume(): Observable<Resume | null> {
    // Use toObservable to convert the signal to an observable
    return of(this.authService.currentUser()).pipe(
      map(user => user?.uid),
      switchMap(uid => {
        if (!uid) return of(null);
        return this.getResumeById(uid as string);
      })
    );
  }

  /**
   * Get a resume by ID
   * @param id ID of the resume to get (same as user ID)
   * @returns Observable of the resume or null if not found
   */
  getResumeById(id: string): Observable<Resume | null> {
    const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
    return from(getDoc(docRef)).pipe(
      map(docSnap => {
        if (docSnap.exists()) {
          return { ...docSnap.data() } as Resume;
        }
        return null;
      })
    );
  }

  /**
   * Create or update a resume
   * @param resume Resume data to save
   * @returns Observable that completes when the operation is done
   */
  saveResume(resume: Partial<Resume>): Observable<void> {
    if (!resume.userId) {
      throw new Error('Resume must have a userId');
    }

    const docRef = doc(this.firestore, `${this.collectionName}/${resume.userId}`);

    return from(getDoc(docRef)).pipe(
      switchMap(docSnap => {
        const now = serverTimestamp();

        if (docSnap.exists()) {
          // Update existing resume
          const updatedResume = {
            ...resume,
            updatedAt: now
          };
          return from(updateDoc(docRef, updatedResume));
        } else {
          // Create new resume
          const newResume = {
            ...resume,
            createdAt: now,
            updatedAt: now
          };
          return from(setDoc(docRef, newResume));
        }
      })
    );
  }

  /**
   * Update the status of a resume
   * @param userId ID of the user whose resume to update
   * @param status New status ('published' or 'draft')
   * @returns Observable that completes when the operation is done
   */
  updateResumeStatus(userId: string, status: 'published' | 'draft'): Observable<void> {
    const docRef = doc(this.firestore, `${this.collectionName}/${userId}`);
    return from(updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp()
    }));
  }
}

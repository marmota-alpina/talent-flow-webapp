import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  updateDoc,
  query,
  where,
  getCountFromServer
} from '@angular/fire/firestore';
import {from, map, Observable} from 'rxjs';
import { ApplicationStatus, CandidateApplication } from '../../models/vacancy.model';

@Injectable({
  providedIn: 'root'
})
export class CandidateApplicationService {

  private firestore = inject(Firestore);

  getApplicationsByStatus(vacancyId: string, status: ApplicationStatus): Observable<CandidateApplication[]> {
    const applicationsRef = collection(this.firestore, `vacancies/${vacancyId}/candidates`);
    const applicationsQuery = query(applicationsRef, where('status', '==', status));
    return collectionData(applicationsQuery, { idField: 'id' }) as Observable<CandidateApplication[]>;
  }

  getApplicationsCount(vacancyId: string, status?: ApplicationStatus): Observable<number> {
    const applicationsRef = collection(this.firestore, `vacancies/${vacancyId}/candidates`);
    const countQuery = status
      ? query(applicationsRef, where('status', '==', status))
      : query(applicationsRef);

    return from(getCountFromServer(countQuery)).pipe(
      map(snapshot => snapshot.data().count)
    );
  }

  updateApplicationStatus(vacancyId: string, applicationId: string, status: ApplicationStatus): Promise<void> {
    const applicationDocRef = doc(this.firestore, `vacancies/${vacancyId}/candidates/${applicationId}`);
    return updateDoc(applicationDocRef, { status });
  }
}

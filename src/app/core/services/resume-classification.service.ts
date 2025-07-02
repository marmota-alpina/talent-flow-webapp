import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Resume } from '../../models/resume.model';

export interface ResumeClassificationResponse {
  userId: string;
  predictedExperienceLevel: 'Júnior' | 'Pleno' | 'Sênior' | 'Especialista';
  confidenceScore: number;
  hash: string;
}

@Injectable({
  providedIn: 'root'
})
export class ResumeClassificationService {
  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/classify-resume/';

  /**
   * Classifies a resume by sending it to the classification API
   * @param resume The resume to classify
   * @returns An observable with the classification response
   */
  classifyResume(resume: Resume): Observable<ResumeClassificationResponse> {
    // Create a deep copy of the resume to avoid modifying the original
    const processedResume = this.processResumeForApi(resume);
    return this.http.post<ResumeClassificationResponse>(this.apiUrl, processedResume);
  }

  /**
   * Processes the resume object to ensure all date fields are in the correct format for the API
   * @param resume The original resume object
   * @returns A processed copy of the resume with correctly formatted dates
   */
  private processResumeForApi(resume: Resume): any {
    // Create a deep copy of the resume
    const processedResume = JSON.parse(JSON.stringify(resume));

    // Process academic formations
    if (processedResume.academicFormations && processedResume.academicFormations.length > 0) {
      processedResume.academicFormations = processedResume.academicFormations.map((formation: any) => {
        // Convert startDate to string format
        if (formation.startDate) {
          formation.startDate = this.formatDateToString(formation.startDate);
        }

        // Convert endDate to string format if it exists
        if (formation.endDate) {
          formation.endDate = this.formatDateToString(formation.endDate);
        }

        return formation;
      });
    }

    // Process professional experiences
    if (processedResume.professionalExperiences && processedResume.professionalExperiences.length > 0) {
      processedResume.professionalExperiences = processedResume.professionalExperiences.map((experience: any) => {
        // Convert startDate to ISO string format
        if (experience.startDate) {
          experience.startDate = this.formatDateToISOString(experience.startDate);
        }

        // Convert endDate to ISO string format if it exists
        if (experience.endDate) {
          experience.endDate = this.formatDateToISOString(experience.endDate);
        }

        return experience;
      });
    }

    return processedResume;
  }

  /**
   * Converts a date object to a string format (YYYY-MM-DD)
   * @param date The date to format
   * @returns A formatted date string
   */
  private formatDateToString(date: any): string {
    if (!date) return '';

    try {
      let jsDate: Date;

      if (date instanceof Date) {
        jsDate = date;
      } else if (typeof date === 'object' && 'toDate' in date && typeof date.toDate === 'function') {
        // Handle Firestore Timestamp
        jsDate = date.toDate();
      } else if (typeof date === 'object' && 'seconds' in date && 'nanoseconds' in date) {
        // Handle Firestore Timestamp in a different format
        jsDate = new Date(date.seconds * 1000 + date.nanoseconds / 1000000);
      } else {
        // Handle string format
        jsDate = new Date(date as string);
      }

      // Format as YYYY-MM-DD
      const year = jsDate.getFullYear();
      const month = String(jsDate.getMonth() + 1).padStart(2, '0');
      const day = String(jsDate.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('Error formatting date to string:', error);
      return '';
    }
  }

  /**
   * Converts a date object to an ISO string format
   * @param date The date to format
   * @returns A formatted date ISO string
   */
  private formatDateToISOString(date: any): string {
    if (!date) return '';

    try {
      let jsDate: Date;

      if (date instanceof Date) {
        jsDate = date;
      } else if (typeof date === 'object' && 'toDate' in date && typeof date.toDate === 'function') {
        // Handle Firestore Timestamp
        jsDate = date.toDate();
      } else if (typeof date === 'object' && 'seconds' in date && 'nanoseconds' in date) {
        // Handle Firestore Timestamp in a different format
        jsDate = new Date(date.seconds * 1000 + date.nanoseconds / 1000000);
      } else {
        // Handle string format
        jsDate = new Date(date as string);
      }

      return jsDate.toISOString();
    } catch (error) {
      console.error('Error formatting date to ISO string:', error);
      return '';
    }
  }
}

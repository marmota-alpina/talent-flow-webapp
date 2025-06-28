import { Component, OnInit, OnDestroy, inject, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription, finalize } from 'rxjs';

import { ResumeService } from '../../../core/services/resume.service';
import { AuthService } from '../../../core/services/auth.service';
import { Resume } from '../../../models/resume.model';

/**
 * Component for viewing a resume
 */
@Component({
  selector: 'app-resume-view',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './resume-view.component.html',
  styles: [`
    .timeline::before {
      content: '';
      position: absolute;
      left: 11px;
      top: 1rem;
      bottom: 0;
      width: 2px;
      background-color: #e5e7eb;
    }
    .timeline-item .timeline-icon {
      position: absolute;
      left: 0;
      top: 0.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 9999px;
      background-color: #2563EB;
      color: white;
      border: 4px solid #F3F4F6;
    }
  `]
})
export class ResumeViewComponent implements OnInit, OnDestroy {
  private resumeService = inject(ResumeService);
  private authService = inject(AuthService);
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);
  private subscription = new Subscription();

  resume: Resume | null = null;
  loading = true;
  error = false;

  ngOnInit(): void {
    this.loadResume();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadResume(): void {
    this.loading = true;
    this.error = false;

    // Add a safety timeout to ensure loading state is updated even if there's a delay
    const safetyTimeout = setTimeout(() => {
      if (this.loading) {
        this.ngZone.run(() => {
          this.loading = false;
          this.cdr.detectChanges();
          console.log('Safety timeout triggered: forcing loading state to false');
        });
      }
    }, 5000); // 5 seconds timeout

    const sub = this.resumeService.getCurrentUserResume()
      .pipe(
        finalize(() => {
          // Clear the safety timeout when the observable completes or errors
          clearTimeout(safetyTimeout);
        })
      )
      .subscribe({
        next: (resume) => {
          this.ngZone.run(() => {
            this.resume = resume;
            this.loading = false;
            // Force change detection
            this.cdr.detectChanges();
            console.log('Resume loaded successfully');
          });
        },
        error: (err) => {
          this.ngZone.run(() => {
            console.error('Error loading resume:', err);
            this.error = true;
            this.loading = false;
            // Force change detection
            this.cdr.detectChanges();
          });
        }
      });

    this.subscription.add(sub);
  }

  /**
   * Format a date to display in a readable format
   * @param date The date to format
   * @param showEndDate Whether to show "o momento" for null end dates
   * @returns Formatted date string
   */
  formatDate(date: Date | { toDate: () => Date } | { seconds: number, nanoseconds: number } | string | null | undefined, showEndDate = false): string {
    if (!date) {
      return showEndDate ? 'o momento' : '';
    }

    try {
      // Convert to JavaScript Date if it's a Firestore Timestamp
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

      // Format as MMM/YYYY (e.g., jan/2020)
      const month = jsDate.toLocaleString('pt-BR', { month: 'short' }).replace('.', '');
      const year = jsDate.getFullYear();

      return `${month}/${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  }
}

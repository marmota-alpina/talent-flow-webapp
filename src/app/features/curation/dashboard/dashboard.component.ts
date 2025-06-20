import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * Dashboard component for the curation area
 * Displays summary statistics for the different curation entities
 */
@Component({
  selector: 'app-curation-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  // Statistics for the dashboard
  statistics = [
    { name: 'Technologies', count: 0, icon: 'fa-cogs', color: 'blue', path: '/curation/technologies' },
    { name: 'Soft Skills', count: 0, icon: 'fa-heart', color: 'teal', path: '/curation/soft-skills' },
    { name: 'Languages', count: 0, icon: 'fa-language', color: 'indigo', path: '/curation/languages' },
    { name: 'Proficiency Levels', count: 0, icon: 'fa-layer-group', color: 'amber', path: '/curation/proficiency-levels' },
    { name: 'Experience Levels', count: 0, icon: 'fa-briefcase', color: 'green', path: '/curation/experience-levels' },
    { name: 'Professional Areas', count: 0, icon: 'fa-sitemap', color: 'purple', path: '/curation/professional-areas' }
  ];

  ngOnInit(): void {
    // In a real implementation, we would fetch the actual counts from the services
    // For now, we'll just use random numbers for demonstration
    this.statistics = this.statistics.map(stat => ({
      ...stat,
      count: Math.floor(Math.random() * 20) + 1 // Random number between 1 and 20
    }));
  }
}

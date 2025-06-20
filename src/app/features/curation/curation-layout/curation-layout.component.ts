import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * Main layout component for the curation area
 * This component provides the sidebar navigation and layout structure
 */
@Component({
  selector: 'app-curation-layout',
  imports: [CommonModule, RouterModule],
  templateUrl: './curation-layout.component.html',
  styleUrl: './curation-layout.component.scss'
})
export class CurationLayoutComponent {
  // Navigation items for the sidebar
  navItems = [
    { path: '/curation/dashboard', relativePath: 'dashboard', label: 'Dashboard', icon: 'fa-tachometer-alt' },
    { path: '/curation/technologies', relativePath: 'technologies', label: 'Technologies', icon: 'fa-cogs' },
    { path: '/curation/soft-skills', relativePath: 'soft-skills', label: 'Soft Skills', icon: 'fa-heart' },
    { path: '/curation/languages', relativePath: 'languages', label: 'Languages', icon: 'fa-language' },
    { path: '/curation/proficiency-levels', relativePath: 'proficiency-levels', label: 'Proficiency Levels', icon: 'fa-layer-group' },
    { path: '/curation/experience-levels', relativePath: 'experience-levels', label: 'Experience Levels', icon: 'fa-briefcase' },
    { path: '/curation/professional-areas', relativePath: 'professional-areas', label: 'Professional Areas', icon: 'fa-sitemap' }
  ];
}

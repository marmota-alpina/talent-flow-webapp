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
    { path: '/curation/dashboard', relativePath: 'dashboard', label: 'Painel', icon: 'fa-tachometer-alt' },
    { path: '/curation/technologies', relativePath: 'technologies', label: 'Tecnologias', icon: 'fa-cogs' },
    { path: '/curation/soft-skills', relativePath: 'soft-skills', label: 'Habilidades Comportamentais', icon: 'fa-heart' },
    { path: '/curation/languages', relativePath: 'languages', label: 'Idiomas', icon: 'fa-language' },
    { path: '/curation/proficiency-levels', relativePath: 'proficiency-levels', label: 'Níveis de Proficiência', icon: 'fa-layer-group' },
    { path: '/curation/experience-levels', relativePath: 'experience-levels', label: 'Níveis de Experiência', icon: 'fa-briefcase' },
    { path: '/curation/professional-areas', relativePath: 'professional-areas', label: 'Áreas Profissionais', icon: 'fa-sitemap' }
  ];
}

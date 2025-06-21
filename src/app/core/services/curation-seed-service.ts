import { inject, Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TechnologiesService } from '../../features/technologies/technologies.service';
import { SoftSkillsService } from '../../features/soft-skills/soft-skills.service';
import { LanguagesService } from '../../features/languages/languages.service';
import { ProficiencyLevelsService } from '../../features/proficiency-levels/proficiency-levels.service';
import { ExperienceLevelsService } from '../../features/experience-levels/experience-levels.service';
import { ProfessionalAreasService } from '../../features/professional-areas/professional-areas.service';
import { Technology, TechnologyCategory } from '../../features/technologies/technology.model';
import { SoftSkill, SoftSkillCategory } from '../../features/soft-skills/soft-skill.model';
import { CommonLanguageCodes, Language } from '../../features/languages/language.model';
import { ProficiencyLevel, ProficiencyLevelColor } from '../../features/proficiency-levels/proficiency-level.model';
import { ExperienceLevel, ExperienceLevelColor } from '../../features/experience-levels/experience-level.model';
import { ProfessionalArea, ProfessionalAreaCode } from '../../features/professional-areas/professional-area.model';

@Injectable({
  providedIn: 'root'
})
export class CurationSeedService {
  private technologiesService = inject(TechnologiesService);
  private softSkillsService = inject(SoftSkillsService);
  private languagesService = inject(LanguagesService);
  private proficiencyLevelsService = inject(ProficiencyLevelsService);
  private experienceLevelsService = inject(ExperienceLevelsService);
  private professionalAreasService = inject(ProfessionalAreasService);

  private seedData = {
    technologies: [
      { name: 'Angular', category: TechnologyCategory.FRONTEND, popularity: 95 },
      { name: 'React', category: TechnologyCategory.FRONTEND, popularity: 98 },
      { name: 'Vue.js', category: TechnologyCategory.FRONTEND, popularity: 85 },
      { name: 'Node.js', category: TechnologyCategory.BACKEND, popularity: 92 },
      { name: 'Python', category: TechnologyCategory.BACKEND, popularity: 97 },
      { name: 'Java', category: TechnologyCategory.BACKEND, popularity: 90 },
      { name: 'PostgreSQL', category: TechnologyCategory.DATABASE, popularity: 88 },
      { name: 'MongoDB', category: TechnologyCategory.DATABASE, popularity: 85 },
      { name: 'Docker', category: TechnologyCategory.DEVOPS, popularity: 96 },
      { name: 'Kubernetes', category: TechnologyCategory.DEVOPS, popularity: 91 },
      { name: 'AWS', category: TechnologyCategory.CLOUD, popularity: 99 },
      { name: 'Figma', category: TechnologyCategory.DESIGN, popularity: 94 },
    ],
    softSkills: [
      { name: 'Comunicação', category: SoftSkillCategory.COMMUNICATION, importance: 98 },
      { name: 'Trabalho em Equipe', category: SoftSkillCategory.TEAMWORK, importance: 95 },
      { name: 'Resolução de Problemas', category: SoftSkillCategory.PROBLEM_SOLVING, importance: 97 },
      { name: 'Liderança', category: SoftSkillCategory.LEADERSHIP, importance: 90 },
      { name: 'Adaptabilidade', category: SoftSkillCategory.ADAPTABILITY, importance: 92 },
      { name: 'Pensamento Crítico', category: SoftSkillCategory.PROBLEM_SOLVING, importance: 94 },
      { name: 'Gestão de Tempo', category: SoftSkillCategory.TIME_MANAGEMENT, importance: 93 },
      { name: 'Inteligência Emocional', category: SoftSkillCategory.COMMUNICATION, importance: 88 },
      { name: 'Criatividade', category: SoftSkillCategory.OTHER, importance: 85 },
      { name: 'Proatividade', category: SoftSkillCategory.OTHER, importance: 91 },
    ],
    languages: [
      { name: 'Português', code: CommonLanguageCodes.PT, nativeName: 'Português', popularity: 90 },
      { name: 'Inglês', code: CommonLanguageCodes.EN, nativeName: 'English', popularity: 100 },
      { name: 'Espanhol', code: CommonLanguageCodes.ES, nativeName: 'Español', popularity: 85 },
      { name: 'Francês', code: CommonLanguageCodes.FR, nativeName: 'Français', popularity: 70 },
      { name: 'Alemão', code: CommonLanguageCodes.DE, nativeName: 'Deutsch', popularity: 65 },
      { name: 'Italiano', code: CommonLanguageCodes.IT, nativeName: 'Italiano', popularity: 60 },
      { name: 'Chinês (Mandarim)', code: CommonLanguageCodes.ZH, nativeName: '中文', popularity: 50 },
      { name: 'Japonês', code: CommonLanguageCodes.JA, nativeName: '日本語', popularity: 45 },
      { name: 'Russo', code: CommonLanguageCodes.RU, nativeName: 'Русский', popularity: 40 },
      { name: 'Árabe', code: CommonLanguageCodes.AR, nativeName: 'العربية', popularity: 35 },
    ],
    proficiencyLevels: [
      { name: 'Básico (A1)', level: 1, color: ProficiencyLevelColor.BEGINNER },
      { name: 'Elementar (A2)', level: 2, color: ProficiencyLevelColor.BEGINNER },
      { name: 'Intermediário (B1)', level: 3, color: ProficiencyLevelColor.INTERMEDIATE },
      { name: 'Intermediário Avançado (B2)', level: 4, color: ProficiencyLevelColor.INTERMEDIATE },
      { name: 'Avançado (C1)', level: 5, color: ProficiencyLevelColor.ADVANCED },
      { name: 'Proficiente (C2)', description: 'Fluente', level: 6, color: ProficiencyLevelColor.ADVANCED },
      { name: 'Nativo', level: 7, description: 'Nativo ou Bilíngue', color: ProficiencyLevelColor.EXPERT },
    ],
    experienceLevels: [
      { name: 'Estágio', level: 1, yearsRange: '0-1 anos', color: ExperienceLevelColor.ENTRY },
      { name: 'Júnior', level: 2, yearsRange: '1-3 anos', color: ExperienceLevelColor.JUNIOR },
      { name: 'Pleno', level: 3, yearsRange: '3-5 anos', color: ExperienceLevelColor.INTERMEDIATE },
      { name: 'Sênior', level: 4, yearsRange: '5-8 anos', color: ExperienceLevelColor.SENIOR },
      { name: 'Especialista / Principal', level: 5, yearsRange: '8+ anos', color: ExperienceLevelColor.EXPERT },
    ],
    professionalAreas: [
      { name: 'Desenvolvimento de Software - Backend', code: ProfessionalAreaCode.IT, parentArea: 'TI', popularity: 98 },
      { name: 'Desenvolvimento de Software - Frontend', code: ProfessionalAreaCode.IT, parentArea: 'TI', popularity: 98 },
      { name: 'Desenvolvimento de Software - Fullstack', code: ProfessionalAreaCode.IT, parentArea: 'TI', popularity: 95 },
      { name: 'DevOps / SRE', code: ProfessionalAreaCode.IT, parentArea: 'TI', popularity: 90 },
      { name: 'Ciência de Dados / Machine Learning', code: ProfessionalAreaCode.IT, parentArea: 'TI', popularity: 92 },
      { name: 'Design de Produto (UX/UI)', code: ProfessionalAreaCode.OTHER, parentArea: 'Design', popularity: 88 },
      { name: 'Gestão de Produtos', code: ProfessionalAreaCode.OTHER, parentArea: 'Gestão', popularity: 85 },
      { name: 'Recursos Humanos / Recrutamento', code: ProfessionalAreaCode.HR, parentArea: 'Administrativo', popularity: 70 },
      { name: 'Marketing Digital', code: ProfessionalAreaCode.MARKETING, parentArea: 'Marketing', popularity: 75 },
      { name: 'Engenharia de Qualidade (QA)', code: ProfessionalAreaCode.IT, parentArea: 'TI', popularity: 80 },
    ]
  };

  /**
   * Populates all curation collections with seed data.
   */
  seedAll(): Observable<unknown[]> {
    console.log('Iniciando o processo de seed...');

    const seedObservables = [
      ...this.seedData.technologies.map(item => this.technologiesService.create(item as Omit<Technology, 'id' | 'status' | 'createdAt' | 'updatedAt'>)),
      ...this.seedData.softSkills.map(item => this.softSkillsService.create(item as Omit<SoftSkill, 'id' | 'status' | 'createdAt' | 'updatedAt'>)),
      ...this.seedData.languages.map(item => this.languagesService.create(item as Omit<Language, 'id' | 'status' | 'createdAt' | 'updatedAt'>)),
      ...this.seedData.proficiencyLevels.map(item => this.proficiencyLevelsService.create(item as Omit<ProficiencyLevel, 'id' | 'status' | 'createdAt' | 'updatedAt'>)),
      ...this.seedData.experienceLevels.map(item => this.experienceLevelsService.create(item as Omit<ExperienceLevel, 'id' | 'status' | 'createdAt' | 'updatedAt'>)),
      ...this.seedData.professionalAreas.map(item => this.professionalAreasService.create(item as Omit<ProfessionalArea, 'id' | 'status' | 'createdAt' | 'updatedAt'>)),
    ];

    return forkJoin(seedObservables.map(obs => obs.pipe(catchError(err => of(err)))))
      .pipe(
        tap(results => {
          const successes = results.filter(r => r === undefined).length;
          const errors = results.filter(r => r !== undefined).length;
          console.log(`Processo de seed concluído. ${successes} itens criados, ${errors} erros.`);
          if (errors > 0) {
            console.error('Erros encontrados:', results.filter(r => r !== undefined));
          }
        })
      );
  }

  clearAll(): Observable<unknown[]> {
    console.log('Iniciando o processo de limpeza...');

    const clearObservables = [
      this.technologiesService.clearAll(),
      this.softSkillsService.clearAll(),
      this.languagesService.clearAll(),
      this.proficiencyLevelsService.clearAll(),
      this.experienceLevelsService.clearAll(),
      this.professionalAreasService.clearAll(),
    ];

    return forkJoin(clearObservables.map(obs => obs.pipe(catchError(err => of(err)))))
      .pipe(
        tap(results => {
          const successes = results.filter(r => !(r instanceof Error)).length;
          const errors = results.filter(r => r instanceof Error).length;
          console.log(`Processo de limpeza concluído. ${successes} coleções limpas, ${errors} erros.`);
          if (errors > 0) {
            console.error('Erros encontrados:', results.filter(r => r instanceof Error));
          }
        })
      );
  }
}

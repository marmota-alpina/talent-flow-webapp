import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { of, throwError } from 'rxjs';

import { TechnologiesService } from '../../features/technologies/technologies.service';
import { SoftSkillsService } from '../../features/soft-skills/soft-skills.service';
import { LanguagesService } from '../../features/languages/languages.service';
import { ProficiencyLevelsService } from '../../features/proficiency-levels/proficiency-levels.service';
import { ExperienceLevelsService } from '../../features/experience-levels/experience-levels.service';
import { ProfessionalAreasService } from '../../features/professional-areas/professional-areas.service';
import { CurationSeedService } from './curation-seed-service';
import {CurationItem} from '../../models/curation-item.model';

describe('CurationSeedService', () => {
  let service: CurationSeedService;

  // Mocks para todos os serviços injetados
  const mockTechnologiesService = jasmine.createSpyObj('TechnologiesService', ['create', 'clearAll']);
  const mockSoftSkillsService = jasmine.createSpyObj('SoftSkillsService', ['create', 'clearAll']);
  const mockLanguagesService = jasmine.createSpyObj('LanguagesService', ['create', 'clearAll']);
  const mockProficiencyLevelsService = jasmine.createSpyObj('ProficiencyLevelsService', ['create', 'clearAll']);
  const mockExperienceLevelsService = jasmine.createSpyObj('ExperienceLevelsService', ['create', 'clearAll']);
  const mockProfessionalAreasService = jasmine.createSpyObj('ProfessionalAreasService', ['create', 'clearAll']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        CurationSeedService,
        { provide: TechnologiesService, useValue: mockTechnologiesService },
        { provide: SoftSkillsService, useValue: mockSoftSkillsService },
        { provide: LanguagesService, useValue: mockLanguagesService },
        { provide: ProficiencyLevelsService, useValue: mockProficiencyLevelsService },
        { provide: ExperienceLevelsService, useValue: mockExperienceLevelsService },
        { provide: ProfessionalAreasService, useValue: mockProfessionalAreasService },
      ],
    });

    service = TestBed.inject(CurationSeedService);

    // ✅ Resetar contadores de chamadas entre os testes
    mockTechnologiesService.create.calls.reset();
    mockSoftSkillsService.create.calls.reset();
    mockLanguagesService.create.calls.reset();
    mockProficiencyLevelsService.create.calls.reset();
    mockExperienceLevelsService.create.calls.reset();
    mockProfessionalAreasService.create.calls.reset();
    mockTechnologiesService.clearAll.calls.reset();
    mockSoftSkillsService.clearAll.calls.reset();
    mockLanguagesService.clearAll.calls.reset();
    mockProficiencyLevelsService.clearAll.calls.reset();
    mockExperienceLevelsService.clearAll.calls.reset();
    mockProfessionalAreasService.clearAll.calls.reset();

    // ✅ Redefinir retornos padrão
    mockTechnologiesService.create.and.returnValue(of(undefined));
    mockSoftSkillsService.create.and.returnValue(of(undefined));
    mockLanguagesService.create.and.returnValue(of(undefined));
    mockProficiencyLevelsService.create.and.returnValue(of(undefined));
    mockExperienceLevelsService.create.and.returnValue(of(undefined));
    mockProfessionalAreasService.create.and.returnValue(of(undefined));
    mockTechnologiesService.clearAll.and.returnValue(of(undefined));
    mockSoftSkillsService.clearAll.and.returnValue(of(undefined));
    mockLanguagesService.clearAll.and.returnValue(of(undefined));
    mockProficiencyLevelsService.clearAll.and.returnValue(of(undefined));
    mockExperienceLevelsService.clearAll.and.returnValue(of(undefined));
    mockProfessionalAreasService.clearAll.and.returnValue(of(undefined));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('seedAll', () => {
    it('should call create on all services with seed data', (done) => {
      service.seedAll().subscribe(() => {
        expect(mockTechnologiesService.create).toHaveBeenCalled();
        expect(mockSoftSkillsService.create).toHaveBeenCalled();
        expect(mockLanguagesService.create).toHaveBeenCalled();
        expect(mockProficiencyLevelsService.create).toHaveBeenCalled();
        expect(mockExperienceLevelsService.create).toHaveBeenCalled();
        expect(mockProfessionalAreasService.create).toHaveBeenCalled();

        // ✅ Quantidade exata conforme seed
        expect(mockTechnologiesService.create.calls.count()).toBe(12);
        expect(mockSoftSkillsService.create.calls.count()).toBe(10);
        expect(mockLanguagesService.create.calls.count()).toBe(10);
        expect(mockProficiencyLevelsService.create.calls.count()).toBe(7);
        expect(mockExperienceLevelsService.create.calls.count()).toBe(5);
        expect(mockProfessionalAreasService.create.calls.count()).toBe(10);

        done();
      });
    });

    it('should handle errors and continue with other items', (done) => {
      mockTechnologiesService.create.and.callFake((item: CurationItem) => {
        if (item.name === 'Angular') {
          return throwError(() => new Error('Test error'));
        }
        return of(undefined);
      });

      service.seedAll().subscribe((results) => {
        const errors = results.filter(r => r instanceof Error);
        expect(errors.length).toBe(1); // Apenas o Angular falhou

        expect(mockSoftSkillsService.create).toHaveBeenCalled();
        expect(mockLanguagesService.create).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('clearAll', () => {
    it('should call clearAll on all services', (done) => {
      service.clearAll().subscribe(() => {
        expect(mockTechnologiesService.clearAll).toHaveBeenCalled();
        expect(mockSoftSkillsService.clearAll).toHaveBeenCalled();
        expect(mockLanguagesService.clearAll).toHaveBeenCalled();
        expect(mockProficiencyLevelsService.clearAll).toHaveBeenCalled();
        expect(mockExperienceLevelsService.clearAll).toHaveBeenCalled();
        expect(mockProfessionalAreasService.clearAll).toHaveBeenCalled();
        done();
      });
    });

    it('should handle errors from clearAll', (done) => {
      mockTechnologiesService.clearAll.and.returnValue(throwError(() => new Error('Test error')));

      service.clearAll().subscribe((results) => {
        const errors = results.filter(r => r instanceof Error);
        expect(errors.length).toBe(1);
        expect(errors[0].message).toBe('Test error');

        expect(mockSoftSkillsService.clearAll).toHaveBeenCalled();
        expect(mockLanguagesService.clearAll).toHaveBeenCalled();

        done();
      });
    });
  });
});

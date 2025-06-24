import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { combineLatest, map, switchMap, tap } from 'rxjs';
import { VacancyService } from '../../../core/services/vacancy.service';
import { CandidateApplicationService} from '../../../core/services/candidate-application-service';
import { ApplicationStatus } from '../../../models/vacancy.model';

@Component({
  selector: 'app-candidate-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './candidate-list.component.html',
})
export class CandidateListComponent {
  private route = inject(ActivatedRoute);
  private vacancyService = inject(VacancyService);
  private applicationService = inject(CandidateApplicationService);

  // Enum para acesso fácil no template
  public AppStatus = ApplicationStatus;

  // Sinal para controlar o estado da UI: a aba ativa
  activeTab = signal<ApplicationStatus>(ApplicationStatus.NEW);

  // Sinal para controlar o estado de carregamento APENAS da lista de candidatos
  loadingCandidates = signal<boolean>(true);

  // --- Lógica Reativa ---

  // 1. Stream que obtém o ID da vaga da URL
  private vacancyId$ = this.route.paramMap.pipe(map(params => params.get('id')!));

  // 2. Converte o stream do ID da vaga em um signal para os detalhes da vaga.
  //    O valor inicial é 'null', o que nos permite mostrar um skeleton para o título.
  vacancy = toSignal(
    this.vacancyId$.pipe(switchMap(id => this.vacancyService.getById(id))),
    { initialValue: null }
  );

  // 3. Sinais para os contadores dos KPIs. O valor inicial é 0.
  //    Eles se atualizarão assim que a contagem do Firestore chegar.
  totalCandidates = toSignal(
    this.vacancyId$.pipe(switchMap(id => this.applicationService.getApplicationsCount(id))),
    { initialValue: 0 }
  );
  newCandidates = toSignal(
    this.vacancyId$.pipe(switchMap(id => this.applicationService.getApplicationsCount(id, ApplicationStatus.NEW))),
    { initialValue: 0 }
  );
  approvedCandidates = toSignal(
    this.vacancyId$.pipe(switchMap(id => this.applicationService.getApplicationsCount(id, ApplicationStatus.APPROVED))),
    { initialValue: 0 }
  );
  rejectedCandidates = toSignal(
    this.vacancyId$.pipe(switchMap(id => this.applicationService.getApplicationsCount(id, ApplicationStatus.REJECTED))),
    { initialValue: 0 }
  );

  // 4. Stream principal que busca a lista de candidatos
  private applications$ = combineLatest([
    this.vacancyId$,
    toObservable(this.activeTab) // Reage a mudanças na aba
  ]).pipe(
    tap(() => this.loadingCandidates.set(true)), // Mostra o skeleton antes de cada busca
    switchMap(([vacancyId, status]) =>
      this.applicationService.getApplicationsByStatus(vacancyId, status)
    ),
    tap(() => this.loadingCandidates.set(false)) // Esconde o skeleton após a busca
  );

  // Signal final com a lista de candidatos para exibir no template
  displayedApplications = toSignal(this.applications$, { initialValue: [] });


  // --- Ações do Usuário ---

  setActiveTab(status: ApplicationStatus): void {
    this.activeTab.set(status);
  }

  updateCandidateStatus(candidateId: string, newStatus: ApplicationStatus): Promise<void> {
    const vacancyId = this.vacancy()?.id;
    if (!vacancyId) {
      console.error("ID da vaga não encontrado para atualizar status.");
      return Promise.reject("ID da vaga não encontrado");
    }

    return this.applicationService.updateApplicationStatus(vacancyId, candidateId, newStatus);
  }
}

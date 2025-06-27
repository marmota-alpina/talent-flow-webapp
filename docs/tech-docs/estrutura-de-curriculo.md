# **Documentação Técnica: Modelo de Dados de Currículo (Resume e ResumeSnapshot)**

#### **1. Visão Geral e Arquitetura**

Para atender às necessidades do sistema de recrutamento, o perfil do candidato é dividido em duas estruturas de dados principais, armazenadas em coleções distintas no Firestore. Essa separação é uma decisão de arquitetura crucial para garantir performance, integridade de dados e escalabilidade.

* **`Resume`**: É o **currículo mestre e "vivo"** do candidato. Este documento reside na coleção `resumes` e é a fonte que o usuário edita para manter seu perfil atualizado.
* **`ResumeSnapshot`**: É uma **"foto" imutável e pontual** do currículo do candidato, tirada no exato momento em que ele se aplica a uma vaga. Este documento reside na coleção `resumeSnapshots` e garante que o recrutador sempre avalie a versão exata do currículo que foi submetida, mesmo que o candidato altere seu perfil mestre posteriormente.

A relação entre eles é gerenciada pelo `hash` e pela `CandidateApplication`.

#### **2. Estrutura `Resume`**

Este é o modelo principal do perfil do candidato, projetado para ser editado pelo usuário.

* **Coleção Firestore:** `resumes`
* **ID do Documento:** `{userId}` (o mesmo ID do usuário no Firebase Authentication).

##### **Definição do Modelo (`src/app/models/resume.model.ts`)**

```typescript
// Define os tipos de experiência permitidos para garantir consistência
export type ExperienceType = 'CLT' | 'PJ' | 'Freelance' | 'Estágio';

// O modelo principal do currículo editável pelo usuário
export interface Resume {
  userId: string; // Chave estrangeira para o usuário
  status: 'published' | 'draft'; // Status do preenchimento do currículo
  fullName: string;
  email: string;
  phone: string;
  linkedinUrl?: string;
  mainArea: string; // Ex: 'Desenvolvimento de Software', 'Design de Produto (UX/UI)'
  experienceLevel: string; // Ex: 'Sênior', 'Pleno', 'Júnior'
  summary: string; // Um parágrafo "Sobre mim"

  academicFormations: {
    level: string; // Ex: 'Graduação', 'Pós-graduação'
    courseName: string;
    institution: string;
    startDate: Date;
    endDate: Date | null; // Nulo se estiver cursando
  }[];

  languages: {
    language: string;
    proficiency: string;
  }[];

  professionalExperiences: {
    experienceType: ExperienceType;
    companyName: string;
    role: string;
    startDate: Date;
    endDate: Date | null;
    isCurrent: boolean;
    activitiesPerformed: {
      activity: string; // Descrição da atividade/projeto
      problemSolved: string; // O impacto gerado, o problema resolvido
      technologies: string[]; // Nomes das tecnologias usadas
      appliedSoftSkills: string[]; // Nomes das soft skills aplicadas
    }[];
  }[];

  createdAt: Date; // Data de criação do perfil
  updatedAt: Date; // Data da última atualização
}
```

##### **Exemplo de Documento `Resume`**

```json
// Documento em: resumes/firebase_user_id_1
{
  "userId": "firebase_user_id_1",
  "status": "published",
  "fullName": "Ana Beatriz Silva",
  "email": "ana.silva@exemplo.com",
  "phone": "(11) 99999-8888",
  "linkedinUrl": "https://linkedin.com/in/anabeatrizsilva",
  "mainArea": "Desenvolvimento de Software",
  "experienceLevel": "Sênior",
  "summary": "Engenheira de Software Sênior com 8 anos de experiência na construção de sistemas distribuídos de alta performance. Apaixonada por arquitetura de microserviços, cloud computing e por resolver problemas complexos de negócio com tecnologia.",
  "academicFormations": [
    {
      "level": "Graduação",
      "courseName": "Engenharia da Computação",
      "institution": "Universidade de São Paulo (USP)",
      "startDate": "2012-02-01T00:00:00Z",
      "endDate": "2016-12-15T00:00:00Z"
    }
  ],
  "languages": [
    { "language": "Português", "proficiency": "Nativo" },
    { "language": "Inglês", "proficiency": "Avançado (C1)" }
  ],
  "professionalExperiences": [
    {
      "experienceType": "CLT",
      "companyName": "TechFin Soluções",
      "role": "Engenheira de Software Sênior",
      "startDate": "2020-01-10T00:00:00Z",
      "endDate": null,
      "isCurrent": true,
      "activitiesPerformed": [
        {
          "activity": "Liderei o desenvolvimento do novo sistema de prevenção a fraudes.",
          "problemSolved": "Aumentamos a detecção de transações fraudulentas em 70% e reduzimos os falsos positivos em 25%, melhorando a segurança e a experiência do usuário.",
          "technologies": ["Go (Golang)", "gRPC", "PostgreSQL", "Redis", "Grafana"],
          "appliedSoftSkills": ["Liderança Técnica", "Tomada de Decisão Baseada em Dados", "Mentoria"]
        }
      ]
    },
    {
      "experienceType": "CLT",
      "companyName": "InovaCode",
      "role": "Desenvolvedora de Software Pleno",
      "startDate": "2017-02-01T00:00:00Z",
      "endDate": "2019-12-20T00:00:00Z",
      "isCurrent": false,
      "activitiesPerformed": [
        {
          "activity": "Participei da equipe que desenvolveu o aplicativo de e-commerce da empresa.",
          "problemSolved": "Contribuí para a implementação do carrinho de compras e integração com gateways de pagamento, resultando em um aumento de 30% nas vendas via app.",
          "technologies": ["Java", "Spring Boot", "MySQL", "AWS S3"],
          "appliedSoftSkills": ["Trabalho em Equipe", "Metodologias Ágeis (Scrum)"]
        }
      ]
    }
  ],
  "createdAt": "2022-08-01T10:00:00Z",
  "updatedAt": "2025-06-20T14:30:00Z"
}
```

-----

#### **3. Estrutura `ResumeSnapshot`**

Este modelo representa a cópia imutável do `Resume` no momento de uma aplicação.

* **Coleção Firestore:** `resumeSnapshots`
* **ID do Documento:** `{snapshotId}` (um ID único gerado automaticamente).

##### **Definição do Modelo (`resume-snapshot.model.ts`)**

```typescript
// O Snapshot herda toda a estrutura do Resume e adiciona campos de metadados.
export interface ResumeSnapshot extends Resume {
  originalCandidateId: string; // Mantém a referência ao ID do usuário original
  hash: string; // Um hash (ex: SHA-256) gerado a partir do conteúdo do objeto Resume, para detectar duplicatas.
  aiClassification: {
    status: 'pending' | 'completed' | 'failed';
    classifiedLevel?: string;
    processedAt?: Date;
    tags?: string[];
    summary?: string; // Um resumo do perfil gerado por IA
  };
}
```

##### **Exemplo de Documento `ResumeSnapshot`**

Este documento é uma cópia do `Resume` de Ana Beatriz, com a adição dos campos `originalCandidateId`, `hash`, e `aiClassification`.

```json
// Documento em: resumeSnapshots/aK2jLp...
{
  // ... (todos os campos do exemplo de Resume da Ana Beatriz acima) ...

  // Campos adicionais do Snapshot:
  "originalCandidateId": "firebase_user_id_1",
  "hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "aiClassification": {
    "status": "completed",
    "classifiedLevel": "Sênior",
    "processedAt": "2025-06-21T11:05:00Z",
    "tags": ["Go (Golang)", "Java", "Liderança Técnica", "Sistemas Distribuídos", "Prevenção a Fraude"],
    "summary": "Engenheira de software sênior com forte experiência em backend, arquitetura de microserviços e liderança. Demonstra impacto claro nos negócios através da resolução de problemas complexos, como a redução de fraudes e melhoria de performance de sistemas."
  }
}
```

#### **4. Fluxo de Trabalho da Aplicação (Workflow)**

A interação entre esses modelos é a chave para a eficiência do sistema.

1.  **Candidato Clica em "Aplicar"**:
    a.  O frontend busca o documento `Resume` atual do usuário na coleção `resumes`.
    b.  Um hash (ex: SHA-256) é gerado a partir do conteúdo deste objeto `Resume`.
    c.  O sistema consulta a coleção `resumeSnapshots` para ver se já existe um snapshot para aquele `originalCandidateId` com o mesmo `hash`.

2.  **Cenário 1: Hash é Novo (Currículo foi alterado)**
    a.  Uma cópia exata do objeto `Resume` é criada.
    b.  Os campos `originalCandidateId`, `hash`, e `aiClassification` (com status 'pending') são adicionados a esta cópia.
    c.  Este novo objeto é salvo como um novo documento na coleção `resumeSnapshots`.
    d.  O sistema cria o documento `CandidateApplication` na subcoleção da vaga, armazenando o `ID` do **novo snapshot**.

3.  **Cenário 2: Hash Já Existe (Currículo não mudou)**
    a.  Nenhum novo snapshot é criado.
    b.  O sistema obtém o `ID` do snapshot existente que possui aquele `hash`.
    c.  O sistema cria o documento `CandidateApplication`, armazenando o `ID` do **snapshot existente**.

Este fluxo garante que a base de dados não terá snapshots duplicados e idênticos, otimizando custos e mantendo a integridade histórica de cada aplicação.

## Análise de Experiência do Usuário (UX) - Protótipo de Cadastro de Currículo

O protótipo atual (docs/examples/html/resume.html) é um excelente ponto de partida visual e funcional. A análise a seguir tem como objetivo refinar a experiência para maximizar a taxa de conclusão do cadastro, reduzir a frustração do usuário e garantir a qualidade dos dados coletados.

1. Pontos Fortes (O que já está funcionando bem)
   Fluxo em Etapas (Wizard): A divisão do formulário em três passos ("Pessoal", "Perfil", "Experiência") é a maior força do layout. Isso reduz a carga cognitiva inicial, fazendo com que a tarefa de preencher o currículo pareça menos intimidadora. O usuário foca em um contexto por vez.

Feedback Visual Claro: O stepper no topo da página é um ótimo indicador de progresso. A mudança de cor (cinza -> azul -> verde) e de ícone (número -> check) comunica claramente onde o usuário está, por onde já passou e o que ainda falta.

Ações e Hierarquia Visual: A página tem uma hierarquia visual bem definida. Títulos, seções e botões são facilmente distinguíveis. O uso de cores de destaque (accent e primary) para ações principais (+ Adicionar, "Próximo") orienta o usuário de forma eficaz.

Flexibilidade com Conteúdo Dinâmico: A capacidade de adicionar e remover seções como "Formação" e "Experiência" é essencial e foi bem implementada no protótipo, dando ao usuário o controle sobre a estrutura do seu próprio currículo.

2. Pontos de Melhoria (Onde podemos refinar a UX)
   A principal área para melhoria está na gestão da carga cognitiva e do esforço exigido do usuário, especialmente na seção de "Experiências Profissionais".

Carga Cognitiva Elevada na Seção de Experiência:

Problema: A seção "Atividades Realizadas" dentro de cada experiência pede quatro informações detalhadas de uma só vez (atividade, problema resolvido, tecnologias, soft skills). Isso pode ser exaustivo e desmotivador, especialmente para candidatos com muitas experiências. O usuário pode se sentir sobrecarregado e abandonar o cadastro nesta etapa.

Impacto: Alta chance de abandono do formulário. A qualidade das informações também pode cair, com usuários preenchendo os campos de forma genérica apenas para avançar.

Entrada de Dados Propensa a Erros (Tecnologias e Soft Skills):

Problema: Pedir para o usuário listar tecnologias e habilidades separadas por vírgula é um método frágil. Gera dados inconsistentes (ex: "Java", "java", "Java 8") e uma experiência de digitação pobre.

Impacto: Dificulta a busca e a filtragem de dados para a IA do matching e pode frustrar o usuário que não sabe qual formato usar.

Falta de Sensação de Progresso e Segurança:

Problema: Formulários longos geram o medo de "perder todo o meu trabalho". Embora seja um protótipo, a interface não comunica que os dados estão seguros. Não há feedback de salvamento automático.

Impacto: O usuário pode hesitar em preencher muitas informações de uma vez, temendo perder o progresso se a página for fechada ou ocorrer um erro.

3. Sugestões de Ajustes (Recomendações Práticas)
   Com base nos pontos acima, sugiro os seguintes ajustes para refinar a experiência antes de iniciar o desenvolvimento em Angular:

Sugestão 1: Simplificar a Seção de "Experiência Profissional" (Reduzir Carga Cognitiva)

Em vez de um grande bloco de textarea, podemos quebrar a adição de atividades em um processo mais guiado.

Passo A: O usuário adiciona a experiência com os dados principais (Cargo, Empresa, Datas).

Passo B: Dentro do card da experiência, o botão "+ Adicionar Atividade" abriria um pequeno modal ou um formulário inline focado em apenas uma atividade por vez.

Resultado: Isso transforma uma tarefa grande e assustadora em pequenas vitórias, mantendo o usuário engajado.

Sugestão 2: Usar um Componente de "Tags" para Habilidades e Tecnologias

Substituir o campo de texto livre por um campo de input de tags.

Como Funciona: O usuário digita uma tecnologia (ex: "Java") e aperta "Enter" ou "vírgula". A palavra se transforma em uma tag visualmente distinta. O sistema pode, no futuro, até sugerir tecnologias à medida que o usuário digita.

Vantagens:

Para o Usuário: Experiência mais interativa e organizada.

Para o Sistema: Garante dados limpos e consistentes, perfeitos para a IA.

Sugestão 3: Implementar Micro-interações e Feedback Constante

Auto-Save Feedback: Adicionar um pequeno texto "Salvo automaticamente ✓" que aparece discretamente após o usuário parar de digitar em um campo. No protótipo, podemos simular isso com um setTimeout.

Reordenar Itens: Permitir que o usuário reordene suas experiências ou formações usando ícones de seta (▲/▼) ou uma funcionalidade de arrastar e soltar (drag-and-drop). Isso dá mais controle e flexibilidade.

Animações Sutis: Adicionar transições suaves quando novos itens são adicionados ou removidos da lista, tornando a interface mais fluida e profissional.

Conclusão e Próximos Passos
O formato atual é um excelente protótipo visual e estrutural. A base com o wizard é sólida e deve ser mantida.

Recomendação: Devemos seguir com este formato, mas incorporando as sugestões de UX antes da implementação final. A prioridade máxima seria repensar a seção de Experiências e a entrada de Habilidades/Tecnologias, pois são os pontos com maior risco de causar o abandono do formulário.

Ao fazer esses ajustes, o formulário se tornará não apenas funcional, mas também uma ferramenta que motiva o usuário a fornecer informações completas e de alta qualidade, o que é essencial para o sucesso da plataforma.

## Arquitetura de Componentes Angular para o Formulário de Currículo
Com base no protótipo validado, esta é a arquitetura de componentes recomendada para a implementação em Angular. A estrutura foca na separação de responsabilidades, reutilização e escalabilidade, utilizando o ReactiveFormsModule para o gerenciamento do estado do formulário e as mais recentes práticas do Angular para performance.

Diretrizes de Implementação Moderna (Angular 17+)
Esta arquitetura segue um conjunto de regras estritas para garantir a máxima performance e manutenibilidade em um ambiente moderno.

Arquitetura Standalone: Todos os componentes devem ser declarados com standalone: true. Cada componente gerenciará suas próprias dependências (como ReactiveFormsModule ou outros componentes) através do array imports em seu decorador @Component. Não haverá NgModules para esta feature.

Novo Control Flow (@): O uso das diretivas estruturais antigas como *ngIf e *ngFor não é permitido. Deve-se utilizar exclusivamente a nova sintaxe de built-in control flow (@if, @for, @switch).

Aplicação Zoneless: O projeto é configurado para rodar sem zone.js. Isso significa que a detecção de mudanças automática do Angular não está presente. A reatividade da UI deve ser garantida através de outros mecanismos.

Reatividade com Signals: Para lidar com a ausência do zone.js, o estado dos componentes deve ser gerenciado preferencialmente com Angular Signals. Propriedades que mudam e devem refletir na UI (como currentStep ou listas dinâmicas) devem ser declaradas como signal(). Isso garante que o Angular saiba exatamente o que atualizar na tela e quando.

Change Detection OnPush: Todos os componentes devem usar changeDetection: ChangeDetectionStrategy.OnPush para otimizar a performance, garantindo que a detecção de mudanças só ocorra quando os @Input() do componente mudarem ou quando um evento do próprio componente for disparado. Esta estratégia funciona de forma nativa e ideal com Signals.

Estrutura Geral de Diretórios
A organização dos arquivos dentro de src/app/features/resume/ seria a seguinte:

resume/
|-- components/
|   |-- resume-stepper/
|   |-- tag-input/
|   |-- experience-form/
|
|-- resume-edit/
|   |-- resume-edit.component.ts
|   |-- resume-edit.component.html
|
|-- resume.routes.ts

Descrição Detalhada dos Componentes
1. ResumeEditComponent (Componente Principal)
   Responsabilidades:

Criar o FormGroup principal e os FormArray para as seções dinâmicas.

Controlar a etapa ativa do formulário usando um signal (ex: currentStep = signal(0)).

Conter a lógica de navegação (nextStep(), prevStep()) que atualiza o signal da etapa.

Injetar o ResumeService (serviço principal) para carregar e salvar os dados do currículo.

Injetar os serviços de curadoria para popular campos de seleção (ex: selects para Nível de Experiência, ou auto-complete para Tecnologias).

Orquestrar a validação geral do formulário.

Implementação Técnica:

standalone: true.

imports: [ResumeStepperComponent, ExperienceFormComponent, ReactiveFormsModule, ...].

changeDetection: ChangeDetectionStrategy.OnPush.

O template usará @switch (currentStep()) para renderizar o fieldset da etapa correta.

Para as listas dinâmicas, o template usará @for (experienceGroup of experiences().controls; track experienceGroup).

Injeção de Dependências: A injeção dos serviços será feita diretamente na declaração das propriedades, utilizando a função inject() do Angular, que é ideal para componentes standalone.

// Exemplo de injeção de dependências no ResumeEditComponent
private resumeService = inject(ResumeService);

// Injeção dos serviços de curadoria específicos
private experienceLevelsService = inject(ExperienceLevelsService);
private professionalAreasService = inject(ProfessionalAreasService);
private technologiesService = inject(TechnologiesService);
private languagesService = inject(LanguagesService);
private softSkillsService = inject(SoftSkillsService);

2. ResumeStepperComponent (Componente de Etapas)
   Responsabilidades:

Apenas renderizar visualmente o progresso, sem lógica de negócio.

Inputs (@Input()):

currentStep: number: Recebe o valor do signal do componente pai.

steps: string[]: Um array com os nomes das etapas.

Implementação Técnica:

standalone: true.

changeDetection: ChangeDetectionStrategy.OnPush.

A lógica interna para aplicar classes CSS (active, completed) será baseada na comparação com o @Input() currentStep.

3. ExperienceFormComponent (Sub-formulário de Experiência)
   Responsabilidades:

Renderizar os campos de uma única experiência.

Gerenciar o sub-formulário de "Atividades Realizadas".

Inputs (@Input()):

experienceForm: FormGroup: Recebe o FormGroup de uma experiência.

Outputs (@Output()):

remove: EventEmitter<void>: Emite um evento quando a exclusão é solicitada.

Implementação Técnica:

standalone: true.

imports: [TagInputComponent, ReactiveFormsModule, ...].

changeDetection: ChangeDetectionStrategy.OnPush.

O template usará @for para iterar sobre o FormArray das atividades.

4. TagInputComponent (Componente de Tags - Custom Form Control)
   Responsabilidades:

Gerenciar uma lista de strings (tags).

Prover a UI para adicionar e remover tags.

Implementação:

standalone: true.

changeDetection: ChangeDetectionStrategy.OnPush.

Implementará a interface ControlValueAccessor para se integrar ao ReactiveFormsModule.

Seu estado interno (a lista de tags) será gerenciado por um signal.

Inputs (@Input()):

placeholder: string.

Fluxo de Dados e Interação (com Signals)
O ResumeEditComponent é carregado. Ele cria o FormGroup e inicializa o signal do passo: currentStep = signal(0).

O template do ResumeEditComponent lê o valor do signal (currentStep()) e passa para o ResumeStepperComponent. O bloco @switch também reage a esta mudança, exibindo a seção correta.

O laço @for no template do ResumeEditComponent itera sobre os controles do FormArray de experiências e renderiza um <app-experience-form> para cada um.

Quando o usuário clica no botão "Próximo", o método nextStep() é chamado no ResumeEditComponent, que executa this.currentStep.set(1).

Magia dos Signals: A atualização do signal automaticamente notifica todas as partes do template que o utilizam (@switch, ResumeStepperComponent), que se atualizam de forma otimizada, sem a necessidade do zone.js.

Quando o usuário digita uma tag no TagInputComponent, o ControlValueAccessor notifica o FormControl da mudança. O FormGroup principal é atualizado, e o estado permanece consistente.

Quando o usuário clica para remover uma experiência, o ExperienceFormComponent emite o evento remove. O ResumeEditComponent executa o método removeAt() no FormArray, e a reatividade do laço @for remove o componente da tela.

Essa abordagem não só adere às restrições do projeto, mas também cria uma base extremamente performática e alinhada com o futuro do desenvolvimento em Angular.

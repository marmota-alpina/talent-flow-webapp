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

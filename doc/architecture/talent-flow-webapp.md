# **Documento de Arquitetura: `talent-flow-webapp`**

Versão: 1.0

Data: 14 de junho de 2025

Projeto Relacionado: Talent Flow

## **1. Visão Geral e Objetivos**

O `talent-flow-webapp` é a aplicação frontend principal da plataforma Talent Flow. É uma Single-Page Application (SPA) com capacidades de Server-Side Rendering (SSR), construída para ser a interface principal de interação para todos os usuários:

- **Candidatos:** Para cadastro e gerenciamento de seus currículos.
- **Recrutadores e Administradores:** Para gerenciamento de vagas e curadoria de dados.
- **Visitantes:** Para visualização de vagas públicas.

O objetivo é fornecer uma experiência de usuário rápida, reativa, segura e intuitiva, que funcione perfeitamente em qualquer dispositivo e seja otimizada para motores de busca.

## **2. Stack de Tecnologias Principal**

|   |   |   |
|---|---|---|
|**Categoria**|**Tecnologia**|**Justificativa**|
|**Framework Principal**|Angular 20|Framework robusto, com arquitetura standalone, zoneless e reatividade baseada em Signals.|
|**Linguagem**|TypeScript|Garante a tipagem estática, resultando em um código mais seguro e de fácil manutenção.|
|**Estilização**|Tailwind CSS & SASS|Abordagem "utility-first" para agilidade e consistência, com SASS para organização e casos complexos.|
|**Renderização**|Angular Universal (SSR)|Essencial para a otimização de SEO das páginas públicas de vagas e melhor performance percebida.|
|**Gerenciamento de Estado**|Angular Signals|Primitiva nativa do Angular para um gerenciamento de estado reativo, simples e performático.|
|**Formulários**|Angular Reactive Forms|Solução poderosa e escalável para a criação dos formulários dinâmicos do sistema.|
|**Comunicação com Backend**|`@angular/fire`|SDK oficial para integração completa e reativa com os serviços do Firebase (Auth, Firestore).|

#### **3. Padrões de Arquitetura**

A aplicação seguirá um conjunto de padrões bem definidos para garantir qualidade e escalabilidade:

- **Arquitetura Modular (Lazy Loading):** As principais funcionalidades (Curadoria, Gestão de Vagas, etc.) serão desenvolvidas como módulos ou conjuntos de rotas carregados sob demanda (lazy loading) para otimizar o tempo de carregamento inicial.
- **Controle de Acesso Baseado em Papéis (RBAC):** Acesso às rotas será controlado por Guards (`AuthGuard` para autenticação e `RoleGuard` para autorização), lendo os papéis dos usuários de um perfil no Firestore.
- **Componentes "Smart" & "Dumb":** Seguiremos a prática de ter componentes "inteligentes" (de página) que lidam com a lógica e o estado, e componentes "burros" (reutilizáveis) que apenas recebem dados (`@Input`) e emitem eventos (`@Output`), promovendo a reutilização.
- **Serviços para Lógica de Negócio:** Toda a comunicação com o backend e a lógica de negócio complexa serão encapsuladas em serviços injetáveis, mantendo os componentes focados na apresentação.
- **Navegação Orientada por Dados:** Um sistema de Breadcrumbs será alimentado por metadados nas definições de rota, centralizando a lógica de navegação.

#### **4. Estrutura de Diretórios**

A estrutura de diretórios será organizada para promover a separação de responsabilidades:

```
src/app/
|-- core/
|   |-- guards/         # Guards de rota (AuthGuard, RoleGuard)
|   |-- services/       # Serviços singleton (AuthService, BreadcrumbService)
|   `-- interfaces/     # Interfaces globais
|-- features/           # Módulos ou rotas de features (lazy-loaded)
|   |-- curation/
|   |-- vacancy-management/
|   `-- resume-builder/
|-- models/             # Interfaces de modelo de dados (UserProfile, Vacancy)
`-- shared/             # Componentes, pipes e diretivas reutilizáveis
    |-- components/     # (ex: ButtonComponent, ModalComponent)
    |-- pipes/
    `-- directives/
```

#### **5. Fluxo de Dados Principal: Autenticação e Autorização**

1. O usuário se autentica via `LoginComponent`, que chama o `AuthService`.
2. O `AuthService` lida com a autenticação do Firebase e, em caso de sucesso, cria/atualiza o perfil do usuário na coleção `users` do Firestore.
3. O `AuthService` armazena o estado de autenticação e o perfil do usuário em `signals`.
4. O `RoleGuard` lê o `signal` do perfil do usuário para verificar seu `role` antes de permitir o acesso a uma rota protegida.
5. Componentes de layout (como `MainLayoutComponent`) se inscrevem nos `signals` do `AuthService` para exibir informações do usuário (nome, foto).
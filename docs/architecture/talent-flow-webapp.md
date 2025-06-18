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

O fluxo de autenticação é o ponto de entrada para usuários na plataforma, projetado para ser seguro, testável e reativo, utilizando o Firebase e as melhores práticas do Angular.

1.  **Início do Fluxo (Interface do Usuário):**
    *   O usuário acessa a rota `/login`, onde o `LoginComponent` é renderizado.
    *   Ao clicar em "Entrar com o Google", o `LoginComponent` invoca o método `loginWithGoogle()` do `AuthService`.

2.  **Lógica de Autenticação (`AuthService`):**
    *   O `AuthService` utiliza o SDK do Firebase (`@angular/fire`) para abrir um popup de autenticação do Google.
    *   Para garantir a testabilidade e desacoplamento, as funções modulares do Firebase (como `signInWithPopup`, `getDoc`, `setDoc`) são injetadas no serviço através de `InjectionToken`, uma decisão documentada na **ADR-0020**.

3.  **Criação/Atualização de Perfil no Firestore:**
    *   Após a autenticação bem-sucedida com o Google, o `AuthService` recebe as informações do usuário (`User`).
    *   Ele então verifica se já existe um documento para este usuário na coleção `users` do Firestore, usando o `uid` do usuário como ID do documento.
    *   **Se o usuário é novo:** Um novo perfil (`UserProfile`) é criado no Firestore, armazenando dados essenciais como `uid`, `displayName`, `email`, `photoURL` e um `role` padrão de `'candidate'`.
    *   **Se o usuário já existe:** O `AuthService` apenas atualiza a data do último login (`updatedAt`).

4.  **Gerenciamento de Estado com Signals:**
    *   O `AuthService` expõe o estado de autenticação através de `signals` reativos:
        *   `currentUser`: Contém o objeto `User` do Firebase ou `null`.
        *   `userProfile`: Contém o objeto `UserProfile` do Firestore ou `null`.
        *   `isLoading`: Indica se uma operação de login/logout está em andamento.
    *   Componentes em toda a aplicação, como o `MainLayoutComponent`, consomem esses `signals` para exibir ou ocultar informações do usuário de forma reativa e sem a necessidade de `subscribe`.

5.  **Proteção de Rotas com Guards:**
    *   O `AuthGuard` protege as rotas que exigem autenticação. Ele verifica se o `signal` `currentUser` possui um valor. Se for `null`, o acesso é negado e o usuário é redirecionado para `/login`.
    *   Futuramente, um `RoleGuard` lerá o `signal` `userProfile` para verificar o `role` do usuário e autorizar o acesso a rotas específicas (ex: rotas de administrador).

6.  **Logout:**
    *   O `MainLayoutComponent` oferece a opção de "Sair".
    *   O clique aciona o método `logout()` no `AuthService`, que chama a função de `signOut` do Firebase, limpa os `signals` de estado e redireciona o usuário para a página de login.
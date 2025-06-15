### **Estória de Usuário: Setup Inicial do Projeto `talent-flow-webapp`**

ID da Estória: TFLOW-001

Feature: Infraestrutura do Projeto

Pontos de Estória (Estimativa): 5

- **Como um:** Desenvolvedor(a) da equipe Talent Flow.
- **Eu quero:** Inicializar um novo projeto Angular seguindo a arquitetura e as decisões técnicas definidas, com todas as dependências e configurações base prontas para uso.
- **Para que:** Eu e a equipe possamos começar a desenvolver as features principais (como login e curadoria) sobre uma fundação sólida, consistente e escalável, sem perder tempo com configurações repetitivas.

### **Critérios de Aceitação (AC)**

#### **AC1: Geração e Configuração do Projeto Angular**

- O projeto deve ser gerado com o Angular CLI (`ng new talent-flow-webapp`).
- As opções para **standalone components**, **SSR (Server-Side Rendering)** e **SCSS** (SASS) devem ser habilitadas durante a criação.

#### **AC2: Instalação de Dependências Essenciais**

- As seguintes dependências principais devem ser adicionadas ao `package.json` e instaladas:
    - `@angular/fire` (para integração com Firebase)
    - `tailwindcss`, `postcss`, `autoprefixer` (para o sistema de estilização)
    - `firebase`
    - - `ngx-toastr` para exibição de notificações (toasts).
	- `sweetalert2` para exibição de modais e diálogos de confirmação.

#### **AC3: Configuração do Tailwind CSS e Estilos Globais**

- O arquivo `tailwind.config.js` deve ser criado e configurado para escanear os arquivos `html` e `ts`.
- O arquivo `styles.scss` principal deve conter as diretivas `@tailwind base`, `@tailwind components` e `@tailwind utilities`.
- O sistema de design inicial (cor primária, fonte `Inter`) definido na **ADR-010** deve ser configurado no `tailwind.config.js`.

#### **AC4: Integração com Firebase**

- A estrutura dos arquivos de ambiente (`environment.ts`, `environment.development.ts`) deve ser criada para armazenar a configuração do Firebase.
- Um arquivo `environment.example.ts` (com chaves vazias) deve ser criado e versionado no Git, enquanto os arquivos com credenciais reais devem ser adicionados ao `.gitignore`.
- A inicialização do Firebase no `app.config.ts` (`provideFirebaseApp`, `provideAuth`, `provideFirestore`) deve ser configurada.

#### **AC5: Criação da Estrutura de Diretórios**

- A estrutura de diretórios base definida no Documento de Arquitetura deve ser criada no `src/app`: `/core`, `/features`, `/models`, `/shared`.

#### **AC6: Documentação Inicial**

- O arquivo `README.md` do projeto deve ser atualizado com as instruções de instalação e configuração para um novo desenvolvedor.
- Um diretório `docs/adr` deve ser criado para armazenar os Arquivos de Decisão de Arquitetura (ADRs) relevantes para este repositório.
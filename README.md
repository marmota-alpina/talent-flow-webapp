# 🎯 **Projeto Talent Flow**

## ✅ **Visão Geral**

O **Talent Flow** é uma plataforma digital voltada para otimizar o processo de recrutamento, seleção e curadoria de candidatos. A proposta é criar um ambiente moderno, escalável e eficiente, tanto para candidatos quanto para recrutadores, utilizando tecnologias cloud-native e arquitetura serverless.

---

## 🚀 **Objetivo do Projeto**

* Facilitar a conexão entre profissionais e oportunidades.
* Automatizar processos de triagem, curadoria e gestão de candidatos.
* Oferecer uma experiência intuitiva para candidatos e poderosa para recrutadores.

---

## 🏗️ **Arquitetura Tecnológica**

* **Frontend:** Angular com Server Side Rendering (SSR), arquitetura baseada em componentes e serviços reutilizáveis.
* **Backend:** Arquitetura BaaS utilizando Google Firebase e Google Cloud Functions.
* **Mensageria:** Google Cloud Pub/Sub com suporte a Dead Letter Queue (DLQ).
* **Autenticação:** Login social via Google.
* **Design:** Tailwind CSS, Sass e um Design System próprio.
* **Repositório:** Estrutura híbrida Monorepo + Polyrepo para gerenciar escalabilidade e organização de código.

---

## 🔍 **Principais Funcionalidades**

* 🧑‍💻 **Área do Candidato:**

  * Cadastro e edição de currículo via formulário dinâmico.
  * Acompanhamento de candidaturas em tempo real.
  * Visualização de vagas públicas.

* 🎯 **Área do Recrutador/Curador:**

  * Painel de controle com gestão de vagas.
  * Ferramentas de curadoria e anotação de dados.
  * Visualização dos candidatos por vaga.

* 📜 **Administração:**

  * Gerenciamento de usuários com controle de acesso (RBAC).
  * Atribuição manual de papéis administrativos.

* 🔗 **Integrações e Automação:**

  * API de Inteligência Artificial para suporte ao processo de matching.
  * Cloud Functions para processamento assíncrono e automações.

---

## 🧠 **Diferenciais Técnicos**

* SSR no Angular para melhor performance e SEO.
* Gerenciamento de estado com Angular Signals.
* Design System consistente e responsivo.
* Pipeline CI/CD implementado desde o início do projeto.
* Uso de mensageria para desacoplamento e escalabilidade.

---

## ⚠️ **Dívidas Técnicas e Pontos de Atenção**

* Algumas funcionalidades foram postergadas, como:

  * Sistema de notificações.
* Existem débitos técnicos registrados relacionados à evolução de padrões, automação e refino de alguns processos internos.

---

## 📈 **Próximos Passos e Expansões**

* Implementação de notificações e melhorias na automação.
* Evolução da API de IA para suporte a curadoria inteligente.
* Ampliação do Design System e refino da experiência do usuário.
* Monitoramento de processos assíncronos e melhorias na observabilidade.


## Detalhes do Projeto estão no diretório `docs`


## 🚀 **Instalação e Execução**

Este projeto foi gerado com [Angular CLI](https://github.com/angular/angular-cli) versão 20.0.1.

### Pré-requisitos

- Node.js (v18 ou superior)
- npm (v9 ou superior)

### Passos para Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/marmota-alpina/talent-flow-webapp.git
   cd talent-flow-webapp
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o Firebase:
   - Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
   - Copie o arquivo `src/environments/environment.example.ts` para `src/environments/environment.ts` e `src/environments/environment.development.ts`
   - Preencha as configurações do Firebase nos arquivos de ambiente com as credenciais do seu projeto

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm start
   ```

5. Acesse a aplicação em `http://localhost:4200/`

### Estrutura do Projeto

O projeto segue uma arquitetura modular com a seguinte estrutura de diretórios:

- `/src/app/core`: Serviços e componentes essenciais usados em toda a aplicação
- `/src/app/features`: Módulos de funcionalidades específicas da aplicação
- `/src/app/models`: Interfaces e tipos de dados
- `/src/app/shared`: Componentes, diretivas e pipes reutilizáveis

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
npm test
```

### Browser Configuration for Tests

The test runner requires a Chrome browser. If you encounter the error "No binary for Chrome browser on your platform", you can use one of the following commands based on your operating system:

- **Linux with Chromium**:
  ```bash
  npm run test:chromium
  ```

- **Linux with Google Chrome**:
  ```bash
  npm run test:chrome
  ```

- **Windows**:
  ```bash
  npm run test:chrome-win
  ```

- **macOS**:
  ```bash
  npm run test:chrome-mac
  ```

Alternatively, you can set the `CHROME_BIN` environment variable to point to your Chrome/Chromium binary before running the tests:

```bash
# Example for Linux
export CHROME_BIN=/usr/bin/chromium
npm test

# Example for Windows (Command Prompt)
set CHROME_BIN=C:\Program Files\Google\Chrome\Application\chrome.exe
npm test

# Example for macOS
export CHROME_BIN="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
npm test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

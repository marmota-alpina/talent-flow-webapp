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


## Detalhes do Projeto estão no diretório `doc`


## 🚀 **Instalação e Execução**

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.1.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

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
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

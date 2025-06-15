# Documentação do Projeto Talent Flow

Bem-vindo à documentação do Talent Flow. Este diretório contém artefatos importantes que registram as decisões de arquitetura e os requisitos funcionais do projeto.

## Navegação

- **/architecture**: Contém os arquivos que documentam a arquitetura do projeto em detalhes.
    
- **/adr**: Contém os **Architecture Decision Records (ADRs)**. Cada arquivo neste diretório documenta uma decisão arquitetural significativa, o contexto que a motivou e suas consequências. Eles servem como um diário técnico da evolução do projeto.
    
- **/user-stories**: Contém as **Estórias de Usuário** detalhadas para as principais features do sistema. Estes documentos descrevem a funcionalidade do ponto de vista do usuário e servem como base para o desenvolvimento e testes.
    
- **/examples**: Contém os arquivos com exemplos de dados que serão armazenados no **Firestore**
    

### **Revisão Completa da Documentação do Projeto Talent Flow**

#### **1. Visão Geral da Arquitetura Final (O que a documentação deve refletir)**

A documentação deve descrever uma arquitetura **Poly-Repo**, composta por múltiplos serviços independentes que se comunicam de forma assíncrona. Os pilares são:

- **`talent-flow-webapp`:** O frontend em Angular 20, utilizando SSR para páginas públicas (vagas), e funcionando como um "thick client" que interage diretamente com o Firebase (arquitetura BaaS).
- **`talent-flow-functions`:** Funções serverless (Node.js/TS) que atuam como a "cola" do sistema, reagindo a eventos e orquestrando processos.
- **`talent-flow-ia-api`:** Um serviço em Python/FastAPI para as lógicas de IA, desacoplado do resto do sistema via Pub/Sub.
- **Segurança:** Centralizada nas **Regras de Segurança do Firestore**, que são o ponto mais crítico de controle de acesso.

---

#### **2. Checklist de Documentos Essenciais para o MVP**

Use a lista abaixo para verificar se o conteúdo no seu repositório do GitHub está completo.

##### **2.1. `README.md` Principal (Raiz do Repositório)**

Este arquivo é a porta de entrada para todo o ecossistema. Ele deve ser um "meta-documento".

- `[ ]` **Descrição do Projeto:** Apresenta o Talent Flow e seus objetivos.
- `[ ]` **Explicação da Arquitetura Poly-Repo:** Informa que o projeto é dividido em múltiplos repositórios.
- `[ ]` **Links para os Repositórios:** Contém links claros para os repositórios principais (`talent-flow-webapp`, `talent-flow-functions`, `talent-flow-ia-api`, etc.).
- `[ ]` **Guia de Documentação:** Aponta para o diretório `/docs` e explica o que são os ADRs e as Estórias de Usuário.

##### **2.2. `docs/adr/` - Arquivos de Decisão de Arquitetura**

Esta pasta deve conter todas as decisões arquiteturais que tomamos. Verifique se os seguintes ADRs existem e estão completos:

- `[ ]` **ADR 0000:** Adoção da Arquitetura BaaS com Lógica no Frontend
- `[ ]` **ADR 0001:** Uso de Angular Signals para Gerenciamento de Estado
- `[ ]` **ADR 0002:** Adoção de Arquitetura com Componentes e Serviços Base
- `[ ]` **ADR 0006:** Adoção de Login Social com Google
- `[ ]` **ADR 0007:** Adoção do Tailwind CSS como Framework de Estilização
- `[ ]` **ADR 0008:** Escolha do SASS como Pré-processador de CSS
- `[ ]` **ADR 0009:** Reafirmação do Uso de Server-Side Rendering (SSR)
- `[ ]` **ADR 010:** Definição do Sistema de Design Base
- `[ ]` **ADR 011:** Estratégia de Gerenciamento de Usuários e RBAC
- `[ ]` **ADR 012:** Incorporação da Foto de Perfil do Google
- `[ ]` **ADR 013:** Implementação de Navegação e Breadcrumbs Baseados em Rotas
- `[ ]` **ADR 015:** Adoção de Arquitetura Poly-Repo (que substituiu a de Monorepo)
- `[ ]` **ADR 016:** Padrão Arquitetural para Feedback ao Usuário

##### **2.3. `docs/user-stories/` - Estórias de Usuário do MVP**

Esta é a lista completa do escopo funcional do MVP. A ausência de qualquer uma destas estórias representa uma lacuna no planejamento.

**Categoria: Fundação e Setup (`webapp`)**

- `[ ]` **TFLOW-001:** Setup Inicial do Projeto Angular `talent-flow-webapp`.
- `[ ]` **TFLOW-002:** Implementação dos Padrões de Abstração.
- `[ ]` **TFLOW-003:** Implementação de Regras de Segurança do Firestore.
- `[ ]` **TFLOW-010:** Layout Principal e Sistema de Design.

**Categoria: Fluxo do Candidato (`webapp`)**

- `[ ]` **TFLOW-009:** Tela de Autenticação com Login Social.
- `[ ]` **TFLOW-012:** Formulário Dinâmico de Currículo do Candidato.
- `[ ]` **TFLOW-013:** Painel de Controle do Candidato (com status e vagas recomendadas).

**Categoria: Fluxo do Recrutador/Admin (`webapp`)**

- `[ ]` **TFLOW-011:** Área Administrativa de Curadoria.
- `[ ]` **TFLOW-014:** Gerenciamento de Vagas (CRUD).
- `[ ]` **TFLOW-016:** Visualização de Candidatos Compatíveis por Vaga.
- `[ ]` **TFLOW-023:** Interface de Anotação de Dados para Treinamento de IA.

**Categoria: Serviços de Backend (Repositórios Separados)**

- `[ ]` **TFLOW-020:** API de Inteligência Artificial (`talent-flow-ia-api`).
- `[ ]` **TFLOW-021:** Cloud Functions de Automação (`talent-flow-functions`).

**Categoria: Requisitos Não-Funcionais**

- `[ ]` **(Opcional, mas recomendado) TFLOW-004:** Pipeline de CI/CD para os repositórios. Embora não seja uma "feature", é uma estória técnica crucial para o MVP.

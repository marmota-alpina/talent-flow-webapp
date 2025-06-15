# **Estória de Usuário: Gerenciamento de Vagas**

**ID da Estória:** TFLOW-014

**Feature:** Gestão de Recrutamento

**Pontos de Estória (Estimativa):** 8

- **Como um:** Usuário com papel de **Recrutador** ou **Administrador**.
- **Eu quero:** Acessar uma área dedicada no sistema para criar, visualizar, editar e gerenciar o status das vagas de emprego.
- **Para que:** Eu possa publicar novas oportunidades de forma estruturada, mantê-las atualizadas e controlar seu ciclo de vida (ativa/arquivada) para atrair os candidatos certos e alimentar o sistema de matching.

### **Critérios de Aceitação (AC)**

#### **AC1: Acesso e Roteamento**

- Deve ser criada uma nova seção na aplicação, acessível pela rota principal `/gerenciar-vagas`.
- Esta rota e todas as suas sub-rotas devem ser protegidas por um `RoleGuard`, permitindo o acesso apenas a usuários com os papéis (`role`) de `recruiter` ou `admin`.
- Usuários com outros papéis (ex: `candidate`) que tentarem acessar esta rota devem ser redirecionados ou receber uma página de acesso negado.

#### **AC2: Listagem de Vagas**

- A página principal (`/gerenciar-vagas`) deve exibir uma tabela ou uma lista de cards com todas as vagas cadastradas.
- Cada item na lista deve apresentar as informações essenciais da vaga: **Título**, **Nível** (ex: Pleno), **Área** (ex: Desenvolvimento de Software) e **Status** (ex: **Ativa**).
- A lista deve ter funcionalidades de **busca** e **filtro** (ex: filtrar por status "**Ativa**", "**Arquivada**").
- Cada vaga listada deve ter controles para **"Editar"** e **"Arquivar"**.
- Um botão de ação principal, **"+ Criar Nova Vaga"**, deve estar visível e em destaque na página.

#### **AC3: Formulário de Criação e Edição de Vaga**

- Ao clicar em "+ Criar Nova Vaga" ou "Editar", o usuário deve ser direcionado para um formulário (em uma nova página, ex: `/gerenciar-vagas/nova`, ou em um modal).
- O formulário deve conter campos correspondentes ao modelo de dados `Vacancy`:
    - `title`: `input type="text"` (Obrigatório)
    - `description`: `textarea` (um editor de rich text seria ideal para formatação). (Obrigatório)
    - `level`: `select` (Obrigatório)
    - `area`: `select` (Obrigatório)
    - `requiredTechnologies`: `multi-select` ou campo de `tags`. (Obrigatório)
    - `status`: `select` com as opções "**Ativa**" e "**Arquivada**", que correspondem aos valores `'active'` e `'archived'` no backend.
- **Integração com Curadoria:** Os campos `level`, `area` e `requiredTechnologies` devem ser populados dinamicamente com os dados gerenciados na Área de Curadoria (TFLOW-011).
- O formulário deve ser reativo (`ReactiveFormsModule`) e possuir validações claras e em tempo real para os campos obrigatórios.

#### **AC4: Funcionalidade CRUD Completa**

- **Criar:** Ao submeter um formulário de nova vaga preenchido corretamente, um novo documento deve ser criado na coleção `vacancies` do Firestore com o **`status` inicial de `'active'`**. O usuário deve ser redirecionado para a lista de vagas com uma notificação de sucesso.
- **Ler:** A lista de vagas deve carregar e exibir corretamente todos os documentos da coleção `vacancies`.
- **Atualizar:** Ao salvar as alterações de uma vaga existente, o documento correspondente no Firestore deve ser atualizado.
- **Arquivar (Soft Delete):** A ação de "Arquivar" não deve deletar o documento. Em vez disso, deve atualizar o campo `status` da vaga para **`'archived'`**. Isso preserva o histórico. Uma caixa de diálogo de confirmação deve preceder esta ação.
- **Reativar:** Na lista de vagas arquivadas, deve haver um botão "Reativar" que atualiza o campo `status` da vaga de volta para **`'active'`**.

#### **AC5: Consistência de UI/UX**

- Toda a interface da funcionalidade de gerenciamento de vagas (tabelas, botões, formulários, modais) deve seguir rigorosamente o Sistema de Design definido na **ADR-010**.
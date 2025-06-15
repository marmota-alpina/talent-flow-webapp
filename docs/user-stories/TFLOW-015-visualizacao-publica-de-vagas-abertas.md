# **Estória de Usuário: Visualização Pública de Vagas Abertas (active)**

ID da Estória: TFLOW-015

Feature: Portal de Carreiras Público

Pontos de Estória (Estimativa): 8

- **Como um:** Visitante do site (usuário não autenticado ou candidato em potencial).
- **Eu quero:** Acessar uma página pública para ver todas as vagas de emprego que estão abertas e poder clicar em cada uma para ver seus detalhes completos.
- **Para que:** Eu possa descobrir as oportunidades de carreira disponíveis na empresa e me interessar em participar do processo seletivo.

### **Critérios de Aceitação (AC)**

#### **AC1: Roteamento Público e Otimização para SEO**

- Deve ser criada uma rota pública `/vagas` que renderize um novo componente, `VacancyListComponent`. Esta rota **não** deve ser protegida por nenhum `guard`.
- Deve ser criada uma rota pública dinâmica `/vagas/:id` para a página de detalhes, renderizando um `VacancyDetailComponent`.
- **Requisito Crítico de Arquitetura:** Ambas as rotas devem ser totalmente renderizadas no lado do servidor (SSR) para garantir que o conteúdo seja imediatamente indexável por motores de busca (Google, Bing) e que a pré-visualização de links funcione corretamente em redes sociais (LinkedIn).
- Os títulos das páginas (`<title>`) e as meta tags de descrição devem ser definidos dinamicamente para cada página de detalhe de vaga, melhorando o SEO.

#### **AC2: Página de Listagem de Vagas (`/vagas`)**

- O componente nesta página deve utilizar o `VacancyService` para buscar e exibir **apenas** as vagas cuja propriedade `status` seja igual a `"active"`.
- As vagas devem ser apresentadas em formato de lista ou cards, exibindo as informações principais: **Título da Vaga**, **Nível** (ex: Sênior), **Área** (ex: Frontend) e talvez a localidade ou modelo de trabalho.
- Cada card de vaga na lista deve ser um link navegável que aponta para a sua respectiva página de detalhes (ex: `/vagas/documento-id-da-vaga`).
- A página deve incluir uma funcionalidade de busca simples para filtrar vagas por título ou palavra-chave.

#### **AC3: Página de Detalhes da Vaga (`/vagas/:id`)**

- Esta página deve buscar os dados de uma única vaga do Firestore com base no `:id` presente na URL.
- Todas as informações da vaga devem ser exibidas de forma clara e bem estruturada:
    - **Título** em destaque.
    - **Descrição completa** (o conteúdo do rich text editor deve ser renderizado corretamente como HTML).
    - Uma seção de "Detalhes" com **Nível**, **Área**, etc.
    - Uma lista ou conjunto de tags para as **Tecnologias Necessárias**.
- Um botão de Chamada para Ação (CTA) claro e proeminente, como **"Quero me candidatar"** ou **"Fazer Login para Aplicar"**, deve ser exibido.
- Ao clicar no botão CTA, se o usuário não estiver logado, ele deve ser redirecionado para a página `/login`. Idealmente, após o login, ele deve ser redirecionado de volta para a página da vaga que estava visualizando.

#### **AC4: Consistência de UI/UX**

- O design das páginas públicas de vagas deve ser limpo, profissional e alinhado com a identidade visual da empresa (conforme ADR-010), mas pode utilizar um layout público mais simples (com um cabeçalho e rodapé diferentes do layout da aplicação logada).
- A experiência deve ser totalmente responsiva (mobile-first), garantindo que os candidatos possam visualizar e se interessar por vagas facilmente através de seus celulares.
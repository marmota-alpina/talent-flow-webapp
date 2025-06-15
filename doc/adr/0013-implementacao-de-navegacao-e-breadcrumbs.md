# ADR 013: Implementação de Navegação e Breadcrumbs Baseados em Rotas

**Status:** Decidido

**Data:** 2025-06-14

## Contexto

À medida que a aplicação Talent Flow cresce, especialmente com áreas aninhadas como o painel de Curadoria, torna-se essencial fornecer aos usuários uma forma clara de se orientar. Uma estrutura de navegação sem um indicador de localização pode levar à confusão e a uma má experiência do usuário. Precisamos de um sistema de "trilha de pão" (breadcrumbs) que seja escalável e fácil de manter.

## Decisão

1.  **Estrutura de Rotas Hierárquica:** A navegação será definida por uma estrutura de rotas aninhadas no arquivo `app.routes.ts`, que servirá como a única fonte da verdade para a hierarquia da aplicação.
2.  **Sistema de Breadcrumbs Data-Driven:** A geração dos breadcrumbs será orientada por metadados. Uma propriedade `breadcrumb: string` será adicionada ao objeto `data` de cada rota que deve fazer parte da trilha de navegação.
3.  **Serviço Centralizado (`BreadcrumbService`):** Um serviço singleton será responsável por escutar as mudanças de rota do Angular, percorrer a árvore de rotas ativas, extrair os metadados de `breadcrumb` e construir a trilha de navegação em tempo real.
4.  **Componente de UI Dedicado:** Um `BreadcrumbComponent` reutilizável será criado para consumir os dados do `BreadcrumbService` e renderizar a trilha de navegação visualmente, incluindo links e separadores. Este componente será integrado ao layout principal da aplicação.

## Consequências

**Positivas:**
* **Melhora na Usabilidade:** Os usuários terão uma consciência contextual clara de sua localização dentro da plataforma, facilitando a navegação.
* **Manutenibilidade:** A hierarquia de navegação é definida em um único local (`app.routes.ts`), tornando a adição ou alteração de páginas e seus respectivos breadcrumbs um processo simples e centralizado.
* **Código Limpo e Desacoplado:** A lógica para gerar os breadcrumbs (`service`) é completamente separada de sua exibição (`component`), seguindo os princípios de uma boa arquitetura de software.
* **Escalabilidade:** O sistema é inerentemente escalável. Novas seções e subseções podem ser adicionadas à aplicação sem a necessidade de refatorar a lógica de navegação.

**Negativas:**
* **Disciplina da Equipe:** Requer que a equipe de desenvolvimento adote a convenção de adicionar a propriedade `data: { breadcrumb: '...' }` a todas as novas rotas que devem aparecer na trilha.
* **Custo de Implementação Inicial:** Exige o esforço inicial para desenvolver o `BreadcrumbService` e o `BreadcrumbComponent`, embora ambos sejam altamente reutilizáveis.
# **Estória de Usuário: Implementação dos Padrões de Abstração**

**D da Estória:** TFLOW-002

**Feature:** Arquitetura e Core

**Pontos de Estória (Estimativa):** 8

- **Como um:** Desenvolvedor do time do Talent Flow.
- **Eu quero:** Implementar um `BaseCurationService` e um `BaseCurationComponent` genéricos.
- **Para que:** O código de CRUD para as diferentes áreas de curadoria (`technologies`, `softSkills`, `professionalAreas`, etc.) seja reutilizado, reduzindo a duplicação, acelerando o desenvolvimento e garantindo um comportamento consistente em toda a área administrativa.

#### **Critérios de Aceitação (AC)**

**AC1: Padrão de Serviço Base para CRUD de Curadoria (`BaseCurationService`)**

O serviço deve ser uma classe abstrata injetável que lida com as operações do Firestore.

- **Configuração:** O serviço que herdar do `BaseCurationService` deve apenas especificar o nome da coleção do Firestore que ele gerencia.
- **Leitura (Read):** Deve fornecer um método `getAll` que retorna um `Observable` com todos os documentos da coleção. Os documentos devem ser retornados ordenados por um campo `name` ou `description`.
- **Criação (Create):** Deve fornecer um método `create` que recebe os dados do novo item, adiciona um campo `status: 'active'` e o salva no Firestore.
- **Atualização (Update):** Deve fornecer um método `update` que recebe o ID do documento e os novos dados a serem salvos.
- **Exclusão (Soft Delete):** O serviço deve implementar um método `archive` que atualiza o campo `status` do documento para `'archived'`, seguindo o padrão de exclusão lógica da aplicação.
- **Reativação:** O serviço deve implementar um método `unarchive` que atualiza o campo `status` do documento para `'active'`.

**AC2: Padrão de Componente Base para UI de Curadoria (`BaseCurationComponent`)**

O componente deve ser uma classe abstrata que fornece a UI e a lógica para exibir e gerenciar uma lista de itens de curadoria.

- **Injeção de Serviço:** O componente deve injetar uma instância do `BaseCurationService`.
- **Exibição de Dados:** Deve exibir os dados em uma tabela, mostrando o nome/descrição do item.
- **Filtragem de Ativos/Inativos:** Deve haver um controle (como um switch ou abas) que permita ao administrador visualizar os itens com `status: 'active'` ou `status: 'archived'`. A visão padrão deve ser de itens ativos.
- **Ações de CRUD:** Para cada item na tabela, devem haver botões para "Editar", "Arquivar" e "Reativar" (este último visível apenas na lista de arquivados).
- **Formulário de Criação/Edição:** Deve haver um formulário (preferencialmente em um modal) para criar ou editar um item. O mesmo formulário deve ser usado para ambas as ações.
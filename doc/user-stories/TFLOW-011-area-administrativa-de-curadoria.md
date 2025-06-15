# Estória de Usuário: Área Administrativa de Curadoria de Dados

**ID da Estória:** TFLOW-011
**Feature:** Administração da Plataforma

* **Como um:** Administrador da plataforma Tallent Flow.
* **Eu quero:** Gerenciar de forma centralizada todas as listas de opções (como áreas de atuação, tecnologias, soft skills) que são utilizadas nos formulários do sistema.
* **Para que:** Eu possa garantir a consistência, qualidade e padronização dos dados coletados, e facilitar a manutenção e atualização das opções disponíveis para os usuários, sem a necessidade de intervenção do time de desenvolvimento.

### Critérios de Aceitação (AC)

1.  **Controle de Acesso:** Acesso à rota `/admin` (ou `/curation`) deve ser protegido por um guarda que valide se o usuário está autenticado e possui o papel de `admin`.
2.  **Layout e Navegação:** A interface deve possuir uma navegação lateral (sidebar) para alternar entre os diferentes painéis de gerenciamento (Tecnologias, Soft Skills, etc.).
3.  **Funcionalidade CRUD:** Para cada categoria de dados, o admin deve poder:
    * **Ler:** Ver todos os itens em uma tabela.
    * **Criar:** Adicionar um novo item através de um formulário em um modal.
    * **Atualizar:** Editar um item existente.
    * **Excluir:** Remover um item (preferencialmente exclusão lógica / soft delete), com um diálogo de confirmação.
4.  **Painéis Específicos:** Devem existir painéis para gerenciar no mínimo: `professionalAreas`, `experienceLevels`, `languageList`, `proficiencyLevels`, `softSkills`, e `technologies`.
5.  **Feedback Visual:** O sistema deve fornecer feedback claro (loading, toasts de sucesso/erro) para todas as operações.
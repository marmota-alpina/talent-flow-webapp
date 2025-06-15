## Painel de Controle do Recrutador

**ID da Estória:** TFLOW-024

**Feature:** Portal do Recrutador

**Pontos de Estória (Estimativa):** 8

- **Como um:** Usuário com papel de **Recrutador** ou **Administrador**.
- **Eu quero:** Acessar um painel de controle central após o login.
- **Para que:** Eu possa ter uma visão geral das minhas atividades, ver estatísticas importantes e acessar rapidamente as minhas principais ferramentas de trabalho.

#### **Critérios de Aceitação (AC)**

**AC1: Acesso e Roteamento**

- Deve ser criada uma nova seção na aplicação, acessível pela rota principal `/painel-recrutador`.
- Esta rota deve ser protegida pelo `RoleGuard`, permitindo o acesso apenas a usuários com os papéis (`role`) de `recruiter` ou `admin`.
- **Ajuste de Fluxo:** A estória `TFLOW-009` (Tela de Autenticação) deve ser atualizada. A lógica de redirecionamento para recrutadores e administradores deve agora apontar para `/painel-recrutador` como a rota padrão pós-login.

**AC2: Componentes do Painel (Cards de Resumo)**

- O painel deve exibir no topo uma seção de "cards" com métricas chave, como:
    - **Vagas Ativas:** Número total de vagas com `status: 'active'`. O card deve ser um link para a lista de vagas já filtrada.
    - **Novos Candidatos:** Número de currículos criados nos últimos 7 dias.
    - **Candidatos para Revisão:** Número de candidatos em vagas ativas que ainda não foram visualizados ou anotados.
- Os dados para estes cards devem ser carregados de forma assíncrona e exibir um estado de "carregando".

**AC3: Acessos Rápidos (Quick Links)**

- A interface deve apresentar botões de ação (Call to Action) claros e diretos para as tarefas mais comuns:
    - Um botão `+ Criar Nova Vaga` que leva diretamente ao formulário de criação de vaga (`/gerenciar-vagas/nova`).
    - Um link para `Gerenciar Todas as Vagas` (`/gerenciar-vagas`).
    - Um link para a `Área de Anotação de Dados` para o treinamento do modelo de IA (`TFLOW-023`).

**AC4: Lista de Atividades Recentes**

- O painel deve exibir uma tabela ou lista com as 5 vagas mais recentes criadas pelo recrutador.
- A lista deve mostrar informações úteis como: **Título da Vaga**, **Status** e **Número de Candidatos**.
- Cada item na lista deve ser um link para a página de detalhes daquela vaga específica, onde o recrutador pode ver os candidatos compatíveis (`TFLOW-016`).

**AC5: Consistência de UI/UX**

- O design do painel, incluindo a disposição dos cards, botões e listas, deve seguir rigorosamente o Sistema de Design definido na **ADR-010**.
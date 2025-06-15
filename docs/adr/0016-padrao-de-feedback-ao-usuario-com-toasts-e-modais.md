# ADR 016: Padrão Arquitetural para Feedback ao Usuário

**Status:** Decidido

**Data:** 2025-06-14

## Contexto

Em um projeto novo como o Talent Flow, que será rico em interações de CRUD (Criar, Ler, Atualizar, Excluir), é fundamental definir desde o início uma estratégia coesa para a comunicação com o usuário. Um sistema de feedback inconsistente ou pouco claro pode levar a uma má experiência do usuário (UX), frustração e erros. Esta decisão visa estabelecer os padrões de interação para os fluxos de entrada de dados, confirmação de ações e notificação de resultados.

## Decisão

Será adotada uma estratégia de feedback de três camadas, utilizando padrões de UI específicos para cada tipo de interação, a fim de garantir clareza, consistência e uma experiência de usuário fluida.

1.  **Entrada de Dados (Criar/Editar):** Para a entrada de dados complexa, como o cadastro de vagas ou a edição de seções do currículo, o padrão será o uso de **Componentes de Modal**. Estes modais conterão os formulários reativos (`ReactiveFormsModule`) e serão o ambiente focado para a inserção de informações.

2.  **Confirmação de Ações Críticas (Excluir/Arquivar):** Para ações destrutivas ou irreversíveis, será obrigatório o uso de um **Diálogo de Confirmação**. Fica decidida a adoção de uma biblioteca externa, como a **SweetAlert2**, para fornecer esses diálogos de forma estilizada e segura, em substituição ao `window.confirm()` nativo.

3.  **Notificação de Resultados (Sucesso/Erro):** Para informar o usuário sobre o resultado de uma operação assíncrona (ex: "Vaga salva com sucesso" ou "Erro de conexão"), o padrão será o uso de **Notificações Toast**. Fica decidida a adoção de uma biblioteca externa, como a **`ngx-toastr`**, para gerenciar essas notificações não-bloqueantes.

## Consequências

**Positivas:**
* **Experiência do Usuário Coesa:** Desde o início, a aplicação terá uma forma padronizada e profissional de interagir com o usuário, independentemente da feature.
* **Clareza e Prevenção de Erros:** A separação dos padrões evita ambiguidades. O usuário sabe que um modal é para preencher dados, um diálogo de alerta é para uma decisão importante e um toast é apenas informativo.
* **Desenvolvimento Ágil:** Ao definir as ferramentas (ex: `ngx-toastr`, `SweetAlert2`) desde o início, a equipe de desenvolvimento pode criar interações de alta qualidade rapidamente, sem reinventar a roda.
* **Fluxo de Trabalho Ininterrupto:** O uso de toasts para feedback de rotina garante que o usuário não seja interrompido por popups desnecessários, melhorando a produtividade.

**Negativas:**
* **Adição de Dependências:** O projeto iniciará com dependências de terceiros para as bibliotecas de notificações e alertas. A escolha de bibliotecas populares e bem mantidas mitiga o risco associado.
* **Necessidade de Disciplina:** A equipe precisará aderir aos padrões definidos para garantir a consistência em toda a aplicação. Será necessário criar abstrações ou componentes compartilhados para facilitar o uso correto dessas ferramentas.
## **ADR 0019: Adiamento da Funcionalidade de Notificação por E-mail**

**Status:** Aceito
**Data:** 2025-06-14

**Contexto:**

A estória de usuário `TFLOW-021` (`Cloud Functions de Automação`) incluía em sua definição original a criação de uma "Função Notificador", projetada para enviar notificações por e-mail aos usuários. Durante a fase de refinamento da documentação e do escopo do MVP, foi realizada uma análise cruzada de todas as estórias de usuário planejadas. Essa análise revelou que nenhuma outra estória do MVP possuía um requisito funcional que dependesse ou fizesse uso deste serviço de notificação.

**Decisão:**

O desenvolvimento da "Função Notificador" e de qualquer outra funcionalidade de notificação proativa por e-mail está oficialmente **adiado** e removido do escopo do MVP. A estória `TFLOW-021` foi simplificada para focar exclusivamente na "Função Publicador", que é crítica para a orquestração entre o frontend e a API de Inteligência Artificial.

**Consequências:**

- **Positivas:**
    
    - **Redução do Escopo:** O escopo do MVP é reduzido, permitindo que a equipe de desenvolvimento foque em entregar as funcionalidades centrais já definidas.
    - **Prevenção de Superengenharia (YAGNI):** Evita-se o desenvolvimento de código que não seria utilizado na versão inicial do produto, otimizando a alocação de recursos.
    - **Simplificação do Backend:** O repositório `talent-flow-functions` se torna mais simples, com menos uma função para manter e monitorar.
- **Negativas:**
    
    - **Ausência de Engajamento Proativo:** A plataforma será lançada sem um mecanismo para notificar proativamente os usuários sobre eventos de interesse (como novas vagas compatíveis), o que pode impactar o engajamento inicial.
    - **Débito Funcional Consciente:** Esta decisão introduz um débito funcional conhecido. A funcionalidade de notificação precisará ser planejada, priorizada e implementada em um ciclo de desenvolvimento futuro.
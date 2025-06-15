# ADR 0002: Adoção de Arquitetura com Componentes e Serviços Base para Curadoria

**Status:** Aceito

**Data:** 2025-06-14

## Contexto

A Área Administrativa de Curadoria (TFLOW-011) requer a criação de múltiplas páginas de gerenciamento (Tecnologias, Soft Skills, Níveis de Experiência, etc.). Todas essas páginas compartilham a mesma funcionalidade fundamental: operações de CRUD (Criar, Ler, Atualizar, Excluir) em uma coleção do Firestore, exibição em tabela e edição via modal.

Implementar essa lógica repetidamente em cada componente e serviço levaria a uma violação massiva do princípio DRY (Don't Repeat Yourself), resultando em código duplicado, inconsistências e alta dificuldade de manutenção.

## Decisão

Decidimos implementar uma arquitetura de herança com classes base abstratas para a área de curadoria.
1.  **`BaseCurationService`:** Uma classe de serviço abstrata que encapsula toda a lógica de interação com o Firestore (get, add, update, delete) de forma genérica.
2.  **`BaseCurationComponent`:** Uma classe de componente abstrata que contém a lógica compartilhada da interface, como o gerenciamento de estado (signals para itens, loading, modal), e os métodos para acionar as operações de CRUD.

Cada página de curadoria específica (ex: `TechnologiesComponent`) irá herdar de `BaseCurationComponent`, e seu serviço (`TechnologiesService`) herdará de `BaseCurationService`, fornecendo apenas a configuração mínima necessária (como o nome da coleção do Firestore).

## Consequências

**Positivas:**
* **Reutilização Máxima de Código:** A lógica de CRUD e gerenciamento de estado é escrita uma única vez.
* **Desenvolvimento Acelerado:** Adicionar uma nova página de curadoria se torna uma tarefa trivial, exigindo a criação de apenas dois arquivos pequenos com configuração mínima.
* **Manutenção Centralizada:** Correções de bugs ou melhorias de performance aplicadas às classes base se propagam automaticamente para todas as páginas de curadoria.
* **Consistência Garantida:** Todas as páginas de gerenciamento terão exatamente o mesmo comportamento e UX.

**Negativas:**
* **Abstração Adicional:** Desenvolvedores novos no projeto precisarão entender o conceito das classes base e como a herança funciona neste contexto.
* **Alto Acoplamento com a Base:** Uma alteração que quebre a compatibilidade (breaking change) na classe base pode exigir ajustes em todas as classes filhas.
# ADR 0007: Adoção do Tailwind CSS como Framework de Estilização

**Status:** Decidido

**Data:** 2025-06-14

## Contexto

O projeto Talent Flow necessita de uma abordagem de estilização que seja rápida, consistente e de fácil manutenção para construir uma interface de usuário customizada e moderna. As abordagens tradicionais de CSS/SASS, mesmo com metodologias como BEM, podem levar a um grande volume de código CSS customizado, dificuldades com a especificidade e a criação de "dívida de design" ao longo do tempo. Por outro lado, bibliotecas de componentes como Angular Material, embora robustas, impõem um sistema de design específico que pode ser restritivo e difícil de customizar para se adequar a uma identidade visual única.

Precisamos de uma solução que nos dê total controle criativo sem sacrificar a velocidade de desenvolvimento ou a consistência.

## Decisão

Adotaremos o **Tailwind CSS** como o principal framework para toda a estilização da aplicação Talent Flow. A estratégia será a de "utility-first", onde construiremos componentes customizados compondo classes de utilidade diretamente no HTML.

Para padrões repetitivos (como botões e campos de formulário), utilizaremos a diretiva `@layer components` no arquivo global `styles.sass` para criar classes de componentes reutilizáveis (ex: `.btn-primary`, `.form-input`). Esta abordagem híbrida nos dá a velocidade dos utilitários para layouts únicos e a conveniência de classes semânticas para elementos comuns, mantendo o código HTML limpo.

## Consequências

**Positivas:**
* **Velocidade de Desenvolvimento:** Permite a prototipação e construção de interfaces de forma extremamente rápida, pois o desenvolvedor não precisa sair do arquivo HTML para escrever CSS.
* **Consistência Visual Garantida:** Ao utilizar um conjunto predefinido de tokens de design (espaçamento, cores, tipografia) do arquivo `tailwind.config.js`, a consistência visual é mantida por padrão em toda a aplicação.
* **Performance de Produção:** O compilador Just-In-Time (JIT) do Tailwind CSS escaneia os arquivos do projeto e gera um arquivo CSS de produção mínimo, contendo apenas os estilos que são efetivamente utilizados, resultando em um carregamento mais rápido para o usuário final.
* **Manutenção Simplificada:** Os estilos são co-localizados com o markup do componente. Isso torna os componentes verdadeiramente encapsulados e fáceis de refatorar, mover ou excluir sem deixar "CSS órfão". Elimina completamente as guerras de especificidade do CSS.

**Negativas:**
* **Curva de Aprendizagem Inicial:** Desenvolvedores acostumados com a escrita de CSS semântico tradicional podem precisar de um período de adaptação à filosofia "utility-first".
* **Marcação "Verborrágica":** O HTML pode parecer mais "poluído" com múltiplas classes de utilidade em comparação com uma única classe semântica. Este é um trade-off consciente em favor da manutenibilidade e da prevenção de abstrações desnecessárias. A criação de componentes Angular e o uso de `@layer` ajudam a mitigar isso nos casos mais complexos.
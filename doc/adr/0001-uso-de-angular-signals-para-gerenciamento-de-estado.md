# ADR 0001: Uso de Angular Signals para Gerenciamento de Estado

**Status:** Decidido

**Data:** 2025-06-14

## Contexto

Uma aplicação moderna como o `talent-flow-webapp` precisa gerenciar múltiplos estados reativos que mudam ao longo do tempo (ex: status de autenticação do usuário, listas de dados, estados de carregamento). Uma gestão de estado ineficiente ou inconsistente pode levar a bugs, problemas de performance e uma má experiência para o usuário.

As alternativas para o gerenciamento de estado no Angular são:

1. **RxJS e `BehaviorSubject`:** A abordagem tradicional, poderosa, porém verbosa e que pode levar a uma gestão complexa de `subscriptions`, com risco de "memory leaks".
2. **Bibliotecas de Estado (NgRx, Akita):** Soluções robustas e estruturadas, mas que adicionam uma camada significativa de complexidade e código repetitivo ("boilerplate"), sendo potencialmente excessivas para as necessidades do MVP.
3. **Angular Signals:** O novo sistema de reatividade nativo do Angular, projetado para ser mais simples, legível e performático.

## Decisão

O `talent-flow-webapp` adotará **Angular Signals** como a estratégia principal para o gerenciamento de estado reativo.

1. Os estados serão armazenados em primitivas `signal()`.
2. As alterações de estado serão realizadas através dos métodos `.set()` e `.update()`.
3. Dependências entre diferentes estados serão gerenciadas com `computed()` signals.
4. Efeitos colaterais reativos (side effects) serão tratados com `effect()`.
5. Esta abordagem será o padrão para gerenciar o perfil do usuário, listas de dados obtidas do Firestore e estados da UI (como `loading` e `error`).

## Consequências

**Positivas:**

- **Simplicidade e Código Declarativo:** A sintaxe dos Signals é mais simples e intuitiva em comparação com as complexas cadeias de operadores do RxJS, tornando o código mais legível.
- **Performance Otimizada:** Signals permitem uma detecção de mudanças mais granular, o que melhora a performance da aplicação, pois o Angular atualiza apenas os componentes específicos do DOM que foram alterados.
- **Redução de Boilerplate:** Elimina a necessidade do código extenso de configuração e ações/reducers exigido por bibliotecas como NgRx.
- **Alinhamento com o Framework:** Adotar Signals alinha o projeto com a direção futura e as melhores práticas recomendadas pelo próprio time do Angular.

**Negativas:**

- **Mudança de Paradigma:** Requer uma adaptação por parte dos desenvolvedores que estão mais acostumados ao paradigma puramente funcional e reativo do RxJS.
- **Curva de Aprendizagem na Interoperabilidade:** Embora a integração com RxJS seja possível, a equipe precisará aprender as melhores práticas para converter `Observables` em `Signals` e vice-versa, o que pode introduzir uma complexidade inicial.
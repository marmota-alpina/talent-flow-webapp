# ADR 0021: Resolução de Conflito de Dependências do Firebase SDK

**Status:** Aprovado

**Data:** 2025-06-19

## Contexto

Após a refatoração de vários componentes e serviços, a aplicação começou a apresentar um erro persistente e de difícil diagnóstico em tempo de execução: `FirebaseError: Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?`.

O erro ocorria em serviços que interagiam com o Firestore, como o `BaseCurationService`, mesmo após múltiplas tentativas de refatoração do código do serviço (alternando entre injeção de dependência via `InjectionToken`s e importação modular direta) e da correção da configuração de inicialização do Firebase no ambiente de SSR (removendo a inicialização duplicada em `app.config.server.ts`).

Isso indicava que a causa raiz não estava na lógica da aplicação, mas sim no ambiente e na estrutura das suas dependências.

## Decisão

Após uma investigação aprofundada na árvore de dependências do projeto com o comando `npm ls firebase`, a causa raiz foi identificada: **a existência de múltiplas versões conflitantes do pacote `firebase` instaladas na pasta `node_modules`**.

A biblioteca `@angular/fire` dependia de uma versão mais recente do `firebase` (`11.9.1`), enquanto o `package.json` do projeto especificava uma versão mais antiga como dependência direta (`10.14.1`). Essa duplicidade causava a inicialização de duas instâncias do SDK, resultando no erro de incompatibilidade de tipos.

A seguinte estratégia foi adotada para resolver o conflito de forma definitiva:

1.  **Alinhamento da Dependência Direta:** A versão do `firebase` na seção `"dependencies"` do `package.json` foi atualizada para ser compatível com a versão exigida pelo `@angular/fire`.

2.  **Uso de `overrides`:** Uma seção `"overrides"` foi adicionada ao `package.json` para forçar o `npm` a resolver **todas** as solicitações pelo pacote `firebase` (tanto as diretas quanto as transitivas) para uma única e consistente versão.

    **Exemplo da alteração no `package.json`:**
    ```json
    {
      "dependencies": {
        "firebase": "^11.9.1" 
      },
      "overrides": {
        "firebase": "^11.9.1"
      }
    }
    ```

3.  **Reinstalação Limpa:** A pasta `node_modules` e o arquivo `package-lock.json` foram apagados para remover a árvore de dependências antiga, e o comando `npm install` foi executado para reconstruí-la seguindo as novas regras.

## Consequências

**Positivas:**
* **Resolução Definitiva do Erro:** O erro `FirebaseError: Type does not match the expected instance` foi completamente eliminado da aplicação.
* **Estabilidade das Dependências:** A árvore de dependências do projeto agora é estável e previsível, garantindo que apenas uma instância do SDK do Firebase seja carregada, o que previne uma classe inteira de erros de tempo de execução.
* **Melhora na Manutenibilidade:** O projeto está mais robusto e menos suscetível a problemas de dependências transitivas no futuro.

**Negativas:**
* **Dependência da Versão do NPM:** A funcionalidade `overrides` requer a versão 8.3.0 ou superior do `npm`. Isso deve ser considerado se algum membro da equipe utilizar uma versão mais antiga.
* **Gerenciamento de Versões:** Futuras atualizações do `@angular/fire` exigirão uma verificação e possível atualização manual das versões nas seções `dependencies` e `overrides` do `package.json` para manter o alinhamento.

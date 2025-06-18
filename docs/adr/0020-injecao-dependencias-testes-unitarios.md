## **ADR-0020: Estratégia Avançada de Testes Unitários para Serviços com Dependências Externas em Ambiente Zoneless**

**Data:** 18 de Junho de 2025

**Status:** Aprovado

#### **Contexto**

Durante o desenvolvimento da Sprint 5, ao tentar criar testes unitários para o `AuthService`, encontramos um ciclo de erros persistentes e de difícil diagnóstico que impediam a execução bem-sucedida dos testes, mesmo quando 34 outros testes no mesmo projeto passavam. O projeto utiliza **Angular 20** com SSR, a arquitetura *Zoneless*, e o Firebase como BaaS.

O problema se manifestava principalmente através de dois erros cíclicos:
1.  `TypeError: Cannot read properties of undefined (reading 'subscribe')` dentro do `_ChangeDetectionSchedulerImpl` do Angular.
2.  `Error: NG0908: In this configuration Angular requires Zone.js`.

Esses erros indicavam um conflito profundo na inicialização do ambiente de teste do Angular (`TestBed`), especificamente relacionado à forma como a detecção de alterações *zoneless* interage com as dependências do `AuthService`, notavelmente as funções modulares do `@angular/fire`.

#### **Problema Detalhado**

Após uma longa e exaustiva investigação, a causa raiz foi identificada como uma "condição de corrida" durante a inicialização do `TestBed`.

1.  O `AuthService` utilizava funções modulares importadas diretamente de pacotes do Firebase, como `authState`, `signInWithPopup`, e `doc`.
2.  A função `authState`, em particular, é chamada imediatamente na inicialização das propriedades da classe `AuthService`.
3.  Nos testes, o `TestBed` precisa configurar um ambiente *zoneless* através de `provideZonelessChangeDetection()`. Este provedor, por sua vez, depende do serviço `ApplicationRef` para funcionar.
4.  A função `authState` real do Firebase parece ter dependências internas do ambiente Angular que são inicializadas antes que o `TestBed` consiga substituir o `ApplicationRef` real pelo nosso *mock* de teste.
5.  Isso resultava no `ChangeDetectionScheduler` sendo criado e tentando acessar `ApplicationRef.isStable.subscribe()`, mas o `ApplicationRef` naquele momento ainda era `undefined`, causando o erro. Tentar "enganar" a função com um `Auth` mock ou espionar o módulo com `spyOn` falhava devido à imutabilidade dos módulos ES.

Em resumo, a chamada direta a funções externas com dependências implícitas do framework, dentro de um serviço, tornou o teste de unidade convencional com o `TestBed` impraticável e instável.

#### **Decisão**

Para resolver este problema de forma definitiva e estabelecer um padrão robusto para o futuro, decidimos adotar a seguinte estratégia em duas frentes:

1.  **Refatoração para Injeção de Dependência Explícita:** O `AuthService` foi refatorado para não depender mais de funções importadas estaticamente. Em vez disso, todas as funções modulares do Firebase (`authState`, `doc`, `getDoc`, `setDoc`, `signInWithPopup`, `serverTimestamp`) foram encapsuladas em `InjectionToken`s do Angular. O serviço agora injeta essas funções em vez de importá-las diretamente, quebrando o acoplamento problemático.

2.  **Teste Unitário com Injetor Manual:** Dado o conflito persistente com o `TestBed.configureTestingModule`, o arquivo de teste para o `AuthService` foi reescrito para abandonar o `TestBed` e usar uma abordagem de injeção manual com `Injector.create()`. Este método nos dá controle total sobre a criação do serviço e suas dependências, contornando completamente o ciclo de vida problemático do `TestBed` e seu `ChangeDetectionScheduler`.

#### **Consequências**

**Positivas:**
* **Testes Estáveis:** Os testes do `AuthService` agora são 100% estáveis e não dependem mais de peculiaridades do ambiente de inicialização do `TestBed`.
* **Código Mais Testável:** O `AuthService` tornou-se uma classe mais desacoplada e alinhada com os princípios de injeção de dependência. Sua testabilidade aumentou drasticamente.
* **Padrão Replicável:** Temos agora um padrão claro e documentado para testar outros serviços complexos que possam ter dependências externas semelhantes.

**Negativas:**
* **Aumento de Complexidade:** A necessidade de criar `InjectionToken`s para cada função externa aumenta a quantidade de código "boilerplate".
* **Refatoração Necessária:** Código legado ou serviços existentes que sigam o padrão antigo (importação direta) precisarão ser refatorados para se tornarem testáveis com esta abordagem.

#### **Orientações e Recomendações para Futuros Testes**

1.  **Prefira a Injeção de Dependência:** Sempre que um serviço precisar de uma função de uma biblioteca externa (especialmente de bibliotecas que interagem com o framework, como `@angular/fire`), **não a importe diretamente**. Envolva a função em um `InjectionToken` e injete-a.

  * **Exemplo Ruim (Difícil de Testar):**
      ```typescript
      import { someExternalFunction } from 'some-library';
      // ...
      export class MyService {
        doWork() {
          someExternalFunction();
        }
      }
      ```

  * **Exemplo Bom (Fácil de Testar):**
      ```typescript
      // my-service.tokens.ts
      export const SOME_EXTERNAL_FUNCTION = new InjectionToken<...>(..., { factory: () => someExternalFunction });

      // my-service.ts
      export class MyService {
        private aFuncaoExterna = inject(SOME_EXTERNAL_FUNCTION);
        doWork() {
          this.aFuncaoExterna();
        }
      }
      ```

2.  **Use o `TestBed` como Padrão:** Para a maioria dos testes de componentes e serviços simples, o `TestBed.configureTestingModule` continua sendo a abordagem padrão e preferida.

3.  **Use o Injetor Manual como "Plano B":** Se você encontrar um ciclo de erros de inicialização inexplicáveis (como o erro de `subscribe` ou `NG0908`) que persistem mesmo com mocks corretos, considere usar a abordagem do `Injector.create()` como uma alternativa robusta. Ela é especialmente útil para testes de serviços que não têm dependências do DOM.

4.  **Mantenha os Mocks Completos:** Ao criar mocks para objetos do Firebase como `DocumentSnapshot`, certifique-se de que eles sejam o mais completos possível para satisfazer o compilador TypeScript. Use `as unknown as Type` para contornar problemas de tipagem complexos, como os "type predicates".

Seguindo estas diretrizes, a equipe poderá criar testes mais resilientes e evitará perder tempo em problemas de configuração de ambiente complexos e frustrantes.

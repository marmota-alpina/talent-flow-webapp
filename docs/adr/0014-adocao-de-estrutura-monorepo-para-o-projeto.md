# ADR 014: Adoção de Estrutura Monorepo para o Projeto

**Status:** Abandonado em função da ADR [[0015-adocao-de-arquitetura-poly-repo]]

**Data:** 2025-06-14

## ~~Contexto~~

~~O projeto Talent Flow é um sistema composto por várias aplicações e serviços distintos, mas interligados:~~
1.  ~~**`web-app`:** A aplicação principal em Angular com SSR.~~
2.  ~~**`functions`:** O código-fonte das Cloud Functions (ex: `Publicador`, `Notificador`).~~
3.  ~~**`ia-api`:** A API em FastAPI responsável pela análise de IA.~~
4.  ~~**(Futuro) `shared-types`:** Uma biblioteca compartilhada para tipos e interfaces (ex: `UserProfile`, `Vacancy`) usada por múltiplos serviços.~~

~~A alternativa seria gerenciar cada uma dessas partes em seu próprio repositório Git (uma abordagem "poly-repo"). No entanto, isso introduziria desafios significativos em termos de gerenciamento de dependências, compartilhamento de código, coordenação de mudanças e configuração de pipelines de CI/CD.~~

## ~~Decisão~~

~~O projeto Talent Flow adotará uma estrutura de **monorepo**. Todo o código-fonte de todas as aplicações e bibliotecas relacionadas ao projeto residirá em um único repositório Git.~~

~~A estrutura de diretórios será organizada para refletir esta abordagem, com cada aplicação ou biblioteca residindo em sua própria pasta dentro de um diretório de nível superior, como `apps/` ou `packages/`.~~
# ADR 015: Adoção de Arquitetura Poly-Repo para Separação de Projetos

**Status:** Decidido

**Data:** 2025-06-14

**Nota:** Este ADR substitui e invalida a decisão do ADR [[0014-adocao-de-estrutura-monorepo-para-o-projeto]]

## Contexto

A decisão inicial (ADR-014) favorecia uma estrutura de monorepo para centralizar o código-fonte do Talent Flow. Após reavaliação, consideramos a natureza distinta das diferentes partes do sistema: a `web-app` (Angular), as `functions` (Node.js/TypeScript) e a `ia-api` (Python). Cada uma possui seu próprio ecossistema, dependências, ciclo de build e cadência de deploy.

Manter esses projetos tão diferentes em um único repositório introduziria uma complexidade de ferramental (ex: Nx, Turborepo) e poderia criar um acoplamento desnecessário, além de um repositório Git grande e com um histórico de commits misto. O objetivo agora é priorizar a autonomia das equipes e a simplicidade do ciclo de vida de cada aplicação individualmente.

## Decisão

O projeto Talent Flow adotará uma arquitetura **poly-repo**. Cada aplicação ou serviço principal será mantido em seu próprio repositório Git.

1.  **Separação dos Repositórios:** Serão criados, no mínimo, os seguintes repositórios:
    * `talent-flow-webapp`: Conterá a aplicação Angular com SSR.
    * `talent-flow-functions`: Conterá o código-fonte das Cloud Functions.
    * `talent-flow-ia-api`: Conterá o serviço FastAPI para análise de IA.

2.  **Estratégia de Compartilhamento de Código:**
    * Para compartilhar código entre os projetos TypeScript (`webapp` e `functions`), como interfaces e modelos, será criado um repositório dedicado: `talent-flow-shared-types`.
    * Este repositório será publicado como um **pacote NPM privado** (usando um registro como o do GitHub Packages ou NPM).
    * Os projetos `talent-flow-webapp` e `talent-flow-functions` irão consumir este pacote como uma dependência em seus respectivos `package.json`, garantindo a consistência dos tipos através de versionamento.

## Consequências

**Positivas:**
* **Autonomia Total de Equipe e Deploy:** Cada equipe pode gerenciar seu próprio fluxo de trabalho, dependências e pipeline de CI/CD sem interferir nas outras. A equipe de IA pode usar as ferramentas do Python, e a de frontend, as do Angular, sem conflitos.
* **Simplicidade por Repositório:** Cada repositório tem uma configuração de build e dependências limpa e focada, sem a necessidade de ferramentas complexas de gerenciamento de monorepo.
* **Controle de Acesso Granular:** É mais fácil conceder permissões de acesso específicas para cada parte do projeto.
* **Histórico de Commits Focado:** O histórico de cada repositório é linear e relevante apenas para aquela aplicação, facilitando a análise e o rastreamento de mudanças.
* **Repositórios Leves:** O processo de `git clone` é rápido, pois cada desenvolvedor clona apenas os repositórios nos quais precisa trabalhar.

**Negativas:**
* **Complexidade no Compartilhamento de Código:** A necessidade de publicar e gerenciar um pacote versionado para os tipos compartilhados adiciona uma camada de complexidade e overhead ao processo.
* **Coordenação de Mudanças:** Alterações que quebram a compatibilidade entre os serviços (ex: uma mudança na API que afeta o frontend) exigem uma coordenação mais cuidadosa entre as equipes e os repositórios.
* **Duplicação de Configuração:** Configurações de CI/CD, linting e outros padrões podem precisar ser replicadas e mantidas em cada um dos repositórios.
* **Visão Fragmentada do Sistema:** É mais difícil para um desenvolvedor ter uma visão holística e instantânea de todo o código do sistema, pois ele está distribuído em múltiplos locais.
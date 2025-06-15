# ADR 0009: Reafirmação do Uso de Server-Side Rendering (SSR)

**Status:** Decidido

**Data:** 2025-06-14

## Contexto

Esta ADR formaliza a reavaliação da necessidade de Server-Side Rendering (SSR) na arquitetura do Talent Flow. A decisão inicial, conforme o documento de projeto, foi adotar SSR para garantir a visibilidade pública das vagas. Com o andamento do planejamento, questionou-se se uma abordagem mais simples, como uma Single-Page Application (SPA) com Client-Side Rendering (CSR), seria suficiente.

A análise comparou as duas abordagens sob a ótica dos requisitos do projeto, principalmente a necessidade de que as páginas de vagas sejam otimizadas para motores de busca (SEO) para atrair candidatos organicamente.

## Decisão

**Mantemos e reafirmamos a decisão de utilizar Server-Side Rendering (SSR) com Angular Universal** para a aplicação Talent Flow. A aplicação será hospedada em um contêiner no Google Cloud Run para suportar a renderização no lado do servidor.

Esta decisão se baseia primariamente no fato de que o SEO não é um "nice-to-have", mas sim um requisito de negócio crítico para o sucesso da plataforma. A abordagem CSR/SPA apresenta um risco inaceitável para a indexação e o ranqueamento das vagas públicas, o que comprometeria diretamente a capacidade do sistema de atrair talentos.

## Consequências

**Positivas:**
* **Alinhamento com Objetivos de Negócio:** A arquitetura suporta diretamente o objetivo de atrair candidatos através de busca orgânica, garantindo a correta indexação das vagas.
* **Performance de Carregamento Superior:** Usuários e robôs de busca recebem um First Contentful Paint (FCP) mais rápido, melhorando a experiência do usuário e os sinais de SEO.
* **Experiência de Compartilhamento Robusta:** Links de vagas compartilhados em plataformas sociais gerarão pré-visualizações ricas e informativas.
* **Estrutura já Pré-configurada:** O projeto já foi iniciado com os arquivos e configurações necessários para SSR (`server.ts`, `main.server.ts`), confirmando a viabilidade da abordagem.

**Negativas:**
* **Manutenção da Complexidade:** A equipe deve continuar gerenciando a complexidade de uma aplicação universal, incluindo a configuração do build, o ambiente do servidor (Cloud Run) e a escrita de código compatível com ambas as plataformas (servidor e cliente).
* **Custo de Infraestrutura Mantido:** A necessidade de um serviço de computação como o Cloud Run é mantida, em oposição a uma hospedagem estática de custo potencialmente menor. Este custo é considerado um investimento necessário para atingir os objetivos do projeto.
# **ADR 0003: Adoção de Angular com SSR para o Frontend**

**Status:** Decidido

**Data:** 2025-06-14

## **Contexto**

O projeto Talent Flow necessita de uma aplicação frontend (webapp) que atenda a dois requisitos principais e distintos:

1. **Páginas Públicas:** A plataforma deve expor páginas de vagas abertas (`/vagas`, `/vagas/:id`) que sejam publicamente acessíveis, otimizadas para motores de busca (SEO) e que gerem pré-visualizações ricas quando compartilhadas em redes sociais.
2. **Área Logada:** Deve fornecer uma experiência de Single-Page Application (SPA) rica e interativa para usuários autenticados (candidatos, recrutadores e administradores).

Uma abordagem puramente de Client-Side Rendering (CSR) comprometeria seriamente o requisito de SEO, fundamental para a atração orgânica de candidatos.

## **Decisão**

Decidimos adotar o **Angular** como o framework para o desenvolvimento do `talent-flow-webapp`, com a funcionalidade de **Server-Side Rendering (SSR)** habilitada através do Angular Universal.

1. A aplicação será uma SPA, mas as rotas públicas serão renderizadas no lado do servidor na primeira carga, entregando HTML completo ao navegador.
2. Após a carga inicial, a aplicação se "hidrata" e passa a funcionar como uma SPA tradicional, proporcionando uma navegação fluida e rápida na área logada.
3. A aplicação será implantada em um ambiente que suporte a execução de um servidor Node.js, como o Google Cloud Run.

## **Consequências**

**Positivas:**

- **SEO Otimizado:** Garante que as páginas de vagas sejam perfeitamente indexáveis pelos motores de busca, atendendo a um requisito crítico de negócio.
- **Melhor Performance Percebida:** O tempo para a primeira pintura de conteúdo (First Contentful Paint - FCP) é significativamente mais rápido, melhorando a experiência do usuário e os sinais vitais da web.
- **Compartilhamento Social Eficaz:** Links de vagas compartilhados em plataformas como o LinkedIn gerarão pré-visualizações ricas com título, descrição e imagem.
- **Estrutura Robusta:** O Angular oferece uma arquitetura opinativa e escalável, ideal para um projeto com a complexidade planejada para o Talent Flow.

**Negativas:**

- **Maior Complexidade de Desenvolvimento:** A equipe precisa estar ciente do código que roda no servidor versus no cliente (ex: acesso a objetos como `window` ou `document`).
- **Custo de Infraestrutura:** A necessidade de um ambiente de servidor (Cloud Run) é mais cara do que uma hospedagem estática (como o Firebase Hosting).
- **Configuração de Build:** O processo de build é mais complexo, pois precisa gerar pacotes tanto para o cliente quanto para o servidor.
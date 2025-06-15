# ADR 0004: Utilização da Suíte Google Firebase como Backend (BaaS)

**Status:** Decidido

**Data:** 2025-06-10

## Contexto

O projeto necessita de uma solução de backend para atender a várias necessidades: um banco de dados flexível para armazenar currículos e vagas, um sistema de autenticação de usuários seguro e a capacidade de executar lógica serverless para automações. O desenvolvimento precisa ser ágil para cumprir os prazos do MVP. Construir um backend tradicional do zero seria demorado e custoso.

## Decisão

Adotaremos a **Suíte Google Firebase** como a principal solução de Backend as a Service (BaaS).
* **Firestore:** Será o banco de dados NoSQL para armazenar todas as coleções (`users`, `resumes`, `vacancies`, etc.).
* **Firebase Authentication:** Será utilizado para gerenciar o cadastro e login de usuários.
* **Cloud Functions:** Serão usadas para acionar lógicas serverless baseadas em gatilhos do Firestore (ex: quando um currículo é criado).

## Consequências

**Positivas:**
* **Desenvolvimento Acelerado:** Reduz drasticamente o tempo de desenvolvimento do backend, pois oferece soluções prontas e integradas.
* **Escalabilidade:** A infraestrutura do Firebase é gerenciada pelo Google e escala automaticamente com a demanda.
* **Custo-Benefício:** O modelo de preços "pay-as-you-go" é ideal para um MVP, com um generoso nível gratuito.
* **Ecossistema Integrado:** Integra-se nativamente com outras ferramentas do Google Cloud, como Cloud Run e Pub/Sub.

**Negativas:**
* **Vendor Lock-in:** O projeto se torna altamente dependente do ecossistema do Google Cloud.
* **Flexibilidade Limitada:** Consultas complexas no Firestore podem ser mais difíceis de construir em comparação com um banco de dados SQL. A lógica de negócio fica mais distribuída (parte no frontend, parte em Cloud Functions).
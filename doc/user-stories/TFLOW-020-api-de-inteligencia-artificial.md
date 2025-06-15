# Estória de Usuário: API de Inteligência Artificial com Machine Learning

**ID da Estória:** TFLOW-020
**Feature:** Backend de Análise de IA
**Pontos de Estória (Estimativa):** 21 (Estimativa aumentada devido à complexidade de ML)

- **Como um:** Desenvolvedor(a) de Backend/IA.
- **Eu quero:** Construir, treinar e implantar um serviço que utiliza um modelo de Machine Learning para classificar a compatibilidade entre currículos e vagas, e usa IA para analisar textos descritivos.
- **Para que:** A plataforma possa oferecer diferenciais de matching automático de alta precisão e extração de insights dos perfis dos candidatos.

### Critérios de Aceitação (AC)

**AC1: Pipeline de Treinamento do Modelo**
-   Deve ser criado um script (`train.py`) que:
    1.  Lê os dados rotulados da coleção `trainingAnnotations` do Firestore.
    2.  Busca os documentos completos dos currículos e vagas correspondentes.
    3.  Realiza a engenharia de features, transformando os dados JSON em vetores numéricos que o modelo possa entender.
    4.  Treina um modelo de classificação (ex: `LightGBM`, `XGBoost` ou outro).
    5.  Salva o artefato do modelo treinado em um bucket do Google Cloud Storage ou o registra no Vertex AI Model Registry.
-   Este processo de treinamento pode ser executado manualmente no início, com planos de automação futura.

**AC2: Análise de Texto com IA Generativa**
-   A API deve ter uma função que recebe os campos de texto de um currículo (ex: `problemSolved`, `howTechWasUsed`).
-   Esta função deve se conectar a uma API de um modelo de linguagem grande (LLM), como a da família Gemini.
-   Ela enviará um prompt como: "Extraia as 5 principais habilidades, ferramentas e conceitos técnicos do texto a seguir: [texto do currículo]".
-   O resultado (uma lista de tags) deve ser salvo no campo `aiClassification.tags` do documento do currículo.

**AC3: Endpoint de Inferência para Matching**
-   A API FastAPI deve carregar o modelo treinado (do AC1) ao ser inicializada.
-   Deve haver um endpoint (`POST /predict-match`) que recebe os dados de um currículo e de uma vaga.
-   O endpoint executará a mesma engenharia de features do pipeline de treinamento nos dados recebidos e usará o modelo para prever um score de compatibilidade (uma probabilidade entre 0.0 e 1.0).

**AC4: Consumo de Mensagens e Orquestração do Fluxo**
-   A API continuará consumindo mensagens do Pub/Sub quando um currículo for publicado.
-   **A `talent-flow-ia-api` está interessada apenas em currículos com o status 'published'.**
-   **Se um currículo muda de status e retorna para 'published', ele será analisado novamente para atualizar os resultados da análise.**
-   Ao receber uma mensagem, a API deve orquestrar o seguinte fluxo:
    1.  Executar a análise de texto descritivo (AC2) e atualizar o campo `aiClassification.tags`.
    2.  Atualizar o status em `aiClassification.status` para `"processing"`.
    3.  Iniciar o processo de matching: buscar todas as vagas abertas, chamar o endpoint de inferência (AC3) para cada uma e salvar os resultados (scores) nas sub-coleções `matchedCandidates` (na vaga) e `recommendedVacancies` (no currículo).
    4.  Ao final, atualizar o status em `aiClassification.status` para `"completed"`.

**AC5: Repositório e Deploy**
-   O repositório (`talent-flow-ia-api`) deve conter a API FastAPI, o script de treinamento e um `Dockerfile`.
-   A aplicação Dockerizada deve ser implantada com sucesso no Google Cloud Run.
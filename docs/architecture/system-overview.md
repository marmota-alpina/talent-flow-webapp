# **Visão Geral da Arquitetura do Sistema Talent Flow**

**Data:** 14 de junho de 2025

## **1. Introdução**

Este documento fornece uma visão de alto nível da arquitetura do ecossistema Talent Flow. O objetivo é ilustrar os principais componentes de software, suas responsabilidades e como eles interagem para entregar as funcionalidades da plataforma. A arquitetura é baseada em um modelo **Poly-repo** e **Backend as a Service (BaaS)**, priorizando o desacoplamento, a escalabilidade e a agilidade no desenvolvimento.

## **2. Componentes Principais**

O sistema é composto pelos seguintes serviços e tecnologias:

1. **`talent-flow-webapp` (Frontend)**
    
    - **Tecnologia:** Angular 20 com SSR (Server-Side Rendering).
    - **Responsabilidade:** É a interface principal para todos os usuários (candidatos, recrutadores, administradores). Lida com a exibição de dados, captura de informações através de formulários e orquestra a lógica de negócio do lado do cliente. Interage diretamente com o Firebase.
2. **`Firebase` (Backend as a Service)**
    
    - **Tecnologias:** Firestore, Firebase Authentication.
    - **Responsabilidade:** Serve como o backend central.
        - **Firestore:** Banco de dados NoSQL que armazena todas as coleções de dados, como `users`, `resumes`, e `vacancies`. A segurança é garantida por Regras de Segurança.
        - **Authentication:** Gerencia a identidade dos usuários, utilizando Login com Google como método principal.
3. **`talent-flow-functions` (Orquestrador/Cola)**
    
    - **Tecnologia:** Cloud Functions (Node.js/TypeScript).
    - **Responsabilidade:** Atua como a "cola" do sistema. São funções serverless acionadas por eventos do Firestore (triggers). Sua principal função é publicar mensagens em tópicos do Pub/Sub quando eventos de negócio importantes ocorrem.
4. **`Google Cloud Pub/Sub` (Mensageria)**
    
    - **Responsabilidade:** Fila de mensagens que desacopla os processos síncronos (como salvar um currículo) dos processos assíncronos e demorados (como a análise de IA), garantindo resiliência e escalabilidade.
5. **`talent-flow-ia-api` (Serviço de IA)**
    
    - **Tecnologia:** Python/FastAPI.
    - **Responsabilidade:** Serviço especializado que consome mensagens do Pub/Sub. É responsável por executar as tarefas de Machine Learning, como a análise de texto de currículos e o cálculo de compatibilidade com vagas. Após o processamento, atualiza os resultados diretamente no Firestore.

## **3. Diagrama e Fluxo de Dados Principal (Análise de Currículo)**

O diagrama abaixo ilustra o fluxo de dados quando um candidato publica seu currículo:

Snippet de código

```
graph TD
    subgraph "Navegador do Usuário"
        WebApp["talent-flow-webapp (Angular)"]
    end

    subgraph "Google Cloud Platform"
        Firestore["Firestore (Banco de Dados)"]
        Functions["talent-flow-functions"]
        PubSub["Cloud Pub/Sub (Tópico)"]
        IA_API["talent-flow-ia-api (FastAPI no Cloud Run)"]
    end

    WebApp -- "1. Salva/Atualiza Currículo (status: 'published')" --> Firestore
    Firestore -- "2. Aciona Gatilho onUpdate" --> Functions
    Functions -- "3. Publica dados do currículo" --> PubSub
    PubSub -- "4. Entrega Mensagem" --> IA_API
    IA_API -- "5. Processa currículo e vagas" --> Firestore
    Firestore -- "6. Exibe resultados (scores, tags)" --> WebApp
```

**Etapas do Fluxo:**

1. O candidato finaliza e publica seu currículo na **`webapp`**, que salva o documento na coleção `resumes` do **`Firestore`**.
2. A escrita no `Firestore` aciona uma **`Cloud Function`** (do repositório `talent-flow-functions`).
3. A função publica os dados do currículo em um tópico do **`Pub/Sub`**.
4. O serviço **`talent-flow-ia-api`** consome a mensagem do tópico.
5. A API de IA realiza a análise de texto e o matching com as vagas abertas, salvando os resultados (tags e scores de compatibilidade) de volta no **`Firestore`**.
6. A **`webapp`** lê os dados processados do `Firestore` e exibe as vagas recomendadas para o candidato e os candidatos compatíveis para o recrutador.
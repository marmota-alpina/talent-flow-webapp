# ADR 0005: Implementação de Fila de Mensagens com Google Cloud Pub/Sub

**Status:** Decidido

**Data:** 2025-06-10

## Contexto

A análise de currículos e o matching com vagas são processos que podem ser computacionalmente intensos e demorados. A aplicação principal (frontend) não deve ficar bloqueada esperando a conclusão dessas tarefas. Além disso, precisamos garantir que nenhuma solicitação de análise seja perdida, mesmo que a API de IA esteja temporariamente sobrecarregada ou offline. Uma comunicação síncrona (requisição HTTP direta) entre a aplicação e a API de IA seria frágil e criaria um forte acoplamento entre os serviços.

## Decisão

Utilizaremos o **Google Cloud Pub/Sub** como um serviço de fila de mensagens para desacoplar a aplicação principal da API de análise de IA.
1.  Quando um currículo é criado/atualizado, uma Cloud Function (`Publicador`) é acionada e publica uma mensagem com os dados do perfil em um tópico do Pub/Sub.
2.  A API FastAPI (hospedada no Cloud Run) atua como um *subscriber*, consumindo as mensagens desse tópico para processá-las em seu próprio ritmo.

## Consequências

**Positivas:**
* **Desacoplamento e Resiliência:** A aplicação principal e a API de IA podem ser desenvolvidas, implantadas e escaladas de forma independente. Uma falha na API não afeta a capacidade do usuário de cadastrar seu currículo.
* **Confiabilidade:** O Pub/Sub garante a entrega das mensagens, o que significa que nenhuma análise de currículo será perdida.
* **Melhora na Experiência do Usuário:** O usuário recebe uma resposta imediata após salvar seu currículo, pois a tarefa pesada é executada de forma assíncrona.
* **Escalabilidade:** Permite que múltiplos workers da API de IA consumam mensagens em paralelo, processando um grande volume de solicitações.

**Negativas:**
* **Complexidade Adicional:** Introduz mais um componente na arquitetura que precisa ser configurado e monitorado (tópicos, assinaturas, permissões).
* **Latência:** A comunicação assíncrona introduz uma latência inerente entre o cadastro do currículo e a conclusão da sua análise pela IA.
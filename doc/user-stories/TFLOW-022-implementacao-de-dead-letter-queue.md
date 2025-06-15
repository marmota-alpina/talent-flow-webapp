### **Estória de Usuário: Implementação de Dead-Letter Queue (DLQ)**

**ID da Estória:** TFLOW-022

**Feature:** Backend de Orquestração / Resiliência

**Pontos de Estória (Estimativa):** 5

- **Como um(a):** Arquiteto(a) ou Desenvolvedor(a) de Backend.
- **Eu quero:** Configurar uma Dead-Letter Queue (DLQ) para a nossa fila de processamento de currículos no Google Cloud Pub/Sub.
- **Para que:** Em caso de falhas inesperadas e repetidas na API de IA, nenhuma solicitação de análise de currículo seja perdida permanentemente, garantindo a integridade dos dados e permitindo a análise posterior da falha.

#### **Critérios de Aceitação (AC)**

**AC1: Criação do Tópico da Dead-Letter Queue**

- Um novo tópico no Google Cloud Pub/Sub deve ser criado para servir exclusivamente como a Dead-Letter Queue.
- Nome sugerido para o tópico: `resume-processing-dlq`.

**AC2: Configuração da Assinatura Principal**

- A assinatura (subscription) do Pub/Sub que é consumida pela `talent-flow-ia-api` deve ser reconfigurada para utilizar a DLQ.
- Uma política de "dead-lettering" deve ser habilitada nesta assinatura, especificando:
    1. O tópico da DLQ a ser usado (criado no AC1).
    2. O número máximo de tentativas de entrega antes de uma mensagem ser encaminhada para a DLQ (ex: **5 tentativas**).

**AC3: Monitoramento e Alerta**

- Uma política de alertas deve ser configurada no Google Cloud Monitoring.
- O alerta deve monitorar a métrica "Número de mensagens não reconhecidas" (`subscription/num_undelivered_messages`) da **assinatura da DLQ**.
- Se o número de mensagens for maior que zero por um período de tempo definido (ex: 5 minutos), uma notificação deve ser enviada para o canal de engenharia (ex: e-mail ou Slack), informando sobre a falha no processamento.

**AC4: Documentação do Processo**

- A documentação do backend (ex: no `README.md` do repositório `talent-flow-ia-api`) deve ser atualizada com uma seção sobre o tratamento de falhas.
- Esta seção deve explicar o que é a DLQ, como ela funciona neste projeto, e fornecer um guia básico para a equipe sobre como inspecionar as mensagens na fila "morta" e como reprocessá-las, se necessário.
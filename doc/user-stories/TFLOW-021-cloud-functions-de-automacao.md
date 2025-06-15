### **Estória de Usuário: Cloud Functions de Automação**

ID da Estória: TFLOW-021

Feature: Backend de Orquestração

Pontos de Estória (Estimativa): 5 (Estimativa reduzida devido à simplificação)

- **Como um:** Desenvolvedor(a) de Backend.
- **Eu quero:** Criar e implantar as Cloud Functions que servem como a "cola" do sistema.
- **Para que:** O sistema seja resiliente, desacoplado e que processos demorados não afetem a experiência do usuário.

#### **Critérios de Aceitação (AC)**

1. **Repositório e Setup:** Deve ser criado um novo repositório Git (`talent-flow-functions`) e um projeto Firebase Functions com TypeScript.
2. **Função "Publicador" (AC2):**
    - Deve ser criada uma Cloud Function acionada pelo evento `onUpdate` da coleção `resumes` no Firestore.
    - A função deve verificar se a atualização representa uma publicação. A lógica para publicar a mensagem no Pub/Sub só deve ser executada se a condição `before.data().status !== 'published' && after.data().status === 'published'` for verdadeira.
    - Ao detectar essa transição, a função deve pegar os dados completos do currículo (`after.data()`) e publicá-los em um tópico do Pub/Sub para serem consumidos pela API de IA.
3. **Contratos de Dados:** O formato da mensagem do Pub/Sub deve ser claramente definido e documentado no repositório para servir como contrato para a API de IA.
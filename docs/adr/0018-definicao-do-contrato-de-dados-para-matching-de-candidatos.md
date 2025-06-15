### **ADR 0018: Definição do Contrato de Dados para Matching de Candidatos**

**Status:** Aceito
**Data:** 2025-06-14

**Contexto:**

A arquitetura do Talent Flow desacopla o processamento de IA (`talent-flow-ia-api`, TFLOW-020) da aplicação principal (`talent-flow-webapp`). A API de IA é responsável por calcular a compatibilidade entre candidatos e vagas e, em seguida, persistir esses resultados no Firestore. O frontend, por sua vez, precisa ler esses resultados para exibi-los em diferentes telas, como a lista de candidatos para uma vaga (`TFLOW-016`) e o painel do candidato (`TFLOW-013`).

Sem um schema de dados formalmente definido para os resultados deste matching, as equipes de backend e frontend podem desenvolver com base em premissas diferentes sobre os nomes dos campos, tipos de dados e estrutura, levando a erros de integração, retrabalho e inconsistências na exibição dos dados.

**Decisão:**

Fica estabelecido e formalizado o seguinte schema para as sub-coleções que armazenam os resultados do matching de compatibilidade no Firestore. Este schema servirá como o "contrato de dados" oficial entre os serviços.

**1. Schema para `vacancies/{vacancyId}/matchedCandidates/{resumeId}`**

Esta sub-coleção armazena a lista de candidatos que foram considerados compatíveis com uma vaga específica. O ID do documento é o ID do currículo (`resumeId`) para fácil acesso e para evitar duplicações.

JSON

```
{
  "candidateId": "string",
  "candidateName": "string",
  "candidatePhotoURL": "string",
  "score": "number",
  "processedAt": "timestamp"
}
```

- `candidateId`: O ID do usuário (Firebase Auth UID) do candidato.
- `candidateName`: O nome do candidato (para exibição rápida).
- `candidatePhotoURL`: A URL da foto de perfil do candidato.
- `score`: O score numérico de compatibilidade (ex: 0.95 para 95%).
- `processedAt`: O timestamp de quando o processamento foi realizado.

**2. Schema para `resumes/{resumeId}/recommendedVacancies/{vacancyId}`**

Esta sub-coleção armazena a lista de vagas que foram consideradas compatíveis com o perfil de um candidato específico. O ID do documento é o ID da vaga (`vacancyId`).

JSON

```
{
  "vacancyTitle": "string",
  "score": "number",
  "processedAt": "timestamp"
}
```

- `vacancyTitle`: O título da vaga (para exibição rápida no painel do candidato).
- `score`: O score numérico de compatibilidade.
- `processedAt`: O timestamp de quando o processamento foi realizado.

**Consequências:**

- **Positivas:**
    - **Clareza e Redução de Risco:** As equipes de frontend e backend têm uma fonte única da verdade sobre a estrutura dos dados, eliminando ambiguidades.
    - **Desenvolvimento Paralelo:** Permite que as equipes trabalhem em paralelo com a certeza de que a integração dos dados funcionará.
    - **Manutenção Simplificada:** Facilita a depuração e a evolução futura, pois o contrato de dados está explicitamente documentado.
- **Negativas:**
    - **Rigidez:** Qualquer alteração neste schema agora exigirá uma atualização formal neste ADR e uma comunicação entre as equipes, mas isso é visto como um controle benéfico.
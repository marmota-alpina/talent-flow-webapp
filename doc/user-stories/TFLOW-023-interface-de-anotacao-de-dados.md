# Estória de Usuário: Interface de Anotação de Dados para Treinamento de IA

**ID da Estória:** TFLOW-023
**Feature:** Backend de Análise de IA
**Pontos de Estória (Estimativa):** 8

- **Como um:** Recrutador ou Administrador.
- **Eu quero:** Acessar uma interface simples onde o sistema me apresenta um par "candidato-vaga" e eu posso classificá-lo rapidamente como "Compatível" ou "Não Compatível".
- **Para que:** Eu possa gerar um conjunto de dados rotulados (um "gabarito") que será usado para treinar e validar o modelo de machine learning, melhorando a precisão do matching automático.

### Critérios de Aceitação (AC)

1.  **Nova Rota e Acesso:** Deve ser criada uma nova rota protegida (`/admin/ia-training`) acessível apenas a usuários com as roles `recruiter` ou `admin`.
2.  **Interface de Anotação:**
    -   A página deve carregar um par aleatório de um candidato (resumo do currículo) e uma vaga que ainda não foram rotulados.
    -   Deve exibir as informações mais relevantes para a tomada de decisão:
        -   **Candidato:** Nível, Área, Tecnologias principais.
        -   **Vaga:** Nível, Área, Tecnologias exigidas.
    -   Dois botões claros devem estar visíveis: **[ 👍 Compatível ]** e **[ 👎 Não Compatível ]**.
3.  **Persistência dos Rótulos:**
    -   Ao clicar em um dos botões, um novo documento deve ser salvo em uma nova coleção no Firestore, chamada `trainingAnnotations`.
    -   O documento deve conter no mínimo: `userId`, `vacancyId` e o rótulo (`label: "compatible"` ou `label: "incompatible"`), além de um `timestamp`.
4.  **Fluxo Contínuo:** Após a classificação, a tela deve carregar automaticamente o próximo par candidato-vaga para ser avaliado, tornando o processo rápido e contínuo.
### **Estória de Usuário: Painel de Controle do Candidato**

**ID da Estória:** TFLOW-013
**Feature:** Experiência do Candidato
**Pontos de Estória (Estimativa):** 5

- **Como um:** Candidato que já preencheu e salvou seu currículo.
- **Eu quero:** Acessar uma página de painel de controle ("dashboard") que mostre o status do meu perfil e me permita publicá-lo.
- **Para que:** Eu possa acompanhar o progresso, me engajar com as vagas e decidir quando meu perfil está pronto para ser analisado.

#### **Critérios de Aceitação (AC)**

1.  **Rota e Acesso:** Deve ser criada uma rota protegida `/meu-painel`.
2.  **Status do Perfil:** A página deve exibir o status da análise de IA, lendo o campo `aiClassification.status` do seu documento no Firestore (ex: "Análise Pendente", "Perfil Analisado com Sucesso").
3.  **Resumo do Perfil:** Um card deve exibir um resumo do perfil do candidato.
4.  **Vagas Recomendadas:** A página deve listar as vagas com alta compatibilidade, se houver.
5.  **Ações Rápidas:** A página deve conter um link claro para "Editar meu Currículo".
6.  **Ação de Publicação (AC6):**
    -   A página deve verificar o campo `status` do documento do currículo.
    -   Se `status` for `"draft"`, um botão proeminente com o texto "Publicar e buscar oportunidades" deve ser exibido.
    -   Ao clicar neste botão, o `status` do documento do currículo na coleção `resumes` deve ser atualizado de `"draft"` para `"published"`. Uma notificação de sucesso deve ser exibida.
    -   Se `status` for `"published"`, o botão deve ser ocultado e um texto informativo como "Seu perfil está visível para os recrutadores" pode ser exibido.
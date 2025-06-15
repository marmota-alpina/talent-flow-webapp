### **Estória de Usuário: Construção do Formulário Dinâmico de Cadastro de Currículo**

**ID da Estória:** TFLOW-012

**Feature:** Perfil do Candidato

**Pontos de Estória (Estimativa):** 13

- **Como um:** Candidato logado no sistema Tallent Flow.
- **Eu quero:** Preencher meu currículo de forma guiada e dinâmica, com seções detalhadas sobre minhas experiências.
- **Para que:** Eu possa criar um perfil profissional completo que destaque minhas competências e seja analisado de forma inteligente pela plataforma.

### **Critérios de Aceitação (AC)**

1. **Estrutura de Wizard:** O formulário deve ser dividido em etapas claras (ex: Dados Pessoais, Formação Acadêmica, Idiomas, Experiências Profissionais) com uma barra de progresso indicando a etapa atual.
2. **Campos Dinâmicos:** As seções de "Formação", "Idiomas" e "Experiências Profissionais" devem permitir ao usuário adicionar múltiplos blocos de informação (ex: adicionar mais de um curso, mais de um idioma, etc.) usando botões como "Adicionar outra formação".
3. **Lógica Condicional:** O formulário deve conter lógica condicional, como um campo do tipo toggle para "Este é meu trabalho atual?" na seção de experiência, que, se marcado, oculta o campo de data de término.
4. **Consumo de Dados da Curadoria:** Todos os campos de seleção (`select`), como "Nível de Experiência", "Tecnologias", "Soft Skills", etc., devem ser populados dinamicamente com os dados das coleções de curadoria do Firestore (ex: `experienceLevels`, `technologies`, `softSkills`).
5. **Detalhamento das Experiências Profissionais:**
    - Dentro da seção de "Experiências Profissionais", o formulário deve permitir que o usuário adicione múltiplas "Atividades Realizadas" para cada cargo.
    - Para cada atividade, devem existir campos de texto específicos para que o candidato descreva:
        - O **problema que foi resolvido** (`problemSolved`).
        - Como a **tecnologia foi utilizada** no contexto da atividade (`howTechWasUsed`).
        - As **soft skills** que foram aplicadas (`appliedSoftSkills`).
    - Esta estrutura é fundamental para alimentar o modelo de IA e deve seguir o schema definido em `examples/resumes.md.md`.
6. **Responsividade:** O formulário deve ser totalmente funcional e visualmente agradável em dispositivos móveis e desktops, adaptando o layout dos campos conforme o tamanho da tela.
7. **Submissão e Persistência de Dados:**
    - Ao clicar em "Finalizar" na última etapa, o objeto completo do formulário deve ser validado.
    - Em caso de sucesso, o objeto JSON do currículo é salvo na coleção `resumes` do Firestore, com o documentId sendo o `userId` do usuário logado.
    - O documento salvo deve incluir um novo campo `status: "draft"` para indicar que ele foi salvo, mas ainda não foi publicado pelo usuário.
    - O sistema deve fornecer feedback visual de sucesso (ex: "Rascunho do currículo salvo com sucesso!").
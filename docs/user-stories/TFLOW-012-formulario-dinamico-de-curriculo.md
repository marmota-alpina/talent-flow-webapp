# Estória de Usuário: TFLOW-012 - Formulário Dinâmico de Currículo (Versão Estruturada)
Como um candidato,
Eu quero preencher e editar meu currículo através de um formulário dinâmico e estruturado,
Para que eu possa apresentar minhas qualificações, experiências e o impacto que gerei de forma clara e detalhada, aumentando minhas chances de ser selecionado para vagas compatíveis com meu perfil.

Critérios de Aceitação (AC)
AC1: Acesso e Estrutura da Página

Ao acessar a área "Meu Perfil" no painel do candidato, devo ser direcionado para a página de edição do meu currículo.

A página deve ser dividida em seções claras e expansíveis (acordeão) para:

Dados Pessoais e Contato

Resumo Profissional

Formação Acadêmica

Idiomas

Experiências Profissionais

O sistema deve carregar automaticamente os dados do meu currículo existente da coleção resumes no Firestore, usando meu userId. Se nenhum currículo existir, um novo formulário em branco deve ser apresentado.

AC2: Seção "Dados Pessoais e Contato"

Devo poder editar os campos: fullName, email, phone, linkedinUrl.

Devo poder selecionar minha mainArea (Área de Atuação Principal) e experienceLevel (Nível de Experiência) a partir de listas suspensas (dropdowns) populadas pelos dados da área de Curadoria.

AC3: Seção "Resumo Profissional"

Deve haver um campo de texto rico (wysiwyg) para que eu possa escrever meu parágrafo de resumo (summary).

AC4: Seção "Formação Acadêmica" (Dinâmica)

A seção deve exibir minhas formações acadêmicas existentes.

Devo poder adicionar uma nova formação através de um botão "Adicionar Formação". Isso deve exibir um novo conjunto de campos (level, courseName, institution, startDate, endDate).

Devo poder editar ou remover cada uma das minhas formações acadêmicas individualmente.

AC5: Seção "Idiomas" (Dinâmica)

A seção deve exibir meus idiomas existentes.

Devo poder adicionar um novo idioma através de um botão "Adicionar Idioma".

Para cada idioma, devo selecionar o language e a proficiency de listas suspensas (dropdowns) da Curadoria.

Devo poder editar ou remover cada idioma individualmente.

AC6: Seção "Experiências Profissionais" (Dinâmica e Aninhada)

A seção deve exibir minhas experiências profissionais como "cards" individuais e expansíveis.

Devo poder adicionar uma nova experiência através de um botão "Adicionar Experiência".

Cada card de experiência deve conter campos para: role, companyName, experienceType (dropdown), startDate, endDate (com uma opção "Emprego Atual" que torna o endDate nulo).

Devo poder editar ou remover uma experiência profissional inteira.

AC7: Sub-seção "Atividades Realizadas" (Aninhada e Dinâmica)

Dentro de cada card de "Experiência Profissional", deve haver uma sub-seção para "Atividades Realizadas".

Devo poder adicionar múltiplas atividades para cada experiência através de um botão "Adicionar Atividade".

Cada atividade deve ter seu próprio conjunto de campos:

activity (o que eu fiz).

problemSolved (o impacto que gerei).

technologies (um campo de multi-seleção ou tags, populado pela Curadoria).

appliedSoftSkills (um campo de multi-seleção ou tags, populado pela Curadoria).

Devo poder editar ou remover cada atividade individualmente dentro de uma experiência.

AC8: Salvamento e Feedback

Um botão "Salvar Currículo" deve estar sempre visível (ex: rodapé fixo ou no topo).

Ao salvar, o sistema deve construir o objeto Resume completo e fazer um upsert (criar ou atualizar) no documento resumes/{userId} no Firestore.

O campo updatedAt deve ser atualizado com a data e hora do salvamento.

Após salvar com sucesso, devo receber uma notificação visual (ex: um toast) confirmando que "Seu currículo foi salvo com sucesso!".

Exemplos de Interface e Interação
Formulário Principal
A página seria um grande formulário vertical. Cada seção principal (Dados Pessoais, Experiências, etc.) poderia ser um painel de um componente de acordeão, permitindo ao candidato focar em uma seção de cada vez.

Gerenciamento de Experiências Profissionais
Visualização:

Ação: O botão [Adicionar Experiência] no final da seção adicionaria um novo card de formulário em branco à lista.

Gerenciamento de Atividades (Dentro de uma Experiência)
Visualização: Dentro de um card de experiência, as atividades seriam listadas de forma semelhante.

Ação: O botão [Adicionar Atividade] dentro de um card de experiência abriria um modal ou um formulário inline para preencher os detalhes daquela atividade específica (activity, problemSolved, etc.).

Exemplo de Payload de Salvamento
Quando o candidato clica em "Salvar Currículo", o frontend deve montar e enviar para o Firestore um objeto JSON estruturado, idêntico ao exemplo de Resume na documentação técnica, garantindo que todos os dados dinâmicos das experiências e formações sejam coletados corretamente em seus respectivos arrays.

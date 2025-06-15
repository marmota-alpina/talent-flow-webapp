# **Estória de Usuário: Visualização de Candidatos por Vaga**

**ID da Estória:** TFLOW-016 

**Feature:** Experiência do Recrutador 

**Pontos de Estória (Estimativa):** 8

- **Como um:** Recrutador ou Administrador.
- **Eu quero:** Ao visualizar os detalhes de uma vaga que eu gerencio, ver uma lista classificada dos candidatos que o sistema de IA identificou como os mais compatíveis.
- **Para que:** Eu possa otimizar meu tempo, focar nos candidatos mais promissores e agilizar drasticamente o processo de triagem inicial.

#### **Critérios de Aceitação (AC)**

1. **Acesso à Lista:** Na página de gerenciamento de vagas (`/gerenciar-vagas`), cada vaga deve ter um link ou botão para "Ver Candidatos".
2. **Nova Rota e Tela:** Este link deve levar a uma nova rota, como `/gerenciar-vagas/:id/candidatos`, que exibe os detalhes da vaga no topo e uma lista de candidatos abaixo.
3. **Lista de Candidatos Compatíveis:** A tela deve buscar e exibir a lista de candidatos que a API de IA associou a esta vaga.
4. **Informações do Candidato:** Para cada candidato na lista, devem ser exibidos: Nome, Foto, o "Score" de compatibilidade (ex: 95%) e um link para visualizar o perfil/currículo completo daquele candidato.
5. **Ordenação:** A lista deve ser ordenada por padrão do maior para o menor score de compatibilidade.
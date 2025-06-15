### **Estória de Usuário: Pacote de Tipos Compartilhados**

**ID da Estória:** TFLOW-005

**Feature:** Infraestrutura e Qualidade de Código

**Pontos de Estória (Estimativa):** 8

- **Como um(a):** Desenvolvedor(a) da equipe Talent Flow.
- **Eu quero:** Que todas as interfaces e modelos de dados (TypeScript) compartilhados entre os diferentes projetos (`webapp`, `functions`) sejam gerenciados em um único pacote NPM privado e versionado.
- **Para que:** Possamos garantir a consistência dos contratos de dados, evitar duplicação de código e prevenir erros de integração, facilitando a manutenção e a colaboração entre as equipes.

#### **Critérios de Aceitação (AC)**

**AC1: Criação do Repositório e Estrutura do Pacote**

- Deve ser criado um novo repositório Git dedicado, chamado `talent-flow-shared-types`.
- A estrutura inicial do projeto deve ser configurada com um `package.json`, `tsconfig.json` e um diretório `src` para as definições de tipo.

**AC2: Definição das Interfaces de Dados**

- O pacote deve definir e exportar todas as interfaces de dados essenciais que são compartilhadas entre os serviços. Isso inclui, no mínimo:
    - `UserProfile` (da coleção `users`)
    - `Resume` (da coleção `resumes`)
    - `Vacancy` (da coleção `vacancies`)
    - Os tipos para os dados de `Curation` (ex: `Technology`, `SoftSkill`, `ProfessionalArea`).

**AC3: Configuração para Publicação**

- O `package.json` deve ser configurado com um nome de escopo privado (ex: `@talent-flow/shared-types`), a versão inicial (`0.0.1`) e as configurações necessárias para publicação.
- O projeto deve ser configurado para ser publicado em um registro de pacotes privado, como o GitHub Packages.

**AC4: Pipeline de Publicação Automática (CI/CD)**

- Um workflow de GitHub Actions deve ser criado no repositório `talent-flow-shared-types`.
- Este workflow deve ser acionado a cada merge na branch `main`.
- O pipeline deve automaticamente incrementar a versão do pacote (ex: `npm version patch`) e publicá-lo no registro privado.

**AC5: Integração com os Projetos Consumidores**

- Os projetos `talent-flow-webapp` e `talent-flow-functions` devem ser atualizados para incluir o pacote `@talent-flow/shared-types` como uma dependência em seus respectivos `package.json`.
- Qualquer definição de tipo local que tenha sido duplicada nesses projetos deve ser removida e substituída pela importação do novo pacote, garantindo uma única fonte da verdade.
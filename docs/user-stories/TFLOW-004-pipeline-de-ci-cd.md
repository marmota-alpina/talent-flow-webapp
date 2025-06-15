# **Estória de Usuário: Configuração do Pipeline de CI/CD**

**ID da Estória:** TFLOW-004

**Feature:** Infraestrutura de DevOps

**Pontos de Estória (Estimativa):** 13

- **Como um(a):** Desenvolvedor(a) da equipe Talent Flow.
- **Eu quero:** Que cada um dos repositórios do projeto (`webapp`, `functions`, `ia-api`) tenha um pipeline de Integração Contínua e Deploy Contínuo (CI/CD) automatizado.
- **Para que:** Possamos garantir a qualidade do código com testes e lint automáticos, acelerar a entrega de novas features e reduzir drasticamente os riscos de erros em deployments manuais.

#### **Critérios de Aceitação (AC)**

A ferramenta de automação a ser utilizada será o **GitHub Actions**.

**AC1: Padronização e Reutilização**

- Os pipelines devem seguir uma estrutura padronizada.
- Sempre que possível, devem ser criados workflows reutilizáveis (reusable workflows) ou actions compostas para tarefas comuns, como autenticação com o Google Cloud e setup de ambiente (Node.js, Python), a fim de evitar duplicação de código entre os repositórios.

**AC2: Pipeline para o Frontend (`talent-flow-webapp`)**

- O workflow deve ser acionado em todo `push` para a branch `main`.
- O pipeline deve executar os seguintes passos em ordem:
    1. **Setup:** Instalar as dependências do projeto com `npm ci`.
    2. **Qualidade:** Executar o linter (`npm run lint`) e os testes unitários (`npm run test`) para garantir a qualidade do código.
    3. **Build:** Compilar a aplicação Angular para produção, incluindo o servidor SSR.
    4. **Deploy:** Implantar a aplicação no ambiente de destino (Google Cloud Run para o servidor SSR).

**AC3: Pipeline para as Cloud Functions (`talent-flow-functions`)**

- O workflow deve ser acionado em todo `push` para a branch `main`.
- O pipeline deve executar os seguintes passos:
    1. **Setup:** Instalar as dependências do projeto com `npm ci`.
    2. **Qualidade:** Executar o linter e os testes unitários.
    3. **Build:** Transpilar o código TypeScript para JavaScript.
    4. **Deploy:** Implantar as funções atualizadas no Google Cloud Functions, utilizando a CLI do Firebase ou do gcloud.

**AC4: Pipeline para a API de IA (`talent-flow-ia-api`)**

- O workflow deve ser acionado em todo `push` para a branch `main`.
- O pipeline deve executar os seguintes passos:
    1. **Setup:** Instalar as dependências Python do projeto.
    2. **Qualidade:** Executar o linter (ex: `flake8`) e os testes unitários (ex: `pytest`).
    3. **Build do Contêiner:** Construir a imagem Docker da aplicação FastAPI a partir do `Dockerfile` do repositório.
    4. **Publicação do Contêiner:** Enviar a nova imagem para o Google Artifact Registry.
    5. **Deploy:** Implantar uma nova revisão no Google Cloud Run, utilizando a imagem recém-publicada do Artifact Registry.

**AC5: Feedback e Notificações**

- Todos os pipelines devem se integrar com o sistema de "Checks" do GitHub, mostrando o status de sucesso ou falha diretamente nos commits e pull requests.
- Em caso de falha em qualquer um dos pipelines na branch `main`, uma notificação deve ser enviada para um canal de comunicação da equipe (ex: Slack ou Discord) para que o problema seja resolvido rapidamente.
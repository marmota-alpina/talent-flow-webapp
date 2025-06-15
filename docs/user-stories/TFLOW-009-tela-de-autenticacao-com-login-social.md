### **Estória de Usuário: Tela de Autenticação com Login Social**

**ID da Estória:** TFLOW-009 **Feature:** Autenticação de Usuários **Pontos de Estória (Estimativa):** 5

- **Como um:** Visitante não autenticado da plataforma Talent Flow.
- **Eu quero:** Acessar uma página de login clara e simples onde eu possa me autenticar na plataforma usando minha conta do Google.
- **Para que:** Eu possa acessar de forma rápida e segura os recursos protegidos do Talent Flow, como meu painel de candidato ou a área de administração.

#### **Critérios de Aceitação (AC)**

**AC1: Acesso e Roteamento**

- Deve existir uma rota pública em `/login` que renderize o `LoginComponent`.
- Qualquer tentativa de acesso a uma rota protegida por um usuário não autenticado deve ser interceptada e redirecionada para a página `/login`.

**AC2: Design e Interface da Tela de Login**

- A tela deve ser minimalista, com o logo do "Talent Flow" em destaque.
- O único método de autenticação visível deve ser um botão proeminente com o texto **"Entrar com o Google"**.
- O design deve seguir rigorosamente o Sistema de Design definido na **ADR-010**.

**AC3: Fluxo de Autenticação (Caminho Feliz)**

- Ao clicar no botão "Entrar com o Google", o método `loginWithGoogle()` do `AuthService` deve ser invocado.
- O fluxo de autenticação do Firebase com o provedor Google deve ser iniciado.
- Após a autenticação bem-sucedida, o `AuthService` deve criar ou atualizar o perfil do usuário na coleção `users` do Firestore, conforme **ADR-011**.

**AC4: Tratamento de Cancelamento e Erros**

- Se o usuário fechar o popup do Google sem se autenticar, ele deve permanecer na tela de login.
- Se ocorrer um erro durante o processo, uma notificação de erro amigável (toast) deve ser exibida.

**AC5: Responsividade**

- O layout da tela de login deve ser totalmente responsivo.

**AC6: Lógica de Redirecionamento Pós-Login (NOVO)**

- O `AuthService`, após a autenticação bem-sucedida, deve verificar o perfil do usuário e redirecioná-lo conforme as seguintes regras:
    - **Se o usuário tentava acessar uma URL específica:** Após o login, ele deve ser redirecionado de volta para a URL que tentou acessar originalmente.
    - **Se não havia URL de destino (fluxo padrão):**
        - **Candidato (Primeiro Acesso):** Se o usuário tem a role `candidate` e ainda **não possui** um documento na coleção `resumes`, ele deve ser redirecionado para a página de criação de currículo (ex: `/meu-curriculo/editar`).
        - **Candidato (Retorno):** Se o usuário tem a role `candidate` e **já possui** um currículo, ele deve ser redirecionado para o seu painel de controle (`/meu-painel`).
        - **Recrutador ou Admin:** Se o usuário tem a role `recruiter` ou `admin`, ele deve ser redirecionado para o painel de gerenciamento principal (ex: `/gerenciar-vagas`).
# **Estória de Usuário: Implementação Detalhada de Regras de Segurança no Firestore**

**ID da Estória:** TFLOW-003

**Feature:** Segurança e Infraestrutura

**Pontos de Estória (Estimativa):** 5

- **Como um:** Tech Lead / Arquiteto do Talent Flow.
- **Eu quero:** Implementar regras de segurança granulares e explícitas no Cloud Firestore.
- **Para que:** A plataforma esteja protegida contra acesso não autorizado, garantindo que os usuários só possam ler e escrever os dados que lhes são permitidos, em conformidade com as roles definidas (`candidate`, `recruiter`, `admin`) e os fluxos de negócio.

### **Critérios de Aceitação (AC)**

As regras devem ser implementadas no arquivo `firestore.rules`. O pseudo-código abaixo serve como guia para a lógica a ser implementada.

#### **AC1: Regras para a Coleção `users`**

A coleção `users` armazena informações públicas e privadas dos perfis. A lógica deve proteger os dados e o controle de acesso.

- **Leitura (Read):**
    - Qualquer usuário autenticado (`request.auth != null`) pode ler o perfil de qualquer outro usuário.
    - **Justificativa:** Permite que recrutadores vejam perfis de candidatos e que candidatos vejam informações de recrutadores nas páginas de vagas. A responsabilidade de filtrar campos sensíveis (como e-mail) da UI é do frontend.
- **Escrita (Write - Create, Update, Delete):**
    - Um usuário só pode criar, atualizar ou deletar seu **próprio** documento (`request.auth.uid == userId`).
- **Regra de Imutabilidade:** Ao atualizar, um usuário **não pode** alterar sua própria role. A role atribuída no momento da criação é imutável.

#### **AC2: Regras para a Coleção `vacancies`**

A coleção `vacancies` contém as vagas criadas pelos recrutadores.

- **Leitura (Read):**
    - Qualquer pessoa, autenticada ou não, pode ler as vagas.
    - **Justificativa:** Necessário para o portal público de vagas (`TFLOW-015`), que deve ser acessível a todos e indexado por motores de busca.
- **Escrita (Write):**
    - Apenas usuários autenticados e com a role de **`recruiter`** ou **`admin`** podem criar, atualizar ou deletar vagas.
    - **Justificativa:** Garante que apenas recrutadores e administradores gerenciem as vagas da plataforma.

#### **AC3: Regras para as Coleções de Curadoria**

As coleções de curadoria (`technologies`, `softSkills`, etc.) armazenam os dados que alimentam os formulários. A regra de escrita deve ser replicada para cada uma dessas coleções.

- **Leitura (Read):**
    - Qualquer pessoa, autenticada ou não, pode ler os dados de qualquer coleção de curadoria.
    - **Justificativa:** Os dados são necessários para montar os formulários de perfil e de vagas para todos os usuários.
- **Escrita (Write):**
    - Apenas usuários autenticados e com a role de **`admin`** podem criar, atualizar ou deletar dados em **qualquer uma das coleções de curadoria**.
    - **Justificativa:** Protege os dados mestres da aplicação, garantindo que apenas administradores possam gerenciá-los.

---

#### **AC4: Regras para a Coleção `resumes` (NOVO)**

A coleção `resumes` armazena os dados sensíveis dos currículos dos candidatos. As regras devem garantir a privacidade do candidato e permitir o acesso legítimo por parte dos recrutadores.

- **Função Auxiliar:** Para simplificar as regras, pode-se usar uma função que verifica se o requisitante tem a role de `recruiter` ou `admin`.
    
    ```
    function isRecruiterOrAdmin() {
      return request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['recruiter', 'admin'];
    }
    ```
    
- **Leitura (Read):**
    - Um usuário pode ler **apenas o seu próprio currículo** (`request.auth.uid == resumeId`).
    - Usuários com a role de **`recruiter`** ou **`admin`** podem ler o currículo de qualquer candidato.
    - **Justificativa:** Esta regra protege a privacidade do candidato, ao mesmo tempo que viabiliza o processo de recrutamento, permitindo que recrutadores acessem os perfis para análise, conforme `TFLOW-016`.
- **Escrita (Write - Create, Update):**
    - Apenas o próprio candidato pode criar ou atualizar seu currículo (`request.auth.uid == resumeId`).
    - **Justificativa:** Garante que o candidato é a única fonte da verdade sobre suas informações profissionais. Recrutadores ou outros usuários não podem alterar os dados de um currículo.
- **Exclusão (Delete):**
    - Apenas o próprio candidato pode excluir seu currículo (`request.auth.uid == resumeId`).
- **Regras para Sub-coleções (`recommendedVacancies`):**
    - **Leitura (Read):** Apenas o candidato (`request.auth.uid == resumeId`) pode ler a lista de vagas recomendadas para ele.
    - **Escrita (Write):** Nenhum usuário pode escrever diretamente nesta sub-coleção a partir do cliente.
    - **Justificativa:** As recomendações são geradas e escritas pela API de IA (`TFLOW-020`) usando credenciais de administrador (servidor), que não são afetadas por estas regras de cliente. Bloquear a escrita do lado do cliente previne a manipulação de dados.
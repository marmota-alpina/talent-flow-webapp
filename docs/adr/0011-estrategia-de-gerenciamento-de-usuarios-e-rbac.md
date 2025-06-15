# ADR 011: Estratégia de Gerenciamento de Usuários e Controle de Acesso Baseado em Papéis (RBAC)

**Status:** Decidido

**Data:** 2025-06-14

## Contexto

A plataforma Talent Flow precisa suportar diferentes tipos de usuários (candidatos, recrutadores, administradores) com diferentes níveis de permissão. É necessário um sistema robusto que separe a identidade de um usuário (autenticação) de suas permissões (autorização) e que crie automaticamente um perfil básico quando um novo usuário se registra na plataforma.

## Decisão

1.  **Separação de Responsabilidades:** Utilizaremos **Firebase Authentication** exclusivamente para **autenticação** (verificar a identidade do usuário via Login com Google). Utilizaremos o **Cloud Firestore** para **autorização** e armazenamento de dados de perfil.

2.  **Coleção de Perfis:** Será criada uma coleção no Firestore chamada `users`. O ID de cada documento nesta coleção será o `uid` do usuário correspondente do Firebase Authentication.

3.  **Controle de Acesso Baseado em Papéis (RBAC):** Cada documento na coleção `users` conterá um campo `role` (ex: 'candidate', 'recruiter', 'admin'). Este campo determinará as permissões do usuário na aplicação.

4.  **Criação Automática de Perfil (Provisionamento):** Após um login bem-sucedido via `AuthService`, uma operação `setDoc(..., { merge: true })` será executada.
    * Se for o primeiro login do usuário, um novo documento será criado na coleção `users` com os dados básicos obtidos do provedor de autenticação e um `role` padrão de `'candidate'`.
    * Em logins subsequentes, esta operação atualizará os dados básicos (como nome ou foto) sem sobrescrever os dados gerenciados pela aplicação, como o `role`.

5.  **Aplicação das Permissões:** O `RoleGuard` existente no projeto lerá o campo `role` do documento do usuário no Firestore para permitir ou negar o acesso a rotas protegidas.

## Consequências

**Positivas:**
* **Arquitetura Limpa e Escalável:** A separação clara entre autenticação e autorização é uma prática recomendada que torna o sistema mais fácil de manter e escalar.
* **Flexibilidade:** A coleção `users` no Firestore pode ser facilmente estendida com quaisquer outros campos de perfil necessários no futuro, sem impactar o sistema de autenticação.
* **Segurança:** As permissões são gerenciadas no backend (Firestore) e podem ser protegidas com as Regras de Segurança do Firestore, prevenindo que usuários modifiquem seus próprios papéis.
* **Experiência de Usuário Fluida:** O provisionamento automático do perfil no primeiro login é transparente para o usuário.

**Negativas:**
* **Latência Mínima:** Requer uma leitura no Firestore após o login para obter o perfil completo do usuário, incluindo seu papel. Essa latência é mínima e pode ser mitigada com estratégias de cache.
* **Lógica no Cliente:** A lógica de provisionamento reside no `AuthService` (cliente), exigindo uma implementação cuidadosa para garantir que seja robusta e segura.
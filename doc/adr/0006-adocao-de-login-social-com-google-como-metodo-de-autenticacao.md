# ADR 0006: Adoção de Login Social com Google como Método de Autenticação

**Status:** Decidido

**Data:** 2025-06-14

## Contexto

Para o MVP do Talent Flow, é fundamental oferecer um processo de entrada (cadastro e login) que seja rápido, seguro e com o mínimo de atrito para o usuário. A criação de um sistema de autenticação proprietário com usuário e senha exige um esforço considerável de desenvolvimento para garantir a segurança (hashing de senhas, recuperação de conta, proteção contra ataques de força bruta) e adiciona um passo extra para o usuário, que precisa criar e memorizar novas credenciais.

As alternativas consideradas foram:
1.  **Sistema de E-mail/Senha Próprio:** Seguro se bem implementado, mas demorado para desenvolver e com maior atrito para o usuário.
2.  **Outros Provedores Sociais (LinkedIn, Microsoft):** Válidos, mas o Google é onipresente tanto no ambiente corporativo (Google Workspace) quanto pessoal (Gmail), cobrindo uma vasta maioria do nosso público-alvo (candidatos e RH).
3.  **Login "Passwordless" (Magic Links):** Moderno e seguro, mas pode ter um atrito de usabilidade relacionado à necessidade de checar o e-mail a cada login.

## Decisão

Decidimos implementar o **Login com Google** como o método de autenticação primário e inicial para o Talent Flow. A implementação será feita utilizando o `GoogleAuthProvider` da suíte **Firebase Authentication**, que já foi escolhida como nossa solução de BaaS (conforme ADR-0004). O fluxo de autenticação ocorrerá preferencialmente via popup (`signInWithPopup`) para manter o usuário no contexto da nossa aplicação, sendo orquestrado pelo `AuthService`.

## Consequências

**Positivas:**
* **Redução do Atrito para o Usuário:** A maioria dos usuários já possui uma conta Google ativa, permitindo o cadastro e login com um único clique, o que aumenta a taxa de conversão.
* **Aceleração do Desenvolvimento:** Alavancar o SDK do Firebase Authentication para o Login com Google é trivial e nos isenta de desenvolver e manter uma lógica complexa de gerenciamento de senhas e segurança.
* **Segurança Aprimorada:** A responsabilidade pela segurança das credenciais, verificação em duas etapas (MFA) e recuperação de conta é delegada à infraestrutura de classe mundial do Google.
* **Enriquecimento de Perfil:** No momento do cadastro, podemos obter de forma consentida dados básicos do usuário (nome, e-mail, foto), simplificando o preenchimento inicial do perfil.

**Negativas:**
* **Dependência de Terceiros:** A funcionalidade de login da nossa plataforma se torna dependente da disponibilidade dos serviços de autenticação do Google.
* **Exclusividade de Provedor (no MVP):** Usuários que não possuem ou não desejam usar uma conta Google não poderão acessar a plataforma nesta fase inicial. Esta é uma limitação aceitável para o MVP, mas a adição de outros provedores (especialmente LinkedIn e e-mail/senha) deve ser considerada em iterações futuras para ampliar o alcance.
# ADR 012: Incorporação da Foto de Perfil do Google na Interface

**Status:** Decidido

**Data:** 2025-06-14

## Contexto

A interface atual da plataforma Talent Flow, embora funcional, carece de elementos de personalização que criem uma conexão maior com o usuário. Uma experiência personalizada aumenta o engajamento e a percepção de valor do produto. O fluxo de autenticação com Google (ADR-0006) nos fornece acesso, com o consentimento do usuário, à sua foto de perfil pública.

## Decisão

1.  **Captura e Armazenamento:** A URL da foto de perfil (`photoURL`) fornecida pelo `GoogleAuthProvider` do Firebase será capturada no momento do login. Este dado será salvo no documento do usuário correspondente, na coleção `users` do Firestore.

2.  **Atualização do Modelo de Dados:** O modelo `UserProfile` será estendido para incluir um campo opcional `photoURL: string`.

3.  **Exibição na Interface:** A foto do perfil do usuário logado será exibida de forma proeminente no cabeçalho da aplicação (`MainLayoutComponent`). Caso um usuário não possua uma foto de perfil em sua conta Google, um ícone ou avatar padrão será exibido em seu lugar.

## Consequências

**Positivas:**
* **Experiência Personalizada:** A exibição da foto torna a interface imediatamente mais pessoal e acolhedora, melhorando a experiência do usuário.
* **Reconhecimento de Conta:** Ajuda o usuário a confirmar visualmente que está logado na conta correta, especialmente se ele gerencia múltiplas contas Google.
* **Baixo Custo de Implementação:** A informação já está disponível através do provedor de autenticação, exigindo apenas pequenas modificações na lógica de salvamento de perfil e no componente de layout para ser implementada.
* **Reforço da Identidade:** Cria uma associação visual mais forte entre o usuário e seu perfil dentro do Talent Flow.

**Negativas:**
* **Dependência da Qualidade da Foto:** A aplicação não tem controle sobre a qualidade ou adequação da foto de perfil; ela reflete o que o usuário configurou em sua conta Google.
* **Privacidade e Consentimento:** Embora o usuário dê o consentimento durante o fluxo OAuth do Google, a aplicação deve garantir que a foto seja usada apenas para fins de personalização da interface e não para outros propósitos sem consentimento explícito.
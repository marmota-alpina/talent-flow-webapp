# ADR 0017: Atribuição Manual de Papéis de Administrador

**Status:** Decidido
**Data:** 2025-06-14
## Contexto

O sistema necessita de uma forma de diferenciar usuários comuns de administradores. Os administradores terão permissões elevadas, como a capacidade de gerenciar os dados de curadoria (tecnologias, níveis de experiência, etc.), conforme descrito na estória `TFLOW-011`. Para o MVP, é necessário um método para atribuir o papel de "admin" a usuários específicos. Soluções mais complexas, como integração com sistemas de SSO ou a criação de uma interface de gerenciamento de usuários dentro da aplicação, foram consideradas fora do escopo inicial para acelerar a entrega.

## Decisão

A atribuição de papéis de administrador será realizada de forma manual, diretamente no banco de dados Firestore.

O processo consistirá em:

1. Um usuário com acesso de administrador ao projeto no Firebase Console navegará até a coleção `users`.
2. Localizará o documento do usuário que deve receber o privilégio.
3. Adicionará ou modificará o campo `role`, definindo seu valor para `"admin"`.

Esta abordagem será adotada como uma solução temporária para atender às necessidades do MVP.

## Consequências

### Positivas

- **Simplicidade e Rapidez:** A implementação é inexistente do ponto de vista de desenvolvimento de código, pois utiliza a interface de administração do próprio Firebase.
- **Custo Zero:** Não há custos de desenvolvimento ou de infraestrutura associados a esta solução.
- **Atende à Necessidade Imediata:** Resolve o problema de como conceder permissões de administrador para a fase inicial do projeto.

### Negativas

- **Processo Manual e Sujeito a Erros:** A modificação manual pode levar a erros, como a atribuição incorreta de permissões.
- **Falta de Escalabilidade:** O processo não é escalável. À medida que o número de usuários e administradores crescer, a gestão manual se tornará insustentável.
- **Risco de Segurança Concentrado:** A segurança depende do controle de acesso ao console do Firebase. Não há um log de auditoria dentro da aplicação para rastrear quem concedeu o acesso e quando.
- **Débito Técnico:** Esta solução introduz um débito técnico consciente, com a clareza de que precisará ser substituída no futuro.

### Plano de Mitigação e Evolução Futura

Esta decisão será reavaliada em versões futuras do produto. As alternativas a serem consideradas incluem:

- **Painel de Administração:** Desenvolver uma seção na própria aplicação para que administradores possam gerenciar outros usuários.
- **Integração SSO/IAM:** Utilizar um sistema de gerenciamento de identidade e acesso (IAM) ou Single Sign-On (SSO) para controlar os papéis de forma centralizada e segura.
- **Scripts de Automação:** Criar Cloud Functions ou scripts seguros para programaticamente atribuir papéis, com logs e validações adequadas.
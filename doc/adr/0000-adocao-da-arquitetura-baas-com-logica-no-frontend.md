# ADR 000: Adoção da Arquitetura BaaS com Lógica de Negócio no Frontend

**Status:** Decidido

**Data:** 2025-06-14

## Contexto

Durante a fase de planejamento, precisamos definir como a aplicação frontend (`talent-flow-webapp`) irá interagir com o backend para manipular dados. A abordagem tradicional seria criar uma API REST intermediária que serviria como um proxy entre o cliente e o banco de dados. No entanto, para muitas operações de CRUD, essa camada de API adiciona um tempo de desenvolvimento significativo sem agregar valor de negócio substancial, simplesmente repassando os dados.

O objetivo é adotar uma arquitetura que maximize a velocidade de desenvolvimento para o MVP, seja escalável e mantenha um alto nível de segurança.

## Decisão

Fica decidido que o **Talent Flow adotará uma arquitetura BaaS (Backend as a Service)**, onde a aplicação Angular funcionará como um "thick client", interagindo diretamente com os serviços do Firebase.

1.  **Comunicação Direta via SDK:** Os serviços do Angular (ex: `VacancyService`, `UserProfileService`) utilizarão o SDK oficial (`@angular/fire`) para realizar operações de leitura e escrita diretamente no Cloud Firestore. Não haverá uma API REST intermediária para as operações de CRUD padrão.

2.  **Lógica de Negócio no Frontend:** A lógica de orquestração de dados (ex: "quando um formulário é salvo, atualize estes três campos neste documento") residirá primariamente nos serviços do Angular.

3.  **Segurança Centralizada nas Firestore Rules:** A autorização e a validação de dados serão delegadas e garantidas pelas **Regras de Segurança do Firestore**. Estas regras, executadas nos servidores do Google, são a única fonte da verdade para o controle de acesso, garantindo que um usuário só possa ler/escrever os dados que tem permissão, independentemente do que o código do frontend tente fazer.

4.  **Lógica Server-Side via Cloud Functions:** Para processos que devem ser executados em um ambiente confiável, que são computacionalmente intensivos ou que precisam ser acionados por eventos de backend (como a análise de IA), utilizaremos **Cloud Functions**. Elas servem como o nosso "backend sob demanda".

## Consequências

**Positivas:**
* **Agilidade Máxima:** Esta é a principal vantagem. A equipe de frontend pode desenvolver funcionalidades completas de ponta a ponta sem depender da criação de novos endpoints de API, acelerando drasticamente a entrega de valor.
* **Custo-Efetividade e Escalabilidade:** A arquitetura é inerentemente serverless. Não há custos de manutenção de um servidor de API sempre ativo, e a infraestrutura escala automaticamente com a demanda, o que é ideal para um MVP.
* **Experiência em Tempo Real:** Facilita enormemente a criação de interfaces reativas que se atualizam em tempo real para os usuários, aproveitando os recursos nativos do Firestore.
* **Redução de Boilerplate:** Menos código para escrever e manter, já que uma camada inteira (a API REST de CRUD) é eliminada.

**Negativas:**
* **Segurança Dependente das Rules:** A segurança da aplicação torna-se **criticamente dependente** da correta e rigorosa implementação das Regras de Segurança do Firestore. Regras mal escritas podem expor dados sensíveis.
* **Lógica de Negócio Distribuída:** A lógica do sistema fica distribuída entre três locais: os serviços do Angular (lógica de cliente), as Regras do Firestore (lógica de segurança/validação) e as Cloud Functions (lógica de servidor). Isso pode tornar o raciocínio sobre o sistema completo mais complexo do que em uma API monolítica.
* **Acoplamento ao Fornecedor (Vendor Lock-in):** A lógica de negócio no frontend fica mais acoplada aos serviços e ao SDK do Firebase, tornando uma eventual migração para outro provedor de backend mais complexa no futuro.
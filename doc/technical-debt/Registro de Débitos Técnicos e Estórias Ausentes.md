### **Documento Atualizado: Registro de Débitos Técnicos**

**Data:** 14 de junho de 2025

**Status:** Concluído

#### **1. Contexto**

Durante a revisão da arquitetura e das estórias de usuário existentes, foram identificados alguns requisitos técnicos e de infraestrutura que são cruciais para a estabilidade, segurança e eficiência do ecossistema Talent Flow. Este documento formaliza e acompanha o status desses itens.

---

### ✅ **Débitos Planejados / Resolvidos**

Os seguintes itens foram discutidos e tiveram suas respectivas estórias de usuário criadas ou detalhadas. Eles agora estão formalmente no backlog para serem desenvolvidos.

1. **Detalhamento das Regras de Segurança (`TFLOW-003`)**
    
    - **Status:** Resolvido
    - **Resolução:** A estória `TFLOW-003` foi atualizada com regras de segurança granulares para cada coleção do Firestore. A nova versão fornece clareza total para a equipe de desenvolvimento sobre as permissões de leitura e escrita.
2. **Pipeline de Integração e Deploy Contínuo (`TFLOW-004`)**
    
    - **Status:** Planejado
    - **Resolução:** A estória de usuário `TFLOW-004` foi criada e detalhada, definindo os requisitos para os pipelines de CI/CD de cada repositório do projeto usando GitHub Actions.
3. **Pacote de Tipos Compartilhados (`TFLOW-005`)**
    
    - **Status:** Planejado
    - **Resolução:** A estória de usuário `TFLOW-005` foi criada para formalizar a criação do pacote NPM privado `@talent-flow/shared-types`, um requisito essencial da arquitetura Poly-Repo.
4. **Tratamento de Falhas na Fila de Mensagens (`TFLOW-022`)**
    
    - **Status:** Planejado
    - **Resolução:** A estória de usuário `TFLOW-022` foi criada para detalhar a implementação de uma Dead-Letter Queue (DLQ) no Google Cloud Pub/Sub, garantindo a resiliência do sistema de processamento de currículos.
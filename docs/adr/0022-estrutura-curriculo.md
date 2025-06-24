# **ADR-0022: Estrutura de Dados para Currículos e Snapshots de Aplicação**

**Status:** Aceito

**Data:** 2025-06-22

#### **1. Contexto**

O sistema de recrutamento do Talent Flow precisa de uma maneira robusta para gerenciar os perfis (currículos) dos candidatos. As principais forças que influenciam esta decisão são:

* **Integridade Histórica:** Para um processo de avaliação justo e rastreável, o recrutador deve visualizar a versão exata do currículo que o candidato submeteu para uma vaga específica, mesmo que o candidato atualize seu perfil mestre posteriormente.
* **Performance da UI:** A tela de listagem de candidatos (`CandidateListComponent`) precisa ser rápida e responsiva. Carregar o currículo completo de dezenas de candidatos nesta tela causaria latência e uma má experiência do usuário.
* **Modelo de Custos do Firestore:** O Firestore fatura por leitura, escrita e armazenamento de documentos. Uma arquitetura que armazena ou lê dados desnecessariamente (como múltiplos currículos completos em uma lista) resultará em custos mais elevados.
* **Riqueza de Dados:** Conforme o exemplo em `src/app/models/resume.model.ts`, o currículo não é um texto simples, mas sim um objeto estruturado com seções detalhadas sobre experiência profissional, formação, competências e o impacto gerado em cada atividade.
* **Inteligência Artificial:** O sistema deve ser projetado para suportar uma camada de IA que irá classificar, analisar e extrair tags dos currículos, e os resultados dessa análise precisam ser armazenados de forma contextual.

#### **2. Decisão**

Decidimos adotar uma arquitetura de **duas coleções separadas no Firestore** para gerenciar os dados dos currículos, dissociando o perfil "vivo" do candidato do "snapshot" imutável da aplicação.

1.  **Coleção `resumes` (Currículo Mestre):**
  * Será a coleção raiz para armazenar os perfis editáveis pelos usuários.
  * O ID de cada documento será o `userId` do candidato (o mesmo do Firebase Auth).
  * Este documento conterá a estrutura completa e rica do currículo, incluindo detalhes de experiências profissionais, formação, etc. Esta é a "fonte da verdade" para o perfil do candidato.

2.  **Coleção `resumeSnapshots` (Snapshot da Aplicação):**
  * Será uma coleção raiz para armazenar cópias imutáveis do currículo no momento da aplicação a uma vaga.
  * Quando um candidato se aplica, uma cópia exata do seu documento `Resume` é criada e salva como um novo documento nesta coleção.
  * Este novo documento `ResumeSnapshot` incluirá metadados adicionais:
    * `originalCandidateId`: Referência de volta para o `userId`.
    * `hash`: Um hash (SHA-256) gerado a partir do conteúdo do objeto `Resume`. Este campo é crucial para **evitar a criação de snapshots duplicados**. Se um candidato se aplicar a outra vaga sem ter alterado seu currículo, o sistema reutilizará o snapshot existente que possui o mesmo hash.
    * `aiClassification`: Um objeto que armazenará os resultados da análise da IA, vinculados a esta versão específica do currículo.

3.  **Fluxo de Ligação:** O documento `CandidateApplication` (localizado na subcoleção `vacancies/{vacancyId}/candidates`) não conterá o currículo. Em vez disso, ele armazenará apenas um `resumeSnapshotId`, que é o ID do documento relevante na coleção `resumeSnapshots`.

#### **3. Consequências**

**Positivas:**

* **Alta Performance:** A tela de listagem de candidatos (`CandidateListComponent`) buscará apenas os documentos `CandidateApplication`, que são leves e não contêm o currículo completo, garantindo um carregamento rápido.
* **Garantia de Integridade:** O processo de avaliação é sempre baseado na versão exata do currículo submetido, eliminando ambiguidades.
* **Otimização de Custos:** O mecanismo de `hash` minimiza drasticamente a duplicação de dados, reduzindo os custos de escrita e armazenamento no Firestore. As leituras também são mais baratas, pois os dados pesados são carregados apenas sob demanda (ao visualizar o perfil completo).
* **Escalabilidade e Manutenibilidade:** A separação clara de responsabilidades entre as coleções torna o sistema mais fácil de entender, manter e evoluir. A lógica de classificação da IA, por exemplo, pode operar de forma isolada nos `resumeSnapshots` sem impactar o perfil principal do usuário.

**Negativas:**

* **Complexidade de Lógica na Aplicação:** A lógica de negócio para a ação "Aplicar à Vaga" se torna mais complexa. Ela agora envolve: buscar o currículo mestre, gerar um hash, consultar a existência deste hash na coleção de snapshots e, condicionalmente, criar um novo snapshot antes de criar a aplicação.
* **Gerenciamento de Duas Coleções:** Os desenvolvedores precisam estar cientes da existência e do propósito de ambas as coleções (`resumes` e `resumeSnapshots`) e da relação entre elas para evitar inconsistências.

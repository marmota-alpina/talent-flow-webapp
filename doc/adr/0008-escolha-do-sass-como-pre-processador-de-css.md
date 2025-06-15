# ADR 0008: Escolha do SASS como Pré-processador de CSS

**Status:** Decidido

**Data:** 2025-06-14

## Contexto

Para o desenvolvimento do projeto Talent Flow, precisamos definir a linguagem base de estilização. A decisão arquitetural primária é o uso do Tailwind CSS (conforme ADR-0007) para uma abordagem "utility-first". No entanto, precisamos decidir se os arquivos de estilo serão em CSS padrão (`.css`) ou utilizarão um pré-processador como o SASS (`.scss`).

As alternativas são:
1.  **CSS Padrão:** Vantajoso pela simplicidade, ausência de dependências extras e alinhamento total com os padrões da web. No entanto, pode ser limitante em cenários de estilização mais complexos que não são cobertos por utilitários, como a organização de estilos globais ou a manipulação de temas.
2.  **SASS/SCSS:** Um pré-processador robusto e maduro, com suporte nativo no Angular CLI. Oferece funcionalidades avançadas como aninhamento de seletores (nesting), variáveis, mixins e uma melhor modularização de arquivos (`@use`), que podem ser extremamente úteis para organizar o código e resolver problemas complexos.

## Decisão

Decidimos utilizar **SASS (especificamente a sintaxe SCSS, com arquivos `.scss`)** como o pré-processador de CSS para o projeto. O Tailwind CSS será integrado ao fluxo de trabalho do SASS, com suas diretivas (`@tailwind`, `@layer`) sendo incluídas no arquivo principal `styles.scss`.

A filosofia principal continuará sendo "utility-first". As funcionalidades do SASS serão empregadas de forma estratégica, não como a principal forma de estilizar componentes, mas sim como uma ferramenta de apoio para:
* Organizar os estilos globais e as camadas do Tailwind.
* Estilizar componentes de bibliotecas de terceiros, quando necessário.
* Criar mixins para lógicas de estilo complexas e reutilizáveis que não se encaixam bem como utilitários.
* Aninhar seletores para melhorar a legibilidade em casos específicos, como seletores de pseudo-classes ou temas.

## Consequências

**Positivas:**
* **Flexibilidade e Poder:** A equipe tem à disposição um conjunto de ferramentas completo. Usa a velocidade do Tailwind para o dia a dia e o poder do SASS para os desafios complexos, sem limitações.
* **Organização Superior:** O aninhamento e o sistema de módulos (`@use`) do SASS permitem uma organização mais limpa e legível da base de código de estilos, especialmente para os estilos globais.
* **Integração Nativa e Sem Atrito:** O Angular CLI gerencia a compilação do SASS de forma transparente, não adicionando complexidade ao fluxo de trabalho do desenvolvedor.
* **Abordagem à Prova de Futuro:** Garante que a equipe terá as ferramentas necessárias para lidar com qualquer requisito de estilização que surja, por mais complexo que seja.

**Negativas:**
* **Dependência Adicional:** Adiciona `sass` como uma dependência de desenvolvimento ao projeto (embora seja um padrão em projetos Angular).
* **Risco de Mau Uso:** Exige disciplina da equipe para não abusar das funcionalidades do SASS (ex: criar hierarquias de aninhamento muito profundas), o que poderia contrariar a filosofia "utility-first" e gerar um CSS de difícil manutenção. A regra deve ser "Tailwind primeiro, SASS quando necessário".
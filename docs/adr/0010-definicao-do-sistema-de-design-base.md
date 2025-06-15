# ADR 0010: Definição do Sistema de Design Base e da Estrutura Visual

**Status:** Decidido

**Data:** 2025-06-14

## Contexto

Para garantir que o Talent Flow seja uma plataforma profissional, confiável e fácil de usar, é imperativo estabelecer um Sistema de Design (Design System) coeso desde o início. A ausência de um sistema definido resulta em inconsistência visual, má experiência do usuário (UX) e lentidão no desenvolvimento, pois as decisões de design são tomadas de forma isolada para cada nova tela ou componente.

O objetivo é definir uma base visual (cores, fontes) e de interação que sirva como um "guia de estilo" para toda a aplicação.

## Decisão

Fica definido o seguinte Sistema de Design Base para o projeto Talent Flow:

1.  **Cor Primária:** Será utilizado o tom de azul **`#2563EB`**. Esta cor representa profissionalismo e confiança, e será o pilar da nossa identidade visual, aplicada em todos os elementos de ação e destaque.

2.  **Tipografia:** A fonte **"Inter"** será adotada para toda a interface. Sua clareza e variedade de pesos a tornam ideal para garantir a legibilidade em textos de interface, desde pequenos rótulos até títulos grandes. Será importada via Google Fonts.

3.  **Princípio de Estilização:** A implementação deste sistema será feita através do **Tailwind CSS** (conforme ADR-0007). As cores, fontes e escala de espaçamento serão configuradas no arquivo `tailwind.config.js` para criar um conjunto de utilitários consistentes com nosso Design System.

4.  **Estrutura de Layout Padrão:** Será utilizado um componente de layout principal (`MainLayoutComponent`) para encapsular as páginas, garantindo que elementos como o cabeçalho e o rodapé sejam consistentes em toda a experiência do usuário logado.

5.  **Padrão de Interação:** Todos os elementos interativos (inputs, botões, links) devem ter estados visuais claros para `hover` (interação iminente) e `focus` (elemento ativo), utilizando a cor primária para um feedback inequívoco, o que é crucial para a acessibilidade.

## Consequências

**Positivas:**
* **Consistência e Profissionalismo:** A aplicação terá uma aparência coesa e profissional, fortalecendo a confiança do usuário na plataforma.
* **Eficiência no Desenvolvimento:** Desenvolvedores e designers trabalharão com um conjunto de regras e componentes predefinidos, acelerando a criação de novas interfaces.
* **Manutenibilidade Aprimorada:** Alterações globais na identidade visual (ex: ajustar o tom de azul) podem ser feitas de forma centralizada no `tailwind.config.js`, propagando-se por toda a aplicação.
* **Melhora na Usabilidade e Acessibilidade:** A consistência e o feedback visual claro (especialmente nos estados de foco) tornam a aplicação mais fácil e acessível para todos os usuários.

**Negativas:**
* **Configuração Inicial:** Exige um esforço inicial para configurar corretamente o `tailwind.config.js` com os tokens de design (cores, fontes) e para importar a fonte escolhida.
* **Restrição Criativa (Intencional):** A equipe deve aderir ao sistema de design estabelecido em vez de introduzir estilos pontuais, o que exige disciplina para manter a integridade visual do projeto a longo prazo.
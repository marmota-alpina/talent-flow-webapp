### **Estória de Usuário: Layout Principal e Sistema de Design**

**ID da Estória:** TFLOW-010 **Feature:** UI/UX Foundation **Pontos de Estória (Estimativa):** 8

- **Como um:** Usuário da plataforma Talent Flow (candidato, recrutador ou admin).
- **Eu quero:** Navegar em uma interface visualmente agradável, consistente e intuitiva, com fontes claras, cores modernas e interações previsíveis em qualquer dispositivo que eu utilize.
- **Para que:** Minha experiência seja eficiente e positiva, permitindo que eu me concentre em minhas tarefas (seja preenchendo meu currículo ou analisando perfis) sem distrações ou dificuldades de usabilidade.

### **Critérios de Aceitação (AC)**

#### **AC1: Paleta de Cores e Identidade Visual**

- A cor primária do sistema será um tom de azul moderno e elegante: **`#2563EB`** (equivalente a `blue-600` no Tailwind CSS). Esta cor será usada para links, botões primários, destaques de foco e outros elementos interativos.
- Uma paleta de cores secundária baseada em tons de cinza neutros (`slate` ou `gray` do Tailwind) será usada para textos, fundos e bordas, garantindo alto contraste e legibilidade.
- Cores semânticas para estados de feedback serão definidas: verde para sucesso, amarelo para alerta e vermelho para erro.

#### **AC2: Tipografia Moderna e Legível**

- A família de fontes principal para toda a aplicação será a **"Inter"**, importada do Google Fonts. Esta fonte foi escolhida por sua excelente legibilidade em diversos tamanhos e pesos.
- O corpo do texto terá um tamanho base de `16px` em desktops, com um sistema de escala tipográfica responsivo para títulos (`h1`, `h2`, `h3`, etc.).

#### **AC3: Estrutura do Layout Principal**

- Um componente `MainLayoutComponent` (`main-layout.component.ts`) será o container principal para as páginas da aplicação após o login.
- Este layout conterá um **cabeçalho (navbar)** fixo no topo, com o logo do Talent Flow, links de navegação principais (ex: "Meu Currículo", "Vagas") e uma área de perfil do usuário com opções de logout.
- Haverá uma área de conteúdo principal onde os componentes de cada página serão renderizados.

#### **AC4: Usabilidade de Componentes de Formulário**

- Todos os componentes de entrada (`input`, `select`, `textarea`) devem seguir um design consistente, conforme definido em `styles.sass` (ex: classe `.form-input`).
- **Feedback de Interação:**
    - **Hover:** Os componentes devem ter uma sutil alteração visual (ex: borda levemente mais escura) ao passar o mouse.
    - **Focus:** Ao receber foco (clique ou navegação por teclado), os componentes devem exibir um anel de destaque visível utilizando a cor primária azul (ex: `ring-2 ring-offset-2 ring-blue-500`), garantindo a acessibilidade.
- **Validação Reativa:** Os formulários devem ser reativos (`ReactiveFormsModule`) e exibir feedback de validação em tempo real. Um campo inválido após a interação do usuário deve ser destacado com uma borda vermelha.

#### **AC5: Responsividade (Mobile-First)**

- Todo o layout e componentes devem ser construídos com uma abordagem **mobile-first**.
- A interface deve ser totalmente funcional e esteticamente agradável em telas pequenas (a partir de 360px de largura), médias (tablets) e grandes (desktops).
- O cabeçalho (navbar) deve se transformar em um menu "hambúrguer" colapsável em telas menores para economizar espaço.
- As grades e layouts de conteúdo devem se adaptar, reorganizando os elementos de forma fluida conforme o tamanho da tela.
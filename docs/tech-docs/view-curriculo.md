Documentação Técnica: Página de Visualização de Currículo

Este documento serve como guia para a construção da página de visualização do currículo do candidato, com base no protótipo validado (resume_view_prototype).

1. Visão Geral e Objetivo da Página
   A página de Visualização de Currículo é o perfil público do candidato dentro da plataforma. Seu principal objetivo é apresentar as informações profissionais do usuário de forma clara, profissional e agradável, facilitando a análise por parte de recrutadores.

O layout escolhido, com uma coluna lateral fixa à esquerda e uma linha do tempo de experiências à direita, foi projetado para:

Manter o Foco: A informação de contato e os dados principais do candidato (na coluna esquerda) permanecem sempre visíveis, enquanto o recrutador explora a trajetória profissional.

Contar uma História: A linha do tempo organiza as experiências de forma cronológica e lógica, facilitando a compreensão da evolução da carreira do candidato.

Ação Principal Clara: O botão "Editar Currículo" é o principal call-to-action da página, permitindo ao usuário acessar facilmente o modo de edição.

2. Guia de Estilo e Elementos Visuais
   A implementação deve seguir estritamente o sistema de design estabelecido no projeto.

Paleta de Cores:

Primária (primary): #2563EB - Usada para links, botões principais, ícones e destaques de títulos. Representa a identidade da marca.

Secundária (secondary): #F3F4F6 - Cor de fundo principal da página, para criar um contraste suave com os cards.

Accent (accent): #14B8A6 - Usada para ações secundárias importantes, como o botão "+ Adicionar" no formulário.

Sucesso (success): #10B981 - Usada para feedback positivo, como o botão "Finalizar" e ícones de conclusão.

Texto: A maior parte do texto utiliza tons de gray (text-gray-900, text-gray-800, text-gray-600, etc.) para criar uma hierarquia visual clara.

Tipografia:

Fonte Principal: Inter. Deve ser aplicada em todo o body.

Hierarquia: A hierarquia de texto deve ser respeitada (títulos h1, h2, h3 com tamanhos e pesos diferentes) para garantir a escaneabilidade da página.

Ícones:

A biblioteca Font Awesome deve ser utilizada para todos os ícones (fas fa-pencil-alt, fab fa-linkedin, etc.).

Componentes Visuais:

Cards: As seções são organizadas em cards brancos (bg-white) com rounded-lg e shadow-sm para criar uma separação visual clara.

Tags: Tecnologias e Soft Skills são exibidas como tags (span) com cantos arredondados (rounded-full) e cores de fundo sutis (bg-blue-100, bg-green-100) para categorização visual.

Timeline: Utiliza uma linha vertical e ícones para marcar cada experiência, criando um fluxo visual cronológico.

3. Layout e Posicionamento
   Grid Principal: A página é estruturada em um grid de duas colunas em telas grandes (lg e acima) usando as classes do Tailwind CSS: grid grid-cols-1 lg:grid-cols-4 gap-8.

Coluna Lateral (Esquerda):

Ocupa uma de quatro colunas (lg:col-span-1).

Contém um div interno com as classes sticky top-28, garantindo que o conteúdo da barra lateral permaneça fixo durante a rolagem da página principal.

Coluna Principal (Direita):

Ocupa três de quatro colunas (lg:col-span-3).

Contém a linha do tempo das experiências.

A linha do tempo é construída com CSS customizado para posicionar a linha vertical e os ícones (timeline::before e .timeline-item .timeline-icon).

4. Diretrizes de Implementação (Angular 20+)
   A construção do componente em Angular deve seguir as regras de modernidade e performance do projeto.

Componente Standalone: O componente de visualização (ex: ResumeViewComponent) deve ser standalone: true, importando diretamente suas dependências.

@Component({
standalone: true,
imports: [CommonModule, RouterLink], // CommonModule para @if, @for
// ...
})
export class ResumeViewComponent { }

Fluxo de Controle com @: O template deve usar exclusivamente @if para renderizar seções condicionalmente (ex: @if (resume()) { ... }) e @for para renderizar as listas de experiências, formações e idiomas.

Reatividade com Signals: O componente deve receber os dados do currículo como um signal. Isso pode vir de um resolver da rota ou ser passado como @Input de um componente pai.

import { signal, Input } from '@angular/core';

// ...
resume = signal<Resume | null>(null);

@Input() set data(value: Resume) {
this.resume.set(value);
}

Ambiente Zoneless e OnPush:

O componente deve usar changeDetection: ChangeDetectionStrategy.OnPush.

Graças ao uso de signals, a view será atualizada de forma performática e automática sempre que o signal do currículo for preenchido com novos dados, sem a necessidade do zone.js.

Navegação: O botão "Editar Currículo" deve ser um link que utiliza routerLink para navegar para a rota de edição. Como a edição é sempre do próprio usuário logado, não é necessário passar um ID como parâmetro.

<a routerLink="/meu-curriculo/editar" class="...">
    Editar Currículo
</a>

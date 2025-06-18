import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Definição das rotas do lado do servidor.
 * Aqui especificamos como cada rota deve ser tratada:
 * - RenderMode.Prerender: A rota é pré-renderizada em um arquivo HTML estático durante o build.
 * - RenderMode.SSR: A rota é renderizada no servidor sob demanda quando um usuário a solicita.
 */
export const serverRoutes: ServerRoute[] = [
  // 1. Rotas estáticas que serão pré-renderizadas
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'login', renderMode: RenderMode.Prerender },
  { path: 'dashboard', renderMode: RenderMode.Prerender },
  { path: 'meu-curriculo', renderMode: RenderMode.Prerender },
  { path: 'vagas', renderMode: RenderMode.Prerender },
  { path: 'gerenciar-vagas', renderMode: RenderMode.Prerender },
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];

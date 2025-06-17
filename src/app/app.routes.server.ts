import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Função assíncrona para gerar parâmetros de rota dinâmicos.
 * Para o Angular saber quais rotas dinâmicas pré-renderizar, você precisaria
 * retornar os parâmetros aqui (ex: [{ id: '1' }, { id: '2' }]).
 * Retornar um array vazio para rotas com parâmetros (como ':id') informa
 * ao Angular para não pré-renderizar essas rotas específicas, tratando-as como SSR.
 */
async function getPrerenderParams(route: string): Promise<Record<string, string>[]> {
  // Para rotas dinâmicas (que contêm : ou *), retornamos um array vazio
  // para indicar que elas devem ser renderizadas no servidor (SSR) e não pré-renderizadas.
  if (route.includes(':') || route.includes('*')) {
    return [];
  }
  // Para rotas estáticas, retornamos um array com um objeto vazio
  // para indicar que a rota em si deve ser pré-renderizada.
  return [{}];
}

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

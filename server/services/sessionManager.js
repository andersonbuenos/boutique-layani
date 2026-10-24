/**
 * GERENCIADOR DE SESSÕES & MEMÓRIA CONTEXTUAL
 * Especialista: Cipher (Backend, Segurança & Regras de Negócio)
 * 
 * Garante isolamento estrito de memória entre clientes diferentes,
 * permitindo continuidade de diálogo, resolução de referências e pré-pedidos.
 */

const sessoes = new Map();

export function obterSessao(sessionId = 'default') {
  const id = String(sessionId || 'default');
  if (!sessoes.has(id)) {
    sessoes.set(id, {
      id,
      ultimoProdutoId: null,
      ultimoTamanho: null,
      aguardandoTamanhoProdutoId: null,
      carrinho: [],
      ultimaIntencao: null,
      criadoEm: Date.now(),
      atualizadoEm: Date.now(),
    });
  }
  const sessao = sessoes.get(id);
  sessao.atualizadoEm = Date.now();
  return sessao;
}

export function atualizarSessao(sessionId = 'default', atualizacoes = {}) {
  const sessao = obterSessao(sessionId);
  Object.assign(sessao, atualizacoes, { atualizadoEm: Date.now() });
  return sessao;
}

export function limparSessao(sessionId = 'default') {
  const id = String(sessionId || 'default');
  sessoes.delete(id);
}

export function redefinirTodasSessoes() {
  sessoes.clear();
}
